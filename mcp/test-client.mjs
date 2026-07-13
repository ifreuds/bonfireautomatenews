/**
 * Connects to bonfire-mcp over stdio as a real MCP client and exercises the tools.
 * Proves the wrapper works without needing an AI runtime to load it.
 *
 *   cd mcp && node test-client.mjs            # list tools + read brief + read archive
 *   cd mcp && node test-client.mjs --submit   # additionally submit a draft from draft.json
 */
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { readFileSync } from 'node:fs';

// NOTE: the MCP SDK gives child processes a *filtered* env. On machines whose
// antivirus TLS-intercepts (e.g. Norton), Node needs NODE_EXTRA_CA_CERTS or every
// outbound fetch dies with a bare "fetch failed". Pass it through explicitly.
const transport = new StdioClientTransport({
  command: 'node',
  args: ['bonfire-mcp.mjs'],
  env: {
    PATH: process.env.PATH,
    ...(process.env.NODE_EXTRA_CA_CERTS ? { NODE_EXTRA_CA_CERTS: process.env.NODE_EXTRA_CA_CERTS } : {}),
  },
});
const client = new Client({ name: 'bonfire-test-client', version: '0.1.0' });
await client.connect(transport);
console.log('connected to MCP server: bonfire\n');

const { tools } = await client.listTools();
console.log('tools exposed to the AI:');
for (const t of tools) console.log(`  - ${t.name}`);
console.log(`  (no publish tool: ${tools.every((t) => !/publish/i.test(t.name)) ? 'confirmed — the agent CANNOT publish' : 'FAIL'})\n`);

const brief = await client.callTool({ name: 'get_brief', arguments: { newsletter: 'games' } });
const briefText = brief.content[0].text;
console.log(`get_brief      -> ${briefText.length} chars; starts: "${briefText.split('\n')[0].slice(0, 60)}…"`);

const arch = await client.callTool({ name: 'get_recent_archive', arguments: { newsletter: 'games', days: 90 } });
const rows = JSON.parse(arch.content[0].text);
console.log(`get_recent_archive -> ${rows.length} previously-covered stories (dedup memory)`);

if (process.argv.includes('--submit')) {
  const draft = JSON.parse(readFileSync('draft.json', 'utf8'));
  // Optional Chinese translation: draft-cn.json (same shape, translated strings).
  let contentCn;
  try {
    contentCn = JSON.parse(readFileSync('draft-cn.json', 'utf8'));
  } catch {
    contentCn = undefined;
  }
  const res = await client.callTool({
    name: 'submit_draft',
    arguments: {
      newsletter: 'games',
      issue_date: draft.issue_date,
      title: draft.title,
      content: draft,
      ...(contentCn ? { content_cn: contentCn } : {}),
      submitted_by: 'ai-worker (via MCP)',
    },
  });
  console.log('\nsubmit_draft   ->', res.content[0].text);
}

await client.close();
