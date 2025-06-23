'use client';

import { GoogleOneTap } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';
import { api } from '@/lib/api';

interface GoogleOneTapAuthProps {
  /** 如果为true，当用户点击提示框外部时会自动关闭One Tap提示框。默认: true */
  cancelOnTapOutside?: boolean;
  /** 如果为true，在ITP浏览器（如iOS上的Chrome、Safari和FireFox）上启用ITP特定的用户体验。默认: true */
  itpSupport?: boolean;
  /** 如果为true，启用Google One Tap使用FedCM API登录用户。默认: true */
  fedCmSupport?: boolean;
  /** 登录后的重定向URL，会覆盖ClerkProvider的设置 */
  signInForceRedirectUrl?: string;
  /** 注册后的重定向URL，会覆盖ClerkProvider的设置 */
  signUpForceRedirectUrl?: string;
}

// 使用模块级变量记录同步状态
const syncStatusByUser: { [userId: string]: boolean } = {};

export default function GoogleOneTapAuth({
  cancelOnTapOutside = true,
  itpSupport = true,
  fedCmSupport = true,
  signInForceRedirectUrl,
  signUpForceRedirectUrl,
}: GoogleOneTapAuthProps) {
  const { isSignedIn, user } = useUser();
  const hasInitialized = useRef(false);

  // 监听用户登录状态变化，在Google One Tap登录成功后同步用户数据
  useEffect(() => {
    // 避免重复初始化
    if (hasInitialized.current) return;
    
    const effectUserId = user?.id;
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (isSignedIn && effectUserId && userEmail && !syncStatusByUser[effectUserId]) {
      hasInitialized.current = true;
      syncStatusByUser[effectUserId] = true;

      const userData = {
        uuid: effectUserId,
        email: userEmail,
        nickname: user.fullName || undefined,
        avatar: user.imageUrl || undefined,
        from_login: "google"
      };

      const syncUser = async () => {
        try {
          console.log('Google One Tap: 开始同步用户数据', userData);
          const responseData = await api.auth.syncUser(userData);
          console.log('Google One Tap: 用户数据同步成功', responseData);
        } catch (error) {
          console.error('Google One Tap: 用户数据同步失败', error);
        }
      };

      // 延迟执行同步，确保用户数据完全加载
      setTimeout(syncUser, 100);
    }
  }, [isSignedIn, user]);

  // 如果用户已登录，不显示Google One Tap
  if (isSignedIn) {
    return null;
  }

  return (
    <GoogleOneTap
      cancelOnTapOutside={cancelOnTapOutside}
      itpSupport={itpSupport}
      fedCmSupport={fedCmSupport}
      signInForceRedirectUrl={signInForceRedirectUrl}
      signUpForceRedirectUrl={signUpForceRedirectUrl}
    />
  );
} 