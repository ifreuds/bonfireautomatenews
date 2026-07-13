import { supabase } from '../../../../lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import IssueBody from '../../../../lib/render-issue';

/**
 * Shared fetch-and-render for a games issue, in either language, for either
 * pipeline (the legacy auto-published 'games' track, or the approval-gated
 * 'games-review' track). Both sets of routes call this.
 *
 * newsletter: which DB track to read ('games' | 'games-review').
 * basePath:   the URL prefix for this track ('/games' | '/games-review'),
 *             used for the archive back-link and the EN↔中文 toggle.
 *
 * lang='en' → content_json (always present on a published issue).
 * lang='zh' → content_json_cn; if the issue has no translation yet, the /cn
 *             URL 404s so a shared link is never a half-translated page.
 */
export async function IssuePage({ date, lang, newsletter = 'games', basePath = '/games' }) {
  const { data: issue, error } = await supabase
    .from('issues')
    .select('issue_date, title, content_json, content_json_cn, content_html')
    .eq('status', 'published')
    .eq('newsletter', newsletter)
    .eq('issue_date', date)
    .maybeSingle();

  if (error || !issue) notFound();

  const hasCN = !!issue.content_json_cn;
  if (lang === 'zh' && !hasCN) notFound(); // no translation → don't serve a mixed-language page

  const raw = lang === 'zh' ? issue.content_json_cn : issue.content_json;
  const content = raw ? { ...raw, issue_date: issue.issue_date } : null;

  const T = {
    en: { back: '← All issues', toggle: '中文', toggleHref: `${basePath}/issue/${issue.issue_date}/cn` },
    zh: { back: '← 返回所有期', toggle: 'EN', toggleHref: `${basePath}/issue/${issue.issue_date}` },
  };
  const t = T[lang];

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px', fontFamily: '-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif' }}>
      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href={basePath} style={{ color: '#e8633a', fontSize: 13, textDecoration: 'none' }}>{t.back}</Link>
        {hasCN && (
          <Link href={t.toggleHref} style={{ color: '#e8633a', fontSize: 13, fontWeight: 600, textDecoration: 'none', border: '1px solid #e8633a', borderRadius: 6, padding: '3px 10px' }}>
            {t.toggle}
          </Link>
        )}
      </div>

      <article style={{ marginTop: 12, background: '#fff', borderRadius: 10, overflow: 'hidden', marginBottom: 40 }}>
        {content ? (
          <IssueBody issue={content} lang={lang} />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: issue.content_html }} />
        )}
      </article>
    </main>
  );
}
