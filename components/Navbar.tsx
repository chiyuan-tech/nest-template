import React from 'react';
import Link from 'next/link';
import { NavClient } from './nav/NavClient';
import { siteConfig } from '@/website-config';

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-5">
        {/* Logo */}
        <Link href="/" className="mr-6 flex flex-shrink-0 items-center gap-2">
          <span className="h-7 w-7 rounded-full bg-primary text-center text-sm font-semibold leading-7 text-primary-foreground">F</span>
          <span className="font-poppins text-[15px] font-medium tracking-[-0.15px] text-foreground">
            {siteConfig.name}
          </span>
        </Link>

        {/* Navigation */}
        <NavClient />
      </div>
    </header>
  );
}
