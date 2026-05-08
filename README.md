# Stage Astro Site Template

Astro template for public websites powered by Stage CMS.

The active app is intentionally small and familiar to Astro users:

```txt
src/
  pages/
    index.astro
    robots.txt.ts
    sitemap.xml.ts
  layouts/
    BaseLayout.astro
  components/
    AccessibilityMenu.astro
    stage/
      StageImage.astro
    ui/
      Button.astro
      CheckboxField.astro
      Container.astro
      Dialog.astro
      ErrorState.astro
      InputField.astro
      Modal.astro
      SelectField.astro
      Section.astro
      TextareaField.astro
  lib/
    stage/
      client.ts
      content-helpers.ts
      env.ts
      homepage.ts
      seo.ts
      types.ts
    seo/
      sitemap.ts
  styles/
    fonts.css
    global.css
    reset.css
    tokens.css
    typography.css
public/
  assets/
    fonts/
    images/
optional/
  analytics-consent/
  posts/
  newsletter/
  cloudflare-rebuild/
  preview/
examples/
docs/
```

## What Is Active By Default

- Static Astro homepage.
- Build-time Stage API v1 reads through `@ooopsstudio/stage-api` with a private `STAGE_API_TOKEN`.
- One Stage single type, `homepage`.
- Basic SEO helper, `robots.txt`, and `sitemap.xml`.
- Fixture fallback with build-time logs when Stage env vars are missing or Stage is unavailable.
- Small copy-editable Astro UI primitives.
- `StageImage.astro` for Stage media URLs, alt fallback, responsive sizing, lazy loading, and fallback image handling.
- A local accessibility menu with display, contrast, motion, cursor, reading-guide, and image-hiding controls.

Optional examples live in `optional/`. Copy them into `src/` only if you need them.

## UI Primitives

The template includes neutral Astro primitives in `src/components/ui`:

- `Button.astro`
- `CheckboxField.astro`
- `Container.astro`
- `Dialog.astro`
- `ErrorState.astro`
- `Section.astro`
- `InputField.astro`
- `Modal.astro`
- `TextareaField.astro`
- `SelectField.astro`

They are intentionally local to the template, not an npm design system. Edit or delete them to match the site.

`Button.astro` can render text, an image-only button, or image + text. Use `imagePosition="before"` or `imagePosition="after"` to control placement.

`SelectField.astro` is the custom select primitive. It includes a searchable grouped listbox, option icons, async filtering, portal positioning, and richer open/close keyboard behavior.

`Dialog.astro` and `Modal.astro` use native `<dialog>` under the hood for accessible modal semantics, Escape handling, focus behavior, and return-focus support. They expose local CSS variables for easy visual customization.

`StageImage.astro` lives in `src/components/stage`. It accepts a Stage media record or plain `src`, normalizes Stage asset URLs, and uses `/assets/images/fallback-image.svg` when no image is available.

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
PUBLIC_SITE_URL=http://localhost:4321
```

## Checks

```bash
npm run lint
npm run typecheck
npm run check
npm run validate
```

`npm run check` runs Astro type checking plus the template guard in `scripts/check-stage-api-contracts.mjs`. The guard catches old Stage public API paths, committed local env files, missing style/assets foundation files, browser references to private tokens, local `@ooopsstudio/*` dependency paths, and template-specific secret mistakes.

`npm run check:openapi` fetches `${STAGE_API_BASE_URL}/openapi.json` when Stage is configured and checks for the required Stage API v1 paths. It skips locally when Stage is not configured or not running, and fails in CI when a configured OpenAPI endpoint is unreachable.

GitHub Actions runs `npm run validate` on pushes and pull requests.

## Expected Stage Content

The fastest setup path is the bootstrap script. Full guide:

- [Stage bootstrap guide](docs/bootstrap.md)

Short version:

```bash
cp .env.example .env.local
# Fill STAGE_API_BASE_URL and STAGE_API_TOKEN.
npm run stage:bootstrap
```

The script applies `stage/starter-bundle.json` to the Stage organization attached to your API token. It does not create an organization. It creates missing schemas/content/forms, updates starter content idempotently, and prints `PUBLIC_NEWSLETTER_FORM_TOKEN` when the newsletter form is created.

Create the token in Stage under `Settings -> General -> API access` with the `Site bootstrap` preset.

Recommended setup scopes:

- `cms:schema:write`
- `cms:schema:read`
- `cms:content:write`
- `cms:content:publish`
- `forms:read`
- `forms:write`
- `webhooks:read`
- `webhooks:write`

After bootstrap, rotate to a narrower read-focused token for production builds when you no longer need setup write access.

The starter bundle creates a Stage single type with API id `homepage`.

Recommended fields:

- `heading`
- `description`
- `seo-title`
- `seo-description`
- `ogImage` optional
- `canonical-path-override` optional
- `robots-index` / `robots-follow` optional
- `google-site-verification` optional
- `twitter-handle` optional

You can rename the API id and fields in `src/lib/stage/homepage.ts`.

## Optional Posts Collection

Use `optional/posts` if you want a collection example.

It demonstrates:

- `/posts/[slug]` static pages.
- `/posts` static index page.
- Stage collection API reads.
- Per-post SEO.
- Optional sitemap integration.

Expected collection API id: `posts`.

Copying the optional posts module adds both `/posts` and `/posts/[slug]`.

## Optional Preview Mode

Use `optional/preview` if Stage editors need draft previews before publishing.

Preview mode uses server-only env vars:

```env
STAGE_PREVIEW_TOKEN=
STAGE_PREVIEW_SECRET=
```

Never expose preview tokens in browser code.

## Optional Newsletter Form

Use `optional/newsletter` if you want browser-side public form submissions.

It demonstrates posting to:

```txt
/api/stage/public/forms/{token}/submissions
```

No private Stage API token is exposed to the browser.

## Optional Analytics Consent

Use `optional/analytics-consent` if your site enables optional performance analytics or replay.

It demonstrates the framework-agnostic `@ooopsstudio/analytics-consent` package. Anonymous analytics can run by default; performance analytics and replay should wait for explicit visitor consent.

## Optional Cloudflare Pages Rebuild

Use `optional/cloudflare-rebuild` if you deploy to Cloudflare Pages and want Stage webhooks to trigger rebuilds.

This is not active by default because it is deployment-specific.

The optional endpoint verifies Stage HMAC signatures using `STAGE_WEBHOOK_SECRET` and queues a Cloudflare Pages deploy hook for `cms.*`, `media.*`, and `form.*` events.

Test a copied rebuild endpoint with:

```bash
STAGE_WEBHOOK_SECRET=your_secret WEBHOOK_TEST_URL=https://your-site.com/api/stage/rebuild npm run test:webhook
```

## Deployment And Security

- [Deployment guide](docs/deployment.md)
- [Security notes](docs/security.md)

## Stage API Examples

Examples live in `examples/`:

- `read-content.ts`
- `newsletter-submit.ts`
- `media-upload.ts`
- `forms-and-webhooks.ts`
- `seo-and-analytics.ts`

Run:

```bash
npm run example:read-content
npm run example:newsletter-submit -- subscriber@example.com
```

## Private Env Vars

Never expose these to browser code:

- `STAGE_API_TOKEN`
- `STAGE_PREVIEW_TOKEN`
- `STAGE_PREVIEW_SECRET`
- `CLOUDFLARE_PAGES_DEPLOY_HOOK_URL`
- `STAGE_WEBHOOK_SECRET`
