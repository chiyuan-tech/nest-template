.
├── app/                     # Next.js App Router 核心目录
│   ├── layout.tsx       # 根应用布局 (包含 Navbar, Footer, 全局 Providers)
│   ├── page.tsx         # 根应用页面 (/)
│   ├── globals.css      # 全局 CSS 样式 (Tailwind)
│   ├── sitemap.ts       # Sitemap 生成逻辑 (sitemap.xml)
│   ├── not-found.tsx    # 自定义 404 错误页面
│   ├── blog/            # 博客相关页面
│   │   ├── page.tsx     # 博客文章列表页 (/blog)
│   │   └── [slug]/      # 动态博客文章页面
│   │       └── page.tsx # 单个博客文章详情页 (/blog/...)
│   ├── profile/         # 用户个人资料页面 (/profile)
│   │   └── page.tsx     # 个人资料展示及生成历史
│   ├── privacy/         # 隐私政策页面 (/privacy)
│   │   └── page.tsx     # 隐私政策内容展示页
│   ├── sign-in/         # 登录页面 (/sign-in)
│   │   └── page.tsx     # Clerk 登录组件渲染页
│   ├── sign-up/         # 注册页面 (/sign-up)
│   │   └── page.tsx     # Clerk 注册组件渲染页
│   └── terms/           # 服务条款页面 (/terms)
│        └── page.tsx     # 服务条款内容展示页
│       
├── components/              # 可复用的 UI 组件
│   ├── Navbar.tsx           # 网站顶部导航栏 (无语言切换)
│   ├── ComparisonSlider.tsx # 图片对比滑块组件
│   ├── Footer.tsx           # 网站底部页脚
│   ├── PricingSection.tsx   # 价格方案展示区域组件
│   ├── payment-status-modal.tsx # 支付状态反馈模态框
│   ├── auth/                # 认证相关组件
│   │   ├── auth-button.tsx  # 根据登录状态显示 登录/注册 或 用户菜单 的按钮
│   │   ├── clerk-provider.tsx # Clerk Provider 包装器 (处理 Clerk 本地化)
│   │   └── user-profile-menu.tsx # 用户登录后显示的下拉菜单
│   └── ui/                  # (Shadcn/ui) 基础 UI 元素 (Button, Dropdown, Sheet 等)
│       └── (...)
├── lib/                     # 工具函数、辅助模块、数据等
│   └── blogData.ts          # 博客文章元数据 (slug, category, date)
│   └── utils.ts             # (可能包含) Shadcn UI 工具函数等
├── i18n/                    # 国际化 (i18n) 配置目录
│   └── request.ts         # `next-intl` 配置文件 (加载英文消息)
├── messages/                # 国际化 (i18n) 语言资源文件
│   └── en.json              # 英语翻译 (目前支持的唯一语言)
├── public/                  # 静态资源文件 (会被直接伺服)
│   ├── examples/            # ComparisonSlider 使用的示例图片
│   └── (...)                # 其他图片、图标 (favicon) 等
├── .env.local               # 本地环境变量 (API 密钥等，不应提交到 Git)
├── .gitignore               # Git 忽略配置
├── next.config.ts           # Next.js 配置文件 (TypeScript 格式, 集成 next-intl 插件)
├── package.json             # 项目依赖和脚本配置
├── README.md                # 项目说明文档
└── tsconfig.json            # TypeScript 配置文件


## 主要变更和当前状态

*   **移除了基于 URL 的 i18n 路由:** 项目不再使用 `/[locale]/` 路径前缀。所有 URL 都是规范的单语言形式 (例如 `/blog`, `/profile`)。
*   **语言管理:**
    *   删除了 `middleware.ts`。
    *   语言切换现在通过设置 Cookie (`NEXT_LOCALE`) 和页面刷新实现 (在 `Navbar.tsx` 中处理，但该切换功能目前已移除)。
    *   `i18n/request.ts` 负责配置 `next-intl`，目前固定加载并使用英文 (`en`) 消息。
    *   `app/layout.tsx` 使用 `getLocale` 和 `getMessages` (来自 `next-intl/server`) 从 `i18n/request.ts` 获取配置，并将其传递给 `NextIntlClientProvider`，供客户端组件使用。
    *   `html` 标签的 `lang` 属性现在由 `app/layout.tsx` 根据 `getLocale()` 动态设置 (当前固定为 'en')。
*   **仅支持英语:** `messages/zh.json` 已被删除，`messages/en.json` 已被清理，只保留实际使用的翻译键。`Navbar` 中的语言切换菜单已被移除。
*   **自定义 404 页面:** `app/not-found.tsx` 定义了一个自定义的 404 错误页面。
*   **Clerk 本地化:** `components/auth/clerk-provider.tsx` 现在使用 `useLocale()` 从 `next-intl` 上下文获取当前语言环境 (目前固定为 'en')，并相应地设置 Clerk 组件的语言。
*   **Sitemap:** `app/sitemap.ts` 已更新，只生成规范的、无语言前缀的 URL。

## 目录和文件说明

*   **app/**: Next.js App Router 的核心。页面路由直接在此目录下定义 (例如 `app/blog/page.tsx` 对应 `/blog`)。
*   **app/layout.tsx**: 应用程序的根布局。设置 HTML 结构、加载全局 CSS/字体、配置 `NextIntlClientProvider` 和 Clerk Provider、渲染 `Navbar` 和 `Footer`。
*   **app/page.tsx**: 应用程序的首页 (`/`)。
*   **app/not-found.tsx**: 当路由未匹配时显示的自定义 404 页面。
*   **app/sitemap.ts**: 生成 `sitemap.xml` 的逻辑。
*   **components/**: 可复用的 UI 组件。
    *   `components/ui/`: 通过 `shadcn/ui` CLI 生成的基础 UI 组件。
    *   `components/auth/`: 与用户认证流程相关的组件 (Clerk)。
*   **lib/**: 存放非 UI 的辅助代码，如工具函数、静态数据 (`blogData.ts`)。
*   **i18n/**: 存放 `next-intl` 的服务器端配置文件 (`request.ts`)。
*   **messages/**: 存放 `next-intl` 使用的翻译文件 (目前只有 `en.json`)。
*   **public/**: 存放静态资源，可通过根 URL 直接访问。
*   **next.config.ts**: Next.js 项目配置文件，已集成 `next-intl/plugin`。
*   **package.json**: 项目依赖和脚本。
*   **tsconfig.json**: TypeScript 编译器配置。
*   **components.json**: `shadcn/ui` 配置文件。


<!-- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YXdhaXRlZC1zY29ycGlvbi03MS5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_PllyFoUqkQKzNQytPlj8kD31cyeI1Z0UrVbH4qyfpj
NEXT_PUBLIC_SITE_URL=https://framepola.com -->