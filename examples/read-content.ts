import { OoopsStageClient } from '@ooopsstudio/stage-api';

const baseUrl = process.env.STAGE_API_BASE_URL ?? 'http://stage.localhost:4275/api/stage/v1';
const token = process.env.STAGE_API_TOKEN ?? '';

if (!token) {
  throw new Error('Set STAGE_API_TOKEN before running this example.');
}

const stage = new OoopsStageClient({ baseUrl, token });

const homepage = await stage.content.getSingle<{ ok: true; content: Record<string, unknown> }>('homepage');
console.log('Homepage');
console.log(JSON.stringify(homepage.content, null, 2));

const collections = await stage.content.listCollections<{
  ok: true;
  collections?: Array<{ apiId: string; name?: string | null }>;
  contentTypes?: Array<{ apiId: string; name?: string | null }>;
}>();

console.log('Collections');
for (const collection of collections.collections ?? collections.contentTypes ?? []) {
  console.log(`- ${collection.apiId}${collection.name ? ` (${collection.name})` : ''}`);
}

