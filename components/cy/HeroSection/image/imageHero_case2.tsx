'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { ImageHeroData } from '@/components/cy/HeroSection/image/types';
import Image from 'next/image';

export function ImageHeroCase2({ data }: { data: ImageHeroData }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const slideCount = data.logoImages?.length ?? 0;

  useEffect(() => {
    if (slideCount <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === slideCount - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [slideCount]);

  return (
    <section className="relative min-h-screen px-4 flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel - Hidden on mobile */}
      <div className="hidden md:block absolute inset-0">
        {(data.logoImages ?? []).map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <div className="relative h-full w-full">
              <Image
                src={image}
                alt={`Hero background ${index + 1}`}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === 0}
              />
            </div>
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}
      </div>

      {/* Mobile Background - Gradient only */}
      <div className="md:hidden absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20"></div>

      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">{data?.badgeText}</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, var(--primary) 0%, color-mix(in oklab, var(--primary) 78%, white) 52%, color-mix(in oklab, var(--primary) 72%, black) 100%)' }}>{data.title}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {
              data.ctaButtons.map((button, index) => (
                <Link href={button.href} key={`${button.href}-${button.text}`}>
                  <Button
                    size="lg"
                    variant={index === 0 ? 'cyan' : 'whiteOutline'}
                    rightIcon={<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  >
                    {button.text}
                  </Button>
                </Link>
              ))
            }
          </div>

        </div>
      </div>
    </section>
  );
}
