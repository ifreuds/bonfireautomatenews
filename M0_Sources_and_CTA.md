# M0 Deliverables — Source List & CTA Copy

**For review.** Once you approve these, M0 is done except the Lark webhook (yours) and account provisioning (mine).

---

## Part 1 — Source list (for your approval)

I've split sources into **RSS feeds** (the reliable backbone the pipeline polls directly) and **web-search / no-clean-RSS** sources (covered via search queries instead). Verify nothing here is a source you distrust; add anything you do trust.

### A. RSS feeds — primary backbone

| Source | Why it's here | Feed URL (to verify at build) |
|---|---|---|
| **DataCenterDynamics — SE Asia** | Best single source for SEA hyperscaler / data-center / investment news | `datacenterdynamics.com` region feed — confirm exact RSS at build |
| **DataCenterNews Asia Pacific** | Cloud + data-center decision-maker news, APAC | `datacenternews.asia/rss` (or `/feed`) |
| **iTnews Asia** | Enterprise IT/cloud across Asia | `itnews.asia/rss` |
| **Tech in Asia** | SEA startup/tech, funding, market moves | site RSS — confirm at build |
| **TechNode Global** | SEA + China tech incl. cloud/data-center | `technode.global/feed` |

> Note: some publishers have changed or restricted their RSS. At build time (M2) I'll test each feed URL live and swap any dead one for a web-search query against the same site. So this table is the *intent*; the working URLs get locked in M2.

### B. Official vendor blogs — primary-source hyperscaler news

Pulled via each vendor's official newsroom/blog, filtered to SEA-relevant posts:

- **AWS** — aws.amazon.com/blogs / what's-new feed
- **Microsoft Azure** — azure.microsoft.com/blog
- **Google Cloud** — cloud.google.com/blog
- **Tencent Cloud** — official newsroom/blog
- **Alibaba Cloud** — official blog
- **Huawei Cloud** — official newsroom

### C. Government / regulator — via web search (rarely have clean RSS)

Captured through targeted weekly search queries, not RSS:

- Singapore — IMDA / PDPC
- Indonesia — Kominfo / PDP law updates
- Vietnam — MIC / PDPL / data-localization decrees
- Thailand — PDPA / digital economy ministry
- Malaysia — MCMC / PDPA
- Philippines — DICT / NPC

### Excluded (by your decision)
- LinkedIn / X / any social monitoring — unreliable.

**Your action on this part:** reply "sources approved" or tell me what to cut/add. (Easiest: "go with your picks.")

---

## Part 2 — CTA / footer copy (pick one, or mix)

The footer must stay subtle — neutral news first, soft Bonfire tag. Three options, lightest to most direct:

### Option A — Lightest (pure sign-off)
> *Curated weekly by Bonfire — your Tencent Cloud partner in Southeast Asia.*
> *Forwarded this? [Subscribe] · [Talk to our cloud team]*

### Option B — Balanced (recommended)
> **About Bonfire** — We help Southeast Asian businesses plan and run cloud migrations, with hands-on support from our in-house team. As an official Tencent Cloud partner, we turn regional cloud trends into practical moves.
> *Questions about a migration or your cloud setup? [Reach out] — no pitch, just a conversation.*

### Option C — Most direct (warm-lead leaning)
> **Bonfire helps you act on this news.** Migration planning, cost optimization, and delivery support across SEA — backed by our in-house engineers and our Tencent Cloud partnership.
> *[Book a 30-min cloud chat] · [See how we've helped others]*

**My recommendation:** **Option B** — credible for cold/external readers, still plants the Tencent partnership and a soft CTA. A/B against A later once you see real reactions.

**Your action on this part:** pick A / B / C (or ask me to tweak wording).

---

## What I'm doing next (no action needed from you)
- Provision the Supabase project in org `ifreuds` (M1).
- Prep the Vercel project under team `ifreuds' projects` (M5) — you'll click "Create" once at deploy.

## What I need from you
1. **Lark webhook URL** — create the Custom Bot (PRD Appendix B) and paste it here.
2. **Approve sources** (Part 1) — "go with your picks" is fine.
3. **Pick CTA** (Part 2) — A / B / C.
