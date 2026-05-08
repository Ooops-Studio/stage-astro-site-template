export type SeoPayload = {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string | null;
  googleSiteVerification?: string | null;
  robots?: {
    index: boolean;
    follow: boolean;
  };
  siteName?: string | null;
  twitterHandle?: string | null;
  type?: 'website' | 'article' | string;
};

export type HomepageContent = {
  heading: string;
  description: string;
  seo: SeoPayload;
};
