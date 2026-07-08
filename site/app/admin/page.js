'use client';

import Link from 'next/link';
import { useStore } from '../../lib/skeleton-store';
import { Status } from './_ui';

const ORDER = { pending: 0, approved: 1, rejected: 2, published: 3 };

export default function ReviewQueue() {
  const [state] = useStore();
  if (!state) return <p>Loading…</p>;

  const issues = [...state.issues].sort(
    (a, b) => (ORDER[a.status] - ORDER[b.status]) || b.date.localeCompare(a.date)
  );
  const pending = issues.filter((i) => i.status === 'pending').length;

  return (
    <section>
      <h2 style={{ fontSize: 17 }}>Review queue</h2>
      <p style={{ fontSize: 14, color: '#555' }}>
        {pending} draft{pending === 1 ? '' : 's'} submitted by the AI, awaiting a human. Nothing publishes until approved.
      </p>

      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: 6 }}>Status</th>
            <th style={{ padding: 6 }}>Date</th>
            <th style={{ padding: 6 }}>Title</th>
            <th style={{ padding: 6 }}>Submitted by</th>
            <th style={{ padding: 6 }}></th>
          </tr>
        </thead>
        <tbody>
          {issues.map((i) => (
            <tr key={i.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 6 }}><Status value={i.status} /></td>
              <td style={{ padding: 6 }}>{i.date}</td>
              <td style={{ padding: 6 }}>{i.title}</td>
              <td style={{ padding: 6, color: '#666' }}>{i.submittedBy}</td>
              <td style={{ padding: 6 }}>
                <Link href={`/admin/issues/${i.id}`}>
                  {i.status === 'pending' ? 'Review →' : 'Open →'}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
