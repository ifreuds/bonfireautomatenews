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
