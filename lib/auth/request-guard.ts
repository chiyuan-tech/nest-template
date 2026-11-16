export const AUTH_UNAVAILABLE_MESSAGE = '登录暂时不可用，可重试';
export const AUTH_LOADING_MESSAGE = '正在确认登录状态，请稍后重试';

// A stored token alone is never sufficient. Only the live auth module can grant access.
export type RequestAuthorization = Readonly<{ token: string; expiresAt: number; onRejected: () => void }>;
let authorization: RequestAuthorization | null = null;

export function revokeRequestAuthorization() {
  authorization = null;
}

export function grantRequestAuthorization(token: string, expiresAt: number, onRejected: () => void) {
  if (!token || !Number.isFinite(expiresAt) || expiresAt * 1000 <= Date.now()) {
    throw new Error(AUTH_UNAVAILABLE_MESSAGE);
  }
  authorization = { token, expiresAt, onRejected };
}

export function rejectRequestAuthorization(request: RequestAuthorization) {
  if (authorization !== request) return;
  revokeRequestAuthorization();
  request.onRejected();
}

export function requireRequestAuthorization(): RequestAuthorization {
  if (!authorization || authorization.expiresAt * 1000 <= Date.now()) {
    revokeRequestAuthorization();
    throw new Error(AUTH_UNAVAILABLE_MESSAGE);
  }
  return authorization;
}

export function requireAuthorizedToken(): string {
  return requireRequestAuthorization().token;
}
