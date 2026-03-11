import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import { siteConfig, siteUrl, contactConfig, websiteConfig } from '@/website-config';

export const metadata: Metadata = {
  title: `Payment Failed | ${siteConfig.name}`,
  description: 'Your payment could not be completed. Please try again or contact support.',
  keywords: ['payment failed', 'checkout error', siteConfig.name],
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
    canonical: `${websiteConfig.canonical.url}/payment-failed`,
  },
  openGraph: {
    title: `Payment Failed | ${siteConfig.name}`,
    description: 'Payment failed. Retry checkout or contact support.',
    url: `${websiteConfig.canonical.url}/payment-failed`,
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
    title: `Payment Failed | ${siteConfig.name}`,
    description: 'Payment failed. Retry checkout or contact support.',
    images: [`${siteUrl}/share-img.png`],
  },
};

export default function PaymentFailedPage() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 bg-background">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Payment Failed</h1>
        <p className="text-muted-foreground mb-8">
          We could not process your payment. Please try again, or contact support if the issue persists.
        </p>
        <Link href="/">
          <Button className="px-8">Back to Home</Button>
        </Link>
      </div>
    </section>
  );
}


