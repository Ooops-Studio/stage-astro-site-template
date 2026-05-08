import { createConsentBanner, onConsentChange } from '@ooopsstudio/analytics-consent';

export const mountAnalyticsConsentBanner = () => {
  if (typeof window === 'undefined') return null;

  const banner = createConsentBanner({
    variant: 'compact',
    position: 'bottom',
    theme: 'auto',
    privacyHref: '/privacy'
  });

  const unsubscribe = onConsentChange((consent) => {
    window.dispatchEvent(new CustomEvent('site:analytics-consent', { detail: consent }));
  });

  return {
    destroy() {
      unsubscribe();
      banner.destroy();
    }
  };
};
