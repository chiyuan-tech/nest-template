import type { CyDemoDataDocSection } from "@/components/cy/common/cy-demo-data-field-docs.types";

export type HowToStepsDemoPreviewKey = "HowToStepsCase1";

export const howToStepsDemoDataFieldDocSections: Record<
  HowToStepsDemoPreviewKey,
  CyDemoDataDocSection[]
> = {
  HowToStepsCase1: [
    {
      title: "根对象（HowToStepsCase1 → data）",
      rows: [
        { field: "decorIndex", desc: "装饰序号（homeSplitHeader 等布局用）。" },
        { field: "kicker", desc: "角标 / 小标题。" },
        { field: "sectionTitle", desc: "区块主标题（CyTestimonialTitleCase1）。" },
        { field: "subtitle", desc: "副标题。" },
        {
          field: "titleLayout?",
          desc: "标题区布局 id；Demo 下拉会覆盖并写入复制 JSON。",
        },
        { field: "steps", desc: "三步卡片：name、image、text。" },
      ],
    },
    {
      title: "steps[] 单项",
      rows: [
        { field: "name", desc: "步骤标题（卡片标题）。" },
        { field: "image", desc: "步骤配图 URL（需 next.config remotePatterns）。" },
        { field: "text", desc: "步骤说明正文。" },
      ],
    },
  ],
};

export const howToStepsDemoFieldDocsTypesPath = "components/cy/HowToSteps/types.ts";
export const howToStepsDemoFieldDocsLayoutPath = "cy-title-layout.config.ts";
