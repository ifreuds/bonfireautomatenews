// Server-side only. Calls a token-gated Supabase RPC using the admin token held
// in a server env var (ADMIN_TOKEN). This module must never be imported by a
// client component — the admin token would leak. Env vars without a NEXT_PUBLIC_
// prefix are not exposed to the browser, and every caller here runs on the server.
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function adminRpc(fn, args) {
  const res = await fetch(`${URL_}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { apikey: ANON, Authorization: `Bearer ${ANON}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    cache: 'no-store',
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${fn}: ${text}`);
  return text ? JSON.parse(text) : null;
}

export const ADMIN_TOKEN = () => process.env.ADMIN_TOKEN;
