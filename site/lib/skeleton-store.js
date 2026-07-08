'use client';
// SKELETON STORE — browser-only, backed by localStorage. No database, no API calls.
// Lets you click Approve → Publish → see the distribution log, so the flow is testable.

import { useEffect, useState } from 'react';
import { seed } from './skeleton-data';

const KEY = 'bonfire-skeleton-v1';

export const CHANNELS = ['web', 'lark', 'email', 'line', 'wechat'];

export const CHANNEL_INFO = {
  web:    { label: 'Web',    image: 'Hero image (~1200w)',        copy: 'Full article' },
  lark:   { label: 'Lark',   image: 'No inline image — links to the page', copy: 'Top story + linked headlines + button' },
  email:  { label: 'Email',  image: 'Hosted image, ~600w',        copy: 'Full article, hero + per-story images' },
  line:   { label: 'Line',   image: 'Flex message accepts image URL', copy: 'Compact card — top story only' },
  wechat: { label: 'WeChat', image: 'WeCom card thumbnail (URL ok)', copy: 'Card, like Lark' },
};

export function loadState() {
  if (typeof window === 'undefined') return seed;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : seed;
  } catch {
    return seed;
  }
}

export function saveState(s) {
  try { window.localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
}

export function resetState() {
  try { window.localStorage.removeItem(KEY); } catch {}
}

/** Hook: [state, update]. `update(fn)` mutates a copy and persists it. */
export function useStore() {
  const [state, setState] = useState(null); // null until mounted (avoids hydration mismatch)
  useEffect(() => { setState(loadState()); }, []);
  const update = (fn) => setState((prev) => {
    const next = fn(JSON.parse(JSON.stringify(prev)));
    saveState(next);
    return next;
  });
  return [state, update];
}

export const allStories = (issue) => [
  issue.topStory,
  ...(issue.sections || []).flatMap((s) => s.stories || []),
];

/**
 * Derive a channel's copy + image from the canonical article.
 * This is the "one canonical article, many channel renderings" rule in code.
 */
export function deriveVariant(issue, channel) {
  const stories = allStories(issue);
  const hero = issue.image?.url || '';

  if (channel === 'lark' || channel === 'wechat') {
    const body =
      `${issue.intro}\n\n` +
      `★ TOP STORY\n${issue.topStory.headline}\n${issue.topStory.summary}\n${issue.topStory.read}\n\n` +
      (issue.sections || [])
        .map((s) => `${s.theme}\n` + s.stories.map((st) => `• ${st.headline} — ${st.read}`).join('\n'))
        .join('\n\n') +
      `\n\n[ Open the full issue ]`;
    return { headline: issue.title, body, imageUrl: channel === 'wechat' ? hero : '', overridden: false };
  }

  if (channel === 'line') {
    return {
      headline: issue.title,
      body: `${issue.intro}\n\n${issue.topStory.headline}\n${issue.topStory.read}\n\n[ Read more ]`,
      imageUrl: hero,
      overridden: false,
    };
  }

  // web + email: the full article
  const body =
    `${issue.intro}\n\n` +
    stories.map((st) => `${st.headline}\n${st.source}\n${st.summary}\n${st.read}`).join('\n\n---\n\n');
  return { headline: issue.title, body, imageUrl: hero, overridden: false };
}

export function getVariant(issue, channel) {
  const saved = issue.variants?.[channel];
  return saved?.overridden ? saved : deriveVariant(issue, channel);
}
