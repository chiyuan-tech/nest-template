---
name: cy-register-module
description: Registers a new internal CY gallery module under components/cy following CY_CODEGEN.md section 8—types, case component, cy-modules.config.json, XxxDemo.tsx with grid toolbar plus CyDemoDataFieldDocs from common and field-doc data in XxxDemo.data.ts co-located with the Demo, registry.ts, demo-map.tsx, optional cy-title-layout.config.ts. When user-attached or in-scope source contains an h2 element (JSX h2 tag), performs the title-layout step. Use when the user adds or drops a folder in components/cy, asks to register a CY module, wire /cy demos, or match KeyFeatureDemo-style preview UX.
disable-model-invocation: true
---

# CY 新模块注册（画廊）

## 何时使用

用户在 `components/cy` 下**新建或拖入文件夹**、要求「注册 CY 模块」「接上 `/cy`」「和 KeyFeature 一样的宫格 + 右上角按钮」「按文档第 8 步」时，按本 skill 执行。完整分步说明见仓库 [`components/cy/CY_CODEGEN.md`](../../../components/cy/CY_CODEGEN.md)（从 **§8 分步教程** 起）。

## 拖入文件夹时的推断规则

1. **根路径**：新模块目录应为 `components/cy/<Domain>/`（PascalCase 或首字母大写的领域名，如 `Spotlight`、`Pricing`）。
2. **若文件夹内已有文件**：在其基础上补全缺失项；不要重写已有业务逻辑，除非用户明确要求。
3. **若为空文件夹或仅有占位**：向用户确认或根据目录名推断：
   - **Case 导出名**（如 `SpotlightBannerCase1`）— 须与 **`cy-modules.config.json` 根 key**、**`copyCyModuleConfigJson` 第一个参数**、Demo 的 **`previewItems[].key`** 完全一致。
   - **画廊路由**：`categorySlug`（`CyCategorySlug` 联合类型或新增一项）与 `demoSlug`（URL 段）；`demo-map` 键为 `` `${categorySlug}/${demoSlug}` ``。
4. **Case 文件路径与序号（须连续）**：在同一 `components/cy/<Domain>/` 目录下，若已存在 `*_case1.tsx`、`*_case2.tsx`…，则**下一个**新 case 必须为 **`*_case{N}.tsx`**，其中 **`N` = 当前最大序号 + 1**（例如已有 `testimonial_grid_case1.tsx`，则新建 `testimonial_grid_case2.tsx`）。**组件导出名、`XxxCase{N}Data` 类型名、`cy-modules` 键、PreviewKey 均与同一序号 `N` 对齐**；勿跳号、勿在同目录使用另一套无关联文件名，除非用户明确要求替换某一版。
5. **`__cyComponentPath` 与 import**：复制配置时由 `copyCyModuleConfigJson` 写入剪贴板；源码 import 使用 `@/components/cy/<Domain>/...` 无扩展名或 `.tsx`（与现有 Demo 一致即可）。

## Demo 文件职责拆分（与当前仓库一致）

新建或补全画廊 Demo 时，**不要**在 `*Demo.tsx` 里再内联一整份「配置说明」Accordion + 大段 `dataFieldDocSectionsByKey`（旧模式）。按现结构拆成三处：

| 职责 | 位置 |
|------|------|
| **字段说明 UI**（折叠面板 + 表格 + 页脚「类型定义见…」） | [`components/cy/common/CyDemoDataFieldDocs.tsx`](../../../components/cy/common/CyDemoDataFieldDocs.tsx)，类型见 [`cy-demo-data-field-docs.types.ts`](../../../components/cy/common/cy-demo-data-field-docs.types.ts) |
| **字段说明数据**（各 `PreviewKey` → `CyDemoDataDocSection[]`，及 `typesPathLabel` / `layoutPathLabel` 文案常量） | 与 `*Demo.tsx` **同级**的 **`*Demo.data.ts`**（如 `KeyFeatureDemo.data.ts`、`TestimonialGridDemo.data.ts`） |
| **交互与预览**（`previewItems`、`useState`、`Dialog`、`CyTitleLayoutSelect`、复制逻辑等） | 仍放在 **`*Demo.tsx`** |

`*Demo.tsx` 中用法示例：

```tsx
import { CyDemoDataFieldDocs } from "@/components/cy/common/CyDemoDataFieldDocs";
import {
  keyFeatureDemoDataFieldDocSections,
  keyFeatureDemoFieldDocsLayoutPath,
  keyFeatureDemoFieldDocsTypesPath,
  type KeyFeatureDemoPreviewKey,
} from "@/components/cy/KeyFeature/KeyFeatureDemo.data";

<CyDemoDataFieldDocs
  sections={keyFeatureDemoDataFieldDocSections[item.key]}
  typesPathLabel={keyFeatureDemoFieldDocsTypesPath}
  layoutPathLabel={keyFeatureDemoFieldDocsLayoutPath}
/>
```

无标题布局复制的模块（如 FAQ）可省略 **`layoutPathLabel`**。某 `PreviewKey` 无说明时对应 `sections` 为 **`[]`**，`CyDemoDataFieldDocs` 会渲染 **`null`**（见 `FaqCase2`）。

## 步骤 7 触发条件（`h2`）

在继续下面检查表之前，**扫描**用户消息、附件、选区或正在迁入的模块源码中是否出现 **`<h2` 开头的 JSX/HTML 标签**（即区块自带二级标题、常与 CY 标题区布局联动）。

- **若存在 `<h2`**：必须执行 **步骤 7** — 更新 `components/cy/headerLayout/cy-title-layout.config.ts` 的 `defaultCyTitleLayoutByModuleKey`（为新模块 data key 配默认 `CyTitleLayoutId`）；在 `*Demo.tsx` 与全屏 Dialog 中接入 **`CyTitleLayoutSelect`**，且 `copyCyModuleConfigJson` 使用 **`mergeRoot: { titleLayout }`**；若 case 已改用 **`CyTestimonialTitleCase1`** 与配置里的 `titleLayout` 字段，保持与 KeyFeature 一致。
- **若不存在 `<h2`**：跳过步骤 7（不在 `cy-title-layout.config.ts` 增加条目，Demo 也不必标题布局下拉），除非用户**明确**仍要标题布局能力。

## 执行顺序（对齐 CY_CODEGEN §8）

按顺序完成；每步完成后在回复中勾选进度。步骤 7 是否执行以 **§「步骤 7 触发条件」** 为准。

```
- [ ] 1. types.ts：导出 `XxxCase{N}Data`（与 `cy-modules` 中该 key 的 JSON 字段一致；`N` 为目录内下一个连续序号）
- [ ] 2. case 组件：文件 `…_case{N}.tsx`，具名导出 `XxxCase{N}`，props `{ data: XxxCase{N}Data }`；hooks 则 `"use client"`；可点击元素 `cursor-pointer`
- [ ] 3. cy-modules.config.json：根对象新增 key，仅业务字段（无 `__`）
- [ ] 4a. *Demo.data.ts：与 Demo 同级；导出 `*DemoPreviewKey`、`xxxDemoDataFieldDocSections: Record<PreviewKey, CyDemoDataDocSection[]>` 及页脚路径常量（无标题布局则只导出 types 路径）
- [ ] 4b. *Demo.tsx：宫格 + 顶栏工具栏 + **`<CyDemoDataFieldDocs … />`**（卡片内与全屏 Dialog 内各一处，需时）+ 全屏 Dialog + Usage（见 reference.md）
- [ ] 5. registry.ts：`CyCategorySlug`（如需）+ `cyRegistry` 条目；slug 与 demo-map 一致
- [ ] 6. demo-map.tsx：`import` Demo + `"${category}/${demo}": XxxDemo`
- [ ] 7. headerLayout/cy-title-layout.config.ts + Demo 标题布局：**仅当** §「步骤 7 触发条件」判定为真（代码中含 `<h2`）时执行；否则跳过并注明「无 h2，已跳过」
```

**说明：** 本 skill **不包含**编辑根目录 `cy_templeate.json` 或执行 `npm run cy` 生成落地页；若需要该流程，见仓库 [`components/cy/CY_CODEGEN.md`](../../../components/cy/CY_CODEGEN.md) 中生成页章节，与用户单独约定即可。

## Demo 行为硬性要求（「宫格 + 右上角交互」）

必须与 **`components/cy/KeyFeature/KeyFeatureDemo.tsx`** 对齐，除非用户明确要简化：

| 区域 | 要求 |
|------|------|
| 布局 | `grid grid-cols-1 gap-4 md:grid-cols-2`（多 case 两列；单 case 也建议保留 `md:grid-cols-2` 与 KeyFeature 一致，便于后续加卡片） |
| 每张卡顶栏右侧 | **刷新**（`RefreshCw`，递增版本 remount）、**全屏**（`Maximize2` + `Dialog` 占满视口）、**复制 JSON**（`Copy`/`Check` + `copyCyModuleConfigJson` + 约 2s 成功态） |
| 标题布局 | 当触发 §「步骤 7 触发条件」（含 `<h2`）或用户要求标题布局时：case 使用 `CyTestimonialTitleCase1` + `titleLayout`；顶栏与 Dialog 内均放 **`CyTitleLayoutSelect`**，复制时 **`mergeRoot: { titleLayout }`** |
| 按钮 | 所有交互按钮含 **`cursor-pointer`** |
| 配置说明 | 使用 **`CyDemoDataFieldDocs`** + 同目录 **`*Demo.data.ts`** 中的 `sections`；勿在 Demo 内重复实现 Accordion 表格 |
| 预览区 | 固定可视高度 + 内部滚动（如 `h-[82vh] overflow-y-auto`） |
| 全屏 | `DialogContent` 使用与 KeyFeature 相同的全屏 class（见 reference.md） |

细节与 class 片段见 [reference.md](reference.md)。

## 复制配置（剪贴板）

- `copyCyModuleConfigJson(key, cyModulesConfig, { sourceFilePath: "@/components/cy/.../case.tsx" })`；需要标题布局时加 `mergeRoot`。
- **`cy-modules.config.json` 不写 `__*`**；`__cyComponentPath` **仅**由复制函数写入**剪贴板**，供用户在其它流程中自行粘贴；本 skill 不要求、也不操作任何「模板 JSON」文件。

## 不要做的事

- 不要改 `scripts/cy-generate.mjs` 行为，除非用户单独要求。
- **不要**在本 skill 执行范围内编辑 **`cy_templeate.json`** 或代用户运行 **`npm run cy`**（生成落地页由 `CY_CODEGEN.md` 与用户另行约定）。
- 不要删除其他模块的 `registry` / `demo-map` 条目。
- 不要引入未使用的依赖或大范围格式化无关文件。
- 不要在 `*Demo.tsx` 里复制粘贴一套独立的「配置说明」Accordion（应使用 **`CyDemoDataFieldDocs`** + **`*Demo.data.ts`**）。

## 延伸阅读

- 流程与规范全文：[`components/cy/CY_CODEGEN.md`](../../../components/cy/CY_CODEGEN.md)（§7 决策 + §8 分步 + §9 速查 + §3.1 Skill 用法）
- Demo 布局与工具栏对齐：[`components/cy/KeyFeature/KeyFeatureDemo.tsx`](../../../components/cy/KeyFeature/KeyFeatureDemo.tsx) + 同级 [`KeyFeatureDemo.data.ts`](../../../components/cy/KeyFeature/KeyFeatureDemo.data.ts)
- 公共配置说明组件：[`components/cy/common/CyDemoDataFieldDocs.tsx`](../../../components/cy/common/CyDemoDataFieldDocs.tsx)
