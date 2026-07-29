import type { CyDemoDataDocSection } from "@/components/cy/common/cy-demo-data-field-docs.types";

export type CollapsibleFaqDemoPreviewKey = "FaqCase1" | "FaqCase2";

export const collapsibleFaqDemoDataFieldDocSections: Record<
  CollapsibleFaqDemoPreviewKey,
  CyDemoDataDocSection[]
> = {
  FaqCase1: [
    {
      title: "根对象（FaqCase1 → data）",
      rows: [
        { field: "sectionTitle", desc: "区块主标题，居中展示在问答列表上方。" },
        {
          field: "defaultOpenItemIndex?",
          desc: "初始展开第几项（从 0 起算），对应内部 Accordion 的 item-{index}；会夹在有效范围内。",
        },
        {
          field: "items",
          desc: "问答列表；每项类型见下表「items[] 单项」。",
        },
      ],
    },
    {
      title: "items[] 单项（FaqItem）",
      rows: [
        { field: "question", desc: "问题文案，显示在折叠触发条上。" },
        { field: "answer", desc: "答案正文，展开后显示。" },
      ],
    },
  ],
  FaqCase2: [],
};

export const collapsibleFaqDemoFieldDocsTypesPath = "components/cy/FAQ/types.ts";
