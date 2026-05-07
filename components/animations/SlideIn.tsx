'use client';

import React, { useEffect, useRef, useState } from 'react';

export type SlideDirection = 'left' | 'right' | 'up' | 'down';

export type SlideInProps = {
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
  /** 滑动方向 */
  direction?: SlideDirection;
  /** 触发方式：'mount' | 'scroll' */
  trigger?: 'mount' | 'scroll';
  /** 滚动触发阈值（0-1） */
  threshold?: number;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
};

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  duration = 500,
  delay = 0,
  easing = 'ease-out',
  intensity = 1,
  direction = 'left',
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

  // 计算初始位置
  const getInitialTransform = () => {
    const distance = 50 * intensity;
    switch (direction) {
      case 'left':
        return `translateX(-${distance}px)`;
      case 'right':
        return `translateX(${distance}px)`;
      case 'up':
        return `translateY(${distance}px)`;
      case 'down':
        return `translateY(-${distance}px)`;
      default:
        return 'translateX(-50px)';
    }
  };

  const animationStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate(0, 0)' : getInitialTransform(),
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
export const SlideInExample: React.FC = () => {
  return (
    <div className="space-y-8 p-4">
      <h2 className="text-2xl font-bold">SlideIn 组件示例</h2>
      
      {/* 从左侧滑入 */}
      <section>
        <h3 className="text-xl font-semibold mb-4">从左侧滑入</h3>
        <SlideIn direction="left">
          <div className="p-6 bg-blue-100 rounded-lg">
            <p>这是一个从左侧滑入的效果</p>
          </div>
        </SlideIn>
      </section>
      
      {/* 从右侧滑入 */}
      <section>
        <h3 className="text-xl font-semibold mb-4">从右侧滑入</h3>
        <SlideIn direction="right" delay={200}>
          <div className="p-6 bg-green-100 rounded-lg">
            <p>这是一个从右侧滑入的效果</p>
          </div>
        </SlideIn>
      </section>
      
      {/* 从上方滑入 */}
      <section>
        <h3 className="text-xl font-semibold mb-4">从上方滑入</h3>
        <SlideIn direction="up" delay={400}>
          <div className="p-6 bg-purple-100 rounded-lg">
            <p>这是一个从上方滑入的效果</p>
          </div>
        </SlideIn>
      </section>
      
      {/* 从下方滑入 */}
      <section>
        <h3 className="text-xl font-semibold mb-4">从下方滑入</h3>
        <SlideIn direction="down" delay={600}>
          <div className="p-6 bg-yellow-100 rounded-lg">
            <p>这是一个从下方滑入的效果</p>
          </div>
        </SlideIn>
      </section>
      
      {/* 滚动触发 */}
      <section>
        <h3 className="text-xl font-semibold mb-4">滚动触发</h3>
        <div className="h-64 flex items-center justify-center">
          <p>向下滚动查看滚动触发的动画</p>
        </div>
        <SlideIn direction="left" trigger="scroll" threshold={0.5}>
          <div className="p-6 bg-red-100 rounded-lg">
            <p>这是一个滚动触发的滑入效果</p>
          </div>
        </SlideIn>
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
 * | direction | 'left' \| 'right' \| 'up' \| 'down' | 'left' | 滑动方向 |
 * | trigger | 'mount' \| 'scroll' | 'mount' | 触发方式 |
 * | threshold | number | 0.1 | 滚动触发阈值（0-1） |
 * | className | string | '' | 自定义类名 |
 * | style | React.CSSProperties | {} | 自定义样式 |
 */