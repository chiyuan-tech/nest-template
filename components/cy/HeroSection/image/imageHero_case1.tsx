'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ScrollFramePlayer } from '@/components/cy/animation/scroll-frame-player';
import type { ImageHeroData } from '@/components/cy/HeroSection/image/types';

export interface ImageHeroProps {
  data: ImageHeroData;
}

export function ImageHeroCase1({ data }: ImageHeroProps) {
  const ctaButtons = (data.ctaButtons ?? []).slice(0, 2);
  const chips = data.featureChips ?? [];

  return (
    <section
      id="hero"
      className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-14  md:py-20"
    >
      <div className="flex flex-col items-center text-center md:items-start md:text-left">
        <div className="mb-10 flex flex-col items-center gap-4 md:items-start">
          <div className="max-w-5xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, var(--primary) 0%, color-mix(in oklab, var(--primary) 78%, white) 52%, color-mix(in oklab, var(--primary) 72%, black) 100%)',
                }}
              >
                {data.title}
              </span>
            </h1>
          </div>
        </div>

        <p className="mx-auto max-w-4xl text-center text-lg leading-8 text-muted-foreground md:mx-0 md:text-left md:text-xl">
          {data.subtitle}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
          {ctaButtons.map((button, index) => (
            <Button
              key={`${button.href}-${button.text}`}
              asChild
              size="lg"
              variant={index === 0 ? 'cyan' : 'whiteOutline'}
              className="cursor-pointer rounded-full px-8"
            >
              <Link href={button.href} prefetch={false}>
                {button.text}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ))}
        </div>

        {chips.length > 0 ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 md:justify-start">
            {chips.map((chip) => (
              <Badge key={chip} className="bg-secondary text-secondary-foreground">
                {chip}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
      <div style={{ position: 'relative' }} className="w-full md:justify-self-end">
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="absolute -left-6 top-8 hidden h-48 w-48 rounded-full bg-primary/25 blur-3xl md:block" aria-hidden />
          <div className="absolute -right-10 bottom-4 h-56 w-56 rounded-full bg-primary/15 blur-3xl" aria-hidden />

          <div className="hero-impact-stage relative aspect-[4/5] w-full md:aspect-square">
            <div className="absolute inset-0 rotate-[-4deg] rounded-[2rem] border border-white/10 bg-card/40 p-2 shadow-2xl shadow-primary/10 backdrop-blur-md">
              <div className="relative h-full w-full overflow-hidden rounded-[1.65rem]">
                <Image
                  src={data.heroImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  priority
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>
            </div>

            <div className="hero-fly-in-right absolute -right-2 top-6 w-[46%] rotate-6 rounded-2xl border border-primary/30 bg-background/80 p-1.5 shadow-xl backdrop-blur-md md:right-[-8%] md:top-10">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                <Image
                  src={data.heroImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="200px"
                  loading="lazy"
                  fetchPriority="low"
                />
              </div>
            </div>

            <div
              data-scroll-frame-end
              className="hero-fly-in-left absolute -left-4 bottom-10 w-[52%] -rotate-3 rounded-2xl border border-white/10 bg-card/90 p-1.5 shadow-xl backdrop-blur md:-left-8 md:bottom-14"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                <ScrollFramePlayer />
              </div>
            </div>

            <div className="absolute bottom-2 left-1/2 z-[2] w-[88%] -translate-x-1/2 rounded-2xl border border-primary/40 bg-background/85 px-4 py-3 text-center text-xs text-muted-foreground shadow-lg backdrop-blur-md md:bottom-4">
              <span className="font-medium text-primary">{data.liveBriefEmphasis}</span>
              {' — '}
              {data.liveBriefTail}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
