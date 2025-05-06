import { MetadataRoute } from 'next';

// !!! IMPORTANT: Replace with your actual production domain !!!
// You can use environment variables like process.env.NEXT_PUBLIC_SITE_URL
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wwww.framepola.com';

export default function sitemap(): MetadataRoute.Sitemap {
  // Removed locales array as we generate canonical URLs now
  // const locales = ['en', 'zh'];

  // Static pages (relative to root)
  const staticPages = [
    '/',
    '/blog',
    // '/pricing', // Assuming pricing is a section on home page handled by /#pricing link, remove if it's not a separate page
    '/terms',
    '/privacy',
    '/sign-in', // Add sign-in page
    '/sign-up', // Add sign-up page
    // Add other static pages if they exist (e.g., '/profile')
    '/profile' 
  ];

  // Blog post slugs (obtained from somewhere, e.g., CMS or file system)
  const blogPostSlugs = [
    'how-to-take-perfect-polaroid-style-photos',
    'new-feature-3d-effect-enhancement',
    'user-story-wedding-photos-to-creative-souvenirs',
    'history-and-charm-of-polaroid-style',
    '5-creative-ways-to-display-polaroid-photos',
    'performance-optimization-update-faster-processing'
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static pages URLs (without locale prefix)
  staticPages.forEach(page => {
    sitemapEntries.push({
      url: `${BASE_URL}${page === '/' ? '' : page}`, // Use canonical URL
      lastModified: new Date(), 
      changeFrequency: page === '/' ? 'daily' : 'weekly',
      priority: page === '/' ? 1.0 : 0.8,
    });
  });

  // Add dynamic blog post URLs (without locale prefix)
  blogPostSlugs.forEach(slug => {
    sitemapEntries.push({
      url: `${BASE_URL}/blog/${slug}`, // Correct path structure
      lastModified: new Date(), 
      changeFrequency: 'monthly', 
      priority: 0.7,
    });
  });

  // Note: This sitemap lists canonical URLs. Search engines will rely on the
  // <html lang="..."> attribute (set dynamically in app/layout.tsx)
  // to understand the language of the crawled page.

  return sitemapEntries;
} 