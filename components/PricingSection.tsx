'use client';

import { Button } from '@/components/ui/button';
import { Check, Loader2, DollarSign, Shield, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import Link from 'next/link';
import { pricingConfig } from '@/website-config';

// Define Plan structure
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

export default function PricingSection() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  // Get pricing plans from website config
  const pricingPlans: PricingPlan[] = pricingConfig.oneTimePlans;

  // Handle upgrade button click
  const handleUpgradeClick = async (priceId: string, planKey: string) => {
    // Check if user is signed in
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    // Get user ID
    const userId = user?.id;
    if (!userId) {
      console.error("User is signed in but user ID is missing.");
      alert('Could not get user information. Please try refreshing the page.');
      return;
    }

    // Cache payment info to local storage
    const selectedPlan = pricingPlans.find(plan => plan.key === planKey);
    if (selectedPlan) {
      const paymentInfo = {
        planKey: planKey,
        price: selectedPlan.price,
        credits: selectedPlan.buttonText.match(/\d+/)?.[0] || '0',
        planTitle: selectedPlan.title,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));
    }

    setLoadingPlan(planKey);
    try {
      const data = await api.payment.createPaypalSession(priceId);

      const checkoutUrl = data?.data?.url || data?.url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        console.error('Payment session response missing URL:', data);
        alert('Checkout URL is missing. Please try again later.');
        setLoadingPlan(null);
      }

    } catch (error) {
      console.error('Error during subscription creation request:', error);
      if (error instanceof Error) {
        alert(error.message || 'An error occurred. Please try again later.');
      } else {
        alert('Network error. Please check your connection and try again.');
      }
      setLoadingPlan(null);
    } 
  };

  return (
    <section id="pricing" className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-foreground text-xl font-semibold mb-6">One-time Credits</div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-8xl mx-auto mb-16">
            {pricingPlans.map((plan) => {
              const isFree = plan.key === 'free';
              return (
                <div
                  key={plan.key}
                  className={cn(
                    'relative p-8 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-105',
                    plan.popular 
                      ? 'bg-card border-primary/50 shadow-2xl shadow-primary/20' 
                      : 'bg-card/80 border-border hover:border-primary/30'
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}

                  <div className="text-2xl font-bold text-foreground mb-4 text-center">
                    {plan.title}
                  </div>
      
                  <div className="text-center mb-8">
                    <span className="text-5xl font-bold text-foreground">
                      {plan.price}
                    </span>
                  </div>

                  <Button 
                    className={cn(
                      'w-full mb-8 py-3 font-semibold transition-all duration-200',
                      plan.popular
                        ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl'
                        : isFree
                          ? 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border'
                          : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border hover:border-primary/50'
                    )}
                    onClick={() => !isFree && handleUpgradeClick(plan.priceId, plan.key)}
                    disabled={loadingPlan === plan.key}
                  >
                    {loadingPlan === plan.key 
                      ? (
                          <span className="flex items-center justify-center">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </span>
                        )
                      : plan.buttonText
                    }
                  </Button>

                  <div className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <Check className={cn(
                            'w-5 h-5 mt-0.5 flex-shrink-0',
                            plan.popular ? 'text-primary' : 'text-muted-foreground'
                          )} />
                          <span className="text-muted-foreground leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust Badges */}
          <div className="mt-16 mb-12">
            <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
              {/* 7-Day Refund Guarantee */}
              <Link href="/refund" aria-label="Refund Policy" className="flex items-center gap-3 px-6 py-4 bg-card border border-border rounded-xl backdrop-blur-sm hover:border-primary/40 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-foreground font-semibold">7‑Day Refund</div>
                  <div className="text-muted-foreground text-sm">Money-back guarantee</div>
                </div>
              </Link>

              {/* Secure Payment by Stripe */}
              <div className="flex items-center gap-3 px-6 py-4 bg-card border border-border rounded-xl backdrop-blur-sm">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-foreground font-semibold">Secure Payment</div>
                  <div className="text-muted-foreground text-sm">Powered by Stripe</div>
                </div>
              </div>

              {/* 24/7 Support */}
              <div className="flex items-center gap-3 px-6 py-4 bg-card border border-border rounded-xl backdrop-blur-sm">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-foreground font-semibold">24/7 Support</div>
                  <div className="text-muted-foreground text-sm">Always here to help</div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional pricing info */}
          <div className="mt-8 text-center">
            <p className="text-foreground mb-4 ">
              Choose one-time credits or subscription • Flexible billing options
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span>✓ Choose one-time or subscription</span>
              <span>✓ Credits never expire</span>
              <span>✓ Secure payments</span>
              <span>✓ Email support</span>
            </div>
          </div>
      </div>
    </section>
  );
}
