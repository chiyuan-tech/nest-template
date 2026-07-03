import React from 'react';
import Link from 'next/link';
import { NavClient } from './nav/NavClient';
import { siteConfig } from '@/website-config';

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-5">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center rounded-full border border-white/70 bg-white/90 px-5 shadow-nav backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:px-8">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2 flex-shrink-0">
          <span className="font-poppins text-xl font-bold tracking-[-0.02em] text-foreground">
            {siteConfig.name}
          </span>
        </Link>

        {/* Navigation */}
        <NavClient />
      </div>
    </header>
  );
}
