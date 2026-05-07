import { siteUrl } from './env';
import type { SeoPayload } from './types';

const asString = (value: unknown): string =>
  typeof value === 'string' && value.trim() ? value.trim() : '';

export const seoFromFields = ({
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
  canonical: `${siteUrl}${path}`,
  ogImage: asString(fields.ogImage) || null
});
