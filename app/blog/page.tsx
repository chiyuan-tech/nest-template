'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { blogPosts } from './data/blogPosts';

type BlogCategory = 'all' | 'updates' | 'tutorials' | 'stories';

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>('all');
  
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'updates', name: 'Product Updates' },
    { id: 'tutorials', name: 'Tutorials' },
    { id: 'stories', name: 'User Stories' },
  ];
  
  const filteredPosts = blogPosts.filter(post => 
    activeCategory === 'all' || post.category === activeCategory
  );
  
  // Sort posts by date (newest first)
  const sortedPosts = [...filteredPosts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center font-fredoka text-foreground">
        Blog
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
        {sortedPosts.length > 0 ? (
          sortedPosts.map(post => (
            <div key={post.slug} className="flex flex-col bg-white rounded-xl shadow-md border border-muted overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="p-6 flex-grow">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-accent text-accent-foreground">
                    {getCategoryName(post.category)}
                  </span>
                  <span className="text-muted-foreground text-sm ml-2">
                    Published on {new Date(post.date).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-3 text-foreground">
                  {post.title}
                </h2>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
              <div className="px-6 pb-6 mt-auto">
                <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors duration-200">
                  Read More
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No posts in this category yet
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function: Get category name in English
function getCategoryName(category: string): string {
  switch(category) {
    case 'updates': return 'Product Updates';
    case 'tutorials': return 'Tutorials';
    case 'stories': return 'User Stories';
    default: return 'All';
  }
} 