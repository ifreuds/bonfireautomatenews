/**
 * The issue renderer.
 *
 * The AI produces STRUCTURED DATA ONLY (content_json). This template turns it into
 * the page. That is what guarantees every issue has the same layout — the design
 * team owns this file, not the prompt.
 *
 * Per-story anatomy: hero/thumbnail · linked headline · short summary · our take (italic) · source.
 */

const INK = '#1a1a2e';
const ACCENT = '#e8633a';

/**
 * Standing rights + takedown notice. Site-level, not per-issue content —
 * so it appears on every issue regardless of what the pipeline wrote.
 *
 * CONTACT_EMAIL must be a real, MONITORED inbox. An unread takedown address is
 * worse than none: the rightsholder emails, hears nothing, and escalates.
 */
const CONTACT_EMAIL = 'hello@bonfiregathering.com';

const RIGHTS_NOTICE =
  'Images are reproduced for editorial commentary with attribution and remain the property of their respective owners. Every headline links to the original article.';

/** Supabase image transform: exact cover crop, auto-WebP for browsers. */
export function img(url, w, h, q = 76) {
  if (!url) return null;
  const base = url.replace('/object/public/', '/render/image/public/');
  return `${base}?width=${w}&height=${h}&resize=cover&quality=${q}`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function prettyDate(iso) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split('-');
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
}

function Byline({ story }) {
  const when = prettyDate(story.published);
  return (
    <p style={{ margin: '6px 0 0', fontSize: 11, color: '#8a8a93', textTransform: 'uppercase', letterSpacing: '.5px' }}>
      {story.source}{when ? ` · ${when}` : ''}
    </p>
  );
}

/** The lead story: full-width hero. */
function TopStory({ story }) {
  const hero = img(story.image?.url, 1200, 675);
  return (
    <div style={{ background: '#fbf6f3', borderRadius: 8, padding: '18px 20px', marginBottom: 28 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 1, marginBottom: 10 }}>★ TOP STORY</div>

      {hero && (
        <a href={story.url} target="_blank" rel="noopener noreferrer">
          <img src={hero} alt="" style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: 6, display: 'block', marginBottom: 6 }} />
        </a>
      )}
      {story.image?.credit && (
        <div style={{ fontSize: 10, color: '#9a9aa2', marginBottom: 12 }}>{story.image.credit}</div>
      )}

      <h2 style={{ margin: '0 0 8px', fontSize: 21, lineHeight: 1.3 }}>
        <a href={story.url} target="_blank" rel="noopener noreferrer" style={{ color: INK, textDecoration: 'none' }}>
          {story.headline}
        </a>
      </h2>
      <p style={{ margin: '0 0 8px', fontSize: 14.5, lineHeight: 1.6, color: '#333' }}>{story.summary}</p>
      {story.why_it_matters && (
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: '#6b6b6b', fontStyle: 'italic' }}>{story.why_it_matters}</p>
      )}
      <Byline story={story} />
    </div>
  );
}

/** Every other story: thumbnail + text. Degrades to a text-only card when there's no image. */
function StoryCard({ story }) {
  const thumb = img(story.image?.url, 320, 180);
  return (
    <article style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 24 }}>
      {thumb && (
        <a href={story.url} target="_blank" rel="noopener noreferrer" style={{ flex: '0 0 160px' }}>
          <img src={thumb} alt="" style={{ width: 160, height: 90, objectFit: 'cover', borderRadius: 6, display: 'block' }} />
        </a>
      )}
      <div style={{ flex: '1 1 260px', minWidth: 220 }}>
        <h3 style={{ margin: '0 0 6px', fontSize: 16.5, lineHeight: 1.35 }}>
          <a href={story.url} target="_blank" rel="noopener noreferrer" style={{ color: INK, textDecoration: 'none' }}>
            {story.headline}
          </a>
        </h3>
        <p style={{ margin: '0 0 6px', fontSize: 14, lineHeight: 1.6, color: '#333' }}>{story.summary}</p>
        {story.why_it_matters && (
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: '#6b6b6b', fontStyle: 'italic' }}>{story.why_it_matters}</p>
        )}
        <Byline story={story} />
      </div>
    </article>
  );
}

export default function IssueBody({ issue, kicker = '🎮 BONFIRE SEA GAMES DAILY', dateLabel, contactEmail = CONTACT_EMAIL }) {
  if (!issue) return null;
  const { intro, top_story: top, sections = [], footer } = issue;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', background: '#fff', fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <div style={{ background: INK, padding: '24px 28px', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ color: ACCENT, fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>{kicker}</div>
        <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginTop: 4 }}>{dateLabel || issue.issue_date}</div>
      </div>

      <div style={{ padding: '22px 28px' }}>
        {intro && <p style={{ fontSize: 15, lineHeight: 1.65, color: '#444', margin: '0 0 22px', fontStyle: 'italic' }}>{intro}</p>}

        {top && <TopStory story={top} />}

        {sections.map((sec) => (
          <section key={sec.theme}>
            <h2 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: ACCENT, borderBottom: `2px solid #f0e0d8`, paddingBottom: 6, margin: '26px 0 16px', fontFamily: 'system-ui, sans-serif' }}>
              {sec.theme}
            </h2>
            {(sec.stories || []).map((st) => <StoryCard key={st.url} story={st} />)}
          </section>
        ))}

        {footer && (
          <div style={{ marginTop: 28, padding: '18px 20px', background: INK, borderRadius: 8, fontFamily: 'system-ui, sans-serif' }}>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#ddd', margin: '0 0 10px' }}>{footer.about}</p>
            <p style={{ fontSize: 13, color: ACCENT, fontWeight: 600, margin: '0 0 10px' }}>{footer.cta}</p>
            <p style={{ fontSize: 11, color: '#888', margin: 0 }}>{footer.sources_note}</p>
            <p style={{ fontSize: 10.5, lineHeight: 1.5, color: '#6f6f78', margin: '10px 0 0', borderTop: '1px solid #2a2a3e', paddingTop: 10 }}>
              {RIGHTS_NOTICE}{' '}
              {contactEmail ? (
                <>
                  If you own an image and would like it removed, contact{' '}
                  <a href={`mailto:${contactEmail}?subject=Image%20removal%20request`} style={{ color: '#9a9aa2' }}>{contactEmail}</a>
                  {' '}and we will take it down promptly.
                </>
              ) : (
                <>If you own an image and would like it removed, contact us and we will take it down promptly.</>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
