// POST /api/agent-submit
// The stateless "send news to our DB" endpoint. An agent that can make HTTP
// requests posts a finished issue here; it lands as PENDING for human approval.
// The agent NEVER sees the database token — it lives here (AGENT_TOKEN), server-side.
// Images: the agent just passes each story's original article image URL; this
// endpoint downloads and re-hosts them (best-effort) so nothing is hotlinked.
export const dynamic = 'force-dynamic';

const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const REHOSTED = '/storage/v1/object/public/issue-images/';

function stories(content) {
  const out = [];
  if (content?.top_story) out.push(['top', content.top_story]);
  (content?.sections || []).forEach((sec, si) =>
    (sec.stories || []).forEach((st, i) => out.push([`s${si + 1}_${i + 1}`, st]))
  );
  return out;
}

async function rehost(src, date, slot) {
  try {
    const r = await fetch(src, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!r.ok) return null;
    const type = r.headers.get('content-type') || '';
    if (!/^image\//.test(type)) return null;
    const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : type.includes('gif') ? 'gif' : 'jpg';
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length > 5 * 1024 * 1024) return null;
    const path = `games-review/${date}/${slot}.${ext}`;
    const up = await fetch(`${SUPA}/storage/v1/object/issue-images/${path}`, {
      method: 'POST',
      headers: { apikey: ANON, Authorization: `Bearer ${ANON}`, 'Content-Type': type, 'x-upsert': 'true' },
      body: buf,
    });
    if (!up.ok) return null;
    return `${SUPA}${REHOSTED}${path}`;
  } catch {
    return null;
  }
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));

  // Optional shared key — off by default (open for now). Set AGENT_SUBMIT_KEY to require it.
  if (process.env.AGENT_SUBMIT_KEY && body.key !== process.env.AGENT_SUBMIT_KEY) {
    return Response.json({ ok: false, error: 'bad key' }, { status: 401 });
  }

  const { title, issue_date, content } = body;
  const content_cn = body.content_cn || null;
  const newsletter = body.newsletter || 'games-review';
  if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(issue_date || '') || !content) {
    return Response.json({ ok: false, error: 'need title, issue_date (YYYY-MM-DD), content' }, { status: 400 });
  }

  // Re-host every external story image; map source→hosted so EN + CN stay in sync.
  const map = {}; let rehosted = 0, failed = 0;
  for (const [slot, st] of stories(content)) {
    const src = st?.image?.url;
    if (!src || src.includes(REHOSTED)) continue;
    const nu = await rehost(src, issue_date, slot);
    if (nu) { map[src] = nu; st.image.url = nu; rehosted++; }
    else { delete st.image; failed++; }
  }
  if (content_cn) for (const [, st] of stories(content_cn)) {
    const src = st?.image?.url;
    if (!src) continue;
    if (map[src]) st.image.url = map[src];
    else if (!src.includes(REHOSTED)) delete st.image;
  }

  const res = await fetch(`${SUPA}/rest/v1/rpc/agent_submit_draft`, {
    method: 'POST',
    headers: { apikey: ANON, Authorization: `Bearer ${ANON}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      p_token: process.env.AGENT_TOKEN, p_newsletter: newsletter, p_issue_date: issue_date,
      p_title: title, p_content: content, p_content_cn: content_cn,
      p_submitted_by: body.submitted_by || 'ai-agent (via /api/agent-submit)',
    }),
  });
  const text = await res.text();
  if (!res.ok) return Response.json({ ok: false, error: text }, { status: 500 });

  return Response.json({
    ok: true, id: JSON.parse(text), status: 'pending', newsletter,
    images: { rehosted, failed },
    note: 'Draft filed. A human must approve it in /console before anything publishes. You cannot publish.',
  });
}
