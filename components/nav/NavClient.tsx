'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Menu, VideoIcon, MicIcon, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

// Loading spinner component
const LoadingSpinner = () => (
  <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Lazy load auth components
const NavAuthIsland = dynamic(() => import('./nav-auth-island'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-full border">
      <LoadingSpinner />
      <span className="text-sm text-muted-foreground">Loading</span>
    </div>
  ),
});

// Navigation link types
type NavLink = 
  | { href: string; label: string; type?: never; items?: never }
  | { type: 'dropdown'; label: string; items: Array<{ href: string; label: string; icon: React.ElementType }>; href?: never };

const navLinks: NavLink[] = [           
  { href: '/', label: 'Home' }, 
  {
    type: 'dropdown',
    label: 'Products',
    items: [
      { href: '/products/video-generator', label: 'Video Generator', icon: VideoIcon },
      { href: '/products/audio-generator', label: 'Audio Generator', icon: MicIcon },
      { href: '/products/image-generator', label: 'Image Generator', icon: ImageIcon },
    ],
  }

];

export function NavClient() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation - Centered */}
      <div className="hidden lg:flex flex-1 justify-center">
        <NavigationMenu>
          <NavigationMenuList>
            {navLinks.map((link, index) => {
              if (link.type === 'dropdown') {
                const isActive = link.items.some(item => pathname === item.href);
                return (
                  <NavigationMenuItem key={`dropdown-${index}`}>
                    <NavigationMenuTrigger 
                      className={cn(isActive && "text-primary")}
                    >
                      {link.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[240px] gap-1 p-2">
                        {link.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <li key={item.href}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={item.href}
                                  className={cn(
                                    "flex items-center gap-3 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors",
                                    "hover:text-primary focus:text-primary",
                                    pathname === item.href 
                                      ? "text-primary" 
                                      : "text-foreground"
                                  )}
                                >
                                  <Icon className="h-5 w-5" />
                                  <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          );
                        })}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              }
              
              return (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        pathname === link.href 
                          ? "text-primary" 
                          : "text-foreground/80"
                      )}
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Spacer - 占据中间空间，把右侧内容推到右边 */}
      <div className="flex-1 lg:hidden" />

      {/* Right Section */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
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
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-6">
              {navLinks.map((link, index) => {
                if (link.type === 'dropdown') {
                  return (
                    <div key={`dropdown-${index}`} className="border-t pt-4">
                      <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">
                        {link.label}
                      </div>
                      {link.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                              pathname === item.href
                                ? "text-primary"
                                : "text-foreground/60"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  );
                }
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                      pathname === link.href
                        ? "text-primary"
                        : "text-foreground/60"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
