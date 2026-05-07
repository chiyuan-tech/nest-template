import type { CyDemoDataDocSection } from "@/components/cy/common/cy-demo-data-field-docs.types";

export type VideoHeroDemoPreviewKey = "VideoHeroCase1" | "VideoHeroCase2" | "VideoHeroCase3";

const videoHeroDemoDataFieldDocSectionsShared: CyDemoDataDocSection[] = [
  {
    title: "根对象（Video Hero → data，HeroSectionData）",
    rows: [
      { field: "title", desc: "主标题。" },
      { field: "subtitle", desc: "副标题文案。" },
      { field: "ctaButtons", desc: "主按钮列表：`{ text, href }[]`。" },
      { field: "socialProof", desc: "社会 proof 一行文案。" },
      { field: "heroPoster", desc: "视频封面图 URL。" },
      { field: "heroVideo", desc: "背景/主视频 URL。" },
      { field: "badgeText?", desc: "角标条文案（可选）。" },
      {
        field: "heroStats?",
        desc: "VideoHeroCase3 底部统计条：`{ label, value }[]`（Case1/2 可省略）。",
      },
    ],
  },
];

export const videoHeroDemoDataFieldDocSections: Record<
  VideoHeroDemoPreviewKey,
  CyDemoDataDocSection[]
> = {
  VideoHeroCase1: videoHeroDemoDataFieldDocSectionsShared,
  VideoHeroCase2: videoHeroDemoDataFieldDocSectionsShared,
  VideoHeroCase3: videoHeroDemoDataFieldDocSectionsShared,
};

export const videoHeroDemoFieldDocsTypesPath = "components/cy/HeroSection/video/types.ts";
