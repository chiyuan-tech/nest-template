'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { MouseEvent, useCallback } from 'react';

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClosed?: () => void; // 可选：第3帧做清理
};

export default function SmartLink({ href, children, className, onClosed }: Props) {
  const router = useRouter();

  const prefetch = useCallback(() => {
    try { router.prefetch?.(href); } catch {}
  }, [router, href]);

  const onPointer = useCallback(() => { prefetch(); }, [prefetch]);
  const onTouchStart = onPointer;

  const onClick = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // 检查是否是锚点链接
    const isAnchorLink = href.includes('#');
    
    // 帧 1：先关闭抽屉，给用户反馈
    requestAnimationFrame(() => {
      // 触发外部关闭（父组件里 setIsMobileMenuOpen(false)）
      const ev = new CustomEvent('drawer-close');
      window.dispatchEvent(ev);

      // 帧 2：再导航或滚动
      requestAnimationFrame(() => {
        if (isAnchorLink) {
          // 锚点链接：使用原生滚动
          const [path, hash] = href.split('#');
          if (hash) {
            const element = document.getElementById(hash);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              // 更新 URL 但不触发路由跳转
              window.history.pushState(null, '', href);
            } else if (path === '/' || path === '') {
              // 如果元素不存在，尝试路由跳转
              router.push(href);
            }
          }
        } else {
          // 普通链接：使用路由跳转
          router.push(href);
        }

        // 帧 3：可选的收尾
        if (onClosed) {
          requestAnimationFrame(() => onClosed());
        }
      });
    });
  }, [href, router, onClosed]);

  return (
    <Link
      href={href}
      prefetch={false}
      onPointerDown={onPointer}
      onTouchStart={onTouchStart}
      onClick={onClick}
      className={className}
    >
      {children}
    </Link>
  );
}
