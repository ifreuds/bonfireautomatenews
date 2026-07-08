'use client';

import { useStore } from '../../../lib/skeleton-store';

export default function Brief() {
  const [state, update] = useStore();
  if (!state) return <p>Loading…</p>;

  const setBrief = (text) => update((s) => { s.brief.text = text; return s; });
  const setSources = (text) => update((s) => { s.brief.sources = text.split('\n').map((x) => x.trim()).filter(Boolean); return s; });

  return (
    <section>
      <h2 style={{ fontSize: 17 }}>Brief &amp; sources</h2>
      <p style={{ fontSize: 14, color: '#555' }}>
        The AI’s instructions live <strong>here, in the app</strong> — not inside the AI. Any AI worker fetches this
        over MCP (<code>get_brief()</code>) at run time. That is what makes the AI swappable: change the model, keep the brief.
      </p>

      <h3 style={{ fontSize: 15, marginBottom: 4 }}>Editorial brief</h3>
      <textarea
        value={state.brief.text}
        onChange={(e) => setBrief(e.target.value)}
        rows={22}
        style={{ width: '100%', padding: 8, fontFamily: 'monospace', fontSize: 12 }}
      />

      <h3 style={{ fontSize: 15, marginBottom: 4, marginTop: 20 }}>Trusted sources (one per line)</h3>
      <textarea
        value={state.brief.sources.join('\n')}
        onChange={(e) => setSources(e.target.value)}
        rows={10}
        style={{ width: '100%', padding: 8, fontFamily: 'monospace', fontSize: 12 }}
      />
      <p style={{ fontSize: 12, color: '#888' }}>{state.brief.sources.length} sources — served to the AI via <code>get_sources()</code>.</p>
    </section>
  );
}
