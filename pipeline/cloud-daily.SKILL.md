---
name: bonfire-sea-cloud-daily
description: Daily 7AM ICT rehearsal run of the Bonfire SEA Cloud newsletter pipeline (research → draft → Supabase → Lark).
---

You are running the **Bonfire SEA Cloud Weekly** newsletter pipeline — the automated DAILY REHEARSAL of a weekly issue. This run is fully autonomous (no human in the loop). Each run starts fresh with no memory, so everything you need is below. Do the whole pipeline end to end, then report.

WHAT THIS IS: A neutral-news, business/executive-level weekly read on cloud across Southeast Asia (ASEAN), published by Bonfire (an official Tencent Cloud partner). Cover all cloud players fairly — this is NOT a Tencent advertorial; Bonfire's presence is only a subtle footer. Target a ~3-minute read, 5–7 stories total.

ISSUE_DATE: Use today's date in the Asia/Bangkok (ICT, UTC+7) timezone, formatted YYYY-MM-DD. Use this same value everywhere below.

TOOLS/CONNECTORS YOU WILL USE:
- Web search + web fetch (WebSearch / WebFetch) for research.
- The Supabase connector/MCP for project ref `pmspzrmowzuryhdjnoeo` — use its execute_sql tool for all DB reads and writes. (Writes MUST go through this connector; the public anon key cannot write because RLS is on.)
- Bash + curl for the Lark notify call.

=== STEP 1 — RESEARCH (last 7 days) ===
**RECENCY:** Only include stories PUBLISHED in the last 7 days. VERIFY each candidate's publish date (visible dateline or the page's `article:published_time` meta) and EXCLUDE anything older — no month-old or prior-year items, even if relevant. Fewer fresh stories beats stale filler.
Search reputable / official sources ONLY — NO social media (no LinkedIn, no X/Twitter). Cover these four themes for SEA/ASEAN (Singapore, Malaysia, Indonesia, Thailand, Vietnam, Philippines, plus Brunei/Cambodia/Laos/Myanmar where relevant):
1. Hyperscaler moves in SEA — AWS, Azure, Google Cloud, Alibaba Cloud, Tencent Cloud, Huawei Cloud: region launches, new services, pricing, local capacity.
2. Regulation & data sovereignty — data-residency laws, cloud compliance, government cloud policy.
3. Funding & market moves — SEA cloud / data-center / infra funding, M&A, partnerships.
4. Local providers & telcos — Singtel, Telkom, VNG, AIS, regional data-center operators, sovereign cloud.
Preferred source backbone (but search broadly): DataCenterDynamics (SE Asia), DataCenterNews Asia Pacific, iTnews Asia, Tech in Asia, TechNode Global, DealStreetAsia; official vendor newsrooms (AWS / Azure / Google Cloud / Tencent / Alibaba / Huawei); ASEAN regulators (Singapore IMDA/PDPC, Indonesia Kominfo, Vietnam MIC, Thailand PDPA, Malaysia MCMC, Philippines DICT/NPC).
Rules: every candidate story MUST have a working source URL; prefer primary sources; a story must be cloud-related AND SEA-related to qualify.

=== STEP 2 — SELECT ===
Pick the 5–7 strongest stories — all PUBLISHED within the last 7 days (drop anything you cannot date, or that is older) — and choose ONE "top story." DEDUP IS OFF for this rehearsal phase — include the full best-of-the-last-7-days set; do NOT filter out stories already in the `story_archive` table. (Dedup flips ON later for the real weekly cadence.)

=== STEP 3 — DRAFT THE ISSUE JSON ===
Neutral tone, plain business English, every story gets a one-line "why it matters" (the SEA cloud-buyer implication). Write EXACTLY this schema:
{
  "issue_date": "YYYY-MM-DD",
  "title": "Bonfire SEA Cloud Weekly — <D Month YYYY>",
  "intro": "1–2 sentence teaser of the issue's highlights.",
  "top_story": { "headline": "", "url": "", "source": "", "summary": "2–3 sentences", "why_it_matters": "1–2 sentences" },
  "sections": [
    { "theme": "<Hyperscaler moves | Regulation & data sovereignty | Funding & market moves | Local providers & telcos>",
      "stories": [ { "headline": "", "url": "", "source": "", "summary": "", "why_it_matters": "" } ] }
  ],
  "footer": {
    "about": "About Bonfire — We help Southeast Asian businesses plan and run cloud migrations, with hands-on support from our in-house team. As an official Tencent Cloud partner, we turn regional cloud trends into practical moves.",
    "cta": "Questions about a migration or your cloud setup? Reach out — no pitch, just a conversation.",
    "sources_note": "Curated from public reporting. Links go to original sources."
  }
}
Only include sections that actually have stories this period. The footer (About + CTA + sources_note) is FIXED (CTA Option B) — use it verbatim.

=== STEP 4 — RENDER HTML ===
First fetch the most recent published issue's HTML as your visual template:
  select content_html from issues where newsletter='cloud' and status='published' order by issue_date desc limit 1;
Produce new email/web-safe, INLINE-STYLED HTML (no external CSS/JS) that mirrors that template's structure and styling:
- a dark header band (#1a1a2e) with an orange (#e8633a) "🔥 BONFIRE SEA CLOUD WEEKLY" kicker, the title, and the date;
- a highlighted TOP STORY card;
- one block per themed section, each story showing a linked headline, the summary, and the "why it matters" line;
- a dark footer containing the About text, the CTA, and the sources note.
Each headline links to its source URL.

=== STEP 5 — STORE IN SUPABASE (project pmspzrmowzuryhdjnoeo, via the Supabase connector) ===
Make this idempotent for re-runs on the same date:
This newsletter is `newsletter='cloud'`; a separate Games newsletter shares these tables, so EVERY query below MUST filter/set newsletter='cloud'.
1. Run: select id from issues where issue_date = 'ISSUE_DATE' and newsletter='cloud';
2a. If a row EXISTS: UPDATE it (set title, status='published', content_json, content_html, created_at = now()); keep its id as ISSUE_ID.
2b. If NO row exists: INSERT a new published row and RETURN its id as ISSUE_ID.
3. Insert every covered story (including the top story) into story_archive (url, headline, source, covered_date, issue_id) with issue_id = ISSUE_ID and covered_date = 'ISSUE_DATE', using ON CONFLICT (url) DO NOTHING.
Use dollar-quoting ($bonfire$...$bonfire$) around the HTML and JSON literals to avoid escaping pain. Example for the INSERT path:
  WITH new_issue AS (
    INSERT INTO issues (issue_date, newsletter, title, status, content_json, content_html)
    VALUES ('ISSUE_DATE', 'cloud', $bonfire$<title>$bonfire$, 'published',
            $bonfire$<json>$bonfire$::jsonb, $bonfire$<html>$bonfire$)
    RETURNING id
  )
  INSERT INTO story_archive (url, headline, source, covered_date, issue_id, newsletter)
  SELECT v.url, v.headline, v.source, 'ISSUE_DATE'::date, new_issue.id, 'cloud'
  FROM new_issue, (VALUES
    ('<url1>','<headline1>','<source1>'),
    ('<url2>','<headline2>','<source2>')
  ) AS v(url, headline, source)
  ON CONFLICT (url) DO NOTHING;
For the UPDATE-existing path: run the UPDATE on issues, then a separate INSERT ... SELECT into story_archive using the existing ISSUE_ID.

=== STEP 6 — NOTIFY LARK ===
Trigger the deployed site to post the summary card to the Lark channel (run via Bash; --ssl-no-revoke avoids a Windows curl TLS error):
  curl -s --ssl-no-revoke -X POST "https://bonfire-sea-cloud-newsletter.vercel.app/api/notify-lark" -H "Content-Type: application/json" -d '{"date":"ISSUE_DATE","token":"${NOTIFY_SECRET}"}'
Expect {"ok":true,...,"lark":{...,"msg":"success"}}. If you get ok:false / unauthorized → token mismatch; if a Lark error → webhook problem. Report whichever happens.

=== STEP 7 — VERIFY & REPORT ===
- Confirm the issue page returns 200:
  curl -s --ssl-no-revoke -o /dev/null -w "%{http_code}\n" "https://bonfire-sea-cloud-newsletter.vercel.app/issue/ISSUE_DATE"
- Report: ISSUE_DATE, the title, the top-story headline, number of stories and sections, the Supabase write result, the Lark response, and the issue-page HTTP status. If ANY step failed, state exactly which step and the error.

CONSTRAINTS (recap): neutral news first (not a Tencent ad); official sources only, no social media; every story needs a working URL; keep it tight (5–7 stories, ~3-minute read).