// API 基础配置 - 从 website-config 导入
import { apiConfig } from '@/website-config';
import {
  rejectRequestAuthorization,
  requireAuthorizedToken,
  requireRequestAuthorization,
  revokeRequestAuthorization,
  type RequestAuthorization,
} from '@/lib/auth/request-guard';

const API_CONFIG = {
  VIDOR_AI_BASE: apiConfig.baseUrl,
  APP_ID: apiConfig.appId,
};

// 通用请求头
const getHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  'x-appid': API_CONFIG.APP_ID,
});

export class ApiError extends Error {
  constructor(message: string, readonly code: number) {
    super(message);
  }
}

// 通用错误处理
const handleApiError = async (response: Response, authorization?: RequestAuthorization) => {
  // 首先检查 HTTP 状态码
  if (!response.ok) {
    if (response.status === 401 && authorization) rejectRequestAuthorization(authorization);
    const errorData = await response.text().catch(() => '');
    throw new ApiError(`HTTP Error ${response.status}: ${errorData || response.statusText}`, response.status);
  }

  // 解析 JSON 响应
  const result = await response.json();

  // 检查业务错误码
  if (result.code && result.code !== 200) {
    if (result.code === 401 && authorization) rejectRequestAuthorization(authorization);
    throw new ApiError(`${result.message || result.msg || 'Unknown error'}`, result.code);
  }

  return result;
};

const requestWithAuthorization = async (url: string, options: RequestInit) => {
  const authorization = requireRequestAuthorization();
  const headers = getHeaders();
  if (options.body instanceof FormData) delete headers['Content-Type'];
  headers.Authorization = `Bearer ${authorization.token}`;
  const response = await fetch(url, { ...options, headers });
  return handleApiError(response, authorization);
};

// 用户认证相关接口
export const authApi = {
  // 用户登录同步接口
  syncUser: async (userData: {
    uuid: string; // Clerk user ID in the backend login payload.
    email: string;
    token: string;
    nickname?: string;
    avatar?: string;
    from_login: string;
    ivcode?: string;
  }, signal?: AbortSignal) => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const endpoint = isDevelopment ? 'loginAuthCyTest' : 'loginAuth';

    const response = await fetch(`${API_CONFIG.VIDOR_AI_BASE}/api/user/${endpoint}`, {
      method: 'POST',
      headers: getHeaders(), // 登录接口不需要Authorization
      body: JSON.stringify(userData),
      signal,
    });

    return handleApiError(response);
  },

  // 检查token是否有效
  isTokenValid: (): boolean => {
    try { requireAuthorizedToken(); return true; } catch { return false; }
  },

  // 清除token
  clearTokens: () => {
    revokeRequestAuthorization();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expire_at');
  },
};

// 用户信息相关接口
export const userApi = {
  // 获取用户信息
  getUserInfo: async (signal?: AbortSignal) => {
    return requestWithAuthorization(`${API_CONFIG.VIDOR_AI_BASE}/api/user/info`, {
      cache: 'no-store',
      signal,
    });
  },

  // 获取用户作品列表
  getUserOpusList: async (page: number = 1, pageSize: number = 30) => {
    return requestWithAuthorization(
      `${API_CONFIG.VIDOR_AI_BASE}/api/user/opus_list?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
      }
    );
  },

  // 获取用户积分记录
  getTimesLog: async (page: number = 1, pageSize: number = 10) => {
    return requestWithAuthorization(
      `${API_CONFIG.VIDOR_AI_BASE}/api/user/times_log?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
      }
    );
  },
  // 获取用户支付记录（为与页面调用保持一致）
  getPayLog: async (page: number = 1, pageSize: number = 10) => {
    return requestWithAuthorization(
      `${API_CONFIG.VIDOR_AI_BASE}/api/user/pay_log?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
      }
    );
  },
  // 删除用户作品
  deleteOpus: async (opusId: number) => {
    return requestWithAuthorization(`${API_CONFIG.VIDOR_AI_BASE}/api/opus/delete`, {
      method: 'POST',
      body: JSON.stringify({
        opus_id: opusId,
      }),
    });
  },
  // 获取推广链接
  getPromotionLink: async () => {
    return requestWithAuthorization(`${API_CONFIG.VIDOR_AI_BASE}/api/user/promotion_link`, {
      method: 'GET',
    });
  },

  // 获取推广统计数据
  getPromotionStatistics: async () => {
    return requestWithAuthorization(`${API_CONFIG.VIDOR_AI_BASE}/api/user/promotion_statistics`, {
      method: 'GET',
    });
  },

  // 获取推广收益明细
  getPromotionScoreLog: async (page: number = 1, pageSize: number = 10, status?: number) => {
    let url = `${API_CONFIG.VIDOR_AI_BASE}/api/user/promotion_score_log?page=${page}&page_size=${pageSize}`;
    if (status !== undefined) {
      url += `&status=${status}`;
    }

    return requestWithAuthorization(url, {
      method: 'GET',
    });
  },

  // 获取推广用户列表
  getPromotionUsers: async (page: number = 1, pageSize: number = 10) => {
    return requestWithAuthorization(
      `${API_CONFIG.VIDOR_AI_BASE}/api/user/promotion_users?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
      }
    );
  },

  // 注销账户
  closeAccount: async () => {
    return requestWithAuthorization(`${API_CONFIG.VIDOR_AI_BASE}/api/user/close_account`, {
      method: 'POST',
    });
  },
};

// 支付相关接口
export const paymentApi = {
  // 创建PayPal支付会话
  createPaypalSession: async (priceId: string) => {
    return requestWithAuthorization(`${API_CONFIG.VIDOR_AI_BASE}/api/pay/stripe`, {
      method: 'POST',
      body: JSON.stringify({
        price_id: priceId,
      }),
    });
  },

  // 获取订阅记录
  getSubscriptions: async () => {
    return requestWithAuthorization(`${API_CONFIG.VIDOR_AI_BASE}/api/pay/subscriptions`, {
      method: 'GET',
    });
  },

  // 获取支付记录（对齐 seedance 实现）
  getPayLog: async (page: number = 1, pageSize: number = 10) => {
    return requestWithAuthorization(
      `${API_CONFIG.VIDOR_AI_BASE}/api/user/pay_log?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
      }
    );
  },

  // 取消订阅
  cancelSubscription: async (id: number) => {
    return requestWithAuthorization(`${API_CONFIG.VIDOR_AI_BASE}/api/pay/subscription/cancel`, {
      method: 'POST',
      body: JSON.stringify({
        id: id,
      }),
    });
  },

  // 创建发票（与 seedance 保持一致）
  createInvoice: async (params: {
    company_name: string;
    company_address?: string;
    pay_log_id: number;
  }) => {
    return requestWithAuthorization(`${API_CONFIG.VIDOR_AI_BASE}/api/pay/create_invoice`, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },
};

export const videoApi = {
  // 文生视频接口
  textToVideo: async (params: {
    prompt: string;
    resolution: string;
    ratio: string;
    duration: number;
    framepersecond?: number;
  }) => {
    return requestWithAuthorization(`${API_CONFIG.VIDOR_AI_BASE}/api/task/volcengine/text2video`, {
      method: 'POST',
      body: JSON.stringify({
        prompt: params.prompt,
        resolution: params.resolution,
        ratio: params.ratio,
        duration: params.duration,
        framepersecond: params.framepersecond || 24,
      }),
    });
  },

  // 图生视频接口
  imageToVideo: async (params: {
    prompt: string;
    resolution: string;
    duration: number;
    framepersecond?: number;
    image_file: File;
    image_tail_file?: File; // 尾帧图片，非必须
  }) => {
    console.log(params);
    const formData = new FormData();
    formData.append('prompt', params.prompt);
    formData.append('resolution', params.resolution);
    formData.append('duration', params.duration.toString());
    formData.append('framepersecond', (params.framepersecond || 24).toString());
    formData.append('image_file', params.image_file);
    
    // 如果提供了尾帧图片，则添加到 FormData
    if (params.image_tail_file) {
      formData.append('image_tail_file', params.image_tail_file);
    }

    console.log(formData);

    return requestWithAuthorization(`${API_CONFIG.VIDOR_AI_BASE}/api/task/volcengine/img2video`, {
      method: 'POST',
      body: formData,
    });
  },


  // 检查任务状态接口
  checkTaskStatus: async (taskId: string) => {
    return requestWithAuthorization(`${API_CONFIG.VIDOR_AI_BASE}/api/task/volcengine/check_task_status?task_id=${taskId}`, {
      method: 'GET',
    });
  },



  // 轮询检查任务状态，直到完成或失败
  pollTaskStatus: async (
    taskId: string,
    onProgress?: (progress: number, statusMsg: string) => void
  ): Promise<{ video_url: string; status: number; status_msg: string }> => {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const result = await videoApi.checkTaskStatus(taskId);

          if (result.code !== 200) {
            reject(new Error(result.msg || 'Task check failed'));
            return;
          }

          const { status, status_msg, video_url, progress } = result.data;

          // 更新进度
          if (onProgress) {
            const progressNum = parseFloat(progress) * 100;
            onProgress(progressNum, status_msg);
          }

          if (status === 1) {
            // 任务完成
            resolve({
              video_url: video_url,
              status,
              status_msg
            });
          } else if (status === -1) {
            // 任务失败
            reject(new Error(status_msg || 'Task failed'));
          } else {
            // 任务进行中，2秒后继续轮询
            setTimeout(poll, 2000);
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  },

  // Seedance 1.5 Pro - 文生视频接口
  seedance15TextToVideo: async (params: {
    prompt: string;
    resolution: string;
    duration: number;
    camerafixed: boolean;
    audio: boolean;
  }) => {
    return requestWithAuthorization(`${API_CONFIG.VIDOR_AI_BASE}/api/task/volcengine/seedance1.5/text2video`, {
      method: 'POST',
      body: JSON.stringify({
        prompt: params.prompt,
        resolution: params.resolution,
        duration: params.duration,
        camerafixed: params.camerafixed,
        audio: params.audio,
      }),
    });
  },

  // Seedance 1.5 Pro - 图生视频接口
  seedance15ImageToVideo: async (params: {
    prompt: string;
    resolution: string;
    duration: number;
    image_file: File;
    image_tail_file?: File;
    camerafixed: boolean;
    audio: boolean;
  }) => {
    const formData = new FormData();
    formData.append('prompt', params.prompt);
    formData.append('resolution', params.resolution);
    formData.append('duration', params.duration.toString());
    formData.append('camerafixed', params.camerafixed.toString());
    formData.append('audio', params.audio.toString());
    formData.append('image_file', params.image_file);
    
    // 如果提供了尾帧图片，则添加到 FormData
    if (params.image_tail_file) {
      formData.append('image_tail_file', params.image_tail_file);
    }

    return requestWithAuthorization(`${API_CONFIG.VIDOR_AI_BASE}/api/task/volcengine/seedance1.5/img2video`, {
      method: 'POST',
      body: formData,
    });
  },
};

// CMS相关接口
export const cmsApi = {
  // 获取友情链接列表（客户端版本）
  getFriendLinkList: async () => {
    const response = await fetch(`${API_CONFIG.VIDOR_AI_BASE}/api/cms/friendLinkList`, {
      method: 'GET',
      headers: getHeaders(), // 不需要认证
    });

    return handleApiError(response);
  },

  // 博客点击统计
  trackBlogClick: async (url: string) => {
    const response = await fetch(`${API_CONFIG.VIDOR_AI_BASE}/api/cms/statistics?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: getHeaders(), // 不需要认证
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
      headers: getHeaders(), // 不需要认证
    });

    return handleApiError(response);
  },

  // 获取公开作品列表
  getOpenOpusList: async (page: number = 1, pageSize: number = 10) => {
    const response = await fetch(
      `${API_CONFIG.VIDOR_AI_BASE}/api/website/open/opus_list?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
        headers: getHeaders(), // 不需要认证
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
    requireAuthorizedToken();
    try {

      return await apiCall();
    } catch (error) {
      console.error(`API call failed (attempt ${i + 1}/${maxRetries}):`, error);

      if (i === maxRetries - 1 || (error instanceof ApiError && error.code === 401)) {
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
  video: videoApi,

  withRetry: apiWithRetry,
};
