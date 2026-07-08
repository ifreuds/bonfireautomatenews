'use client';

import { useState } from 'react';
import { useStore, CHANNEL_INFO } from '../../../lib/skeleton-store';

export default function Channels() {
  const [state, update] = useStore();
  const [form, setForm] = useState({ name: '', type: 'lark', destination: '' });
  if (!state) return <p>Loading…</p>;

  const toggle = (id) =>
    update((s) => {
      const c = s.channels.find((x) => x.id === id);
      c.enabled = !c.enabled;
      return s;
    });

  const add = (e) => {
    e.preventDefault();
    if (!form.name) return;
    update((s) => {
      s.channels.push({
        id: `c-${Date.now()}`,
        newsletter: 'games',
        name: form.name,
        type: form.type,
        destination: form.destination || '(not set)',
        template: `${form.type}_default`,
        enabled: false,
      });
      return s;
    });
    setForm({ name: '', type: 'lark', destination: '' });
  };

  return (
    <section>
      <h2 style={{ fontSize: 17 }}>Channels</h2>
      <p style={{ fontSize: 14, color: '#555' }}>
        Where an approved issue gets pushed. Each channel has its own template and its own copy + image.
        Destinations are masked here — real webhooks live in the host’s environment variables.
      </p>

      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14, marginBottom: 24 }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: 6 }}>On</th>
            <th style={{ padding: 6 }}>Name</th>
            <th style={{ padding: 6 }}>Type</th>
            <th style={{ padding: 6 }}>Destination</th>
            <th style={{ padding: 6 }}>Template</th>
            <th style={{ padding: 6 }}>Image support</th>
            <th style={{ padding: 6 }}></th>
          </tr>
        </thead>
        <tbody>
          {state.channels.map((c) => (
            <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 6 }}><input type="checkbox" checked={c.enabled} onChange={() => toggle(c.id)} /></td>
              <td style={{ padding: 6 }}>{c.name}</td>
              <td style={{ padding: 6 }}><code>{c.type}</code></td>
              <td style={{ padding: 6, color: '#666' }}>{c.destination}</td>
              <td style={{ padding: 6 }}><code>{c.template}</code></td>
              <td style={{ padding: 6, fontSize: 12, color: '#666' }}>{CHANNEL_INFO[c.type]?.image || '—'}</td>
              <td style={{ padding: 6 }}><button disabled title="Not wired in the skeleton">Send test</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ fontSize: 15 }}>Add a channel</h3>
      <form onSubmit={add} style={{ fontSize: 14, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', fontSize: 13 }}>Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Games — Partners email" style={{ padding: 6 }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13 }}>Type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ padding: 6 }}>
            {['lark', 'email', 'line', 'wechat'].map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13 }}>Destination</label>
          <input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="webhook / token / list" style={{ padding: 6 }} />
        </div>
        <button type="submit">Add</button>
      </form>
    </section>
  );
}
