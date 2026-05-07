export type SeoPayload = {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string | null;
};

export type HomepageContent = {
  title: string;
  description: string;
  seo: SeoPayload;
};

export type PostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string | null;
};

export type PostDetail = PostSummary & {
  body: string;
  seo: SeoPayload;
};
