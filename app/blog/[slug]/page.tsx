import { Footer } from '@/components/Footer';
import BlogShareRail from '@/components/blog/BlogShareRail';
import { buildBlogDetailMetadata, buildBlogJsonLd, serializeJsonLd } from '@/lib/blog/blogSeo';
import {
  addTableCellLabels,
  estimateReadingTime,
  formatDate,
  generateSlug,
  getBlogPostBySlug,
} from '@/lib/blog/blogUtils';
import { serverCmsApi } from '@/lib/server-api';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogViewTracker from './BlogViewTracker';
import BlogTableOfContents from './BlogTableOfContents';
import styles from './blog-post.module.css';
import { siteUrl } from '@/website-config';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(html: string): Heading[] {
  const headings: Heading[] = [];
  const regex = /<h2[^>]*>(.*?)<\/h2>/gi;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]*>/g, '').trim();
    if (!text) continue;

    const baseId = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50);

    headings.push({ id: `heading-${index}-${baseId}`, text, level: 2 });
    index++;
  }

  return headings;
}

function addHeadingIds(html: string, headings: Heading[]): string {
  let processedHtml = html;

  headings.forEach((heading) => {
    const regex = /(<h2)([^>]*>)(.*?)(<\/h2>)/gi;
    processedHtml = processedHtml.replace(regex, (match, tagStart, attributes, content, closeTag) => {
      if (attributes.includes('id=')) return match;

      const textContent = content.replace(/<[^>]*>/g, '').trim();
      if (textContent !== heading.text) return match;

      const newAttributes = attributes.replace(/>$/, ` id="${heading.id}">`);
      return tagStart + newAttributes + content + closeTag;
    });
  });

  return processedHtml;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getBlogPostBySlug(slug);

  if (!result) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return buildBlogDetailMetadata({ post: result.post, slug });
}

export default async function BlogPost({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const result = await getBlogPostBySlug(slug);

  if (!result) {
    notFound();
  }

  const { post, originalUrl } = result;
  const headings = extractHeadings(post.content);
  const processedContent = addTableCellLabels(addHeadingIds(post.content, headings));
  const shareUrl = `${siteUrl}/blog/${generateSlug(post.title, originalUrl || post.url)}`;
  const jsonLd = buildBlogJsonLd({ post, slug });

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <BlogViewTracker url={originalUrl} />

      <section className="px-6 sm:px-10 lg:px-16 pt-24 pb-8 lg:pb-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-5">
            <span className="text-foreground/30">//</span> Blog
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-foreground mb-6 leading-tight">
            {post.title}
          </h1>
          {post.abstract && (
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mb-6 leading-relaxed">
              {post.abstract}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base text-muted-foreground mb-6 lg:mb-8">
            <span>Ltx AI Team</span>
            <span className="hidden sm:inline text-foreground/30">•</span>
            <span>{formatDate(post.created_time)}</span>
            <span className="hidden sm:inline text-foreground/30">•</span>
            <span>{estimateReadingTime(post.content)} read</span>
          </div>

          {headings.length > 0 && (
            <div className="lg:hidden mb-6">
              <BlogTableOfContents headings={headings} isMobile={true} />
            </div>
          )}
        </div>
      </section>

      <div className="px-6 sm:px-10 lg:px-16 pb-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_minmax(0,1fr)_80px] max-w-6xl mx-auto">
          {headings.length > 0 && (
            <aside className="hidden self-stretch lg:block">
              <BlogTableOfContents headings={headings} isMobile={false} />
            </aside>
          )}

          <article className={headings.length > 0 ? '' : 'lg:col-start-2'}>
            <div className="max-w-none">
              <div
                className={styles.richTextContent}
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </div>
          </article>

          <aside className="hidden self-stretch lg:block">
            <BlogShareRail title={post.title} url={shareUrl} />
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const blogResponse = await serverCmsApi.getBlogList(1, 100, 0);

    return blogResponse.list.map((post) => ({
      slug: generateSlug(post.title, post.url),
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

export const revalidate = 0;
