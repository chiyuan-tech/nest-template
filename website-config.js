/**
 * Website Configuration
 * Central configuration file for public website settings
 */

export const websiteConfig = {
  // Contact Information
  contact: {
    supportEmail: 'support@example.com',
  },

  // Canonical / site URL - single source for all public URLs (canonical, OG, sitemap, share images)
  canonical: {
    url: 'https://example.com',
  },
  // API Configuration
  api: {
    baseUrl: 'https://api.example.com',
    appId: 'template-app',
  },

  // SEO Configuration
  seo: {
    // Static pages for sitemap generation
    staticPages: [
      '/',
      '/pricing',
      // '/blog',
      // '/terms',
      // '/privacy',
      // '/refund',
    ],
  },

  // Page TDK (Title ≤60, Description ≤160, Keywords total <100) – import in app via getPageTdk(path)
  pageTdk: {
    '/': {
      title: 'Website Template',
      description: 'A reusable website template with configurable pages, pricing, authentication, and SEO settings.',
      keywords: ['website template', 'startup template', 'SaaS template', 'Next.js template'],
    },
    '/payment-failed': {
      title: 'Payment Failed',
      description: 'Your payment could not be completed. Please try again or contact support.',
      keywords: ['payment failed', 'checkout error'],
    },
    '/payment-success': {
      title: 'Payment Successful',
      description: 'Your payment was successful. Your credits have been added to your account.',
      keywords: ['payment success', 'purchase complete'],
    },
    '/referral': {
      title: 'Referral Program',
      description: 'Share your referral link and earn credits when friends join. Invite friends and earn rewards.',
      keywords: ['referral program', 'earn credits', 'invite friends'],
    },
    '/pricing': {
      title: 'Pricing',
      description: 'Explore pricing plans and choose the option that fits your project.',
      keywords: ['pricing', 'plans', 'subscription', 'credits'],
    },
    '/terms': {
      title: 'Terms of Service',
      description: 'Read the Terms of Service. Understand the terms and conditions for using this website.',
      keywords: ['terms of service', 'user agreement', 'legal'],
    },
    '/privacy': {
      title: 'Privacy Policy',
      description: 'Read the Privacy Policy. Learn how we collect, use, and protect your personal information.',
      keywords: ['privacy policy', 'data protection', 'user privacy'],
    },
    '/refund': {
      title: 'Refund Policy',
      description: 'Read the Refund Policy. Learn about our refund guarantee and refund eligibility.',
      keywords: ['refund policy', 'money back guarantee', 'refund'],
    },
    '/blog': {
      title: 'Blog',
      description: 'Read the latest posts, product updates, tutorials, and company news.',
      keywords: ['blog', 'updates', 'tutorials', 'news'],
    },
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
export const contactConfig = websiteConfig.contact;
export const apiConfig = websiteConfig.api;
export const seoConfig = websiteConfig.seo;
export const pricingConfig = websiteConfig.pricing;

// Export siteUrl for convenience (alias of canonical.url)
export const siteUrl = websiteConfig.canonical.url;

// Site display name and description (for UI/metadata when needed)
export const SITE_NAME = 'Website Template';
export const SITE_DESCRIPTION = 'A reusable website template with configurable pages, pricing, authentication, and SEO settings.';

// Backward compatibility: siteConfig for components that use siteConfig.name / siteConfig.description
export const siteConfig = { name: SITE_NAME, description: SITE_DESCRIPTION };

// Page TDK – use in app: import { getPageTdk } from '@/website-config'; const tdk = getPageTdk('/');
export const pageTdk = websiteConfig.pageTdk;

// Helper: get TDK for a path. Never returns null – unknown path falls back to homepage TDK.
export function getPageTdk(path) {
  const tdk = websiteConfig.pageTdk[path] ?? websiteConfig.pageTdk['/'];
  return {
    title: tdk.title,
    description: tdk.description ?? SITE_DESCRIPTION,
    keywords: tdk.keywords ?? [],
  };
}

// Export staticPages for convenience
export const staticPages = websiteConfig.seo.staticPages;
