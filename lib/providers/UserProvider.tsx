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
    isLoadingUserInfo: auth.status === 'loading' || auth.status === 'syncing',
    refreshUserInfo: auth.refreshUserInfo,
    clearUserState: auth.clearUserState,
  };
}
