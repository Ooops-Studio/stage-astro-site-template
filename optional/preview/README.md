# Optional Stage Preview Mode

Copy these files if editors need draft previews before publishing:

```txt
optional/preview/src/lib/stage/preview.ts -> src/lib/stage/preview.ts
optional/preview/src/pages/api/preview.ts -> src/pages/api/preview.ts
```

Add server-only env vars:

```env
STAGE_PREVIEW_TOKEN=
STAGE_PREVIEW_SECRET=
```

Configure Stage preview URLs to call:

```txt
https://your-site.com/api/preview?secret=STAGE_PREVIEW_SECRET&type=single&apiId=homepage&path=/
https://your-site.com/api/preview?secret=STAGE_PREVIEW_SECRET&type=collection&apiId=posts&slug={slug}&path=/posts/{slug}
```

Rules:

- `STAGE_PREVIEW_TOKEN` must be server-only.
- Do not expose preview tokens in browser code.
- Preview mode is optional. Static builds should continue using published content.

