# 业务组件库（uni-lib）构建方案

本文档基于当前 `uni-lib` 工程实现重构，用于说明 `uni-ui-lib` 的定位、构建产物、导出策略、组件与插件边界、文档站和与 `admin-web` 的真实集成方式。

说明：仓库目录名为 `uni-lib`，当前 npm 包名为 **`uni-ui-lib`**。业务项目安装、导入、样式引用均以 `uni-ui-lib` 为准。

---

## 一、定位

`uni-lib` 是面向 Vue 3 管理后台的 **业务组件库 + 公共运行时协议层**，不是单个后台项目的组件搬运目录。

当前承担四类能力：

- UI 组件：`UniDataTable`、`UniForm`、`UniSearchForm`、`UniUpload`、`UniLayout`、`UniThemeSettings`、`UniIcon`、`UniConfigProvider`。
- 指令与组合式函数：权限、复制、防抖点击、列表状态、权限判断等。
- 运行时能力：安装入口、全局配置、请求客户端、存储命名空间、认证、主题、i18n。
- 后台基础 store：用户、菜单、权限码、路由访问、页签、应用状态。

建设原则：

- 基于 Element Plus 做后台业务编排，不重新实现成熟原子组件。
- 通过 `props`、`emits`、`slots`、配置项和回调注入解除业务耦合。
- 可沉淀机制、协议、通用交互和无品牌 UI；不沉淀单一项目接口、路由、菜单、品牌登录页和私有文案。
- 对外组件统一使用 `Uni` 前缀，组件目录统一使用 `uni-xxx`。

---

## 二、当前工程形态

当前目录重点如下：

```text
uni-lib/
├── src/
│   ├── assets/                 # 组件库内置资源，如默认 logo
│   ├── components/             # Uni* 组件
│   ├── composables/            # useUni* 组合式能力
│   ├── directives/             # v-uni-* 指令
│   ├── icons/                  # 图标与生成产物
│   ├── locales/                # 组件库语言包与 i18n 桥接
│   ├── plugins/                # install、config、request、storage、auth 等
│   ├── runtime/                # 运行时配置辅助
│   ├── stores/                 # 组件库配套 Pinia store
│   ├── styles/                 # 全量样式入口与主题变量
│   ├── types/                  # 对外类型
│   ├── utils/                  # format、copy、options 等纯工具
│   └── index.ts                # 包入口
├── docs/                       # VitePress 文档站
├── playground/                 # 联调示例
├── scripts/                    # 图标生成、发布脚本
├── vite.config.ts
├── tsconfig.json
└── package.json
```

组件命名约定：

- 目录：`src/components/uni-data-table`。
- 对外组件：`UniDataTable`。
- 主组件：`index.vue`。
- 入口：`index.ts`。
- 内部子组件使用短职责名，如 `cell.vue`、`toolbar.vue`、`column-settings.vue`。
- 组合式逻辑使用短职责名，如 `use-columns.ts`、`use-data.ts`、`use-export.ts`。

---

## 三、包信息与依赖策略

当前 `package.json`：

- 包名：`uni-ui-lib`
- 版本：`0.1.2`
- 模块类型：`type: "module"`
- ESM 入口：`dist/index.mjs`
- CJS 入口：`dist/index.cjs`
- 类型入口：`dist/src/index.d.ts`
- 样式入口：`dist/index.css`
- 发布文件：仅发布 `dist`

`dependencies` 当前为空，运行时依赖通过 `peerDependencies` 交给宿主安装：

- `vue >=3.5.0`
- `element-plus >=2.0.0`
- `@element-plus/icons-vue >=2.0.0`
- `vue-router >=4.0.0`
- `pinia >=2.0.0`
- `vue-i18n >=11.0.0`
- `axios >=1.0.0`

这符合组件库边界：避免把 Vue、Element Plus、Pinia、Router、Axios 重复打进业务项目，减少多实例和版本漂移风险。

---

## 四、构建方案

当前 `vite.config.ts` 使用 Vite library mode：

- 插件：`@vitejs/plugin-vue`、`vite-plugin-dts`。
- 类型生成：`entryRoot: "src"`，`outDir: "dist"`，`insertTypesEntry: true`。
- 入口：`src/index.ts`。
- 库名：`UniLib`。
- 格式：`es` 与 `cjs`。
- 文件名：`index.mjs` 与 `index.cjs`。
- `cssCodeSplit: true`。
- 外部化：`vue`、`vue-router`、`pinia`、`element-plus`、`@element-plus/icons-vue`、`axios`、`vue-i18n`。

当前构建脚本：

```json
{
  "dev": "vite --host 0.0.0.0",
  "build": "vite build",
  "type-check": "vue-tsc --noEmit -p tsconfig.json",
  "prepack": "npm run build",
  "prepublishOnly": "npm run format:check && npm run type-check && npm run build && npm run docs:build",
  "docs:dev": "vitepress dev docs --host 0.0.0.0",
  "docs:build": "vitepress build docs",
  "docs:preview": "vitepress preview docs --host 0.0.0.0",
  "release": "node scripts/publish.mjs"
}
```

发布前必须执行 `format:check`、`type-check`、`build`、`docs:build`。当前没有独立测试脚本，后续应补充组件、指令、请求解析和主题运行时测试。

---

## 五、导出策略

`src/index.ts` 是唯一主入口，当前负责：

- 导入并导出所有对外组件。
- 导出 `install`。
- 导出默认对象 `{ install, pinia }`，供 `app.use(UniLib)` 使用。
- 引入 `./styles/index.scss`，构建生成 `dist/index.css`。
- 导出类型、指令、组合式函数、store、请求、存储、语言包、主题 runtime 和工具函数。

当前主要导出包括：

- 组件：`UniConfigProvider`、`UniDataTable`、`UniForm`、`UniIcon`、`UniLayout`、`UniLayoutChangePasswordDialog`、`UniSearchForm`、`UniThemeSettings`、`UniUpload`。
- 请求：`createUniRequest`、`initUniHttpClient`、`getUniRequest`、`request`、`http`。
- Store：`pinia`、`defineStore`、`useAppStore`、`useMenuStore`、`usePermissionCodeStore`、`useRouteAccessStore`、`useUniTagsViewStore`、`useUserStore`。
- 指令与组合式函数：`setupPermissionDirective`、`setupCopyDirective`、`setupDebounceClickDirective`、`useUniPermission`、`useUniListState`。
- 主题、i18n、类型与工具：从对应模块统一导出。

`package.json` 的 `exports` 当前采用“子路径导出但复用主 JS 产物”的方式：

- `.` 指向 `dist/index.mjs` / `dist/index.cjs`。
- `./style.css` 指向 `dist/index.css`。
- `./components/uni-data-table` 等组件子路径导出指向主 JS 产物，并提供对应类型。
- `./components/*/style.css` 当前也指向 `dist/index.css`，即现阶段组件级样式导入实际仍加载全量样式。
- `./theme`、`./icons`、`./plugins/request`、`./directives/*`、`./composables/*`、`./utils/*` 提供稳定子路径。

后续如需真正组件级 CSS 拆分，需要同步调整 Vite 构建产物、`exports` 和文档示例；在未完成之前，文档应明确 `components/*/style.css` 是全量样式别名。

---

## 六、安装入口与运行时配置

当前 `src/plugins/install.ts` 是 `app.use(UniLib, options)` 的实现。

安装时会：

1. 若传入 `options.config`，调用 `normalizeUniConfig()` 标准化配置。
2. 设置存储命名空间 `setUniAppName(config.name)`。
3. 保存运行时配置 `setUniConfig(config)`。
4. 初始化默认 HTTP 客户端 `initUniHttpClient()`。
5. 根据 shell 配置与 `options.theme` 初始化主题。
6. 全量注册组件。
7. 注册权限、复制、防抖点击指令。

当前配置类型：

```ts
interface UniLibInstallOptions {
  config?: UniLibConfigInput
  permission?: UniPermissionOptions
  theme?: UniThemeSetupOptions
}
```

`config` 最小必填：

- `name`：应用命名空间。
- `request`：请求配置，至少包含 `baseURL` 等宿主信息。
- `auth`：登录与退出请求。

可选配置：

- `defaultLocale`
- `shell.logoutRedirect`
- `shell.themeStorageKey`
- `shell.defaultTheme`
- `changePassword`
- `httpMessages`

配置中心在未初始化时会抛出明确错误，业务工程必须在使用请求、布局、认证等能力前完成 `app.use(UniLib, { config })`。

---

## 七、请求客户端

`src/plugins/request.ts` 当前提供两层能力。

底层 `createUniRequest(options)`：

- 基于 axios 创建实例。
- 支持 `baseURL`、`timeout`、headers、paramsSerializer、withCredentials。
- 注入 access token、租户 ID、公共 headers。
- 支持重复请求取消，底层使用 `AbortController`。
- 支持进度回调。
- 支持 request/response/error 回调。
- 支持 401、403、503 钩子。

默认客户端 `initUniHttpClient()`：

- 从 `getUniConfig()` 读取运行时配置。
- 默认解包 `{ code, message|msg, data }` 形式的 API envelope。
- 默认成功 code 为 `0` 与 `200`，也支持宿主配置 `apiSuccessCode` 或 `apiSuccessCodes`。
- 自动从 `useUserStore().accessToken` 注入 `Authorization`。
- 支持 `headers.isToken === false` 跳过 token。
- 401 时清理用户状态并展示默认消息。
- 导出 `getUniRequest()`、`request` proxy 与 `http.get/post/put/patch/delete` 简化方法。

组件库不应写死业务接口路径、登录页路由、完整错误码全集和项目私有 store。宿主通过配置和回调补充业务差异。

---

## 八、认证、存储与后台 Store

当前认证协议通过 `UniLibConfigAuth` 表达：

```ts
interface UniLibConfigAuth {
  login: (params: unknown) => Promise<UniLoginSnapshot>
  logoutRequest?: () => Promise<void>
}
```

`UniLoginSnapshot` 包含：

- `accessToken`
- `refreshToken`
- `user`
- `permissions`

组件库维护的后台 store 包括：

- `app`：应用与布局状态。
- `menu`：菜单树。
- `permission-code`：按钮/操作权限码。
- `route-access`：可访问路径与权限水合状态。
- `tags-view`：页签。
- `user`：用户、token、登录状态。

`uni-lib` 导出自己的 `pinia` 实例，`admin-web` 当前从 `uni-ui-lib` 再导出并安装。业务工程如果要复用这些 store，必须保证应用内只安装这一套 `pinia` 实例，避免 store 上下文不一致。

---

## 九、已实现组件边界

### 9.1 UniDataTable

定位：后台列表页标准表格，基于 Element Plus 表格封装列配置、展示类型、加载态、空态、分页、选择、操作列、导出和工具栏。

边界：

- 可接收受控数据或请求函数。
- 可通过列配置支持日期、枚举、图片、视频、链接、复制、标签等后台高频展示。
- 不写死接口路径、按钮文案、业务状态、路由和 store。
- 搜索条件由 `UniSearchForm` 或业务页面提供，不内置业务搜索区。

### 9.2 UniForm

定位：动态表单编排层，基于 Element Plus 表单、表单项和输入类组件。

边界：

- 支持 schema、分组、栅格、校验、查看/编辑模式、字段显隐、字段联动、插槽。
- Element Plus 原子组件参数应尽量透传。
- 不自研输入框、选择器、日期等基础组件。
- 不直接提交业务接口。

### 9.3 UniSearchForm

定位：列表筛选区，复用表单 schema 并增加查询、重置、展开收起、已选条件等能力。

边界：

- 只输出清理后的查询对象。
- 不直接请求列表接口。
- 不直接修改路由 query。
- 不把筛选状态强制放入全局 store。

### 9.4 UniUpload

定位：图片和附件上传交互。

边界：

- 支持 `action` 或自定义 `request`。
- 支持文件类型、大小、数量、进度、回显、事件。
- 不写死上传地址、返回字段、租户和业务场景。

### 9.5 UniLayout

定位：管理后台通用布局，包含菜单树、页签、用户区、改密弹窗等后台壳能力。

边界：

- 可作为标准后台模板使用。
- 多产品线品牌差异、登录页、专属 Logo 和菜单资产可由宿主覆盖。
- 不作为微前端宿主壳的默认实现，除非后续单独立项。

### 9.6 UniThemeSettings

定位：主题配置与运行时 CSS 变量应用。

边界：

- 提供主题初始化、持久化、切换和默认 token。
- 业务项目传入默认主色、存储 key 或扩展 token。
- 不接管所有品牌视觉资产。

---

## 十、指令、组合式函数与工具

当前指令：

- `v-uni-permission`：权限控制，可通过安装参数注入权限判断。
- `v-uni-copy`：复制文本。
- `v-uni-debounce-click`：防重复点击。

当前组合式能力：

- `useUniPermission()`：JS 权限判断。
- `useUniListState()`：列表页状态管理。

当前工具：

- `format`：日期、空值、枚举等格式化。
- `copy`：复制能力。
- `options`：选项映射与处理。

指令与工具必须保持和宿主解耦，不直接读取业务项目路由名、菜单结构、接口路径或私有 store。

---

## 十一、样式与主题

当前样式入口是 `src/styles/index.scss`，由 `src/index.ts` 顶层引入，构建产出 `dist/index.css`。业务工程通过：

```ts
import 'uni-ui-lib/style.css'
```

引入全量样式。

样式目录职责：

- `variables.scss`：`--uni-*` 语义变量、布局变量、默认 token。
- `base.scss`：基础样式。
- `element-plus.scss`：Element Plus 全局变量与结构性覆盖。
- `utilities.scss`：少量工具类。
- `index.scss`：聚合入口。

规则：

- 全局 Element Plus 覆盖集中维护，不在各组件 scoped 样式中长期散落 `:global(.el-xxx)`。
- 组件库只提供通用主题 token 和后台壳变量，不承载单一项目品牌图和登录页背景。
- 业务项目如果需要品牌差异，应通过运行时主题配置或业务样式覆盖，而不是改组件库源码。

---

## 十二、国际化与文档站

当前 `src/locales` 提供：

- `zh-CN`
- `en`
- `create-i18n`
- `use-uni-i18n`
- `merge-deep`

组件内部文案必须进入组件库语言包；业务枚举、接口字段和页面文案由宿主提供。

文档站使用 VitePress，当前目录已经包含：

- `docs/guide/getting-started.md`
- `docs/guide/theme.md`
- `docs/guide/migration-from-old-admin.md`
- `docs/components/uni-data-table.md`
- `docs/components/uni-form.md`
- `docs/components/uni-search-form.md`
- `docs/components/uni-upload.md`
- `docs/plugins/request.md`
- `docs/plugins/theme.md`
- `docs/locales/i18n.md`
- `docs/.vitepress/snippets/**`

文档新增或变更要求：

- 组件 props、events、slots、exposes 改动必须同步文档。
- 运行时配置、请求协议、主题 token、导出路径改动必须同步文档。
- 示例应优先引用 snippets，避免文档和示例代码漂移。

---

## 十三、与 admin-web 的集成

当前 `admin-web` 通过本地依赖接入：

```json
{
  "dependencies": {
    "uni-ui-lib": "file:../uni-lib"
  }
}
```

业务工程入口：

```ts
import UniLib from 'uni-ui-lib'
import 'uni-ui-lib/style.css'

app.use(UniLib, {
  config: {
    name: 'uni-admin-web',
    request: {
      baseURL: import.meta.env.VITE_API_BASE_URL,
      getTenantId: () => import.meta.env.VITE_TENANT_ID,
      commonHeaders: {
        version: import.meta.env.VITE_API_VERSION
      }
    },
    auth: {
      login,
      logoutRequest
    }
  }
})
```

职责分工：

| 能力 | `uni-ui-lib` | `admin-web` |
| --- | --- | --- |
| 组件 | 提供通用后台组件 | 组合成业务页面 |
| 请求 | 提供 axios 工厂和默认客户端 | 提供 baseURL、租户、版本、业务接口 |
| 认证 | 管理 token、登录快照、退出清理 | 实现登录页和登录/退出 API |
| 权限 | 提供权限 store、指令和 helper | 拉取菜单权限并定义路由 meta |
| 布局 | 提供标准后台布局与页签 | 决定是否采用、如何品牌化 |
| 主题 | 提供 token、切换和持久化 | 提供默认主色和品牌样式 |
| i18n | 提供组件文案 | 提供业务页面文案 |

---

## 十四、旧系统迁移原则

旧 Vue2 后台中的表格、筛选、上传、权限、下载、i18n、主题和错误处理可以作为经验来源，但不能直接复制进组件库。

迁移要求：

- Vue2 Options API 改为 Vue 3 Composition API。
- Element UI / AVUE 能力改为 Element Plus 与 `Uni*` 配置。
- 去掉 `$route`、Vuex getter、私有 API、硬编码 URL、硬编码中文、固定租户等耦合。
- 至少两个独立业务场景复用，并能通过配置或注入解耦，才进入组件库。
- 单页面私有逻辑保留在业务工程。

---

## 十五、质量与发布要求

发布前必须满足：

- `npm run format:check`
- `npm run type-check`
- `npm run build`
- `npm run docs:build`

建议补充：

- 组件单元测试：表格分页、列渲染、表单联动、搜索表单重置、上传校验。
- 指令测试：权限隐藏/禁用、复制、防抖。
- 请求测试：token 注入、租户头、API envelope 解包、401/403、重复请求取消。
- 主题测试：默认 token、切换、持久化、CSS 变量写入。
- 类型导出检查：主入口和子路径导出均可被宿主正确引用。

发布产物检查：

- `dist/index.mjs`
- `dist/index.cjs`
- `dist/index.css`
- `dist/src/index.d.ts`
- 各组件、指令、插件、工具的类型声明。
- `package.json` exports 与实际 `dist` 类型路径一致。

---

## 十六、后续演进

优先级建议：

1. 稳定 `uni-ui-lib` 与 `admin-web` 的运行时配置协议，尤其是请求、认证、权限和主题。
2. 修正并收敛子路径导出文档，明确当前组件级样式导入仍是全量样式。
3. 为 `UniDataTable`、`UniForm`、`UniSearchForm`、`UniUpload` 补齐测试。
4. 增加真实按需样式拆分或明确长期采用全量样式入口。
5. 将重型能力如富文本、二维码、签名、流程设计器等作为专项组件评审，不进入首期核心包。
6. 从 `file:../uni-lib` 过渡到私有 npm 或正式 npm 版本时，增加版本发布、变更日志和兼容性检查。

---

## 结论

`uni-lib` 当前已经形成可构建、可文档化、可被 `admin-web` 接入的业务组件库。后续不要再把方案停留在“建议实现”的状态，而应围绕当前 `uni-ui-lib` 包的真实导出、运行时配置、构建产物和宿主集成方式继续演进：公共机制进库，业务差异留在应用，所有新增能力都要同时维护类型、文档、示例和构建产物。
