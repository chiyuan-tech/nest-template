'use client';

import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface BlogTableOfContentsProps {
  headings: Heading[];
  isMobile?: boolean;
}

export default function BlogTableOfContents({ headings, isMobile = false }: BlogTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const scrollingRef = useRef<{ targetId: string | null; timeoutId: NodeJS.Timeout | null }>({
    targetId: null,
    timeoutId: null
  });

  useEffect(() => {
    if (headings.length === 0) return;

    const updateActiveId = () => {
      // 如果正在滚动（点击触发的），不更新状态，避免闪烁
      if (scrollingRef.current.targetId) return;

      const scrollPosition = window.scrollY + 150; // 考虑导航栏高度和偏移
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isNearBottom = window.scrollY + windowHeight >= documentHeight - 100; // 距离底部100px内

      // 如果接近底部，激活最后一个标题
      if (isNearBottom && headings.length > 0) {
        const lastHeading = headings[headings.length - 1];
        if (activeId !== lastHeading.id) {
          setActiveId(lastHeading.id);
        }
        return;
      }

      // 找到当前滚动位置对应的标题（从下往上找第一个已经滚过的标题）
      let currentActiveId = '';
      
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        const element = document.getElementById(heading.id);
        if (element) {
          const elementTop = element.offsetTop;
          if (scrollPosition >= elementTop - 50) { // 提前50px激活
            currentActiveId = heading.id;
            break;
          }
        }
      }

      // 如果滚动到顶部，激活第一个标题
      if (scrollPosition < 150 && headings.length > 0) {
        currentActiveId = headings[0].id;
      }

      if (currentActiveId && currentActiveId !== activeId) {
        setActiveId(currentActiveId);
      }
    };

    // 初始更新
    updateActiveId();

    // 监听滚动事件（使用节流优化性能）
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveId();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // 清理滚动锁定
      if (scrollingRef.current.timeoutId) {
        clearTimeout(scrollingRef.current.timeoutId);
      }
    };
  }, [headings, activeId]);

  const handleClick = (id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // 距离顶部的偏移量
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      // 清除之前的滚动锁定
      if (scrollingRef.current.timeoutId) {
        clearTimeout(scrollingRef.current.timeoutId);
      }

      // 立即设置激活状态并标记为正在滚动
      setActiveId(id);
      scrollingRef.current.targetId = id;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // 更新 URL hash（不触发滚动）
      window.history.pushState(null, '', `#${id}`);

      // 滚动完成后，延迟恢复自动更新（增加延迟时间，确保滚动完全结束）
      scrollingRef.current.timeoutId = setTimeout(() => {
        scrollingRef.current.targetId = null;
        scrollingRef.current.timeoutId = null;
      }, 1500); // 增加延迟时间，确保滚动动画完全结束
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={cn(isMobile ? '' : 'sticky top-24 h-fit')}>
      <div className="border border-foreground/8 rounded-2xl p-5 lg:p-6 bg-background">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-foreground/8">
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            <span className="text-foreground/30">//</span> Contents
          </p>
        </div>
        <nav className={cn('space-y-0.5', isMobile ? 'max-h-48 overflow-y-auto' : '')}>
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={(e) => handleClick(heading.id, e)}
              className={cn(
                'group relative block text-xs lg:text-sm py-2.5 px-3 rounded-lg transition-all duration-200',
                !isMobile && 'hover:bg-foreground/5 hover:translate-x-1',
                activeId === heading.id
                  ? 'text-foreground bg-foreground/10 font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {activeId === heading.id && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-foreground/40 rounded-r-full" />
              )}
              <span className="relative z-10">{heading.text}</span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

