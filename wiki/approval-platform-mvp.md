# Approval platform (the MVP we're building)

Full spec: `MVP_Approval_Platform_Spec.md`. This page is the summary.

## The shift
> **The app is the source of truth. The AI is a swappable drafting worker that talks to the app through an MCP wrapper. Nothing goes live until a human approves; approval — not the AI — triggers publishing and distribution.**

Two boundaries that must stay separate:
- **Integration contract = the MCP wrapper** (stable). Any AI runtime connects to the same tools. Swapping the AI = pointing a new runtime at the same endpoint; the app is untouched.
- **Instructions = the editorial brief**, stored *in the app* (see [editorial-spec-games](editorial-spec-games.md)) and served via `get_brief()`. Editable in the admin UI. **This is what makes the AI swappable.**

## How the AI connects
The MCP server is just an **authenticated endpoint**. You issue the AI worker a **token** (like an API key) — revocable, scoped. Any AI that speaks MCP connects with it; an AI that can't could call the same operations over plain HTTP. **Not tied to any AI vendor.** The token authorizes *submit drafts only* — never publish.

## MCP tool surface
`get_brief(newsletter)` · `get_sources(newsletter)` · `get_recent_archive(newsletter, days)` · `submit_draft(newsletter, article_json)` · `upload_image(issue_id, …)` · `get_submission_status(id)`

Approval, publish, distribution and channel config are **admin-only** — never exposed to the AI.

## Status workflow
```
draft ──submit──▶ pending ──approve──▶ approved ──publish──▶ published
   ▲                  │
   └──── reject ◀─────┘  (with review note)
```
AI submissions land as **`pending`**, never `published`.

## Roles (small team)
**Admin** (everything) · **Editor** (edit drafts + variants, submit) · **Approver** (approve/reject, publish)

## Screens (skeleton, unstyled)
- Public: `/games` list + issue page
- Admin: Login → **Review queue** → **Article editor with per-channel tabs** (Web · Lark · Email · Line · WeChat) → Approve / Reject / Publish → **Channel manager** → **Brief & Sources editor** → **Distribution log**

## Data model
`issues` (canonical) · `channel_variants` · `channels` · `assets` · `profiles` · `distribution_log` · `story_archive` (unchanged)

## Decided defaults
- Publish = a **separate button** after approve (not automatic)
- WeChat = **WeCom bot** for MVP
- Channel variants **ready from day one** (schema), formatting-only rendering to start

## Related
- [channels-and-webhooks](channels-and-webhooks.md) · [images-and-assets](images-and-assets.md) · [decisions-log](decisions-log.md)
