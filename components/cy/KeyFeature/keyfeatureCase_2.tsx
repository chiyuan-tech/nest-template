"use client";

import { CyInlineMedia } from "@/components/cy/common/CyInlineMedia";
import { ScrollRevealInit } from "@/components/animations/ScrollRevealInit";
import { CyTestimonialTitleCase1 } from "@/components/cy/headerLayout/cy-testimonial-title";
import type { CyTitleLayoutId } from "@/components/cy/headerLayout/cy-title-layout.config";
import type { KeyFeatureCase2Card, KeyFeatureCase2Data } from "@/components/cy/KeyFeature/types";
import { isKeyFeatureCase2VideoCard } from "@/components/cy/utils";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface KeyFeatureCase2Props {
  data: KeyFeatureCase2Data;
}

function case2VideoDecoration(card: KeyFeatureCase2Card, isActive: boolean) {
  if (!isKeyFeatureCase2VideoCard(card)) return undefined;
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-black/80 lg:from-black/15 lg:via-black/20 lg:to-black/75" />
      <div
        className={cn(
          "absolute inset-0 hidden transition-opacity duration-500 lg:block",
          isActive ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="absolute -inset-10 bg-[radial-gradient(circle_at_70%_50%,color-mix(in_oklab,var(--color-primary)_32%,transparent),transparent_52%)]" />
      </div>
    </>
  );
}

export function KeyFeatureCase2({ data }: KeyFeatureCase2Props) {
  const titleLayout: CyTitleLayoutId = data.titleLayout ?? "headerVertical";
  const cards = data.cards ?? [];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="mx-auto w-full max-w-7xl py-16 sm:py-20 md:py-24 lg:py-32">
      <ScrollRevealInit />
      <div className="mb-14 px-4 sm:px-6 lg:px-4">
        <CyTestimonialTitleCase1
          layoutId={titleLayout}
          data={{
            decorIndex: data.decorIndex,
            kicker: data.kicker,
            sectionTitle: data.sectionTitle,
            subtitle: data.subtitle,
          }}
        />
      </div>

      <div className="mt-14">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:flex lg:h-[34rem] lg:w-full lg:items-stretch lg:gap-3">
          {cards.map((card, idx) => {
            const isActive = idx === activeIndex;
            const videoDecor = case2VideoDecoration(card, isActive);

            return (
              <article
                key={card.title}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "group relative isolate min-w-0 cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f1a]",
                  "lg:transition-[flex-grow,transform,filter,opacity,box-shadow,border-color] lg:duration-700 lg:ease-[cubic-bezier(.22,.61,.36,1)]",
                  isActive
                    ? "border-primary/45 shadow-lg shadow-primary/20 ring-1 ring-primary/15 ring-offset-0 ring-offset-transparent lg:flex-[3.2] lg:border-primary/50 lg:shadow-2xl lg:shadow-primary/25 lg:ring-primary/20"
                    : "lg:flex-[1] lg:border-white/10 lg:opacity-90 lg:saturate-75",
                )}
                aria-current={isActive}
              >
                <div
                  className={cn(
                    "relative w-full overflow-hidden rounded-2xl",
                    "h-72 lg:absolute lg:inset-0 lg:h-full",
                  )}
                >
                  <div className="absolute z-10 inset-0 bg-gradient-to-b from-black/20 via-black/25 to-black/80"  ></div>
                  {isKeyFeatureCase2VideoCard(card) ? (
                    <CyInlineMedia
                      variant="video"
                      src={card.video}
                      poster={card.videoPoster}
                      className="absolute inset-0 h-full w-full"
                      videoDecoration={videoDecor}
                    />
                  ) : (
                    <CyInlineMedia
                      variant="image"
                      src={card.image ?? ""}
                      alt={card.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full"
                    />
                  )}
                </div>

                <div className="absolute inset-x-0 bottom-0 z-10 hidden p-5 lg:block">
                  <h3
                    className={cn(
                      "font-heading text-xl font-semibold text-white transition-all duration-500",
                      isActive ? "translate-y-0 opacity-100 md:text-2xl" : "translate-y-0 opacity-95",
                    )}
                  >
                    {card.title}
                  </h3>

                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-500 ease-out",
                      isActive ? "mt-2 max-h-32 opacity-100" : "mt-0 max-h-0 opacity-0",
                    )}
                  >
                    <p className="max-w-xl text-sm leading-relaxed text-zinc-200/95">{card.description}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
