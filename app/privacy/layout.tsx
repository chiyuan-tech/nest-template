import { Metadata } from 'next';
import { siteConfig, siteUrl } from '@/website-config';

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description: `Read the Privacy Policy for ${siteConfig.name}. Learn how we collect, use, and protect your personal information.`,
  keywords: ['privacy policy', 'data protection', 'user privacy', siteConfig.name],
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
    canonical: `${siteUrl}/privacy`,
  },
  openGraph: {
    title: `Privacy Policy | ${siteConfig.name}`,
    description: `Read the Privacy Policy for ${siteConfig.name}. Learn how we collect, use, and protect your personal information.`,
    url: `${siteUrl}/privacy`,
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
    title: `Privacy Policy | ${siteConfig.name}`,
    description: `Read the Privacy Policy for ${siteConfig.name}. Learn how we collect, use, and protect your personal information.`,
    images: [`${siteUrl}/share-img.png`],
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
