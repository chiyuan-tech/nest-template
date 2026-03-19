import { serverCmsApi, BlogPost } from "@/lib/server-api";
import Link from "next/link";
import { Metadata } from "next";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import { SITE_NAME, websiteConfig, getPageTdk } from '@/website-config';

const tdk = getPageTdk('/blog');

// 页面metadata配置
export const metadata: Metadata = {
  title: tdk.title,
  description: tdk.description,
  keywords: tdk.keywords,
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
    title: tdk.title,
    description: tdk.description,
    url: `${websiteConfig.canonical.url}/blog`,
    siteName: SITE_NAME,
    type: "website",
    locale: 'en_US',
    images: [
      {
        url: `${websiteConfig.canonical.url}/share-img.png`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} Blog`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: '@ltxai',
    title: tdk.title,
    description: tdk.description,
    images: [`${websiteConfig.canonical.url}/share-img.png`],
  },
  alternates: {
    canonical: `${websiteConfig.canonical.url}/blog`,
  },
};

// App Router中的数据获取函数
async function getBlogPosts(classId: number = 0): Promise<BlogPost[]> {
  try {
    const blogResponse = await serverCmsApi.getBlogList(1, 20, classId);
    console.log(
      "App Router: Successfully fetched blog posts:",
      blogResponse.list.length
    );
    return blogResponse.list;
  } catch (error) {
    console.error("App Router: Failed to fetch blog posts:", error);
    return [];
  }
}

// 格式化时间戳为可读日期
function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50)
    .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
}

// 预估阅读时间
function estimateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, ""); // 移除HTML标签
  const wordCount = textContent.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTime} min`;
}

export default async function Blog() {
  // 在App Router中直接获取数据
  const blogPosts = await getBlogPosts();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section - match home section style */}
      <section className="px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-5">
            <span className="text-foreground/30">//</span> Blog
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-6 leading-tight">
            Ltx 2.3 Blog
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover insights, tutorials, and updates about AI creative media tools
            and creative technology
          </p>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="px-6 sm:px-10 lg:px-16 pb-20 flex-grow">
        {blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {blogPosts.map((post) => (
              <Link href={`/blog/${generateSlug(post.title, post.url)}`} key={post.id}>
                <article className="group rounded-2xl overflow-hidden border border-foreground/8 bg-background hover:bg-foreground/5 transition-all duration-300 hover:border-foreground/20">
                  {/* Thumbnail Image - 16:9 */}
                  {post.thumb ? (
                    <div className="relative w-full aspect-video overflow-hidden bg-muted/30">
                      <Image
                        src={post.thumb}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="relative w-full aspect-video bg-muted/30 flex items-center justify-center">
                      <div className="w-16 h-16 bg-foreground/10 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-foreground/30"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  {/* Article Header */}
                  <div className="p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground line-clamp-2 group-hover:text-foreground/90 transition-colors duration-200">
                      {post.title}
                    </h2>

                    {/* Article Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-foreground/8">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-foreground/10 rounded-full flex items-center justify-center">
                          <span className="text-foreground/70 text-xs sm:text-sm font-bold">
                            V
                          </span>
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-medium text-foreground">
                            Ltx AI Team
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(post.created_time)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center text-foreground/70 group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200">
                        <span className="text-xs sm:text-sm font-medium">Read</span>
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 sm:py-20 max-w-6xl mx-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-foreground/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
              No Blog Posts Yet
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-md mx-auto px-4">
              We're working on creating amazing content for you. Check back
              soon!
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// App Router的ISR配置 - 禁用缓存，每次都获取最新数据
export const revalidate = 0;
