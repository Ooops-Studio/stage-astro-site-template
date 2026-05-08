import { stageApiBaseUrl, stageApiToken } from './env';

export type StageSingleResponse<T> = { ok: true; content: T };
export type StageCollectionResponse<T> = { ok: true; items: T[]; nextCursor?: string | null };
export type StageCollectionEntryResponse<T> = { ok: true; item: T };
export type StageRequestOptions = {
  query?: Record<string, string | number | boolean | null | undefined>;
};

export const hasStageConfig = Boolean(stageApiBaseUrl && stageApiToken);

const fallbackLogKeys = new Set<string>();

export const logStageFixtureFallback = (label: string, reason: string) => {
  const key = `${label}:${reason}`;
  if (fallbackLogKeys.has(key)) return;
  fallbackLogKeys.add(key);
  console.warn(`[stage] ${label}: ${reason}; using fixture content.`);
};

const buildStageUrl = (path: string, query?: StageRequestOptions['query']) => {
  const url = new URL(`${stageApiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === null || value === undefined) continue;
    url.searchParams.set(key, String(value));
  }
  return url;
};

export const stageFetch = async <T>(method: string, path: string, options: StageRequestOptions = {}): Promise<T> => {
  const response = await fetch(buildStageUrl(path, options.query), {
    method,
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${stageApiToken}`
    }
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error = new Error(body?.message || `Stage API request failed with ${response.status}`);
    Object.assign(error, { status: response.status, code: body?.code, body });
    throw error;
  }
  return body as T;
};

export const stageRequest = async <T>(label: string, request: () => Promise<T>): Promise<T | null> => {
  if (!hasStageConfig) {
    logStageFixtureFallback(label, 'STAGE_API_BASE_URL or STAGE_API_TOKEN is not configured');
    return null;
  }

  try {
    return await request();
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'status' in error && error.status === 404) {
      logStageFixtureFallback(label, 'Stage returned 404');
      return null;
    }
    if (error instanceof TypeError) {
      logStageFixtureFallback(label, 'Stage API is unavailable');
      return null;
    }
    throw new Error(`Stage API request failed for ${label}: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const getStageSingle = async (apiId: string) =>
  (await stageRequest<StageSingleResponse<Record<string, unknown>>>(`single:${apiId}`, () =>
    stageFetch('GET', `/content/singles/${encodeURIComponent(apiId)}`)
  ))?.content ?? null;

export const getStageCollectionEntries = async (
  apiId: string,
  query?: Record<string, string | number | boolean | null | undefined>
) =>
  (await stageRequest<StageCollectionResponse<Record<string, unknown>>>(`collection:${apiId}`, () =>
    stageFetch('GET', `/content/collections/${encodeURIComponent(apiId)}/entries`, { query })
  ))?.items ?? null;

export const getStageCollectionEntry = async (apiId: string, idOrSlug: string) =>
  (await stageRequest<StageCollectionEntryResponse<Record<string, unknown>>>(`collection:${apiId}:${idOrSlug}`, () =>
    stageFetch('GET', `/content/collections/${encodeURIComponent(apiId)}/entries/${encodeURIComponent(idOrSlug)}`)
  ))?.item ?? null;
