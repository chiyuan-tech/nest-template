import React from 'react';
import Link from 'next/link';
import { NavClient } from './nav/NavClient';
import { siteConfig } from '@/website-config';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border shadow-xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="w-[180px] 2xl:w-[200px] flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-poppins text-xl font-bold text-primary">
                {siteConfig.name}
              </span>
            </Link>
          </div>

          {/* Middle & Right: Client-side interactive parts */}
          <NavClient />
        </div>
      </div>
    </nav>
  );
}
