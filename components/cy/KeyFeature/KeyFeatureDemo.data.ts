import type { CyDemoDataDocSection } from "@/components/cy/common/cy-demo-data-field-docs.types";

export type KeyFeatureDemoPreviewKey = "KeyFeatureCase1" | "KeyFeatureCase2";

export const keyFeatureDemoDataFieldDocSections: Record<
  KeyFeatureDemoPreviewKey,
  CyDemoDataDocSection[]
> = {
  KeyFeatureCase1: [
    {
      title: "根对象（KeyFeatureCase1 → data）",
      rows: [
        { field: "kicker", desc: "区块角标 / 小标题。" },
        { field: "decorIndex", desc: "装饰序号等展示用字符串。" },
        { field: "sectionTitle", desc: "区块主标题。" },
        { field: "subtitle", desc: "副标题。" },
        { field: "items", desc: "功能卡片列表；每项类型见下表「items[] 单项」。" },
        {
          field: "titleLayout?",
          desc: "标题区布局 id（CyTitleLayoutId，如 headerVertical）。Demo 顶部下拉会覆盖并写入复制 JSON。",
        },
      ],
    },
    {
      title: "items[] 单项（KeyFeatureItem）",
      rows: [
        { field: "title", desc: "卡片标题。" },
        { field: "text", desc: "卡片正文文案。" },
        { field: "bestFor", desc: "适用场景文案。" },
        {
          field: "image",
          desc: "图片模式：单图地址（https 外链或站点内路径如 /video/hero/cover.png）。与 video 二选一。",
        },
        {
          field: "video + videoPoster",
          desc: "视频模式：须同时提供非空字符串。`video` 为视频地址，`videoPoster` 为封面图。与 image 二选一；运行时若二者均满足则优先按视频渲染。",
        },
      ],
    },
  ],
  KeyFeatureCase2: [
    {
      title: "根对象（KeyFeatureCase2 → data）",
      rows: [
        { field: "kicker", desc: "区块角标 / 小标题。" },
        { field: "decorIndex", desc: "装饰序号等展示用字符串。" },
        { field: "sectionTitle", desc: "区块主标题。" },
        { field: "subtitle", desc: "副标题。" },
        { field: "cards", desc: "横向展开受众卡列表；每项类型见下表「cards[] 单项」。" },
        {
          field: "titleLayout?",
          desc: "标题区布局 id（CyTitleLayoutId）。Demo 顶部下拉会覆盖并写入复制 JSON。",
        },
      ],
    },
    {
      title: "cards[] 单项（KeyFeatureCase2Card）",
      rows: [
        { field: "title", desc: "卡片标题。" },
        { field: "description", desc: "卡片说明文案。" },
        { field: "ctaLabel", desc: "行动按钮文案（预留）。" },
        { field: "ctaHref", desc: "行动按钮链接（预留）。" },
        {
          field: "image",
          desc: "图片模式：单图地址。与 video / videoPoster 二选一。",
        },
        {
          field: "video + videoPoster",
          desc: "视频模式：须同时非空；桌面与移动端均用 CyInlineMedia（悬停播放、离开暂停、角标静音切换）。",
        },
      ],
    },
  ],
};

export const keyFeatureDemoFieldDocsTypesPath = "components/cy/KeyFeature/types.ts";
export const keyFeatureDemoFieldDocsLayoutPath = "cy-title-layout.config.ts";
