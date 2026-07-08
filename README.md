# Bonfire Automated Newsletter

An **AI-written newsletter** for Bonfire. An agent scrapes trusted sources on a schedule, writes the issue, publishes it to a website, and posts a card to Lark. Two newsletters run today: **SEA Games Daily** (business column) and **SEA Cloud Weekly**.

We're now turning it into a platform where a small team **approves each issue** before it publishes and fans out to Lark / Email / Line / WeChat — each channel getting its own version of the copy and image.

## Live
- Cloud archive → https://bonfire-sea-cloud-newsletter.vercel.app
- Games archive → https://bonfire-sea-cloud-newsletter.vercel.app/games

## Repo layout
| Path | What it is |
|---|---|
| `site/` | The Next.js app — public pages + the `notify-lark` API route. **This is the only conventional codebase.** |
| `pipeline/` | The AI's prompts. **This is the actual newsletter logic** — there is no scraper code. Secrets redacted. |
| `wiki/` | Knowledge base: architecture, editorial spec, decisions log. |
| `index.md` | Map of `wiki/` — **start here**. |
| `raw/` | Drop zone for unprocessed source material (read-only to Claude). |
| `CLAUDE.md` | Execution principles + how the knowledge base is maintained. |
| `MVP_Approval_Platform_Spec.md` | Design doc for the approval app we're building. |
| `PRD_…md`, `M0_…md` | Original Phase 1 product docs. |

## How it works today
```
AI agent (scheduled) → research → draft JSON + HTML → write to Supabase
                                                          ↓
                     Lark card  ←  /api/notify-lark  ←  Next.js site reads Supabase
```
The AI is currently **author *and* publisher** — no human gate. The approval platform changes that: the app becomes the source of truth, the AI becomes a swappable drafting worker talking to it over MCP. See `wiki/approval-platform-mvp.md`.

## Running the site locally
```bash
cd site
npm install
cp .env.example .env.local   # fill in the values
npm run dev
```
Deployment is hosting-agnostic (any Node host). Today it's Vercel, deployed from `site/`.

## Secrets
Nothing secret is committed. `NOTIFY_SECRET`, the Lark webhook URLs and the Supabase keys live in the host's environment variables; the prompts in `pipeline/` use a `${NOTIFY_SECRET}` placeholder.

## Where to start reading
1. `index.md` → the map
2. `wiki/project-overview.md` → the assignment and current state
3. `wiki/pipeline-architecture.md` → how the machine actually works
