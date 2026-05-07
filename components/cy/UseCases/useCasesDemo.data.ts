import type { CyDemoDataDocSection } from "@/components/cy/common/cy-demo-data-field-docs.types";

export type UseCasesGridDemoPreviewKey = "UseCasesGalleryCase1";

export const useCasesGridDemoDataFieldDocSections: Record<
  UseCasesGridDemoPreviewKey,
  CyDemoDataDocSection[]
> = {
  UseCasesGalleryCase1: [
    {
      title: "根对象（UseCasesGalleryCase1 → data）",
      rows: [
        { field: "kicker", desc: "区块角标 / 小标题。" },
        { field: "decorIndex", desc: "装饰序号等展示用字符串。" },
        { field: "sectionTitle", desc: "区块主标题。" },
        { field: "subtitle", desc: "副标题 / 说明段落。" },
        { field: "items", desc: "Masonry 画廊条目列表；每项类型见下表「items[] 单项」。" },
        {
          field: "titleLayout?",
          desc: "标题区布局 id（CyTitleLayoutId，如 headerVertical）。Demo 顶部下拉会覆盖并写入复制 JSON。",
        },
      ],
    },
    {
      title: "items[] 单项（UseCasesGalleryItem）",
      rows: [
        { field: "id", desc: "条目唯一标识。" },
        { field: "img", desc: "图片 URL。" },
        { field: "url", desc: "点击跳转链接。" },
        { field: "desc", desc: "说明或 prompt 文案。" },
        { field: "height", desc: "Masonry 预估高度（像素）。" },
      ],
    },
  ],
};

export const useCasesGridDemoFieldDocsTypesPath = "components/cy/UseCases/types.ts";
export const useCasesGridDemoFieldDocsLayoutPath = "cy-title-layout.config.ts";
