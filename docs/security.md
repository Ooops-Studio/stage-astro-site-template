# Security Notes

## Stage API Tokens

Never expose `STAGE_API_TOKEN` in browser code. It is a private build/server token for reading Stage content during static generation.

Browser-side integrations should use only public APIs and scoped public tokens, for example `PUBLIC_NEWSLETTER_FORM_TOKEN` for newsletter submission.

## Analytics

`PUBLIC_STAGE_ANALYTICS_*` values are browser-facing configuration values. They are safe to expose, but they should not grant API access.

If `PUBLIC_STAGE_ANALYTICS_SCRIPT_URL` or `PUBLIC_STAGE_ANALYTICS_WEBSITE_ID` is blank, the template does not load analytics or send events. Enable performance analytics and replay only when the public site has the consent flow you need for your visitors.

Recommended defaults:

- Consent is required by default with `PUBLIC_STAGE_ANALYTICS_REQUIRES_CONSENT=true`.
- Anonymous analytics can run without a private API token, but only set `PUBLIC_STAGE_ANALYTICS_REQUIRES_CONSENT=false` when your site has the legal basis to do that.
- Keep `PUBLIC_STAGE_ANALYTICS_RESPECT_DNT=true`.
- Keep performance analytics and replay disabled until you have the correct consent UX and legal basis for your site.
- Do not put private Stage API tokens, webhook secrets, or preview secrets in any `PUBLIC_*` variable.

## Bootstrap

`npm run stage:bootstrap` uses `STAGE_API_TOKEN` server-side from your terminal to create starter schemas/content/forms in the Stage organization attached to that token. It does not create a new organization. Use a short-lived token with only the documented bootstrap scopes, and revoke or rotate it after setup if you do not need ongoing write access.

## Webhooks

Use a long random `STAGE_WEBHOOK_SECRET`. The optional Cloudflare rebuild endpoint verifies:

- `x-stage-timestamp`
- `x-stage-signature`
- `x-stage-event`

The signature is `HMAC-SHA256(timestamp + "." + rawBody)`.

## Preview Mode

Preview tokens are server-only:

- `STAGE_PREVIEW_TOKEN`
- `STAGE_PREVIEW_SECRET`

Do not import these from browser components, islands, or client scripts.

## Environment Files

Commit `.env.example`, but never commit `.env`, `.env.local`, `.env.development`, or `.env.production`.

## Fixture Fallback

Fixture fallback is useful for local development. Production deployments should configure `STAGE_API_BASE_URL`, `STAGE_API_TOKEN`, and `PUBLIC_SITE_URL` so content and metadata are generated from Stage.
