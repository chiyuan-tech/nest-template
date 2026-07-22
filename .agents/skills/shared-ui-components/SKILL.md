---
name: shared-ui-components
description: Enforces reuse of this repo's shared Navbar, Footer, and PricingSection components. Use when building or editing pages, layouts, landing sections, navigation, footers, pricing UI, or any marketing shell—never invent parallel nav/footer/pricing implementations.
---

# Shared UI Components（强制复用）

开发页面 / layout / 落地页时，导航、页脚、价格区块**必须**复用仓库已有公共组件，禁止另起一套同名或等价实现。

## 硬性规则

| 职责 | 必须使用 | 禁止 |
|------|----------|------|
| 导航 | `@/components/Navbar`（`components/Navbar.tsx`） | 新建 Header/Nav/TopBar 等平行组件；在页面内手写整套导航 |
| 页脚 | `@/components/Footer`（`components/Footer.tsx`） | 新建 SiteFooter/PageFooter 等平行组件；在页面内手写整套页脚 |
| 价格 | `@/components/PricingSection`（`components/PricingSection.tsx`） | 新建 Pricing/Plans/PriceCards 等平行组件；复制一套定价卡片 UI |

用户原文要求（须遵守）：

- `components/Navbar.tsx` **必须使用公共导航组件**
- `components/Footer.tsx` **必须使用公共页脚组件**
- `components/PricingSection.tsx` **必须使用公共价格组件**

## 落地页模块顺序（手动注入）

AI 生成的 SEO / `cy_templeate.json` **通常不会**包含公共价格模块。首页必须**手动保证**以下顺序：

```
…（SEO 计划生成的 CY 模块：Hero、Features、Steps 等）…
→ 外层 h2 + 描述 + PricingSection（公共价格，#pricing）
→ FaqCase*（FAQ 模块，紧接在价格下方）
```

规则：

1. **必须显示** `@/components/PricingSection`，且位于 FAQ **正上方**。
2. **h2 与描述写在组件外面**（页面 JSX），**不要**给 `PricingSection` 传 `title` / `description`；组件侧用 `hideSection hideHeader`。
3. **禁止**用 `components/cy/Pricing/pricing_case*.tsx` 替代首页价格（CY 价卡仅用于画廊 / 预览）。
4. FAQ 数据可来自 `cy_templeate.json` 的 `FaqCase1`；套餐数据来自 `website-config`（`PricingSection` 内部读取）。
5. 执行 `npm run cy` 时，`scripts/cy-generate.mjs` 会在首个 `FaqCase*` 前自动插入「外层 h2 + 描述 + `<PricingSection hideSection hideHeader />`」；`PricingCase*` 模板块不会进入首页堆叠。

首页期望片段（`app/page.tsx`）：

```tsx
import PricingSection from "@/components/PricingSection";
import { FaqCase1 } from "@/components/cy/FAQ/faq_case1";

// …其他 CY 模块…
<section id="pricing" className="bg-background px-4 py-24">
  <div className="mx-auto max-w-7xl">
    <div className="mb-12 text-center">
      <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
        Choose Your Perfect Plan
      </h2>
      <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
        All plans include HD download and fast AI generation.
      </p>
    </div>
    <PricingSection hideSection hideHeader />
  </div>
</section>
<FaqCase1 data={cyBlockData(cyTemplate["FaqCase1"] as Record<string, unknown>) as never} />
```

## 标准用法

### Layout 壳（导航 + 页脚）

与 `app/layout.tsx` 一致：

```tsx
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

// …
<Navbar />
{children}
<Footer friendlyLinks={friendlyLinks} />
```

### 价格区块

落地页（FAQ 上方）：**外写 h2 + 描述**，再挂公共价卡：

```tsx
import PricingSection from '@/components/PricingSection';

<section id="pricing" className="bg-background px-4 py-24">
  <div className="mx-auto max-w-7xl">
    <div className="mb-12 text-center">
      <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
        Choose Your Perfect Plan
      </h2>
      <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
        All plans include HD download and fast AI generation.
      </p>
    </div>
    <PricingSection hideSection hideHeader />
  </div>
</section>
```

独立 `/pricing` 页可直接 `<PricingSection />`（组件自带小节标题）。需要改套餐时改 `website-config`，**不要** fork 组件；需要改落地页标题文案时改页面外层的 h2 / p，**不要**给 `PricingSection` 加标题 props。

## 允许改什么

- 在上述三个文件**内部**修 bug、调样式、加 props（保持对外 API 兼容）。
- 通过现有 props（如 `Footer` 的 `friendlyLinks`，`PricingSection` 的 `hideSection` / `hideHeader`）适配页面。
- 落地页价格的 h2 / 描述文案：只改页面 JSX 外层，不改组件 API。

## 不允许做什么

- 为单页再写一个 Navbar / Footer / Pricing 变体文件。
- 从三个公共组件复制大段 JSX 到 `app/**` 或 `components/landing/**`。
- 用 CY 画廊 case、临时 Demo 组件替代线上 layout / 定价页的公共壳。
- 在落地页省略 `PricingSection`，或把 FAQ 放在价格区块上方。
- 把落地页价格 h2 / 描述做成 `PricingSection` 的 props 传入。

## Checklist

- [ ] 导航来自 `@/components/Navbar`
- [ ] 页脚来自 `@/components/Footer`
- [ ] 落地页价格来自 `@/components/PricingSection`，且在 FAQ 上方
- [ ] 价格 **h2 + 描述写在组件外**，`PricingSection` 使用 `hideSection hideHeader`
- [ ] 未用 CY `PricingCase*` 充当首页价格
- [ ] 未新增平行的 nav / footer / pricing 组件
