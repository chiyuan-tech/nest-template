# 标题区布局（headerLayout）集成说明

本目录提供**全局可配置的标题布局 id**、**下拉选择组件**，以及 **Testimonial 模块专用的标题渲染映射**。目标：新增标题方案或新模块时，尽量只改配置与映射，不在业务组件里堆 `if/else`。

---

## 目录内文件分工

| 文件 | 作用 |
|------|------|
| `cy-title-layout.config.ts` | **单一数据源**：可选布局列表 `cyTitleLayoutCatalog`、类型 `CyTitleLayoutId`、下拉用 `cyTitleLayoutList`、`getCyTitleLayoutMeta`、各模块默认布局 `defaultCyTitleLayoutByModuleKey`。 |
| `CyTitleLayoutSelect.tsx` | Client 组件：根据 catalog 渲染「标题区」下拉框。 |
| `cy-testimonial-title.tsx` | Testimonial Case1/Case2 的标题区 UI：**按 `CyTitleLayoutId` 的 `Record` 映射**到具体标题组件。 |
| `cy-title-layouts.ts` | 对 `cy-title-layout.config` 的 re-export，兼容旧 import；新代码建议直接 import config。 |
| `headerVertical.tsx` / `homeSplitHeader.tsx` | 具体标题区展示组件。 |

---

## 使用方式

### 1. 在数据里带上 `titleLayout`

与 `CyTitleLayoutId` 一致的字符串写在**配置 JSON 根级**（不要放在 `__` 前缀字段里，否则 `cyBlockData` 会删掉，页面拿不到）。

```tsx
import type { CyTitleLayoutId } from "@/components/cy/headerLayout/cy-title-layout.config";

// 示例：data 类型里增加可选字段
titleLayout?: CyTitleLayoutId;
```

页面侧示例（与当前 `app/page.tsx` 一致）：

```tsx
<TestimonialGridCase1 data={cyBlockData(cyTemplate["TestimonialGridCase1"] as Record<string, unknown>) as never} />
```

模板 / `cy-modules` 中示例：

```json
{
  "TestimonialGridCase1": {
    "titleLayout": "headerVertical",
    "__cyComponentPath": "@/components/cy/UsersSay/testimonial_grid_case1.tsx"
  }
}
```

### 2. Demo 里需要下拉切换时

- 初始值从 **`defaultCyTitleLayoutByModuleKey`** 取，避免各 Demo 写死字符串。
- 使用 **`CyTitleLayoutSelect`**，受控 `value` + `onValueChange`。
- 把当前选中的 id 写进传给 Case 的 **`data.titleLayout`**（或复制 JSON 时用 `formatCyModuleConfigEntry` / `copyCyModuleConfigJson` 的 **`mergeRoot: { titleLayout: ... }`**）。

```tsx
import { CyTitleLayoutSelect } from "@/components/cy/headerLayout/CyTitleLayoutSelect";
import {
  defaultCyTitleLayoutByModuleKey,
  type CyTitleLayoutId,
} from "@/components/cy/headerLayout/cy-title-layout.config";

const [titleLayout, setTitleLayout] = useState<CyTitleLayoutId>(
  defaultCyTitleLayoutByModuleKey.TestimonialGridCase1
);

<CyTitleLayoutSelect
  value={titleLayout}
  onValueChange={setTitleLayout}
  ariaLabel="标题区布局"
  id="my-demo-title-layout"
  triggerClassName="sm:w-[220px]"
/>
```

### 3. Testimonial 区块内渲染标题

Case 组件内部已改为使用 **`CyTestimonialTitleCase1` / `CyTestimonialTitleCase2`**，根据 **`data.titleLayout`** 查映射表，无需再手写分支。

---

## 集成时要改哪些文件

### A. 新增一种标题布局（新 id + 新 UI）

1. **`cy-title-layout.config.ts`**  
   - 在 `cyTitleLayoutCatalog` 中追加一项：`id`（唯一）、`label`（下拉文案）、`componentPath`（文档/复制用路径）。  
   - 保存后 `CyTitleLayoutId` 会自动包含新 id。

2. **实现实际标题组件**（若尚未存在）  
   - 例如在本目录新增 `xxxHeader.tsx`，并在映射里引用。

3. **`cy-testimonial-title.tsx`**（若 Testimonial 也要用新布局）  
   - 在 `testimonialCase1TitleByLayoutId` 与 `testimonialCase2TitleByLayoutId` 两个 **`Record<CyTitleLayoutId, …>`** 中各补**一行**；TypeScript 会要求覆盖所有 id，避免漏改。

4. **其它业务模块**  
   - 若该模块有自己的标题切换逻辑：新建类似 `cy-xxx-title.tsx`，同样用 **`Record<CyTitleLayoutId, (data) => ReactNode>`**，不要散落 `if/else`。

5. **（可选）** `cy_templeate.json` / `cy-modules.config.json`  
   - 为对应块增加或更新 `"titleLayout": "<新id>"`。

### B. 新模块也要用「全局默认 + 下拉」

1. **`cy-title-layout.config.ts`**  
   - 在 **`defaultCyTitleLayoutByModuleKey`** 中增加你的模块 key（与 `cy-modules` / `cy_templeate` 顶层 key 一致）及默认 `CyTitleLayoutId`。

2. **模块的 `data` 类型**（如 `components/cy/.../types.ts`）  
   - 增加 `titleLayout?: CyTitleLayoutId`。

3. **模块组件**  
   - 从 `data.titleLayout` 读取；标题区 UI 建议集中到单独文件 + **id 映射表**。

4. **Demo 页**  
   - 使用 `CyTitleLayoutSelect` + `defaultCyTitleLayoutByModuleKey.你的Key`；预览/复制逻辑可参考 `UsersSay/TestimonialGridDemo.tsx` 中的 **`testimonialDemoGridPreviewByKey`** 等映射写法。

### C. 仅消费配置类型（无 UI）

```ts
import type { CyTitleLayoutId } from "@/components/cy/headerLayout/cy-title-layout.config";
import { getCyTitleLayoutMeta } from "@/components/cy/headerLayout/cy-title-layout.config";
```

---

## 与 `cy-title-layouts.ts` 的关系

新代码请优先：

```ts
import { … } from "@/components/cy/headerLayout/cy-title-layout.config";
import { CyTitleLayoutSelect } from "@/components/cy/headerLayout/CyTitleLayoutSelect";
```

`cy-title-layouts.ts` 仅 `export * from "./cy-title-layout.config"`，便于旧路径不改也能编译；不必在新功能里依赖该文件名。

---

## 参考实现

- 下拉 + 默认布局 + 复制合并：`components/cy/UsersSay/TestimonialGridDemo.tsx`  
- 标题 id → 组件映射：`components/cy/headerLayout/cy-testimonial-title.tsx`  
- 剪贴板合并根字段：`components/cy/utils.ts` 中的 `mergeRoot` 与 `formatCyModuleConfigEntry`
