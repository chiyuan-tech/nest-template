'use client';

import { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { pricingConfig } from '@/website-config';

interface PricingPlan {
  key: string;
  priceId: string;
  popular: boolean;
  title: string;
  price: string;
  priceAmount: number;
  features: string[];
  buttonText: string;
}

interface PricingSectionProps {
  hideSection?: boolean;
}

export default function PricingSection({ hideSection = false }: PricingSectionProps = {}) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const pricingPlans: PricingPlan[] = pricingConfig.oneTimePlans;

  const handleUpgradeClick = async (priceId: string, planKey: string) => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    const userId = user?.id;
    if (!userId) {
      console.error('User is signed in but user ID is missing.');
      alert('Could not get user information. Please try refreshing the page.');
      return;
    }

    const selectedPlan = pricingPlans.find((plan) => plan.key === planKey);
    if (selectedPlan) {
      localStorage.setItem(
        'paymentInfo',
        JSON.stringify({
          planKey,
          price: selectedPlan.price,
          credits: selectedPlan.buttonText.match(/\d+/)?.[0] || '0',
          planTitle: selectedPlan.title,
          timestamp: new Date().toISOString(),
        })
      );
    }

    setLoadingPlan(planKey);

    try {
      const data = await api.payment.createPaypalSession(priceId);
      const checkoutUrl = data?.data?.url || data?.url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }

      console.error('Payment session response missing URL:', data);
      alert('Checkout URL is missing. Please try again later.');
      setLoadingPlan(null);
    } catch (error) {
      console.error('Error during subscription creation request:', error);
      alert(error instanceof Error ? error.message : 'Network error. Please check your connection and try again.');
      setLoadingPlan(null);
    }
  };

  const content = (
    <div className="mx-auto grid max-w-8xl gap-5 md:grid-cols-2 lg:grid-cols-4">
      {pricingPlans.map((plan) => {
        const isFree = plan.key === 'free';

        return (
          <div
            key={plan.key}
            className={cn(
              'relative rounded-[20px] border border-transparent p-6 transition-colors duration-150',
              plan.popular ? 'bg-accent text-card-foreground' : 'bg-card text-card-foreground hover:bg-accent'
            )}
          >
            {plan.popular && (
              <div className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-[13px] font-medium text-primary-foreground">
                Most Popular
              </div>
            )}

            <div className="mb-5 pr-24 text-[22px] font-bold leading-[1.2] tracking-[-0.8px] text-foreground">
              {plan.title}
            </div>

            <div className="mb-6">
              <span className="text-[62px] font-medium leading-none tracking-[-3.1px] text-foreground">{plan.price}</span>
            </div>

            <Button
              className={cn(
                'mb-6 w-full font-semibold',
                plan.popular
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : isFree
                    ? 'border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    : 'border border-border bg-secondary text-secondary-foreground hover:border-primary/50 hover:bg-secondary/80'
              )}
              onClick={() => !isFree && handleUpgradeClick(plan.priceId, plan.key)}
              disabled={loadingPlan === plan.key}
            >
              {loadingPlan === plan.key ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                plan.buttonText
              )}
            </Button>

            <ul className="space-y-3">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-2.5">
                  <Check
                    className={cn(
                      'mt-0.5 h-4 w-4 flex-shrink-0',
                      plan.popular ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                  <span className="text-sm leading-[1.4] tracking-[-0.14px] text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );

  if (hideSection) {
    return content;
  }

  return (
    <section id="pricing" className="bg-background px-5 py-24">
      <div className="mx-auto max-w-7xl">{content}</div>
    </section>
  );
}
