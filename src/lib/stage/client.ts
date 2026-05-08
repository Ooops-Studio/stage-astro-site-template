import { OoopsStageApiError, OoopsStageClient } from '@ooopsstudio/stage-api';
import { stageApiBaseUrl, stageApiToken } from './env';

export type StageSingleResponse<T> = { ok: true; content: T };
export type StageCollectionResponse<T> = { ok: true; items: T[]; nextCursor?: string | null };
export type StageCollectionEntryResponse<T> = { ok: true; item: T };
export type StageRequest<T> = (client: OoopsStageClient) => Promise<T>;

export const stageClient = stageApiBaseUrl && stageApiToken
  ? new OoopsStageClient({ baseUrl: stageApiBaseUrl, token: stageApiToken })
  : null;

const fallbackLogKeys = new Set<string>();

export const logStageFixtureFallback = (label: string, reason: string) => {
  const key = `${label}:${reason}`;
  if (fallbackLogKeys.has(key)) return;
  fallbackLogKeys.add(key);
  console.warn(`[stage] ${label}: ${reason}; using fixture content.`);
};

export const stageRequest = async <T>(label: string, request: StageRequest<T>): Promise<T | null> => {
  if (!stageClient) {
    logStageFixtureFallback(label, 'STAGE_API_BASE_URL or STAGE_API_TOKEN is not configured');
    return null;
  }

  try {
    return await request(stageClient);
  } catch (error) {
    if (error instanceof OoopsStageApiError && error.status === 404) {
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
  (await stageRequest<StageSingleResponse<Record<string, unknown>>>(`single:${apiId}`, (client) =>
    client.content.getSingle(apiId)
  ))?.content ?? null;

export const getStageCollectionEntries = async (
  apiId: string,
  query?: Record<string, string | number | boolean | null | undefined>
) =>
  (await stageRequest<StageCollectionResponse<Record<string, unknown>>>(`collection:${apiId}`, (client) =>
    client.content.listCollectionEntries(apiId, query)
  ))?.items ?? null;

export const getStageCollectionEntry = async (apiId: string, idOrSlug: string) =>
  (await stageRequest<StageCollectionEntryResponse<Record<string, unknown>>>(`collection:${apiId}:${idOrSlug}`, (client) =>
    client.content.getCollectionEntry(apiId, idOrSlug)
  ))?.item ?? null;
