import './globals.css'
import Script from 'next/script';
import { Navbar } from '@/components/Navbar';
import { ToastProvider } from '@/components/ui/toast-provider';
import { UserProvider } from '@/lib/providers';
import { siteUrl } from '@/website-config';
import dynamic from 'next/dynamic';
import { AuthModalProvider } from '@/components/auth/auth-modal-provider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'InfiniteTalk AI | Sparse-Frame, Audio-Driven Video Dubbing',
  description: 'InfiniteTalk AI: audio-driven full-body video dubbing that preserves identity and camera motion, with sparse-frame control and long-sequence image-to-video.',
  keywords: ['InfiniteTalk AI', 'sparse-frame video dubbing', 'audio-driven animation', 'image-to-video', 'keyframes'],
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
    title: 'InfiniteTalk AI | Sparse-Frame, Audio-Driven Video Dubbing',
    description: 'InfiniteTalk AI: audio-driven full-body video dubbing that preserves identity and camera motion, with sparse-frame control and long-sequence image-to-video.',
    url: siteUrl,
    siteName: 'InfiniteTalk AI',
    images: [
      {
        url: `${siteUrl}/og-img.png`,
        width: 1200,
        height: 630,
        alt: 'InfiniteTalk AI - AI Video Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: 'InfiniteTalk AI',
    title: 'InfiniteTalk AI | Sparse-Frame, Audio-Driven Video Dubbing',
    description: 'InfiniteTalk AI: audio-driven full-body video dubbing that preserves identity and camera motion, with sparse-frame control and long-sequence image-to-video.',
    images: [`${siteUrl}/og-img.png`],
  },
};

const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "InfiniteTalk AI",
      "url": siteUrl,
      "description": "Audio-driven full-body video dubbing platform with sparse-frame control"
    },
    {
      "@type": "WebSite",
      "name": "InfiniteTalk AI",
      "url": siteUrl,
      "description": "Advanced audio-driven video dubbing platform with sparse-frame control",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "InfiniteTalk AI",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Web Browser",
      "description": "Audio-driven full-body video dubbing with sparse-frame control and long-sequence image-to-video generation",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  ]
};


// Dynamically import Clerk Provider to reduce initial bundle size
const ClerkProviderWithLocale = dynamic(() => import('@/components/auth/clerk-provider'), {
  ssr: true,
  loading: () => <div className="min-h-screen" />,
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <html lang="en">
      <head>

        <link rel="preconnect" href="https://v1.cnzz.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://v1.cnzz.com" />
        <link rel="preconnect" href="https://c.cnzz.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://c.cnzz.com" />
      </head>
      <body className="bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
        <ClerkProviderWithLocale>
          <ToastProvider>
            <UserProvider>
              <AuthModalProvider>
                <Navbar />
                <main className="min-h-[calc(100vh-80px)]">
                  {children}
                </main>
              </AuthModalProvider>
            </UserProvider>
          </ToastProvider>
        </ClerkProviderWithLocale>

        {/* CNZZ init - optimized with lazyOnload */}
        <Script id="cnzz-init" strategy="lazyOnload">
          {`var _czc = _czc || []; _czc.push(["_setAccount", 1281431393]);`}
        </Script>
        {/* CNZZ scripts - lazy load on idle */}
        <Script
          id="cnzz-1"
          strategy="lazyOnload"
          src="https://v1.cnzz.com/z.js?id=1281417985&async=1"
        />
        <Script
          id="cnzz-2"
          strategy="lazyOnload"
          src="https://v1.cnzz.com/z.js?id=1281431393&async=1"
        />

     

      </body>
    </html>
  )
}
