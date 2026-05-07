import { readFileSync } from 'node:fs';

const source = [
  readFileSync(new URL('../src/lib/stage/client.ts', import.meta.url), 'utf8'),
  readFileSync(new URL('../src/lib/stage/homepage.ts', import.meta.url), 'utf8')
].join('\n');
const forbidden = ['/api/public/content', '/api/public/site'];

const hit = forbidden.find((path) => source.includes(path));
if (hit) {
  console.error(`[stage-api-contracts] Found old Stage public API path: ${hit}`);
  process.exit(1);
}

if (!source.includes('/content/singles/')) {
  console.error('[stage-api-contracts] Expected Stage API v1 single-type path was not found.');
  process.exit(1);
}

console.log('[stage-api-contracts] Template uses Stage API v1 CMS contracts.');
