export type SitemapUrl = {
  loc: string;
  lastmod?: string | Date | null;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const normalizeSiteUrl = (siteUrl: string) => siteUrl.replace(/\/$/, '');

const normalizePath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

export const createSitemapUrl = (
  siteUrl: string,
  path: string,
  options: Omit<SitemapUrl, 'loc'> = {}
): SitemapUrl => ({
  loc: `${normalizeSiteUrl(siteUrl)}${normalizePath(path)}`,
  ...options
});

export const mergeSitemapUrls = (...groups: Array<Array<SitemapUrl | null | undefined>>) =>
  groups.flat().filter((url): url is SitemapUrl => Boolean(url));

export const renderSitemapXml = (urls: SitemapUrl[]) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map((url) => {
      const lastmod = url.lastmod instanceof Date ? url.lastmod.toISOString() : url.lastmod;
      return [
        '  <url>',
        `    <loc>${escapeXml(url.loc)}</loc>`,
        lastmod ? `    <lastmod>${escapeXml(lastmod)}</lastmod>` : '',
        url.changefreq ? `    <changefreq>${url.changefreq}</changefreq>` : '',
        typeof url.priority === 'number' ? `    <priority>${Math.max(0, Math.min(1, url.priority)).toFixed(1)}</priority>` : '',
        '  </url>'
      ].filter(Boolean).join('\n');
    })
    .join('\n') +
  `\n</urlset>\n`;
