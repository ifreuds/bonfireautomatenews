# Bonfire Newsletter Platform — MVP Spec (for design handoff)

**Status:** MVP skeleton spec · **Focus:** Games newsletter · **Date:** 2026-07-02

This defines the **approval platform** we're building on top of today's pipeline: an AI drafts articles into a review queue, a small team approves them, and on approval the app publishes to the web and pushes a **per-channel** version to Lark / Email / Line / WeChat. It's the blueprint for the clickable, unstyled skeleton; the design team styles it afterward.

---

## 1. The core shift

Today the AI is **author *and* publisher** — it writes straight to the DB and fires Lark itself. We're changing that to:

> **The app is the source of truth. The AI is a swappable drafting worker that talks to the app through an MCP wrapper. Nothing goes live until a human approves; approval (not the AI) triggers publishing + distribution.**

Two boundaries that must stay separate:
- **Integration contract = the MCP wrapper** (stable). Any AI runtime — Claude on a schedule, a local model, anything — connects to the same MCP tools. Swapping the AI = pointing a new runtime at the same MCP endpoint; the app is untouched.
- **Instructions = the editorial brief**, stored *in the app* (not in the AI) and served via MCP `get_brief()`. Editable in the admin UI. This is what makes the AI truly swappable.

---

## 2. Roles (small team)

| Role | Can |
|---|---|
| **Admin** | Everything: users, channels, brief/sources, approve, publish |
| **Editor** | Edit drafts + per-channel variants; submit for approval |
| **Approver** | Approve / reject; trigger publish |

(Supabase Auth backs this; roles stored on a `profiles` table.)

---

## 3. Article status workflow

```
draft ──submit──▶ pending ──approve──▶ approved ──publish──▶ published
   ▲                  │                                   
   └──── reject ◀──────┘   (with review note)
```
- AI submissions land as **`pending`** (never `published`).
- Publish can be automatic-on-approve or a separate button (config).
- Today's auto-published games issues are back-filled as `published`.

---

## 4. Data model

**`issues`** (canonical article — one per newsletter+date)
`id · newsletter · issue_date · status · title · intro · content_json (structured: top_story + sections) · created_by · approved_by · approved_at · published_at`
*(content_html stays for the web render; the canonical truth is content_json.)*

**`channels`** (destinations the team configures)
`id · newsletter · name · type (lark|email|line|wechat) · destination (webhook/token/list) · template_key · enabled`

**`channel_variants`** (the per-channel content — the heart of "different writing & image per channel")
`id · issue_id · channel_type · headline · body_variant · image_asset_id · overridden (bool) · status`
- Defaults are **derived** from the canonical article; an editor (or the AI) can **override** copy + image per channel.

**`assets`** (images we host)
`id · issue_id · source_url · source_credit · storage_path (canonical) · variants (json: {lark, email, line, wechat} → sized storage paths)`

**`story_archive`** — unchanged (dedup memory).
**`profiles`** — `id · email · role`.
**`distribution_log`** — `id · issue_id · channel_id · status · response · sent_at` (retries + audit).

---

## 5. The four channels (why variants are needed)

| Channel | Mechanism | Images | "Writing" shape |
|---|---|---|---|
| **Lark** | Incoming-webhook interactive card (have it) | Card can't hotlink; image lives on the linked page (or a Lark app + `img_key` to embed) | Short: top story + linked headlines + button |
| **Email** | ESP (Resend/SendGrid/SES) HTML | `<img>` = our hosted URL, works directly | Full: the whole column, hero + per-story images |
| **Line** | LINE Messaging API push (Flex Message) | Flex accepts image **URLs** directly (our hosted copy) | Compact rich card, 1 hero + carousel |
| **WeChat** | WeCom bot webhook (easy) *or* Official Account (heavy: China entity, mass-send caps, media-library uploads, external links blocked) | WeCom: URL ok · OA: must upload to WeChat media | WeCom: card like Lark · OA: full in-app article |

**Takeaway:** each channel has different length, layout, image rules and link rules → each needs its own **template** + the ability to hold its own **copy + image**. That's exactly the `channel_variants` + `assets.variants` model above.

---

## 6. Image handling (per-channel)

1. AI extracts `og:image` → **downloads** → **uploads canonical** to `issue-images/games/<date>/…`.
2. On publish, the app produces **sized variants** per channel (e.g. web hero 1200w, email 600w, Lark/Line/WeChat thumbs) — via image transform (Supabase transform or a resize function) — stored under `assets.variants`.
3. Channels that accept URLs (web, email, Line, WeCom) reference the right variant; channels that need uploaded media (Lark card, WeChat OA) either link to the page or use a proper app integration to upload.
4. **Rights note:** decide source-thumbnail+attribution vs. licensed/generated images before adding email/broadcast reach.

---

## 7. Screens (skeleton scope, unstyled)

**Public**
- `/games` — issue list (published only)
- `/games/issue/[date]` — full issue

**Admin (`/admin`, auth-gated)**
- **Login** (Supabase Auth; role-aware)
- **Review queue** — pending drafts, newest first; approve/reject inline
- **Article editor** — edit canonical fields; **tabs per channel** (Web · Lark · Email · Line · WeChat) each showing the derived variant with "override" toggles for copy + image; Approve / Reject (with note); Publish
- **Channel manager** — list/add channels: type, destination, template, newsletter, on/off; "send test"
- **Brief & sources** — edit the AI's instructions + trusted-source list (what MCP `get_brief` returns)
- **Distribution log** — per-issue, per-channel send results

---

## 8. End-to-end flow

```
AI (scheduled) ─get_brief()▶ app ─▶ scrape trusted sources
      │ submit_draft() + upload_image()
      ▼
  issues.status = pending  ──▶  Review queue
      │ editor tweaks per-channel variants
      ▼
  Approver approves  ──▶  status = approved
      │ publish
      ▼
  published on web  +  for each enabled channel: render variant ─▶ POST webhook ─▶ log
```

---

## 9. MCP wrapper — the AI's tool surface

The AI only ever calls these (so it's swappable and can never publish directly):
- `get_brief(newsletter)` → editorial spec + format rules (app-owned)
- `get_sources(newsletter)` → trusted source list
- `get_recent_archive(newsletter, days)` → for dedup
- `submit_draft(newsletter, article_json)` → creates a `pending` issue
- `upload_image(issue_id, bytes|url)` → downloads/rehosts, returns asset id
- `get_submission_status(id)` → optional feedback loop

Everything else (approval, publish, distribution, channels) is **admin-only**, never exposed to the AI.

---

## 10. MVP vs later

**In MVP skeleton:** roles + login, status workflow, review queue, article editor with per-channel variant tabs (Lark/Email/Line/WeChat, **variant-ready schema**, formatting-only rendering to start), channel manager, brief/sources editor, publish + Lark push wired for real, others stubbed, distribution log. Seeded with the **games** newsletter and the latest approved article (2 July).
**Later:** live Email/Line/WeChat senders, image transform pipeline, the real MCP server, AI-generated per-channel copy variants, analytics.

---

## 11. Open decisions
1. Publish = auto-on-approve, or a separate explicit button? (skeleton: separate button)
2. WeChat = WeCom bot (easy) or Official Account (heavy)? (affects the WeChat template)
3. Image rights approach before email/broadcast launch.
