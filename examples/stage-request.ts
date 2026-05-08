export const stageBaseUrl = (process.env.STAGE_API_BASE_URL ?? 'http://stage.localhost:4275/api/stage/v1').replace(/\/$/, '');
export const stageToken = process.env.STAGE_API_TOKEN ?? '';

export const stageRequest = async <T>(method: string, path: string, body?: unknown): Promise<T> => {
  if (!stageToken) throw new Error('Set STAGE_API_TOKEN before running this example.');
  const response = await fetch(`${stageBaseUrl}${path}`, {
    method,
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${stageToken}`,
      ...(body ? { 'content-type': 'application/json' } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await response.text();
  const json = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(`Stage API request failed: ${response.status} ${json?.message || text}`);
  }
  return json as T;
};
