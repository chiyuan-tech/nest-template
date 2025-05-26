const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.quickmedcert.com';

export const metadata = {
  title: 'QuickMedCert - AI Medical Certificate Generator',
  description: 'Generate professional medical certificates instantly with our AI-powered certificate generator. Fast, reliable, and easy to use.',
  keywords: ['medical certificate', 'AI certificate generator', 'online medical certificate', 'instant health certificate'],
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
    title: 'QuickMedCert - AI Medical Certificate Generator',
    description: 'Generate professional medical certificates instantly with our AI-powered certificate generator. Fast, reliable, and easy to use.',
    url: siteUrl,
    siteName: 'QuickMedCert',
    images: [
      {
        url: `${siteUrl}/og-img.png`,
        width: 1200,
        height: 630,
        alt: 'QuickMedCert - AI Medical Certificate Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuickMedCert - AI Medical Certificate Generator',
    description: 'Generate professional medical certificates instantly with our AI-powered certificate generator. Fast, reliable, and easy to use.',
    images: [`${siteUrl}/og-img.png`],
  },
};

export const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "QuickMedCert",
      "url": siteUrl
    },
    {
      "@type": "WebSite",
      "name": "QuickMedCert",
      "url": siteUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    }
  ]
};

export { siteUrl }; 