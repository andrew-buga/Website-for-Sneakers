/**
 * Google Analytics 4 & A/B Testing Utilities
 * 
 * Tracks events, page views, and A/B test variants
 * Requires Google Analytics Measurement ID in NEXT_PUBLIC_GA_ID env variable
 */

/**
 * Track custom event in Google Analytics
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, string | number | boolean>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

/**
 * Track page view (usually automatic, but useful for SPA navigation)
 */
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
};

/**
 * Track A/B test variant assignment
 * Called when user is first assigned to a test variant
 */
export const trackABTestVariant = (testName: string, variant: 'A' | 'B') => {
  trackEvent('ab_test_variant', {
    test_name: testName,
    variant: variant,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track A/B test conversion (when user completes test goal)
 */
export const trackABTestConversion = (
  testName: string,
  variant: 'A' | 'B',
  conversionType: string
) => {
  trackEvent('ab_test_conversion', {
    test_name: testName,
    variant: variant,
    conversion_type: conversionType,
  });
};

/**
 * Track product interaction
 */
export const trackProductInteraction = (
  productId: string,
  productName: string,
  action: 'view' | 'add_to_cart' | 'add_to_wishlist' | 'purchase'
) => {
  trackEvent(`product_${action}`, {
    product_id: productId,
    product_name: productName,
  });
};

/**
 * Track form submission
 */
export const trackFormSubmission = (formName: string, success: boolean) => {
  trackEvent('form_submission', {
    form_name: formName,
    success: success,
  });
};

/**
 * Track search query
 */
export const trackSearch = (searchQuery: string, resultsFound: number) => {
  trackEvent('search', {
    search_query: searchQuery,
    results_found: resultsFound,
  });
};

/**
 * Generate consistent variant assignment for A/B tests
 * Uses user ID to deterministically assign variants (consistent across sessions)
 */
export function getTestVariant(testId: string, userId: string): 'A' | 'B' {
  // Hash userId to get a consistent variant for this test
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) % 2 === 0 ? 'A' : 'B';
}

/**
 * A/B Test Configuration
 * Define your active tests here
 */
export const AB_TESTS = {
  META_DESCRIPTION_V1: {
    id: 'meta_desc_v1',
    name: 'Meta Description Optimization',
    duration: '4 weeks',
    trafficSplit: 0.5, // 50% test, 50% control
  },
  H1_TAG_OPTIMIZATION: {
    id: 'h1_optimization',
    name: 'H1 Tag Optimization',
    duration: '6 weeks',
    trafficSplit: 0.5,
  },
  IMAGE_ALT_TEXT_V1: {
    id: 'alt_text_v1',
    name: 'Image Alt Text Optimization',
    duration: '8 weeks',
    trafficSplit: 0.5,
  },
} as const;

/**
 * Declare gtag for TypeScript
 */
declare global {
  interface Window {
    gtag?: (
      cmd: string,
      id?: string,
      config?: Record<string, any>
    ) => void;
  }
}

export {};
