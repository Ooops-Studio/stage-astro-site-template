# Stage Astro Site Template

Astro starter for public websites powered by Stage CMS.

The template is intentionally small:

- Static Astro pages for CMS content.
- Server/build-time Stage API v1 reads with a private API token.
- Browser-side public form submissions with a public form token.
- Optional Cloudflare Pages deploy hook endpoint for production rebuilds.

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set these values in `.env.local`:

```env
STAGE_API_BASE_URL=http://stage.localhost:4275/api/stage/v1
STAGE_API_TOKEN=your_private_stage_api_token
PUBLIC_STAGE_API_BASE_URL=http://stage.localhost:4275
PUBLIC_NEWSLETTER_FORM_TOKEN=your_public_form_token
PUBLIC_SITE_URL=http://localhost:4321
```

## Expected Stage Content

The starter uses two example CMS contracts:

- Single type `homepage`
  - `title`
  - `description`
  - `seoTitle`
  - `seoDescription`

- Collection type `posts`
  - `title`
  - `slug`
  - `excerpt`
  - `body`
  - `publishedAt`
  - `seoTitle`
  - `seoDescription`

You can rename these API ids and fields in `src/lib/stage/client.ts`.

## Deployment

For Cloudflare Pages:

1. Add the env vars from `.env.example`.
2. Set `PUBLIC_SITE_URL` to your production domain.
3. Create a Pages deploy hook and add it as `CLOUDFLARE_PAGES_DEPLOY_HOOK_URL`.
4. Configure a Stage webhook to call `/api/stage/rebuild` with `STAGE_WEBHOOK_SECRET`.

Private values such as `STAGE_API_TOKEN`, `CLOUDFLARE_PAGES_DEPLOY_HOOK_URL`, and `STAGE_WEBHOOK_SECRET` must never be exposed to browser code.
