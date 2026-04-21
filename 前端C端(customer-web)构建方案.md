# 前端 C 端（customer-web）构建方案

本文档基于 `前端架构方案总览.md` 与当前仓库 `customer-web` 的实际实现编制，作为 C 端站点项目的落地基线。文档目标是统一建设口径，明确从项目初始化、目录分层、渲染策略、接口组织、样式体系到部署发布的完整路径。

---

## 一、项目定位

`customer-web` 用于承载官网、内容门户、营销落地页、会员中心等 **PC C 端站点**。

该类项目核心诉求：

- 兼顾 SEO 与首屏性能
- 支持内容分发与页面编排效率
- 保持良好的样式一致性和可维护性
- 支持服务端接口聚合与渐进扩展

因此统一采用：`Nuxt 3 + Vue 3 + TypeScript + Sass`。

---

## 二、建设目标

- 固化 C 端 Nuxt 项目的标准脚手架与目录边界
- 统一 SSR/SSG/CSR 的使用原则，避免渲染策略混乱
- 统一页面、组件、composable、服务端接口的职责分层
- 统一样式变量、响应式方案与代码规范门禁
- 建立可复制的部署流程（构建、预览、PM2 启动、回滚）

---

## 三、技术选型与当前状态

### 3.1 选型总览

| 类别       | 选型                          | 当前状态                 |
| ---------- | ----------------------------- | ------------------------ |
| 框架       | Nuxt 3                        | 已落地                   |
| 语言       | TypeScript                    | 已开启 `strict`          |
| 样式       | Sass                          | 已落地，含全局变量注入   |
| 规范       | ESLint + Prettier + Stylelint | 已落地                   |
| 运行时配置 | `runtimeConfig`               | 已落地                   |
| 服务端能力 | Nitro API                     | 已落地（示例接口）       |
| 状态管理   | Pinia                         | 按需接入，当前模板未启用 |

### 3.2 不采用后台技术栈的原因

- C 端站点对 SEO 与内容可见性有明确要求，优先 Nuxt 渲染能力
- 后台常用的 `Element Plus + Pinia` 并非 C 端模板刚需
- C 端更强调页面体验、内容组织和首屏表现，不强依赖中后台组件体系

---

## 四、渲染策略

### 4.1 基线策略

- 默认使用 **SSR**（已在 `nuxt.config.ts` 中启用）
- 路由级缓存通过 `routeRules` 控制（当前 `/api/**` 启用 `swr: 60`）
- 页面根据业务可增量启用 SSG 或纯 CSR

### 4.2 适用建议

- **SSR**：官网首页、内容详情页、活动页首屏
- **SSG**：变更频率低的静态专题、说明页
- **CSR**：登录后强交互区、实时性较强模块

### 4.3 实施要求

- 渲染策略需在页面/模块设计阶段明确，不在发布前临时切换
- 同一业务域中尽量保持策略一致，降低排障复杂度

---

## 五、目录与分层（以当前仓库实现为准）

```bash
customer-web/
├── src/
│   ├── app.vue
│   ├── assets/
│   │   └── styles/
│   ├── components/
│   ├── composables/
│   ├── layouts/
│   ├── pages/
│   ├── server/
│   │   ├── api/
│   │   └── utils/
│   └── types/
├── nuxt.config.ts
├── package.json
├── ecosystem.config.js
└── tsconfig.json
```

### 5.1 分层职责

- `pages/`：页面编排和路由入口
- `layouts/`：站点壳层（默认壳与备选壳）
- `components/`：应用内复用组件
- `composables/`：请求与业务逻辑封装（`use-xxx.ts`）
- `server/api/`：Nitro 服务端路由（聚合/转发/mock）
- `server/utils/`：服务端工具与示例数据
- `types/`：接口契约与共享类型
- `assets/styles/`：设计令牌与全局样式

### 5.2 目录约束

- 禁止在 `pages/` 内长期堆积通用逻辑，需抽离到 `composables/`
- 禁止在 `components/` 内放接口请求实现
- 服务端逻辑优先收敛到 `server/`，避免前端页面散落数据拼接

---

## 六、路由与布局方案

### 6.1 路由策略

- 使用 Nuxt 约定式路由（`src/pages/**`）
- 详情页采用文件路由参数（如 `examples/data-fetch/[id].vue`）
- 页面导航统一用 `NuxtLink` 保持路由一致性

### 6.2 布局策略

当前已落地两套布局：

- `layouts/default.vue`：常规站点壳（顶部导航 + 内容区）
- `layouts/demo.vue`：备选壳（用于独立视觉页面）

页面可通过：

```ts
definePageMeta({ layout: 'demo' })
```

进行单页壳切换，避免样式互相干扰。

---

## 七、服务端接口与数据流

### 7.1 当前实现

- 列表接口：`GET /api/example/posts`
- 详情接口：`GET /api/example/posts/:id`
- 数据来源：`src/server/utils/mock-posts.ts`

### 7.2 标准数据流

```text
Page -> composable(use-xxx) -> useFetch/useAsyncData -> Nitro API -> 数据源
```

### 7.3 约束规则

- 页面层只消费 composable 返回的数据状态
- 参数校验、错误抛出等放在 `server/api` 处理
- 前后端共享契约类型统一放 `src/types`

---

## 八、状态管理策略

### 8.1 当前口径

- 当前模板未接入 Pinia，使用 `composables + useFetch` 为主
- 该模式已可覆盖多数 C 端展示与轻交互场景

### 8.2 何时引入 Pinia

满足任一条件即建议接入：

- 跨多个页面共享用户态/业务态
- 页面间需要集中缓存与失效控制
- 存在全局可配置模块（多主题、多语言、复杂购物流程等）

---

## 九、样式体系与响应式方案

### 9.1 样式组织

- 设计令牌：`src/assets/styles/_vars.scss`
- 全局基础样式：`src/assets/styles/main.scss`
- 组件样式：默认 `scoped`，按需局部覆盖
- SCSS 写法：统一采用嵌套结构（如 `.block { &__elem { ... } }`），禁止长期平铺同级选择器

### 9.2 全局变量注入

已在 `nuxt.config.ts` 通过 Vite `additionalData` 自动注入 `_vars.scss`，并处理了 `_vars.scss` 自身注入保护。

### 9.3 响应式口径（当前已落地）

PostCSS 双策略并存：

- `.mob--` 前缀选择器：走 `postcss-pxtorem`（`rem`）
- 其他选择器：走 `postcss-px-to-viewport`（`vw`，基准宽度 `1920`）

约束：

- 移动端样式选择器必须以 `.mob--` 开头
- 移动端 `px` 必须按移动端设计稿单独书写，不可直接复用 PC 数值
- `.mob--` 内的 `px` 写设计稿原值（例如设计稿标注 `26px` 就写 `26px`）
- 避免在一个规则块内混杂桌面与移动语义
- 统一使用嵌套写法组织媒体查询与子选择器，例如 `.mob--page { .page__grid { ... } }`

换算口径（已支持配置）：

- 在 `.env` 中通过 `NUXT_MOBILE_DESIGN_WIDTH` 指定移动稿宽度
- `pxtorem.rootValue = NUXT_MOBILE_DESIGN_WIDTH / 10`
- 例如：`750` 稿对应 `75`，`375` 稿对应 `37.5`
- 全局 `html` 在移动端设置 `font-size: 13.333333vw`（750 稿），保证 rem 按屏宽缩放

### 9.4 具体写法与注意点（附案例）

#### A. 根节点字体大小自动切换（PC / 移动端）

在 `src/assets/styles/main.scss` 中统一设置：

```scss
html {
  scroll-behavior: smooth;
  /* PC 默认根字号 */
  font-size: 16px;
}

@media (max-width: 768px) {
  html {
    /* 750 稿：100vw / 7.5；并通过 clamp 限制极端大小 */
    font-size: clamp(42.667px, 13.333vw, 100px);
  }
}
```

注意点：

- PC 与移动端根字号必须分开，不要在同一规则块混写。
- `clamp(min, fluid, max)` 建议保留，避免超小屏/超大屏字体失真。
- 若设计稿从 `750` 改为 `375`，需同步调整 `vw` 公式与 `NUXT_MOBILE_DESIGN_WIDTH`。

#### B. 页面/组件移动端样式写法（`mob--`）

模板根节点挂 `mob--` 类，样式在当前文件末尾集中写：

```vue
<template>
  <section class="page mob--ex-page">
    <!-- ... -->
  </section>
</template>

<style scoped lang="scss">
.page {
  &__title {
    font-size: 16px; /* PC */
  }
}

@media (max-width: 768px) {
  .mob--ex-page {
    .page__title {
      font-size: 30px; /* 移动稿标注值，直接写 px */
      line-height: 44px;
    }
  }
}
</style>
```

注意点：

- `.mob--` 内的 `px` 写移动端设计稿原值，不从 PC 数值按比例“猜”。
- 移动端优先覆盖：字号、行高、边距、间距、点击区尺寸（按钮宽高）。
- 仅在 `@media (max-width: 768px)` 内写移动规则，保证语义清晰。

#### C. PostCSS 转换配置（与写法配套）

`nuxt.config.ts` 保持以下思路：

```ts
pxToViewport({
  viewportWidth: 1920,
  selectorBlackList: [/^\.mob--/, /nuxt-devtools/]
})

pxtorem({
  rootValue: mobileRootValue, // NUXT_MOBILE_DESIGN_WIDTH / 10
  selectorBlackList: [/^(?!\.mob--).*/]
})
```

注意点：

- 非 `.mob--` 选择器走 `vw`（PC 口径）。
- `.mob--` 选择器走 `rem`（移动口径），与上面的 `html` 根字号联动。
- 选择器前缀命名建议统一为 `mob--ex-*`，便于检索与维护。

---

## 十、配置中心与环境变量

### 10.1 运行时配置

当前已启用：

- `runtimeConfig.public.siteUrl`

来源：

- `.env` 中 `NUXT_PUBLIC_SITE_URL`
- 未配置时回退 `http://localhost:8000`

### 10.2 环境文件建议

- `.env.development`
- `.env.test`
- `.env.production`

要求：

- 仅 `NUXT_PUBLIC_*` 暴露给客户端
- 私密信息仅放服务端可读变量

---

## 十一、工程规范与质量门禁

### 11.1 当前脚本

```json
{
  "scripts": {
    "dev": "nuxt dev --port 8000",
    "build": "nuxt build",
    "preview": "nuxt preview",
    "lint": "eslint \"src/**/*.{ts,vue}\" \"nuxt.config.ts\" --max-warnings 0",
    "lint:fix": "eslint \"src/**/*.{ts,vue}\" \"nuxt.config.ts\" --fix",
    "lint:style": "stylelint \"src/**/*.scss\" --allow-empty-input",
    "format": "prettier --write \"src/**/*.{vue,ts,scss}\" \"nuxt.config.ts\" \"package.json\"",
    "typecheck": "vue-tsc --noEmit"
  }
}
```

### 11.2 校验要求

- PR 必须通过 `lint`、`typecheck`、`build`
- 不提交 `node_modules`、`.nuxt`、`.output`
- 提交信息遵循 Conventional Commits

---

## 十二、开发与联调流程

### 12.1 本地开发

```bash
npm install
npm run dev
```

访问 `http://localhost:8000`。

### 12.2 新增页面标准动作

1. 在 `src/pages` 新建页面文件
2. 抽离页面复用逻辑到 `src/composables`
3. 若涉及接口，先在 `src/types` 定义契约，再补充 `src/server/api`
4. 增加样式变量时统一进入 `_vars.scss`

### 12.3 新增接口标准动作

1. 在 `src/server/api` 新建路由处理
2. 在 `src/server/utils` 抽离复用逻辑
3. 前端通过 composable 封装请求，不在页面直接散写

---

## 十三、构建与部署方案

### 13.1 构建与预览

```bash
npm run build
npm run preview
```

Nuxt 产物在 `.output`，服务入口为 `.output/server/index.mjs`。

### 13.2 PM2 部署（当前仓库已提供配置）

`ecosystem.config.js` 已配置：

- 应用名：`customer-web`
- 脚本：`./.output/server/index.mjs`
- 启动模式：`fork`

常用命令：

```bash
pm2 start ecosystem.config.js
pm2 status
pm2 restart customer-web
pm2 stop customer-web
```

### 13.3 发布建议流程

1. 合并前通过质量门禁
2. CI 执行构建
3. 发布到测试环境验证
4. 灰度/正式发布
5. 保留可回滚版本

---

## 十四、性能与可观测性建议

### 14.1 性能建议

- 优先 SSR 页面首屏可用性
- 路由和重模块按需加载
- 合理使用 `routeRules` 缓存高频接口
- 大列表和富内容组件延迟渲染

### 14.2 可观测性建议

- 接入 Sentry（错误追踪）
- 接入 Lighthouse/RUM（性能监控）
- 关键链路埋点（曝光、点击、转化）

---

## 十五、安全与风险控制

- 前端不保存敏感凭证
- 所有权限与数据安全以后端校验为准
- 输入输出做好 XSS 风险防护
- 服务端 API 中统一处理参数合法性和异常

---
