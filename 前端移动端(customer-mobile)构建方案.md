# 前端移动端（customer-mobile）构建方案

本文档基于 `前端架构方案总览.md` 与 `前端开发规范.md` 编制，作为 `customer-mobile` 项目的落地基线。目标是统一移动端跨端工程（H5 / 微信小程序等）的建设方式，明确从初始化、目录分层、状态管理、接口组织、样式规范到构建发布的完整路径。

---

## 一、项目定位

`customer-mobile` 用于承载移动端业务场景，如移动门户、活动页、会员中心、个人中心与轻交易流程等。

该类项目核心诉求：

- 一套代码适配多端（小程序 + H5）
- 首屏体验稳定、交互流畅
- 页面目录与路由结构一致，便于协作
- 接口能力集中管理，避免页面散写请求
- 文案与界面语言可切换，默认覆盖中英日韩四类语言包

统一采用：`uni-app + Vue 3（Vite）+ TypeScript + Sass`，国际化采用 **`vue-i18n`（Vue 3 Composition API 模式）**。

---

## 二、建设目标

- 固化移动端跨端项目的初始化模板与目录边界
- 统一页面、组件、composable、service、store 的职责分层
- 统一样式变量与适配口径，避免多套规则并存
- 默认提供 **中 / 英 / 日 / 韩** 四类语言资源，并与工程化脚本、提交流程一致纳入维护
- 建立可复制的质量门禁（Lint / 格式化 / 类型检查）
- 建立标准化构建发布流程（多端构建、产物归档、回滚）

---

## 三、技术选型与约束

### 3.1 选型总览

| 类别 | 选型 |
| --- | --- |
| 框架 | uni-app（Vue 3 + Vite） |
| 语言 | TypeScript（默认开启） |
| 样式 | Sass（SCSS） |
| 状态管理 | Pinia（uni-app 适配方案） |
| 国际化 | vue-i18n（默认语言包：`zh-CN`、`en-US`、`ja-JP`、`ko-KR`） |
| 接口层 | **`api/`**（模板已统一；与 `admin-web` 模块形态一致） |
| 请求封装 | **`utils/request.ts`**（`uni-request`；拦截器解包业务 `data`） |
| UI 组件 | uni-app 内置 + `@dcloudio/uni-components` + 项目 `components/`；**不接入** `uni-ui-lib`（`uni-lib`） |
| 质量体系 | ESLint + Prettier + Stylelint + lint-staged + commitlint |

### 3.2 基础约束

- 新模块必须使用 TypeScript，不新增纯 JavaScript 业务文件
- 样式统一使用 Sass，不引入 Less / Stylus 作为主方案
- 状态管理统一使用 Pinia，不混用多套全局状态方案
- 接口目录统一为 **`api/`**；HTTP 实例与拦截器在 **`utils/request.ts`**，不在 `api/` 再建 `request.ts` / `http-helpers.ts`
- **不加载 `uni-lib` 组件库**：`uni-ui-lib` 面向管理后台（Element Plus、`UniLayout` 等），与小程序/H5 运行时、包体积不兼容；跨端 UI 复用留在本项目 `components/` 或独立移动端组件包，禁止 `npm i uni-ui-lib` / `app.use(UniLib)`
- 遵循 **uni-review-mobile** 内联原则：单处引用的 path、常量、薄 composable、单函数 utils 文件禁止抽取
- 跨页面复用能力优先沉淀 `components/`、`composables/`
- 文案不直接硬编码在多个页面：可抽成 i18n 词条，词条按模块分文件维护

---

## 四、目录结构与分层

以下目录树**与当前仓库 `customer-mobile` 标准模板一致**（`node_modules`、构建产物不列入）：

```bash
customer-mobile/
├── .env.development / .env.test / .env.production   # VITE_API_BASE_URL 等
├── .husky/、eslint、prettier、stylelint、commitlint
├── package.json、package-lock.json
├── tsconfig.json、vite.config.ts、index.html
└── src/
    ├── main.ts                    # Pinia、i18n；side-effect: import '@/utils/request'
    ├── App.vue、app.scss、uni.scss
    ├── manifest.json、pages.json   # 当前仅注册 pages/home/index
    ├── pages/home/index.vue       # 示例首页（onShow + setNavigationBarTitle）
    ├── components/common/
    │   ├── locale-toggle.vue      # 全局注册
    │   └── section-title.vue
    ├── composables/
    │   ├── use-locale.ts          # 多页语言切换（持久化 + 导航栏同步）
    │   └── use-app-common.ts      # 登录/跳转/定位等（原 mixin 聚合，勿再拆薄包装）
    ├── api/
    │   ├── index.ts               # 导出 authorityApi、commonsApi、homeApi
    │   └── modules/
    │       ├── home.ts            # 标准案例（REST 前缀写文件顶 const）
    │       ├── authority.ts
    │       └── commons.ts
    ├── utils/
    │   ├── request.ts             # 唯一 HTTP 入口；拦截器解包 res.data
    │   ├── index.ts               # UUID、防抖、金额运算等（多页/多处置才保留）
    │   └── math.ts
    ├── stores/modules/
    │   ├── app.ts
    │   └── user.ts
    ├── types/
    │   ├── env.d.ts、shims-uni.d.ts、uni-request.d.ts
    │   └── modules/               # http、user、authority、home、commons…
    ├── locales/
    │   ├── constants.ts、index.ts
    │   └── lang/{zh-CN,en-US,ja-JP,ko-KR}/
    │       ├── index.ts           # 聚合 home/nav/common/auth
    │       ├── home.ts、nav.ts、common.ts、auth.ts
    └── styles/common/             # _layout.scss、_form-reset.scss
```

分层职责：

- `pages/`：页面编排；导航标题在页内 `onShow` + `uni.setNavigationBarTitle` + `t('nav.*')`
- `components/`：跨页 UI（≥2 页再用 `components/`）
- `composables/`：**仅多页复用**的业务编排；禁止 `use-navigation-title` 类单页薄包装
- `api/modules/`：按域封装接口（与 admin-web 相同 `{ url, name, get/post }`）；禁止 `api/constants.ts`、`pickData` 辅助文件
- `utils/request.ts`：鉴权、loading、业务 code、**统一解包 `data`**
- `utils/`：无 Vue、无接口；**禁止**仅一处引用的单函数文件
- `stores/modules/`：跨页状态（如 `user`、`app`）
- `types/modules/`：请求/响应契约；全局声明放 `types/*.d.ts`
- `locales/lang/<locale>/`：按域拆分词条文件

---

## 五、路由与页面组织方案

### 5.1 路由组织

- 应用路由在 `pages.json` 统一声明
- 页面目录结构需贴近路由结构，避免深层嵌套
- 全局导航栏、分包、tabBar 等统一在 `pages.json` 管理

### 5.2 分包建议（小程序端）

满足以下条件建议分包：

- 非首页高频路径（低频业务页、配置页）
- 体积较大且启动非必需页面
- 活动类临时页面

约束：

- 主包仅保留首屏与公共基础能力
- 分包页面禁止重复引入大体积依赖

---

## 六、数据流与接口方案

标准数据流：

```text
Page / Component -> composable（≥2 页）或页内逻辑 -> api/modules -> utils/request
```

### 6.1 实施要求

- 页面通过 `import { xxxApi } from '@/api'` 调接口；`const res = await homeApi.xxx.get()`，`return res.data`（已是业务体）
- 鉴权、loading、业务 code、toast 在 `utils/request.ts` 拦截器统一处理
- 同业务域一个 `api/modules/<domain>.ts`；路径前缀写在**该文件顶部** `const base = '...'`（禁止 `api/constants.ts`）
- 类型定义在 `types/modules/<domain>.ts`，按需从 `api/index.ts` 再导出类型

### 6.2 禁止事项

- 在页面中直接拼接大量请求逻辑
- 在 `utils/` 写依赖页面生命周期的业务逻辑
- 同一接口在多个页面复制粘贴调用实现

---

## 七、状态管理策略（Pinia）

使用原则：

- 页面私有临时状态优先放组件内部
- 跨组件共享、跨页面复用、需持久化状态再进入 Pinia
- Store 按业务域拆分，不做“全局大仓库”

推荐目录：

```bash
src/stores/
├── modules/
│   ├── user.ts
│   ├── app.ts
│   └── order.ts
└── index.ts
```

禁止事项：

- 将所有数据无差别塞入全局 Store
- 在 Store 编写 DOM 逻辑或页面渲染细节

---

## 八、组件与复用策略

组件分层：

- 页面私有组件：页面目录内就近维护
- 项目复用组件：放 `components/common` 或 `components/business`
- 跨项目复用组件：评估后进入 `uni-lib`，不在本项目硬拷贝

抽离触发条件：

- 同组件在 `2` 个及以上页面重复出现
- 同类结构与交互被复制实现
- 组件输入输出边界已清晰（props / emits）

---

## 九、样式体系与适配口径

### 9.1 样式组织

- 全局变量、mixin、reset 按职责拆分到 `assets/styles/` 或 `uni.scss`
- 组件样式默认局部隔离，避免全局污染
- 优先使用设计 token，不长期写死魔法值

### 9.2 端侧适配建议

- uni-app 端建议统一使用 `rpx` 作为核心尺寸单位
- 字体、间距、点击区尺寸使用统一变量和 mixin
- 不混杂多套断点体系，减少样式维护成本

### 9.3 样式约束

- 禁止深层级选择器嵌套滥用
- 避免复制粘贴大段重复样式，复用样式应抽象

---

## 十、命名与代码规范

命名口径（与团队规范一致）：

- 标识符使用 `camelCase`
- 目录和文件使用 `kebab-case`
- 组合式函数使用 `use-xxx.ts`
- 组件名语义清晰，避免 `data`、`temp`、`info` 等泛化命名
- 目录已经表达页面或业务域时，文件名只表达职责，不重复目录语义
- 页面入口优先使用 `pages/<route>/index.vue`；页面内组合逻辑和本地函数使用 `use-list.ts`、`use-detail.ts`、`loadData` 等短职责名

代码分层约束：

- 页面层不承担底层请求实现
- 接口层不编写视图逻辑
- 工具层保持纯函数属性

---

## 十一、工程脚本与质量门禁

建议脚本（示例）：

```json
{
  "scripts": {
    "dev:h5": "uni",
    "dev:mp-weixin": "uni -p mp-weixin",
    "build:h5": "uni build -p h5",
    "build:mp-weixin": "uni build -p mp-weixin",
    "lint": "eslint \"src/**/*.{ts,vue}\" --max-warnings 0",
    "lint:fix": "eslint \"src/**/*.{ts,vue}\" --fix",
    "lint:style": "stylelint \"src/**/*.{scss,css,vue}\" --allow-empty-input",
    "format": "prettier --write \"src/**/*.{ts,vue,scss,md,json}\"",
    "type-check": "vue-tsc --noEmit"
  }
}
```

门禁要求：

- 提交前必须通过 `lint`、`lint:style`、`type-check`
- `pre-commit` 执行 `lint-staged`
- 禁止提交调试 `console.log`、`console.debug`、`debugger`
- 提交信息遵循 Conventional Commits

---

## 十二、环境配置与多端差异处理

### 12.1 环境文件建议

- `.env.development`
- `.env.test`
- `.env.production`

### 12.2 配置要求

- 运行时配置由 `.env.*` 的 `VITE_API_BASE_URL` 注入，`utils/request.ts` 读取 `import.meta.env`
- 按端差异（H5 / 小程序）在**需要时**于页面或 composable 内 `#ifdef` / 分支处理，并注释原因；勿为单页预建 `platform.ts`
- 禁止页面散写端能力判断与兼容逻辑

---

## 十三、开发与联调流程

### 13.1 本地开发

```bash
npm install
npm run dev:mp-weixin
# 或
npm run dev:h5
```

### 13.2 新增页面标准动作

1. 在 `pages/` 新建页面目录并在 `pages.json` 注册
2. 单页逻辑写在页面 `<script setup>`；**≥2 页**复用再抽 `composables/use-xxx.ts`
3. 涉及接口：先 `types/modules/` → `api/modules/` → `api/index.ts` 导出 `xxxApi`
4. 导航标题：`onShow` 内 `uni.setNavigationBarTitle({ title: t('nav.xxx') })`
5. 样式变量进 `uni.scss`；跨页 class 进 `styles/common/`

### 13.3 新增接口标准动作

1. 在 `api/modules/<domain>.ts` 增加 `{ url, name, get/post }`（参考 `home.ts`）
2. 在 `api/index.ts` 导出 `xxxApi` 与必要类型
3. 页面或 composable 调用 `xxxApi`；禁止页面裸拼 `http` URL

---

## 十四、构建与发布方案

### 14.1 多端构建

- 微信小程序构建：`npm run build:mp-weixin`
- H5 构建：`npm run build:h5`

### 14.2 发布建议流程

1. 合并前通过 `lint`、`type-check`、`build`
2. 测试环境验证核心流程（登录、列表、详情、支付前链路）
3. 执行灰度发布并观察错误监控
4. 保留可回滚版本与构建产物记录

---

## 十五、测试与验收清单

测试建议：

- `utils/`、`composables/` 纯逻辑优先补单元测试
- 核心交互组件补基础组件测试
- 关键业务链路补端到端验证（至少覆盖主路径）

验收清单：

- 功能符合需求
- 无明显控制台报错
- 无 Lint / 类型错误
- 命名、目录、分层符合规范
- 复用层级判断合理（页面内 / 项目内 / 组件库）
- 提交信息与发布记录完整

---

## 十六、国际化（vue-i18n）

### 16.1 默认语言范围

工程默认内置四类语言资源（可按业务扩展）：

| 语言代码 | 说明 |
| --- | --- |
| `zh-CN` | 简体中文（默认回退语言） |
| `en-US` | English |
| `ja-JP` | 日本語 |
| `ko-KR` | 한국어 |

### 16.2 工程约定

- 依赖：`vue-i18n`（与 Vue 3 配套），在 `main.ts` 中 `app.use(i18n)`，且 **`legacy: false`**，页面内使用 `useI18n()`。
- 词条文件：`src/locales/lang/<locale>/` 下按域拆分（`home.ts`、`nav.ts`、`common.ts`、`auth.ts`），由 `index.ts` 聚合；键名用点分层级（如 `home.title`、`nav.homeTitle`）。
- 常量：`src/locales/constants.ts` 声明 `LOCALE_STORAGE_KEY`、`SUPPORTED_LOCALES`、`DEFAULT_LOCALE`，避免魔法字符串散落在业务里。
- 持久化：用户所选语言写入 `uni.setStorageSync`，应用启动时用 `uni.getStorageSync` 恢复到 `createI18n({ locale })`，保证二次打开仍是上次语言。

### 16.3 uni-app 中与原生 UI 的配合

`pages.json` 里的 **`tabBar.list[].text`、`navigationBarTitleText` 为静态文案**，无法随语言自动切换。约定如下：

1. **Tab 文案**（若配置 tabBar）：启动与切换语言后 `uni.setTabBarItem` + `t('tab.*')`；当前模板无 tabBar，接入后再补。
2. **导航栏标题**：各页 **`onShow`** 内 `uni.setNavigationBarTitle({ title: t('nav.*') })`，**不要**单独建 `use-navigation-title.ts`。
3. **页面内文案**：模板与脚本统一 `t('...')`。

### 16.4 与分层的关系

- 语言切换：`composables/use-locale.ts`（多页会用 `LocaleToggle`）；内部 `persistLocale`、`syncNavigationBarForCurrentRoute`。
- 接口错误：`utils/request.ts` 拦截器统一 toast；业务页不重复处理 code。

### 16.5 验收补充

- 四类语言切换后：Tab 文案、当前页导航标题、页面内词条无混用或未翻译项（若某键暂缺，应能回退到 `zh-CN`）。
- 杀进程重启后语言与存储一致。

---

## 十七、标准模板现状与扩展方式（customer-mobile）

当前仓库为**可复制的标准模板**，不是完整业务应用：

| 已具备 | 说明 |
| --- | --- |
| 单页示例 | `pages/home/index` + i18n + `LocaleToggle` |
| 接口层 | `api/` + `home` 标准模块；`authority`、`commons` 为登录/定位示例 |
| 请求 | `utils/request.ts`（`uni-request@1.0.2`） |
| 跨页能力 | `use-locale`、`use-app-common`（勿再拆碎） |
| 状态 | `stores/modules/app`、`user` |
| 工具 | `utils/index.ts`、`math.ts`（仅多处置引用） |
| 质量门禁 | `lint` / `lint:style` / `type-check` / Husky |

| 模板未包含（按业务增量） | 说明 |
| --- | --- |
| tabBar / 多 Tab 页 | 在 `pages.json` 注册并同步 i18n |
| `services/` | **禁止**与 `api/` 并存 |
| `data/` Mock 目录 | 需要时新建并标注 Mock |
| `static/` | 按 §2.2 按域建子目录 |

**评审与实现：** 以 Cursor Skill **`uni-review-mobile`** 为准（含内联原则：禁止单处引用的 constants、薄 composable、单函数 utils）。

**复制模板后建议顺序：**

1. 改 `package.json` name、`.env.*` 的 `VITE_API_BASE_URL`
2. `pages.json` 注册业务页；页内 `onShow` 设置导航标题
3. 按域增加 `api/modules` + `types/modules`
4. 仅当逻辑 **≥2 页** 使用时再增 `composables/`
5. 跑通 `lint` + `type-check` + 目标端 `build`

项目内说明见 [customer-mobile/README.md](./customer-mobile/README.md)。
