'use client';

import { useUser } from '@clerk/nextjs';
import { lazy, Suspense, useEffect, useState } from 'react';

const GoogleOneTap = lazy(() =>
  import('@clerk/nextjs').then((mod) => ({ default: mod.GoogleOneTap }))
);

interface GoogleOneTapAuthProps {
  cancelOnTapOutside?: boolean;
  itpSupport?: boolean;
  fedCmSupport?: boolean;
  signInForceRedirectUrl?: string;
  signUpForceRedirectUrl?: string;
}

export default function GoogleOneTapAuth({
  cancelOnTapOutside = true,
  itpSupport = true,
  fedCmSupport = false,
  signInForceRedirectUrl,
  signUpForceRedirectUrl,
}: GoogleOneTapAuthProps) {
  const { isSignedIn } = useUser();
  const [isMounted, setIsMounted] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isSignedIn || !isMounted) {
      setShow(false);
      return;
    }

    let cancelled = false;
    let idleCallbackId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const loadGoogleOneTap = () => {
      if (!cancelled) {
        setShow(true);
      }
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleCallbackId = window.requestIdleCallback(loadGoogleOneTap, { timeout: 1500 });
    } else {
      timeoutId = setTimeout(loadGoogleOneTap, 1500);
    }

    return () => {
      cancelled = true;
      if (
        idleCallbackId !== undefined &&
        typeof window !== 'undefined' &&
        'cancelIdleCallback' in window
      ) {
        window.cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [isSignedIn, isMounted]);

  if (isSignedIn || !isMounted || !show) {
    return null;
  }

  const googleOneTapProps: Record<string, unknown> = {
    cancelOnTapOutside,
    itpSupport,
    fedCmSupport,
  };

  if (signInForceRedirectUrl) {
    googleOneTapProps.signInForceRedirectUrl = signInForceRedirectUrl;
  }
  if (signUpForceRedirectUrl) {
    googleOneTapProps.signUpForceRedirectUrl = signUpForceRedirectUrl;
  }

  return (
    <Suspense fallback={null}>
      <GoogleOneTap {...googleOneTapProps} />
    </Suspense>
  );
}
