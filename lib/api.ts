// API 基础配置 - 从 website-config 导入
import { apiConfig } from '@/website-config';

const API_CONFIG = {
  VIDOR_AI_BASE: apiConfig.baseUrl,
  APP_ID: apiConfig.appId,
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
  // 首先检查 HTTP 状态码
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`HTTP Error ${response.status}: ${errorData || response.statusText}`);
  }

  // 解析 JSON 响应
  const result = await response.json();

  // 检查业务错误码
  if (result.code && result.code !== 200) {
    throw new Error(`${result.message || result.msg || 'Unknown error'}`);
  }

  return result;
};

// 用户认证相关接口
export const authApi = {
  // 用户登录同步接口
  syncUser: async (userData: {
    uuid: string;
    email: string;
    token: string;
    nickname?: string;
    avatar?: string;
    from_login: string;
    ivcode?: string;
  }) => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const endpoint = isDevelopment ? 'loginAuthCyTest' : 'loginAuth';

    const response = await fetch(`${API_CONFIG.VIDOR_AI_BASE}/api/user/${endpoint}`, {
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
    const response = await fetch(`${API_CONFIG.VIDOR_AI_BASE}/api/user/info`, {
      headers: getHeaders(),
    });

    return handleApiError(response);
  },

  // 获取用户作品列表
  getUserOpusList: async (page: number = 1, pageSize: number = 30) => {
    const response = await fetch(
      `${API_CONFIG.VIDOR_AI_BASE}/api/user/opus_list?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );

    return handleApiError(response);
  },

  // 获取用户积分记录
  getTimesLog: async (page: number = 1, pageSize: number = 10) => {
    const response = await fetch(
      `${API_CONFIG.VIDOR_AI_BASE}/api/user/times_log?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );

    return handleApiError(response);
  },
  // 获取用户支付记录（为与页面调用保持一致）
  getPayLog: async (page: number = 1, pageSize: number = 10) => {
    const response = await fetch(
      `${API_CONFIG.VIDOR_AI_BASE}/api/user/pay_log?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );

    return handleApiError(response);
  },
  // 删除用户作品
  deleteOpus: async (opusId: number) => {
    const response = await fetch(`${API_CONFIG.VIDOR_AI_BASE}/api/opus/delete`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        opus_id: opusId,
      }),
    });

    return handleApiError(response);
  },
  // 获取推广链接
  getPromotionLink: async () => {
    const response = await fetch(`${API_CONFIG.VIDOR_AI_BASE}/api/user/promotion_link`, {
      method: 'GET',
      headers: getHeaders(),
    });

    return handleApiError(response);
  },

  // 获取推广统计数据
  getPromotionStatistics: async () => {
    const response = await fetch(`${API_CONFIG.VIDOR_AI_BASE}/api/user/promotion_statistics`, {
      method: 'GET',
      headers: getHeaders(),
    });

    return handleApiError(response);
  },

  // 获取推广收益明细
  getPromotionScoreLog: async (page: number = 1, pageSize: number = 10, status?: number) => {
    let url = `${API_CONFIG.VIDOR_AI_BASE}/api/user/promotion_score_log?page=${page}&page_size=${pageSize}`;
    if (status !== undefined) {
      url += `&status=${status}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    return handleApiError(response);
  },

  // 获取推广用户列表
  getPromotionUsers: async (page: number = 1, pageSize: number = 10) => {
    const response = await fetch(
      `${API_CONFIG.VIDOR_AI_BASE}/api/user/promotion_users?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );

    return handleApiError(response);
  },

  // 注销账户
  closeAccount: async () => {
    const response = await fetch(`${API_CONFIG.VIDOR_AI_BASE}/api/user/close_account`, {
      method: 'POST',
      headers: getHeaders(),
    });

    return handleApiError(response);
  },
};

// 支付相关接口
export const paymentApi = {
  // 创建PayPal支付会话
  createPaypalSession: async (priceId: string) => {
    const response = await fetch(`${API_CONFIG.VIDOR_AI_BASE}/api/pay/stripe`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        price_id: priceId,
      }),
    });

    return handleApiError(response);
  },

  // 获取订阅记录
  getSubscriptions: async () => {
    const response = await fetch(`${API_CONFIG.VIDOR_AI_BASE}/api/pay/subscriptions`, {
      method: 'GET',
      headers: getHeaders(),
    });

    return handleApiError(response);
  },

  // 获取支付记录（对齐 seedance 实现）
  getPayLog: async (page: number = 1, pageSize: number = 10) => {
    const response = await fetch(
      `${API_CONFIG.VIDOR_AI_BASE}/api/user/pay_log?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );

    return handleApiError(response);
  },

  // 取消订阅
  cancelSubscription: async (id: number) => {
    const response = await fetch(`${API_CONFIG.VIDOR_AI_BASE}/api/pay/subscription/cancel`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        id: id,
      }),
    });

    return handleApiError(response);
  },

  // 创建发票（与 seedance 保持一致）
  createInvoice: async (params: {
    company_name: string;
    company_address?: string;
    pay_log_id: number;
  }) => {
    const response = await fetch(`${API_CONFIG.VIDOR_AI_BASE}/api/pay/create_invoice`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(params),
    });

    return handleApiError(response);
  },
};



// CMS相关接口
export const cmsApi = {
  // 获取友情链接列表（客户端版本）
  getFriendLinkList: async () => {
    const response = await fetch(`${API_CONFIG.VIDOR_AI_BASE}/api/cms/friendLinkList`, {
      method: 'GET',
      headers: getHeaders(false), // 不需要认证
    });

    return handleApiError(response);
  },

  // 博客点击统计
  trackBlogClick: async (url: string) => {
    const response = await fetch(`${API_CONFIG.VIDOR_AI_BASE}/api/cms/statistics?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: getHeaders(false), // 不需要认证
    });

    return handleApiError(response);
  },
};

// 站点配置相关接口
export const websiteApi = {
  // 获取站点配置
  getConfig: async () => {
    const response = await fetch(`${API_CONFIG.VIDOR_AI_BASE}/api/website/config`, {
      method: 'GET',
      headers: getHeaders(false), // 不需要认证
    });

    return handleApiError(response);
  },

  // 获取公开作品列表
  getOpenOpusList: async (page: number = 1, pageSize: number = 10) => {
    const response = await fetch(
      `${API_CONFIG.VIDOR_AI_BASE}/api/website/open/opus_list?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
        headers: getHeaders(false), // 不需要认证
      }
    );

    return handleApiError(response);
  },
};
// 重新导出FriendLink类型以保持兼容性
export type { FriendLink } from './server-api';

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
  website: websiteApi,
  cms: cmsApi,

  withRetry: apiWithRetry,
}; 