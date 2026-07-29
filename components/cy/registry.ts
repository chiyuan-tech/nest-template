export type CyCategorySlug =
  | "fonts"
  | "button"
  | "hero-section"
  | "use-cases"
  | "faq"
  | "users-say"
  | "key-features"
  | "how-to-steps"
  | "comparison"
  | "pricing";

export interface CyDemoItem {
  slug: string;
  title: string;
  description: string;
}

export interface CyCategory {
  slug: CyCategorySlug;
  label: string;
  demos: CyDemoItem[];
}

export const cyRegistry: CyCategory[] = [
  {
    slug: "fonts",
    label: "fonts",
    demos: [
      {
        slug: "font-pairing",
        title: "Font Pairing",
        description: "展示标题与正文在 SaaS 页面中的字体配对效果。",
      },
    ],
  },
  {
    slug: "button",
    label: "button",
    demos: [
      {
        slug: "button-guide",
        title: "Button Guide",
        description: "按钮类型、状态说明，附示例代码与实时预览效果。",
      },
    ],
  },
  {
    slug: "hero-section",
    label: "HeroSection",
    demos: [
      {
        slug: "video",
        title: "Video Hero",
        description: "Video Hero组件并支持全屏预览。",
      },
      {
        slug: "image",
        title: "Image Hero",
        description: "Image Hero组件并支持全屏预览。",
      }
    ],
  },
  {
    slug:"key-features",
    label: "KeyFeature",
    demos: [
      {
        slug: "feature-cards",
        title: "Feature Cards",
        description: "三列卡片展示核心使用场景与收益。",
      },
    ],
  }, 
  {
    slug: "users-say",
    label: "UsersSay",
    demos: [
      {
        slug: "testimonial-grid",
        title: "Testimonial Grid",
        description: "用户评价网格，突出不同角色的真实反馈。",
      },
    ],
  },
  {
    slug: "how-to-steps",
    label: "HowToSteps",
    demos: [
      {
        slug: "three-steps",
        title: "HowToSteps",
        description: "三步图文说明：描述需求、选择设置、生成下载。",
      },
    ],
  },
  {
    slug: "use-cases",
    label: "UseCases",
    demos: [
      {
        slug: "use-cases",
        title: "UseCases",
        description: "三列卡片展示核心使用场景与收益。",
      },
    ],
  },
  
  {
    slug: "comparison",
    label: "Comparison",
    demos: [
      {
        slug: "model-table",
        title: "Model comparison table",
        description: "多产品功能对比横向表格，可配置表头与行数据。",
      },
    ],
  },
  {
    slug: "faq",
    label: "FAQ",
    demos: [
      {
        slug: "collapsible-faq",
        title: "Collapsible FAQ",
        description: "可展开常见问题模块，适合落地页信息补充。",
      },
    ],
  },
  {
    slug: "pricing",
    label: "Pricing",
    demos: [
      {
        slug: "plans",
        title: "Pricing",
        description: "价卡栅格与定价 FAQ，数据来自 cy-modules（无 Clerk / 支付耦合）。",
      },
    ],
  },
];

export function getDefaultCyRoute() {
  const firstCategory = cyRegistry[0];
  const firstDemo = firstCategory.demos[0];
  return `/cy/${firstCategory.slug}/${firstDemo.slug}`;
}

export function findCyCategory(category: string) {
  return cyRegistry.find((item) => item.slug === category);
}

export function findCyDemo(category: string, demo: string) {
  const categoryConfig = findCyCategory(category);
  if (!categoryConfig) return null;
  const demoConfig = categoryConfig.demos.find((item) => item.slug === demo);
  if (!demoConfig) return null;
  return {
    category: categoryConfig,
    demo: demoConfig,
  };
}
