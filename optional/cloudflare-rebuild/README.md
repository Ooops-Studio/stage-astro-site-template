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

with header:

```txt
x-stage-webhook-secret: your_secret
```
