'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown, Play } from 'lucide-react';
import type { HeroSectionData } from '@/components/cy/HeroSection/video/types';

const HERO_KEYFRAMES = `
  @keyframes hero-line-in {
    from {
      opacity: 0;
      transform: translate3d(0, 14px, 0);
      filter: blur(8px);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
      filter: blur(0);
    }
  }
  @keyframes hero-gradient-shift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  @keyframes hero-beam-sweep {
    0% { transform: translate3d(-140%, 0, 0) skewX(-14deg); opacity: 0; }
    12% { opacity: 0.14; }
    45% { opacity: 0.1; }
    100% { transform: translate3d(140%, 0, 0) skewX(-14deg); opacity: 0; }
  }
  .hero-line {
    opacity: 0;
    animation: hero-line-in 0.95s ease-out forwards;
  }
  .hero-line-e { animation-delay: 0s; }
  .hero-line-1 { animation-delay: 0.08s; }
  .hero-line-2 { animation-delay: 0.16s; }
  .hero-line-3 { animation-delay: 0.24s; }
  .hero-line-desc { animation-delay: 0.32s; }
  .hero-line-cta { animation-delay: 0.4s; }
  .hero-line-trust { animation-delay: 0.48s; }
  .hero-gradient-text {
    background: linear-gradient(
      105deg,
      #e4e4e7 0%,
      #d4d4d8 18%,
      #c4b5fd 38%,
      #a78bfa 52%,
      #93c5fd 72%,
      #e4e4e7 100%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: hero-gradient-shift 16s ease-in-out infinite;
  }
  .hero-beam {
    animation: hero-beam-sweep 14s cubic-bezier(0.22, 1, 0.36, 1) infinite;
  }
  @keyframes hero-bottom-breathe {
    0%, 100% { opacity: 0.9; }
    50% { opacity: 1; }
  }
  .hero-bottom-blend {
    animation: hero-bottom-breathe 9s ease-in-out infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .hero-line {
      opacity: 1;
      transform: none;
      filter: none;
      animation: none;
    }
    .hero-gradient-text { animation: none; background-position: 45% 50%; }
    .hero-beam { animation: none; opacity: 0.06; transform: translate3d(0,0,0) skewX(-14deg); }
    .hero-bottom-blend { animation: none; opacity: 1; }
  }
`;

interface HeroProps {
  data: HeroSectionData;
}

export  function VideoHeroCase1({ data }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const ctaButtons = (data.ctaButtons ?? []).slice(0, 2);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-[calc(100dvh-80px)] w-full overflow-hidden bg-[#05070d] text-white"
    >
      <style dangerouslySetInnerHTML={{ __html: HERO_KEYFRAMES }} />

      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          poster={data.heroPoster}
          muted={isMuted}
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
          src={data.heroVideo}
          aria-label="Wan 3.0 AI-generated video showcase"
        >
          <source src={data.heroVideo} type="video/mp4" />
        </video>
      </div>

      <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/72 via-background/48 via-45% to-transparent to-85%" aria-hidden />

      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden opacity-90">
        <div
          className="hero-beam absolute -left-1/2 top-[18%] h-[120%] w-[55%] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
          style={{ willChange: 'transform' }}
        />
      </div>

      <div className="hero-bottom-blend pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[42%]">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,7,13,0)_60%,rgba(5,7,13,0.55)_78%,#05070d_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_88%,rgba(147,197,253,0.08),transparent_72%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-80px)] w-full flex-col items-center justify-center px-4 pb-28 pt-20 sm:px-4 sm:pb-24 sm:pt-16">
        <div className="mx-auto w-full -translate-y-[min(4vh,2.5rem)] pt-20 text-center">
          <p className="hero-line hero-line-e mb-5 text-[11px] font-medium uppercase tracking-[0.28em] text-white/80 sm:text-xs">
            {data?.badgeText}
          </p>

          <h1 className="font-displaytailwind  font-semibold leading-[1.1] tracking-tight text-zinc-100 text-5xl md:text-7xl ">
            <span className="hero-line hero-line-1 block">{data.title}</span>
            <span className="hero-line hero-line-3 mt-3">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, var(--primary) 0%, color-mix(in oklab, var(--primary) 75%, white) 50%, color-mix(in oklab, var(--primary) 68%, black) 100%)",
                }}
              >
                For Your Imagination
              </span>
            </span>
          </h1>

          <p className="hero-line hero-line-desc mx-auto mt-8 max-w-3xl text-pretty text-[15px] leading-relaxed text-white/80 sm:text-base lg:text-lg">
            {data.subtitle}
          </p>

          <div className="hero-line hero-line-cta mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
            {ctaButtons.map((button, index) => (
              <Button
                key={`${button.href}-${button.text}`}
                size="lg"
                
                asChild
                variant={index === 0 ? "cyan" : "whiteOutline"}
              >
                <Link href={button.href} className="flex items-center justify-center gap-2">
                  {index === 1 ? (
                    <Play className="h-[18px] w-[18px] opacity-80 transition-opacity duration-300 ease-out group-hover:opacity-100" />
                  ) : null}
                  <span className="relative z-10 flex items-center justify-center">
                    {button.text}
                    {index === 0 ? (
                      <ArrowRight className="ml-2 h-[18px] w-[18px] transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
                    ) : null}
                  </span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <a
        href="#"
        className="group absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-zinc-600 transition-colors duration-300 ease-out hover:text-zinc-400 cursor-pointer"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.22em]">Explore</span>
        <ChevronDown className="h-4 w-4 opacity-70 transition-transform duration-300 ease-out group-hover:translate-y-1" />
      </a>
    </section>
  );
}
