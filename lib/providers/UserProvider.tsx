'use client';

import type { ReactNode } from 'react';
import { useAppAuth } from '@/components/auth/auth-provider';
export type { UserInfo } from '@/lib/auth/types';

// Compatibility facade for existing consumers of the application user interface.
export function UserProvider({ children }: { children: ReactNode }) { return children; }

export function useUserInfo() {
  const auth = useAppAuth();
  return {
    userInfo: auth.userInfo,
    isLoadingUserInfo: !auth.isLoaded || auth.userInfoStatus === 'loading',
    userInfoStatus: auth.userInfoStatus,
    refreshUserInfo: auth.refreshUserInfo,
    clearUserState: auth.clearUserState,
  };
}
