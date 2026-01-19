import './globals.css'
import Script from 'next/script';
import { Navbar } from '@/components/Navbar';
import { ToastProvider } from '@/components/ui/toast-provider';
import { UserProvider } from '@/lib/providers';
import dynamic from 'next/dynamic';
import { AuthModalProvider } from '@/components/auth/auth-modal-provider';


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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>

        <link rel="preconnect" href="https://v1.cnzz.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://v1.cnzz.com" />
        <link rel="preconnect" href="https://c.cnzz.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://c.cnzz.com" />
      </head>
      <body className="bg-background text-foreground">
     
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
