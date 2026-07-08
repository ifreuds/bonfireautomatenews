import { supabase } from '../../../../lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import IssueBody from '../../../../lib/render-issue';

export const revalidate = 300;

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function dateLabel(iso) {
  const [y, m, d] = String(iso).split('-');
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
}

export default async function GamesIssuePage({ params }) {
  const { date } = params;
  const { data: issue, error } = await supabase
    .from('issues')
    .select('issue_date, title, content_json, content_html')
    .eq('status', 'published')
    .eq('newsletter', 'games')
    .eq('issue_date', date)
    .maybeSingle();

  if (error || !issue) notFound();

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px', fontFamily: '-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif' }}>
      <div style={{ marginTop: 20 }}>
        <Link href="/games" style={{ color: '#e8633a', fontSize: 13, textDecoration: 'none' }}>← All issues</Link>
      </div>

      <article style={{ marginTop: 12, background: '#fff', borderRadius: 10, overflow: 'hidden', marginBottom: 40 }}>
        {issue.content_json ? (
          // Rendered by the app from structured data — the layout lives in lib/render-issue.js
          <IssueBody issue={issue.content_json} dateLabel={dateLabel(issue.issue_date)} />
        ) : (
          // Legacy issues that only have AI-written HTML
          <div dangerouslySetInnerHTML={{ __html: issue.content_html }} />
        )}
      </article>
    </main>
  );
}
