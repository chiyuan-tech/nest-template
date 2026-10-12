export type AuthStatus = 'loading' | 'syncing' | 'signed-out' | 'signed-in' | 'unavailable';

// Application-owned data. Public components never receive a Clerk resource.
export interface AuthUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  username: string | null;
  imageUrl: string;
  primaryEmailAddress: { emailAddress: string } | null;
}

export interface UserInfo {
  uuid: string;
  email: string;
  from_login: string;
  nickname: string;
  avatar?: string;
  free_limit: number;
  remaining_limit: number;
  total_limit: number;
  use_limit: number;
  vip_last_time: number;
  level: number;
  created_at: number;
  updated_at: number;
  status: number;
  id: number;
  total_credits: number;
  free_times: number;
}

export interface AuthSnapshot {
  status: AuthStatus;
  user: AuthUser | null;
  userInfo: UserInfo | null;
}

export interface BackendTokens {
  access_token: string;
  refresh_token?: string;
  expire_at: number;
}
