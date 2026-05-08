import { stageRequest } from './stage-request';

const [seo, overview] = await Promise.all([
  stageRequest<{ ok: true; site?: unknown; targets?: Array<{ id: string; routePattern: string; targetKind: string }> }>('GET', '/seo'),
  stageRequest<{ ok: true; summary?: Record<string, unknown> }>('GET', '/analytics/overview?range=30d')
]);

console.log('SEO targets');
for (const target of seo.targets ?? []) {
  console.log(`- ${target.routePattern} (${target.targetKind})`);
}

console.log('Analytics overview');
console.log(JSON.stringify(overview.summary ?? overview, null, 2));
