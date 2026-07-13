import { IssuePage } from './shared';

export const revalidate = 300;

// English issue — the bare URL. Existing links and Lark cards point here.
export default async function GamesIssueEN({ params }) {
  return IssuePage({ date: params.date, lang: 'en' });
}
