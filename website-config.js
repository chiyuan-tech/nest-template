/**
 * Website Configuration
 * Central configuration file for public website settings
 */

export const websiteConfig = {
  // Site Information
  site: {
    name: 'InfiniteTalk AI',
    shortName: 'InfiniteTalk',
    description: 'Advanced AI-powered video generation and dubbing service',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.infinitetalk.net',
  },

  // Contact Information
  contact: {
    supportEmail: 'support@infinitetalk.net',
  },

  // Pricing Configuration
  pricing: {
    // One-time purchase plans
    oneTimePlans: [
      {
        key: 'Starter',
        priceId: 'price_1S0bzJ2LCxiz8WFQshNuYpsJ',
        popular: false,
        title: 'Starter',
        price: '$9.9',
        priceAmount: 9.9,
        buttonText: 'Get 90 Credits',
        features: [
          '90 Credits included',
          '$0.11 per credit',
          'HD video generation',
          'Lip-sync & body animation',
          'Download enabled',
          'Email support'
        ]
      },
      {
        key: 'premium',
        priceId: 'price_1S0bze2LCxiz8WFQJBMjVxi0',
        popular: false,
        title: 'Pro',
        price: '$29.9',
        priceAmount: 29.9,
        buttonText: 'Get 400 Credits',
        features: [
          '400 Credits included',
          '$0.074 per credit',
          'HD video generation',
          'Lip-sync & body animation',
          'Download enabled',
          'Commercial use license',
          'Priority support'
        ]
      },
      {
        key: 'ultimate',
        priceId: 'price_1S0bzt2LCxiz8WFQXQ5Foe8K',
        popular: true,
        title: 'Ultimate',
        price: '$49.9',
        priceAmount: 49.9,
        buttonText: 'Get 800 Credits',
        features: [
          '800 Credits included',
          '$0.062 per credit',
          'HD video generation',
          'Lip-sync & body animation',
          'Download enabled',
          'Commercial use license',
          'Priority support',
          'Best value per credit'
        ]
      },
      {
        key: 'enterprise',
        priceId: 'price_1S3sev2LCxiz8WFQana9TXxD',
        popular: false,
        title: 'Enterprise',
        price: '$99.9',
        priceAmount: 99.9,
        buttonText: 'Get 1800 Credits',
        features: [
          '1800 Credits included',
          '$0.055 per credit',
          'HD video generation ',
          'Lip-sync & body animation',
          'Download enabled',
          'Commercial use license',
          'Priority support',
          'Best value per credit',
          'Bulk processing'
        ]
      }
    ],
  },
};

// Export individual sections for convenience
export const siteConfig = websiteConfig.site;
export const contactConfig = websiteConfig.contact;
export const pricingConfig = websiteConfig.pricing;

// Export siteUrl for convenience
export const siteUrl = websiteConfig.site.url;
