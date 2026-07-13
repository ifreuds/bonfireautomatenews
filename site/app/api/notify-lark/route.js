import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Per-newsletter config: which webhook env to use, the URL path, and card chrome.
const NEWSLETTERS = {
  cloud: {
    webhookEnv: 'LARK_WEBHOOK_URL',
    pathPrefix: '/issue/',
    emoji: '🔥',
    note: 'Curated by Bonfire — your Tencent Cloud partner in SEA.',
  },
  games: {
    webhookEnv: 'LARK_WEBHOOK_URL_GAMES',
    pathPrefix: '/games/issue/',
    emoji: '🎮',
    note: 'Curated by Bonfire — games publishing & operations across SEA.',
  },
  // Approval-track games newsletter (MCP pipeline). Reuses the games Lark webhook;
  // links point at the /games-review pages so it stays separate from the legacy feed.
  'games-review': {
    webhookEnv: 'LARK_WEBHOOK_URL_GAMES',
    pathPrefix: '/games-review/issue/',
    emoji: '🎮',
    note: 'Curated by Bonfire — games publishing & operations across SEA.',
  },
};

// POST /api/notify-lark
// Body: { "date": "YYYY-MM-DD", "token": "<NOTIFY_SECRET>", "newsletter": "cloud"|"games" }
// newsletter defaults to "cloud" (backward compatible). If date omitted, uses the latest published issue.
export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { date, token } = body || {};
    const newsletter = (body && body.newsletter) || 'cloud';
    const cfg = NEWSLETTERS[newsletter];

    // Simple shared-secret auth so randoms can't trigger Lark posts.
    if (!process.env.NOTIFY_SECRET || token !== process.env.NOTIFY_SECRET) {
      return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }
    if (!cfg) {
      return Response.json({ ok: false, error: `unknown newsletter: ${newsletter}` }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    let q = supabase
      .from('issues')
      .select('issue_date, title, content_json')
      .eq('status', 'published')
      .eq('newsletter', newsletter)
      .order('issue_date', { ascending: false })
      .limit(1);
    if (date) q = supabase
      .from('issues')
      .select('issue_date, title, content_json')
      .eq('status', 'published')
      .eq('newsletter', newsletter)
      .eq('issue_date', date)
      .limit(1);

    const { data, error } = await q;
    if (error || !data || data.length === 0) {
      return Response.json({ ok: false, error: 'issue not found' }, { status: 404 });
    }

    const issue = data[0];
    const c = issue.content_json || {};
    const base = process.env.SITE_BASE_URL || '';
    const issueUrl = `${base}${cfg.pathPrefix}${issue.issue_date}`;

    // Build a scannable card: short top story, then every story as its own
    // clickable headline (links straight to the source article), grouped by section.
    const top = c.top_story || {};
    const elements = [];

    if (c.intro) {
      elements.push({ tag: 'div', text: { tag: 'lark_md', content: c.intro } });
    }
    if (top.headline) {
      const topUrl = top.url || issueUrl;
      const topWhy = top.why_it_matters ? `\n\n*${top.why_it_matters}*` : '';
      elements.push({
        tag: 'div',
        text: { tag: 'lark_md', content: `**★ TOP STORY**\n**[${top.headline}](${topUrl})**\n${top.summary || ''}${topWhy}` },
      });
    }
    elements.push({ tag: 'hr' });

    (c.sections || []).forEach((s) => {
      const stories = (s.stories || []).map((st) => {
        const u = st.url || issueUrl;
        const why = st.why_it_matters ? `\n${st.why_it_matters}` : '';
        return `**[${st.headline}](${u})**${why}`;
      }).join('\n\n');
      if (stories) {
        elements.push({ tag: 'div', text: { tag: 'lark_md', content: `**${s.theme}**\n\n${stories}` } });
      }
    });

    elements.push({ tag: 'hr' });
    elements.push({
      tag: 'action',
      actions: [
        { tag: 'button', text: { tag: 'plain_text', content: '📖 Open the full issue' }, type: 'primary', url: issueUrl },
      ],
    });
    elements.push({ tag: 'note', elements: [{ tag: 'plain_text', content: cfg.note }] });

    const card = {
      msg_type: 'interactive',
      card: {
        config: { wide_screen_mode: true },
        header: {
          template: 'orange',
          title: { tag: 'plain_text', content: `${cfg.emoji} ${issue.title}` },
        },
        elements,
      },
    };

    const webhook = process.env[cfg.webhookEnv];
    if (!webhook) {
      return Response.json({ ok: false, error: `${cfg.webhookEnv} not set` }, { status: 500 });
    }

    const larkRes = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card),
    });
    const larkBody = await larkRes.json().catch(() => ({}));

    return Response.json({ ok: true, newsletter, issue: issue.issue_date, lark: larkBody });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
