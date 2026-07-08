'use client';

import { useStore } from '../../../lib/skeleton-store';
import { Status } from '../_ui';

export default function DistributionLog() {
  const [state] = useStore();
  if (!state) return <p>Loading…</p>;

  return (
    <section>
      <h2 style={{ fontSize: 17 }}>Distribution log</h2>
      <p style={{ fontSize: 14, color: '#555' }}>
        One row per channel per publish. In the real app this records the send result and allows a retry.
      </p>

      {state.log.length === 0 ? (
        <p style={{ color: '#888' }}><em>Nothing sent yet. Approve and publish an issue to populate this.</em></p>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #ccc' }}>
              <th style={{ padding: 6 }}>Sent at</th>
              <th style={{ padding: 6 }}>Issue</th>
              <th style={{ padding: 6 }}>Channel</th>
              <th style={{ padding: 6 }}>Status</th>
              <th style={{ padding: 6 }}>Response</th>
              <th style={{ padding: 6 }}></th>
            </tr>
          </thead>
          <tbody>
            {state.log.map((l) => (
              <tr key={l.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 6, whiteSpace: 'nowrap' }}>{l.sentAt}</td>
                <td style={{ padding: 6 }}>{l.issueTitle}</td>
                <td style={{ padding: 6 }}><code>{l.channel}</code></td>
                <td style={{ padding: 6 }}><Status value={l.status} /></td>
                <td style={{ padding: 6, color: '#666' }}>{l.response}</td>
                <td style={{ padding: 6 }}><button disabled title="Not wired in the skeleton">Retry</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
