# Channels and webhooks

## The principle
> **One canonical article, many channel renderings.**

The AI submits a *structured* article. Each **channel** has its own **template** that assembles the right pieces, at the right length, with the right image size. Webhooks are **not** "one blob sent with the article" — on approval, the app renders a per-channel version and pushes each channel its own copy + image.

Adding a channel later = adding a template, **not** re-running the AI.

## The four channels

| Channel | Mechanism | Images | "Writing" shape |
|---|---|---|---|
| **Lark** | Incoming-webhook interactive card *(built & working)* | Card can't hotlink; image lives on the linked page | Short: top story + linked headlines + button |
| **Email** | ESP (Resend / SendGrid / SES), HTML | `<img>` = hosted URL, direct | Full: the whole column, hero + per-story images |
| **Line** | LINE Messaging API push (Flex Message) | Accepts image **URLs** directly | Compact rich card / carousel |
| **WeChat** | **WeCom bot webhook** (easy, chosen for MVP) *or* Official Account (heavy: China entity, mass-send caps, media-library uploads, external links blocked) | WeCom: URL ok · OA: upload required | WeCom: card like Lark · OA: full in-app article |

Different lengths, layouts, image rules and link rules → **each needs its own template and can hold its own copy + image.**

## Data model
- `channels` — `newsletter · name · type (lark|email|line|wechat) · destination · template_key · enabled`
- `channel_variants` — `issue_id · channel_type · headline · body_variant · image_asset_id · overridden`
  Defaults **derived** from the canonical article; each overridable. **Variant-ready from day one** (decision).
- `distribution_log` — per-issue, per-channel send result (retries + audit)

## Lark card format (learned)
`lark_md` supports `[text](url)`, `**bold**`, `\n`. **No inline images, no lists.** Custom-bot cards support text links + buttons (no postback). So: linked headlines + `hr` dividers + one "Open the full issue" button.

## Related
- [images-and-assets](images-and-assets.md) · [approval-platform-mvp](approval-platform-mvp.md)
