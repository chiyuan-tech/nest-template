import './globals.css'
import Script from 'next/script';
import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ToastProvider } from '@/components/ui/toast-provider';
import { UserProvider } from '@/lib/providers';
import dynamic from 'next/dynamic';
import { AuthModalProvider } from '@/components/auth/auth-modal-provider';
import { ScrollRevealInit } from '@/components/animations/ScrollRevealInit';
import { getPageTdk, siteConfig, siteUrl, websiteConfig } from '@/website-config';
import { templateFontPair } from './template-font-pair.generated';
const tdk = getPageTdk('/');
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: tdk.title,
  description: tdk.description,
  keywords: tdk.keywords,
  alternates: { canonical: websiteConfig.canonical.url },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
    apple: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: tdk.title, description: tdk.description, url: websiteConfig.canonical.url, siteName: siteConfig.name, locale: 'en_US', type: 'website', images: [{ url: '/share-img.png', width: 1200, height: 630, alt: `${siteConfig.name} share image` }],
  },
  twitter: {
    card: 'summary_large_image', title: tdk.title, description: tdk.description, images: ['/share-img.png'],
  },
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
    <html lang="en" className="dark" suppressHydrationWarning style={{
      '--font-template-body': templateFontPair.body,
      '--font-template-display': templateFontPair.display,
      '--font-template-mono': templateFontPair.mono,
    } as CSSProperties}>
      <head>

        <link rel="preconnect" href="https://v1.cnzz.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://v1.cnzz.com" />
        <link rel="preconnect" href="https://c.cnzz.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://c.cnzz.com" />
      </head>
      <body className="bg-background text-foreground">
        <ScrollRevealInit />
        <ClerkProviderWithLocale>
          <ToastProvider>
            <UserProvider>
              <AuthModalProvider>
                <Navbar />
                <main className="min-h-[calc(100vh-80px)]">
                  {children}
                </main>
                <Footer />
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
