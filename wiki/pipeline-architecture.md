# Pipeline architecture (how it works today)

The surprising part: **there is barely any traditional code.** Three things:

## 1. The "logic" is two English prompt files — not a program
The pipeline is an **AI agent on a schedule** that reads a prompt and does the work. No scraper code, no cron script.

- `C:\Users\ifreu\.claude\scheduled-tasks\bonfire-sea-cloud-daily\SKILL.md` (7:00 AM ICT)
- `C:\Users\ifreu\.claude\scheduled-tasks\bonfire-sea-games-daily\SKILL.md` (7:33 AM ICT)

Change the newsletter = edit that prompt. **The AI is the runtime.**
⚠️ These instructions being *inside the AI* is exactly what ties us to Claude. Moving them into the app (served via MCP `get_brief()`) is what makes the AI swappable → see [approval-platform-mvp](approval-platform-mvp.md).

## 2. The web app — the only real codebase — is a thin renderer
`Auto_BonfireNewsletter\site\` (Next.js, deployed to Vercel via CLI; GitHub `ifreuds/bonfirenews` holds an older copy):

```
app/page.js                     → cloud archive index (/)
app/issue/[date]/page.js        → cloud issue page
app/games/page.js               → games archive index (/games)
app/games/issue/[date]/page.js  → games issue page
app/api/notify-lark/route.js    → the ONE backend endpoint (builds + posts the Lark card)
lib/supabase.js                 → read-only Supabase client
```
Every page does *"SELECT the issue, dump its stored HTML on screen."* It holds no content and no logic.

## 3. Supabase is the backend
Project `pmspzrmowzuryhdjnoeo`. Tables `issues` + `story_archive` (dedup memory); Storage bucket `issue-images`.
**The "HTML body" is just the `content_html` column** — the AI generates it, the site injects it.

## Data flow
```
AI (scheduled) → research → draft JSON+HTML → write Supabase → curl /api/notify-lark → Lark card
                                                     ↑
                                     public site reads Supabase and renders
```

## The AI no longer writes HTML (games, since 2026-07-02)
It used to hand-write `content_html` every run — which meant the **layout was only ever as consistent as the model's last mood.** Now the games pipeline emits **structured data only** (`content_json`), and the app renders it through a template: `site/lib/render-issue.js`.

Per-story card: hero/thumbnail · linked headline · short summary · unlabelled italic take · source · date.
Top story gets a full-width hero; the rest get thumbnails. Missing image → clean text-only card.

**The layout now lives in the app, owned by the design team — not in the prompt.** `content_html` remains only as a fallback for legacy issues (and for the cloud newsletter, which still uses it).

**Today's problem:** the AI is *author **and** publisher*. It writes straight to the DB and fires Lark itself. No human gate. That's what the approval platform changes.

## Live
- Site: https://bonfire-sea-cloud-newsletter.vercel.app (`/games` for games)
- Hosting is currently Vercel, but the app is **hosting-agnostic** (any Node host).
