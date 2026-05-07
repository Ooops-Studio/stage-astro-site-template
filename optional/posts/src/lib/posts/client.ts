import {
  requestStage,
  type StageCollectionEntryResponse,
  type StageCollectionResponse
} from '../stage/client';
import { seoFromFields } from '../stage/seo';
import type { SeoPayload } from '../stage/types';

export type PostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string | null;
};

export type PostDetail = PostSummary & {
  body: string;
  seo: SeoPayload;
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

export const getPosts = async (): Promise<PostSummary[]> => {
  const response = await requestStage<StageCollectionResponse<Record<string, unknown>>>(
    '/content/collections/posts/entries'
  );
  return response?.items.map(mapPostSummary).filter((post) => post.slug) ?? [];
};

export const getPost = async (slug: string): Promise<PostDetail | null> => {
  const response = await requestStage<StageCollectionEntryResponse<Record<string, unknown>>>(
    `/content/collections/posts/entries/${encodeURIComponent(slug)}`
  );
  return response ? mapPostDetail(response.item) : null;
};
