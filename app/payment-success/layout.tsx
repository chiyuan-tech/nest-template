import { Metadata } from 'next';
import { siteConfig, siteUrl } from '@/website-config';

export const metadata: Metadata = {
  title: `Payment Successful | ${siteConfig.name}`,
  description: `Your payment was successful. Your credits have been added to your account.`,
  keywords: ['payment success', 'purchase complete', siteConfig.name],
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: `${siteUrl}/payment-success`,
  },
  openGraph: {
    title: `Payment Successful | ${siteConfig.name}`,
    description: `Your payment was successful. Your credits have been added to your account.`,
    url: `${siteUrl}/payment-success`,
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
    title: `Payment Successful | ${siteConfig.name}`,
    description: `Your payment was successful. Your credits have been added to your account.`,
    images: [`${siteUrl}/share-img.png`],
  },
};

export default function PaymentSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
