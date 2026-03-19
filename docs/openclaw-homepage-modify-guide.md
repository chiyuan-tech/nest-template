# OpenClaw 首页/配置修改流程说明

本文档用于指导 OpenClaw 按流程修改项目。**仅修改下文明确列出的文件，其余文件不要改动。**

---

## 一、修改范围（允许改动的文件）

| 类型 | 路径 | 说明 |
|------|------|------|
| 配置 | `website-config.js` | 修改 canonical、supportEmail、首页 TDK 等 |
| 样式 | `app/globals.css` | 更新全局 CSS |
| 图标 | `app/favicon.ico` | 重新生成站点图标 |
| 图片 | `public/share-img.png` | 重新生成默认分享图（OG/社交卡片） |
| 配置 | `tailwind.config.js` | 重新配置 Tailwind |
| 组件 | `components/home/*` | 首页模块化组件（新建/修改） |
| 组件 | `components/nav/NavClient.tsx` | 导航栏：注释掉 Right Section |
| 页面 | `app/page.tsx` | 首页内容与模块引用 |
| 布局 | `app/layout.tsx` | 根布局与 CNZZ 统计 |
| 静态 | `public/llms.txt` | 根据站点内容重新修改 |

**未在以上列表中出现的文件一律不修改。**

---

## 二、分步修改说明

### 1. `app/globals.css` — 更新 CSS 样式

- 在 **不删除** 现有 `@import`、`@theme`、已有变量与工具类的前提下，增补或调整样式。
- 可增加：自定义动画、新 class、主题变量覆盖等。
- 保持与 `tailwind.config.js`、现有设计系统一致。

---

### 2. `tailwind.config.js` — 重新配置

- 按新首页/品牌需求调整：
  - `theme.extend`（如颜色、字体、间距、圆角等）
  - `content` 确保包含 `./app/**/*.{ts,tsx}`、`./components/**/*.{ts,tsx}` 等
- 不删除现有与 `globals.css` 中变量对应的配置（如 `background: "var(--background)"` 等），只做扩展或数值调整。

---

### 3. `website-config.js` — 修改 canonical、supportEmail、首页 TDK

- **canonical**：将 `canonical.url` 改为新站点的正式域名（如 `https://你的域名.com`），不要带末尾斜杠。全站 canonical/OG/sitemap 都会用该值。
- **supportEmail**：将 `contact.supportEmail` 改为 **`support@` + 域名**（域名与 `canonical.url` 一致，不含协议）。例如 canonical 为 `https://example.com` 则填 `support@example.com`。
- **首页 TDK**：仅修改 **`pageTdk['/']`** 这一项。
  - **title**：≤ 60 字符
  - **description**：≤ 160 字符
  - **keywords**：数组，总字符数 < 100

示例：

```js
canonical: { url: 'https://你的域名.com' },
contact: { supportEmail: 'support@你的域名.com' },
pageTdk: {
  '/': {
    title: '你的首页标题',
    description: '你的首页描述，不超过160字。',
    keywords: ['关键词1', '关键词2', '关键词3'],
  },
  // 其他路径如 '/pricing', '/blog' 等保持不变，不要改
},
```

---

### 4. `app/page.tsx` — 首页内容与模块化

- 首页内容**模块化开发**，按区块拆成组件，放在 **`components/home/`** 目录下。
- 在 `app/page.tsx` 中：
  - 保持现有 `metadata`、`getPageTdk('/')`、JSON-LD、`GoogleOneTapAuth`、`Footer` 等逻辑不变。
  - 将首屏、中间区块等改为从 `@/components/home/xxx` 引入并组装（可用 `dynamic` 做按需加载）。
- 新建的首页模块组件统一放在 `components/home/`，例如：
  - `components/home/Hero.tsx`（已有可改）
  - `components/home/SectionX.tsx`、`components/home/Features.tsx` 等
- 不在 `app/page.tsx` 里写大段 JSX，只做引用与布局结构。

---

### 5. `app/layout.tsx` — CNZZ 统计初始化（lazyOnload + 新站号）

- 保持 CNZZ 使用 **lazyOnload** 策略，不阻塞首屏。
- 将当前占位站号 **`1281431393`** 替换为**最新的 CNZZ 计数器代码/站号**（由运营或产品提供）。
- 需修改的位置：
  - `_setAccount` 中的站号（如 `1281431393`）→ 替换为最新站号
  - `<Script id="cnzz-2">` 的 `src` 里 `id=1281431393` → 替换为最新站号
- 若最新计数器为单脚本，则保留一个 Script，并保持 `strategy="lazyOnload"`；若为多脚本，则按官方文档保留多个，均用 `lazyOnload`。
- 除 CNZZ 相关片段外，layout 中其它部分（Navbar、Provider、main 等）**不要改动**。

---

### 6. `app/favicon.ico` 与 `public/share-img.png` — 重新生成

**Favicon（`app/favicon.ico`）**

- 用新的品牌/产品图标重新生成 `app/favicon.ico`。
- 格式保持为 ICO（或项目已支持的格式），替换原文件即可。
- **仅替换该文件，不修改其它 layout 或 meta。**

**分享图（`public/share-img.png`）**

- 全站默认使用的 Open Graph / 社交分享图，分享链接时展示的卡片图。
- **需按新站点重新设计并生成**，替换 `public/share-img.png`：
  - 内容：新站点名称（与 `website-config.js` 中品牌一致）、副标题/一句话描述、简短产品说明、主 CTA 文案（如 "Try XXX"）。
  - 风格：建议保持深色玻璃拟态等现代风格，与首页视觉统一；可沿用当前模板布局，仅替换文案与配色。
  - 尺寸：推荐 **1200×630**（标准 OG 比例），或至少 1.91:1，保证各平台预览清晰。
- 替换后路径仍为 `/share-img.png`，各页已引用该路径，**无需改代码**。

---

### 7. `components/nav/NavClient.tsx` — 注释掉 Right Section

- 将导航栏中的 **Right Section** 整块注释掉（不要删除，便于日后恢复）。
- 即注释从 `{/* Right Section */}` 开始、到包含 `<Sheet>…</Sheet>` 的 `</div>` 结束的整段 JSX（右侧的 Auth 登录区 + 移动端菜单按钮及抽屉）。
- 注释后导航栏仅保留左侧 Logo、中间导航链接，右侧不再显示登录入口与移动端菜单。若仍需保留移动端菜单，可只注释桌面端/移动端的 Auth 部分，保留 Sheet 移动菜单，按实际需求二选一并在文档中注明。

---

### 8. `public/llms.txt` — 根据内容重新修改

- 该文件供 LLM 爬虫识别站点允许抓取的内容与规则。
- **根据新站点实际情况**修改全文内容，包括但不限于：
  - **Website / Name / Description**：改为新站点 URL、产品名、一句话描述。
  - **Allow**：根据新站真实路由更新（如 `/#hero`、`/#features`、`/blog`、`/blog/*`、新产品页等），与 `website-config.js` 的 canonical 域名一致。
  - **Disallow**：保留或调整不需要被索引的路径（如 `/api/`、`/admin/`、`/sign-in`、`/profile` 等）。
  - **Sitemap**：改为新域名的 sitemap 地址，如 `https://你的域名.com/sitemap.xml`。
  - **Key Features / 说明段落**：按新产品功能与文案重写，不要沿用旧站描述。
- 修改后保持纯文本格式，注释用 `#`，便于后续再按内容迭代。

---

## 三、检查清单（修改完成后自检）

- [ ] 只改动了上述 10 类路径下的文件（含 `components/home` 新建）。
- [ ] `website-config.js` 已改 `canonical.url`、`contact.supportEmail`（support@+ 域名）、`pageTdk['/']`，其余 path 未动。
- [ ] `components/nav/NavClient.tsx` 已注释 Right Section，未改其他逻辑。
- [ ] `public/llms.txt` 已按新站点内容、域名、路由、Sitemap 重写。
- [ ] `app/page.tsx` 首页模块来自 `components/home/`，且 metadata/JSON-LD 仍正常。
- [ ] `app/layout.tsx` 仅调整 CNZZ 站号/脚本，且仍为 lazyOnload。
- [ ] `app/globals.css`、`tailwind.config.js` 未破坏现有主题与变量。
- [ ] 新首页 TDK 满足：title ≤60、description ≤160、keywords 总长 <100。
- [ ] `app/favicon.ico`、`public/share-img.png` 已按新品牌重新生成并替换。

---

## 四、简要对照表

| 步骤 | 文件 | 动作 |
|------|------|------|
| 1 | `app/globals.css` | 更新 CSS 样式 |
| 2 | `tailwind.config.js` | 重新配置主题/内容路径 |
| 3 | `website-config.js` | 改 `canonical.url`、`contact.supportEmail`（support@+ 域名）、`pageTdk['/']` |
| 4 | `components/home/*` | 新建/调整首页模块组件 |
| 5 | `app/page.tsx` | 用 home 组件拼首页，保持 metadata 与 JSON-LD |
| 6 | `app/layout.tsx` | CNZZ 用 lazyOnload，1281431393 换为最新计数器 |
| 7 | `app/favicon.ico` | 重新生成并替换 |
| 7b | `public/share-img.png` | 重新生成默认分享图（OG/社交卡片，推荐 1200×630） |
| 8 | `components/nav/NavClient.tsx` | 注释掉 Right Section（Auth + 移动端菜单区） |
| 9 | `public/llms.txt` | 根据新站点内容、域名、路由、Sitemap 重新修改 |

按以上顺序执行，且**仅修改本说明中列出的文件**，即可完成本次首页与配置的修改。
