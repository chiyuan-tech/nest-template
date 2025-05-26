'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import AuthButton from './auth/auth-button';
import { ChevronDown, Menu, Coins } from 'lucide-react';
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
import { useUser } from '@clerk/nextjs';
import { cn } from '../lib/utils';
import { api } from '../lib/api';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isSignedIn } = useUser();
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [isLoadingCredits, setIsLoadingCredits] = useState(false);
  const isHomePage = pathname === '/';

  // 获取用户积分信息 - 等待token可用后再调用
  useEffect(() => {
    const fetchUserCredits = async () => {
      if (!isSignedIn || !user?.id) {
        setUserCredits(null);
        return;
      }
      
      // 检查token是否可用
      if (!api.auth.isTokenValid()) {
        console.log('Token not available yet, waiting...');
        return;
      }
      
      setIsLoadingCredits(true);
      try {
        const result = await api.user.getUserInfo();
        
        if (result.code === 200 && result.data) {
          setUserCredits(result.data.free_limit + result.data.remaining_limit);
        } else {
          console.warn("User info API returned success code but no data for:", user.id);
          setUserCredits(null);
        }
      } catch (error) {
        console.error("Failed to fetch user credits:", error);
        setUserCredits(null);
      } finally {
        setIsLoadingCredits(false);
      }
    };

    // 延迟获取积分信息，给auth接口时间完成
    const delayedFetch = () => {
      if (isSignedIn && user?.id) {
        // 检查token，如果没有则等待
        const checkTokenAndFetch = () => {
          if (api.auth.isTokenValid()) {
            fetchUserCredits();
          } else {
            // 如果token还没准备好，1秒后重试
            setTimeout(checkTokenAndFetch, 1000);
          }
        };
        
        // 首次尝试
        checkTokenAndFetch();
      }
    };

    // 首次加载获取用户积分
    delayedFetch();
    
    // 设置定时器，每60秒更新一次用户积分
    const intervalId = setInterval(() => {
      if (isSignedIn && api.auth.isTokenValid()) {
        fetchUserCredits();
      }
    }, 60000);
    
    // 组件卸载时清除定时器
    return () => clearInterval(intervalId);
  }, [isSignedIn, user?.id]);

  // 处理URL hash变化时的滚动逻辑
  useEffect(() => {
    // 当路径变为首页且包含hash时，滚动到对应元素
    if (pathname === '/' && typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.substring(1); // 移除#号
        // 使用setTimeout确保页面内容已加载
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }, [pathname]);

  const scrollToSection = (id: string) => {
    if (pathname === '/') {
      // 如果已经在首页，直接滚动到目标元素
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // 如果不在首页，先导航到首页，然后滚动到目标元素
      router.push(`/#${id}`);
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
            className={cn(
              'nav-link-item px-4 py-2 rounded-md transition-colors',
              pathname === '/' ? 'text-primary font-medium' : 'text-foreground/80 hover:text-primary'
            )}
        >
          Home
        </Link>

        <a
          href="#how-it-works"
          className={cn(
            'nav-link-item px-4 py-2 rounded-md transition-colors',
            pathname === '/' ? 'text-foreground/80 hover:text-primary' : 'text-foreground/80 hover:text-primary'
          )}
          onClick={e => {
            e.preventDefault();
            scrollToSection('how-it-works');
          }}
        >
          How It Works
        </a>

        <a
          href="#features"
          className={cn(
            'nav-link-item px-4 py-2 rounded-md transition-colors',
            pathname === '/' ? 'text-foreground/80 hover:text-primary' : 'text-foreground/80 hover:text-primary'
          )}
          onClick={e => {
            e.preventDefault();
            scrollToSection('features');
          }}
        >
          Features
        </a>

        <a
          href="#pricing"
          className={cn(
            'nav-link-item px-4 py-2 rounded-md transition-colors',
            pathname === '/' ? 'text-foreground/80 hover:text-primary' : 'text-foreground/80 hover:text-primary'
          )}
          onClick={e => {
            e.preventDefault();
            scrollToSection('pricing');
          }}
        >
          Pricing
        </a>

        <a
          href="#faq"
          className={cn(
            'nav-link-item px-4 py-2 rounded-md transition-colors',
            pathname === '/' ? 'text-foreground/80 hover:text-primary' : 'text-foreground/80 hover:text-primary'
          )}
          onClick={e => {
            e.preventDefault();
            scrollToSection('faq');
          }}
        >
          FAQ
        </a>

        <Link
            href="/blog"
            className={cn(
              'nav-link-item px-4 py-2 rounded-md transition-colors',
              pathname.startsWith(`/blog`) ? 'text-primary font-medium' : 'text-foreground/80 hover:text-primary'
            )}
        >
          Blog
        </Link>
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background shadow-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="w-[180px] 2xl:w-[200px] flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="font-fredoka text-xl font-bold text-primary">
                QuickMedCert
              </span>
            </Link>
          </div>
          
          {/* Middle: Desktop Nav Links */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-1">
              {renderNavLinks(false)}
            </div>
          </div>
          
          {/* Right Section */}
          <div className="w-[180px] 2xl:w-[200px] flex items-center justify-end gap-2">
            {/* Desktop: Auth Button */}
            <div className="hidden md:flex items-center gap-4">
              {/* 用户积分显示 */}
              {isSignedIn && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Coins className="h-4 w-4" />
                  <span>
                    {isLoadingCredits ? '...' : userCredits !== null ? userCredits : '0'}
                  </span>
                </div>
              )}
              <AuthButton />
            </div>

            {/* Mobile: Auth Button + Menu */}
            <div className="flex md:hidden items-center gap-2">
              {/* 移动端用户积分显示 */}
              {isSignedIn && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Coins className="h-3 w-3" />
                  <span>
                    {isLoadingCredits ? '...' : userCredits !== null ? userCredits : '0'}
                  </span>
                </div>
              )}
              <AuthButton />
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-foreground hover:text-primary hover:bg-muted">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[340px] px-6 pt-12 pb-8 bg-background">
                  <SheetHeader className="mb-4 text-left">
                    <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col space-y-4">
                    <SheetClose asChild>
                      {renderNavLinks(true)}
                    </SheetClose>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 