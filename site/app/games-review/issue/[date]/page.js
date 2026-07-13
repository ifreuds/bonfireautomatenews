import { IssuePage } from '../../../games/issue/[date]/shared';

export const revalidate = 60; // review track refreshes faster while testing

// English issue on the APPROVAL track (newsletter='games-review').
// Populated only by human-approved drafts from the MCP pipeline — the legacy
// daily auto-publisher writes 'games' and never touches this.
export default async function ReviewIssueEN({ params }) {
  return IssuePage({ date: params.date, lang: 'en', newsletter: 'games-review', basePath: '/games-review' });
}
