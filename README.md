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
    ui/
      Button.astro
      CheckboxField.astro
      Container.astro
      Dialog.astro
      InputField.astro
      Modal.astro
      SelectField.astro
      Section.astro
      TextareaField.astro
  lib/
    stage/
      client.ts
      env.ts
      homepage.ts
      seo.ts
      types.ts
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
  posts/
  newsletter/
  cloudflare-rebuild/
```

## What Is Active By Default

- Static Astro homepage.
- Build-time Stage API v1 reads with a private `STAGE_API_TOKEN`.
- One Stage single type, `homepage`.
- Basic SEO helper, `robots.txt`, and `sitemap.xml`.
- Fixture fallback when Stage env vars are missing.
- Small copy-editable Astro UI primitives.

Optional examples live in `optional/`. Copy them into `src/` only if you need them.

## UI Primitives

The template includes neutral Astro primitives in `src/components/ui`:

- `Button.astro`
- `CheckboxField.astro`
- `Container.astro`
- `Dialog.astro`
- `Section.astro`
- `InputField.astro`
- `Modal.astro`
- `TextareaField.astro`
- `SelectField.astro`

They are intentionally local to the template, not an npm design system. Edit or delete them to match the site.

`Button.astro` can render text, an image-only button, or image + text. Use `imagePosition="before"` or `imagePosition="after"` to control placement.

`SelectField.astro` is the custom select primitive. It includes a searchable grouped listbox, option icons, async filtering, portal positioning, and richer open/close keyboard behavior.

`Dialog.astro` and `Modal.astro` use native `<dialog>` under the hood for accessible modal semantics, Escape handling, focus behavior, and return-focus support. They expose local CSS variables for easy visual customization.

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

## Expected Stage Content

Create a Stage single type with API id `homepage`.

Recommended fields:

- `heading`
- `description`
- `seoTitle`
- `seoDescription`
- `ogImage` optional

You can rename the API id and fields in `src/lib/stage/homepage.ts`.

## Optional Posts Collection

Use `optional/posts` if you want a collection example.

It demonstrates:

- `/posts/[slug]` static pages.
- Stage collection API reads.
- Per-post SEO.

Expected collection API id: `posts`.

## Optional Newsletter Form

Use `optional/newsletter` if you want browser-side public form submissions.

It demonstrates posting to:

```txt
/api/stage/public/forms/{token}/submissions
```

No private Stage API token is exposed to the browser.

## Optional Cloudflare Pages Rebuild

Use `optional/cloudflare-rebuild` if you deploy to Cloudflare Pages and want Stage webhooks to trigger rebuilds.

This is not active by default because it is deployment-specific.

## Private Env Vars

Never expose these to browser code:

- `STAGE_API_TOKEN`
- `CLOUDFLARE_PAGES_DEPLOY_HOOK_URL`
- `STAGE_WEBHOOK_SECRET`
