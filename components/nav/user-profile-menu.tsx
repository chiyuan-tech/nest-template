'use client';

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppAuth } from '@/components/auth/auth-provider';
import type { AuthUser } from '@/lib/auth/types';
import Link from "next/link";
import { useCallback, useState } from "react";
import FastMenu from "@/components/profile/FastMenu";

interface UserProfileMenuProps {
  user: AuthUser;
}

export default function UserProfileMenu({ user }: UserProfileMenuProps) {
  const { signOut, reportFailure } = useAppAuth();
  const [pathname, setPathname] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`;

  const readPathnameOnce = useCallback(() => {
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
  }, []);

  const handleSignOut = (close: () => void) => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    close();
    signOut();
  };


  // 预热函数：供触发器 pointer 事件使用
  // 从 auth-button 的模块级缓存中读取并触发（允许重复调用）
  const prewarm = () => {
    try {
      // 动态导入即可触发模块缓存
      void import('./user-profile-menu').catch(reportFailure);
    } catch {}
  };

  return (
    <>
      <FastMenu
        align="end"
        trigger={() => (
          <Button 
            variant="ghost" 
            className="relative h-8 w-8 rounded-full"
            onPointerEnter={prewarm}
            onPointerDown={prewarm}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={user.imageUrl} 
                alt={user.username || ''} 
                width={32}
                height={32}
                loading="lazy"
                decoding="async"
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        )}
      >
        {(close) => (
          <div className="p-1" onLoad={readPathnameOnce}>
            <div className="px-3 py-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.fullName || user.username}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
            <div className="h-px bg-border my-1" />
            <button
              className={`flex w-full items-center px-2 py-2 text-sm rounded-md hover:bg-muted ${
                pathname === `/profile` ? 'bg-muted font-semibold' : ''
              }`}
              onClick={close}
            >
              <Link href={`/profile`} prefetch={false} className="w-full text-left">
                Profile
              </Link>
            </button>
            <div className="h-px bg-border my-1" />
            <button
              className="flex w-full items-center px-2 py-2 text-sm rounded-md hover:bg-muted"
              disabled={isSigningOut}
              onClick={() => handleSignOut(close)}
            >
              Sign Out
            </button>
          </div>
        )}
      </FastMenu>
    </>
  );
}
