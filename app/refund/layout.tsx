import { Metadata } from 'next';
import { siteConfig, siteUrl, websiteConfig } from '@/website-config';

export const metadata: Metadata = {
  title: `Refund Policy | ${siteConfig.name}`,
  description: `Read the Refund Policy for ${siteConfig.name}. Learn about our 7-day refund guarantee and refund eligibility.`,
  keywords: ['refund policy', 'money back guarantee', 'refund', siteConfig.name],
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
    canonical: `${websiteConfig.canonical.url}/refund`,
  },
  openGraph: {
    title: `Refund Policy | ${siteConfig.name}`,
    description: `Read the Refund Policy for ${siteConfig.name}. Learn about our 7-day refund guarantee and refund eligibility.`,
    url: `${websiteConfig.canonical.url}/refund`,
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
    title: `Refund Policy | ${siteConfig.name}`,
    description: `Read the Refund Policy for ${siteConfig.name}. Learn about our 7-day refund guarantee and refund eligibility.`,
    images: [`${siteUrl}/share-img.png`],
  },
};

export default function RefundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
