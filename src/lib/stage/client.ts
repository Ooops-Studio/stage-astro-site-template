import { fixtureHome, fixturePost, fixturePosts } from './fixtures';
import type { HomepageContent, PostDetail, PostSummary, SeoPayload } from './types';

const stageApiBaseUrl = import.meta.env.STAGE_API_BASE_URL?.replace(/\/$/, '') || '';
const stageApiToken = import.meta.env.STAGE_API_TOKEN || '';
const siteUrl = (import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321').replace(/\/$/, '');

type StageSingleResponse<T> = { ok: true; content: T };
type StageCollectionResponse<T> = { ok: true; items: T[] };
type StageCollectionEntryResponse<T> = { ok: true; item: T };

const requestStage = async <T>(path: string): Promise<T | null> => {
  if (!stageApiBaseUrl || !stageApiToken) return null;

  const response = await fetch(`${stageApiBaseUrl}${path}`, {
    headers: {
      authorization: `Bearer ${stageApiToken}`,
      accept: 'application/json'
    }
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Stage API request failed: ${response.status} ${response.statusText} for ${path}`);
  }

  return response.json() as Promise<T>;
};

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

const asString = (value: unknown): string =>
  typeof value === 'string' && value.trim() ? value.trim() : '';

const asDateString = (value: unknown): string | null => {
  if (typeof value !== 'string' || !value.trim()) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
};

const seoFromFields = ({
  fields,
  path,
  fallbackTitle,
  fallbackDescription
}: {
  fields: Record<string, unknown>;
  path: string;
  fallbackTitle: string;
  fallbackDescription: string;
}): SeoPayload => ({
  title: asString(fields.seoTitle) || fallbackTitle,
  description: asString(fields.seoDescription) || fallbackDescription,
  canonical: `${siteUrl}${path}`
});

const mapPostSummary = (entry: Record<string, unknown>): PostSummary => {
  const fields = asRecord(entry.fields || entry);
  const title = asString(fields.title) || 'Untitled post';
  const slug = asString(fields.slug) || asString(entry.slug) || asString(entry.id);

  return {
    id: asString(entry.id) || slug,
    title,
    slug,
    excerpt: asString(fields.excerpt),
    publishedAt: asDateString(fields.publishedAt)
  };
};

const mapPostDetail = (entry: Record<string, unknown>): PostDetail => {
  const fields = asRecord(entry.fields || entry);
  const summary = mapPostSummary(entry);

  return {
    ...summary,
    body: asString(fields.body),
    seo: seoFromFields({
      fields,
      path: `/posts/${summary.slug}`,
      fallbackTitle: summary.title,
      fallbackDescription: summary.excerpt
    })
  };
};

export const getHome = async (): Promise<HomepageContent> => {
  const response = await requestStage<StageSingleResponse<Record<string, unknown>>>('/content/singles/homepage');
  if (!response) return fixtureHome(siteUrl);

  const fields = asRecord(response.content.fields || response.content);
  const title = asString(fields.title) || 'Stage Astro Site';
  const description = asString(fields.description) || 'Public website powered by Stage CMS.';

  return {
    title,
    description,
    seo: seoFromFields({
      fields,
      path: '/',
      fallbackTitle: title,
      fallbackDescription: description
    })
  };
};

export const getPosts = async (): Promise<PostSummary[]> => {
  const response = await requestStage<StageCollectionResponse<Record<string, unknown>>>(
    '/content/collections/posts/entries'
  );
  if (!response) return fixturePosts();

  return response.items.map(mapPostSummary).filter((post) => post.slug);
};

export const getPost = async (slug: string): Promise<PostDetail | null> => {
  const response = await requestStage<StageCollectionEntryResponse<Record<string, unknown>>>(
    `/content/collections/posts/entries/${encodeURIComponent(slug)}`
  );
  if (!response) return slug === 'hello-stage' ? fixturePost(siteUrl) : null;

  return mapPostDetail(response.item);
};
