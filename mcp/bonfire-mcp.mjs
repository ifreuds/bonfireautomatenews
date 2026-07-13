#!/usr/bin/env node
/**
 * Bonfire MCP server — the wrapper the AI talks to.
 *
 * This is the ONLY surface an AI worker gets. It can read its brief, read the
 * dedup archive, and submit a draft. There is deliberately NO publish tool:
 * everything an agent submits lands as `pending` and waits for a human.
 *
 * Swapping the AI = pointing a different runtime at this server. Nothing else changes.
 *
 * Auth: BONFIRE_AGENT_TOKEN env var, or mcp/.token (gitignored).
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readFileSync } from 'node:fs';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://pmspzrmowzuryhdjnoeo.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_Isvyky9AC3DI9c9-oeJtYA_WeF60Cy1';

function agentToken() {
  if (process.env.BONFIRE_AGENT_TOKEN) return process.env.BONFIRE_AGENT_TOKEN.trim();
  try {
    return readFileSync(new URL('./.token', import.meta.url), 'utf8').trim();
  } catch {
    throw new Error('No agent token. Set BONFIRE_AGENT_TOKEN or create mcp/.token');
  }
}

async function rpc(fn, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${fn} failed: ${text}`);
  return text ? JSON.parse(text) : null;
}

const ok = (data) => ({ content: [{ type: 'text', text: typeof data === 'string' ? data : JSON.stringify(data, null, 2) }] });

const server = new McpServer({ name: 'bonfire', version: '0.1.0' });

server.tool(
  'get_brief',
  'Fetch the editorial brief for a newsletter. The instructions live in the app, not in the AI — this is what makes the AI swappable.',
  { newsletter: z.string().describe("'games' or 'cloud'") },
  async ({ newsletter }) => {
    const file = newsletter === 'games' ? 'editorial-spec-games.md' : 'editorial-spec-games.md';
    const brief = readFileSync(new URL(`../wiki/${file}`, import.meta.url), 'utf8');
    return ok(brief);
  }
);

server.tool(
  'get_recent_archive',
  'Every story already covered in the last N days, for strict dedup. Never re-report one of these.',
  { newsletter: z.string(), days: z.number().int().min(1).max(365).default(90) },
  async ({ newsletter, days }) => ok(await rpc('agent_get_archive', { p_token: agentToken(), p_newsletter: newsletter, p_days: days }))
);

server.tool(
  'submit_draft',
  'Submit a finished issue for HUMAN APPROVAL. It is stored as `pending` and is NOT published. You cannot publish; only a human can. Provide BOTH the English content and a full Chinese translation (content_cn) so the issue has an EN page and a /cn page.',
  {
    newsletter: z.string(),
    issue_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    title: z.string(),
    content: z.record(z.any()).describe('The structured issue in ENGLISH: intro, top_story, sections, footer.'),
    content_cn: z
      .record(z.any())
      .optional()
      .describe('The SAME issue fully translated to Chinese — identical structure and keys, same url/source/published/image.url values, only the human-readable strings translated. Powers the /cn page.'),
    submitted_by: z.string().default('ai-worker'),
  },
  async ({ newsletter, issue_date, title, content, content_cn, submitted_by }) => {
    const id = await rpc('agent_submit_draft', {
      p_token: agentToken(), p_newsletter: newsletter, p_issue_date: issue_date,
      p_title: title, p_content: content, p_content_cn: content_cn ?? null, p_submitted_by: submitted_by,
    });
    return ok({ id, status: 'pending', note: 'Awaiting human approval. Not published.' });
  }
);

await server.connect(new StdioServerTransport());
