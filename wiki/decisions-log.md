# Decisions log

Append-only. Newest first. Every settled decision, dated.

## 2026-07-02
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
- **One git repo** for the whole project (root is not yet a repo; `ifreuds/bonfirenews` holds only an older copy of `site/`)
- Cloud newsletter: keep its current voice, or move it to the business-column style?
