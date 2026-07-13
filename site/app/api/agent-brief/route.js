// GET /api/agent-brief
// The single URL an agent reads to know its whole job. Self-contained: no repo,
// no local files, no config. Point any web-capable agent at this URL and say
// "read this and follow it."
export const dynamic = 'force-dynamic';

export async function GET() {
  const base = process.env.SITE_BASE_URL || 'https://bonfire-sea-cloud-newsletter.vercel.app';

  const brief = `# Bonfire SEA Games newsletter — agent instructions

You are an AI worker producing one issue of a Southeast Asia games-BUSINESS newsletter.
Follow these steps exactly. You do everything over HTTP — no files, no login. You
CANNOT publish; you submit a draft that a human approves. That is the finish line.

## Step 1 — see what's already covered (so you never repeat a story)
GET ${base}/api/agent-archive?newsletter=games-review
It returns { covered: [ { headline, url } ] }. Never submit a story whose URL, or
whose underlying event, is already in that list.

## Step 2 — research
Find recent Southeast Asia (Indonesia, Vietnam, Philippines, Thailand, Malaysia,
Singapore, Myanmar, Cambodia, Laos, Brunei) games-industry BUSINESS news:
deals, funding, M&A, licensing, publishing & operations, platforms/payments,
regulation, market data, and esports BUSINESS (sponsorship/media-rights/league
economics — not match scores).

Voice: Reuters / Economist business column — sharp, factual, a genuine passion for
games. The one-line strategic read on each story is OPPORTUNITY-FORWARD for SEA
(find the regional upside; never frame a development as a loss for the region).

## Step 3 — verify every story (this is strict)
- Publish date is within the last ~30 days. VERIFY it on the page itself
  (og:article:published_time, JSON-LD datePublished, or a visible dateline).
  If you cannot read a date on the page, DROP the story. Never trust a search snippet.
- The link returns HTTP 200 to an anonymous fetch. If it 403s/404s, DROP it.
- It is genuinely SEA and genuinely business (see Step 2), and not already covered.

## Hard exclusions — drop entirely
Gambling / i-gaming / betting (including a betting sponsor); 18+/adult; and
gamer-consumer news (patch notes, skins, reviews, guides, tier lists, storefront
discounts). Quality over volume: if the news is thin, submit FEWER stories. Never pad.

## Step 4 — write the issue in English AND Chinese
Build two objects with the SAME structure; translate only the human-readable text.
Keep url / source / published / image.url IDENTICAL between them.

content (English):
{
  "issue_date": "YYYY-MM-DD",
  "newsletter": "games-review",
  "title": "Bonfire SEA Games Daily — <D Month YYYY>",
  "intro": "1–2 sentences framing the issue.",
  "top_story": {
    "headline": "...",
    "url": "https://<original article>",
    "source": "<publication name>",
    "published": "YYYY-MM-DD",
    "summary": "2–3 sentences, business-first: who did what with whom, the numbers.",
    "why_it_matters": "one italic-style strategic read, opportunity-forward for SEA",
    "image": { "url": "<the article's og:image URL>", "credit": "Image: <source>" }
  },
  "sections": [ { "theme": "Deals & funding", "stories": [ { ...same fields as a story... } ] } ],
  "footer": {
    "about": "About Bonfire — We help games studios and publishers launch and operate across Southeast Asia: localization, distribution, payments, live-ops and market-entry support, hands-on from our in-house team.",
    "cta": "Looking to launch or scale a title in SEA? Let's talk — no pitch, just a conversation.",
    "sources_note": "Curated from public reporting. Links go to original sources."
  }
}

content_cn: the same object, every human-readable string translated to natural
Chinese (full-width punctuation，。：；“”——《》). Localize image.credit
(e.g. "图片来源：<source>"). Keep url/source/published/image.url identical.

IMAGES: just put the article's original og:image URL in image.url. Our server
downloads and re-hosts it for you — you do NOT upload anything. If a story has no
image, omit the "image" field. sections may be an empty array [] for a one-story issue.

## Step 5 — submit
POST ${base}/api/agent-submit
Content-Type: application/json
Body: { "title": <same as content.title>, "issue_date": "YYYY-MM-DD",
        "content": <the English object>, "content_cn": <the Chinese object>,
        "submitted_by": "<your name/model>" }

A success looks like { "ok": true, "id": "...", "status": "pending" }. That means
it is waiting in the human review console. You are DONE. Do not attempt to publish —
there is no way for you to, by design.

Report back: the top headline, how many stories, and anything you dropped and why.
`;

  return new Response(brief, {
    status: 200,
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
