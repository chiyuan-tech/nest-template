import type { Metadata } from 'next';
import type { BlogPost } from '@/lib/server-api';
import { SITE_NAME, getPageTdk, siteUrl } from '@/website-config';

const AUTHOR_NAME = 'Ltx AI Team';
const TWITTER_SITE = '@ltxai';
const DEFAULT_SECTION = 'Technology';
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;
const WORDS_PER_MINUTE = 200;

type BlogSeoParams = {
  post: BlogPost;
  slug: string;
};

export function extractFirstImageSrc(html: string): string {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ?? '';
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getWordCount(content: string): number {
  const text = stripHtml(content);
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function getReadingMinutes(content: string): number {
  return Math.max(1, Math.ceil(getWordCount(content) / WORDS_PER_MINUTE));
}

function toIsoDate(timestamp?: number): string | undefined {
  if (!timestamp) return undefined;
  return new Date(timestamp * 1000).toISOString();
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function getKeywords(post: BlogPost): string[] {
  const blogTdk = getPageTdk('/blog');
  const cmsKeywords = post.keywords
    ? post.keywords
        .split(/[,;|\n]/)
        .map((keyword) => keyword.trim())
        .filter(Boolean)
    : [];

  return unique([...cmsKeywords, ...blogTdk.keywords, SITE_NAME, 'blog', 'AI creative media']);
}

function getTitle(post: BlogPost): string {
  const rawTitle = post.seo_name || post.title;
  return rawTitle.length > 60 ? rawTitle.slice(0, 60).trim() : rawTitle;
}

function getDescription(post: BlogPost): string {
  const blogTdk = getPageTdk('/blog');
  const title = getTitle(post);
  return post.seo_desc || post.abstract || blogTdk.description || `Read about ${title} on ${SITE_NAME} blog.`;
}

function getCanonical(slug: string): string {
  return `${siteUrl}/blog/${slug}`;
}

function toAbsoluteUrl(url: string): string {
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return '';
  if (/^https?:\/\//i.test(trimmedUrl)) return trimmedUrl;
  if (trimmedUrl.startsWith('//')) return `https:${trimmedUrl}`;

  try {
    return new URL(trimmedUrl, siteUrl).toString();
  } catch {
    return trimmedUrl;
  }
}

function getImage(post: BlogPost): string {
  return toAbsoluteUrl(post.thumb || extractFirstImageSrc(post.content) || `${siteUrl}/share-img.png`);
}

export function serializeJsonLd(jsonLd: unknown): string {
  return JSON.stringify(jsonLd).replace(/</g, '\\u003c');
}

function getBreadcrumbItems(params: BlogSeoParams) {
  const { post, slug } = params;
  const title = getTitle(post);

  return [
    { name: 'Home', item: siteUrl },
    { name: 'Blog', item: `${siteUrl}/blog` },
    { name: title, item: getCanonical(slug) },
  ];
}

export function buildBlogDetailMetadata(params: BlogSeoParams): Metadata {
  const { post, slug } = params;
  const title = getTitle(post);
  const description = getDescription(post);
  const canonical = getCanonical(slug);
  const image = getImage(post);
  const keywords = getKeywords(post);
  const publishedTime = toIsoDate(post.created_time);
  const modifiedTime = toIsoDate(post.updated_time || post.created_time);

  return {
    title,
    description,
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
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonical,
      siteName: SITE_NAME,
      locale: 'en_US',
      publishedTime,
      modifiedTime,
      authors: [AUTHOR_NAME],
      section: DEFAULT_SECTION,
      tags: keywords,
      images: [{ url: image, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_SITE,
      title,
      description,
      images: [image],
    },
    keywords,
    authors: [{ name: AUTHOR_NAME }],
    category: DEFAULT_SECTION,
    alternates: {
      canonical,
    },
  };
}

export function buildBlogJsonLd(params: BlogSeoParams) {
  const { post, slug } = params;
  const title = getTitle(post);
  const description = getDescription(post);
  const canonical = getCanonical(slug);
  const image = getImage(post);
  const keywords = getKeywords(post);
  const publishedTime = toIsoDate(post.created_time);
  const modifiedTime = toIsoDate(post.updated_time || post.created_time);
  const wordCount = getWordCount(post.content);
  const readingMinutes = getReadingMinutes(post.content);
  const breadcrumbItems = getBreadcrumbItems(params);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: SITE_NAME,
        url: siteUrl,
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: SITE_NAME,
        publisher: { '@id': `${siteUrl}/#organization` },
        inLanguage: 'en-US',
      },
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        isPartOf: { '@id': `${siteUrl}/#website` },
        primaryImageOfPage: { '@id': `${canonical}#primaryimage` },
        datePublished: publishedTime,
        dateModified: modifiedTime,
        inLanguage: 'en-US',
      },
      {
        '@type': 'ImageObject',
        '@id': `${canonical}#primaryimage`,
        url: image,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
      },
      {
        '@type': 'BlogPosting',
        '@id': `${canonical}#article`,
        mainEntityOfPage: { '@id': `${canonical}#webpage` },
        headline: title,
        description,
        image: { '@id': `${canonical}#primaryimage` },
        datePublished: publishedTime,
        dateModified: modifiedTime,
        author: {
          '@type': 'Organization',
          name: AUTHOR_NAME,
          url: siteUrl,
        },
        publisher: { '@id': `${siteUrl}/#organization` },
        articleSection: DEFAULT_SECTION,
        keywords,
        wordCount,
        timeRequired: `PT${readingMinutes}M`,
        inLanguage: 'en-US',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: breadcrumbItems.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.item,
        })),
      },
    ],
  };
}
