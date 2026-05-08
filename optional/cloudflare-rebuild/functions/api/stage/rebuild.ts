type PagesFunctionEnv = {
  CLOUDFLARE_PAGES_DEPLOY_HOOK_URL?: string;
  STAGE_WEBHOOK_SECRET?: string;
};

type PagesFunctionContext<Env> = {
  request: Request;
  env: Env;
};

type PagesFunction<Env> = (context: PagesFunctionContext<Env>) => Response | Promise<Response>;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });

const toHex = (buffer: ArrayBuffer) =>
  [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');

const safeEqual = (left: string, right: string) => {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return diff === 0;
};

const signWebhookPayload = async ({ secret, timestamp, body }: { secret: string; timestamp: string; body: string }) => {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return toHex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${body}`)));
};

const shouldRebuildForEvent = (eventType: string) =>
  eventType.startsWith('cms.') || eventType.startsWith('media.') || eventType.startsWith('form.');

export const onRequestPost: PagesFunction<PagesFunctionEnv> = async ({ request, env }) => {
  const deployHookUrl = env.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL;
  const webhookSecret = env.STAGE_WEBHOOK_SECRET;
  if (!deployHookUrl || !webhookSecret) return json({ ok: false, error: 'rebuild_not_configured' }, 503);

  const body = await request.text();
  const timestamp = request.headers.get('x-stage-timestamp') || '';
  const signature = (request.headers.get('x-stage-signature') || '').replace(/^v1=/, '');
  if (!timestamp || !signature) return json({ ok: false, error: 'webhook_signature_missing' }, 401);

  const expected = await signWebhookPayload({ secret: webhookSecret, timestamp, body });
  if (!safeEqual(signature, expected)) return json({ ok: false, error: 'webhook_signature_invalid' }, 401);

  const eventType = request.headers.get('x-stage-event') || '';
  if (!shouldRebuildForEvent(eventType)) {
    return json({ ok: true, skipped: true, reason: 'event_not_rebuildable' });
  }

  const response = await fetch(deployHookUrl, { method: 'POST' });
  if (!response.ok) return json({ ok: false, error: 'deploy_hook_failed' }, 502);

  return json({ ok: true, rebuildQueued: true });
};

export const onRequest: PagesFunction<PagesFunctionEnv> = () => json({ ok: false, error: 'method_not_allowed' }, 405);
