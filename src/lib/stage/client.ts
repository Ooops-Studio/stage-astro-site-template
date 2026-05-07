import { stageApiBaseUrl, stageApiToken } from './env';

export type StageSingleResponse<T> = { ok: true; content: T };
export type StageCollectionResponse<T> = { ok: true; items: T[] };
export type StageCollectionEntryResponse<T> = { ok: true; item: T };

export const requestStage = async <T>(path: string): Promise<T | null> => {
  if (!stageApiBaseUrl || !stageApiToken) return null;

  const response = await fetch(`${stageApiBaseUrl}${path}`, {
    headers: {
      authorization: `Bearer ${stageApiToken}`,
      accept: 'application/json'
    }
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Stage API request failed: ${response.status} ${response.statusText} for ${path}`);
  }

  return response.json() as Promise<T>;
};
