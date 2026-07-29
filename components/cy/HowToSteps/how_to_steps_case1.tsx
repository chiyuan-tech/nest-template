"use client";

import Image from "next/image";
import { ScrollRevealInit } from "@/components/animations/ScrollRevealInit";
import { CyTestimonialTitleCase1 } from "@/components/cy/headerLayout/cy-testimonial-title";
import type { CyTitleLayoutId } from "@/components/cy/headerLayout/cy-title-layout.config";
import type { HowToStepsCase1Data } from "@/components/cy/HowToSteps/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface HowToStepsCase1Props {
  data: HowToStepsCase1Data;
}

export function HowToStepsCase1({ data }: HowToStepsCase1Props) {
  const titleLayout: CyTitleLayoutId = data.titleLayout ?? "headerVertical";
  const steps = data.steps ?? [];

  return (
    <section
      id="how-to-use"
      data-reveal
      className="mx-auto max-w-7xl px-4 py-20 md:px-4 md:py-28"
    >
      <ScrollRevealInit />
      <CyTestimonialTitleCase1
        layoutId={titleLayout}
        data={{
          decorIndex: data.decorIndex,
          kicker: data.kicker,
          sectionTitle: data.sectionTitle,
          subtitle: data.subtitle,
        }}
      />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {steps.map((step, index) => (
          <Card
            key={step.name}
            data-reveal
            style={{ transitionDelay: `${index * 70}ms` }}
            className="border-border bg-card/90"
          >
            <CardHeader>
              <CardTitle className="text-xl font-bold tracking-tight text-white">{step.name}</CardTitle>
              <div className="mt-4 h-[300px] overflow-hidden rounded-xl bg-secondary/60">
                <Image
                  src={step.image}
                  alt={step.name}
                  width={960}
                  height={1800}
                  className="h-full w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </CardHeader>
            <CardContent className="text-base leading-7 text-muted-foreground">{step.text}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
