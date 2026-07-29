import type { CyTitleLayoutId } from "@/components/cy/headerLayout/cy-title-layout.config";

export interface TweetFeedbackItem {
  tweetId: string;
  accountName: string;
  handle: string;
  avatarSrc: string;
  mediaSrc: string[];
  timestamp: string;
  likesLabel: string;
  repliesLabel: string;
  footerReplyLabel: string;
  contentLines: string | string[];
}

export interface TestimonialGridCase1Data {
  kicker: string;
  decorIndex: string;
  sectionTitle: string;
  subtitle: string;
  items: TweetFeedbackItem[];
  /** 标题区布局 id；未传时组件内默认为 headerVertical */
  titleLayout?: CyTitleLayoutId;
  /** 覆盖自动判断；未传则按指针类型（触控更大、鼠标更小）动态取值 */
  dragThresholdPx?: number;
}

export interface TestimonialGridCase2Item {
  quote: string;
  author: string;
  role: string;
  location: string;
  avatar: string;
}

export interface TestimonialGridCase2Data {
  kicker: string;
  decorIndex: string;
  title: string;
  /** 头部说明文案（纯文本，组件内用段落展示） */
  description: string;
  items: TestimonialGridCase2Item[];
  /** 标题区布局 id；未传时组件内默认为 homeSplitHeader */
  titleLayout?: CyTitleLayoutId;
}

/** 轮播评价卡片单项（对齐 layoutHome TestimonialsSection） */
export interface TestimonialGridCarouselQuote {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

/** 用户评价轮播：CyTestimonialTitleCase1 + Carousel + Autoplay */
export interface TestimonialGridCase3Data {
  kicker: string;
  decorIndex: string;
  sectionTitle: string;
  subtitle: string;
  testimonials: TestimonialGridCarouselQuote[];
  /** 标题区布局 id；未传时组件内默认为 headerVertical */
  titleLayout?: CyTitleLayoutId;
  /** 外层 section 的 HTML id */
  sectionId?: string;
  /** Autoplay 间隔（ms），默认 3000 */
  autoplayDelayMs?: number;
  /** 用户交互后是否停止自动播放，默认 false */
  stopOnInteraction?: boolean;
}
