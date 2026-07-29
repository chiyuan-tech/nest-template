"use client";

import Link from "next/link";
import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollRevealInit } from "@/components/animations/ScrollRevealInit";
import { CyTestimonialTitleCase1 } from "@/components/cy/headerLayout/cy-testimonial-title";
import type { CyTitleLayoutId } from "@/components/cy/headerLayout/cy-title-layout.config";
import type { PricingCase1Data, PricingPlanItem } from "@/components/cy/Pricing/types";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export interface PricingCase1Props {
  data: PricingCase1Data;
}

function planHasCheckout(plan: PricingPlanItem) {
  return typeof plan.priceId === "string" && plan.priceId.trim().length > 0;
}

export function PricingCase1({ data }: PricingCase1Props) {
  const titleLayout: CyTitleLayoutId = data.titleLayout ?? "headerVertical";
  const plans = data.plans ?? [];
  const checks = data.bottomChecks ?? [];
  const [loadingPlanKey, setLoadingPlanKey] = useState<string | null>(null);
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const saveSelectedPlan = (plan: PricingPlanItem) => {
    try {
      localStorage.setItem(
        "selectedPlan",
        JSON.stringify({
          key: plan.key,
          title: plan.title,
          price: plan.price,
          credits: plan.credits,
          features: plan.features,
          timestamp: Date.now(),
        })
      );
    } catch {
      /* ignore quota / private mode */
    }
  };

  const handleCheckout = async (plan: PricingPlanItem) => {
    if (!planHasCheckout(plan)) return;

    if (!isSignedIn) {
      openSignIn();
      return;
    }
    if (!user?.id) {
      alert("Could not get user information. Please try refreshing the page.");
      return;
    }

    saveSelectedPlan(plan);
    setLoadingPlanKey(plan.key);
    try {
      const res = (await api.payment.createPaypalSession(plan.priceId!.trim())) as {
        data?: { url?: string };
        url?: string;
      };
      const checkoutUrl = res?.data?.url ?? res?.url;
      if (checkoutUrl && typeof checkoutUrl === "string") {
        window.location.href = checkoutUrl;
      } else {
        alert("Checkout URL is missing. Please try again later.");
        setLoadingPlanKey(null);
      }
    } catch (e) {
      console.error("Checkout error:", e);
      alert(e instanceof Error ? e.message : "Network error. Please try again.");
      setLoadingPlanKey(null);
    }
  };

  return (
    <section
      id="pricing"
      className="bg-gradient-to-b from-background to-secondary/20 py-20"
    >
      <ScrollRevealInit />
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" aria-hidden />
            {data.badgeText}
          </div>
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

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={cn(
                "group relative rounded-3xl p-[2px] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10",
                plan.popular
                  ? "scale-105 bg-primary shadow-lg shadow-primary/10 hover:scale-110"
                  : "border border-border"
              )}
            >
              <div
                className={cn(
                  "relative h-full rounded-[1.375rem] p-8 backdrop-blur-sm transition-all duration-300",
                  !plan.popular && "hover:bg-card/70"
                )}
                style={{ backgroundColor: "oklch(0.12 0.006 285.885 / 0.9)" }}
              >
                {plan.popular ? (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                    <div className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                      Most Popular
                    </div>
                  </div>
                ) : null}

                <div className="mb-8 text-center">
                  <h3 className="mb-4 text-2xl font-bold text-foreground">{plan.title}</h3>
                  <div className="mb-6 transition-transform duration-300 group-hover:scale-105">
                    <span className="text-5xl font-bold text-primary">{plan.price}</span>
                    <span className="ml-2 text-muted-foreground">one-time</span>
                  </div>
                  {planHasCheckout(plan) ? (
                    <Button
                      type="button"
                      className={cn(
                        "mb-8 w-full cursor-pointer rounded-xl py-3 text-base font-semibold transition-all duration-300",
                        plan.popular
                          ? "bg-primary text-primary-foreground shadow-lg hover:opacity-90"
                          : "bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:from-gray-600 hover:to-gray-500"
                      )}
                      disabled={loadingPlanKey === plan.key}
                      onClick={() => void handleCheckout(plan)}
                    >
                      {loadingPlanKey === plan.key ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                          Processing…
                        </span>
                      ) : (
                        plan.ctaLabel
                      )}
                    </Button>
                  ) : (
                    <Button
                      className={cn(
                        "mb-8 w-full cursor-pointer rounded-xl py-3 text-base font-semibold transition-all duration-300",
                        plan.popular
                          ? "bg-primary text-primary-foreground shadow-lg hover:opacity-90"
                          : "bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:from-gray-600 hover:to-gray-500"
                      )}
                      asChild
                    >
                      <Link href={plan.ctaHref}>{plan.ctaLabel}</Link>
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={`${plan.key}-f-${featureIndex}`} className="flex items-center gap-3">
                      <Check
                        className={cn(
                          "h-5 w-5 shrink-0",
                          plan.popular ? "text-primary" : "text-muted-foreground"
                        )}
                        aria-hidden
                      />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="mb-4 text-lg text-muted-foreground">{data.bottomTagline}</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            {checks.map((label) => (
              <span key={label} className="flex items-center gap-2">
                <span className="font-bold text-green-500">✓</span>
                {label}
              </span>
            ))}
            <span className="flex items-center gap-2">
              <span className="font-bold text-green-500">✓</span>
              Email support{" "}
              <a
                href={`mailto:support@${data.supportMailDomain}`}
                className="inline-flex items-center text-primary transition-colors duration-200 hover:text-primary/80"
              >
                support@{data.supportMailDomain}
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
