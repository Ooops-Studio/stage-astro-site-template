import type { HomepageContent, PostDetail, PostSummary } from './types';

export const fixtureHome = (siteUrl: string): HomepageContent => ({
  title: 'Build a Stage-powered Astro site',
  description:
    'This starter renders public content from Stage CMS at build time and keeps interactive actions on public APIs.',
  seo: {
    title: 'Stage Astro Site Template',
    description: 'Astro starter for public websites powered by Stage CMS.',
    canonical: siteUrl
  }
});

export const fixturePosts = (): PostSummary[] => [
  {
    id: 'hello-stage',
    title: 'Hello Stage',
    slug: 'hello-stage',
    excerpt: 'Replace this fixture with entries from your Stage posts collection.',
    publishedAt: new Date().toISOString()
  }
];

export const fixturePost = (siteUrl: string): PostDetail => ({
  id: 'hello-stage',
  title: 'Hello Stage',
  slug: 'hello-stage',
  excerpt: 'Replace this fixture with entries from your Stage posts collection.',
  publishedAt: new Date().toISOString(),
  body: '<p>This page is rendered statically by Astro. Configure Stage API credentials to load real CMS content.</p>',
  seo: {
    title: 'Hello Stage',
    description: 'Example post from the Stage Astro site template.',
    canonical: `${siteUrl}/posts/hello-stage`
  }
});
