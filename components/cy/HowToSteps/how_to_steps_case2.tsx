"use client";

import { Download, FileText, Upload, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollRevealInit } from "@/components/animations/ScrollRevealInit";
import { CyTestimonialTitleCase1 } from "@/components/cy/headerLayout/cy-testimonial-title";
import type { CyTitleLayoutId } from "@/components/cy/headerLayout/cy-title-layout.config";
import type { HowToStepsCase2Data, HowToStepsCase2IconName } from "@/components/cy/HowToSteps/types";

const STEP_ICONS: Record<HowToStepsCase2IconName, LucideIcon> = {
  FileText,
  Upload,
  Download,
};

export interface HowToStepsCase2Props {
  data: HowToStepsCase2Data;
}

export function HowToStepsCase2({ data }: HowToStepsCase2Props) {
  const titleLayout: CyTitleLayoutId = data.titleLayout ?? "headerVertical";
  const steps = data.steps ?? [];

  const scrollToTarget = () => {
    const id = data.ctaScrollTargetId?.trim();
    if (!id || typeof document === "undefined") return;
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section
      id="how-it-works"
      className="bg-gradient-to-b from-background to-muted/20 py-16 md:py-24"
    >
      <ScrollRevealInit />
      <div className="container mx-auto px-6">
        <CyTestimonialTitleCase1
          layoutId={titleLayout}
          data={{
            decorIndex: data.decorIndex,
            kicker: data.kicker,
            sectionTitle: data.sectionTitle,
            subtitle: data.subtitle,
          }}
        />

        <div className="mx-auto mt-12 max-w-7xl md:mt-16">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 md:flex-row lg:max-w-7xl lg:gap-8 xl:max-w-7xl">
            {steps.map((step, index) => {
              const Icon = STEP_ICONS[step.icon] ?? FileText;
              return (
                <div
                  key={`${step.title}-${index}`}
                  data-reveal
                  className="group flex flex-1 flex-col items-center text-center"
                  style={{ transitionDelay: `${index * 70}ms` }}
                >
                  <div className="w-full max-w-[280px]">
                    <div className="mx-auto mb-4 flex items-center justify-center md:mb-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/20 transition-all duration-300 group-hover:from-primary/20 group-hover:to-primary/30 md:h-20 md:w-20 lg:h-24 lg:w-24">
                        <Icon
                          className="h-8 w-8 text-primary md:h-10 md:w-10 lg:h-12 lg:w-12"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                      </div>
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-foreground transition-colors duration-300 group-hover:text-primary md:mb-3 md:text-lg lg:text-xl">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 text-center md:mt-16">
          <p className="mb-6 text-muted-foreground">{data.guideHint}</p>
          <Button
            type="button"
            size="lg"
            variant="cyan"
            className="cursor-pointer rounded-full px-6 shadow-lg md:px-8 md:py-6"
            onClick={scrollToTarget}
            aria-label={data.ctaLabel}
          >
            {data.ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
