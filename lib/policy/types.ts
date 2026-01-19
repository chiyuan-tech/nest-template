/**
 * Policy 系统类型定义
 * 用于统一管理用户权益、表单限制和按钮状态
 */

export type ProductId = 'seedance-1-pro' | 'seedance-1-5-pro' | string;

export interface UserContext {
  isSignedIn: boolean;
  level: number;
  total_credits: number;
  free_times: number;
}

export interface FormContext {
  resolution?: string;
  duration: number;
  aspectRatio?: string;
  mode?: 'text-to-video' | 'image-to-video' | 'reference-to-video';
  audio?: boolean; // 是否开启声音
  camerafixed?: boolean; // 是否固定相机位置
  model?: string; // 模型类型，如 'veo3_fast', 'veo3'
  maxImages?: number; // 最大图片数量（用于 Seedream 4.5）
  [key: string]: any; // 允许扩展其他字段
}

export interface PolicyInput {
  productId: ProductId;
  user: UserContext;
  form: FormContext;
}

export type PrimaryAction = 'signin' | 'generate' | 'upgrade' | 'buyCredits';

export interface PolicyDecision {
  // 用户状态
  voucherEligible: boolean; // 是否处于优惠券可用状态 (level <= 0 && free_times > 0)
  voucherRestricted: boolean; // 是否因为优惠券限制而不允许生成
  
  // 权限判断
  allowed: boolean; // 是否允许生成
  
  // 按钮状态
  primaryAction: PrimaryAction;
  buttonText: string;
  costBadge: string | number; // 'free' 或积分数字
  
  // 表单限制
  disabledFields?: {
    resolution?: boolean;
    duration?: boolean;
    aspectRatio?: boolean;
    [key: string]: boolean | undefined;
  };
  
  // 提示信息
  message?: string;
  denyReason?: 'voucher_restricted' | 'insufficient_credits' | 'not_signed_in' | 'invalid_params';
  
  // 需要的积分（如果使用积分）
  requiredCredits?: number;
}

export interface VoucherConstraints {
  resolution?: string[]; // 允许的分辨率列表
  duration?: number[]; // 允许的时长列表
  aspectRatio?: string[]; // 允许的宽高比列表
  mode?: ('text-to-video' | 'image-to-video' | 'reference-to-video')[]; // 允许的模式列表
  model?: string[]; // 允许的模型列表
  [key: string]: string[] | number[] | boolean[] | undefined; // 允许扩展任意字段的限制
}

export interface ProductPolicy {
  productId: ProductId;
  voucherConstraints?: VoucherConstraints; // 优惠券限制
  creditPricing?: (form: FormContext) => number; // 积分计算函数
}

