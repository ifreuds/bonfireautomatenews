import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export const revalidate = 60;

// Archive for the APPROVAL track. Everything here went through: AI submits a
// draft (via MCP) → a human approves → published. Separate from the legacy
// auto-published /games so the two pipelines never collide.
export default async function GamesReviewHome() {
  const { data: issues, error } = await supabase
    .from('issues')
    .select('issue_date, title')
    .eq('status', 'published')
    .eq('newsletter', 'games-review')
    .order('issue_date', { ascending: false });

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px', fontFamily: '-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif' }}>
      <header style={{ background: '#1a1a2e', borderRadius: 10, padding: '28px 28px', marginTop: 24 }}>
        <div style={{ color: '#e8633a', fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>🎮 BONFIRE SEA GAMES — REVIEW TRACK</div>
        <div style={{ color: '#fff', fontSize: 24, fontWeight: 700, marginTop: 6 }}>The archive</div>
        <div style={{ color: '#aaa', fontSize: 14, marginTop: 6 }}>Human-approved issues from the MCP pipeline. Each was submitted by an AI and approved before publishing.</div>
        <div style={{ marginTop: 14 }}>
          <Link href="/games" style={{ color: '#e8633a', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>🎮 Legacy daily (auto-published) →</Link>
        </div>
      </header>

      <section style={{ marginTop: 20, paddingBottom: 40 }}>
        {error && <p style={{ color: '#c00' }}>Could not load issues.</p>}
        {!error && (!issues || issues.length === 0) && (
          <p style={{ color: '#666' }}>No approved issues yet. Submit one through the MCP pipeline and approve it — it will appear here.</p>
        )}
        {issues && issues.map((it) => (
          <Link key={it.issue_date} href={`/games-review/issue/${it.issue_date}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 8, padding: '16px 20px', marginBottom: 12, border: '1px solid #ececf0' }}>
              <div style={{ fontSize: 12, color: '#e8633a', fontWeight: 600 }}>{it.issue_date}</div>
              <div style={{ fontSize: 17, color: '#1a1a2e', fontWeight: 600, marginTop: 4 }}>{it.title}</div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
