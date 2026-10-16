import type { AuthSnapshot, AuthUser, BackendTokens, UserInfo } from './types';
import { AUTH_LOADING_MESSAGE, AUTH_UNAVAILABLE_MESSAGE, grantRequestAuthorization, revokeRequestAuthorization } from './request-guard';

export const AUTH_TIMEOUT_MS = 15000;
// Loading a third-party SDK includes connection setup and download time.
// Keep backend operations on the shorter deadline.
export const AUTH_LOAD_TIMEOUT_MS = 30000;
export class AuthLoadError extends Error {}
export type AuthAction = 'openSignIn' | 'openSignUp' | 'closeAuth' | 'signOut' | 'refreshUserInfo';
type Commands = Record<AuthAction, () => unknown | Promise<unknown>>;
export type AuthOperation = { revision: number; signal: AbortSignal; user: AuthUser };

export function withAuthTimeout<T>(work: Promise<T>, signal: AbortSignal, timeout = AUTH_TIMEOUT_MS): Promise<T> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal.removeEventListener('abort', abort);
      callback();
    };
    const abort = () => finish(() => reject(new DOMException('Auth operation cancelled', 'AbortError')));
    const timer = setTimeout(() => finish(() => reject(new Error('Authentication timed out'))), timeout);
    // Always observe the work, even when the signal was already aborted.
    work.then(value => finish(() => resolve(value)), error => finish(() => reject(error)));
    if (signal.aborted) abort();
    else signal.addEventListener('abort', abort, { once: true });
  });
}

export class AuthSessionStore {
  private snapshot: AuthSnapshot = { status: 'loading', user: null, userInfo: null };
  private listeners = new Set<() => void>();
  private attempt = 0;
  private revision = 0;
  private controller = new AbortController();
  private commands: Commands | null = null;
  private deadline: ReturnType<typeof setTimeout> | undefined;
  private expiry: ReturnType<typeof setTimeout> | undefined;
  private loadFailure = false;

  canRetryLoad = () => this.snapshot.status === 'unavailable' && this.loadFailure;

  getSnapshot = () => this.snapshot;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  private publish(snapshot: AuthSnapshot) {
    this.snapshot = snapshot;
    this.listeners.forEach(listener => listener());
  }
  private invalidate() {
    this.revision++;
    this.controller.abort();
    this.controller = new AbortController();
    clearTimeout(this.deadline);
    clearTimeout(this.expiry);
    revokeRequestAuthorization();
    if (typeof window !== 'undefined') {
      try {
        ['access_token', 'refresh_token', 'token_expire_at'].forEach(key => localStorage.removeItem(key));
      } catch { /* In-memory authorization is already revoked if storage is blocked. */ }
    }
  }
  start = () => {
    this.invalidate();
    this.loadFailure = false;
    this.attempt++;
    this.commands = null;
    this.publish({ status: 'loading', user: null, userInfo: null });
    const attempt = this.attempt;
    this.deadline = setTimeout(() => this.fail(new AuthLoadError('Clerk loading timed out'), attempt), AUTH_LOAD_TIMEOUT_MS);
    return attempt;
  };
  isAttempt = (attempt: number) => attempt === this.attempt && this.snapshot.status !== 'unavailable';
  fail = (error: unknown, attempt = this.attempt) => {
    if (!this.isAttempt(attempt)) return;
    this.invalidate();
    this.commands = null;
    this.loadFailure = error instanceof AuthLoadError;
    this.publish({ status: 'unavailable', user: null, userInfo: null });
    // This is a handled outage: the public page remains usable and paid actions
    // stay blocked. Keep its cause visible without raising Next's error overlay.
    console.warn('[auth] Authentication module unavailable:', error instanceof Error ? error.message : 'Unknown authentication failure');
  };
  stop = (attempt: number) => {
    if (attempt !== this.attempt) return;
    this.invalidate();
    this.commands = null;
    this.attempt++;
  };
  register = (attempt: number, commands: Commands) => {
    if (this.isAttempt(attempt)) this.commands = commands;
    return () => { if (this.commands === commands) this.commands = null; };
  };
  signedOut = (attempt: number) => {
    if (!this.isAttempt(attempt)) return;
    this.invalidate();
    this.publish({ status: 'signed-out', user: null, userInfo: null });
  };
  clear = () => this.signedOut(this.attempt);
  beginSync = (attempt: number, user: AuthUser): AuthOperation | null => {
    if (!this.isAttempt(attempt)) return null;
    this.invalidate();
    this.publish({ status: 'syncing', user: null, userInfo: null });
    this.deadline = setTimeout(() => this.fail(new Error('User sync timed out'), attempt), AUTH_TIMEOUT_MS);
    return { revision: this.revision, signal: this.controller.signal, user };
  };
  isCurrent = (operation: AuthOperation) => operation.revision === this.revision && !operation.signal.aborted;
  cancel = (operation: AuthOperation) => { if (this.isCurrent(operation)) this.invalidate(); };
  completeSync = (operation: AuthOperation, profile: UserInfo, tokens: BackendTokens) => {
    if (!this.isCurrent(operation)) return false;
    if (profile.uuid !== operation.user.id) throw new Error('User sync identity mismatch');
    const expiresAt = Number(tokens.expire_at);
    grantRequestAuthorization(tokens.access_token, expiresAt);
    try {
      localStorage.setItem('access_token', tokens.access_token);
      localStorage.setItem('refresh_token', tokens.refresh_token || '');
      localStorage.setItem('token_expire_at', String(expiresAt));
    } catch (error) { revokeRequestAuthorization(); throw error; }
    clearTimeout(this.deadline);
    this.expiry = setTimeout(() => this.fail(new Error('Session expired')), Math.min(expiresAt * 1000 - Date.now(), 2147483647));
    this.publish({ status: 'signed-in', user: operation.user, userInfo: profile });
    return true;
  };
  updateProfile = (operation: AuthOperation, profile: UserInfo) => {
    if (!this.isCurrent(operation)) return;
    if (profile.uuid !== operation.user.id) throw new Error('User profile identity mismatch');
    this.publish({ ...this.snapshot, userInfo: profile });
  };
  run = async (action: AuthAction): Promise<void> => {
    const attempt = this.attempt;
    const command = this.commands?.[action];
    if (!command || !this.isAttempt(attempt)) throw new Error(AUTH_UNAVAILABLE_MESSAGE);
    if (this.snapshot.status === 'loading' || this.snapshot.status === 'syncing') throw new Error(AUTH_LOADING_MESSAGE);
    // Revoke immediately; a rejected or hanging sign-out cannot leave paid actions enabled.
    if (action === 'signOut') {
      this.invalidate();
      this.publish({ status: 'loading', user: null, userInfo: null });
    }
    try {
      const signal = this.controller.signal;
      await withAuthTimeout(Promise.resolve().then(() => {
        if (!this.isAttempt(attempt) || signal.aborted) throw new DOMException('Auth operation cancelled', 'AbortError');
        return command();
      }), signal);
      if (action === 'signOut' && this.isAttempt(attempt)) this.signedOut(attempt);
    } catch (error) {
      if (this.isAttempt(attempt) && !(action === 'signOut' && this.snapshot.status === 'signed-out')) this.fail(error, attempt);
      throw new Error(AUTH_UNAVAILABLE_MESSAGE);
    }
  };
}
