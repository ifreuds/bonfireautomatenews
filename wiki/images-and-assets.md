# Images and assets

## How images are obtained (today)
**Download-then-rehost — never hotlinked, never API-pulled at display time.**

1. The AI reads the source article's `og:image` URL (curls the page, greps the meta tag).
2. **Downloads** the actual image file.
3. **Uploads it to our own storage** — Supabase bucket `issue-images`, path `games/<date>/top.<ext>`.
4. References *our* hosted copy in the article HTML.

**Why:** hotlinking breaks (sites block it, move or delete the image). Owning a stable copy is also what makes per-channel image variants possible — we can crop/resize *our* file.

Bucket config: public **read**, images-only MIME, 5 MB cap.
⚠️ Upload currently uses a **contained public-write policy** with the publishable key. Production should switch to the **`service_role` key** and service-only writes.

## Per-story images (live since 2026-07-02)
**Every story gets its own hero image**, not just the top story. Verified on the 2 July issue: **7/7 stories had a usable `og:image`**. The pipeline fetches, downloads and re-hosts one per story (`top`, `s2`, `s3`, …). If a story has no `og:image` (or the site 403s), the image is **omitted** and the template renders a clean text-only card — never a broken image.

## Normalization: Supabase image transforms (no tooling needed)
Raw source images are wildly inconsistent (JPEG/PNG/WebP, 59 KB–625 KB, 934×557 next to 1289×720). We **never resize on upload**. The app crops on the fly via Supabase's render endpoint — swap `/object/public/` for `/render/image/public/` and add params:

```
?width=1200&height=675&resize=cover&quality=78   → hero
?width=320&height=180&resize=cover&quality=76    → thumbnail
?width=600&height=338&resize=cover&quality=75    → email
```
Exact 16:9 cover crops, and **auto-WebP** for browsers. Measured: a 625 KB source PNG → **56 KB hero**, **18 KB thumbnail**. Helper lives in `site/lib/render-issue.js` (`img()`).

## Per-channel variants (planned)
One canonical image → sized variants per destination, stored on the `assets` row:

| Channel | Image handling |
|---|---|
| Web | hero (~1200w) |
| Email | ~600w, `<img src>` = our hosted URL — works directly |
| Line | Flex Message accepts image **URLs** directly |
| WeCom | card thumbnail via URL |
| Lark (card) | cannot hotlink — needs `img_key` upload via a full Lark app, or the image lives on the linked page |
| WeChat Official Account | must upload to WeChat's media library; external links blocked |

## Rights — decided 2026-07-08 (with known residual risk)

**Decision:** keep pulling `og:image` from the source article, re-host it, credit the outlet, and link every headline back to the original. A **standing rights + takedown notice** now renders in the footer of every issue (hard-coded in `site/lib/render-issue.js`, so it can't be omitted by the pipeline).

**What genuinely supports this:** publishers emit `og:image` *precisely so third parties can display it beside a link back* — its designed purpose. Thumbnail size, editorial commentary, attribution and a link all cut the same way.

**Residual risk, accepted knowingly:**
- **Attribution is not a licence.** Crediting the outlet does not transfer permission.
- The "internal / non-commercial" argument **does not describe what is deployed**: the site is public (no login), the audience is customers + partners, and the footer carries a commercial CTA.
- We **re-host a copy** (a reproduction) rather than hotlink. Re-hosting is what buys reliability *and* the on-the-fly crop — Supabase can only transform files in our own storage. Considered and kept.
- Some `og:image`s are **agency photos** (Getty / Reuters / AFP / AP) licensed to that outlet only; agencies actively enforce.
- "Fair use" is a **US** doctrine. Singapore/Malaysia have fair dealing; Indonesia, Vietnam and Thailand differ. Don't assume US rules for a SEA-facing publication.

**Mitigations offered and DECLINED for now (2026-07-08):**
- Password-gating the site (would make the "internal use" argument actually true)
- Auto-skipping agency-credited images (Getty/Reuters/AFP/AP)

**Still open:** a real takedown **contact address** — the notice currently has no mailto (pass `contactEmail` to `IssueBody`). And the step-change in exposure is the **first external email blast**, not the website — worth a lawyer's 20 minutes before then.

*(Avoid AI-generating images of real news events — misleading for a neutral-news product.)*

## Related
- [channels-and-webhooks](channels-and-webhooks.md) · [pipeline-architecture](pipeline-architecture.md)
