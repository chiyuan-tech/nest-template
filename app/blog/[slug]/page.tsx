'use client';

import { useParams, notFound, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Footer } from '../../../components/Footer';
import { useEffect } from 'react';
import { blogPosts } from '../data/blogPosts';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  useEffect(() => {
    document.title = `${post.title} - 4o Image Generator Blog`;
  }, [post.title]);

  function getCategoryName(category: string): string {
    switch(category) {
      case 'updates': return 'Product Updates';
      case 'tutorials': return 'Tutorials';
      case 'stories': return 'User Stories';
      default: return 'All';
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow py-12 px-6">
        <div className="container mx-auto max-w-3xl bg-white p-8 md:p-12 rounded-2xl shadow-lg">
          <Link href={`/blog`} className="text-primary hover:underline mb-8 inline-flex items-center gap-2 font-medium">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Blog
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold font-fredoka mb-4 text-foreground mt-6">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-8 border-b pb-4">
            <span>Published on {new Date(post.date).toLocaleDateString()}</span>
            <span className="hidden md:inline">&bull;</span>
            <span className="px-2 py-0.5 bg-primary/10 rounded-full text-xs text-primary font-medium">
              {getCategoryName(post.category)}
            </span>
          </div>

          <article
            className="prose prose-slate prose-lg max-w-none 
                      prose-headings:font-bold prose-headings:text-gray-800 prose-headings:font-fredoka 
                      prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-6
                      prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                      prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6 prose-p:mt-4
                      prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-gray-800 prose-strong:font-bold
                      prose-ul:my-6 prose-ul:pl-6 prose-li:mb-2 prose-li:text-gray-600
                      prose-ol:my-6 prose-ol:pl-6
                      prose-img:rounded-lg prose-img:shadow-md prose-img:my-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
} 