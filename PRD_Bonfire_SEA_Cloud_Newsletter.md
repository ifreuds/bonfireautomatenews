# PRD — Bonfire SEA Cloud Weekly Newsletter

**Status:** Draft v0.2 (for review)
**Owner:** Freud
**Last updated:** 2026-06-23
**Publisher:** Bonfire — official Tencent Cloud partner (cloud migration, sales, in-house delivery team)

> v0.2 update: scoping round 2 resolved most open items. Architecture (Supabase + Vercel), a proposed source list (§6), and Lark setup steps (Appendix B) are now included. Remaining open items are down to a short list in §11.

---

## 1. Summary

A weekly news product covering cloud technology developments across Southeast Asia (ASEAN), written primarily for a business/executive audience and shared with both internal teams and external parties (clients, partners, prospects).

The product is published by Bonfire, a Tencent Cloud partner. Editorial positioning is **neutral news first** — all hyperscalers and regional players are covered fairly — with only a subtle Bonfire/Tencent footer and soft call-to-action. Credibility with external readers is the priority; this is not a Tencent advertorial.

Version 1 is a **proof-of-concept automated pipeline**: scan → scrape → draft → send, running automatically end-to-end. The v1 success bar is that the pipeline runs and produces a credible issue — not yet editorial perfection or engagement tracking.

---

## 2. Goals and non-goals

### Goals (v1)
- Prove the full pipeline works automatically end-to-end: source scan → scrape/extract → AI draft → send.
- Produce a credible, tight 5–7 story issue focused on SEA cloud news.
- Deliver to a Lark test channel via webhook so output can be reviewed safely.
- Maintain a story archive so the same stories aren't repeated across runs.

### Non-goals (v1 — explicitly out of scope)
- Engagement tracking (opens/clicks) — requires an email platform; deferred.
- Multi-channel fan-out (WeChat, Line, Email-to-audience) — deferred; v1 is Lark webhook only.
- A real subscriber list or external distribution — v1 sends only to the internal Lark test channel.
- Social/LinkedIn sourcing — excluded by decision (reliability/accuracy risk). "Official" sources only.
- Two separate editions (internal vs external) — v1 is one shared version.
- Email-to-audience sending and multi-channel fan-out (WeChat, Line) — deferred to later phases.

> **In scope for v1 (changed from v0.1):** a **hosted HTML page + archive site** on Vercel, reading from Supabase. This is now part of v1 because it's the cleanest way to (a) view each issue at a stable link and (b) store the dedup archive. See §7 architecture.

---

## 3. Audience

**Primary reader:** business / executive. Decision-makers who care about *"what does this mean for us and our clients"* — strategic implications over deep technical detail.

**Distribution (eventual):** both internal (Bonfire team) and external (clients, partners, prospects). One shared version written to the external standard; internal readers consume the same issue.

**Implication for tone:** plain business English, short. Every story needs a *"why it matters"* line that translates the news into a SEA cloud-buyer implication. Assume the reader skims in under 3 minutes.

---

## 4. Editorial scope

### Topic scope
"SEA cloud news" — broad but cloud-and-SEA-anchored. In scope:
- **Hyperscaler moves in SEA** — AWS, Azure, GCP, Alibaba Cloud, Tencent Cloud, Huawei Cloud: region launches, new services, pricing, local availability.
- **Regulation & data sovereignty** — data residency laws, cloud compliance, government cloud policy across ASEAN.
- **Funding & market moves** — SEA cloud/infra/data-center funding, M&A, partnerships.
- **Local providers & telcos** — Singtel, Telkom, VNG, AIS, regional data-center operators, sovereign cloud.
- **Anything genuinely relevant** to cloud in SEA that doesn't fit the buckets above.

### Geographic scope
**All ASEAN** — Singapore, Malaysia, Indonesia, Thailand, Vietnam, Philippines, plus Brunei, Cambodia, Laos, Myanmar where relevant. No global news unless it has a direct SEA angle.

### Tencent positioning
**Neutral news, subtle tag.** Cover all players fairly. Tencent Cloud gets coverage only when genuinely newsworthy, on the same footing as competitors. Bonfire's presence is limited to a short footer + soft CTA (e.g., "Bonfire helps SEA businesses migrate to cloud — talk to us"). No per-story Tencent slant.

---

## 5. Issue structure

Tight format, **5–7 stories per issue**, ~3 minute read.

1. **Header** — issue title, date, one-line intro.
2. **Top story + why it matters** — the single most important development of the period, 2–3 sentences plus a short Bonfire take on implications for SEA cloud buyers.
3. **News by theme** — remaining stories grouped into sections: Hyperscalers / Regulation & sovereignty / Funding & market / Local providers & telcos. Only show sections that have stories that period. Each story: headline (linked to source), 2–3 sentence summary, one "why it matters" line.
4. **Footer** — subtle Bonfire/Tencent tag + soft CTA + source credits.

**Optional / later:** "Quick hits" one-liners and a "stat of the week" — not in v1 unless trivial to add.

---

## 6. Sourcing

You don't follow cloud news, so the source list below is **proposed by me** for your approval. It mixes (a) specialist data-center/cloud trade press, (b) regional tech business press, and (c) official vendor/government feeds. All are established outlets, not social signals.

**Proposed starter source list (for approval):**

*Specialist cloud / data-center trade press (strongest signal for this newsletter):*
- **DataCenterDynamics — Southeast Asia** (datacenterdynamics.com) — region-tagged hyperscaler, colocation, and investment news. Has RSS.
- **DataCenterNews Asia Pacific** (datacenternews.asia) — cloud + data-center decision-maker news, APAC. Has RSS.
- **iTnews Asia** (itnews.asia) — enterprise IT/cloud across Asia. Has RSS.

*Regional tech & business press (funding, market, local players):*
- **Tech in Asia** (techinasia.com) — SEA startup/tech, funding, market moves.
- **TechNode Global** (technode.global) — SEA + China tech, including cloud/data-center.
- **DealStreetAsia** (dealstreetasia.com) — funding, M&A, investment (some paywall).
- **The Business Times / regional outlets** — for major national announcements. *(Optional, can be noisy.)*

*Official vendor blogs (hyperscaler moves — primary sources):*
- **AWS**, **Microsoft Azure**, **Google Cloud**, **Tencent Cloud**, **Alibaba Cloud**, **Huawei Cloud** — official newsroom/blog feeds, filtered to SEA-relevant posts.

*Official government / regulator sources (data sovereignty & policy):*
- ASEAN data-protection regulators and ICT ministries (e.g., Singapore IMDA/PDPC, Indonesia, Vietnam MIC, Thailand, Malaysia, Philippines). Captured mainly via **live web search** since these rarely have clean RSS.

**How the three sourcing methods combine:**
- **RSS / known sites** — fixed, reliable backbone (the trade press + vendor blogs above).
- **Official vendor & government feeds** — primary-source hyperscaler and regulator announcements.
- **Live web search** — weekly net to catch what fixed feeds miss (esp. government/regulator news); results filtered for relevance and source quality before inclusion.

**Excluded:** LinkedIn / X / social monitoring — risk of false or unverified info.

> The list above is a **starting point, not final** — once we run the pipeline a few times we'll see which sources actually produce good SEA-cloud stories and prune/add accordingly.

**Quality rules:**
- Prefer primary sources (official announcements, regulator press releases) over secondary reporting.
- Every included story must have a working source URL.
- Relevance filter: must be cloud-related AND SEA-related (country in ASEAN, or a regional/ASEAN-wide angle).

---

## 7. Pipeline (v1 architecture)

```
[1] SCAN      Pull candidate stories from RSS feeds, official feeds, and a web search.
                ↓
[2] FILTER    Keep only cloud + SEA relevant items. Optionally drop anything already
                in the story archive (dedup — config flag, OFF during rehearsal).
                ↓
[3] SCRAPE    Fetch/extract the full text of each surviving candidate for accurate summarizing.
                ↓
[4] RANK      Score and select the top 5–7. Identify the single "top story."
                ↓
[5] DRAFT     AI writes the issue: top story + why it matters, themed sections, footer/CTA. Neutral tone.
                ↓
[6] STORE     Write the finished issue (structured JSON + rendered HTML) as a row in Supabase.
                Append all covered URLs/headlines to the story archive table.
                ↓
[7] PUBLISH   The Vercel site reads Supabase and serves the issue at a stable URL
                (e.g. /issue/2026-06-23) plus an archive index. No redeploy per issue.
                ↓
[8] NOTIFY    Post a summary + link to the issue page into the Lark test channel via webhook.
```

### Hosting architecture (resolves your #2 and #3)

The key design decision: **the pipeline never pushes files to Vercel.** Instead it writes data to Supabase, and a Vercel site (deployed once) reads from Supabase and renders issues on demand.

```
  Pipeline run  ──writes──▶  Supabase (Postgres)
                               ├─ issues table      (one row per issue: date, JSON, HTML)
                               └─ story_archive table (covered URLs/headlines for dedup)
                                        ▲
                                        │ reads
                                        │
                             Vercel site (deployed once)
                               ├─ /                 → archive index (list of all issues)
                               └─ /issue/<date>     → renders that issue at a stable link
                                        │
                                        ▼
                             Lark message links here
```

Why this shape:
- **Automatic links, no per-issue deploy.** New issues are just new Supabase rows; the already-deployed site renders them. The link is stable and predictable.
- **One store does double duty.** Supabase holds both the published issues *and* the dedup archive — resolves your "any format is fine, cloudflare or supabase" (we use Supabase).
- **I can build this.** Provisioning Supabase and deploying to Vercel are both within my available tools, so this is implementable, not hypothetical.
- **Cloudflare not needed for v1.** Supabase + Vercel covers storage, hosting, and links. Cloudflare can be added later only if we want a custom domain / CDN in front.

### Story archive (dedup memory)
A `story_archive` table in Supabase: one row per covered story (URL, headline, date, issue ID). When dedup is ON, each run filters out anything already in the table. **Dedup is a config flag — OFF during rehearsal testing** (so every daily run produces a full 7-day issue for quality judging), flipped **ON for real weekly cadence** (so issues don't repeat week to week).

---

## 8. Delivery & cadence

### Test phase (now)
- **Cadence:** runs **daily** as a *rehearsal of the weekly issue* — each daily run regenerates a full "past 7 days" weekly-style issue from scratch as a dry run, to exercise the pipeline frequently.
- **Channel:** issue is published to the Vercel page; a **Lark webhook** posts a summary + link to an internal test channel. No external recipients.
- **Automation:** fully automatic — scan → scrape → draft → store → publish → notify, no human in the loop (this is the point of the test).
- **Dedup:** **OFF** during rehearsal (decision) so each daily run shows a complete 7-day issue for quality judging. Flipped ON at production.

### Production phase (later, not v1)
- **Cadence:** **weekly**, exact day/time TBD (leaning Monday morning, covers prior week).
- **Flow:** pipeline drafts the issue → **human reviews & edits → manual send**. No auto-send to external audiences.
- **Channels:** Email + hosted HTML page as the primary external route; WeChat / Line / Lark as additional routes with per-channel rendering. Email likely first.

---

## 9. Success criteria (v1)

**Primary:** the pipeline runs end-to-end automatically and produces a credible issue posted to Lark. That is the definition of "done" for v1.

**Secondary signals (not gating):**
- Stories are actually cloud + SEA relevant (low off-topic rate).
- No broken source links.
- No repeated stories across consecutive runs (archive works).
- Output reads as neutral news, not a Tencent ad.

---

## 10. Tech & tooling notes

- **Sourcing:** RSS parsing + web search + official feed fetching. Web fetching for full-text scrape.
- **Drafting:** AI generation from scraped content, with the issue template in §5 and neutral-tone rules in §4.
- **Store:** **Supabase (Postgres)** — `issues` table (published issues) + `story_archive` table (dedup).
- **Hosting:** **Vercel** site, deployed once, reads Supabase, serves `/issue/<date>` + archive index.
- **Notify:** **Lark incoming webhook** posts summary + issue link to the test channel.
- **Scheduling:** a **daily** scheduled run during test (rehearsal of the weekly); **weekly** in production.

*(Exact implementation — language/runtime, where the scheduled job runs — to be decided at build time once this PRD is approved. Likely a small Node or Python job triggered on schedule.)*

---

## 11. Decisions resolved & remaining open items

### Resolved in scoping round 2
- **Source list** — proposed list in §6, pending your approve/adjust. You rely on me to pick reliable sources.
- **Hosted HTML page** — IN scope for v1. Hosted on Vercel, reads from Supabase (§7).
- **Archive storage** — Supabase `story_archive` table (§7). Cloudflare not needed for v1.
- **Rehearsal dedup** — OFF during rehearsal, ON at production. Implemented as a config flag (§7, §8).
- **Language** — English only for v1; localization (esp. WeChat) deferred to later phases.

### Remaining open items (need your input, but most can be done during build)
1. **Approve the source list** in §6 — remove any you dislike, add any you trust. (Or just say "go with your picks.")
2. **Lark webhook URL** — you'll need to create it (2-min task, steps in **Appendix B**) and paste the URL to me at build time.
3. **Bonfire CTA wording** — exact footer + soft CTA copy. I can draft 2–3 options for you to pick. **[OPEN]**
4. **Branding** — is "Bonfire" the public newsletter name? Any logo / color for the HTML page? Plain default is fine for v1 if not. **[OPEN]**
5. **Supabase / Vercel accounts** — do you have these, or should I provision fresh ones during build? **[OPEN]**

---

## 12. Phasing

- **Phase 0 — this PRD.** Approve scope, resolve §11 open items.
- **Phase 1 — POC pipeline (v1).** Build scan→scrape→draft→send to Lark test channel, daily rehearsal mode, story archive. *Success = pipeline works end-to-end.*
- **Phase 2 — editorial quality.** Tune sourcing, ranking, and tone until output is client-send-ready with minimal editing.
- **Phase 3 — production.** Switch to weekly, add human-review-then-send, build Email + hosted HTML route.
- **Phase 4 — multi-channel.** WeChat / Line / Email-to-audience with per-channel rendering; engagement tracking.

---

## Appendix A — Data model (Supabase, draft)

**`issues`**
| column | type | notes |
|---|---|---|
| id | uuid (pk) | |
| issue_date | date | the issue's date, used in the URL |
| title | text | issue headline |
| status | text | `draft` / `published` |
| content_json | jsonb | structured stories (top story + themed sections) |
| content_html | text | rendered HTML the Vercel page serves |
| created_at | timestamptz | |

**`story_archive`**
| column | type | notes |
|---|---|---|
| id | uuid (pk) | |
| url | text (unique) | the dedup key |
| headline | text | |
| source | text | which feed/site it came from |
| covered_date | date | when it was first included |
| issue_id | uuid (fk) | which issue used it |

*(Draft — exact columns finalized at build.)*

---

## Appendix B — Lark webhook setup (your 2-minute task)

You'll create a "Custom Bot" inside a Lark group and give me its webhook URL. Steps:

1. Open Lark and go to (or create) the **test group chat** where you want the newsletter to post.
2. Open the group **Settings** (top-right of the chat) → find **Bots** (sometimes under "Group Management").
3. Click **Add Bot** → choose **Custom Bot** (also called "Custom Incoming Webhook").
4. Give it a name (e.g., "Bonfire News Bot") and an optional description, then confirm.
5. Lark shows a **Webhook URL** — copy it. *(Optionally set a "signature/secret" for security; if you do, share that too.)*
6. Paste the URL (and secret, if set) to me when we start the build.

That URL is all the pipeline needs to post issues into the channel. Nothing else to configure on your side.

> Lark's exact menu names vary slightly by version/region; if you can't find "Custom Bot," tell me and I'll walk you through your specific Lark UI with screenshots.
