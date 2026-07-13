// GET /api/agent-archive?newsletter=games-review
// Public: returns the stories already covered, so a stateless agent can dedup.
// The agent token stays server-side (AGENT_TOKEN) — never exposed.
export const dynamic = 'force-dynamic';

const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(req) {
  const newsletter = new URL(req.url).searchParams.get('newsletter') || 'games-review';
  try {
    const res = await fetch(`${SUPA}/rest/v1/rpc/agent_get_archive`, {
      method: 'POST',
      headers: { apikey: ANON, Authorization: `Bearer ${ANON}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_token: process.env.AGENT_TOKEN, p_newsletter: newsletter, p_days: 90 }),
      cache: 'no-store',
    });
    const text = await res.text();
    if (!res.ok) return Response.json({ ok: false, error: text }, { status: 500 });
    return Response.json({ ok: true, newsletter, covered: JSON.parse(text) });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
