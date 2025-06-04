import { MetadataRoute } from 'next';
import { serverCmsApi, type BlogPost } from './server-api';

// !!! IMPORTANT: Replace with your actual production domain !!!
// You can use environment variables like process.env.NEXT_PUBLIC_SITE_URL
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.quickmedcert.com';

// 生成文章slug（与blog页面保持一致）
function generateSlug(title: string): string {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50)
    .replace(/^-+|-+$/g, '');
}

// 获取博客文章数据
async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const blogResponse = await serverCmsApi.getBlogList(1, 100, 0); // 获取所有文章用于sitemap
    console.log('Sitemap: Successfully fetched blog posts:', blogResponse.list.length);
    return blogResponse.list;
  } catch (error) {
    console.error('Sitemap: Failed to fetch blog posts:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Removed locales array as we generate canonical URLs now
  // const locales = ['en', 'zh'];

  // Static pages (relative to root)
  const staticPages = [
    '/',
    '/blog',
    '/terms',
    '/privacy'
  ];

  // Get blog posts from API
  const blogPosts = await getBlogPosts();
  const blogPostSlugs = blogPosts.map(post => generateSlug(post.title));

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