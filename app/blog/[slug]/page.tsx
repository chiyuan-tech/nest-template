import { serverCmsApi, type BlogPost } from '@/lib/server-api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { Metadata } from 'next';
import styles from './blog-post.module.css';
import BlogViewTracker from './BlogViewTracker';
// import LtxNavLinks from '@/components/ltx/nav/LtxNavLinks';
// import LtxBreadcrumb from '@/components/ltx/nav/LtxBreadcrumb';
import BlogTableOfContents from './BlogTableOfContents';
import { SITE_NAME, SITE_DESCRIPTION, websiteConfig, getPageTdk } from '@/website-config';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 生成文章slug
function generateSlug(title: string, url?: string): string {
  // 如果 url 字段存在且包含连字符，直接使用
  if (url && url.includes('-')) {
    return url.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
  }
  
  // 否则使用原来的生成方式
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50)
    .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
}

// 截取标题用于面包屑导航
function truncateTitle(title: string, maxLength: number = 50): string {
  if (title.length <= maxLength) return title;
  return title.slice(0, maxLength) + '...';
}

// 格式化时间戳为可读日期
function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// 预估阅读时间
function estimateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, ''); // 移除HTML标签
  const wordCount = textContent.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTime} min`;
}

// 提取 h2 标题并生成锚点
interface Heading {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(html: string): Heading[] {
  const headings: Heading[] = [];
  const regex = /<h2[^>]*>(.*?)<\/h2>/gi;
  let match;
  let index = 0;

  while ((match = regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]*>/g, '').trim(); // 移除内部HTML标签
    
    if (text) {
      // 生成唯一的 ID
      const baseId = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 50);
      
      const id = `heading-${index}-${baseId}`;
      headings.push({ id, text, level: 2 });
      index++;
    }
  }

  return headings;
}

// 为 HTML 内容中的 h2 标签添加 id 属性
function addHeadingIds(html: string, headings: Heading[]): string {
  let processedHtml = html;
  let processedCount = 0;

  headings.forEach((heading) => {
    // 构建正则表达式来匹配 h2 标签
    const regex = /(<h2)([^>]*>)(.*?)(<\/h2>)/gi;
    
    processedHtml = processedHtml.replace(regex, (match, tagStart, attributes, content, closeTag) => {
      // 检查是否已经包含 id
      if (attributes.includes('id=')) {
        return match;
      }
      
      // 提取标题文本（移除HTML标签）
      const textContent = content.replace(/<[^>]*>/g, '').trim();
      
      // 只有当文本内容匹配时才添加 id
      if (textContent === heading.text) {
        processedCount++;
        // 在属性部分添加 id
        const newAttributes = attributes.replace(/>$/, ` id="${heading.id}">`);
        return tagStart + newAttributes + content + closeTag;
      }
      
      return match;
    });
  });

  return processedHtml;
}

// 获取单篇博客文章
async function getBlogPost(slug: string, classId: number = 0): Promise<{ post: BlogPost; originalUrl: string } | null> {
  try {
    // 通过列表找到对应的文章
    const blogResponse = await serverCmsApi.getBlogList(1, 100, classId);

    // 在 find 之前，先找到文章并保存原始 url
    let foundPost: BlogPost | undefined;
    let originalUrl = '';
    
    for (const p of blogResponse.list) {
      // 在调用 generateSlug 之前保存原始 url
      const currentUrl = p.url;
      if (generateSlug(p.title, currentUrl) === slug) {
        foundPost = p;
        originalUrl = currentUrl; // 保存原始 url
        break;
      }
    }

    if (!foundPost) {
      console.log('App Router: Blog post not found in list');
      return null;
    }

    console.log('App Router: Successfully fetched blog post:', foundPost.title);
    return { post: foundPost, originalUrl };
  } catch (error) {
    console.error('App Router: Failed to fetch blog post:', error);
    return null;
  }
}

// 生成动态metadata – description & keywords from @/website-config (getPageTdk('/blog'))
const blogTdk = getPageTdk('/blog');

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getBlogPost(slug);
  const description = blogTdk.description;
  const baseKeywords = blogTdk.keywords;

  if (!result) {
    return {
      title: 'Blog Post Not Found',
      description,
      keywords: baseKeywords,
    };
  }

  const { post } = result;
  const canonicalBase = websiteConfig.canonical.url;
  const rawTitle = post.seo_name || post.title;
  const safeTitle = rawTitle.length > 60 ? rawTitle.slice(0, 60).trim() : rawTitle;
  const keywords = baseKeywords.length + safeTitle.length < 100 ? [...baseKeywords, safeTitle] : baseKeywords;

  return {
    title: safeTitle,
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
      title: safeTitle,
      description,
      type: 'article',
      url: `${canonicalBase}/blog/${slug}`,
      siteName: SITE_NAME,
      locale: 'en_US',
      publishedTime: new Date(post.created_time * 1000).toISOString(),
      authors: ['Ltx AI Team'],
      images: [
        {
          url: post.thumb || `${canonicalBase}/share-img.png`,
          width: 1200,
          height: 630,
          alt: post.seo_name || post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@ltxai',
      title: safeTitle,
      description,
      images: [post.thumb || `${canonicalBase}/share-img.png`],
    },
    keywords,
    authors: [{ name: 'Ltx AI Team' }],
    category: 'Technology',
    alternates: {
      canonical: `${canonicalBase}/blog/${slug}`,
    },
  };
}

export default async function BlogPost({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const result = await getBlogPost(slug);

  if (!result) {
    notFound();
  }

  const { post, originalUrl } = result;

  // 提取标题并处理内容
  const headings = extractHeadings(post.content);
  const processedContent = addHeadingIds(post.content, headings);

  return (
    <div className="min-h-screen">
      <BlogViewTracker url={originalUrl} />
      
      {/* Hero Section - match home section style */}
      <section className="px-6 sm:px-10 lg:px-16 pt-24 pb-8 lg:pb-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-5">
            <span className="text-foreground/30">//</span> Blog
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-foreground mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base text-muted-foreground mb-6 lg:mb-8">
            <span>Ltx AI Team</span>
            <span className="hidden sm:inline text-foreground/30">•</span>
            <span>{formatDate(post.created_time)}</span>
            <span className="hidden sm:inline text-foreground/30">•</span>
            <span>{estimateReadingTime(post.content)}</span>
          </div>
          
          {headings.length > 0 && (
            <div className="lg:hidden mb-6">
              <BlogTableOfContents headings={headings} isMobile={true} />
            </div>
          )}
        </div>
      </section>
      
      {/* Main content - two-column layout */}
      <div className="px-6 sm:px-10 lg:px-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          {headings.length > 0 && (
            <aside className="lg:col-span-3 hidden lg:block">
              <BlogTableOfContents headings={headings} isMobile={false} />
            </aside>
          )}
          
          <article className={headings.length > 0 ? 'lg:col-span-9' : 'lg:col-span-12'}>
            <div className="max-w-none">
              {/* 使用富文本渲染 - CSS Module 按需加载 */}
              <div 
                className={styles.richTextContent}
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </div>
          </article>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// 生成静态参数
export async function generateStaticParams() {
  try {
    const blogResponse = await serverCmsApi.getBlogList(1, 100, 9);

    return blogResponse.list.map((post) => ({
      slug: generateSlug(post.title, post.url),
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

// App Router的ISR配置 - 禁用缓存，每次都获取最新数据
export const revalidate = 0; 