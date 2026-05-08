import { OoopsStageClient } from '@ooopsstudio/stage-api';
import { stageApiBaseUrl, stagePreviewToken } from './env';

export const stagePreviewClient = stageApiBaseUrl && stagePreviewToken
  ? new OoopsStageClient({ baseUrl: stageApiBaseUrl, token: stagePreviewToken })
  : null;

export const getPreviewSingle = async (apiId: string) => {
  if (!stagePreviewClient) return null;
  return stagePreviewClient.request('GET', `/content/singles/${encodeURIComponent(apiId)}`, {
    query: { preview: true }
  });
};

export const getPreviewCollectionEntry = async (apiId: string, idOrSlug: string) => {
  if (!stagePreviewClient) return null;
  return stagePreviewClient.request('GET', `/content/collections/${encodeURIComponent(apiId)}/entries/${encodeURIComponent(idOrSlug)}`, {
    query: { preview: true }
  });
};

