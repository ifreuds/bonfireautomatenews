'use client';

const COLORS = { pending: '#8a6d00', approved: '#0a6', rejected: '#a00', published: '#059', draft: '#666', sent: '#0a6', failed: '#a00' };

export function Status({ value }) {
  const c = COLORS[value] || '#666';
  return (
    <span style={{ border: `1px solid ${c}`, color: c, borderRadius: 3, padding: '1px 6px', fontSize: 12 }}>
      {value}
    </span>
  );
}
