"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { CyTestimonialTitleCase1 } from "@/components/cy/headerLayout/cy-testimonial-title";
import type { CyTitleLayoutId } from "@/components/cy/headerLayout/cy-title-layout.config";
import type { TestimonialGridCase3Data } from "@/components/cy/UsersSay/types";

export interface TestimonialGridCase3Props {
  data: TestimonialGridCase3Data;
}

/** 落地页风格：用户评价轮播（Embla + Autoplay），标题区走 CyTestimonialTitleCase1。 */
export function TestimonialGridCase3({ data }: TestimonialGridCase3Props) {
  const titleLayout = (data.titleLayout ?? "headerVertical") as CyTitleLayoutId;
  const sectionId = data.sectionId ?? "SocialProof";
  const testimonials = data.testimonials ?? [];

  const plugin = useRef(
    Autoplay({
      delay: data.autoplayDelayMs ?? 3000,
      stopOnInteraction: data.stopOnInteraction ?? false,
    })
  );

  return (
    <section
      id={sectionId}
      className="relative  h-full overflow-hidden bg-gradient-to-b from-background to-background py-16 sm:py-20 md:py-24 lg:py-32"
    >
      <div className="absolute inset-0  rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CyTestimonialTitleCase1
          layoutId={titleLayout}
          data={{
            decorIndex: data.decorIndex,
            kicker: data.kicker,
            sectionTitle: data.sectionTitle,
            subtitle: data.subtitle,
          }}
        />

        <div className="relative">
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-24" />
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-24" />

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[plugin.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={testimonial.id ?? index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full cursor-grab">
                    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card/50 to-card/30 p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
                      <div className="mb-4 flex items-center gap-4">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary">
                          <Image
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-base font-semibold text-foreground">
                            {testimonial.name}
                          </h4>
                          <p className="truncate text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                        <div className="flex flex-shrink-0 items-center gap-0.5">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
