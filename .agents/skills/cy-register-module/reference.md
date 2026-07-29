# CY 新模块：Demo 宫格、工具栏与配置说明（对齐当前仓库）

布局与交互的完整参考：**[`KeyFeatureDemo.tsx`](../../../components/cy/KeyFeature/KeyFeatureDemo.tsx)**。  
字段说明的**数据**见同级 [`KeyFeatureDemo.data.ts`](../../../components/cy/KeyFeature/KeyFeatureDemo.data.ts)；**视图**用公共组件 [`CyDemoDataFieldDocs.tsx`](../../../components/cy/common/CyDemoDataFieldDocs.tsx)。

## 宫格

- 外层：`<section className="space-y-4">`
- 卡片列表：`grid grid-cols-1 gap-4 md:grid-cols-2`（**多 case 必须两列**；单 case 也建议写上 `md:grid-cols-2`，与 KeyFeature 一致，后续加卡片不必改外层 class）

## 单张卡片结构

1. **顶栏**（`border-b px-4 py-3`，小屏纵向、大屏横向 `sm:flex-row sm:items-center sm:justify-between`）
   - 左侧：`<h3>` 案例标题（来自 `previewItems[].title`）
   - 右侧工具组（`flex flex-wrap items-center justify-end gap-2`），顺序建议：
     - **刷新**：`RefreshCw`，`onClick` 递增 `refreshVersion[key]`，预览区 `key` 含 version 以 remount
     - **全屏**：`Maximize2`，`setActivePreview(key)`
     - **复制配置**：`Copy` / 成功 `Check`，`copyCyModuleConfigJson(key, cyModulesConfig, { sourceFilePath, mergeRoot? })`，`copiedKey` + 2s 复位
     - **标题布局**（若模块用 `CyTestimonialTitleCase1`）：`CyTitleLayoutSelect`，state `titleLayoutByKey`，复制时 `mergeRoot: { titleLayout }`
   - 所有 `Button` 加 `className="cursor-pointer"`（含 `size="icon"`）

2. **配置说明**：在顶栏与预览区之间插入 **`CyDemoDataFieldDocs`**（勿手写 Accordion + dl 表格）：
   - **`sections`**：`Record<PreviewKey, CyDemoDataDocSection[]>` 中当前 key 的数组，数据来自 **`*Demo.data.ts`**
   - **`typesPathLabel`**：页脚展示用，如 `components/cy/KeyFeature/types.ts`
   - **`layoutPathLabel`**：可选；有标题布局复制需求时传，如 `cy-title-layout.config.ts`
   - 某 key 无文档时对应 **`[]`**，组件返回 **`null`**（不占位）

3. **预览区**：`h-[82vh] overflow-hidden overflow-y-auto`，内层渲染 case，`key`/`refreshVersion` 驱动 remount

4. **Usage 区**：`border-t bg-muted/30`，`<pre><code>{usageCode}</code></pre>` + 一行说明复制行为；可注明剪贴板中的 **`__cyComponentPath`** 为可选元数据（本 skill 不要求维护任何模板 JSON 文件）

## `*Demo.data.ts` 约定（数据与视图分离）

与 `XxxDemo.tsx` **同目录**、同名后缀 **`.data.ts`**：

- 导出 **`XxxDemoPreviewKey`**（或等价 union），供 Demo 与 `Record<PreviewKey, …>` 对齐
- 导出 **`xxxDemoDataFieldDocSections`**：`Record<PreviewKey, CyDemoDataDocSection[]>`，结构为 `{ title, rows: { field, desc }[] }[]`
- 导出页脚字符串常量，如 **`xxxDemoFieldDocsTypesPath`**、**`xxxDemoFieldDocsLayoutPath`**（后者可省略）
- 类型 **`CyDemoDataDocSection`** / **`CyDemoDataDocRow`** 从 **`@/components/cy/common/cy-demo-data-field-docs.types`** import

**全屏 Dialog** 内若也有配置说明，再渲染一处 **`CyDemoDataFieldDocs`**，通常带 **`className="px-5"`**，`sections` 同源。

## 全屏 Dialog

- `Dialog` + `DialogContent`：`!top-0 !left-0 !h-screen !w-screen !max-w-none !translate-x-0 !translate-y-0 overflow-y-auto rounded-none`
- `DialogHeader`：标题 +（若有）`CyTitleLayoutSelect`
- 内容与卡片内预览共用同一 `render*Preview` 函数，避免两套逻辑分叉

## 类型与数据（仍留在 `*Demo.tsx` 的部分）

- **`previewItems`**：`key`（与 `cy-modules` / `copyCyModuleConfigJson` 第一个参数一致）、`title`、`sourceFilePathForCopy`、`usageCode`、`props`（来自 `cyModulesConfig.*`）等——**可**继续写在 Demo 内；若团队后续要再拆到 `.data.ts`，与本文「字段说明已拆」不冲突。
- **`PreviewKey`**：推荐从 **`*Demo.data.ts`** re-export 的类型别名，避免与 `Record` 键不一致。

## 须改动的仓库文件（清单）

见主 `SKILL.md` 检查表；路径均以仓库根为基准。

## Case 序号（与 SKILL 一致）

同一目录下已存在 `*_case1.tsx` 时，新增 case 须为 **`*_case2.tsx`**，并同步 **`XxxCase2` / `XxxCase2Data` / `cy-modules` 键 / PreviewKey** 等，按 **`N = max(已有 case 序号) + 1`** 连续递增。
