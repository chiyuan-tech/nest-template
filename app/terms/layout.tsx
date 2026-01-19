import { Metadata } from 'next';
import { siteConfig, siteUrl } from '@/website-config';

export const metadata: Metadata = {
  title: `Terms of Service | ${siteConfig.name}`,
  description: `Read the Terms of Service for ${siteConfig.name}. Understand the terms and conditions for using our AI video generation service.`,
  keywords: ['terms of service', 'user agreement', 'legal', siteConfig.name],
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
    canonical: `${siteUrl}/terms`,
  },
  openGraph: {
    title: `Terms of Service | ${siteConfig.name}`,
    description: `Read the Terms of Service for ${siteConfig.name}. Understand the terms and conditions for using our AI video generation service.`,
    url: `${siteUrl}/terms`,
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
    title: `Terms of Service | ${siteConfig.name}`,
    description: `Read the Terms of Service for ${siteConfig.name}. Understand the terms and conditions for using our AI video generation service.`,
    images: [`${siteUrl}/share-img.png`],
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
