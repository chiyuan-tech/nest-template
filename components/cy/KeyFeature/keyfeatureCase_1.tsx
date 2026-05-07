"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { CyTestimonialTitleCase1 } from "@/components/cy/headerLayout/cy-testimonial-title";
import type { CyTitleLayoutId } from "@/components/cy/headerLayout/cy-title-layout.config";
import type { KeyFeatureCase1Data } from "@/components/cy/KeyFeature/types";
import { isKeyFeatureVideoItem } from "@/components/cy/utils";
import { CyInlineMedia } from "@/components/cy/common/CyInlineMedia";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollRevealInit } from "@/components/animations/ScrollRevealInit";
export interface KeyFeatureCase1Props {
  data: KeyFeatureCase1Data;
}

export function KeyFeatureCase1({ data }: KeyFeatureCase1Props) {
  const titleLayout: CyTitleLayoutId = data.titleLayout ?? "headerVertical";
  const items = data.items ?? [];

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-gradient-to-b from-[#060606] via-[#0b0b0b] to-[#060606] py-16 sm:py-20 md:py-24 lg:py-28"
    >
      <ScrollRevealInit />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent_55%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

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
          <div className="mt-18 space-y-25">
            {items.map((feature, index) => (
              <Card
                key={feature.title}
                style={{ transitionDelay: `${index * 60}ms` }}
                className="group overflow-hidden border-none bg-transparent"
              >
                <div className="grid items-center gap-4 md:grid-cols-2">
                  <div
                    data-reveal
                    className={index % 2 === 0 ? "order-1" : "order-1 md:order-2"}
                    style={{ transitionDelay: `${index * 60}ms` }}
                  >
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold tracking-tight text-white">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-base leading-7 text-muted-foreground">
                      <p>{feature.text}</p>
                      <p className="text-sm font-medium text-primary">{feature.bestFor}</p>
                    </CardContent>
                  </div>
                  <div
                  data-reveal
                    className={`relative aspect-video w-full overflow-hidden rounded-2xl ${index % 2 === 0 ? "order-2" : "order-2 md:order-1"}`}
                  >
                    {isKeyFeatureVideoItem(feature) ? (
                      <CyInlineMedia
                        variant="video"
                        src={feature.video}
                        poster={feature.videoPoster}
                        className="absolute inset-0 h-full w-full"
                      />
                    ) : (
                      <CyInlineMedia
                        variant="image"
                        src={feature.image}
                        alt={feature.title}
                        loading={index < 2 ? "eager" : "lazy"}
                        className="absolute inset-0 h-full w-full"
                      />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}