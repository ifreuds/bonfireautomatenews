# pipeline/

**These two files are the newsletter's actual logic.** There is no scraper code — an AI agent reads one of these prompts on a schedule and does the whole job: research → draft → render HTML → write to Supabase → trigger the Lark notification.

| File | Runs | Newsletter |
|---|---|---|
| `games-daily.SKILL.md` | 07:33 ICT daily | SEA Games Daily (business column) |
| `cloud-daily.SKILL.md` | 07:00 ICT daily | SEA Cloud Weekly (daily rehearsal) |

## ⚠️ Secrets are redacted
`${NOTIFY_SECRET}` is a **placeholder**. The real value is injected where the prompt actually runs — never commit it (this repo is public).

## ⚠️ These are copies — the live ones run from elsewhere
The scheduler executes the copies at:
```
~/.claude/scheduled-tasks/bonfire-sea-games-daily/SKILL.md
~/.claude/scheduled-tasks/bonfire-sea-cloud-daily/SKILL.md
```
Edit there and mirror here (or vice-versa) until the brief moves into the app.

## Where this is heading
These instructions being *inside the AI* is exactly what ties the project to one AI vendor. In the approval platform they move **into the app**, served to any AI over MCP via `get_brief()` — see `wiki/approval-platform-mvp.md`. Then this folder becomes history.
