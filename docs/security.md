# Security Notes

## Stage API Tokens

Never expose `STAGE_API_TOKEN` in browser code. It is a private build/server token for reading Stage content during static generation.

Browser-side integrations should use only public APIs and scoped public tokens, for example `PUBLIC_NEWSLETTER_FORM_TOKEN` for newsletter submission.

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
