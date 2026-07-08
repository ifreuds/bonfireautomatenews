'use client';

import Link from 'next/link';
import { resetState } from '../../lib/skeleton-store';

const nav = [
  ['/admin', 'Review queue'],
  ['/admin/channels', 'Channels'],
  ['/admin/brief', 'Brief & sources'],
  ['/admin/log', 'Distribution log'],
  ['/admin/login', 'Login'],
];

export default function AdminLayout({ children }) {
  return (
    <div style={{ maxWidth: 940, margin: '0 auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ border: '1px dashed #999', padding: '8px 12px', marginBottom: 12, fontSize: 13 }}>
        <strong>SKELETON — unstyled on purpose.</strong> Mock data in your browser only; nothing touches the live
        database and nothing is really sent. Design team applies the company CI on top of this.
        <button onClick={() => { resetState(); location.reload(); }} style={{ marginLeft: 12 }}>
          Reset demo data
        </button>
      </div>

      <header style={{ borderBottom: '1px solid #ccc', paddingBottom: 8, marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, margin: '0 0 8px' }}>Bonfire Newsletter — Admin</h1>
        <nav style={{ display: 'flex', gap: 14, fontSize: 14, flexWrap: 'wrap' }}>
          {nav.map(([href, label]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
          <span style={{ marginLeft: 'auto', color: '#666' }}>signed in as <strong>freud@bonfire</strong> (approver)</span>
        </nav>
      </header>

      {children}

      <footer style={{ marginTop: 32, borderTop: '1px solid #eee', paddingTop: 10, fontSize: 12, color: '#666' }}>
        Public site: <Link href="/games">/games</Link> · Spec: <code>MVP_Approval_Platform_Spec.md</code>
      </footer>
    </div>
  );
}
