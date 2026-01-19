import { GoogleOneTapAuth } from '../components/auth';
import { Footer } from '../components/Footer';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import { siteConfig, siteUrl } from '@/website-config';

// Client island - dynamically imported for code splitting
const PricingSectionWithHeader = dynamic(() => import('../components/PricingSectionWithHeader'), {
  loading: () => <div className="h-96 animate-pulse bg-muted/10 rounded-lg" />,
});

// SEO metadata
export const metadata: Metadata = {
  title: `${siteConfig.name} - AI Video Generation Platform`,
  description: `${siteConfig.description}. Create infinite-length talking videos with accurate lip sync and natural motion.`,
  keywords: ['AI video generation', 'talking video', 'video dubbing', 'lip sync', siteConfig.name],
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
    canonical: siteUrl,
  },
  openGraph: {
    title: `${siteConfig.name} - AI Video Generation Platform`,
    description: `${siteConfig.description}. Create infinite-length talking videos with accurate lip sync and natural motion.`,
    url: siteUrl,
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
    title: `${siteConfig.name} - AI Video Generation Platform`,
    description: `${siteConfig.description}. Create infinite-length talking videos with accurate lip sync and natural motion.`,
    images: [`${siteUrl}/share-img.png`],
  },
};

export default async function Home() {

  return (
    <div className="min-h-screen flex flex-col">
 
      
      {/* Google One Tap Auth - only shown when user is not signed in */}
      <GoogleOneTapAuth
        cancelOnTapOutside={true}
        signInForceRedirectUrl="/"
        signUpForceRedirectUrl="/"
      />
      
      <main className="flex-grow relative">
        <PricingSectionWithHeader />
      </main>
      
      {/* Server Component: Footer */}
      <Footer />
    </div>
  );
}
