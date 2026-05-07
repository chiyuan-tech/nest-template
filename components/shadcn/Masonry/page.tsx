 'use client'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';

const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const get = useCallback(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return defaultValue;
    }
    const index = queries.findIndex(q => window.matchMedia(q).matches);
    return values[index] ?? defaultValue;
  }, [defaultValue, queries, values]);

  const [value, setValue] = useState<number>(() => get());

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mqls = queries.map(q => window.matchMedia(q));
    const handler = () => setValue(get);
    handler();
    mqls.forEach(mql => mql.addEventListener('change', handler));
    return () => mqls.forEach(mql => mql.removeEventListener('change', handler));
  }, [get, queries]);

  return value;
};

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
};

const preloadImages = async (urls: string[]): Promise<void> => {
  await Promise.all(
    urls.map(
      src =>
        new Promise<void>(resolve => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        })
    )
  );
};

const FIRST_PAINT_PRELOAD_COUNT = 6;

interface Item {
  id: string;
  img: string;
  url: string;
  height: number;
  title?: string;
  subtitle?: string;
  desc?: string;
  tags?: string[];
}

interface GridItem extends Item {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MasonryProps {
  items: Item[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'random';
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  desc?: string;
}

const Masonry: React.FC<MasonryProps> = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  desc = ''
}) => {
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
    [5, 4, 3, 2],
    1
  );

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);
  const [activeItem, setActiveItem] = useState<GridItem | null>(null);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const modalOverlayRef = useRef<HTMLDivElement | null>(null);
  const modalPanelRef = useRef<HTMLDivElement | null>(null);
  const modalImageRef = useRef<HTMLDivElement | null>(null);
  const modalContentRef = useRef<HTMLDivElement | null>(null);

  const getInitialPosition = (item: GridItem) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;
    if (animateFrom === 'random') {
      const dirs = ['top', 'bottom', 'left', 'right'];
      direction = dirs[Math.floor(Math.random() * dirs.length)] as typeof animateFrom;
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: -200 };
      case 'bottom':
        return { x: item.x, y: window.innerHeight + 200 };
      case 'left':
        return { x: -200, y: item.y };
      case 'right':
        return { x: window.innerWidth + 200, y: item.y };
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  useEffect(() => {
    if (!containerRef.current || hasEnteredViewport) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasEnteredViewport(true);
            observer.disconnect();
          }
        });
      },
      {
        root: null,
        // Start loading much earlier so weak networks can warm up image requests.
        rootMargin: '1200px 0px',
        threshold: 0.01,
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef, hasEnteredViewport]);

  useEffect(() => {
    if (!hasEnteredViewport) return;
    let cancelled = false;
    const urls = items.map(i => i.img);
    if (urls.length === 0) {
      setImagesReady(true);
      return;
    }

    const criticalUrls = urls.slice(0, FIRST_PAINT_PRELOAD_COUNT);
    const remainingUrls = urls.slice(FIRST_PAINT_PRELOAD_COUNT);

    setImagesReady(false);

    preloadImages(criticalUrls).then(() => {
      if (!cancelled) {
        setImagesReady(true);
      }
    });

    if (remainingUrls.length > 0) {
      void preloadImages(remainingUrls);
    }

    return () => {
      cancelled = true;
    };
  }, [hasEnteredViewport, items]);

  const { grid, contentHeight } = useMemo(() => {
    if (!width || items.length === 0) {
      return { grid: [] as GridItem[], contentHeight: 0 };
    }
    const colHeights = new Array(columns).fill(0);
    const gap = 16;
    const totalGaps = (columns - 1) * gap;
    const columnWidth = (width - totalGaps) / columns;

    const gridItems = items.map(child => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + gap);
      const height = child.height / 2;
      const y = colHeights[col];

      colHeights[col] += height + gap;
      return { ...child, x, y, w: columnWidth, h: height };
    });

    const maxCol = Math.max(...colHeights);
    const heightPx = maxCol > 0 ? Math.max(0, maxCol - gap) : 0;
    return { grid: gridItems, contentHeight: heightPx };
  }, [columns, items, width]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!imagesReady || !hasEnteredViewport) return;

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };

      if (!hasMounted.current) {
        const start = getInitialPosition(item);
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: start.x,
            y: start.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: 'blur(10px)' })
          },
          {
            opacity: 1,
            ...animProps,
            ...(blurToFocus && { filter: 'blur(0px)' }),
            duration: 0.8,
            ease: 'power3.out',
            delay: index * stagger
          }
        );
      } else {
        gsap.to(selector, {
          ...animProps,
          duration,
          ease,
          overwrite: 'auto'
        });
      }
    });

    hasMounted.current = true;
  }, [grid, imagesReady, hasEnteredViewport, stagger, animateFrom, blurToFocus, duration, ease]);

  const handleMouseEnter = (id: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay') as HTMLElement;
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
    }
  };

  const handleMouseLeave = (id: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay') as HTMLElement;
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
    }
  };

  const openPreviewModal = (item: GridItem) => {
    setIsClosingModal(false);
    setActiveItem(item);
  };

  const closePreviewModal = useCallback(() => {
    if (!activeItem || isClosingModal) return;
    setIsClosingModal(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveItem(null);
        setIsClosingModal(false);
      }
    });

    tl.to(modalContentRef.current, { opacity: 0, x: 24, duration: 0.2, ease: 'power2.in' }, 0)
      .to(modalImageRef.current, { opacity: 0, x: -24, scale: 0.98, duration: 0.2, ease: 'power2.in' }, 0)
      .to(modalPanelRef.current, { opacity: 0, y: 16, scale: 0.985, duration: 0.24, ease: 'power2.in' }, 0)
      .to(modalOverlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, 0);
  }, [activeItem, isClosingModal]);

  useEffect(() => {
    if (!activeItem || isClosingModal) return;

    const tl = gsap.timeline();
    tl.fromTo(modalOverlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: 'power2.out' })
      .fromTo(
        modalPanelRef.current,
        { opacity: 0, y: 24, scale: 0.96, filter: 'blur(8px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.35, ease: 'power3.out' },
        0.04
      )
      .fromTo(
        [modalImageRef.current, modalContentRef.current],
        { opacity: 0, x: (index: number) => (index === 0 ? -20 : 20) },
        { opacity: 1, x: 0, duration: 0.32, ease: 'power2.out', stagger: 0.06 },
        0.16
      );
  }, [activeItem, isClosingModal]);

  useEffect(() => {
    if (!activeItem) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePreviewModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeItem, closePreviewModal]);

  useEffect(() => {
    if (!activeItem) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeItem]);

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full"
        style={
          hasEnteredViewport && contentHeight > 0 ? { minHeight: contentHeight } : undefined
        }
      >
        {hasEnteredViewport && grid.map(item => (
          <div
            key={item.id}
            data-key={item.id}
            className="absolute box-content cursor-pointer"
            style={{ willChange: 'transform, width, height, opacity' }}
            onClick={() => openPreviewModal(item)}
            onMouseEnter={e => handleMouseEnter(item.id, e.currentTarget)}
            onMouseLeave={e => handleMouseLeave(item.id, e.currentTarget)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openPreviewModal(item);
              }
            }}
          >
            <div
              className="relative w-full h-full bg-cover bg-center rounded-[10px] shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)] uppercase text-[10px] leading-[10px] transition-transform duration-300 hover:brightness-110"
              style={{ backgroundImage: `url(${item.img})` }}
            >
              <div className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-[10px] bg-gradient-to-t from-black/65 to-transparent p-3">
                <p className="truncate text-[11px] font-semibold tracking-wide text-white">
                  {item.title || `Visual #${item.id}`}
                </p>
              </div>
              {colorShiftOnHover && (
                <div className="color-overlay absolute inset-0 rounded-[10px] bg-gradient-to-tr from-pink-500/50 to-sky-500/50 opacity-0 pointer-events-none" />
              )}
            </div>
          </div>
        ))}
      </div>

      {activeItem && (
        <div
          ref={modalOverlayRef}
          className="fixed inset-0 z-[100] bg-slate-950/75 p-4 backdrop-blur-md md:p-8"
          onClick={closePreviewModal}
          aria-modal="true"
          role="dialog"
        >
          <div className="mx-auto flex h-full max-w-6xl items-center justify-center">
            <div
              ref={modalPanelRef}
              className="relative grid max-h-[90vh] w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 shadow-[0_30px_100px_-30px_rgba(14,165,233,0.5)] md:grid-cols-[1.1fr_0.9fr]"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={closePreviewModal}
                className="cursor-pointer absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-900/70 text-sm text-white transition-colors hover:bg-slate-800"
                aria-label="Close preview dialog"
              >
                <X className="h-4 w-4" />
              </button>

              <div ref={modalImageRef} className="relative flex min-h-[280px] items-center justify-center bg-slate-950 md:min-h-[520px]">
                <div className="relative h-[90%] w-[92%] rounded-4xl overflow-hidden">
                  <NextImage src={activeItem.img} alt={activeItem.title || 'Preview'} fill sizes="(max-width: 768px) 90vw, 55vw" className="object-contain " />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-sky-500/20" />
              </div>

              <div
                ref={modalContentRef}
                className="flex max-h-[90vh] flex-col overflow-y-auto p-6 [scrollbar-width:thin] [scrollbar-color:rgba(56,189,248,0.65)_rgba(15,23,42,0.35)] md:p-8 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-sky-400/70 [&::-webkit-scrollbar-thumb:hover]:bg-sky-300/90 [&::-webkit-scrollbar-track]:bg-slate-800/40 [&::-webkit-scrollbar]:w-2"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-sky-300/80">Masonry Visual Showcase</p>
                <h3 className="mt-3 text-2xl font-bold text-white md:text-3xl">
                  {activeItem.title || `Creative Sample ${activeItem.id}`}
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  {activeItem.subtitle || 'AI-generated artwork with dynamic composition and polished visual storytelling.'}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {(activeItem.tags && activeItem.tags.length > 0 ? activeItem.tags : ['Cinematic', 'Text-to-Image', 'High Detail']).map((tag) => (
                    <span key={tag} className="rounded-full border border-sky-300/30 bg-sky-500/10 px-3 py-1 text-xs text-sky-100">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-slate-400">Layout Height</p>
                    <p className="mt-1 text-base font-semibold text-white">{activeItem.height}px</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-slate-400">Render Style</p>
                    <p className="mt-1 text-base font-semibold text-white">Premium Detail</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Description</p>
                  <p className="mt-3 leading-7 text-slate-200">
                    {activeItem.desc ||
                      desc ||
                      'A vivid composition balancing lighting, depth, and texture. This card is optimized for hero-grade visual storytelling and campaign-ready creatives.'}
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Masonry;
