import type { CyTitleLayoutId } from "@/components/cy/headerLayout/cy-title-layout.config";

export interface PricingPlanItem {
  key: string;
  popular: boolean;
  title: string;
  price: string;
  credits: number;
  ctaLabel: string;
  /**
   * 若填写 Stripe `price_xxx`，点击按钮将走与 `components/PricingSection` 相同流程：
   * Clerk 登录 → `POST /api/pay/stripe` → 跳转返回的收银台 URL。
   * 省略或空字符串时，按钮退化为 `ctaHref` 的普通链接（适合 CY 画廊无后端场景）。
   */
  priceId?: string;
  /** 无 `priceId` 时使用的链接 */
  ctaHref: string;
  features: string[];
}

export interface PricingCase1Data {
  decorIndex: string;
  kicker: string;
  sectionTitle: string;
  subtitle: string;
  titleLayout?: CyTitleLayoutId;
  badgeText: string;
  plans: PricingPlanItem[];
  bottomTagline: string;
  /** 底部绿色勾选项文案 */
  bottomChecks: string[];
  /** 用于 `support@{domain}` 展示与 mailto */
  supportMailDomain: string;
}

export interface PricingFaqItem {
  question: string;
  answer: string;
}

export interface PricingCase2Data {
  decorIndex: string;
  kicker: string;
  sectionTitle: string;
  subtitle: string;
  titleLayout?: CyTitleLayoutId;
  leftSupportBlurb: string;
  primaryCta: { label: string; href: string };
  faqItems: PricingFaqItem[];
  /** 默认展开项；省略为 0；`null` 表示全部收合 */
  defaultOpenFaqIndex?: number | null;
  helpCard: {
    title: string;
    body: string;
    mailto: string;
  };
}
