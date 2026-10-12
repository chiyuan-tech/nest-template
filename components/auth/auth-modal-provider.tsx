'use client';

import type { ReactNode } from 'react';
import { useAppAuth } from './auth-provider';

// Compatibility facade; Clerk modal commands live in the isolated runtime.
export function AuthModalProvider({ children }: { children: ReactNode }) { return children; }

export function useAuthModal() {
  const { openSignIn, openSignUp, closeAuth } = useAppAuth();
  return {
    openAuthModal: (view: 'signin' | 'signup' | 'verify-email' = 'signin') => view === 'signup' ? openSignUp() : openSignIn(),
    closeAuthModal: closeAuth,
  };
}
