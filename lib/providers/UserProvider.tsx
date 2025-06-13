'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';
import { api } from '../api';

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
  total_credits: number; // 计算字段：free_limit + remaining_limit
}

interface UserContextType {
  userInfo: UserInfo | null;
  isLoadingUserInfo: boolean;
  refreshUserInfo: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { user, isSignedIn } = useUser();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(false);

  const fetchUserInfo = async (isInitialLoad = false) => {
    if (!isSignedIn || !user?.id) {
      setUserInfo(null);
      return;
    }
    
    // 检查token是否可用
    if (!api.auth.isTokenValid()) {
      console.log('Token not available yet, waiting...');
      return;
    }
    
    // 只在初始加载时显示loading
    if (isInitialLoad) {
    setIsLoadingUserInfo(true);
    }
    
    try {
      const result = await api.user.getUserInfo();
      
      if (result.code === 200 && result.data) {
        const userInfoData: UserInfo = {
          uuid: result.data.uuid,
          email: result.data.email,
          from_login: result.data.from_login,
          nickname: result.data.nickname,
          avatar: result.data.avatar,
          free_limit: result.data.free_limit,
          remaining_limit: result.data.remaining_limit,
          total_limit: result.data.total_limit,
          use_limit: result.data.use_limit,
          vip_last_time: result.data.vip_last_time,
          level: result.data.level,
          created_at: result.data.created_at,
          updated_at: result.data.updated_at,
          status: result.data.status,
          id: result.data.id,
          total_credits: result.data.free_limit + result.data.remaining_limit
        };
        setUserInfo(userInfoData);
      } else {
        console.warn("User info API returned success code but no data for:", user.id);
        setUserInfo(null);
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      setUserInfo(null);
    } finally {
      // 只在初始加载时才设置loading为false
      if (isInitialLoad) {
      setIsLoadingUserInfo(false);
      }
    }
  };

  const refreshUserInfo = async () => {
    await fetchUserInfo(true);
  };

  // 获取用户信息 - 等待token可用后再调用
  useEffect(() => {
    // 延迟获取用户信息，给auth接口时间完成
    const delayedFetch = () => {
      if (isSignedIn && user?.id) {
        // 检查token，如果没有则等待
        const checkTokenAndFetch = () => {
          if (api.auth.isTokenValid()) {
            fetchUserInfo(true); // 初始加载
          } else {
            // 如果token还没准备好，1秒后重试
            setTimeout(checkTokenAndFetch, 1000);
          }
        };
        
        // 首次尝试
        checkTokenAndFetch();
      } else {
        // 用户未登录时清空信息
        setUserInfo(null);
      }
    };

    // 首次加载获取用户信息
    delayedFetch();
    
    // 设置定时器，每10秒更新一次用户信息
    const intervalId = setInterval(() => {
      if (isSignedIn && api.auth.isTokenValid()) {
        fetchUserInfo(false); // 后续刷新，不是初始加载
      }
    }, 10000);
    
    // 组件卸载时清除定时器
    return () => clearInterval(intervalId);
  }, [isSignedIn, user?.id]);

  const value: UserContextType = {
    userInfo,
    isLoadingUserInfo,
    refreshUserInfo,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserInfo() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserInfo must be used within a UserProvider');
  }
  return context;
} 