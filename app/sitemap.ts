import { MetadataRoute } from 'next';
import { blogPostMetadata } from '@/lib/blogData';

// !!! IMPORTANT: Replace with your actual production domain !!!
// You can use environment variables like process.env.NEXT_PUBLIC_SITE_URL
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.4oimagex.com';

export default function sitemap(): MetadataRoute.Sitemap {
  // Removed locales array as we generate canonical URLs now
  // const locales = ['en', 'zh'];

  // Static pages (relative to root)
  const staticPages = [
    '/',
    '/blog',
    '/terms',
    '/privacy',
    '/explore'
  ];

  // Get blog post slugs from the actual data source
  const blogPostSlugs = blogPostMetadata.map(post => post.slug);

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