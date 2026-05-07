# 业务组件库（uni-lib）构建方案

本文档用于定义业务组件库 `uni-lib` 的建设目标、工程形态、按需加载策略、插件能力、与 `admin-web` 模板项目的集成方式，并结合 `test/admin-web/old` 旧后台系统调研结果，梳理可沉淀的组件与公共能力。

`uni-lib` 面向管理后台类项目，默认技术栈为 **Vue 3 + TypeScript + Element Plus + Sass**。组件对外统一使用 **`Uni` 前缀**，组件目录统一使用 **`uni-xxx`**。所有 UI 组件都应基于 Element Plus 原子组件进行轻封装，不重复实现 Element Plus 已经稳定提供的基础能力。

> 说明：本文中的 `uni-lib` 指组件库工程与架构模块名；当前 npm 包名为 `uni-ui-lib`，业务项目安装和导入时以 `uni-ui-lib` 为准。

---

## 一、定位与原则

### 1.1 建设定位

`uni-lib` 不是单一业务项目的组件搬运目录，而是跨多个管理后台工程复用的 **业务组件库 + 前端公共协议层**。

它应同时提供：

- 标准业务组件：表格、动态表单、搜索表单、上传、弹窗、选择器等。
- 自定义指令：权限、复制、防抖点击等。
- 可选全局方法：权限校验、文件下载、格式化、字典转换、脱敏等。
- 公共 SDK：请求统一封装、登录认证统一封装、国际化统一封装、主题切换统一封装。
- 主题与设计令牌：CSS 变量、Sass 变量、Element Plus 主题扩展。
- 文档站与 playground：组件示例、API、迁移说明、与 `admin-web` 模板联调。

### 1.2 核心边界

`uni-lib` 可以封装 **机制、协议、交互范式、无品牌 UI 小块**，但不得封装单一项目的私有业务。

允许进入组件库：

- 可通过 `props`、`emits`、`slots`、注入配置解耦的组件。
- 基于 Element Plus 原子组件的配置化编排能力，例如基于 `ElForm` 的 `UniForm`、基于 `ElTable` 的 `UniDataTable`。
- 与具体项目无关的请求实例创建器、认证生命周期管理、权限判断协议。
- 字典、国际化、主题、上传下载等跨项目一致的基础能力。
- 旧系统中已被多个模块重复使用、但需要 Vue3 化和去业务耦合的组件。

不得进入组件库：

- 重新实现 Element Plus 已经提供且无业务增量的原子能力。
- 写死某条产品线接口路径、路由名、菜单结构、Vuex/Pinia store 路径的实现。
- 登录整页 UI、品牌 Logo、部署域名、租户专属文案。
- 只在一个业务页面使用、输入输出不稳定的页面私有组件。
- Vue2 旧代码的直接复制版本。

---

## 二、工程形态

### 2.1 推荐目录

```bash
uni-lib/
├── src/
│   ├── components/
│   │   ├── uni-data-table/
│   │   │   ├── index.ts
│   │   │   ├── index.vue
│   │   │   ├── cell.vue
│   │   │   ├── toolbar.vue
│   │   │   ├── column-settings.vue
│   │   │   ├── use-columns.ts
│   │   │   ├── use-data.ts
│   │   │   └── use-export.ts
│   │   ├── uni-form/
│   │   │   ├── index.ts
│   │   │   └── index.vue
│   │   ├── uni-search-form/
│   │   │   ├── index.ts
│   │   │   └── index.vue
│   │   ├── uni-upload/
│   │   │   ├── index.ts
│   │   │   └── index.vue
│   │   └── ...
│   ├── directives/
│   ├── composables/
│   ├── plugins/
│   ├── services/
│   ├── styles/
│   │   ├── index.scss
│   │   ├── base.scss
│   │   ├── element-plus.scss
│   │   ├── utilities.scss
│   │   └── variables.scss
│   ├── theme/
│   ├── types/
│   ├── utils/
│   ├── style.scss
│   └── index.ts
├── docs/
├── playground/
├── scripts/
└── package.json
```

组件目录命名规则：

- 组件目录统一使用 `uni-xxx`，对外组件名统一使用 `UniXxx`。
- 对外主组件使用 `index.vue`，对外入口使用 `index.ts`。
- 组件目录已经表达组件语义时，内部文件不再重复 `uni-*` 前缀。
- 内部子组件使用短功能名，如 `cell.vue`、`toolbar.vue`、`column-settings.vue`。
- 组件目录内组合式逻辑使用短职责名，如 `use-columns.ts`、`use-data.ts`、`use-export.ts`。
- 不使用 `uni-data-table.vue`、`uni-table-cell.vue`、`use-uni-table-columns.ts` 这类重复目录语义的命名。

### 2.2 包拆分建议

首期推荐先按单包结构发布一个 npm 包，源码统一放在根目录 `src/`，内部按模块导出；后期按稳定度再演进为 monorepo 子包。

```text
uni-lib
├── components      # Uni* 组件
├── directives      # v-uni-* 指令
├── composables     # useUni* 组合式函数
├── services        # createUniRequest / createUniAuth 等协议层
├── styles          # 全局样式、Element Plus 覆盖、工具类
├── theme           # 设计令牌与主题工具
└── utils           # 纯函数工具
```

若认证、请求、主题能力在非 Vue 环境也需要复用，可演进为：

- `@uni-lib/ui`
- `@uni-lib/request`
- `@uni-lib/auth`
- `@uni-lib/theme`
- `@uni-lib/i18n`

首期不建议过早拆包，避免版本协同成本过高。

---

## 三、按需加载设计

### 3.1 导出策略

组件库必须同时支持 **全量安装** 与 **按需导入**。

全量安装用于模板快速接入：

```ts
import UniLib from "uni-lib";
import "uni-lib/dist/style.css";

app.use(UniLib, {
  permission: {
    hasPermission: (code) => permissionStore.hasPermission(code),
  },
});
```

按需导入用于业务页面控制体积：

```ts
import {
  UniDataTable,
  UniForm,
  UniSearchForm,
  createUniRequest,
} from "uni-lib";
import "uni-lib/components/uni-data-table/style.css";
import "uni-lib/components/uni-search-form/style.css";
```

### 3.2 构建要求

`uni-lib` 构建产物应提供：

- `dist/index.mjs`：ESM 入口。
- `dist/index.cjs`：CJS 兼容入口（如确有需要）。
- `dist/index.d.ts`：类型声明。
- `dist/style.css`：全量样式。
- `dist/components/*`：组件级 JS、类型与样式。
- `dist/theme/*`：主题变量与样式入口。

`package.json` 建议：

```json
{
  "name": "uni-lib",
  "type": "module",
  "sideEffects": ["**/*.css", "**/*.scss"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs"
    },
    "./theme": {
      "types": "./dist/theme/index.d.ts",
      "import": "./dist/theme/index.mjs"
    },
    "./components/*": {
      "types": "./dist/components/*/index.d.ts",
      "import": "./dist/components/*/index.mjs"
    },
    "./components/*/style.css": "./dist/components/*/style.css"
  },
  "peerDependencies": {
    "vue": "^3.5.0",
    "element-plus": "^2.0.0",
    "vue-router": "^4.0.0",
    "pinia": "^3.0.0"
  }
}
```

### 3.3 自动按需导入

推荐支持 `unplugin-vue-components` resolver，便于业务工程在模板中自动解析：

```ts
Components({
  resolvers: [
    UniLibResolver({
      importStyle: true,
    }),
  ],
});
```

如果首期不做 resolver，也必须保证命名导入可 tree-shaking。

---

## 四、文档站与示例

### 4.1 文档站选型

`uni-lib` 文档站推荐使用 **VitePress** 生成。

选择理由：

- 与 Vue 3 / Vite 技术栈一致，启动和构建成本低。
- Markdown 优先，适合沉淀组件 API、规范、迁移说明。
- 可直接在文档中嵌入 Vue 组件示例。
- 比 Storybook 更轻，适合当前“组件库方案 + 使用文档 + 示例”的阶段。

Storybook 可作为后续可选增强，仅当需要复杂交互用例管理、视觉回归、设计协作面板时再引入；首期不作为必选项。

### 4.2 推荐目录

```bash
uni-lib/
├── docs/
│   ├── .vitepress/
│   │   └── config.ts
│   ├── guide/
│   │   ├── getting-started.md
│   │   ├── theme.md
│   │   └── migration-from-old-admin.md
│   ├── components/
│   │   ├── uni-data-table.md
│   │   ├── uni-form.md
│   │   ├── uni-search-form.md
│   │   └── uni-upload.md
│   ├── services/
│   │   ├── request.md
│   │   ├── auth.md
│   │   ├── i18n.md
│   │   └── theme.md
│   └── index.md
└── playground/
```

### 4.3 文档内容要求

每个组件文档必须包含：

- 基础用法。
- 典型业务用法。
- Props / Events / Slots / Exposes。
- 与 Element Plus 参数透传关系。
- 按需导入示例。
- 与 `admin-web` 模板集成示例。
- 不建议用法和边界说明。

服务与协议层文档必须包含：

- 初始化方式。
- 配置项。
- 返回值和类型。
- 与宿主 store、router、i18n 的注入关系。
- 错误处理和扩展方式。

### 4.4 脚本与门禁

推荐脚本：

```json
{
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  }
}
```

发布前必须执行 `docs:build`。组件新增、Props/Events/Slots 变更、主题变量变更、协议层配置变更时，必须同步更新文档。

### 4.5 Playground 定位

`playground/` 用于联调和验证，不替代文档站。

建议至少包含：

- `UniDataTable` + `UniSearchForm` 的列表页组合示例。
- `UniForm` 的块状、标题、栅格、校验示例。
- `UniUpload` 的自定义请求示例。
- 权限指令与 JS 权限校验示例。
- 与 `admin-web` 模板相同的 Element Plus、Pinia、Vue Router 环境。

---

## 五、插件与全局能力

### 5.1 安装入口

`uni-lib` 应提供统一安装入口：

```ts
app.use(UniLib, {
  request,
  auth,
  i18n,
  theme,
  permission,
  upload,
});
```

安装入口负责：

- 注册全局组件。
- 注册自定义指令。
- 注入全局配置。
- 挂载必要的业务全局方法。
- 注入主题变量。

### 5.2 全局方法边界

Vue3 中不建议大量依赖 `app.config.globalProperties`。`Element Plus` 已经提供 `ElMessage`、`ElMessageBox` 等成熟能力，`uni-lib` 不再封装同质化的 `$uniMessage`、`$uniConfirm`。

仅当存在跨项目一致的业务增量时，才提供可选适配器，例如：

- 统一错误码到提示文案的映射。
- 统一确认弹窗的业务默认文案。
- 统一埋点、审计或日志上报。
- 统一 i18n 文案键。

无上述诉求时，业务工程和组件库内部直接使用 Element Plus 原生能力。

为了兼容后台项目高频场景，可提供有限的可选全局方法：

```ts
app.use(UniLib, {
  globalMethods: true,
});
```

建议暴露：

- `$uniPermission` / `hasUniPermission`：权限校验，覆盖 JS 逻辑判断。
- `$uniDownload`：统一文件下载。
- `$uniFormat`：日期、空值、枚举、金额等格式化。
- `$uniAuth`：登录、退出、token 获取。
- `$uniTheme`：主题读取与切换。

同时必须提供组合式函数版本：

- `useUniPermission()`
- `useUniDownload()`
- `useUniAuth()`
- `useUniTheme()`
- `useUniI18n()`

组合式函数应作为主推荐方式，全局方法作为业务迁移兼容层。消息提示与二次确认优先使用 `ElMessage`、`ElMessageBox`；如后续确需统一业务策略，可再补充 `createUniFeedbackAdapter()` 之类的薄适配器。

---

## 六、自定义指令

### 6.1 权限指令

`admin-web` 当前已有 `v-permission`，后续可上收为 `v-uni-permission`。权限控制不提供按钮专用组件，避免只能覆盖按钮场景；统一使用 **权限指令 + JS 校验方法** 同时覆盖 UI 展示和业务逻辑。

```vue
<el-button v-uni-permission="'user:create'">新增用户</el-button>
<div v-uni-permission="['order:create', 'order:edit']">订单操作区</div>
```

组件库不直接依赖宿主的 Pinia store，而是通过安装参数注入：

```ts
app.use(UniLib, {
  permission: {
    hasPermission: (permission) => permissionStore.hasPermission(permission),
  },
});
```

JS 逻辑中通过全局方法或组合式函数判断：

```ts
if (!hasUniPermission("user:create")) {
  return;
}

const { hasPermission } = useUniPermission();

if (hasPermission(["order:create", "order:edit"])) {
  submitOrder();
}
```

### 6.2 其他候选指令

| 指令                   | 作用                             | 旧系统来源/启发                         |
| ---------------------- | -------------------------------- | --------------------------------------- |
| `v-uni-permission`     | 按权限码显示、隐藏或禁用任意元素 | `src/permission.js`、表格按钮权限逻辑   |
| `v-uni-copy`           | 复制文本并统一提示               | 旧系统 `vue-clipboard2`、二维码复制场景 |
| `v-uni-debounce-click` | 防重复点击                       | 请求去重与后台按钮操作场景              |
| `v-uni-loading`        | 局部加载态协议                   | 表格、上传、弹窗通用交互                |
| `v-uni-empty`          | 空态展示协议                     | 多列表页、首页空态素材                  |

指令命名使用 `uni` 前缀，避免与宿主或第三方冲突。

---

## 七、公共 SDK 设计

### 7.1 请求统一封装

旧系统 `test/admin-web/old/src/router/axios.js` 已包含大量可抽象经验：

- token 注入。
- 租户 ID 请求头。
- 请求进度条。
- 业务错误码处理。
- 401 登录过期处理。
- 403/503 等错误提示。
- `qs` 参数序列化。
- blob 下载响应透传。
- 重复请求控制。

新库建议提供 `createUniRequest()`，由宿主注入状态来源和副作用：

```ts
const request = createUniRequest({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  getAccessToken: () => userStore.accessToken,
  getTenantId: () => tenantStore.currentTenantId,
  onUnauthorized: () => userStore.resetAuth(),
  onError: (error) => ElMessage.error(error.message),
  showProgress: true,
  preventDuplicate: true,
});
```

组件库只提供请求实例创建与拦截器组合，不直接写死：

- `Authorization` 之外的私有 header 名称。
- 具体登录页路由。
- 业务错误码全集。
- 单一项目 store。

### 7.2 登录统一封装

旧系统存在多入口登录：`/login`、`/loginisa`、`/logingroup`、`/isacommunity/login`、`/ems/login` 等。新库不统一登录 UI，但应统一认证协议。

建议提供：

- `createUniAuth()`：创建认证服务。
- `useUniAuth()`：登录、退出、刷新、token 读写。
- `UniAuthProvider`：可选配置注入。

能力包括：

- `login(credentials)`。
- `logout()`。
- `refreshToken()`。
- `setToken()` / `getToken()` / `clearToken()`。
- `clearAuthCache()`：退出时清理 token、权限、菜单、标签页缓存。
- `onUnauthorized()`：401 后统一回调。

登录页仍由 `admin-web` 或各产品线自行实现，品牌、文案、租户入口由业务工程控制。

### 7.3 国际化统一封装

旧系统 `src/i18n` 使用 `vue-i18n`，并在组件中大量使用 `$t()`；`Language.vue` 提供中英文切换。新库应支持但不强制接管宿主 i18n。

建议提供：

- `createUniI18nBridge()`：连接宿主 `vue-i18n`。
- `useUniLocale()`：读取与切换 locale。
- `UniLocaleSwitch`：无品牌语言切换组件。
- 组件库内置文案包：`zh-CN`、`en-US`，并允许宿主覆盖。

原则：

- 组件内部文案必须可国际化。
- 业务枚举文案不写死在库内，由 `options` 或字典服务注入。
- 不再沿用旧系统 `zh` / `en` 的硬编码散落方式，统一映射为标准 locale。

### 7.4 主题切换统一封装

旧系统有多套品牌资源、菜单图标、TinyMCE skins 和项目侧样式覆盖。新库应沉淀可复用主题机制，而不是收拢所有品牌 UI。

建议提供：

- CSS 变量 token：颜色、间距、圆角、阴影、字号、表格密度。
- `createUniTheme()` / `setupUniTheme()`：主题注册、切换、持久化。
- `useUniTheme()`：读取当前主题和切换主题。
- `applyUniTheme()`：运行时写入 CSS 变量。
- `UniThemeSettings`：通用主题设置抽屉，宿主只负责传入默认主题和存储 key。
- Element Plus 变量覆盖出口，必须覆盖主色、主色浅色/深色、状态色、背景、文字、边框、填充、阴影、遮罩、组件尺寸、圆角和 transition 变量。

示例 token：

```scss
:root {
  --uni-color-primary: #BA8E62;
  --uni-bg-page: #f5f7fb;
  --uni-bg-card: #fff;
  --uni-border-color: #e5e7eb;
  --uni-radius-base: 8px;
}
```

业务项目不应在自身 store 或页面中直接维护 `--el-*` 覆盖逻辑，应通过 `app.use(UniLib, { theme })` 初始化，并通过 `UniThemeSettings` 完成运行时设置。

宿主项目保留品牌 Logo、登录页背景、菜单图标等视觉资产。

### 7.4.1 全局样式入口

组件库必须提供唯一全局样式入口 `src/style.scss`，业务工程通过 `import 'uni-ui-lib/style.css'` 一次性引入。`style.scss` 只负责聚合，不直接写业务样式：

```scss
@use "./theme/index.scss" as theme;
@use "./styles/index.scss" as styles;
```

`src/styles` 分层约定：

- `variables.scss`：字体、滚动条、间距等静态全局变量。
- `base.scss`：盒模型、基础字体、滚动条等全局基础样式。
- `element-plus.scss`：集中覆盖 Element Plus 全局变量和结构性样式，例如 popover、dialog、drawer、table。
- `utilities.scss`：少量跨项目通用工具类，例如省略号、居中、滚动容器。
- `index.scss`：只聚合以上文件。

禁止在业务项目页面或 store 中散落 `--el-*` 覆盖；禁止在组件 scoped 样式里写 `:global(.el-xxx)` 作为长期方案。确需覆盖 Element Plus 弹层、popper、全局类时，统一放入 `styles/element-plus.scss`。

### 7.5 字典与枚举

旧系统有大量 `const/*`、`i18n/list/*`、`tabletitle.js`、`fromdata` 等配置。新库可提供字典协议：

- `createUniDict()`：字典缓存、加载、失效。
- `useUniDict(code)`：获取选项。
- `formatDictLabel(options, value)`：枚举回显。
- `UniDictSelect`：字典下拉组件。

字典数据来源由宿主实现：

```ts
createUniDict({
  loadDict: (code) => api.fetchDict(code),
});
```

### 7.6 上传下载

旧系统存在多套上传组件和 `src/util/download.js`。

建议提供：

- `UniUpload`：单文件、多文件、图片、附件上传。
- `useUniUpload()`：上传动作封装。
- `useUniDownload()`：blob、URL、base64 下载。

上传接口 URL、请求实例、业务字段名由宿主配置，组件库只管理通用交互：

- 文件类型校验。
- 文件大小校验。
- 上传进度。
- 成功/失败提示。
- 上传结果事件。

---

## 八、首批组件沉淀清单

结合 `admin-web` 方案和旧系统调研，首批建议按优先级分三期。

### 8.1 Phase 1：后台高频基础组件

| 组件     | 命名                                                         | 旧系统参考                                                                                                                            | 抽取说明                                                                                                     |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 标准表格 | `UniDataTable`                                               | `src/components/commonConpents/TableBox.vue`、`communitycommon/Table.vue`、`thepoolcommon/Table.vue`、`commonConpents/Pagination.vue` | 统一列配置、加载态、空态、选择列、操作列、内置分页、权限指令插槽扩展；旧组件需去掉路由、Vuex、中文按钮硬编码 |
| 动态表单 | `UniForm`                                                    | `formgenerator/*`、`thepoolcommon/dynamicform/*`、旧系统各类表单配置                                                                  | 基于 Element Plus `ElForm`/`ElFormItem`/输入控件做配置化表单，配置参数尽量贴合 Element Plus                  |
| 搜索表单 | `UniSearchForm`                                              | `commonConpents/ScreenBox.vue`、`conpents_card/SearchTop.vue`                                                                         | 基于 `UniForm` 的查询场景封装，增加展开收起、查询、重置、已选条件；旧组件中写死的线索/商机字段需移除         |
| 权限能力 | `v-uni-permission` / `hasUniPermission` / `useUniPermission` | `TableBox.vue` 的按钮权限过滤、`src/permission.js`                                                                                    | 通过指令控制任意 UI，通过 JS 方法控制业务逻辑，不提供按钮组件                                                |
| 文件上传 | `UniUpload`                                                  | `communitycommon/uploadFile.vue`、`conpents_card/Upload.vue`                                                                          | 去掉固定上传接口，改为 `request`/`action` 注入                                                               |

### 8.2 Phase 1 组件能力明细

#### 7.2.1 `UniDataTable`

定位：后台列表页标准表格，集成 Element Plus `ElTable`、内置分页、加载态、空态、操作列和权限插槽。它解决“列表页重复写表格骨架”的问题，不接管具体业务查询接口。

必备功能：

- 列配置驱动：支持 `prop`、`label`、`width`、`minWidth`、`fixed`、`align`、`formatter`、`sortable`、`showOverflowTooltip`。
- 常用展示类型：支持 `text`、`number`、`date`、`datetime`、`time`、`relativeTime`、`money`、`percent`、`boolean`、`switch`、`image`、`images`、`video`、`videos`、`enum`、`tag`、`tags`、`array`、`json`、`copy`、`link`、`links`、`slot`。
- 图片展示：支持单图、多图、预览、占位图、图片尺寸配置。
- 视频展示：支持单视频、多视频、封面、预览/新窗口打开、大小与时长展示。
- 枚举映射：支持 `options`、字典 code 或 `valueEnum` 将状态值映射为中文/多语言文案，可配置颜色与标签类型。
- 日期转换：支持时间戳、ISO 字符串、后端日期字符串转换，支持 `format`、时区、空值占位。
- 开关展示：支持只读开关和可交互开关；可交互时必须通过事件交给业务处理，不在表格内直接请求接口。
- 数组展示：支持数组 join、tag 列表、对象数组取字段、超出数量折叠展示。
- 链接展示：支持单链接、多链接、外链新窗口、内部路由跳转回调、复制链接。
- 字段复制：支持单元格复制、复制成功提示可配置，默认复用 Element Plus 消息能力或宿主注入反馈函数。
- 内置分页：支持 `pageNo`、`pageSize`、`total`、`pageSizes`、分页位置、隐藏单页分页。
- 加载与空态：支持 `loading`、`emptyText`、自定义空态插槽。
- 选择列：支持多选、单选、禁选规则、选择变化事件。
- 操作列：支持默认操作配置，也支持 `#actions` 插槽完全自定义。
- 权限联动：操作按钮不内置权限按钮组件，通过 `v-uni-permission` 或 `hasUniPermission()` 控制。
- 表格插槽：支持单元格插槽、表头插槽、工具栏插槽、表格前后扩展区。
- 数据刷新协议：支持 `request` 函数模式，也支持外部传入 `data` 的受控模式。

建议核心 Props：

| Prop         | 说明                                       |
| ------------ | ------------------------------------------ |
| `columns`    | 列配置数组                                 |
| `data`       | 外部受控数据                               |
| `request`    | 可选异步加载函数，参数包含分页、排序、筛选 |
| `loading`    | 外部受控加载态                             |
| `pagination` | 分页配置，支持关闭分页                     |
| `rowKey`     | 行唯一键                                   |
| `selection`  | 多选/单选配置                              |
| `actions`    | 操作列配置                                 |
| `emptyText`  | 空态文案                                   |
| `valueEnums` | 全局枚举映射配置                           |

建议事件：

- `update:pageNo`
- `update:pageSize`
- `selection-change`
- `sort-change`
- `row-click`
- `refresh`
- `request-error`

建议插槽：

- `#toolbar`
- `#empty`
- `#actions="{ row, index }"`
- `#column-{prop}="{ row, value, index }"`
- `#header-{prop}`

不做事项：

- 不写死接口路径。
- 不写死业务状态与按钮文案。
- 不直接读取路由、菜单、store。
- 不包含搜索表单，搜索区由 `UniSearchForm` 或业务页面组合。

列配置建议贴近 Element Plus `ElTableColumn`，组件库只扩展少量后台高频字段：

```ts
interface UniTableColumn {
  prop: string;
  label: string;
  type?:
    | "text"
    | "number"
    | "date"
    | "datetime"
    | "time"
    | "relativeTime"
    | "money"
    | "percent"
    | "boolean"
    | "switch"
    | "image"
    | "images"
    | "video"
    | "videos"
    | "enum"
    | "tag"
    | "tags"
    | "array"
    | "json"
    | "copy"
    | "link"
    | "links"
    | "slot";
  width?: string | number;
  minWidth?: string | number;
  fixed?: true | "left" | "right";
  align?: "left" | "center" | "right";
  showOverflowTooltip?: boolean;
  sortable?: boolean | "custom";
  formatter?: (
    row: unknown,
    column: UniTableColumn,
    value: unknown,
    index: number,
  ) => string;
  options?: Array<{
    label: string;
    value: string | number | boolean;
    type?: string;
    color?: string;
  }>;
  image?: {
    width?: number;
    height?: number;
    preview?: boolean;
    fallback?: string;
  };
  video?: {
    width?: number;
    height?: number;
    poster?: string | ((row: unknown) => string);
    preview?: boolean;
  };
  date?: {
    inputFormat?: "timestamp" | "iso" | "string";
    format?: string;
    timezone?: string;
    placeholder?: string;
  };
  array?: {
    itemLabel?: string;
    separator?: string;
    max?: number;
    collapseText?: string;
    renderMode?: "text" | "tag";
  };
  link?: {
    href?: string | ((row: unknown, value: unknown) => string);
    target?: "_blank" | "_self";
    onClick?: (row: unknown, value: unknown) => void;
    copyable?: boolean;
  };
  switch?: {
    activeValue?: string | number | boolean;
    inactiveValue?: string | number | boolean;
    disabled?: boolean | ((row: unknown) => boolean);
    beforeChange?: (
      row: unknown,
      nextValue: unknown,
    ) => boolean | Promise<boolean>;
  };
  copyable?: boolean;
  slot?: string;
}
```

展示类型建议：

| 类型                                          | 典型用途                     | 渲染策略                                          |
| --------------------------------------------- | ---------------------------- | ------------------------------------------------- |
| `date` / `datetime` / `time` / `relativeTime` | 创建时间、更新时间、截止时间 | 统一做日期转换和空值兜底                          |
| `image` / `images`                            | 头像、封面、凭证图           | 基于 Element Plus 图片预览能力                    |
| `video` / `videos`                            | 课程视频、附件视频           | 展示封面与播放入口，重播放逻辑交给预览层          |
| `enum` / `tag` / `tags`                       | 状态值、类型值、多标签       | 通过 `options` / `valueEnum` / 字典映射文案与颜色 |
| `switch`                                      | 启用停用、上下架             | 只负责展示和触发变更事件，接口调用由业务处理      |
| `array`                                       | 多角色、多班级、多标签文本   | 支持 join、tag 和折叠                             |
| `link` / `links`                              | 外链、详情入口、文件链接     | 支持跳转、点击回调和复制                          |
| `copy`                                        | 编号、手机号、邮箱、链接     | 支持复制当前字段或格式化后的文本                  |
| `json`                                        | 扩展配置、原始响应           | 默认折叠或弹窗查看，不直接撑开表格                |

#### 7.2.2 `UniForm`

定位：基于 Element Plus `ElForm`、`ElFormItem` 和输入类原子组件的动态表单编排层。它通过配置参数生成表单并控制排版，减少业务项目重复写表单模板，但不替代 Element Plus 表单能力。

设计原则：

- `formProps` 尽量透传 Element Plus `ElForm` 参数。
- 字段的 `formItemProps` 尽量透传 Element Plus `ElFormItem` 参数。
- 字段组件的 `componentProps` 尽量透传对应 Element Plus 原子组件参数。
- 组件库只增加块状分组、标题、栅格布局、字段显隐、字段联动、字典选项、插槽扩展等编排能力。

必备功能：

- 字段配置驱动：支持 `input`、`textarea`、`inputNumber`、`select`、`radio`、`checkbox`、`switch`、`datePicker`、`timePicker`、`cascader`、`treeSelect`、`upload`、`slot`。
- Element Plus 参数透传：支持 `formProps`、`formItemProps`、`componentProps`。
- 校验规则：兼容 Element Plus `rules`，支持字段级 rules 和表单级 rules。
- 栅格排版：支持 `rowProps`、`colProps`、`span`、`gutter`、响应式列数。
- 块状分组：支持 `sections`，每个块可配置标题、描述、折叠、栅格。
- 字段显隐与状态：支持 `visible`、`hidden`、`disabled`、`readonly`、`required` 的布尔值或函数。
- 查看/编辑状态：支持 `mode: 'view' | 'edit'`，同一份配置可在查看态展示格式化值，在编辑态渲染 Element Plus 表单控件。
- 字段联动：支持 `dependencies` 声明依赖字段，依赖字段变化后重新计算显隐、禁用、只读、校验、选项和默认值。
- 值变化回调：支持字段级 `onChange`、表单级 `field-change`，可在回调中设置其他字段值、清空字段、触发校验或重新加载选项。
- 联动动作：支持 `setValue`、`clearValue`、`resetField`、`setVisible`、`setDisabled`、`setOptions`、`validateField` 等动作。
- 选项加载：支持静态 `options`、异步 `loadOptions`、字典 code。
- 插槽扩展：支持字段插槽、label 插槽、分组标题插槽、表单操作区插槽。
- 表单实例方法：透出 `validate`、`validateField`、`resetFields`、`clearValidate`、`scrollToField`。

建议核心 Props：

| Prop         | 说明                                         |
| ------------ | -------------------------------------------- |
| `modelValue` | 表单模型，支持 `v-model`                     |
| `config`     | 表单统一配置对象，完成初始化                 |
| `mode`       | 可选覆盖 `config.mode`，支持 `view` / `edit` |

`config` 是 `UniForm` 的主配置入口，字段、分组、布局、校验、联动和 Element Plus 透传参数都应放在该对象中，避免多个 Props 分散导致初始化状态不一致。

```ts
interface UniFormConfig {
  mode?: "view" | "edit";
  schema: UniFormField[];
  sections?: UniFormSection[];
  formProps?: Record<string, unknown>;
  rowProps?: Record<string, unknown>;
  colProps?: Record<string, unknown>;
  rules?: Record<string, unknown>;
  disabled?: boolean;
  readonly?: boolean;
  view?: {
    labelSuffix?: string;
    emptyText?: string;
    showColon?: boolean;
  };
  linkage?: UniFormLinkageConfig;
}
```

建议事件：

- `update:modelValue`
- `change`
- `field-change`
- `linkage-change`
- `validate`
- `submit`
- `reset`

建议插槽：

- `#field-{name}`
- `#label-{name}`
- `#section-title="{ section }"`
- `#actions`

配置示例：

```ts
const schema = [
  {
    field: "userName",
    label: "用户名称",
    component: "ElInput",
    formItemProps: {
      rules: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
    },
    componentProps: {
      placeholder: "请输入用户名称",
      clearable: true,
    },
    colProps: {
      span: 12,
    },
  },
  {
    field: "status",
    label: "状态",
    component: "ElSelect",
    options: [
      { label: "启用", value: 1 },
      { label: "停用", value: 0 },
    ],
    componentProps: {
      clearable: true,
    },
    colProps: {
      span: 12,
    },
  },
];
```

块状布局示例：

```ts
const formConfig = {
  mode: "edit",
  formProps: {
    labelWidth: "96px",
  },
  rowProps: {
    gutter: 16,
  },
  schema,
  sections: [
    {
      title: "基础信息",
      description: "填写用户基础资料",
      fields: ["userName", "status"],
      colProps: { span: 12 },
    },
    {
      title: "扩展信息",
      fields: ["remark"],
      colProps: { span: 24 },
    },
  ],
};
```

查看/编辑切换示例：

```vue
<UniForm v-model="formModel" :config="formConfig" :mode="mode" />
```

```ts
const mode = ref<"view" | "edit">("view");

const formConfig = {
  mode: "view",
  schema: [
    {
      field: "userName",
      label: "用户名称",
      component: "ElInput",
      viewRender: ({ value }) => value || "--",
    },
    {
      field: "status",
      label: "状态",
      component: "ElSelect",
      options: [
        { label: "启用", value: 1 },
        { label: "停用", value: 0 },
      ],
      viewType: "enum",
    },
  ],
};
```

字段联动示例：

```ts
const schema = [
  {
    field: "type",
    label: "类型",
    component: "ElSelect",
    options: [
      { label: "普通", value: 1 },
      { label: "高级", value: 2 },
    ],
  },
  {
    field: "advancedConfig",
    label: "高级配置",
    component: "ElInput",
    dependencies: ["type"],
    visible: ({ model }) => model.type === 2,
    onHidden: ({ actions }) => {
      actions.clearValue("advancedConfig");
    },
  },
  {
    field: "remark",
    label: "备注",
    component: "ElInput",
    dependencies: ["type"],
    disabled: ({ model }) => model.type === 1,
  },
];
```

字段值变化回调示例：

```ts
const schema = [
  {
    field: "country",
    label: "国家",
    component: "ElSelect",
    options: countryOptions,
    onChange: async ({ value, actions }) => {
      actions.clearValue("city");
      const cityOptions = await fetchCityOptions(value);
      actions.setOptions("city", cityOptions);
    },
  },
  {
    field: "city",
    label: "城市",
    component: "ElSelect",
    dependencies: ["country"],
    visible: ({ model }) => Boolean(model.country),
  },
];
```

联动执行约定：

1. 字段值变化后先更新 `modelValue`。
2. 触发字段级 `onChange`。
3. 根据 `dependencies` 重新计算受影响字段的 `visible`、`disabled`、`readonly`、`required`、`options`。
4. 字段从显示变为隐藏时，按字段配置决定是否清空值，默认不自动清空。
5. 触发表单级 `field-change` 与 `linkage-change`。

联动配置注意事项：

- `visible`、`disabled`、`readonly`、`required` 函数必须保持纯计算，不应直接请求接口。
- 异步选项加载应放在 `onChange`、`loadOptions` 或表单级 linkage action 中。
- 联动动作必须通过 `actions` 执行，避免直接修改内部状态。
- 循环依赖应在开发态给出警告，例如 A 依赖 B、B 又依赖 A。

查看/编辑模式约定：

- `view` 模式不渲染输入控件，只展示格式化后的值。
- `edit` 模式渲染 Element Plus 表单控件并启用校验。
- 字段可通过 `viewRender`、`viewType`、`emptyText` 控制查看态展示。
- 切换 `view -> edit` 时保留当前 `modelValue`，不重新初始化字段值。
- 切换 `edit -> view` 时不自动提交，由宿主决定是否先校验、保存或回滚。
- `readonly` 与 `disabled` 只影响编辑态控件；查看态统一按展示逻辑渲染。
- 查看态仍应执行 `visible` 逻辑，保证 A 字段控制 B/C 字段展示的规则一致。

不做事项：

- 不自研输入框、选择器、日期等 Element Plus 已有原子组件。
- 不写死业务字段和业务校验。
- 不直接提交接口。
- 不强制接管页面布局。

#### 7.2.3 `UniSearchForm`

定位：后台列表页筛选区，基于 `UniForm` 组合实现。它复用 `UniForm` 的字段配置与栅格能力，并增加查询、重置、展开收起和已选条件展示。它只产出查询参数，不直接请求列表接口。

必备功能：

- 复用 `UniForm` schema：字段配置、校验、显隐、禁用、选项加载与插槽能力与 `UniForm` 保持一致。
- 默认值：支持 `defaultValue` 与重置恢复默认值。
- 展开收起：字段较多时按 `collapsedRows` 或 `defaultCollapsed` 控制展示。
- 查询/重置：统一触发 `search`、`reset` 事件。
- 栅格布局：复用 `UniForm` 的 `rowProps`、`colProps`、`span`、`labelWidth`。
- 字典选项：支持静态 `options` 和异步 `loadOptions`。
- 自定义字段：通过插槽覆盖单个字段。
- 已选条件：可选展示已选标签，并支持单项清除。
- 查询参数清理：`search` 和 `reset` 事件统一输出清理后的查询对象。

查询参数清理规则：

- 不输出 `''`、纯空格字符串、空数组、`null`、`undefined`。
- 字符串输出前统一 `trim`。
- 该规则由 `UniSearchForm` 统一控制，业务页面、API 层不重复实现空值过滤。

建议核心 Props：

| Prop                       | 说明                                       |
| -------------------------- | ------------------------------------------ |
| `modelValue`               | 查询模型，支持 `v-model`                   |
| `schema`                   | 查询字段配置，与 `UniForm` schema 保持一致 |
| `collapsed`                | 是否收起                                   |
| `showSelectedTags`         | 是否展示已选条件                           |
| `labelWidth`               | 表单 label 宽度                            |
| `submitText` / `resetText` | 按钮文案，可 i18n 覆盖                     |

建议事件：

- `update:modelValue`
- `search`：返回清理后的查询对象
- `reset`：返回清理后的查询对象
- `field-change`
- `clear-field`
- `update:collapsed`

建议插槽：

- `#field-{name}`
- `#actions`
- `#selected-tags`

不做事项：

- 不内置具体业务字段，如线索、商机、客户等。
- 不直接修改路由 query。
- 不直接请求表格数据。
- 不将所有页面筛选状态强行放入全局 store。

#### 8.2.4 权限能力

定位：权限能力不是组件，而是覆盖 UI 与 JS 逻辑的统一协议。UI 用 `v-uni-permission`，业务逻辑用 `hasUniPermission()` 或 `useUniPermission()`。

必备功能：

- 支持字符串权限码：`v-uni-permission="'user:create'"`。
- 支持数组权限码：默认任一满足，可配置 `all` 模式。
- 支持隐藏或禁用：如 `mode: 'remove' | 'hidden' | 'disabled'`。
- 支持 JS 校验：`hasUniPermission(code)`、`useUniPermission().hasPermission(code)`。
- 支持安装时注入 `hasPermission`，不绑定具体 store。
- 支持无权限回调，便于审计或提示。

建议使用：

```ts
app.use(UniLib, {
  permission: {
    hasPermission: (permission) => permissionStore.hasPermission(permission),
    defaultMode: "remove",
  },
});
```

```vue
<el-button v-uni-permission="'user:create'">新增</el-button>
```

```ts
const { hasPermission } = useUniPermission();

if (!hasPermission("user:create")) {
  return;
}
```

不做事项：

- 不提供按钮专用组件。
- 不解析后端菜单树。
- 不写死角色、权限码命名规则。
- 不在库内依赖宿主 Pinia store。

#### 7.2.5 `UniUpload`

定位：统一上传交互，覆盖图片、附件、单文件、多文件上传。它负责选择、校验、进度、结果事件，不绑定具体上传接口。

必备功能：

- 单文件/多文件模式。
- 图片/附件展示模式。
- 文件类型校验：`accept`、扩展名、MIME。
- 文件大小校验：单文件大小、总大小。
- 数量限制：`limit`。
- 上传方式：支持 `action` URL，也支持自定义 `request` 函数。
- 请求头与额外参数：支持 `headers`、`data`。
- 进度展示：上传中、成功、失败。
- 结果受控：支持 `v-model:fileList`。
- 事件回调：成功、失败、移除、预览、超限、校验失败。

建议核心 Props：

| Prop               | 说明                                   |
| ------------------ | -------------------------------------- |
| `fileList`         | 文件列表，支持 `v-model:fileList`      |
| `action`           | 上传地址                               |
| `request`          | 自定义上传函数                         |
| `accept`           | 文件类型                               |
| `limit`            | 文件数量限制                           |
| `maxSize`          | 单文件大小限制                         |
| `multiple`         | 是否多选                               |
| `headers` / `data` | 请求头和额外参数                       |
| `disabled`         | 是否禁用                               |
| `listType`         | 展示类型，如 `text`、`picture`、`card` |

建议事件：

- `update:fileList`
- `success`
- `error`
- `remove`
- `preview`
- `exceed`
- `validate-error`
- `progress`

建议插槽：

- `#trigger`
- `#tip`
- `#file="{ file }"`

不做事项：

- 不写死上传地址。
- 不写死返回字段，如 `url`、`id`，通过 `responseMapper` 适配。
- 不承担业务文件列表管理页面。
- 不内置租户、场景等业务字段。

### 8.3 Phase 2：增强型业务组件

| 组件         | 命名                            | 旧系统参考                                                       | 抽取说明                                      |
| ------------ | ------------------------------- | ---------------------------------------------------------------- | --------------------------------------------- |
| 树选择       | `UniTreeSelect` / `UniUserTree` | `DeepTree.vue`、`DeptTree.vue`、`UserTree.vue`、`SingleTree.vue` | 树数据和懒加载由宿主注入，不耦合部门/用户接口 |
| 日志面板     | `UniLogTimeline`                | `LogBox.vue`                                                     | 适合审批、跟进、操作日志通用展示              |
| 步骤条       | `UniStepBox`                    | `StepBox.vue`                                                    | 标准流程进度展示                              |
| 成功结果页   | `UniResultSuccess`              | `Successful.vue`                                                 | 与 Element Plus `ElResult` 对齐               |
| 删除确认弹窗 | `UniConfirmDialog`              | `commonModal/Del.vue`、`Reback.vue`                              | 封装确认交互，不包含业务删除接口              |
| 选择器弹窗   | `UniPickerDialog`               | `ClientList.vue`、`ContacterList.vue`                            | 抽象远程搜索、表格选择、回填                  |
| 二维码       | `UniQrCode`                     | `isagroupcommon/QRcode.vue`                                      | 生成、复制、下载能力，URL 由宿主传入          |
| 语言切换     | `UniLocaleSwitch`               | `communitycommon/Language.vue`、`thepoolcommon/Language.vue`     | 与 `useUniLocale` 配合                        |

Phase 2 组件必须先满足两个条件再进入实现：至少两个独立业务场景复用，且能通过 `props`、`emits`、`slots` 或服务注入解除接口、路由、store 耦合。

### 8.4 Phase 3：重型可选组件

| 组件           | 命名                | 旧系统参考                                                              | 抽取说明                                                            |
| -------------- | ------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 富文本编辑器   | `UniRichTextEditor` | `tinymce/index.vue`、`tinymce/email.vue`、`components/editor/index.vue` | 依赖较重，应独立异步加载；上传协议注入                              |
| 复杂表单设计器 | `UniFormDesigner`   | `formgenerator/*`、`thepoolcommon/dynamicform/*`                        | 面向可视化搭建或服务端 schema 编辑，需在 `UniForm` 稳定后再专项评审 |
| 验证码         | `UniVerify`         | `verifition/Verify.vue`                                                 | 需确认安全协议、服务端校验方式后再沉淀                              |
| 手写签名       | `UniSignaturePad`   | `signature/signatureH5.vue`                                             | 适合移动签字/合同场景，上传配置必须解耦                             |
| 日历           | `UniCalendar`       | `@fullcalendar/*` 相关页面                                              | 重依赖，建议按需异步组件                                            |
| 流程设计器     | `UniBpmnDesigner`   | `bpmn-js` 相关能力                                                      | 业务门槛高，建议专项评审                                            |

---

## 九、旧系统调研结论

### 9.1 技术栈现状

`test/admin-web/old` 是旧版 Vue2 后台：

- Vue 2.6 + Vue CLI。
- Vue Router 3 + Vuex 3。
- Element UI + AVUE。
- axios 0.18。
- vue-i18n 8。
- node-sass。
- TinyMCE、WangEditor、CodeMirror、FullCalendar、ECharts、BPMN、SignaturePad、QRCode 等重型依赖。

旧系统复用能力较多，但普遍存在以下问题：

- Vue2 Options API 与 Element UI 写法，需要升级到 Vue3 + Element Plus。
- 多处组件依赖 `$route`、Vuex getter、项目私有 API。
- 多个产品线组件目录重复，如 `commonConpents`、`communitycommon`、`thepoolcommon`、`conpents_card`。
- 部分组件存在调试 `console`、硬编码中文按钮、硬编码上传 URL、硬编码租户或路径。
- 适合抽象的是交互模式和协议，不适合直接复制实现。

### 9.2 可直接借鉴的旧系统能力

| 类型          | 旧系统路径                                                    | 借鉴点                                   | 改造要求                                             |
| ------------- | ------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------- |
| 路由守卫/权限 | `test/admin-web/old/src/permission.js`                        | token 判断、白名单、锁屏、标签页、进度条 | 改为 Vue Router 4 守卫插件；路由跳转由宿主配置       |
| 请求封装      | `test/admin-web/old/src/router/axios.js`                      | token、tenant、错误码、401、blob、进度条 | 改为 `createUniRequest`，使用 axios 1.x 与可注入回调 |
| 重复请求      | `test/admin-web/old/src/router/repeat-request.js`             | pending map、请求 key、取消重复请求      | 改为 AbortController 或 axios 1.x signal             |
| 本地存储      | `test/admin-web/old/src/util/store.js`                        | key 前缀、local/session 封装             | 去掉 `eval`，增加类型与命名空间                      |
| 下载          | `test/admin-web/old/src/util/download.js`                     | blob 下载                                | 支持文件名解析、URL revoke、错误处理                 |
| 校验          | `test/admin-web/old/src/util/validate.js`、`validateRules.js` | 邮箱、手机、URL、身份证等                | 统一返回 boolean/错误消息，输出 Element Plus rules   |
| 全局方法      | `test/admin-web/old/src/const/common/index.js`                | 空值回显、枚举 label                     | 改为 `formatEmpty`、`formatOptionLabel`              |
| i18n          | `test/admin-web/old/src/i18n`                                 | 多语言包组织、语言切换                   | 升级 vue-i18n 9，组件文案可覆盖                      |
| 缓存          | `test/admin-web/old/src/cache.js`                             | keepAlive 标签页缓存清理                 | 与 `admin-web` tags-view store 配合，库只提供 helper |
| 全局错误      | `test/admin-web/old/src/error.js`                             | Vue errorHandler 收集日志                | 提供 `setupUniErrorHandler`，日志上报由宿主注入      |

### 9.3 不建议直接沉淀的内容

- `src/api/**` 中具体业务接口：仅保留 API Client 模式，不迁入具体接口。
- `src/const/crud/**` 中 AVUE 页面配置：可作为动态表单/表格 schema 设计参考，不直接进入库。
- 登录整页和多品牌图片：保留在业务工程。
- 旧系统各业务模块页面：按页面私有组件处理，除非被两个以上独立项目复用。
- TinyMCE skins 和大量 public 静态资源：组件库不承载旧项目资源包，只保留可配置资源路径。

---

## 十、与 admin-web 模板配合

### 10.1 接入位置

当前 `admin-web` 模板已预留：

- `src/plugins/business-ui.ts`
- `src/plugins/index.ts`
- `src/directives/permission.ts`
- `src/utils/request/index.ts`
- `src/stores/modules/user.ts`
- `src/stores/modules/permission.ts`
- `src/assets/styles/index.scss`

后续接入 `uni-lib` 时建议：

```ts
import UniLib, { createUniRequest } from "uni-lib";
import "uni-lib/dist/style.css";

import { usePermissionStore, useUserStore } from "@/stores";

export const setupBusinessUi = (app: App) => {
  const request = createUniRequest({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    getAccessToken: () => useUserStore().accessToken,
    onUnauthorized: () => useUserStore().resetAuth(),
  });

  app.use(UniLib, {
    request,
    permission: {
      hasPermission: (permission) =>
        usePermissionStore().hasPermission(permission),
    },
  });
};
```

### 10.2 职责分工

| 能力     | `admin-web` 模板                         | `uni-lib`                                                       |
| -------- | ---------------------------------------- | --------------------------------------------------------------- |
| 布局     | 保留 `layouts/index.vue`，允许产品线自定义 | 只提供无品牌容器/局部组件                                       |
| 登录页   | 保留页面 UI 与品牌                       | 提供认证协议、token 管理、错误处理                              |
| 路由菜单 | 宿主维护路由与菜单映射                   | 提供权限判断 helper/指令                                        |
| 请求     | 宿主配置 baseURL、业务 API               | 提供请求实例工厂和拦截器能力                                    |
| 权限能力 | 宿主可直接用指令和 JS 方法               | 提供 `v-uni-permission`、`hasUniPermission`、`useUniPermission` |
| 主题     | 宿主配置默认主题和品牌变量               | 提供 token、切换、持久化                                        |
| i18n     | 宿主负责语言包聚合                       | 组件库提供自身文案和桥接                                        |

### 10.3 迁移节奏

1. 在 `uni-lib` 中先实现 `createUniRequest`、`v-uni-permission`、`hasUniPermission`、`useUniPermission`、`UniDataTable`、`UniForm`、`UniSearchForm`、`UniUpload`、主题 token。
2. 在 `admin-web` 模板中接入 `UniLib`，替换本地 `v-permission` 为库指令或保持兼容别名。
3. 选择一个旧系统列表页做迁移样例，验证搜索表单、内置分页表格、权限指令、JS 权限校验、上传下载的组合。
4. 再沉淀富文本、复杂表单设计器、签名、二维码等重型组件。
5. 每沉淀一个组件，同步文档、示例、类型和测试。

---

## 十一、质量与交付要求

`uni-lib` 发布前必须满足：

- 组件和工具均有 TypeScript 类型。
- `Vue`、`Element Plus`、`Vue Router`、`Pinia` 作为 `peerDependencies`。
- 支持全量安装与按需导入。
- 每个组件有 README、Props、Emits、Slots、示例。
- 样式可通过 CSS 变量覆盖。
- 不包含业务项目密钥、真实域名、私有接口路径。
- 不提交调试 `console`。
- CI 至少执行 `lint`、`type-check`、`test`、`build`、`docs:build`。

推荐测试重点：

- 组件渲染与事件。
- 权限指令显示/隐藏/禁用。
- 请求拦截器 token 注入、401 回调、重复请求。
- i18n 文案切换。
- 主题变量切换。
- 上传文件大小/类型校验。
- 表格空态、加载态、分页、操作列。

---

## 十二、优先级结论

首期目标不是一次性迁移旧系统全部公共组件，而是先建立稳定的 `uni-lib` 工程和与 `admin-web` 的配合方式。

推荐第一批交付：

1. `UniLib` 安装入口、按需导出、主题样式出口。
2. `createUniRequest`、`createUniAuth`、`createUniI18nBridge`、`createUniTheme`。
3. `v-uni-permission`、`v-uni-copy`、`v-uni-debounce-click`。
4. `UniDataTable`、`UniForm`、`UniSearchForm`、`UniUpload`。
5. 与 `admin-web` 模板联调示例页。

旧系统中的 `TableBox`、`ScreenBox`、`Pagination`、`uploadFile`、`Language`、`QRcode`、`signatureH5`、`tinymce`、`Verify` 等是重要参考来源，但应按 Vue3 + Element Plus + TypeScript 重写，并通过配置与注入消除业务耦合。
