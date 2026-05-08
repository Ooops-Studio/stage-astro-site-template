# Deployment

This template builds static files from Stage CMS at build time.

## Common Settings

- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`
- Node version: `22.12` or newer

Required env vars:

```env
STAGE_API_BASE_URL=https://stage.example.com/api/stage/v1
STAGE_API_TOKEN=
PUBLIC_SITE_URL=https://www.example.com
```

Optional env vars:

```env
PUBLIC_STAGE_API_BASE_URL=https://stage.example.com
PUBLIC_NEWSLETTER_FORM_TOKEN=
PUBLIC_STAGE_ANALYTICS_SCRIPT_URL=
PUBLIC_STAGE_ANALYTICS_WEBSITE_ID=
PUBLIC_STAGE_ANALYTICS_REQUIRES_CONSENT=true
PUBLIC_STAGE_ANALYTICS_RESPECT_DNT=true
PUBLIC_STAGE_ANALYTICS_PERFORMANCE_ENABLED=false
PUBLIC_STAGE_ANALYTICS_REPLAY_ENABLED=false
PUBLIC_STAGE_ANALYTICS_REPLAY_SCRIPT_URL=
STAGE_PREVIEW_TOKEN=
STAGE_PREVIEW_SECRET=
CLOUDFLARE_PAGES_DEPLOY_HOOK_URL=
STAGE_WEBHOOK_SECRET=
```

## Cloudflare Pages

1. Set build command to `npm run build`.
2. Set output directory to `dist`.
3. Add the required env vars in Pages settings.
4. Copy `optional/cloudflare-rebuild/functions/api/stage/rebuild.ts` to `functions/api/stage/rebuild.ts` if Stage should trigger rebuilds.
5. Add `CLOUDFLARE_PAGES_DEPLOY_HOOK_URL` and `STAGE_WEBHOOK_SECRET`.
6. Configure the Stage webhook URL as `https://your-site.com/api/stage/rebuild`.

## Vercel

1. Framework preset: Astro.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Add required env vars in Project Settings.
5. Use a Vercel deploy hook if you want Stage publish events to trigger rebuilds.

## Netlify

1. Build command: `npm run build`.
2. Publish directory: `dist`.
3. Add required env vars in Site configuration.
4. Use a Netlify build hook if you want Stage publish events to trigger rebuilds.

## Generic Static Hosting

Run:

```bash
npm install
npm run build
```

Upload the generated `dist/` directory to your static host.

## Local Development

For fixture fallback only:

```bash
npm run dev
```

For live Stage content:

```env
STAGE_API_BASE_URL=http://stage.localhost:4275/api/stage/v1
STAGE_API_TOKEN=your_private_stage_api_token
PUBLIC_SITE_URL=http://localhost:4321
```

For local analytics with the bundled Ooops Suite stack:

```env
PUBLIC_STAGE_ANALYTICS_SCRIPT_URL=http://localhost:3001/script.js
PUBLIC_STAGE_ANALYTICS_WEBSITE_ID=your_stage_analytics_website_id
PUBLIC_STAGE_ANALYTICS_REQUIRES_CONSENT=true
PUBLIC_STAGE_ANALYTICS_RESPECT_DNT=true
```

Restart the Astro dev server after changing public env vars. Accept analytics in the banner, then browser-side events should appear in Stage Analytics for the matching website id.

If this is a fresh Stage organization, run the bootstrap once before expecting live content:

```bash
npm run stage:bootstrap
```

See [Stage bootstrap](bootstrap.md).
