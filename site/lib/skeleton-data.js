// SKELETON SEED DATA — mock only. No live secrets. Nothing here touches the real database.
// The 2026-07-02 issue is the real published games article; the two 'pending' ones are mock drafts.

export const seed = {
  issues: [
    {
      id: 'i-2026-07-08',
      newsletter: 'games',
      date: '2026-07-08',
      status: 'pending',
      submittedBy: 'AI worker (via MCP)',
      title: 'Bonfire SEA Games Daily — 8 July 2026',
      intro:
        'Capital keeps rotating toward Southeast Asia: a Singapore studio changes hands, Indonesia loosens a payment rule, and a Korean publisher plants a Bangkok office.',
      image: { url: '', credit: '' },
      topStory: {
        headline: 'Korean publisher opens Bangkok studio to anchor its Southeast Asia push',
        source: 'Mobidictum',
        url: 'https://mobidictum.com/',
        summary:
          'A mid-cap Korean publisher confirmed a Bangkok development and publishing office, its first owned presence in Thailand, citing local live-ops talent and proximity to its largest player base. (Mock draft.)',
        read:
          'Thailand keeps converting player share into production share — another argument for building operations locally rather than servicing the region from Seoul.',
      },
      sections: [
        {
          theme: 'Deals & funding',
          stories: [
            {
              headline: 'Singapore mobile studio acquired by a regional publisher',
              source: 'PocketGamer.biz',
              url: 'https://www.pocketgamer.biz/',
              summary: 'Undisclosed sum; the studio keeps its team and roadmap. (Mock draft.)',
              read: 'Consolidation continues to price SEA studios as strategic assets, not cheap outsourcing.',
            },
          ],
        },
        {
          theme: 'Regulation & market',
          stories: [
            {
              headline: 'Indonesia eases a payment-licensing requirement for game top-ups',
              source: 'The Jakarta Post',
              url: 'https://www.thejakartapost.com/',
              summary: 'Regulators trimmed a filing step for licensed payment intermediaries. (Mock draft.)',
              read: 'Lower friction on the checkout layer directly widens the margin for publishers operating in the region’s biggest market.',
            },
          ],
        },
      ],
    },
    {
      id: 'i-2026-07-07',
      newsletter: 'games',
      date: '2026-07-07',
      status: 'pending',
      submittedBy: 'AI worker (via MCP)',
      title: 'Bonfire SEA Games Daily — 7 July 2026',
      intro: 'A quieter week for deals; the money story is infrastructure.',
      image: { url: '', credit: '' },
      topStory: {
        headline: 'Vietnamese studio raises a seed round to scale its casual portfolio',
        source: 'TechNode Global',
        url: 'https://technode.global/',
        summary: 'Round led by a regional fund; proceeds go to user acquisition and live-ops hiring. (Mock draft.)',
        read: 'Vietnam’s studio base is still barely VC-penetrated — early cheques here buy a lot of upside.',
      },
      sections: [],
    },
    {
      id: 'i-2026-07-02',
      newsletter: 'games',
      date: '2026-07-02',
      status: 'published',
      submittedBy: 'AI worker (via MCP)',
      approvedBy: 'freud@bonfire',
      publishedAt: '2026-07-02',
      title: 'Bonfire SEA Games Daily — 2 July 2026',
      intro:
        "The month's throughline is capital flowing toward Southeast Asia. As Tencent trims overseas bets to fund AI, Gulf, Korean and homegrown money is hunting the region's studios — and the race to own ASEAN's payment rails and broadcasts is really a race to capture a market that keeps compounding.",
      image: {
        url: 'https://pmspzrmowzuryhdjnoeo.supabase.co/storage/v1/object/public/issue-images/games/2026-07-02/top.jpg',
        credit: 'Image: The Asia Business Daily',
      },
      topStory: {
        headline: 'Tencent starts selling down overseas game stakes to fund its AI war chest',
        source: 'The Asia Business Daily',
        url: 'https://www.asiae.co.kr/en/article/world-economy/2026062315185236604',
        summary:
          "Tencent — the games industry's most prolific strategic investor — is in talks to divest stakes in overseas studios, beginning with Japanese firms such as listed developer Marvelous, while leaving unlisted bets like FromSoftware and PlatinumGames untouched for now. It frames the sales as freeing capital to compete with Alibaba and ByteDance in AI.",
        read:
          "Tencent stepping back from non-core equity widens the field for Gulf, Korean and homegrown capital to move into Southeast Asia — and lets the region's publishers court a broader, less concentrated set of backers on stronger terms.",
      },
      sections: [
        {
          theme: 'Deals & funding',
          stories: [
            {
              headline: "Garena opens a venture arm to bankroll Vietnam's studios",
              source: 'Vietnam.vn',
              url: 'https://www.vietnam.vn/en/garena-viet-nam-cong-bo-mang-dau-tu-mao-hiem-dong-hanh-game-studio',
              summary:
                "Sea Group's Garena launched a Vietnam-focused investment division offering capital plus product, publishing, live-ops and growth support to local studios with global ambitions.",
              read:
                "The region's dominant publisher turning investor puts real capital and a global distribution path within reach at home — a fast lane from bootstrapped to exportable.",
            },
            {
              headline: "Thailand's SeaX Ventures leads a round into AI-RPG studio Onibi",
              source: 'TechNode Global',
              url: 'https://technode.global/2026/06/10/ai-game-studio-onibi-raises-funding-from-seax-ventures-to-develop-open-world-rpg-tomo-endless-blue/',
              summary:
                "Onibi, maker of the AI-powered open-world RPG Tomo: Endless Blue, closed an undisclosed strategic round led by Bangkok's SeaX Ventures alongside France's Pix Capital.",
              read:
                'Southeast Asian funds backing AI-native game tech is a sign the region is graduating from a mobile-publishing market into a launchpad for higher-value, world-facing studios.',
            },
            {
              headline: "Dealmakers circle Vietnam's studios as consolidation heats up",
              source: 'Mobidictum',
              url: 'https://mobidictum.com/mobidictum-mixer-hanoi-vietnam-2026/',
              summary:
                "Interest from M&A firms and global publishers in Vietnamese studios has 'only intensified'; a follow-up Hanoi mixer lands 15 July.",
              read:
                "With Vietnam's studio base barely 1–2% VC-penetrated, the runway is wide open — the first breakout Vietnamese-origin global hit could light up the whole ecosystem.",
            },
          ],
        },
        {
          theme: 'Platforms & distribution',
          stories: [
            {
              headline: "Coda ties up with Indonesia's creative-economy ministry to push local studios global",
              source: 'PR Newswire',
              url: 'https://en.prnasia.com/releases/apac/coda-and-ekraf-open-new-global-pathways-for-indonesian-game-developers-538790.shtml',
              summary:
                "Coda signed a memorandum with Indonesia's Ministry of Creative Economy to give local studios monetization tools, distribution and payment rails. Indonesia is ~22% of Coda's global revenue.",
              read:
                'Pairing a national ministry with a global payments platform hands Indonesian studios a genuine on-ramp to international revenue.',
            },
          ],
        },
        {
          theme: 'Esports business',
          stories: [
            {
              headline: 'Riot rewires VCT Challengers Southeast Asia and hands local broadcasters the rights',
              source: 'GosuGamers',
              url: 'https://www.gosugamers.net/valorant/news/77508-valorant-removes-ascension-from-vct-2026-opens-direct-promotion-path-from-stage-2',
              summary:
                'Riot restructured VCT Challengers SEA into a two-split, 12-team competition fed by five national qualifiers, and lifted streaming exclusivity so partners can carry local-language broadcasts.',
              read:
                'Opening the broadcast layer hands SEA telcos, streamers and sponsors a fresh, monetizable rights package — and a bigger local slice of esports value.',
            },
            {
              headline: "Krafton hands PUBG's esports broadcast to Naver's Chzzk in an exclusivity bet",
              source: 'The Korea Herald',
              url: 'https://www.koreaherald.com/article/10770595',
              summary:
                "Krafton signed a strategic agreement with Naver to co-promote PUBG esports exclusively on Chzzk, starting with the PUBG Nations Cup 2026, whose field includes Southeast Asian teams.",
              read:
                "Southeast Asia's massive PUBG Mobile audience becomes the prize — leverage the region's telcos and platforms can turn into local rights deals of their own.",
            },
          ],
        },
      ],
    },
  ],

  // Destinations are MASKED on purpose — real webhooks live in the host's env vars.
  channels: [
    { id: 'c-lark', newsletter: 'games', name: 'Games — Lark', type: 'lark', destination: 'https://open.larksuite.com/…/hook/••••••••', template: 'lark_card', enabled: true },
    { id: 'c-email', newsletter: 'games', name: 'Games — Email', type: 'email', destination: 'list: partners@bonfire (•••)', template: 'email_html', enabled: false },
    { id: 'c-line', newsletter: 'games', name: 'Games — Line', type: 'line', destination: 'LINE OA token ••••••••', template: 'line_flex', enabled: false },
    { id: 'c-wechat', newsletter: 'games', name: 'Games — WeChat (WeCom)', type: 'wechat', destination: 'https://qyapi.weixin.qq.com/…/send?key=••••', template: 'wecom_card', enabled: false },
  ],

  brief: {
    text: `Voice: Reuters/Economist business column — sharp, factual, with a genuine passion for games.

Selection (business-first): M&A, funding, partnerships, publishing/licensing deals, studio & publisher moves, new titles as commercial bets, platforms/distribution/payments/infra, esports BUSINESS (sponsorship, media rights, league economics — not match scores), regulation & market access.

All platforms (mobile, PC, console, cloud) and the wider ecosystem are in scope.

EXCLUDE: gamer-culture / consumer-trend / listicle / review / patch-note pieces. No gambling/i-gaming. No adult.

Opinion tone: OPPORTUNITY-FORWARD for Southeast Asia. Never frame a development as a threat or loss for the region — find the regional opening. Stay credible; no hype.

Recency: only stories published within ~30 days, publish date verified.
Dedup: strict, no repeats (90-day memory).
Every story needs a working source URL.`,
    sources: [
      'InvestGame', 'DealStreetAsia', 'PocketGamer.biz (Asia/SEA)', 'KED Global', 'Mobidictum',
      'Tech in Asia', 'Vietnam Investment Review', 'Niko Partners', 'Video Games Chronicle',
      'The Southeast Asia Desk', 'TechNode Global', 'Sensor Tower', 'Xsolla', 'UniPin / Coda',
      'Esports Insider', 'The Esports Advocate', 'Law.asia', 'Lexology', 'The Jakarta Post',
    ],
  },

  log: [
    { id: 'l1', issueId: 'i-2026-07-02', issueTitle: 'Bonfire SEA Games Daily — 2 July 2026', channel: 'lark', status: 'sent', response: 'StatusCode 0 · success', sentAt: '2026-07-02 11:42' },
  ],
};
