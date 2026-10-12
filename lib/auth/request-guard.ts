export const AUTH_UNAVAILABLE_MESSAGE = '登录暂时不可用，可重试';
export const AUTH_LOADING_MESSAGE = '正在确认登录状态，请稍后重试';

// A stored token alone is never sufficient. Only the live auth module can grant access.
let authorization: { token: string; expiresAt: number } | null = null;

export function revokeRequestAuthorization() {
  authorization = null;
}

export function grantRequestAuthorization(token: string, expiresAt: number) {
  if (!token || !Number.isFinite(expiresAt) || expiresAt * 1000 <= Date.now()) {
    throw new Error(AUTH_UNAVAILABLE_MESSAGE);
  }
  authorization = { token, expiresAt };
}

export function requireAuthorizedToken(): string {
  if (!authorization || authorization.expiresAt * 1000 <= Date.now()) {
    revokeRequestAuthorization();
    throw new Error(AUTH_UNAVAILABLE_MESSAGE);
  }
  return authorization.token;
}
