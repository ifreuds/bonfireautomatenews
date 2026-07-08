import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 300;

export default async function IssuePage({ params }) {
  const { date } = params;
  const { data: issue, error } = await supabase
    .from('issues')
    .select('issue_date, title, content_html')
    .eq('status', 'published')
    .eq('newsletter', 'cloud')
    .eq('issue_date', date)
    .maybeSingle();

  if (error || !issue) notFound();

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px', fontFamily: '-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif' }}>
      <div style={{ marginTop: 20 }}>
        <Link href="/" style={{ color: '#e8633a', fontSize: 13, textDecoration: 'none' }}>← All issues</Link>
      </div>
      <article
        style={{ marginTop: 12, background: '#fff', borderRadius: 10, overflow: 'hidden', marginBottom: 40 }}
        dangerouslySetInnerHTML={{ __html: issue.content_html }}
      />
    </main>
  );
}
