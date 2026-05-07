import { siteUrl } from './env';
import { requestStage, type StageSingleResponse } from './client';
import { seoFromFields } from './seo';
import type { HomepageContent } from './types';

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

const asString = (value: unknown): string =>
  typeof value === 'string' && value.trim() ? value.trim() : '';

const fixtureHome = (): HomepageContent => ({
  heading: 'Build a Stage-powered Astro site',
  description:
    'This template keeps the active app small: Stage API connectivity, homepage content, SEO, robots, and sitemap.',
  seo: {
    title: 'Stage Astro Site Template',
    description: 'Astro template for public websites powered by Stage CMS.',
    canonical: siteUrl
  }
});

export const getHome = async (): Promise<HomepageContent> => {
  const response = await requestStage<StageSingleResponse<Record<string, unknown>>>('/content/singles/homepage');
  if (!response) return fixtureHome();

  const fields = asRecord(response.content.fields || response.content);
  const heading = asString(fields.heading) || asString(fields.title) || 'Stage Astro Site';
  const description = asString(fields.description) || 'Public website powered by Stage CMS.';

  return {
    heading,
    description,
    seo: seoFromFields({
      fields,
      path: '/',
      fallbackTitle: heading,
      fallbackDescription: description
    })
  };
};
