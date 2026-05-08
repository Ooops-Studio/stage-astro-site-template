import { siteUrl } from './env';
import { getStageSingle } from './client';
import { asRecord, asString } from './content-helpers';
import { seoFromFields } from './seo';
import type { HomepageContent } from './types';

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
  const content = await getStageSingle('homepage');
  if (!content) return fixtureHome();

  const fields = asRecord(content.fields || content);
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
