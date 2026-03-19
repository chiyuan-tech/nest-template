import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import { SITE_NAME, siteUrl, websiteConfig, getPageTdk } from '@/website-config';

const tdk = getPageTdk('/payment-failed');

export const metadata: Metadata = {
  title: tdk.title,
  description: tdk.description,
  keywords: tdk.keywords,
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
    title: tdk.title,
    description: tdk.description,
    url: `${websiteConfig.canonical.url}/payment-failed`,
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


