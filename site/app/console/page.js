import Link from 'next/link';
import { isAuthed } from './auth';
import { login, logout } from './actions';
import { adminRpc, ADMIN_TOKEN } from '../../lib/admin-rpc';

export const dynamic = 'force-dynamic';

const STATUS_COLOR = { pending: '#b8860b', approved: '#1f7a3d', published: '#2b5fd0', rejected: '#a33', draft: '#888' };
const box = { maxWidth: 720, margin: '40px auto', padding: '0 16px', fontFamily: '-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif' };

export default async function Console({ searchParams }) {
  if (!isAuthed()) {
    return (
      <main style={box}>
        <h1 style={{ fontSize: 22 }}>Bonfire — Approval Console</h1>
        <p style={{ color: '#666', fontSize: 14 }}>Enter the console password to review and publish issues.</p>
        {searchParams?.e && <p style={{ color: '#c00', fontSize: 13 }}>Wrong password.</p>}
        <form action={login} style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <input name="password" type="password" placeholder="password" autoComplete="current-password"
            style={{ flex: 1, padding: '10px 12px', border: '1px solid #ccc', borderRadius: 6, fontSize: 15 }} />
          <button type="submit" style={{ padding: '10px 18px', background: '#1a1a2e', color: '#fff', border: 0, borderRadius: 6, fontSize: 15, cursor: 'pointer' }}>Sign in</button>
        </form>
      </main>
    );
  }

  const issues = await adminRpc('admin_list_issues', { p_token: ADMIN_TOKEN(), p_newsletter: 'games-review' });

  return (
    <main style={box}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>Approval queue — games-review</h1>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link href="/console/channels" style={{ color: '#e8633a', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>Channels →</Link>
          <form action={logout}><button type="submit" style={{ background: 'none', border: 0, color: '#888', fontSize: 13, cursor: 'pointer' }}>Sign out</button></form>
        </div>
      </div>
      <p style={{ color: '#666', fontSize: 13 }}>Drafts submitted by the AI land here as <b>pending</b>. Open one to preview and publish.</p>

      {(!issues || issues.length === 0) && <p style={{ color: '#666', marginTop: 24 }}>Nothing in the queue yet. When the AI submits a draft it will appear here.</p>}

      <div style={{ marginTop: 16 }}>
        {(issues || []).map((it) => (
          <Link key={it.id} href={`/console/${it.id}`} style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '14px 16px', border: '1px solid #ececf0', borderRadius: 8, marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 12, color: '#999' }}>{it.issue_date} · {it.stories} stories · {it.submitted_by || 'unknown'}</div>
                <div style={{ fontSize: 16, color: '#1a1a2e', fontWeight: 600, marginTop: 2 }}>{it.title}</div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: STATUS_COLOR[it.status] || '#888' }}>{it.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
