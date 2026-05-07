import type { CyTitleLayoutId } from "@/components/cy/headerLayout/cy-title-layout.config";

/** Masonry 单项（与 @/components/shadcn/Masonry/page 的 Item 对齐） */
export interface UseCasesGalleryItem {
  id: string;
  img: string;
  url: string;
  desc: string;
  height: number;
}

export interface UseCasesGalleryCase1Data {
  kicker: string;
  decorIndex: string;
  sectionTitle: string;
  subtitle: string;
  items: UseCasesGalleryItem[];
  /** 标题区布局 id；未传时组件内默认为 headerVertical */
  titleLayout?: CyTitleLayoutId;
}
