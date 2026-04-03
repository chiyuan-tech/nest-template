'use client';

import React, { createContext, useCallback, useContext, useMemo, startTransition } from 'react';
import { useClerk } from '@clerk/nextjs';

type View = 'signin' | 'signup' | 'verify-email';

interface AuthModalContextValue {
  openAuthModal: (initialView?: View) => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue>({
  openAuthModal: () => {},
  closeAuthModal: () => {},
});

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const { openSignIn, openSignUp, closeSignIn, closeSignUp } = useClerk();

  const openAuthModal = useCallback(
    (view: View = 'signin') => {
      requestAnimationFrame(() => {
        startTransition(() => {
          if (view === 'signup') {
            openSignUp();
          } else {
            openSignIn();
          }
        });
      });
    },
    [openSignIn, openSignUp],
  );

  const closeAuthModal = useCallback(() => {
    closeSignIn();
    closeSignUp();
  }, [closeSignIn, closeSignUp]);

  const value = useMemo<AuthModalContextValue>(
    () => ({ openAuthModal, closeAuthModal }),
    [openAuthModal, closeAuthModal],
  );

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;
}

export function useAuthModal(): AuthModalContextValue {
  return useContext(AuthModalContext);
}
