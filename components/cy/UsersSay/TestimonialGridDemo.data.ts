import type { CyDemoDataDocSection } from "@/components/cy/common/cy-demo-data-field-docs.types";

export type TestimonialGridDemoPreviewKey =
  | "TestimonialGridCase1"
  | "TestimonialGridCase2"
  | "TestimonialGridCase3";

export const testimonialGridDemoDataFieldDocSections: Record<
  TestimonialGridDemoPreviewKey,
  CyDemoDataDocSection[]
> = {
  TestimonialGridCase1: [
    {
      title: "根对象（TestimonialGridCase1 → data）",
      rows: [
        { field: "kicker", desc: "区块角标 / 小标题。" },
        { field: "decorIndex", desc: "装饰序号等展示用字符串。" },
        { field: "sectionTitle", desc: "区块主标题。" },
        { field: "subtitle", desc: "副标题。" },
        {
          field: "items",
          desc: "推文卡片列表；每项类型见下表「items[] 单项」",
        },
        {
          field: "titleLayout?",
          desc: "标题区布局 id（CyTitleLayoutId，如 headerVertical）。Demo 顶部下拉会覆盖并写入复制 JSON。",
        },
        {
          field: "dragThresholdPx?",
          desc: "拖拽判定像素阈值；不传则按指针类型（触控 / 鼠标）自动取值。",
        },
      ],
    },
    {
      title: "items[] 单项（TweetFeedbackItem）",
      rows: [
        { field: "tweetId", desc: "推文唯一标识（展示或 key 用）。" },
        { field: "accountName", desc: "显示名称。" },
        { field: "handle", desc: "@ 用户名。" },
        { field: "avatarSrc", desc: "头像图片 URL。" },
        { field: "mediaSrc", desc: "配图 URL 数组。" },
        { field: "timestamp", desc: "时间文案。" },
        { field: "likesLabel", desc: "点赞数文案。" },
        { field: "repliesLabel", desc: "回复数文案。" },
        { field: "footerReplyLabel", desc: "底部回复区文案。" },
        {
          field: "contentLines",
          desc: "正文：字符串，或按行拆分的 string[]。",
        },
      ],
    },
  ],
  TestimonialGridCase2: [
    {
      title: "根对象（TestimonialGridCase2 → data）",
      rows: [
        { field: "kicker", desc: "区块角标 / 小标题。" },
        { field: "decorIndex", desc: "装饰序号等展示用字符串。" },
        { field: "title", desc: "区块主标题。" },
        { field: "description", desc: "头部说明段落（纯文本）。" },
        {
          field: "items",
          desc: "评价卡片列表；每项类型见下表「items[] 单项」。",
        },
        {
          field: "titleLayout?",
          desc: "标题区布局 id（如 homeSplitHeader）。Demo 顶部下拉会覆盖并写入复制 JSON。",
        },
      ],
    },
    {
      title: "items[] 单项（TestimonialGridCase2Item）",
      rows: [
        { field: "quote", desc: "引用正文。" },
        { field: "author", desc: "作者姓名。" },
        { field: "role", desc: "职位或身份。" },
        { field: "location", desc: "地区或公司。" },
        { field: "avatar", desc: "头像图片 URL。" },
      ],
    },
  ],
  TestimonialGridCase3: [
    {
      title: "根对象（TestimonialGridCase3 → data）",
      rows: [
        { field: "kicker", desc: "区块角标 / 小标题。" },
        { field: "decorIndex", desc: "装饰序号等展示用字符串。" },
        { field: "sectionTitle", desc: "区块主标题（CyTestimonialTitleCase1）。" },
        { field: "subtitle", desc: "副标题。" },
        {
          field: "testimonials",
          desc: "轮播卡片列表；每项见下表「testimonials[] 单项」。",
        },
        {
          field: "titleLayout?",
          desc: "标题区布局 id（CyTitleLayoutId）。Demo 下拉会覆盖并写入复制 JSON。",
        },
        { field: "sectionId?", desc: "section 元素 id，默认 SocialProof。" },
        { field: "autoplayDelayMs?", desc: "自动轮播间隔（毫秒），默认 3000。" },
        { field: "stopOnInteraction?", desc: "交互后是否停止自动播放，默认 false。" },
      ],
    },
    {
      title: "testimonials[] 单项（TestimonialGridCarouselQuote）",
      rows: [
        { field: "id", desc: "唯一标识（用于 key）。" },
        { field: "name", desc: "评价人姓名。" },
        { field: "role", desc: "职位或公司。" },
        { field: "content", desc: "评价正文。" },
        { field: "rating", desc: "星级数量。" },
        { field: "avatar", desc: "头像路径或 URL。" },
      ],
    },
  ],
};

export const testimonialGridDemoFieldDocsTypesPath = "components/cy/UsersSay/types.ts";
export const testimonialGridDemoFieldDocsLayoutPath = "cy-title-layout.config.ts";
