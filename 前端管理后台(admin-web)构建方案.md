# 前端管理后台（admin-web）构建方案

本文档基于当前仓库中的 `admin-web` 实现重构，用于说明管理后台模板的真实工程形态、构建方式、与 `uni-ui-lib` 的集成边界，以及后续扩展原则。

关联文档：

- `前端架构方案总览.md`
- `前端开发规范.md`
- `业务组件库(uni-lib)构建方案.md`
- `test/admin-web/微前端与组件库方案对比.md`

当前结论：`admin-web` 采用 **Vue 3 + Vite + TypeScript + Vue Router + Pinia + Element Plus + uni-ui-lib** 的 CSR 管理后台形态。现阶段主路径是 **后台模板工程 + 业务组件库复用**，不把微前端作为默认建设前提。

---

## 一、项目定位

`admin-web` 是管理后台模板与业务示例工程，面向运营平台、配置后台、会员管理、协议管理、数据看板等 PC 管理类场景。

当前工程已经具备：

- Vite 应用构建与本地代理。
- Element Plus 全量接入。
- Vue Router 路由与登录守卫。
- Pinia 状态管理，其中基础后台 store 由 `uni-ui-lib` 输出。
- `uni-ui-lib` 组件库接入，包括布局、主题、请求、认证、权限、表格、表单、搜索表单、上传等能力。
- 中英文国际化目录。
- ESLint、Stylelint、Prettier、Husky、lint-staged、Commitlint、`vue-tsc` 类型检查。

---

## 二、技术栈与依赖现状

以 `admin-web/package.json` 为准：

| 类别 | 当前选型 |
| --- | --- |
| 框架 | `vue` 3.5 |
| 构建 | `vite` 5 |
| 路由 | `vue-router` 4 |
| 状态 | `pinia` 3 |
| UI | `element-plus` 2、`@element-plus/icons-vue` |
| 组件库 | `uni-ui-lib`，当前通过 `file:../uni-lib` 本地依赖接入 |
| 请求 | `axios` 1，由 `uni-ui-lib` 提供默认请求客户端 |
| 国际化 | `vue-i18n` 11 |
| 样式 | `sass` |
| 质量工具 | ESLint、Stylelint、Prettier、Husky、lint-staged、Commitlint、`vue-tsc` |

当前脚本：

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint \"src/**/*.{ts,vue}\" \"*.{ts,mjs,cjs}\" --max-warnings 0",
  "lint:style": "stylelint \"src/**/*.{vue,scss,css}\" --allow-empty-input",
  "format": "prettier --write \"src/**/*.{ts,vue,scss,md,json}\" \"*.{json,ts,mjs,cjs,md}\"",
  "type-check": "vue-tsc --noEmit"
}
```

---

## 三、构建与开发服务

`admin-web/vite.config.ts` 是当前构建入口，关键约定如下：

- `base` 使用 `VITE_APP_BASE`，默认 `/`。
- 开发服务监听 `0.0.0.0:8100`。
- 若配置 `VITE_API_PROXY_TARGET`，本地 `/api` 会代理到目标服务，并去掉 `/api` 前缀。
- 通过 `@` 指向 `src`。
- 手动拆分 `vue` 与 `elementPlus` chunk，降低业务 chunk 体积。
- 对 `uni-ui-lib/style.css` 和 `uni-ui-lib/dist/index.css` 做别名解析，指向包内构建后的 `index.css`。

`uni-ui-lib` 当前使用 `exports` 限制包内路径，不能直接 `resolve('uni-ui-lib/package.json')`。因此 Vite 配置通过 `createRequire(import.meta.url)` 解析包入口，再拼出样式路径。这是当前本地 file 依赖和包导出策略下的兼容处理。

---

## 四、入口与初始化顺序

当前 `src/main.ts` 的初始化顺序是：

1. 创建 Vue 应用。
2. `app.use(pinia)`。
3. `app.use(router)`。
4. `app.use(ElementPlus)`。
5. `app.use(i18n)`。
6. 调用 `initUniLib(app)`。
7. 挂载到 `#app`。

`uni-ui-lib` 的 store 使用其导出的单一 `pinia` 实例，宿主必须先安装 `pinia`，再安装组件库。当前 `src/stores/index.ts` 从 `uni-ui-lib` 统一导出：

- `pinia`
- `defineStore`
- `useAppStore`
- `useMenuStore`
- `usePermissionCodeStore`
- `useRouteAccessStore`
- `useUniTagsViewStore`
- `useUserStore`

项目自己的 store 再从本地 `src/stores/modules` 扩展。

---

## 五、uni-ui-lib 接入方式

当前接入文件为 `src/uni.ts`：

```ts
import UniLib from 'uni-ui-lib'
import 'uni-ui-lib/style.css'

export const initUniLib = (app: App) => {
  app.use(UniLib, {
    config: {
      name: 'uni-admin-web',
      request: {
        baseURL: import.meta.env.VITE_API_BASE_URL as string,
        getTenantId: () => import.meta.env.VITE_TENANT_ID as string,
        commonHeaders: {
          version: import.meta.env.VITE_API_VERSION as string
        }
      },
      auth: {
        login: (params) => fetchLoginSnapshot(params),
        logoutRequest: submitLogoutRequest
      }
    }
  })
}
```

当前职责分工：

| 能力 | `admin-web` | `uni-ui-lib` |
| --- | --- | --- |
| 登录页 UI | 保留在业务工程 | 提供登录快照协议、token 与登出能力 |
| 请求配置 | 提供 `baseURL`、租户、版本头、业务 API | 创建 axios 客户端、注入 token、处理 envelope、401/403 与错误消息 |
| 路由菜单 | 在宿主路由守卫中拉取菜单权限并判断访问 | 提供菜单、权限码、路由访问 store |
| 布局与页签 | 可直接使用组件库布局，也可在业务工程扩展 | 提供 `UniLayout`、菜单树、标签页、改密弹窗等 |
| 主题 | 传入默认主题与存储键 | 提供主题 token、持久化、`UniThemeSettings` |
| 权限 | 页面和操作使用权限码 | 提供 `v-uni-permission`、`useUniPermission`、权限 store |
| i18n | 聚合业务语言包 | 组件库维护自身文案与桥接能力 |

---

## 六、目录结构现状

当前 `src` 目录按管理后台分层组织：

```text
src/
├── api/                 # 业务 API 模块与 uni runtime 适配
├── assets/styles/       # 全局样式、变量、mixin、reset、工具类
├── config/              # 项目配置
├── directives/          # 项目侧指令入口
├── layouts/             # 业务布局入口
├── locales/             # zh-CN / en 语言包
├── plugins/             # 插件入口与业务 UI 预留
├── router/              # index（守卫）、routes.ts（聚合）、modules/（按业务域）
├── stores/              # 组件库 store 再导出 + 项目 store
├── types/               # API、路由、模块类型
├── utils/               # 下载、工具函数
├── views/               # 页面模块
├── App.vue
├── main.ts
└── uni.ts               # uni-ui-lib 初始化
```

页面按业务域拆分，例如：

```text
views/
├── dashboard/
├── login/
├── member/
│   ├── student/
│   ├── teacher/
│   └── components/
└── protocol/
    ├── components/
    ├── list.config.ts
    └── list.vue
```

后续新增页面应保持当前模式：页面入口（含 `<script setup>` 业务逻辑）、列表配置、页面私有组件分开；跨页面复用进入 `src/components`、`composables` 或 `uni-ui-lib`。**不新建** `use-list.ts`；单页逻辑写在对应 `.vue`。超 800 行时拆页内子组件，而非再抽页面级 `use-*.ts`。

---

## 七、路由、菜单与权限

当前 `src/router/index.ts` 已将权限流落到 `uni-ui-lib` store：

- 白名单：`/login`。
- 未登录访问受保护页面时跳转 `/login`，并携带 `redirect`。
- 已登录访问 `/login` 时重定向首页。
- 首次进入时调用 `fetchMenuPermissions(router.getRoutes())`。
- 将后端返回的菜单、可访问路径、权限码分别写入：
  - `useMenuStore()`
  - `useRouteAccessStore()`
  - `usePermissionCodeStore()`
- 访问时同时判断路由 `meta.permission` 与路径访问权限。
- 拉取权限失败时按 401 或其他错误分别处理。

建议保持“后端菜单权限 + 前端路由表”的模式：后端负责返回菜单、路径和权限码；前端负责路由映射、侧栏展示、按钮权限和 403/404 体验。

静态路由按业务域维护在 `src/router/modules/`（如 `member.ts`、`activity.ts`），由 `src/router/routes.ts` 聚合为 `routes` 数组；`index.ts` 仅负责 `createRouter` 与 `beforeEach` 守卫。

权限控制统一使用：

- 路由级：`meta.permission` 与 `routeAccessStore.canAccessPath()`。
- 操作级：`permissionCodeStore.hasPermission()`、`useUniPermission()` 或 `v-uni-permission`。
- 数据级：以后端接口返回为准，前端只做展示与提示。

---

## 八、请求与认证

业务 API 按模块放在 `src/api/modules`，统一从 `src/api/index.ts` 导出。请求实例不建议在业务工程重复封装一套，应优先使用 `uni-ui-lib` 的默认请求能力：

- `createUniRequest()`：创建请求实例。
- `initUniHttpClient()`：组件库安装时基于运行时配置初始化默认客户端。
- `getUniRequest()` / `request` / `http`：业务代码可复用的请求出口。

当前配置会注入：

- `VITE_API_BASE_URL`
- `VITE_TENANT_ID`
- `VITE_API_VERSION`
- `Authorization: Bearer <token>`

认证侧由宿主提供：

- `fetchLoginSnapshot(params)`：登录后返回 token、用户信息、权限码。
- `submitLogoutRequest()`：退出登录请求。

`uni-ui-lib` 负责 token 存储、请求注入、401 清理、默认错误消息和改密成功后的登出跳转；登录整页 UI、品牌图、多租户入口文案仍留在 `admin-web`。

---

## 九、环境变量

当前方案中应保留以下环境变量约定：

- `VITE_APP_BASE`：静态资源与路由 base。
- `VITE_API_BASE_URL`：前端请求基础地址。
- `VITE_API_PROXY_TARGET`：本地开发代理目标。
- `VITE_TENANT_ID`：租户 ID，传给组件库请求配置。
- `VITE_API_VERSION`：公共请求头中的接口版本。

所有暴露给前端的变量必须使用 `VITE_` 前缀。密钥、真实 token、内部凭证不得进入 `.env` 示例或源码。

---

## 十、样式与主题

当前样式来源有两类：

- `admin-web/src/assets/styles/index.scss`：业务工程全局样式、变量、reset、工具类。
- `uni-ui-lib/style.css`：组件库全量样式与主题变量。

业务工程可以维护品牌资产、登录页背景、页面级样式和少量布局差异；通用主题 token、Element Plus 全局覆盖、`UniLayout` 相关变量应优先沉淀到 `uni-ui-lib`。

禁止在页面内长期散落大段 `--el-*` 覆盖或 `:global(.el-xxx)`。确需全局覆盖时，应在项目全局样式或组件库 `styles/element-plus.scss` 中集中维护。

---

## 十一、国际化

当前工程存在：

```text
locales/
├── lang/
│   ├── en/
│   └── zh-CN/
└── index.ts
```

业务文案放在 `admin-web` 语言包内；组件库组件文案由 `uni-ui-lib` 自带语言包维护。新增页面时不得在组件配置中长期硬编码中文按钮、表格标题和状态文案，应优先进入对应业务语言包或由接口字典提供。

---

## 十二、构建质量门禁

本工程发布前建议至少执行：

```bash
npm run format:check
npm run lint
npm run lint:style
npm run type-check
npm run build
```

当前 `package.json` 还未配置测试脚本。若后续增加复杂权限、请求、表格配置和表单联动，建议补充：

- Vitest：测试工具函数、权限判断、请求解析。
- Vue Test Utils / Testing Library：测试表格、搜索表单、弹窗交互。
- Playwright：覆盖登录、菜单访问、列表查询、无权限访问等主流程。

---

## 十三、部署与安全

`admin-web` 构建产物是静态资源，可部署到 Nginx、对象存储 + CDN、容器静态站点或企业门户静态服务。

安全边界：

- 前端权限只负责展示和交互控制，最终权限必须由后端接口校验。
- token 过期、退出登录、改密后清理缓存必须走统一认证流程。
- 不在日志、错误提示、URL query 中输出敏感信息。
- 上传文件类型、大小、内容安全以后端校验为准，前端只做前置体验。

---

## 十四、微前端与 SaaS 演进

当前 `admin-web` 不默认引入无界、qiankun 等微前端方案。只有在明确存在“统一门户域名、同一 URL 内聚合多个独立后台应用、独立发布且需要前端运行时集成”的产品诉求时，才单独评估微前端。

若只是多产品线、多域名、不同登录 UI 或不同品牌后台，优先采用：

- 统一模板工程。
- 统一 `uni-ui-lib` 公共组件、请求、权限、主题协议。
- 各部署实例保留自己的登录页、布局细节、菜单契约和发布节奏。

若演进为多租户 SaaS，应在后端租户模型、网关、SSO、Cookie 域、租户切换、计费和审计规则明确后，再在前端增加租户 store、租户请求头、租户级主题和菜单重载逻辑。

---

## 十五、后续建设优先级

1. 稳定 `src/uni.ts` 接入协议，避免业务页面直接绕过组件库请求与认证能力。
2. 将列表页继续迁移为 `UniSearchForm + UniDataTable + list.vue + list.config.ts` 组合（逻辑在 `list.vue`，不拆 `use-list.ts`）。
3. 复用 `uni-ui-lib` 的权限、主题、布局和 tags-view store，项目侧只补充业务状态。
4. 为登录、菜单权限、列表页、请求错误处理补齐测试。
5. 当 `uni-ui-lib` 从本地 `file:../uni-lib` 改为 npm/私服版本时，同步去掉仅服务本地 file 依赖的临时兼容逻辑。

---

## 结论

`admin-web` 当前已经不是纯方案阶段，而是一个已接入 `uni-ui-lib` 的管理后台模板工程。后续建设应围绕“模板工程承载业务差异，组件库沉淀跨项目机制”推进：登录 UI、业务路由、业务 API 留在 `admin-web`；请求、权限、布局、主题、通用表格表单等公共能力优先进入 `uni-ui-lib`。
