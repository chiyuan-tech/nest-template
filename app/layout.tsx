import './globals.css'
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { ToastProvider } from '@/components/ui/toast-provider';
import { AuthProvider } from '@/components/auth/auth-provider';
import { Inter, Source_Code_Pro } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});
const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-code',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon-32.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon-48.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/favicon-96.ico', sizes: '96x96', type: 'image/x-icon' },
    ],
    shortcut: '/favicon-96.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/site.webmanifest',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" className={`${inter.variable} ${sourceCodePro.variable} dark`} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <ToastProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-[calc(100vh-56px)] pt-14">
              {children}
            </main>
          </AuthProvider>
        </ToastProvider>

      </body>
    </html>
  )
}
