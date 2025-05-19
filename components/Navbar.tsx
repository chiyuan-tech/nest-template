'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import AuthButton from './auth/auth-button';
import { ChevronDown, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHomePage = pathname === '/';

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleMobileLinkClick = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
  };

  const renderNavLinks = (isMobile = false) => (
    <>
        <Link
            href="/"
            className={`block w-full text-left rounded-md ${pathname === '/' ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'} ${isMobile ? 'px-4 py-3 text-base' : 'px-4 py-2 font-nunito whitespace-nowrap'}`}
        >
          Home
        </Link>

        <Link
            href="/blog"
            className={`block w-full text-left rounded-md ${pathname.startsWith(`/blog`) ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'} ${isMobile ? 'px-4 py-3 text-base' : 'px-4 py-2 font-nunito whitespace-nowrap'}`}
        >
          Blog
        </Link>
    </>
  );

  return (
    <nav className="py-4 px-6 bg-white border-b border-muted shadow-custom sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left: Logo (ensure it doesn't shrink) */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="text-xl font-bold font-fredoka text-primary">
              PolaToons
            </span>
          </Link>
        </div>
        
        {/* Middle: Desktop Nav Links (Centered) */}
        <div className="hidden lg:flex justify-center flex-grow">
           <div className="flex items-center space-x-6 flex-nowrap">
             {renderNavLinks(false)}
           </div>
        </div>
        
        {/* Right Section (ensure it doesn't shrink) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Desktop: Auth Button Group */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Auth Button (Desktop) */}
            <AuthButton />
          </div>

          {/* Mobile: Auth Button + Menu Trigger Group */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Auth Button (Mobile) */}
            <AuthButton />
            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground hover:text-primary hover:bg-muted">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[340px] px-6 pt-12 pb-8 bg-background flex flex-col">
                <SheetHeader className="mb-4 text-left">
                  <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex-1 flex flex-col space-y-2 mb-8 overflow-y-auto">
                    <SheetClose asChild>
                        <Link
                            href="/"
                            className={`block w-full text-left rounded-md ${pathname === '/' ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'} px-4 py-3 text-base`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Home
                        </Link>
                    </SheetClose>
                    <SheetClose asChild>
                        <Link
                            href="/blog"
                            className={`block w-full text-left rounded-md ${pathname.startsWith(`/blog`) ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'} px-4 py-3 text-base`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Blog
                        </Link>
                    </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
} 