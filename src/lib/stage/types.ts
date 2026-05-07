export type SeoPayload = {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string | null;
};

export type HomepageContent = {
  heading: string;
  description: string;
  seo: SeoPayload;
};
