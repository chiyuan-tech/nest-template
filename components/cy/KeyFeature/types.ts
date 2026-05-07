import type { CyTitleLayoutId } from "@/components/cy/headerLayout/cy-title-layout.config";

export interface KeyFeatureItemBase {
  title: string;
  text: string;
  bestFor: string;
}

/** 图片卡片：提供 `image`（外链或 `/public` 下以 `/` 开头的路径）。 */
export interface KeyFeatureItemImage extends KeyFeatureItemBase {
  image: string;
}

/** 视频卡片：同时提供 `video` 与 `videoPoster`，不要与 `image` 混用。 */
export interface KeyFeatureItemVideo extends KeyFeatureItemBase {
  video: string;
  videoPoster: string;
}

export type KeyFeatureItem = KeyFeatureItemImage | KeyFeatureItemVideo;

export interface KeyFeatureCase1Data {
  kicker: string;
  decorIndex: string;
  sectionTitle: string;
  subtitle: string;
  items: KeyFeatureItem[];
  /** 标题区布局 id；未传时组件内默认为 headerVertical */
  titleLayout?: CyTitleLayoutId;
}

export interface KeyFeatureCase2CardBase {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

/** 横向展开卡：仅图（无视频） */
export interface KeyFeatureCase2CardImage extends KeyFeatureCase2CardBase {
  image: string;
}

/** 横向展开卡：视频 + 封面（媒体由 CyInlineMedia 渲染） */
export interface KeyFeatureCase2CardVideo extends KeyFeatureCase2CardBase {
  video: string;
  videoPoster: string;
}

export type KeyFeatureCase2Card = KeyFeatureCase2CardImage | KeyFeatureCase2CardVideo;

export interface KeyFeatureCase2Data {
  kicker: string;
  decorIndex: string;
  sectionTitle: string;
  subtitle: string;
  cards: KeyFeatureCase2Card[];
  titleLayout?: CyTitleLayoutId;
}
