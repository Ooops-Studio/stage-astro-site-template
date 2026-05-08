import { stageApiBaseUrl, stagePreviewToken } from './env';

const previewRequest = async (path: string, query?: Record<string, string | boolean>) => {
  if (!stageApiBaseUrl || !stagePreviewToken) return null;
  const url = new URL(`${stageApiBaseUrl}${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    url.searchParams.set(key, String(value));
  }
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${stagePreviewToken}`
    }
  });
  if (!response.ok) return null;
  return response.json();
};

export const getPreviewSingle = async (apiId: string) => {
  return previewRequest(`/content/singles/${encodeURIComponent(apiId)}`, { preview: true });
};

export const getPreviewCollectionEntry = async (apiId: string, idOrSlug: string) => {
  return previewRequest(`/content/collections/${encodeURIComponent(apiId)}/entries/${encodeURIComponent(idOrSlug)}`, { preview: true });
};
