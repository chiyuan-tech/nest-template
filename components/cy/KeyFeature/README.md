# KeyFeature（核心能力区块）

本目录提供可配置的功能/卖点展示模块：**`KeyFeatureCase1`**（交错栅格 + `CyInlineMedia`）、**`KeyFeatureCase2`**（桌面横向展开卡 + 移动端栅格）。标题区均使用 CY 公共标题组件 **`CyTestimonialTitleCase1`**；配置数据来自 `components/cy/cy-modules.config.json` 的 `KeyFeatureCase1` / `KeyFeatureCase2`（或任意符合类型的 `data` 对象）。

## 相关文件

| 文件 | 说明 |
|------|------|
| `keyfeatureCase_1.tsx` | 区块组件，接收 `data: KeyFeatureCase1Data`。 |
| `keyfeatureCase_2.tsx` | 横向受众/场景卡，接收 `data: KeyFeatureCase2Data`；桌面与移动端媒体区均使用 **`CyInlineMedia`**（图片 / 视频与 Case1 一致）。 |
| `types.ts` | `KeyFeatureCase1Data`、`KeyFeatureItem`；`KeyFeatureCase2Data`、`KeyFeatureCase2Card`（图片 / 视频联合类型）。 |
| `../utils.ts` | `isKeyFeatureVideoItem()`、`isKeyFeatureCase2VideoCard()`：运行时判断媒体分支。 |
| `KeyFeatureDemo.tsx` | CY 预览页用 Demo（宫格卡片、复制 JSON、标题布局切换），与 `TestimonialGridDemo` 交互一致。 |
| `../CyInlineMedia.tsx` | **全局**内联媒体组件：图片或视频，根节点 `h-full w-full`，由父级控制比例与裁切。 |

## 在线预览

路由：`/cy/key-features/feature-cards`（由 `components/cy/demo-map.tsx` 注册；`KeyFeatureDemo` 内并排预览 **KeyFeatureCase1** 与 **KeyFeatureCase2**）。

## 数据结构：`KeyFeatureCase2Data`

与 Case1 相同标题字段：`kicker`、`decorIndex`、`sectionTitle`、`subtitle`、`titleLayout?`。

| 字段 | 类型 | 说明 |
|------|------|------|
| `cards` | `KeyFeatureCase2Card[]` | 横向卡列表。 |

每条 **`KeyFeatureCase2Card`** 含 `title`、`description`、`ctaLabel`、`ctaHref`，媒体二选一：

- **图片**：`image: string`
- **视频**：`video` + `videoPoster`（判定规则与 Case1 的 `isKeyFeatureVideoItem` 相同，对应工具函数为 **`isKeyFeatureCase2VideoCard`**）

配置示例见根对象 **`KeyFeatureCase2`**（`cy-modules.config.json`）。

## 数据结构：`KeyFeatureCase1Data`

根对象字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `kicker` | `string` | 标题区角标 / 小标题（与 `homeSplitHeader` 等布局配合）。 |
| `decorIndex` | `string` | 装饰序号等展示用文案。 |
| `sectionTitle` | `string` | 区块主标题。 |
| `subtitle` | `string` | 副标题 / 说明段落。 |
| `items` | `KeyFeatureItem[]` | 每条为一张「功能卡片」，见下文。 |
| `titleLayout` | `CyTitleLayoutId`（可选） | 标题区布局 id，默认 `headerVertical`。可选值见 `components/cy/headerLayout/cy-title-layout.config.ts`。 |

## `items[]`：图片项 vs 视频项

每条 `KeyFeatureItem` 在公共字段 **`title` / `text` / `bestFor`** 之外，媒体二选一：

### 图片模式：`KeyFeatureItemImage`

提供 **`image`**（字符串，非空）：

- 外链：`https://...`
- 站内静态资源（`public` 目录）：以 **`/`** 开头，例如 `/video/hero/hf_20260401.png`。

不要与同条目的 `video` / `videoPoster` 混用（若 JSON 误写多组，运行时以「视频判定」为准，见下节）。

### 视频模式：`KeyFeatureItemVideo`

同时提供 **`video`** 与 **`videoPoster`**（均为非空字符串）：

- `video`：视频地址（外链或 `/...` 指向 `public` 下文件）。
- `videoPoster`：封面图，在首帧解码前展示；悬停播放前用户会先看到 poster。

### 运行时判定规则

逻辑在 `components/cy/utils.ts` 的 **`isKeyFeatureVideoItem(item)`**：

1. 若 `video` 与 `videoPoster` 均为非空字符串 → 按 **视频** 渲染（`CyInlineMedia` 的 `variant="video"`）。
2. 否则 → 按 **图片** 渲染，使用字段 **`image`**（请保证图片模式下 `image` 有值，否则会出现空图）。

请勿依赖「同时写两套字段」；维护时只保留一种模式即可。

## 全局媒体组件：`CyInlineMedia`

路径：`components/cy/CyInlineMedia.tsx`。

设计约定：

- 根容器使用 **`h-full w-full min-h-0`**，**不内置固定宽高或比例**；由父级（例如 `KeyFeatureCase1` 里的 `aspect-video` 包裹层）决定布局与裁切。
- 图片：`variant="image"`，内部为 `<img>`，`object-cover` 铺满；可配合父级 `group` 使用 Tailwind `group-hover:scale-105`（本模块已在 `img` 上保留该 class）。
- 视频：`variant="video"`，内部为 `<video>`，同样 `object-cover` 铺满。
- **视频交互**：鼠标**进入**容器调用 `play()`，**离开**调用 `pause()`。为兼容浏览器自动播放策略，视频默认 **`muted` + `playsInline` + `loop`**，仅作预览，不自动打开系统全屏。

### `CyInlineMedia` Props

**图片**

```ts
{
  variant: "image";
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  loading?: "eager" | "lazy";
}
```

**视频**

```ts
{
  variant: "video";
  src: string;
  poster: string;
  className?: string;
  videoClassName?: string;
  /** 可选：叠在视频上、静音按钮下；内部会包一层 `pointer-events-none`，勿再拦截鼠标 */
  videoDecoration?: React.ReactNode;
}
```

在 `KeyFeatureCase1` 中，媒体外层使用 `relative aspect-video w-full overflow-hidden rounded-2xl`，并为 `CyInlineMedia` 传入 `className="absolute inset-0 h-full w-full"`，使媒体填满该区域。若在视频上需要渐变遮罩，请使用 **`videoDecoration`**，**不要**在 `CyInlineMedia` 外层再叠一层默认可点击的 `absolute inset-0` 遮罩，否则会挡住悬停播放与右上角静音按钮。

## 配置示例（摘自 `cy-modules.config.json`）

图片条目：

```json
{
  "title": "Perfect Text Inside Images",
  "text": "...",
  "bestFor": "...",
  "image": "https://cysource.gptimage.tools/home/assets/action_1.jpg?v=1"
}
```

视频条目（示例使用仓库内 `public/video/hero` 资源）：

```json
{
  "title": "Reasoning Before Generating",
  "text": "...",
  "bestFor": "...",
  "video": "/video/hero/hf_20260401.mp4",
  "videoPoster": "/video/hero/hf_20260401.png"
}
```

## 页面中使用

```tsx
import { KeyFeatureCase1 } from "@/components/cy/KeyFeature/keyfeatureCase_1";
import cyModulesConfig from "@/components/cy/cy-modules.config.json";

export default function Page() {
  return <KeyFeatureCase1 data={cyModulesConfig.KeyFeatureCase1} />;
}
```

若自行组装 `data`，只要满足 `KeyFeatureCase1Data` 类型即可；`items` 中可任意混排图片项与视频项。

## 无障碍与键盘

当前视频预览依赖**鼠标悬停**播放；键盘-only 用户无法悬停。若产品需要无障碍完备，可在后续为 `CyInlineMedia` 视频分支增加「聚焦播放 / 失焦暂停」或显式播放按钮（需与用户规则里「按钮加 `cursor-pointer`」一并处理）。

## 故障排查

| 现象 | 建议 |
|------|------|
| 图片裂图 | 外链检查 `next.config.ts` 的 `images.remotePatterns`；本模块图片分支使用原生 `<img>` + `referrerPolicy="no-referrer"`，仍失败时用浏览器 Network 查看状态码与是否被扩展拦截。 |
| 视频不播放 | 确认 `video` URL 可访问；控制台是否报解码错误；部分环境需用户手势才能带声播放，当前为 `muted` 预览。 |
| 视频无封面 | 检查 `videoPoster` 路径是否正确、文件是否存在于 `public` 下。 |
