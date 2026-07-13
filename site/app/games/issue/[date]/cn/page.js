import { IssuePage } from '../shared';

export const revalidate = 300;

// Chinese issue — /games/issue/<date>/cn. 404s if no translation exists yet.
// This is the link management shares to land CN-reading stakeholders on the Chinese page.
export default async function GamesIssueCN({ params }) {
  return IssuePage({ date: params.date, lang: 'zh' });
}
