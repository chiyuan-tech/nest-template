import { Metadata } from 'next';
import Script from 'next/script';
import { Footer } from '../../components/Footer';
import PricingSection from '@/components/PricingSection';
import PricingFAQ from './PricingFAQ';
import { siteConfig, siteUrl, websiteConfig } from '@/website-config';

// SEO metadata
export const metadata: Metadata = {
  title: `${siteConfig.name} Pricing - Video Generation Plans`,
  description: `Discover ${siteConfig.name} pricing plans. Generate unlimited talking videos with our AI. Flexible billing options available.`,
  keywords: ['AI video pricing', 'video generation cost', 'AI dubbing plans', siteConfig.name],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: `${websiteConfig.canonical.url}/pricing`,
  },
  openGraph: {
    title: `${siteConfig.name} Pricing - Video Generation Plans`,
    description: `Discover ${siteConfig.name} pricing plans. Generate unlimited talking videos with our AI. Flexible billing options available.`,
    url: `${websiteConfig.canonical.url}/pricing`,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteUrl}/share-img.png`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} Pricing Plans`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.name,
    title: `${siteConfig.name} Pricing - Video Generation Plans`,
    description: `Discover ${siteConfig.name} pricing plans. Generate unlimited talking videos with our AI.`,
    images: [`${siteUrl}/share-img.png`],
  },
};

// JSON-LD structured data for pricing
const pricingSchemaData = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: siteConfig.name,
  description: siteConfig.description,
  brand: {
    '@type': 'Brand',
    name: siteConfig.name
  },
  url: websiteConfig.canonical.url,
  offers: [
    {
      '@type': 'Offer',
      name: 'Starter Plan',
      description: 'Perfect for trying out InfiniteTalk AI with basic features',
      price: '9.90',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: '2025-01-01',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: '9.90',
        priceCurrency: 'USD',
        eligibleQuantity: {
          '@type': 'QuantitativeValue',
          value: 1,
          unitText: 'month'
        }
      }
    },
    {
      '@type': 'Offer',
      name: 'Pro Plan',
      description: 'Most popular plan with advanced features and commercial use',
      price: '29.90',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: '2025-01-01',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: '29.90',
        priceCurrency: 'USD',
        eligibleQuantity: {
          '@type': 'QuantitativeValue',
          value: 1,
          unitText: 'month'
        }
      }
    },
    {
      '@type': 'Offer',
      name: 'Ultimate Plan',
      description: 'Premium plan with unlimited features and priority support',
      price: '49.90',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: '2025-01-01',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: '49.90',
        priceCurrency: 'USD',
        eligibleQuantity: {
          '@type': 'QuantitativeValue',
          value: 1,
          unitText: 'month'
        }
      }
    }
  ]
};

const faqSchemaData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is this a monthly subscription service?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We offer both one-time purchases and monthly subscriptions. One-time purchases never expire, while subscriptions provide fresh credits every month.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do credits expire monthly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'One-time purchase credits never expire. Subscription credits are refreshed monthly and do not carry over to the next month.'
      }
    },
    {
      '@type': 'Question',
      name: 'What are credits?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Credits are used to generate videos and images. Different features consume different amounts of credits based on complexity.'
      }
    },
    {
      '@type': 'Question',
      name: 'What payment methods do you accept?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Currently, we accept Visa, Mastercard, American Express, Discover, Japan Credit Bureau (JCB) and other credit cards.'
      }
    }
  ]
};

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* JSON-LD structured data for pricing */}
      <Script id="ld-json-pricing" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchemaData) }}
      />
      <Script id="ld-json-pricing-faq" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaData) }}
      />
      
      <main className="flex-grow relative">
        {/* Fixed background gradient */}
        <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-background via-primary/10 via-primary/20 via-primary/15 to-slate-950 -z-10" />
        <div className="fixed inset-0 w-screen h-screen bg-gradient-to-tl from-transparent via-primary/5 to-transparent -z-10" />
        
        <PricingSection />
        <PricingFAQ />
      </main>
      
      {/* Footer without friendly links */}
      <Footer />
    </div>
  );
}
