'use client';

import React, { useEffect, useRef, useState } from 'react';

export type FadeInProps = {
  /** 子元素 */
  children: React.ReactNode;
  /** 动画持续时间（毫秒） */
  duration?: number;
  /** 动画延迟（毫秒） */
  delay?: number;
  /** 缓动函数 */
  easing?: string;
  /** 动画强度（0-1） */
  intensity?: number;
  /** 触发方式：'mount' | 'scroll' */
  trigger?: 'mount' | 'scroll';
  /** 滚动触发阈值（0-1） */
  threshold?: number;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
};

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  duration = 500,
  delay = 0,
  easing = 'ease-out',
  intensity = 1,
  trigger = 'mount',
  threshold = 0.1,
  className = '',
  style = {},
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 检查是否支持动画
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = mediaQuery.matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    if (trigger === 'mount') {
      const timeoutId = setTimeout(() => {
        setIsVisible(true);
      }, delay);

      return () => clearTimeout(timeoutId);
    }

    if (trigger === 'scroll' && ref.current) {
      const currentRef = ref.current;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        },
        { threshold }
      );

      observer.observe(currentRef);

      return () => {
        observer.unobserve(currentRef);
      };
    }
  }, [delay, threshold, trigger]);

  const animationStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : `translateY(${intensity * 20}px)`,
    transition: `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`,
    ...style,
  };

  return (
    <div ref={ref} className={className} style={animationStyle}>
      {children}
    </div>
  );
};

// 最小示例
export const FadeInExample: React.FC = () => {
  return (
    <div className="space-y-8 p-4">
      <h2 className="text-2xl font-bold">FadeIn 组件示例</h2>
      
      {/* 基础用法 */}
      <section>
        <h3 className="text-xl font-semibold mb-4">基础用法</h3>
        <FadeIn>
          <div className="p-6 bg-blue-100 rounded-lg">
            <p>这是一个基础的淡入效果</p>
          </div>
        </FadeIn>
      </section>
      
      {/* 自定义参数 */}
      <section>
        <h3 className="text-xl font-semibold mb-4">自定义参数</h3>
        <FadeIn
          duration={1000}
          delay={200}
          intensity={0.5}
          easing="cubic-bezier(0.16, 1, 0.3, 1)"
        >
          <div className="p-6 bg-green-100 rounded-lg">
            <p>这是一个自定义参数的淡入效果</p>
          </div>
        </FadeIn>
      </section>
      
      {/* 滚动触发 */}
      <section>
        <h3 className="text-xl font-semibold mb-4">滚动触发</h3>
        <div className="h-64 flex items-center justify-center">
          <p>向下滚动查看滚动触发的动画</p>
        </div>
        <FadeIn trigger="scroll" threshold={0.5}>
          <div className="p-6 bg-purple-100 rounded-lg">
            <p>这是一个滚动触发的淡入效果</p>
          </div>
        </FadeIn>
      </section>
    </div>
  );
};

// Props 简表
/**
 * | Prop | 类型 | 默认值 | 描述 |
 * |------|------|--------|------|
 * | children | React.ReactNode | 必填 | 子元素 |
 * | duration | number | 500 | 动画持续时间（毫秒） |
 * | delay | number | 0 | 动画延迟（毫秒） |
 * | easing | string | 'ease-out' | 缓动函数 |
 * | intensity | number | 1 | 动画强度（0-1） |
 * | trigger | 'mount' \| 'scroll' | 'mount' | 触发方式 |
 * | threshold | number | 0.1 | 滚动触发阈值（0-1） |
 * | className | string | '' | 自定义类名 |
 * | style | React.CSSProperties | {} | 自定义样式 |
 */