# Wiki index

Master map of `wiki/`. **Read this first**, then open only the pages you need.

## Start here
- [project-overview](wiki/project-overview.md) — the assignment, where we are, what's left to deliver.
- [decisions-log](wiki/decisions-log.md) — every settled decision, dated, newest first.

## How it works today
- [web-flow](wiki/web-flow.md) — **the full flow chart**: AI drafts → you approve in /console → publishes & sends. Start here for the big picture.
- [pipeline-architecture](wiki/pipeline-architecture.md) — AI-on-a-schedule + thin Next.js renderer + Supabase + Lark. Where every file lives.
- [editorial-spec-games](wiki/editorial-spec-games.md) — the approved games newsletter: voice, business-first selection, exclusions, recency, dedup, opportunity tone.
- [images-and-assets](wiki/images-and-assets.md) — images are downloaded and re-hosted (never hotlinked); per-channel variants; rights risk.

## What we're building
- [approval-platform-mvp](wiki/approval-platform-mvp.md) — approval workflow, roles, screens, and the MCP wrapper that makes the AI swappable.
- [channels-and-webhooks](wiki/channels-and-webhooks.md) — Lark / Email / Line / WeChat capabilities and the per-channel variant model.

## Handoff (repo takeover)
- `HANDOFF_HUMAN.md` — for the colleague taking over design & hosting: what this is, how to host it on their own Supabase + Vercel, where design plugs in, known issues.
- `HANDOFF_AI.md` — operating manual for the AI worker: how it connects (MCP), the three tools, the run procedure, the EN+CN issue schema, image re-hosting, and hard rules.
- `db/schema.sql` — one runnable script to recreate the whole database (tables, approval functions, RLS, image bucket) on a fresh Supabase project.

## Longer documents (not summaries)
- `MVP_Approval_Platform_Spec.md` — full spec for the design handoff.
- `PRD_Bonfire_SEA_Cloud_Newsletter.md` — original Phase 1 PRD (cloud newsletter).
- `M0_Sources_and_CTA.md` — approved source list + CTA copy.

## Sources
- `raw/` — unprocessed material. *Nothing filed yet.*
