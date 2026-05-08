# Optional Posts Collection

Copy these files into `src/` if you want a collection example:

```txt
optional/posts/src/lib/posts/client.ts -> src/lib/posts/client.ts
optional/posts/src/lib/posts/sitemap.ts -> src/lib/posts/sitemap.ts
optional/posts/src/pages/posts/index.astro -> src/pages/posts/index.astro
optional/posts/src/pages/posts/[slug].astro -> src/pages/posts/[slug].astro
```

Expected Stage collection API id: `posts`.

Fields:

- `title`
- `slug`
- `excerpt`
- `body`
- `heroImage`
- `publishedAt`
- `seo-title`
- `seo-description`

To include posts in `src/pages/sitemap.xml.ts`, copy `src/lib/posts/sitemap.ts` and merge its URLs:

```ts
import { getPostSitemapUrls } from '../lib/posts/sitemap';
import { mergeSitemapUrls } from '../lib/seo/sitemap';

const urls = mergeSitemapUrls(
  [createSitemapUrl(siteUrl, '/', { changefreq: 'weekly', priority: 1 })],
  await getPostSitemapUrls(siteUrl)
);
```
