'use client';

import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode, type LazyExoticComponent, type ComponentType } from 'react';
import { AuthSessionStore, type AuthAction } from '@/lib/auth/session-store';
import { AUTH_LOADING_MESSAGE, AUTH_UNAVAILABLE_MESSAGE, requireAuthorizedToken } from '@/lib/auth/request-guard';
import { useToast } from '@/components/ui/toast-provider';
import AuthErrorBoundary from './auth-error-boundary';
import type { AuthRuntimeProps } from './clerk-runtime';
import { watchAuthFailures } from '@/lib/auth/watch-failures';

const AuthContext = createContext<ReturnType<typeof useAuthValue> | null>(null);

function useAuthValue(store: AuthSessionStore, retry: () => void) {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const { error: showError } = useToast();
  const perform = useCallback((action: AuthAction) => {
    void store.run(action).catch(error => {
      if (store.getSnapshot().status !== 'signed-out' || action !== 'signOut') showError(error instanceof Error ? error.message : AUTH_UNAVAILABLE_MESSAGE);
    });
  }, [store, showError]);
  return {
    ...snapshot,
    isLoaded: snapshot.status !== 'loading' && snapshot.status !== 'syncing',
    isSignedIn: snapshot.status === 'signed-in',
    userId: snapshot.status === 'signed-in' ? snapshot.user?.id : undefined,
    openSignIn: () => perform('openSignIn'),
    openSignUp: () => perform('openSignUp'),
    closeAuth: () => perform('closeAuth'),
    signOut: () => perform('signOut'),
    refreshUserInfo: async () => { try { await store.run('refreshUserInfo'); } catch { showError(AUTH_UNAVAILABLE_MESSAGE); } },
    clearUserState: store.clear,
    reportFailure: store.fail,
    retry,
    requireAuth: () => {
      const state = store.getSnapshot();
      if (state.status === 'signed-in') {
        try { requireAuthorizedToken(); return true; } catch (error) { store.fail(error); }
      } else if (state.status === 'signed-out') {
        perform('openSignIn');
        return false;
      }
      showError(state.status === 'loading' || state.status === 'syncing' ? AUTH_LOADING_MESSAGE : AUTH_UNAVAILABLE_MESSAGE);
      return false;
    },
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => new AuthSessionStore());
  const [runtime, setRuntime] = useState<{ Component: LazyExoticComponent<ComponentType<AuthRuntimeProps>>; attempt: number } | null>(null);
  const attemptRef = useRef(0);
  const resetScriptsRef = useRef<() => void>(() => {});
  const retry = useCallback(() => {
    resetScriptsRef.current();
    document.querySelectorAll('script[data-app-auth-failed]').forEach(script => script.remove());
    const attempt = store.start();
    attemptRef.current = attempt;
    // A fresh lazy component also permits a failed module import to be retried.
    setRuntime({ Component: lazy(() => import('./clerk-runtime')), attempt });
  }, [store]);
  const value = useAuthValue(store, retry);

  useEffect(() => {
    const watcher = watchAuthFailures({ getAttempt: () => attemptRef.current, fail: store.fail });
    resetScriptsRef.current = watcher.reset;
    retry();
    return () => {
      watcher.dispose();
      resetScriptsRef.current = () => {};
      store.stop(attemptRef.current);
    };
  }, [store, retry]);

  const Runtime = runtime?.Component;
  return (
    <AuthContext.Provider value={value}>
      {children}
      {Runtime && runtime && value.status !== 'unavailable' && (
        <AuthErrorBoundary key={runtime.attempt} name="ClerkRuntime" onError={error => store.fail(error, runtime.attempt)}>
          <Suspense fallback={null}>
            <Runtime store={store} attempt={runtime.attempt} />
          </Suspense>
        </AuthErrorBoundary>
      )}
    </AuthContext.Provider>
  );
}

export function useAppAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAppAuth must be used within AuthProvider');
  return context;
}
