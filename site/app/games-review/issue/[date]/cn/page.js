import { IssuePage } from '../../../../games/issue/[date]/shared';

export const revalidate = 60;

// Chinese issue on the approval track — /games-review/issue/<date>/cn.
// 404s until a translation exists.
export default async function ReviewIssueCN({ params }) {
  return IssuePage({ date: params.date, lang: 'zh', newsletter: 'games-review', basePath: '/games-review' });
}
