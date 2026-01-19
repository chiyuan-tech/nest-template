'use client';

import dynamic from 'next/dynamic';

// Dynamically import PricingSection for code splitting
const DynamicPricingSection = dynamic(() => import('./PricingSection'), {
  loading: () => <div className="h-96 animate-pulse bg-muted/10 rounded-lg" />,
});

interface PricingSectionWithHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function PricingSectionWithHeader({
  title = 'Choose Your Perfect Plan',
  subtitle = 'All plans include HD image download and fast AI generation.',
}: PricingSectionWithHeaderProps) {
  return (
    <section id="pricing" className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Pricing Section Content */}
        <DynamicPricingSection hideSection hideHeader />
      </div>
    </section>
  );
}
