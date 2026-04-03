'use client';

import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { SignInButton, SignUpButton } from '@clerk/nextjs';

const SIGN_IN_TRIGGER_ID = '__auth_modal_sign_in_trigger';
const SIGN_UP_TRIGGER_ID = '__auth_modal_sign_up_trigger';

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
  const openAuthModal = useCallback((initialView: View = 'signin') => {
    requestAnimationFrame(() => {
      const id = initialView === 'signup' ? SIGN_UP_TRIGGER_ID : SIGN_IN_TRIGGER_ID;
      document.getElementById(id)?.click();
    });
  }, []);

  const closeAuthModal = useCallback(() => {}, []);

  const value = useMemo<AuthModalContextValue>(
    () => ({ openAuthModal, closeAuthModal }),
    [openAuthModal, closeAuthModal]
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <div className="fixed left-0 top-0 -z-[1] h-px w-px overflow-hidden opacity-0" aria-hidden>
        <SignInButton mode="modal">
          <button id={SIGN_IN_TRIGGER_ID} type="button" tabIndex={-1} className="sr-only">
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button id={SIGN_UP_TRIGGER_ID} type="button" tabIndex={-1} className="sr-only">
            Sign up
          </button>
        </SignUpButton>
      </div>
    </AuthModalContext.Provider>
  );
}

export function useAuthModal(): AuthModalContextValue {
  return useContext(AuthModalContext);
}
