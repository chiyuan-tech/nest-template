'use client';

import { useTranslations } from 'next-intl';
// import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { useState } from 'react';
// Remove Image import as it's no longer used in the list
// import Image from 'next/image'; 
import Link from 'next/link';
// Import the correct type and data
import { blogPostMetadata, BlogPostMeta } from '../../lib/blogData';

// Removed the custom Post interface, use BlogPostMeta
// interface Post { ... }

export default function BlogPage() {
  const t = useTranslations('blog');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Use the imported type BlogPostMeta
  const allPostsMeta: BlogPostMeta[] = blogPostMetadata;

  // Filter posts based on the actual 'category' property
  const filteredPosts = activeCategory === 'all'
    ? allPostsMeta
    : allPostsMeta.filter(post => post.category === activeCategory);

  // Get unique categories from the actual data
  const categories = ['all', ...new Set(allPostsMeta.map(post => post.category))];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* <Navbar /> */}
      <main className="flex-grow py-12 px-6">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold font-fredoka text-center mb-12">
            {t('title')}
          </h1>
          
          <div className="flex justify-center space-x-4 mb-12">
            {categories.map(category => (
              <button 
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
              >
                {/* Use correct nested key */}
                {t(`categories.${category}`)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar - Categories (Left) */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-custom mb-6 sticky top-24">
                {/* Use the new title key */}
                <h3 className="text-lg font-bold mb-4">{t('categoriesTitle')}</h3>
                <ul className="space-y-2">
                  {/* Map over categories again for the sidebar list */}
                  {categories.map(category => (
                    <li key={category}>
                      <button
                        onClick={() => setActiveCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg ${
                          activeCategory === category ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
                        }`}
                      >
                        {/* Use correct nested key */}
                        {t(`categories.${category}`)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Blog Post List (Right) */}
            <div className="md:col-span-3">
              <div className="space-y-8">
                {/* 使用 filteredPostsMeta 进行迭代 */} 
                {filteredPosts.map((post: BlogPostMeta) => (
                  // 更新 Link href 指向 /blog/[slug]
                  <Link 
                    href={`/blog/${post.slug}`} 
                    key={post.id}
                    // 修改卡片样式，移除图片相关
                    className="block bg-white rounded-2xl p-6 shadow-custom hover:shadow-lg transition-shadow"
                  >
                    {/* 内容区调整 */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-muted-foreground">{post.date}</span>
                        <span className="px-2 py-1 bg-primary/10 rounded-full text-xs text-primary font-medium">
                          {/* Use correct nested key */}
                          {t(`categories.${post.category}`)}
                        </span>
                      </div>
                      {/* 使用翻译函数获取 title */}
                      <h3 className="text-xl font-bold mb-2 text-foreground hover:text-primary transition-colors">{t(`posts.${post.slug}.title`)}</h3>
                      {/* 使用翻译函数获取 excerpt */}
                      <p className="text-muted-foreground line-clamp-3">{t(`posts.${post.slug}.excerpt`)}</p> 
                    </div>
                  </Link>
                ))} 
                {filteredPosts.length === 0 && (
                  <p className="text-muted-foreground text-center">{t('noPostsInCategory')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 