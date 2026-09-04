'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import type { UserResource } from '@clerk/types';
import { Button } from '../../components/ui/button';
import { ComponentType, useEffect, useState } from 'react';

type UserMenuComponent = ComponentType<{ user: UserResource }>;

let CachedUserMenu: UserMenuComponent | null = null;
let prewarmPromise: Promise<UserMenuComponent | null> | null = null;

function loadUserMenu(): Promise<UserMenuComponent | null> {
  if (CachedUserMenu) {
    return Promise.resolve(CachedUserMenu);
  }
  if (prewarmPromise) {
    return prewarmPromise;
  }

  prewarmPromise = import('../nav/user-profile-menu')
    .then((m) => {
      CachedUserMenu = m.default;
      return CachedUserMenu;
    })
    .catch((error) => {
      console.warn('[AuthButton] Failed to load user-profile-menu:', error);
      prewarmPromise = null;
      return null;
    });

  return prewarmPromise;
}

function schedulePrewarm() {
  if (CachedUserMenu || prewarmPromise) return;

  const run = () => {
    void loadUserMenu();
  };

  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(run, { timeout: 1200 });
  } else {
    setTimeout(run, 1200);
  }
}

function AuthSkeleton() {
  return (
    <div className="h-10 w-24 animate-pulse rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200">
      <div className="h-full w-full rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </div>
  );
}

export default function AuthButton() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const [UserMenu, setUserMenu] = useState<UserMenuComponent | null>(
    () => CachedUserMenu
  );
  const [menuLoadFailed, setMenuLoadFailed] = useState(false);

  useEffect(() => {
    schedulePrewarm();
  }, []);

  useEffect(() => {
    if (!isSignedIn || UserMenu) return;

    let cancelled = false;
    void loadUserMenu().then((mod) => {
      if (cancelled) return;
      if (mod) {
        setUserMenu(() => mod);
        setMenuLoadFailed(false);
      } else {
        setMenuLoadFailed(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isSignedIn, UserMenu]);

  if (!isLoaded) {
    return <AuthSkeleton />;
  }

  if (isSignedIn && user) {
    if (UserMenu) {
      return <UserMenu user={user} />;
    }
    if (menuLoadFailed) {
      return <AuthSkeleton />;
    }
    return <AuthSkeleton />;
  }

  const handleLoginClick = () => {
    requestAnimationFrame(() => {
      openSignIn({
        oauthFlow: 'popup',
        fallbackRedirectUrl: '/',
        signUpFallbackRedirectUrl: '/',
      });
    });
  };

  return (
    <Button
      variant="default"
      className="cursor-pointer bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
      onClick={handleLoginClick}
    >
      Login
    </Button>
  );
}
