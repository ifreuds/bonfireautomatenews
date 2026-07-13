# Handoff — Bonfire Newsletter (for the person taking over design & hosting)

*A 5-minute read. You don't need to understand the AI parts to host this or to design it — this doc tells you the two things you own (the look, the hosting) and hands off the rest.*

---

## 1. What this is

An **automated newsletter platform** for Bonfire. An AI reads trusted games-industry sources, writes a Southeast-Asia business issue (in English **and** Chinese), and submits it. A human approves it. On approval it appears on the website and can be pushed to chat channels (Lark today; Email/Line/WeChat planned).

Two newsletters run on the same codebase: **SEA Games Daily** (the active one) and **SEA Cloud Weekly** (older, internal-leaning).

The site is a normal **Next.js web app on Vercel**, backed by **Supabase** (Postgres + image storage). Nothing exotic.

## 2. How it works (one picture)

```
  AI worker ──▶ approval gate ──▶ website (Vercel) ──▶ Lark / Email / Line / WeChat
 (writes it)   (a human says     (public reads only
               "publish")         published issues)
```

The AI never publishes anything itself. It can only submit a **draft** that waits for a human. That gate is enforced in the database, not just the UI (see `db/schema.sql`).

**Two pipelines exist right now — know this before you host:**

| | A. Daily auto-publisher (legacy, live) | B. Approval pipeline (new) |
|---|---|---|
| Who runs it | A scheduled AI task on a PC | An AI via the MCP server (`mcp/`) |
| What it does | Scrapes → **publishes straight to the web** + pushes Lark | Scrapes → submits a **draft** → human approves |
| Human in the loop? | **No** | **Yes** |
| Status written | `published` | `pending` → (human) `published` |

Both write to the same `issues` table keyed on (date, newsletter), so **if you run both for the same newsletter and date, A will overwrite B's approved issue.** Keep them apart: give pipeline B its own `newsletter` value (e.g. `games-review`), or retire A once B is the real flow. This is the main thing to resolve as the product matures.

## 3. What's built vs. what's a placeholder

| Area | State |
|---|---|
| Public site, issue pages (EN + `/cn`), image hosting | **Built, live, styled minimally** |
| The issue layout (hero, headline, summary, our-take, source, per story) | **Built** — one file: `site/lib/render-issue.js` |
| Approval gate (DB functions, tokens, draft invisibility) | **Built & tested** |
| MCP server the AI connects to | **Built & tested** (`mcp/`) |
| **Approval console** at `/console` | **Built & live** — password-gated; preview EN+CN, Approve, Publish & Send (fires Lark on publish). Functional, minimally styled. |
| Older admin mockup at `/admin/**` | **Skeleton only** — unstyled design reference wired to mock data; **not access-controlled** (see §6) |
| Channel variants (Email/Line/WeChat) | **Designed, not built** — see `MVP_Approval_Platform_Spec.md` |
| Company visual identity / CI | **Not started — this is your job** |

## 4. Where design plugs in

You mostly touch three things:

1. **`site/lib/render-issue.js`** — the entire look of an issue lives here (one React component, inline styles, a `UI` dictionary for EN/中文 labels). Restyle this and every issue, both languages, updates. This is the highest-leverage file for you.
2. **`site/app/admin/**`** — the approval backend. Today it's a clickable skeleton wired to mock data (`site/lib/skeleton-*.js`). It shows the intended screens (review queue, issue detail, channel variants, brief, log). Style it and wire it to the real admin functions (`admin_list_issues`, `admin_set_status`).
3. **Brand tokens** — colors/fonts are inline (look for `INK`, `ACCENT` in `render-issue.js`). Swap for Bonfire's palette.

Full screen-by-screen intent is in **`MVP_Approval_Platform_Spec.md`**.

## 5. Host it on your own Supabase + Vercel

Right now it runs on a **personal** Supabase + Vercel. To move it to company infra:

**Supabase**
1. Create a new project.
2. SQL Editor → paste and run **`db/schema.sql`** (creates every table, function, RLS policy, the image bucket).
3. Generate two secret tokens (`openssl rand -hex 24`) and insert them as the `agent` and `admin` rows (instructions at the bottom of the schema file).

**Vercel**
1. Import this repo, set the project root to **`site/`**.
2. Set these environment variables:

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable/anon key |
| `LARK_WEBHOOK_URL` | Lark bot webhook for the Cloud newsletter |
| `LARK_WEBHOOK_URL_GAMES` | Lark bot webhook for the Games newsletter |
| `NOTIFY_SECRET` | A shared secret guarding the notify endpoint |
| `SITE_BASE_URL` | Your deployed site URL (for links in the Lark card, and the console's send-on-publish) |
| `ADMIN_TOKEN` | The `admin` token from `api_tokens` — used **server-side only** by the approval console. Never `NEXT_PUBLIC_`. |
| `ADMIN_PASSWORD` | The password reviewers type to sign in to `/console`. |
| `AGENT_TOKEN` | The `agent` token from `api_tokens` — used **server-side only** by the `/api/agent-*` endpoints so the AI can submit drafts. Never `NEXT_PUBLIC_`. |
| `AGENT_SUBMIT_KEY` | *Optional.* If set, `/api/agent-submit` requires it. Leave unset to keep the endpoint open (draft-only, human-gated). |

3. Deploy. The public site works immediately. (Local dev: `cd site && npm install && npm run dev`.)

**The AI worker** has two ways in, both documented in `HANDOFF_AI.md`:
- **Stateless HTTP (recommended)** — point any web-capable agent at `<site>/api/agent-brief` and it self-serves: reads the brief, checks `/api/agent-archive`, and POSTs to `/api/agent-submit`. No local setup; the DB token stays server-side in `AGENT_TOKEN`.
- **Local MCP server** (`mcp/`) — for MCP-native runtimes; its token lives in `mcp/.token` (gitignored — never commit it).
In both cases the agent can only file a **pending** draft; it cannot publish.

## 6. Before you go public (known issues — fix these)

- **The real approval UI is `/console`** — password-gated, admin token stays server-side. Its login is a **basic** shared-password gate (fine for a small internal team over HTTPS); harden it (SSO/per-user accounts) before wider rollout, and change `ADMIN_PASSWORD` from the handoff default.
- **The older `/admin/**` mockup is public and unauthenticated** — it's mock data so it's harmless, but don't wire real publish actions into it; that's what `/console` is for.
- **Image uploads use a public-write storage policy** (`issue_images_anon_insert`) so the pipeline can upload with the anon key. For production, switch image uploads to a trusted server using the **service-role** key and drop that policy. (Flagged in `db/schema.sql`.)
- **Next.js is pinned at 14.2.5** — bump it; there are known advisories.
- **Two-pipeline collision** — see §2. Decide A-vs-B before relying on approvals.

## 7. Read more

- `index.md` → the wiki map. `wiki/` has one short page per topic (architecture, editorial spec, images, channels, decisions).
- `MVP_Approval_Platform_Spec.md` → the full app design (screens, data model, channels).
- `HANDOFF_AI.md` → the operating manual for the AI worker.
- `CLAUDE.md` → the working principles for anyone (human or AI) editing this repo.
