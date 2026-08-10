import type { CyTitleLayoutId } from "@/components/cy/headerLayout/cy-title-layout.config";

/** Masonry 单项（与 @/components/shadcn/Masonry/page 的 Item 对齐） */
export interface UseCasesGalleryItem {
  id: string;
  img: string;
  /** Optional local video. When present with poster, Masonry renders a lazy full-frame video instead of a still tile. */
  video?: string;
  /** Required with video; also used as the image fallback while the clip is deferred. */
  poster?: string;
  /** Accessible description of the observable clip content. */
  alt?: string;
  url: string;
  desc: string;
  height: number;
  /** Intrinsic source dimensions used by Masonry to preserve the real media ratio. */
  mediaWidth?: number;
  mediaHeight?: number;
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
