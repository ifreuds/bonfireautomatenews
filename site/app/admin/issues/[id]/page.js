'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore, CHANNELS, CHANNEL_INFO, getVariant, allStories } from '../../../../lib/skeleton-store';
import { Status } from '../../_ui';

const now = () => new Date().toISOString().slice(0, 16).replace('T', ' ');

export default function ArticleEditor({ params }) {
  const [state, update] = useStore();
  const [tab, setTab] = useState('web');

  if (!state) return <p>Loading…</p>;
  const issue = state.issues.find((i) => i.id === params.id);
  if (!issue) return <p>Not found. <Link href="/admin">← Review queue</Link></p>;

  const variant = getVariant(issue, tab);
  const info = CHANNEL_INFO[tab];

  const setVariant = (patch) =>
    update((s) => {
      const it = s.issues.find((i) => i.id === issue.id);
      it.variants = it.variants || {};
      it.variants[tab] = { ...getVariant(it, tab), ...patch, overridden: true };
      return s;
    });

  const resetVariant = () =>
    update((s) => {
      const it = s.issues.find((i) => i.id === issue.id);
      if (it.variants) delete it.variants[tab];
      return s;
    });

  const setStatus = (status, extra = {}) =>
    update((s) => {
      const it = s.issues.find((i) => i.id === issue.id);
      Object.assign(it, { status }, extra);
      return s;
    });

  const publish = () =>
    update((s) => {
      const it = s.issues.find((i) => i.id === issue.id);
      it.status = 'published';
      it.publishedAt = now();
      const targets = s.channels.filter((c) => c.newsletter === it.newsletter && c.enabled);
      targets.forEach((c, n) =>
        s.log.unshift({
          id: `l-${Date.now()}-${n}`,
          issueId: it.id,
          issueTitle: it.title,
          channel: c.type,
          status: 'sent',
          response: 'skeleton — simulated, nothing really sent',
          sentAt: now(),
        })
      );
      return s;
    });

  const enabled = state.channels.filter((c) => c.newsletter === issue.newsletter && c.enabled);

  return (
    <section>
      <p style={{ fontSize: 13 }}><Link href="/admin">← Review queue</Link></p>

      <h2 style={{ fontSize: 18, marginBottom: 4 }}>{issue.title}</h2>
      <p style={{ fontSize: 13, color: '#666' }}>
        <Status value={issue.status} /> &nbsp; {issue.date} &nbsp;·&nbsp; submitted by {issue.submittedBy}
        {issue.publishedAt ? <> &nbsp;·&nbsp; published {issue.publishedAt}</> : null}
      </p>

      {/* ---- actions ---- */}
      <div style={{ border: '1px solid #ccc', padding: 10, margin: '12px 0', fontSize: 14 }}>
        <strong>Actions</strong>{' '}
        {issue.status === 'pending' && (
          <>
            <button onClick={() => setStatus('approved', { approvedBy: 'freud@bonfire' })}>Approve</button>{' '}
            <button onClick={() => { const note = prompt('Reason for rejecting?') || '—'; setStatus('rejected', { rejectNote: note }); }}>Reject</button>
          </>
        )}
        {issue.status === 'approved' && (
          <>
            <button onClick={publish}><strong>Publish</strong></button>{' '}
            <span style={{ color: '#666' }}>→ will push to {enabled.length} enabled channel{enabled.length === 1 ? '' : 's'}: {enabled.map((c) => c.type).join(', ') || 'none'}</span>
          </>
        )}
        {issue.status === 'published' && <span style={{ color: '#059' }}>Published. See the <Link href="/admin/log">distribution log</Link>.</span>}
        {issue.status === 'rejected' && <span style={{ color: '#a00' }}>Rejected: {issue.rejectNote} · <button onClick={() => setStatus('pending')}>reopen</button></span>}
      </div>

      {/* ---- canonical article ---- */}
      <details style={{ marginBottom: 14, fontSize: 14 }}>
        <summary><strong>Canonical article</strong> ({allStories(issue).length} stories) — the single source the channels derive from</summary>
        <div style={{ padding: '8px 0' }}>
          {issue.image?.url ? (
            <p><img src={issue.image.url} alt="" style={{ maxWidth: 320, display: 'block' }} /><small style={{ color: '#888' }}>{issue.image.credit}</small></p>
          ) : <p style={{ color: '#888' }}><em>No image attached.</em></p>}
          <p><em>{issue.intro}</em></p>
          <p><strong>★ {issue.topStory.headline}</strong><br /><small>{issue.topStory.source}</small></p>
          {(issue.sections || []).map((s) => (
            <div key={s.theme}>
              <p style={{ margin: '8px 0 2px' }}><strong>{s.theme}</strong></p>
              <ul style={{ margin: 0 }}>{s.stories.map((st) => <li key={st.headline}>{st.headline}</li>)}</ul>
            </div>
          ))}
        </div>
      </details>

      {/* ---- per-channel variants ---- */}
      <h3 style={{ fontSize: 15 }}>Channel versions</h3>
      <p style={{ fontSize: 13, color: '#555' }}>
        Each channel gets its own copy and image, derived from the canonical article. Edit one and it becomes an override.
      </p>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {CHANNELS.map((c) => {
          const isOverridden = issue.variants?.[c]?.overridden;
          return (
            <button key={c} onClick={() => setTab(c)} style={{ fontWeight: tab === c ? 700 : 400 }}>
              {CHANNEL_INFO[c].label}{isOverridden ? ' *' : ''}
            </button>
          );
        })}
        <span style={{ fontSize: 12, color: '#888', alignSelf: 'center' }}>* = overridden</span>
      </div>

      <div style={{ border: '1px solid #ccc', padding: 12, fontSize: 14 }}>
        <p style={{ margin: '0 0 8px', color: '#666', fontSize: 13 }}>
          <strong>{info.label}:</strong> {info.copy} &nbsp;·&nbsp; Image: {info.image}
          {variant.overridden ? <> &nbsp;·&nbsp; <button onClick={resetVariant}>reset to derived</button></> : null}
        </p>

        <label style={{ display: 'block', fontSize: 13 }}>Headline</label>
        <input value={variant.headline} onChange={(e) => setVariant({ headline: e.target.value })} style={{ width: '100%', padding: 6, marginBottom: 8 }} />

        <label style={{ display: 'block', fontSize: 13 }}>Image URL {tab === 'lark' ? '(Lark cards can’t embed images — leave blank)' : ''}</label>
        <input value={variant.imageUrl} onChange={(e) => setVariant({ imageUrl: e.target.value })} style={{ width: '100%', padding: 6, marginBottom: 8 }} />
        {variant.imageUrl ? <img src={variant.imageUrl} alt="" style={{ maxWidth: 240, display: 'block', marginBottom: 8 }} /> : null}

        <label style={{ display: 'block', fontSize: 13 }}>Body ({tab})</label>
        <textarea value={variant.body} onChange={(e) => setVariant({ body: e.target.value })} rows={14} style={{ width: '100%', padding: 6, fontFamily: 'monospace', fontSize: 12 }} />
      </div>
    </section>
  );
}
