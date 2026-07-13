import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAuthed } from '../auth';
import { setStatus } from '../actions';
import { adminRpc, ADMIN_TOKEN } from '../../../lib/admin-rpc';
import IssueBody from '../../../lib/render-issue';

export const dynamic = 'force-dynamic';

const box = { maxWidth: 720, margin: '32px auto', padding: '0 16px', fontFamily: '-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif' };

function Btn({ id, newsletter, date, status, label, color }) {
  return (
    <form action={setStatus} style={{ display: 'inline' }}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="newsletter" value={newsletter} />
      <input type="hidden" name="date" value={date} />
      <input type="hidden" name="status" value={status} />
      <button type="submit" style={{ padding: '10px 16px', background: color, color: '#fff', border: 0, borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginRight: 8 }}>{label}</button>
    </form>
  );
}

export default async function ConsoleIssue({ params, searchParams }) {
  if (!isAuthed()) redirect('/console');

  const rows = await adminRpc('admin_get_issue', { p_token: ADMIN_TOKEN(), p_issue_id: params.id });
  const issue = rows && rows[0];
  if (!issue) {
    return <main style={box}><Link href="/console">← queue</Link><p>Issue not found.</p></main>;
  }

  const en = issue.content_json ? { ...issue.content_json, issue_date: issue.issue_date } : null;
  const cn = issue.content_json_cn ? { ...issue.content_json_cn, issue_date: issue.issue_date } : null;
  const d = issue.issue_date, n = issue.newsletter;

  return (
    <main style={box}>
      <Link href="/console" style={{ color: '#e8633a', fontSize: 13, textDecoration: 'none' }}>← queue</Link>

      <div style={{ margin: '14px 0 18px', padding: '14px 16px', background: '#f7f7fa', borderRadius: 8 }}>
        <div style={{ fontSize: 12, color: '#999' }}>{d} · {n} · submitted by {issue.submitted_by || 'unknown'}</div>
        <div style={{ fontSize: 18, fontWeight: 700, margin: '2px 0 12px' }}>{issue.title} <span style={{ fontSize: 12, color: '#888' }}>({issue.status})</span></div>

        {searchParams?.done && (
          <p style={{ fontSize: 13, color: '#1f7a3d', margin: '0 0 12px' }}>
            ✓ Set to <b>{searchParams.done}</b>{searchParams.sent === '1' ? ' · Lark message sent.' : searchParams.sent === '0' ? ' · Lark send FAILED (check LARK_WEBHOOK_URL_GAMES / NOTIFY_SECRET).' : ''}
          </p>
        )}

        {/* Actions by state */}
        {issue.status === 'pending' && (
          <div>
            <Btn id={issue.id} newsletter={n} date={d} status="approved" label="✓ Approve" color="#1f7a3d" />
            <Btn id={issue.id} newsletter={n} date={d} status="published" label="🚀 Publish & Send" color="#2b5fd0" />
            <Btn id={issue.id} newsletter={n} date={d} status="rejected" label="✕ Reject" color="#a33" />
          </div>
        )}
        {issue.status === 'approved' && (
          <div>
            <Btn id={issue.id} newsletter={n} date={d} status="published" label="🚀 Publish & Send" color="#2b5fd0" />
            <Btn id={issue.id} newsletter={n} date={d} status="pending" label="← Back to pending" color="#888" />
          </div>
        )}
        {issue.status === 'published' && (
          <div>
            <p style={{ fontSize: 13, margin: '0 0 8px' }}>Live at <a href={`/${n === 'games-review' ? 'games-review' : 'games'}/issue/${d}`} target="_blank" rel="noreferrer">/{n === 'games-review' ? 'games-review' : 'games'}/issue/{d}</a>{cn ? <> · <a href={`/${n === 'games-review' ? 'games-review' : 'games'}/issue/${d}/cn`} target="_blank" rel="noreferrer">/cn</a></> : null}</p>
            <Btn id={issue.id} newsletter={n} date={d} status="published" label="↻ Re-send Lark" color="#2b5fd0" />
          </div>
        )}
      </div>

      <div style={{ fontSize: 12, color: '#999', textTransform: 'uppercase', letterSpacing: 1, margin: '18px 0 6px' }}>English preview</div>
      {en ? <IssueBody issue={en} lang="en" /> : <p style={{ color: '#a33' }}>No English content.</p>}

      <div style={{ fontSize: 12, color: '#999', textTransform: 'uppercase', letterSpacing: 1, margin: '28px 0 6px' }}>中文 preview {cn ? '' : '(none submitted)'}</div>
      {cn && <IssueBody issue={cn} lang="zh" />}
    </main>
  );
}
