import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NavClient } from './nav/NavClient';
import { siteConfig } from '@/website-config';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2 flex-shrink-0">
          <Image src="/logo.webp" alt="" width={32} height={32} className="h-8 w-8 rounded-md object-contain" priority />
          <span className="font-poppins text-xl font-bold text-primary">
            {siteConfig.name}
          </span>
        </Link>

        {/* Navigation */}
        <NavClient />
      </div>
    </header>
  );
}
