# Optional Cloudflare Pages Rebuild

Copy `functions/api/stage/rebuild.ts` to the project root if you deploy to Cloudflare Pages and want Stage publish/update webhooks to trigger a Pages rebuild.

Required Cloudflare env vars:

```env
CLOUDFLARE_PAGES_DEPLOY_HOOK_URL=
STAGE_WEBHOOK_SECRET=
```

Configure Stage to call:

```txt
https://your-site.com/api/stage/rebuild
```

The endpoint expects Stage's signed webhook headers:

```txt
x-stage-timestamp: 2026-05-08T00:00:00.000Z
x-stage-signature: v1=<hex-hmac>
x-stage-event: cms.entry.published
```

The signature is `HMAC-SHA256(timestamp + "." + rawBody)` using `STAGE_WEBHOOK_SECRET`.
Rebuilds are queued for `cms.*`, `media.*`, and `form.*` events.

Test a copied endpoint locally or after deploy:

```bash
STAGE_WEBHOOK_SECRET=your_secret \
WEBHOOK_TEST_URL=https://your-site.com/api/stage/rebuild \
npm run test:webhook
```
