'use client';

import { useParams } from 'next/navigation';
import { blogPosts } from '../data/posts';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-6 py-12 mt-16 max-w-4xl">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-muted-foreground mb-6">
          <span>{post.author}</span>
          <span>•</span>
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readingTime}</span>
        </div>
        <p className="text-lg text-muted-foreground">
          {post.description}
        </p>
      </header>

      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-4 text-foreground" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-4 mb-3 text-foreground" {...props} />,
            p: ({node, ...props}) => <p className="text-muted-foreground mb-4" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
            li: ({node, ...props}) => <li className="text-muted-foreground mb-2" {...props} />,
            a: ({node, ...props}) => <a className="text-primary hover:underline" {...props} />,
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
} 