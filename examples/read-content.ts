import { stageRequest } from './stage-request';

const homepage = await stageRequest<{ ok: true; content: Record<string, unknown> }>('GET', '/content/singles/homepage');
console.log('Homepage');
console.log(JSON.stringify(homepage.content, null, 2));

const collections = await stageRequest<{
  ok: true;
  collections?: Array<{ apiId: string; name?: string | null }>;
  contentTypes?: Array<{ apiId: string; name?: string | null }>;
}>('GET', '/content/collections');

console.log('Collections');
for (const collection of collections.collections ?? collections.contentTypes ?? []) {
  console.log(`- ${collection.apiId}${collection.name ? ` (${collection.name})` : ''}`);
}
