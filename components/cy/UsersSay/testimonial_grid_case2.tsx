"use client";

import Image from "next/image";
import { CyTestimonialTitleCase2 } from "@/components/cy/headerLayout/cy-testimonial-title";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import type { TestimonialGridCase2Data } from "@/components/cy/UsersSay/types";

export interface TestimonialGridCase2Props {
  data: TestimonialGridCase2Data;
}

export function TestimonialGridCase2({ data }: TestimonialGridCase2Props) {
  const titleLayout = data.titleLayout ?? "homeSplitHeader";
  const items = data.items ?? [];
  const columns = useMemo(
    () => [0, 1, 2, 3].map((columnIndex) => items.filter((_, idx) => idx % 4 === columnIndex)),
    [items]
  );

  return (
    <section className="relative overflow-hidden bg-[#05070d] px-4 py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_45%_at_50%_0%,rgba(56,189,248,0.2),transparent_72%),radial-gradient(40%_38%_at_90%_75%,rgba(99,102,241,0.16),transparent_72%)]"
        aria-hidden
      />
      <div className="max-w-7xl mx-auto">
        <CyTestimonialTitleCase2
          layoutId={titleLayout}
          data={{
            decorIndex: data.decorIndex,
            kicker: data.kicker,
            title: data.title,
            description: data.description,
          }}
        />

        <div className="relative mt-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-[#05070d] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-[#05070d] to-transparent" />
          <div className="grid h-[640px] grid-cols-1 gap-5 overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((columnItems, columnIndex) => (
              <div key={columnIndex} className="testimonial-case2-column relative overflow-hidden">
                <div
                  className={cn(
                    "flex flex-col gap-5 will-change-transform",
                    columnIndex % 2 === 0
                      ? "testimonial-case2-marquee-up"
                      : "testimonial-case2-marquee-down"
                  )}
                >
                  {[...columnItems, ...columnItems].map((testimonial, index) => (
                    <Card
                      key={`${testimonial.author}-${index}`}
                      className="border-white/10 bg-[linear-gradient(140deg,rgba(9,15,30,0.96),rgba(6,9,18,0.9))] shadow-[0_20px_56px_-28px_rgba(0,0,0,0.65)]"
                    >
                      <CardContent className="pt-5">
                        <Quote className="mb-3 h-7 w-7 text-primary/40" />
                        <p className="mb-5 text-sm italic leading-relaxed text-zinc-100">
                          &ldquo;{testimonial.quote}&rdquo;
                        </p>
                        <div className="border-t border-white/10 pt-4">
                          <div className="mb-2 flex items-center gap-3">
                            <Image
                              src={testimonial.avatar}
                              alt={testimonial.author}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <p className="text-sm font-semibold text-zinc-100">{testimonial.author}</p>
                          </div>
                          <p className="text-xs text-zinc-400">{testimonial.role}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes testimonial-case2-marquee-up {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        @keyframes testimonial-case2-marquee-down {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }
        .testimonial-case2-marquee-up {
          animation: testimonial-case2-marquee-up 36s linear infinite;
          will-change: transform;
        }
        .testimonial-case2-marquee-down {
          animation: testimonial-case2-marquee-down 36s linear infinite;
          will-change: transform;
        }
        .testimonial-case2-column:hover .testimonial-case2-marquee-up,
        .testimonial-case2-column:hover .testimonial-case2-marquee-down {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
