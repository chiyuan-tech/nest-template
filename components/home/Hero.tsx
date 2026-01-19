'use client';

import dynamic from 'next/dynamic';
import { siteConfig } from '@/website-config';

// Dynamically import the generator component for code splitting
const Generator = dynamic(() => import('@/components/generator-common/generator'), {
  loading: () => (
    <div className="w-full">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-muted/30 rounded-xl border border-border/50 p-4 lg:p-6">
          <div className="lg:col-span-12">
            <div className="h-96 animate-pulse bg-muted/10 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  ),
  ssr: false,
});

export default function Hero() {
  return (
    <div className="w-full py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center space-y-3 max-w-8xl mx-auto pt-2 pb-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-primary to-purple-500 bg-clip-text text-transparent drop-shadow-lg leading-tight pb-1">
            {siteConfig.name} AI Video Generator
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {siteConfig.description}. Create stunning videos with superior temporal consistency, smoother motion synthesis, and enhanced visual quality.
          </p>
        </div>

        {/* Generator Component */}
        <Generator />
      </div>
    </div>
  );
}
