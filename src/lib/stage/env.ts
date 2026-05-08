export const stageApiBaseUrl = import.meta.env.STAGE_API_BASE_URL?.replace(/\/$/, '') || '';
export const stageApiToken = import.meta.env.STAGE_API_TOKEN || '';
export const siteUrl = (import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321').replace(/\/$/, '');
export const stagePreviewToken = import.meta.env.STAGE_PREVIEW_TOKEN || '';
export const stagePreviewSecret = import.meta.env.STAGE_PREVIEW_SECRET || '';
