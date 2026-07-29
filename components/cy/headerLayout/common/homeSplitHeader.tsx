 'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type HomeSplitHeaderProps = {
  title: ReactNode;
  description: ReactNode;
  /** Small uppercase label above the title */
  kicker?: string;
  /** Oversized background index for editorial depth */
  decorIndex?: string;
  /** `deep` matches dark showreel-style sections (e.g. VideoGallery) */
  variant?: 'default' | 'deep';
  className?: string;
};

export function HomeSplitHeader({
  title,
  description,
  kicker,
  decorIndex,
  variant = 'default',
  className,
}: HomeSplitHeaderProps) {
  const deep = variant === 'deep';
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -12% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={cn('relative mb-12 md:mb-20', className)}>
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute -right-6 top-1/2 h-[min(320px,55vw)] w-[min(320px,55vw)] -translate-y-1/2 rounded-full blur-3xl',
          deep
            ? 'bg-[radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.12),transparent_68%)]'
            : 'bg-primary/15',
        )}
      />

      <div className="relative grid gap-10 md:grid-cols-12 md:items-center md:gap-x-0 md:gap-y-0 lg:gap-0">
        <div className="relative md:col-span-5 lg:col-span-7 md:pr-6 lg:pr-10">
          {decorIndex ? (
            <span
              className={cn(
                'pointer-events-none absolute -left-2 -top-6 select-none font-displaytailwind text-[clamp(3.5rem,11vw,7.5rem)] font-bold leading-none tracking-tighter tabular-nums',
                deep ? 'text-white/[0.035]' : 'text-foreground/[0.045]',
              )}
              aria-hidden
            >
              {decorIndex}
            </span>
          ) : null}

          {kicker ? (
            <p
              className={cn(
                'relative mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em]',
                'transition-all duration-700 will-change-[opacity,transform]',
                isInView ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0',
                deep ? 'text-cyan-200/85' : 'text-primary',
              )}
            >
              <span
                className={cn(
                  'h-px w-10 shrink-0 bg-gradient-to-r',
                  deep ? 'from-cyan-400/70 to-transparent' : 'from-primary/60 to-transparent',
                )}
              />
              <span className="whitespace-nowrap">{kicker}</span>
            </p>
          ) : null}

          <h2
            className={cn(
              'relative  text-balance font-displaytailwind text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.06] tracking-tight',
              'transition-all duration-700 will-change-[opacity,transform]',
              isInView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
              deep
                ? 'bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-500 bg-clip-text text-transparent'
                : 'text-foreground',
            )}
            style={{ transitionDelay: '80ms' }}
          >
            {title}
          </h2>

          <div aria-hidden className="mt-6 flex gap-1.5 md:hidden">
            <span className={cn('h-1 w-6 rounded-full', deep ? 'bg-cyan-400/35' : 'bg-primary/35')} />
            <span className={cn('h-1 w-6 rounded-full', deep ? 'bg-cyan-400/50' : 'bg-primary/45')} />
            <span className={cn('h-1 w-6 rounded-full', deep ? 'bg-cyan-400/65' : 'bg-primary/55')} />
            <span className={cn('h-1 w-6 rounded-full', deep ? 'bg-cyan-400/80' : 'bg-primary/70')} />
          </div>
        </div>

        <div
          className={cn(
            'relative md:col-span-7 lg:col-span-5  md:pl-8 lg:pl-12 ',
            deep ? 'md:border-white/[0.12]' : 'md:border-border/80',
          )}
        >
        

          <div
            className={cn(
              'relative max-w-xl space-y-4 text-base leading-relaxed md:pt-1 md:text-lg md:leading-relaxed lg:max-w-2xl',
              'transition-all duration-700 will-change-[opacity,transform]',
              isInView ? 'translate-y-0 opacity-100' : 'translate-y-7 opacity-0',
              deep ? 'text-zinc-400' : 'text-muted-foreground',
              '[&_p]:text-pretty',
            )}
            style={{ transitionDelay: '160ms' }}
          >
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}
