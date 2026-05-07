/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly STAGE_API_BASE_URL?: string;
  readonly STAGE_API_TOKEN?: string;
  readonly PUBLIC_STAGE_API_BASE_URL?: string;
  readonly PUBLIC_NEWSLETTER_FORM_TOKEN?: string;
  readonly PUBLIC_SITE_URL?: string;
  readonly CLOUDFLARE_PAGES_DEPLOY_HOOK_URL?: string;
  readonly STAGE_WEBHOOK_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
