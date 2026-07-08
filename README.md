# Bonfire SEA Cloud Weekly — hosting site

Next.js app that serves newsletter issues from Supabase and notifies Lark.

## Routes
- `/` — archive index (all published issues)
- `/issue/[date]` — a single issue (renders stored HTML)
- `POST /api/notify-lark` — server posts a summary card + link to Lark. Body: `{ "date": "YYYY-MM-DD", "token": "<NOTIFY_SECRET>" }` (date optional → latest).

## Environment variables (set in Vercel)
| Var | Purpose | Public? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable key (read-only, RLS-guarded) | yes |
| `LARK_WEBHOOK_URL` | Lark custom-bot webhook | no (server only) |
| `NOTIFY_SECRET` | Shared secret to authorize /api/notify-lark | no |
| `SITE_BASE_URL` | This deployment's base URL, for issue links | no |

## How the daily pipeline uses this
The Cowork scheduled task (07:00 ICT) does: research → draft → write issue to Supabase → call `POST /api/notify-lark` with the secret. The site renders new issues automatically (no redeploy) because it reads Supabase live.
