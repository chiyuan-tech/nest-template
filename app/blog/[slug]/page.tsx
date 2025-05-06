'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useParams, notFound, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Footer } from '../../../components/Footer';
import { useEffect } from 'react';
import { blogPostMetadata } from '../../../lib/blogData';

export default function BlogPostPage() {
  const t = useTranslations('blog');
  const params = useParams();
  const pathname = usePathname();
  const locale = useLocale();
  const slug = params.slug as string;

  const postMeta = blogPostMetadata.find(p => p.slug === slug);

  if (!postMeta) {
    notFound();
  }

  const postTranslation = t.raw(`posts.${slug}`) as { title: string; excerpt: string; content: string; } | null | undefined;

  if (!postTranslation || typeof postTranslation.content !== 'string') {
    console.error(`Missing or invalid translation for posts.${slug}`);
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-grow py-12 px-6">
          <div className="container mx-auto max-w-2xl text-center">
            <p>Error loading post content or translation missing.</p>
            <Link href={`/blog`} className="text-primary hover:underline mt-4 inline-block">
              &larr; {t('backToBlog')}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const postTitle = postTranslation.title;
  const postContent = postTranslation.content;

  const categoryText = t(`categories.${postMeta.category}`);

  useEffect(() => {
    document.title = `${postTitle} - PolaToons Blog`;
  }, [postTitle]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow py-12 px-6">
        <div className="container mx-auto max-w-2xl bg-white p-8 md:p-12 rounded-2xl shadow-custom">
          <Link href={`/blog`} className="text-primary hover:underline mb-8 inline-block">
            &larr; {t('backToBlog')}
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold font-fredoka mb-4 text-foreground">
            {postTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-8 border-b pb-4">
            <span>{t('publishedOn')} {postMeta.date}</span>
            <span className="hidden md:inline">&bull;</span>
            <span className="px-2 py-0.5 bg-primary/10 rounded-full text-xs text-primary font-medium">
              {categoryText}
            </span>
          </div>

          <article
            className="prose prose-slate prose-lg prose-headings:mt-8 prose-headings:mb-4 prose-p:leading-relaxed prose-p:mb-5 prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:font-semibold"
            dangerouslySetInnerHTML={{ __html: postContent }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
} 