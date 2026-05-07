type Env = {
  CLOUDFLARE_PAGES_DEPLOY_HOOK_URL?: string;
  STAGE_WEBHOOK_SECRET?: string;
};

type PagesContext = {
  request: Request;
  env: Env;
};

export const onRequestPost = async ({ request, env }: PagesContext) => {
  const expectedSecret = env.STAGE_WEBHOOK_SECRET;
  const deployHookUrl = env.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL;

  if (!expectedSecret || !deployHookUrl) {
    return Response.json({ ok: false, error: 'rebuild_not_configured' }, { status: 503 });
  }

  const providedSecret = request.headers.get('x-stage-webhook-secret') || '';
  if (providedSecret !== expectedSecret) {
    return Response.json({ ok: false, error: 'invalid_secret' }, { status: 401 });
  }

  const response = await fetch(deployHookUrl, { method: 'POST' });
  if (!response.ok) {
    return Response.json({ ok: false, error: 'deploy_hook_failed' }, { status: 502 });
  }

  return Response.json({ ok: true });
};
