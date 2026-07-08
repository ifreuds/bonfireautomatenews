'use client';

import Link from 'next/link';

export default function Login() {
  return (
    <section style={{ maxWidth: 380 }}>
      <h2 style={{ fontSize: 17 }}>Sign in</h2>
      <p style={{ fontSize: 13, color: '#666' }}>
        Placeholder. Real auth (Supabase Auth + roles: admin / editor / approver) is wired after the design pass.
      </p>
      <form onSubmit={(e) => { e.preventDefault(); location.href = '/admin'; }}>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 13 }}>Email</label>
          <input defaultValue="freud@bonfire" style={{ width: '100%', padding: 6 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 13 }}>Password</label>
          <input type="password" defaultValue="••••••••" style={{ width: '100%', padding: 6 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 13 }}>Role (demo)</label>
          <select defaultValue="approver" style={{ width: '100%', padding: 6 }}>
            <option value="admin">admin</option>
            <option value="editor">editor</option>
            <option value="approver">approver</option>
          </select>
        </div>
        <button type="submit">Sign in</button>{' '}
        <Link href="/admin" style={{ fontSize: 13 }}>skip →</Link>
      </form>
    </section>
  );
}
