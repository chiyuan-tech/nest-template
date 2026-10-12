'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavAuthIsland from './nav-auth-island';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

// Navigation link types
type NavLink = { href: string; label: string };

const navLinks: NavLink[] = [           
  { href: '/', label: 'Home' },
  { href: '/#pricing', label: 'Pricing' },
];

export function NavClient() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation - Centered */}
      <div className="hidden flex-1 justify-start lg:flex">
        <NavigationMenu>
          <NavigationMenuList className="gap-6">
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm font-medium tracking-[-0.14px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground",
                      pathname === link.href && "text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Spacer - 占据中间空间，把右侧内容推到右边 */}
      <div className="flex-1 lg:hidden" />

      {/* Right Section */}
      <div className="ml-auto flex flex-shrink-0 items-center gap-2">
        {/* Auth - 桌面端和移动端都显示 */}
        <div className="hidden lg:flex">
          <NavAuthIsland variant="desktop" />
        </div>
        <div className="flex lg:hidden">
          <NavAuthIsland variant="mobile" />
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="secondary" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] bg-background sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block py-2 text-left text-sm font-medium tracking-[-0.14px] text-muted-foreground transition-colors hover:text-foreground",
                    pathname === link.href && "text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
