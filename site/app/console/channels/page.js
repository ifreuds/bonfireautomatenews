import Link from 'next/link';
import { isAuthed } from '../auth';
import { sendTest } from '../actions';

export const dynamic = 'force-dynamic';

const box = { maxWidth: 820, margin: '40px auto', padding: '0 16px', fontFamily: '-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif' };

// Real status. Lark is wired (fires on publish + testable here). The rest are
// deliberately "not built yet" — the row exists so the full loop is visible,
// but each needs its own integration before it can send.
function channels() {
  return [
    { key: 'web', name: 'Web', status: 'Live', color: '#1f7a3d',
      sends: 'Full article, hero + per-story images', dest: 'the public /games-review pages', action: 'web' },
    { key: 'lark', name: 'Lark', status: process.env.LARK_WEBHOOK_URL_GAMES ? 'Connected' : 'No webhook set',
      color: process.env.LARK_WEBHOOK_URL_GAMES ? '#1f7a3d' : '#a33',
      sends: 'Top story + linked headlines + button (links to the page; no inline image)',
      dest: 'LARK_WEBHOOK_URL_GAMES', action: 'lark' },
    { key: 'wechat', name: 'WeChat (WeCom)', status: 'Not built yet', color: '#999',
      sends: 'Card with thumbnail, similar to Lark', dest: '—',
      note: 'Small — needs a WeCom group-bot webhook (works much like Lark).' },
    { key: 'line', name: 'Line', status: 'Not built yet', color: '#999',
      sends: 'Compact card — top story only', dest: '—',
      note: 'Needs the Line Messaging API (channel access token + push).' },
    { key: 'email', name: 'Email', status: 'Not built yet', color: '#999',
      sends: 'Full article, hero + per-story images', dest: '—',
      note: 'Needs an email service (e.g. Resend/SES) + a recipient list.' },
  ];
}

export default function Channels({ searchParams }) {
  if (!isAuthed()) return <main style={box}><p><Link href="/console">Sign in first →</Link></p></main>;
  const rows = channels();

  return (
    <main style={box}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>Channels</h1>
        <Link href="/console" style={{ color: '#e8633a', fontSize: 13, textDecoration: 'none' }}>← queue</Link>
      </div>
      <p style={{ color: '#666', fontSize: 13 }}>
        Where an approved issue goes out. Each channel gets its own copy + image treatment.
        <b> Only Lark is wired today</b> — the rest are placeholders until their integration is built.
      </p>

      {searchParams?.sent === '1' && <p style={{ color: '#1f7a3d', fontSize: 13 }}>✓ Test card sent to Lark — check the group.</p>}
      {searchParams?.sent === '0' && <p style={{ color: '#a33', fontSize: 13 }}>Send failed — is a games-review issue published, and LARK_WEBHOOK_URL_GAMES / NOTIFY_SECRET set?</p>}
      {searchParams?.msg === 'notbuilt' && <p style={{ color: '#999', fontSize: 13 }}>That channel isn’t built yet.</p>}

      <div style={{ marginTop: 16, overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13.5, minWidth: 640 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #e5e5ea', color: '#888', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              <th style={{ padding: '8px 6px' }}>Channel</th>
              <th style={{ padding: '8px 6px' }}>Status</th>
              <th style={{ padding: '8px 6px' }}>What it sends</th>
              <th style={{ padding: '8px 6px' }}>Destination</th>
              <th style={{ padding: '8px 6px' }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.key} style={{ borderBottom: '1px solid #f0f0f3', verticalAlign: 'top' }}>
                <td style={{ padding: '12px 6px', fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: '12px 6px' }}><span style={{ color: c.color, fontWeight: 700, fontSize: 12 }}>{c.status}</span></td>
                <td style={{ padding: '12px 6px', color: '#555' }}>{c.sends}{c.note && <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>{c.note}</div>}</td>
                <td style={{ padding: '12px 6px', color: '#888', fontFamily: 'monospace', fontSize: 12 }}>{c.dest}</td>
                <td style={{ padding: '12px 6px' }}>
                  {c.action === 'lark' && (
                    <form action={sendTest}>
                      <input type="hidden" name="channel" value="lark" />
                      <button type="submit" style={{ padding: '7px 12px', background: '#1a1a2e', color: '#fff', border: 0, borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>Send test</button>
                    </form>
                  )}
                  {c.action === 'web' && <a href="/games-review" target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#e8633a' }}>View site →</a>}
                  {!c.action && <span style={{ color: '#bbb', fontSize: 12 }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ color: '#999', fontSize: 12, marginTop: 20 }}>
        The design mockup for the full channel manager (add channels, per-channel variants) is at <code>/admin/channels</code> — that one is not wired.
      </p>
    </main>
  );
}
