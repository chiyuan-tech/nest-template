'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users } from 'lucide-react';
import Link from 'next/link';
import type { HeroSectionData } from '@/components/cy/HeroSection/video/types';

interface HeroSectionProps {
  data: HeroSectionData;
}

export  function VideoHeroCase2({ data }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const ctaButtons = (data.ctaButtons ?? []).slice(0, 2);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadeddata', () => {
        setVideoLoaded(true);
      });
    }
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0F172A]"
    >
      <motion.div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={data.heroPoster}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
          preload="metadata"
        >
          <source src={data.heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-blue-600/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[#0F172A]/40" />
      </motion.div>

      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
        <motion.div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      <motion.div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
        <motion.div>
          <motion.div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary/100" />
            <span className="text-sm text-white/90">{data?.badgeText}</span>
          </motion.div>

          <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, var(--primary) 0%, color-mix(in oklab, var(--primary) 78%, white) 52%, color-mix(in oklab, var(--primary) 86%, black) 100%)",
              }}
            >
              {data.title}
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-white/70 sm:text-xl">
            {data.subtitle}
          </p>

          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {ctaButtons.map((button, index) => (
              <Link
                key={`${button.href}-${button.text}`}
                href={button.href}
                className="cursor-pointer flex items-center justify-center"
              >
                <Button
                  size="lg"
                  variant={index === 0 ? "cyan" : "whiteOutline"}
                  rightIcon={index === 0 ? <ArrowRight className="ml-2 h-5 w-5" /> : undefined}
                >
                  {button.text}
                </Button>
              </Link>
            ))}
          </div>

          <motion.div className="flex items-center justify-center gap-3 text-white/60">
            <div className="flex -space-x-2">
              {['/avater/1.webp', '/avater/2.webp', '/avater/3.webp', '/avater/4.webp'].map(
                (avatar, i) => (
                  <div
                    key={i}
                    className="h-8 w-8 overflow-hidden rounded-full border-2 border-[#0F172A]"
                  >
                    <img src={avatar} alt={`User ${i + 1}`} className="h-full w-full object-cover" />
                  </div>
                )
              )}
            </div>
            <Users className="h-4 w-4" />
            <span className="text-sm">{data.socialProof}</span>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/30 p-2"
        >
          <motion.div className="h-3 w-1.5 rounded-full bg-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
