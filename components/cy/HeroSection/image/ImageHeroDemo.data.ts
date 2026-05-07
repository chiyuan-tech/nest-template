import type { CyDemoDataDocSection } from "@/components/cy/common/cy-demo-data-field-docs.types";

export type ImageHeroDemoPreviewKey = "ImageHeroCase1" | "ImageHeroCase2";

const imageHeroDemoDataFieldDocSectionsShared: CyDemoDataDocSection[] = [
  {
    title: "根对象（Image Hero → data，ImageHeroData）",
    rows: [
      { field: "title", desc: "主标题。" },
      { field: "subtitle", desc: "副标题。" },
      { field: "ctaButtons", desc: "CTA 按钮列表：`{ text, href }[]`。" },
      { field: "heroImage", desc: "主视觉图 URL。" },
      { field: "featureChips", desc: "特性标签 string[]。" },
      { field: "liveBriefEmphasis", desc: "实时说明高亮段。" },
      { field: "liveBriefTail", desc: "实时说明后续段。" },
      { field: "logoImages?", desc: "Logo 条 URL 列表（可选）。" },
      { field: "badgeText?", desc: "角标（可选）。" },
    ],
  },
];

export const imageHeroDemoDataFieldDocSections: Record<
  ImageHeroDemoPreviewKey,
  CyDemoDataDocSection[]
> = {
  ImageHeroCase1: imageHeroDemoDataFieldDocSectionsShared,
  ImageHeroCase2: imageHeroDemoDataFieldDocSectionsShared,
};

export const imageHeroDemoFieldDocsTypesPath = "components/cy/HeroSection/image/types.ts";
