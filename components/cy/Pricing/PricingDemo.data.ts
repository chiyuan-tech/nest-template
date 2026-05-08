import type { CyDemoDataDocSection } from "@/components/cy/common/cy-demo-data-field-docs.types";

export type PricingDemoPreviewKey = "PricingCase1" | "PricingCase2";

export const pricingDemoDataFieldDocSections: Record<
  PricingDemoPreviewKey,
  CyDemoDataDocSection[]
> = {
  PricingCase1: [
    {
      title: "根对象（PricingCase1 → data）",
      rows: [
        { field: "decorIndex", desc: "标题区装饰序号。" },
        { field: "kicker", desc: "角标 / 小标题（与 badge 区分：badge 为价卡区顶部药丸）。" },
        { field: "sectionTitle", desc: "主标题（CyTestimonialTitleCase1）。" },
        { field: "subtitle", desc: "主标题下说明段落。" },
        { field: "titleLayout?", desc: "标题区布局 id；Demo 复制写入 JSON。" },
        { field: "badgeText", desc: "顶部药丸内文案（如「Seedance Pricing」）。" },
        { field: "plans", desc: "价卡列表，横向栅格。" },
        { field: "bottomTagline", desc: "底部说明一行。" },
        { field: "bottomChecks", desc: "底部绿色勾选项文案数组。" },
        { field: "supportMailDomain", desc: "邮箱域名，渲染为 support@{domain}。" },
      ],
    },
    {
      title: "plans[] 单项（PricingPlanItem）",
      rows: [
        { field: "key", desc: "稳定 key，用于 React list。" },
        { field: "popular", desc: "是否为高亮「Most Popular」套餐。" },
        { field: "title", desc: "套餐名。" },
        { field: "price", desc: "展示价字符串，如 `$29.9`。" },
        { field: "credits", desc: "积分数（展示用，与 ctaLabel 可一致）。" },
        { field: "ctaLabel", desc: "按钮文案。" },
        {
          field: "priceId?",
          desc: "Stripe Price Id（`price_...`）；有值则与落地页一致：登录后调 `/api/pay/stripe` 并跳转收银台。",
        },
        { field: "ctaHref", desc: "无 `priceId` 时作为普通链接 href。" },
        { field: "features", desc: "特性列表字符串。" },
      ],
    },
  ],
  PricingCase2: [
    {
      title: "根对象（PricingCase2 → data）",
      rows: [
        { field: "decorIndex", desc: "标题区装饰序号。" },
        { field: "kicker", desc: "角标。" },
        { field: "sectionTitle", desc: "左侧主标题（CyTestimonialTitleCase1）。" },
        { field: "subtitle", desc: "标题区副文案。" },
        { field: "titleLayout?", desc: "标题区布局 id。" },
        { field: "leftSupportBlurb", desc: "CTA 上方短说明。" },
        { field: "primaryCta", desc: "`{ label, href }` 主按钮。" },
        { field: "faqItems", desc: "右侧折叠 FAQ。" },
        { field: "defaultOpenFaqIndex?", desc: "默认展开项索引；`null` 表示默认全收合。" },
        { field: "helpCard", desc: "`{ title, body, mailto }` 底部帮助卡片。" },
      ],
    },
    {
      title: "faqItems[] 单项",
      rows: [
        { field: "question", desc: "问题标题。" },
        { field: "answer", desc: "展开答案正文。" },
      ],
    },
  ],
};

export const pricingDemoFieldDocsTypesPath = "components/cy/Pricing/types.ts";
export const pricingDemoFieldDocsLayoutPath = "cy-title-layout.config.ts";
