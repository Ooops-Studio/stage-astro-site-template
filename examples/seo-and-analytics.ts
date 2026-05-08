import { OoopsStageClient } from '@ooopsstudio/stage-api';

const baseUrl = process.env.STAGE_API_BASE_URL ?? 'http://stage.localhost:4275/api/stage/v1';
const token = process.env.STAGE_API_TOKEN ?? '';

if (!token) throw new Error('Set STAGE_API_TOKEN before running this example.');

const stage = new OoopsStageClient({ baseUrl, token });

const [seo, overview] = await Promise.all([
  stage.seo.get<{ ok: true; site?: unknown; targets?: Array<{ id: string; routePattern: string; targetKind: string }> }>(),
  stage.analytics.overview<{ ok: true; summary?: Record<string, unknown> }>({ range: '30d' })
]);

console.log('SEO targets');
for (const target of seo.targets ?? []) {
  console.log(`- ${target.routePattern} (${target.targetKind})`);
}

console.log('Analytics overview');
console.log(JSON.stringify(overview.summary ?? overview, null, 2));
