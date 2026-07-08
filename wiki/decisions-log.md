# Decisions log

Append-only. Newest first. Every settled decision, dated.

## 2026-07-02
- **Single repo created:** https://github.com/ifreuds/bonfireautomatenews (public, `main`). Contains `site/` + `pipeline/` + `wiki/` + `CLAUDE.md` + docs. Deliberately excluded: the stale root duplicate of `site/`, and `DEPLOY_STEPS*.md`.
- **Secret hygiene:** the pipeline prompts contain `NOTIFY_SECRET`; committed copies are **redacted** to `${NOTIFY_SECRET}`. Verified against committed objects that no secret or live webhook reached the public repo.
- **Knowledge base adopted** — Karpathy execution principles in `CLAUDE.md`; `raw/` + `wiki/` + `index.md` structure.
- **Opinion tone = opportunity-forward for SEA.** Not neutral. Never frame news as a threat/loss for the region; find the regional opening. *(Boss feedback.)*
- **Format = Reuters/Economist business column**, business-first selection, all platforms + wider ecosystem, **gamer-culture excluded**, **~30-day window**. *(Boss feedback.)* → [editorial-spec-games](editorial-spec-games.md)
- **Channel variants ready from day 1** for **Lark, Email, Line, WeChat**.
- **Deliverable = clickable unstyled skeleton + full design doc**; company CI / visual design is the **last leg**.
- **WeChat = WeCom bot** for MVP (Official Account deferred — needs China entity).
- **Publish = separate button** after approve (not auto).
- **Overall workflow approved** by the boss.

## 2026-06-26
- **Games newsletter** added as second newsletter, sharing DB + site (`newsletter` column, `/games` routes).
- **Scope: mainstream games only** — i-gaming/gambling and 18+/adult **excluded**. *(The "illegal genres" line was a keep-out list.)*
- **Recency enforced** after a stale-news defect (a ~1-month-old story shipped in a daily). Publish dates must be verified.
- **Cadence: weekly is the destination, daily for now** as a rehearsal.
- **Images proven end-to-end** — agent downloads `og:image`, re-hosts to Supabase Storage, embeds. → [images-and-assets](images-and-assets.md)
- **Lark card rebuilt** to a scannable format: each story its own clickable headline; no "Why it matters:" label.

## 2026-06-23 → 2026-06-26 (Phase 1, cloud newsletter)
- **Phase 1 signed off.** Pipeline built, deployed, and proven with 3 consecutive unattended daily runs.
- **Neutral news, not a Tencent advertorial** — Bonfire presence limited to a subtle footer + soft CTA (CTA Option B).
- **Architecture:** pipeline writes to Supabase; a deployed Vercel site renders it. **No per-issue deploy.**
- **Dedup OFF during cloud rehearsal**, ON for real cadence. *(Games runs dedup ON, strict.)*

## Carried-over / open
- Image **rights** approach before email/broadcast launch → [images-and-assets](images-and-assets.md)
- Supabase **`service_role` key** needed to harden image uploads and wire the admin app to live data
- ⚠️ **Secrets in plaintext on disk:** `DEPLOY_STEPS.md` / `DEPLOY_STEPS_WEB.md` hold the live `NOTIFY_SECRET` and the cloud Lark webhook URL. Not committed, but they should be redacted or deleted; consider rotating `NOTIFY_SECRET`.
- **Old repo `ifreuds/bonfirenews`** still exists with an outdated copy of `site/` — archive or delete it to avoid confusion.
- **Stale duplicate** at repo root (`app/`, `lib/`, `package.json`, `next.config.js`) — untracked, safe to delete on request.
- Cloud newsletter: keep its current voice, or move it to the business-column style?
