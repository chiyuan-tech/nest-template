"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ScrollRevealInit } from "@/components/animations/ScrollRevealInit";
import { CyTestimonialTitleCase1 } from "@/components/cy/headerLayout/cy-testimonial-title";
import type { CyTitleLayoutId } from "@/components/cy/headerLayout/cy-title-layout.config";
import type { PricingCase2Data } from "@/components/cy/Pricing/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PricingCase2Props {
  data: PricingCase2Data;
}

export function PricingCase2({ data }: PricingCase2Props) {
  const titleLayout: CyTitleLayoutId = data.titleLayout ?? "headerVertical";
  const items = data.faqItems ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(() =>
    data.defaultOpenFaqIndex === undefined ? 0 : data.defaultOpenFaqIndex
  );

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="bg-gradient-to-b from-secondary/20 to-background px-4 py-20">
      <ScrollRevealInit />
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-16 lg:grid-cols-2">
          <div className="lg:sticky lg:top-8">
            <CyTestimonialTitleCase1
              layoutId={titleLayout}
              data={{
                decorIndex: data.decorIndex,
                kicker: data.kicker,
                sectionTitle: data.sectionTitle,
                subtitle: data.subtitle,
              }}
            />
            <div className="mt-8">
              <div className="mb-4 h-1 w-24 bg-gradient-to-r from-primary/20 to-transparent" />
              <p className="mb-6 text-muted-foreground">{data.leftSupportBlurb}</p>
              <Button size="lg" variant="cyan" className="cursor-pointer shadow-lg" asChild>
                <Link href={data.primaryCta.href}>{data.primaryCta.label}</Link>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={`${item.question}-${index}`}
                className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full cursor-pointer items-center justify-between rounded-xl px-6 py-5 text-left transition-all duration-200 hover:bg-secondary/30"
                >
                  <h3 className="pr-4 text-lg font-semibold text-foreground">{item.question}</h3>
                  <div className="shrink-0">
                    {openIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-primary" aria-hidden />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" aria-hidden />
                    )}
                  </div>
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    openIndex === index ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="px-6 pb-5">
                    <div className="mb-4 h-px bg-gradient-to-r from-border/50 to-transparent" />
                    <p className="leading-relaxed text-muted-foreground">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-8 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 p-6">
              <h3 className="mb-2 text-lg font-semibold text-foreground">{data.helpCard.title}</h3>
              <p className="mb-4 text-muted-foreground">{data.helpCard.body}</p>
              <a
                href={data.helpCard.mailto}
                className="inline-flex cursor-pointer items-center font-medium text-primary transition-colors duration-200 hover:text-primary/80"
              >
                {data.helpCard.mailto.replace(/^mailto:/, "")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
