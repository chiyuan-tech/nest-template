import type { Metadata } from 'next';
import { SITE_NAME, siteUrl, websiteConfig, getPageTdk } from '@/website-config';
import dynamic from 'next/dynamic';
import {Footer} from '@/components/Footer';

const PromotionClient = dynamic(() => import('./PromotionClient'), { ssr: true });

const tdk = getPageTdk('/referral');

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
    canonical: `${websiteConfig.canonical.url}/referral`,
  },
  openGraph: {
    title: tdk.title,
    description: tdk.description,
    url: `${websiteConfig.canonical.url}/referral`,
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

export default function PromotionPage() {
  return (
    <>
      <PromotionClient />
      <Footer />
    </>
  );
}


