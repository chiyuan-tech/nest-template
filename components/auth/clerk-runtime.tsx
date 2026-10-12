'use client';

import { AuthenticateWithRedirectCallback, useAuth, useClerk, useUser } from '@clerk/nextjs';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { AUTH_TIMEOUT_MS, AuthSessionStore, withAuthTimeout, type AuthOperation } from '@/lib/auth/session-store';
import type { AuthUser, UserInfo } from '@/lib/auth/types';
import { VoucherToast } from '@/components/ui/voucher-toast';
import ClerkProviderWithLocale from './clerk-provider';
import GoogleOneTapAuth from './google-one-tap';

export interface AuthRuntimeProps { store: AuthSessionStore; attempt: number }

function normalizeProfile(data: UserInfo): UserInfo {
  return { ...data, total_credits: Number(data.free_limit) + Number(data.remaining_limit), free_times: Number(data.free_times) || 0 };
}

function AuthBridge({ store, attempt }: AuthRuntimeProps) {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  const { getToken, sessionId, isLoaded: authLoaded } = useAuth();
  const clerk = useClerk();
  const tokenRef = useRef(getToken);
  tokenRef.current = getToken;
  const operationRef = useRef<AuthOperation | null>(null);
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const [voucherCount, setVoucherCount] = useState(0);
  const voucherUserRef = useRef<string | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const onStatus = (status: typeof clerk.status) => {
      if (status === 'error' || status === 'degraded') store.fail(new Error('Clerk initialization failed'), attempt);
    };
    clerk.on('status', onStatus, { notify: true });
    return () => clerk.off('status', onStatus);
  }, [store, attempt, clerk]);

  useEffect(() => {
    if (pathname !== '/sso-callback') return;
    const timer = setTimeout(() => store.fail(new Error('Authentication callback timed out'), attempt), AUTH_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [store, attempt, pathname]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ivcode = params.get('i') || params.get('ivcode');
      if (ivcode) localStorage.setItem('pending_ivcode', ivcode);
    } catch (error) { store.fail(error, attempt); }
  }, [store, attempt]);

  useEffect(() => {
    if (!authLoaded || !userLoaded || !store.isAttempt(attempt)) return;
    if (!isSignedIn || !user) {
      operationRef.current = null;
      voucherUserRef.current = null;
      setVoucherCount(0);
      store.signedOut(attempt);
      return;
    }
    const appUser: AuthUser = {
      id: user.id, firstName: user.firstName, lastName: user.lastName,
      fullName: user.fullName, username: user.username, imageUrl: user.imageUrl,
      primaryEmailAddress: user.primaryEmailAddress ? { emailAddress: user.primaryEmailAddress.emailAddress } : null,
    };
    const operation = store.beginSync(attempt, appUser);
    if (!operation) return;
    operationRef.current = operation;
    const sync = async () => {
      const token = await withAuthTimeout(tokenRef.current(), operation.signal);
      if (!store.isCurrent(operation)) return;
      if (!token || !appUser.primaryEmailAddress) throw new Error('Missing authentication credentials');
      const ivcode = localStorage.getItem('pending_ivcode');
      const result = await api.auth.syncUser({
        uuid: appUser.id, email: appUser.primaryEmailAddress.emailAddress,
        nickname: appUser.fullName || undefined, avatar: appUser.imageUrl || undefined,
        from_login: 'google', token, ivcode: ivcode || undefined,
      }, operation.signal);
      if (!store.isCurrent(operation)) return;
      if (result.code !== 200 || !result.data?.access_token) throw new Error('User synchronization failed');
      const profile = await api.auth.getBootstrapProfile(result.data.access_token, operation.signal);
      if (!store.isCurrent(operation)) return;
      if (profile.code !== 200 || !profile.data) throw new Error('User profile unavailable');
      if (store.completeSync(operation, normalizeProfile(profile.data), result.data) && ivcode) {
        localStorage.removeItem('pending_ivcode');
      }
    };
    void sync().catch(error => { if (store.isCurrent(operation)) store.fail(error, attempt); });
    return () => { store.cancel(operation); };
    // Identity/session changes invalidate pending work, including account switches.
    // Clerk user resources change identity during polling; do not resync for each object update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store, attempt, authLoaded, userLoaded, isSignedIn, user?.id, sessionId]);

  useEffect(() => {
    let refreshing = false;
    const refreshUserInfo = async () => {
      const operation = operationRef.current;
      if (!operation || !store.isCurrent(operation) || store.getSnapshot().status !== 'signed-in' || refreshing) return;
      refreshing = true;
      try {
        const result = await withAuthTimeout(api.user.getUserInfo(operation.signal), operation.signal);
        if (!store.isCurrent(operation)) return;
        if (result.code !== 200 || !result.data) throw new Error('User profile unavailable');
        store.updateProfile(operation, normalizeProfile(result.data));
      } catch (error) {
        if (store.isCurrent(operation)) { store.fail(error, attempt); throw error; }
      } finally { refreshing = false; }
    };
    const unregister = store.register(attempt, {
      openSignIn: () => clerk.openSignIn({ oauthFlow: 'popup', fallbackRedirectUrl: '/', signUpFallbackRedirectUrl: '/' }),
      openSignUp: () => clerk.openSignUp({ oauthFlow: 'popup', fallbackRedirectUrl: '/', signInFallbackRedirectUrl: '/' }),
      closeAuth: () => { clerk.closeSignIn(); clerk.closeSignUp(); },
      signOut: () => clerk.signOut(),
      refreshUserInfo,
    });
    const interval = setInterval(() => { void refreshUserInfo().catch(() => {}); }, 30000);
    return () => { clearInterval(interval); unregister(); };
  }, [store, attempt, clerk]);

  useEffect(() => {
    const info = snapshot.userInfo;
    if (snapshot.status === 'signed-in' && info && info.level <= 0 && info.free_times > 0 && voucherUserRef.current !== info.uuid) {
      voucherUserRef.current = info.uuid;
      setVoucherCount(info.free_times);
    }
  }, [snapshot]);

  const requestedRedirect = searchParams.get('redirect_url');
  const redirectUrl = requestedRedirect?.startsWith('/') && !requestedRedirect.startsWith('//') && !requestedRedirect.includes('\\') ? requestedRedirect : '/';
  return (
    <>
      {pathname === '/sso-callback' && authLoaded && userLoaded && (
        <AuthenticateWithRedirectCallback signInForceRedirectUrl={redirectUrl} signUpForceRedirectUrl={redirectUrl} />
      )}
      {pathname === '/' && process.env.NODE_ENV === 'production' && authLoaded && userLoaded && !isSignedIn && (
        <GoogleOneTapAuth cancelOnTapOutside fedCmSupport={false} signInForceRedirectUrl="/" signUpForceRedirectUrl="/" onError={error => store.fail(error, attempt)} />
      )}
      {voucherCount > 0 && snapshot.status === 'signed-in' && <VoucherToast count={voucherCount} onClose={() => setVoucherCount(0)} />}
    </>
  );
}

// This tree is a sibling of the public page. Clerk can only replace this subtree.
export default function ClerkRuntime(props: AuthRuntimeProps) {
  return <ClerkProviderWithLocale><AuthBridge {...props} /></ClerkProviderWithLocale>;
}
