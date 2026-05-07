'use client';

import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { HeroSectionData } from '@/components/cy/HeroSection/video/types';

interface HeroBackgroundMediaProps {
  data: HeroSectionData;
}

export  function VideoHeroCase3({ data }: HeroBackgroundMediaProps) {
  const [isMuted, setIsMuted] = useState(true);
  const ctaButtons = (data.ctaButtons ?? []).slice(0, 2);

  return (
    <section className="relative h-full min-h-[520px] w-full overflow-hidden bg-[#07090f]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <video
          className="h-full w-full object-cover"
          autoPlay
          loop
          playsInline
          muted={isMuted}
          poster={data.heroPoster}
          src={data.heroVideo}
        />
        <div className="absolute inset-0 bg-[#07090f]/38" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090f]/32 via-[#07090f]/36 to-[#07090f]/32" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center px-3 sm:top-5 md:top-6 lg:top-8">
        <div className="pointer-events-auto inline-flex w-full max-w-max items-center gap-2 rounded-full border border-white/20 bg-black/55 p-1.5 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setIsMuted(true)}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${isMuted ? 'bg-white/15 text-white' : 'text-zinc-300 hover:bg-white/10'
              }`}
          >
            <VolumeX className="h-3.5 w-3.5" />
            Original Video
          </button>
          <button
            type="button"
            onClick={() => setIsMuted(false)}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${!isMuted ? 'bg-[var(--primary)] text-white' : 'text-zinc-300 hover:bg-white/10'
              }`}
          >
            <Volume2 className="h-3.5 w-3.5" />
            PrismAudio Video
          </button>
        </div>
      </div>


      <div className="relative z-10 mx-auto flex h-full min-h-[520px] w-full max-w-[1400px] items-center px-4">
        <div className="max-w-3xl">
          <div  >
            <Badge variant="outline" className="mb-8 border-white/20 text-zinc-300 bg-white/5 px-4 py-1.5 rounded-full backdrop-blur-md">
              {data?.badgeText}
            </Badge>
            <h1 className="text-5xl md:text-7xl font-heading  font-bold tracking-tight text-white mb-6 leading-[1.1]">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, var(--primary) 0%, color-mix(in oklab, var(--primary) 76%, white) 52%, color-mix(in oklab, var(--primary) 84%, black) 100%)",
                }}
              >
                {data.title}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 mb-10 max-w-2xl leading-relaxed">
              {data.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
              {ctaButtons.map((button, index) => (
                <Link key={`${button.href}-${button.text}`} href={button.href}>
                  <Button
                    size="lg"
                    variant={index === 0 ? "cyan" : "whiteOutline"}
                    className="h-14 w-full cursor-pointer rounded-full px-8 text-base sm:w-auto"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    {button.text}
                  </Button>
                </Link>
              ))}

            </div>

            {(data.heroStats?.length ?? 0) > 0 ? (
              <div className="grid max-w-3xl grid-cols-2 gap-8 border-t border-white/10 pt-8 md:grid-cols-4">
                {(data.heroStats ?? []).map((stat) => (
                  <div key={`${stat.label}-${stat.value}`}>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      {stat.label}
                    </div>
                    <div className="font-medium text-white">{stat.value}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

    </section>
  );
}
