import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const siteUrl = (import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321').replace(/\/$/, '');
  const urls = ['/'];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urls.map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`).join('\n') +
      `\n</urlset>\n`,
    { headers: { 'content-type': 'application/xml; charset=utf-8' } }
  );
};
