// API 基础配置
const API_CONFIG = {
  BASE: 'https://svc.vidorai.com',
  APP_ID: 'ai_video',
};

// 通用请求头
const getHeaders = (includeAuth = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-appid': API_CONFIG.APP_ID,
  };

  if (includeAuth) {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// 通用错误处理
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`API Error ${response.status}: ${errorData || response.statusText}`);
  }
  return response.json();
};

// 用户认证相关接口
export const authApi = {
  // 用户登录同步接口
  syncUser: async (userData: {
    uuid: string;
    email: string;
    nickname?: string;
    avatar?: string;
    from_login: string;
  }) => {
    const response = await fetch(`${API_CONFIG.BASE}/api/user/auth`, {
      method: 'POST',
      headers: getHeaders(false), // 登录接口不需要Authorization
      body: JSON.stringify(userData),
    });

    const result = await handleApiError(response);
    
    // 保存token到localStorage
    if (result.code === 200 && result.data) {
      localStorage.setItem('access_token', result.data.access_token);
      localStorage.setItem('refresh_token', result.data.refresh_token);
      localStorage.setItem('token_expire_at', result.data.expire_at.toString());
    }
    
    return result;
  },

  // 检查token是否有效
  isTokenValid: (): boolean => {
    const token = localStorage.getItem('access_token');
    const expireAt = localStorage.getItem('token_expire_at');
    
    if (!token || !expireAt) return false;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return parseInt(expireAt) > currentTime;
  },

  // 清除token
  clearTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expire_at');
  },
};

// 用户信息相关接口
export const userApi = {
  // 获取用户信息
  getUserInfo: async () => {
    const response = await fetch(`${API_CONFIG.BASE}/api/user/info`, {
      headers: getHeaders(),
    });

    return handleApiError(response);
  },

  // 获取用户作品列表
  getUserOpusList: async (page: number = 1, pageSize: number = 30) => {
    const response = await fetch(
      `${API_CONFIG.BASE}/api/user/opus_list?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );

    return handleApiError(response);
  },
};

// 支付相关接口
export const paymentApi = {
  // 创建Stripe支付会话
  createStripeSession: async (priceId: string) => {
    const response = await fetch(`${API_CONFIG.BASE}/api/pay/stripe`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        price_id: priceId,
      }),
    });

    return handleApiError(response);
  },
};

// 带重试机制的API调用（用于依赖token的接口）
export const apiWithRetry = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        // 如果没有token，等待一段时间后重试
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      return await apiCall();
    } catch (error) {
      console.error(`API call failed (attempt ${i + 1}/${maxRetries}):`, error);
      
      if (i === maxRetries - 1) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('API call failed after maximum retries');
};

// 导出所有API
export const api = {
  auth: authApi,
  user: userApi,
  payment: paymentApi,
  withRetry: apiWithRetry,
}; 