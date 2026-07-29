import type { CyDemoDataDocSection } from "@/components/cy/common/cy-demo-data-field-docs.types";

export type ComparisonDemoPreviewKey = "ComparisonTableCase1";

export const comparisonDemoDataFieldDocSections: Record<
  ComparisonDemoPreviewKey,
  CyDemoDataDocSection[]
> = {
  ComparisonTableCase1: [
    {
      title: "根对象（ComparisonTableCase1 → data）",
      rows: [
        { field: "decorIndex", desc: "装饰序号（homeSplitHeader 等）。" },
        { field: "kicker", desc: "角标 / 小标题。" },
        { field: "sectionTitle", desc: "区块主标题（替代原页面 h2）。" },
        { field: "subtitle", desc: "副标题说明。" },
        { field: "titleLayout?", desc: "标题区布局 id；Demo 下拉写入复制 JSON。" },
        {
          field: "columnHeaders",
          desc: "表头文案数组，长度 = 列数（首列多为 Feature）。",
        },
        {
          field: "rows",
          desc: "二维数组；每行长度须与 columnHeaders 一致，首列为功能名。",
        },
      ],
    },
  ],
};

export const comparisonDemoFieldDocsTypesPath = "components/cy/Comparison/types.ts";
export const comparisonDemoFieldDocsLayoutPath = "cy-title-layout.config.ts";
