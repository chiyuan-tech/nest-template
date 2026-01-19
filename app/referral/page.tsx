import type { Metadata } from 'next';
import { siteConfig, siteUrl } from '@/website-config';
import dynamic from 'next/dynamic';
import {Footer} from '@/components/Footer';

const PromotionClient = dynamic(() => import('./PromotionClient'), { ssr: true });

export const metadata: Metadata = {
  title: `${siteConfig.name} Referral Program`,
  description: `Share your referral link and earn credits when friends join ${siteConfig.name}.`,
  keywords: ['referral program', 'earn credits', 'invite friends', siteConfig.name],
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
    canonical: `${siteUrl}/referral`,
  },
  openGraph: {
    title: `${siteConfig.name} Referral Program`,
    description: `Invite friends and earn credits on ${siteConfig.name}.`,
    url: `${siteUrl}/referral`,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteUrl}/share-img.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.name,
    title: `${siteConfig.name} Referral Program`,
    description: `Invite friends and earn credits on ${siteConfig.name}.`,
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


