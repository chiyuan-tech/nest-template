'use client';

import { AUTH_UNAVAILABLE_MESSAGE } from '@/lib/auth/request-guard';
import { useAppAuth } from './auth-provider';

export function AuthUnavailable() {
  const { retry } = useAppAuth();
  return (
    <div role="status" className="flex max-w-[140px] flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground sm:max-w-[220px]">
      <span>{AUTH_UNAVAILABLE_MESSAGE}</span>
      <button type="button" onClick={retry} className="rounded-full bg-secondary px-3 py-1 text-foreground hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary active:scale-[0.98]">
        重试
      </button>
    </div>
  );
}
