/**
 * Website Configuration
 * Central configuration file for public website settings
 */

export const websiteConfig = {
  // Site Information
  site: {
    name: 'LTX AI',
    description: 'Ltx 2.3 AI Video Generator creates sharp AI videos with cleaner audio, native portrait mode, stronger motion, and fast production-ready workflows.',
  },

  // Contact Information
  contact: {
    supportEmail: 'support@ltxai.app',
  },

  // Canonical / site URL - single source for all public URLs (canonical, OG, sitemap, share images)
  canonical: {
    url:'https://ltxai.app',
  },
  // API Configuration
  api: {
    baseUrl: 'https://svc.ltxai.app',
    appId: 'ltx23',
  },

  // SEO Configuration
  seo: {
    // Static pages for sitemap generation
    staticPages: [
      '/',
      '/ltx-2-3',
      '/ltx-video-extend',
      '/ltx-lipsync',
      '/prompting-guide',
      '/pricing',
      '/blog',
      '/terms',
      '/privacy',
      '/refund',
    ],
  },

  // Pricing Configuration
  pricing: {
    // One-time purchase plans
    oneTimePlans: [
      {
        key: 'Starter',
        priceId: 'price_1T9Ep9QeNOvbi7iexShMkWvX',
        popular: false,
        title: 'Starter',
        price: '$9.9',
        priceAmount: 9.9,
        buttonText: 'Get 99 Credits',
        features: [
          '99 credits included',
          '$0.10 per credit',
          'HD text-to-video or image-to-video with natural native audio',
          '720p export, No watermark download',
          'Commercial use license',
          'Standard queue speed',
          'Email support'
        ]
      },
      {
        key: 'Basic',
        priceId: 'price_1T9EpQQeNOvbi7ieNreeDNvb',
        popular: false,
        title: 'Basic',
        price: '$29.9',
        priceAmount: 29.9,
        buttonText: 'Get 330 Credits',
        features: [
          '330 credits included',
          '$0.085 per credit',
          'Faster HD generation for daily content',
          'Text to Video & Image to Video with native audio',
          '1080p export, No watermark download',
          'Commercial use license',
          'Priority queue speed',
          'Priority support (email)'
        ]
      },
      {
        key: 'Plus',
        priceId: 'price_1T9EpcQeNOvbi7iePUHdg6tO',
        popular: true,
        title: 'Plus',
        price: '$49.9',
        priceAmount: 49.9,
        buttonText: 'Get 600 Credits',
        features: [
          '600 credits included',
          '$0.083 per credit',
          'Scale creative runs with better stability and look',
          'Text to Video & Image to Video with native audio',
          '1080p export, No watermark download',
          'Commercial use license',
          'Faster priority queue + up to 5 concurrent jobs',
          'Priority support'
        ]
      },
      {
        key: 'Professional',
        priceId: 'price_1T9Eq3QeNOvbi7ied2IVXKmY',
        popular: false,
        title: 'Professional',
        price: '$99.9',
        priceAmount: 99.9,
        buttonText: 'Get 1250 Credits',
        features: [
          '1250 credits included',
          '$0.079 per credit (best value per credit)',
          'High-volume, professional delivery and teams',
          'Text to Video & Image to Video with native audio',
          '1080p export, No watermark download',
          'Commercial use license',
          'Fastest queue + up to 10 concurrent jobs',
          'Full effects pack + early access to new features',
          '24/7 priority support',
          'Bulk processing',
          'API access (coming soon)'
        ]
      }
    ],
  },
};

// Export individual sections for convenience
export const siteConfig = websiteConfig.site;
export const contactConfig = websiteConfig.contact;
export const apiConfig = websiteConfig.api;
export const seoConfig = websiteConfig.seo;
export const pricingConfig = websiteConfig.pricing;

// Export siteUrl for convenience (alias of canonical.url)
export const siteUrl = websiteConfig.canonical.url;

// Export staticPages for convenience
export const staticPages = websiteConfig.seo.staticPages;
