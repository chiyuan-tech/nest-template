"use client";

import Masonry from "@/components/shadcn/Masonry/page";
import { FadeIn } from "@/components/animations/FadeIn";
import { CyTestimonialTitleCase1 } from "@/components/cy/headerLayout/cy-testimonial-title";
import type { UseCasesGalleryCase1Data } from "@/components/cy/UseCases/types";
import type { CyTitleLayoutId } from "@/components/cy/headerLayout/cy-title-layout.config";

export interface UseCasesGalleryCase1Props {
  data: UseCasesGalleryCase1Data;
}

export function UseCasesGalleryCase1({ data }: UseCasesGalleryCase1Props) {
  const titleLayout: CyTitleLayoutId = data.titleLayout ?? "headerVertical";
  const items = data.items ?? [];

  return (
    <section
      id="gallery"
      className="relative overflow-hidden bg-gradient-to-b from-[#060606] via-[#0b0b0b] to-[#060606] py-16 sm:py-20 md:py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_55%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-4">
        <CyTestimonialTitleCase1
          layoutId={titleLayout}
          data={{
            decorIndex: data.decorIndex,
            kicker: data.kicker,
            sectionTitle: data.sectionTitle,
            subtitle: data.subtitle,
          }}
        />

        <FadeIn duration={800} delay={200}>
          <div className="relative mt-10 w-full">
            <Masonry
              items={items}
              ease="power4.out"
              duration={0.6}
              stagger={0.05}
              animateFrom="bottom"
              scaleOnHover
              hoverScale={0.95}
              blurToFocus
              colorShiftOnHover
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
