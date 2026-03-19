import { GoogleOneTapAuth } from '../components/auth';
import { Footer } from '../components/Footer';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import { SITE_NAME, SITE_DESCRIPTION, siteUrl, websiteConfig, getPageTdk } from '@/website-config';

const tdk = getPageTdk('/');

// Client island - dynamically imported for code splitting
const Hero = dynamic(() => import('../components/home/Hero'), {
  loading: () => <div className="h-96 animate-pulse bg-muted/10 rounded-lg" />,
});

const PricingSectionWithHeader = dynamic(() => import('../components/PricingSectionWithHeader'), {
  loading: () => <div className="h-96 animate-pulse bg-muted/10 rounded-lg" />,
});

// JSON-LD WebSite for homepage
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: websiteConfig.canonical.url,
};

// SEO metadata
export const metadata: Metadata = {
  title: tdk.title,
  description: tdk.description,
  keywords: tdk.keywords,
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
    canonical: websiteConfig.canonical.url,
  },
  openGraph: {
    title: tdk.title,
    description: tdk.description,
    url: websiteConfig.canonical.url,
    siteName: SITE_NAME,
    images: [
      {
        url: `${siteUrl}/share-img.png`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: SITE_NAME,
    title: tdk.title,
    description: tdk.description,
    images: [`${siteUrl}/share-img.png`],
  },
};

export default async function Home() {

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {/* Google One Tap Auth - only shown when user is not signed in */}
      <GoogleOneTapAuth
        cancelOnTapOutside={true}
        signInForceRedirectUrl="/"
        signUpForceRedirectUrl="/"
      />
      
      <main className="flex-grow relative">
        <Hero />
        <PricingSectionWithHeader />
      </main>
      
      {/* Server Component: Footer */}
      <Footer />
    </div>
  );
}
