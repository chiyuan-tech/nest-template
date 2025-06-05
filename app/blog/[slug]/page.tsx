import { serverCmsApi, type BlogPost } from '../../../lib/server-api';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

// 生成文章slug（与blog列表页面保持一致）
function generateSlug(title: string): string {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50)
    .replace(/^-+|-+$/g, '');
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
  const textContent = content.replace(/<[^>]*>/g, '');
  const wordCount = textContent.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTime} min`;
}

// 获取博客文章数据
async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const blogResponse = await serverCmsApi.getBlogList(1, 100, 0); // 获取更多文章以确保能找到目标文章
    return blogResponse.list;
  } catch (error) {
    console.error('Blog Detail: Failed to fetch blog posts:', error);
    return [];
  }
}



interface BlogDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPost({ params }: BlogDetailProps) {
  const { slug } = await params;
  
  // 获取博客文章数据
  const blogPosts = await getBlogPosts();
  
  // 根据slug查找对应的文章
  const post = blogPosts.find(p => generateSlug(p.title) === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-6 py-12 mt-16 max-w-4xl">
      <a
        href="/blog"
        className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="m12 19-7-7 7-7"/>
          <path d="M19 12H5"/>
        </svg>
        Back to Blog
      </a>
      
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-foreground leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-muted-foreground mb-6">
          <span>QuickMedCert Team</span>
          <span>•</span>
          <span>{formatDate(post.created_time)}</span>
          <span>•</span>
          <span>{estimateReadingTime(post.content)}</span>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {post.abstract}
        </p>
      </header>

      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground leading-tight" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-4 text-foreground leading-tight" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-4 mb-3 text-foreground leading-tight" {...props} />,
            p: ({node, ...props}) => <p className="text-muted-foreground mb-4 leading-relaxed" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 leading-relaxed" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 leading-relaxed" {...props} />,
            li: ({node, ...props}) => <li className="text-muted-foreground mb-2 leading-relaxed" {...props} />,
            a: ({node, ...props}) => <a className="text-primary hover:underline" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary/20 pl-4 italic text-muted-foreground mb-4 leading-relaxed" {...props} />,
            code: ({node, ...props}) => <code className="bg-secondary px-2 py-1 rounded text-sm" {...props} />,
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
} 