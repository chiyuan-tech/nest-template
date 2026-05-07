/**
 * 全局标题区布局：下拉选项、类型、各模块默认 titleLayout。
 * 新增标题组件：在此追加 catalog 项，并在 cy-testimonial-title.tsx 的 id→渲染映射中补一行（或其它模块的同类 Record）。
 * 新增使用标题的模块：在 defaultCyTitleLayoutByModuleKey 中增加模块 key 与默认布局 id。
 */

export const cyTitleLayoutCatalog = [
  {
    id: "headerVertical" as const,
    label: "Header Vertical",
    componentPath: "@/components/cy/headerLayout/common/headerVertical.tsx",
  },
  {
    id: "homeSplitHeader" as const,
    label: "Home Split Header",
    componentPath: "@/components/cy/headerLayout/common/homeSplitHeader.tsx",
  },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  componentPath: string;
}>;

export type CyTitleLayoutId = (typeof cyTitleLayoutCatalog)[number]["id"];

/** 供下拉等遍历（与 catalog 同步） */
export const cyTitleLayoutList = cyTitleLayoutCatalog as readonly {
  id: CyTitleLayoutId;
  label: string;
  componentPath: string;
}[];

export function getCyTitleLayoutMeta(id: CyTitleLayoutId) {
  const found = cyTitleLayoutCatalog.find((x) => x.id === id);
  if (!found) return cyTitleLayoutCatalog[0];
  return found;
}

/**
 * 各「模块配置 key」（如 cy-modules / Demo 的顶层 key）对应的默认 titleLayout。
 * Demo 与其它引用方应从此读取初始值，避免在各文件硬编码。
 */
export const defaultCyTitleLayoutByModuleKey = {
  TestimonialGridCase1: "headerVertical",
  TestimonialGridCase2: "homeSplitHeader",
  TestimonialGridCase3: "headerVertical",
  UseCasesGalleryCase1: "headerVertical",
  KeyFeatureCase1: "headerVertical",
  KeyFeatureCase2: "headerVertical",
  HowToStepsCase1: "headerVertical",
  ComparisonTableCase1: "headerVertical",
} as const satisfies Record<string, CyTitleLayoutId>;

export type CyTitleLayoutModuleKey = keyof typeof defaultCyTitleLayoutByModuleKey;
