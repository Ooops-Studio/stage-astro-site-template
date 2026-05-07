# Optional Posts Collection

Copy these files into `src/` if you want a collection example:

```txt
optional/posts/src/lib/posts/client.ts -> src/lib/posts/client.ts
optional/posts/src/pages/posts/[slug].astro -> src/pages/posts/[slug].astro
```

Expected Stage collection API id: `posts`.

Fields:

- `title`
- `slug`
- `excerpt`
- `body`
- `publishedAt`
- `seoTitle`
- `seoDescription`

Also add post URLs to `src/pages/sitemap.xml.ts` if you want them listed in the sitemap.
