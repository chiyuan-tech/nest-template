'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { blogPosts } from './data/posts';
import Link from 'next/link';

type BlogCategory = 'all' | 'medical' | 'tech' | 'legal' | 'innovation';

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>('all');
  
  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'medical', name: 'Medical Practice' },
    { id: 'tech', name: 'Technology' },
    { id: 'legal', name: 'Legal' },
    { id: 'innovation', name: 'Innovation' },
  ];

  const filteredPosts = activeCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => {
        switch(activeCategory) {
          case 'medical':
            return post.title.toLowerCase().includes('medical');
          case 'tech':
            return post.title.toLowerCase().includes('chatgpt') || post.title.toLowerCase().includes('digital');
          case 'legal':
            return post.title.toLowerCase().includes('legal');
          case 'innovation':
            return post.title.toLowerCase().includes('innovation') || post.title.toLowerCase().includes('digital');
          default:
            return true;
        }
      });

  return (
    <div className="container mx-auto px-6 py-12 mt-16">
      <h1 className="text-4xl font-bold mb-8 text-center font-fredoka text-foreground">
        Professional Blog
      </h1>
      
      {/* Categories Filter */}
      <div className="flex flex-wrap justify-center mb-12 gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id as BlogCategory)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
              activeCategory === category.id 
                ? "bg-primary text-white" 
                : "bg-secondary text-foreground hover:bg-secondary/80"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map(post => (
          <Link href={`/blog/${post.slug}`} key={post.id}>
            <article className="bg-white rounded-xl shadow-card p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-2 text-foreground line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.description}
                  </p>
                </div>
                
                <div className="mt-auto">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
} 