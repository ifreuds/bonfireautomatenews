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

## Open risk: rights
Re-hosting publishers' images has **copyright / ToS exposure**, and it grows once we push to email and broadcast channels. Decide before launch:
- source thumbnail + attribution (current, common practice, not risk-free), or
- licensed / generated images.

*(Avoid AI-generating images of real news events — misleading for a neutral-news product.)*

## Related
- [channels-and-webhooks](channels-and-webhooks.md) · [pipeline-architecture](pipeline-architecture.md)
