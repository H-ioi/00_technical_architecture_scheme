---
name: uni-review-mobile
description: customer-mobile 项目架构与约定—Vue 3、pages.json、Pinia、utils/request、api、uni-app 跨端。编码写法见 AI-全局编码规则；违规判定见 AI-代码校验Skill。Use for customer-mobile, 01_community-teacher, or @uni-review-mobile.
---

# uni-review-mobile — customer-mobile 项目架构

> **职责：** 描述 **customer-mobile 应该长什么样** — 目录、分层、pages.json、request、API 形态、跨端、Store。  
> **不职责：** 函数拆分、命名、注释、行数阈值 → 见 `AI-全局编码规则.md`；Critical/Warning/评审输出 → 见 `AI-代码校验Skill.md`。

---

## 0. 适用范围

| 项 | 说明 |
| --- | --- |
| **典型项目** | `customer-mobile`（标准模板）、`01_community-teacher` 等教师/家长端 |
| **技术栈** | 以目标项目 `package.json` 为准；常见为 **Vue 3 + TypeScript + Sass + uni-app**（`@dcloudio/uni-app`）+ **uni-request** + **vue-i18n** + **Pinia** |
| **非本 Skill 范围** | Taro、React Native 等；仅作对比时提及 `app.config.ts`，**不得**臆测栈 |
| **与 admin-web 差异** | 管理后台接入 **`uni-ui-lib`（`uni-lib`）** + Element Plus；**移动端不加载该库**（见 §1） |
| **规范来源** | 项目架构以本 Skill 为准；**不**依赖仓库 `前端开发规范.md` |
| **存量治理** | 历史违规可渐进修复；**新代码按本 Skill 约定** |
| **基线对照** | 目录与分层以仓库 `customer-mobile` 为准 |
| **编码原则** | 函数拆分、内联、数据流、命名、注释、体积阈值等遵循 **`AI-全局编码规则.md`** |

---

## 1. 技术栈与基础约束

| 项 | 要求 |
| --- | --- |
| 语言 | 业务代码 TypeScript |
| 样式 | Sass / `scss`；注意 rpx、安全区、胶囊按钮 |
| 状态 | Pinia；页面临时 UI 优先组件内 `ref` |
| 跨端 | H5、微信等差异用 `#ifdef` / 运行时分支，**须注释**兼容原因 |
| 接口 | 全项目 **`api/`** 或 **`services/`** 二选一；模板已选 `api/`，**不两套并存** |
| HTTP | 唯一入口 **`utils/request.ts`**；不在 `api/` 再建 `request.ts`、`http-helpers.ts`、`pickData` |
| i18n | `src/locales/`；用户可见文案走 `t()`；`tabBar` 文案宜与 locales 同步 |
| 路由 | `src/pages.json` + `src/manifest.json`；**不单靠** `app.config.ts` 替代页面注册 |
| 环境 | `.env.*` 中 `VITE_*`；密钥不进仓库；`types/env.d.ts` 声明 `ImportMetaEnv` |
| UI 组件 | **不依赖** / 安装 / `app.use` **`uni-ui-lib`（`uni-lib`）**；UI 用 uni-app 内置组件、`@dcloudio/uni-components`、官方/合规 uni-ui 插件、项目 `components/` |

**Mock：** `src/data/` 须在文件头标注 Mock，结构对齐真实接口；接 api 后改走 `api/modules`，`data/` 仅保留种子/样例。

---

## 2. 目录结构

推荐目录如下；不随意新增 `src/` 平级目录（如 `services/` 与 `api/` 并存、`src/constants/` 单消费者汇总）。

```text
customer-mobile/                 # 工程根（节选）
├── .env.development|.test|.production
├── vite.config.ts、tsconfig.json
└── src/
    ├── main.ts                  # Pinia、i18n、全局组件；side-effect: import '@/utils/request'
    ├── App.vue、app.scss、uni.scss
    ├── pages.json、manifest.json
    ├── pages/<domain>/          # 路由页面；path 与磁盘一致（§2.3）
    ├── components/common/       # 跨页 UI（如 locale-toggle）
    ├── composables/             # ≥2 页业务编排（use-xxx.ts）
    ├── stores/modules/          # Pinia 跨页状态
    ├── api/
    │   ├── modules/<domain>.ts
    │   └── index.ts             # 聚合 xxxApi
    ├── utils/
    │   ├── request.ts           # 唯一 HTTP + 拦截器解包 data
    │   └── index.ts             # 多处置纯工具（勿单处引用单文件）
    ├── types/
    │   ├── env.d.ts、shims-uni.d.ts、uni-request.d.ts
    │   └── modules/             # 与 api 域对齐的契约类型
    ├── locales/
    │   ├── constants.ts         # 语言列表/Storage Key（框架级，见 §2.4）
    │   ├── index.ts
    │   └── lang/<locale>/{home,nav,common,auth}.ts
    ├── styles/common/           # 经 app.scss → styles/index.scss 引入
    ├── data/                    # 可选 Mock
    └── static/<domain>/         # 静态资源（§2.2）
```

### 2.0 标准模板 `customer-mobile`（对照）

| 路径 | 说明 |
| --- | --- |
| `pages/home/index.vue` | 示例页；`onShow` + `uni.setNavigationBarTitle` + `t('nav.*')` |
| `api/modules/home.ts` | 接口标准案例；文件顶 `const baseUrl` 拼多 url；`function` + `this.url` |
| `api/modules/authority.ts`、`commons.ts` | 登录 / 公共能力示例 |
| `api/index.ts` | 聚合 `xxxApi`；类型可从 `@/types/modules/*` re-export |
| `utils/request.ts` | `res.data` 已是业务体；`headers.hideLoad` 控制 loading |
| `composables/use-locale.ts` | 多页语言切换 |
| `composables/use-app-common.ts` | 登录/跳转/定位等编排 |
| `stores/modules/user.ts`、`app.ts` | 用户与会话/应用级状态 |
| `main.ts` | 注册 `LocaleToggle` 等**少量**全局组件 |

**项目约定（新增）：** 无 `services/`、无 `api/constants.ts`、无 `src/env.d.ts`（类型在 `types/`）。

**层级：** `pages/` 业务路径建议 ≤3 级（`pages/a/b/c`）；超过 4 级须评估过度嵌套。  
**放置顺序：** 页面 `.vue` → 页内 `use-*.ts`（仅单页）→ `composables/` / `utils/` → `components/`。

**项目约定：** `utils/`、`api/` 不 `import` `.vue`；`pages/` 下不长期 `*-utils.ts`；单页 `setNavigationBarTitle` 不包成 composable。

### 2.1 `composables/` 与 `utils/`

| 目录 | 职责 | 命名 |
| --- | --- | --- |
| **`composables/`** | ≥2 页业务：可调 `api`、Pinia、`uni.*`；可有 `ref`/`computed` | `use-xxx.ts` → `useXxx()` |
| **`utils/`** | ≥2 处纯函数：不 `import 'vue'`、不 `ref`/store/路由 | `format-date.ts` 等 |

**判定：** 仅 1 页 → 页内或 `pages/<页>/use-*.ts`；≥2 页且「参数→结果」无接口 → `utils/`；否则 → `composables/`。

**项目约定：** `utils/` 不用 `ref`/store；`composables/` 不堆纯格式化；`draft.ts` 须有 `useXxx()` 导出。

### 2.2 样式与 `static/`

| 落点 | 职责 |
| --- | --- |
| `uni.scss` | 仅 SCSS 变量，不写 class |
| `app.scss` → `styles/` | 全局 class（`common/`、`modules/`） |
| 页面 `<style scoped>` | 本页样式；≥2 页重复 class 上提 `styles/` |

`static/` 按域分子目录（`common/`、`tabbar/`、`auth/`…）；根目录不堆散文件、不用拼音文件名。  
引用：模板 `/static/...`；脚本 `@/static/...`；`pages.json` tabBar 用 `static/...`（无前导 `/`）。

### 2.3 页面与路由

- `pages.json` 的 `path` 与磁盘路径一致；末段 **不必** 叫 `index.vue`（可与 path 末段同名，如 `floors.vue`）。
- 新建页面须同步 `pages.json`；分包用 `subPackages`，跳转 path 与注册一致。
- 运行时标题：页内 `onShow` + `t('nav.*')`；`pages.json` 的 `navigationBarTitleText` 作兜底/编译期默认。

### 2.4 国际化（i18n）

- 默认语言包：`zh-CN`、`en-US`、`ja-JP`、`ko-KR`；每语言 `lang/<locale>/index.ts` 聚合 `home`、`nav`、`common`、`auth` 等域文件。
- 新增用户可见文案：在对应域 `.ts` 增加 key，**四国语言同步**；页面用 `t('domain.key')`。
- **`locales/constants.ts` 为例外**：`LOCALE_STORAGE_KEY`、`SUPPORTED_LOCALES` 等被 `use-locale`、组件、store **多处**引用，允许集中；单页文案 key 不抽到 constants。
- 切换语言：走 `use-locale`（或等价 composable），持久化 Storage Key 与 `constants` 一致。

### 2.5 环境变量与类型

- API 主机等：`import.meta.env.VITE_*`（见 `types/env.d.ts`）；按 mode 使用 `.env.development` / `.env.test` / `.env.production`。
- 业务契约：`types/modules/<domain>.ts`，与 `api/modules/<domain>.ts` 同域；`api/index.ts` 可按需 re-export 类型。
- 全局声明：`types/env.d.ts`、`shims-uni.d.ts`、`uni-request.d.ts`；类型声明放在 `types/`，不在 `src/` 根再放 `env.d.ts`。

### 2.6 接口层（`api/modules`）

与 `admin-web` 对齐，默认导出能力对象：

```ts
// 文件顶：同文件多 url 共用前缀（≥2 次引用才 const）
const baseUrl = '/demo/home'

export default {
  status: {
    url: `${baseUrl}/status`,
    name: '首页运行状态',
    async get(this: { url: string }) {
      const res = await http.get<HomeStatusVO>(this.url, { headers: { hideLoad: true } })
      return res.data
    }
  }
}
```

| 职责 | 不放在此层 |
| --- | --- |
| `get/post/put/delete`；`this.url`；类型从 `@/types/modules/*` 引入 | UI、toast、路由；`api/constants.ts`；页面拼 URL |
| `api/index.ts` 聚合 `xxxApi` | 在 api 再写 `pickData`（request 已解包） |

页面：`import { homeApi } from '@/api'` → `await homeApi.status.get()`。

### 2.7 Pinia（`stores/modules`）

- 跨页、需持久化或全局会话的状态（用户、应用配置、草稿等）。
- Store 内不做整页 UI 编排、DOM；401 跳转等放在 `utils/request` 或 composable。
- 与 `api` 协作：store action 可调 `xxxApi`，不绕过 `api` 在 store 拼 URL。

---

## 3. 体积与拆分

单文件行数、函数拆分阈值遵循 **`AI-全局编码规则.md` §3.1**（33 / 450 / 800）。  
同页 **2+** 相同模板块 → 抽 `pages/.../components/` 或 `components/`。

推荐：列表/提交 → `use-*.ts` 或 composable；大块 UI → 子组件。

---

## 4. 代码分层

```text
utils/request → api/modules → composables（≥2 页）/ 页面 script → pages/*.vue → components
```

| 层 | 职责 | 不放在此层 |
| --- | --- | --- |
| `utils/request` | Token、loading、code 校验、解包 `data`、401 | 业务 URL |
| `api/modules` | 接口定义 + 调 `http` | UI、路由、无复用 constants 文件 |
| `pages` | 编排、`onShow` 标题、`t()` | 大量直连 `http` 拼 URL |
| `composables` | ≥2 页业务编排 | 单页薄包装；纯格式化 |
| `utils`（除 request） | ≥2 处纯函数 | `ref`、单处引用独立文件 |
| `stores` | 跨页状态 | 整页流程、DOM |
| `data/` | Mock、种子 | 接 api 后仍作唯一数据源 |

---

## 5. 跨端（H5 / 小程序）

- 仅 H5 能力（摄像头、DOM、部分 npm 包）须有 **非 H5 分支或提示**，并注释原因。
- 条件编译：`// #ifdef H5` … `// #endif`；或运行时 `isH5()` + 模板分支。
- 样式：避免仅 H5 的 px 在小程序无适配；自定义 tabBar 与 `custom-tab-bar/`、 `pages.json` 一致。
- 多页端判断 → `composables/`；单页 → 页内。

---

## 6. 组件

**仅当**降低阅读成本或 **≥2 页**复用（第 3 次相同逻辑再抽取）。

| 范围 | 位置 |
| --- | --- |
| 当前页 | `pages/.../components/` |
| 2+ 页（本项目） | `components/` |
| 2+ 移动端项目 | 抽成独立 npm 包或 monorepo 内共享 `components/`；**不为复用接入 `uni-lib`** |

全局注册：仅 **极少数**全站组件在 `main.ts` `app.component`；其余就近 import。

**项目约定：** 不为美观拆微组件；无复用不进 `components/`；不为对齐后台而引入 `Uni*` / `uni-ui-lib` / Element Plus。

---

## 7. Mock 与迭代日志

- Mock 须在文件头标注，结构对齐真实接口。
- 改动本 monorepo 的 `customer-mobile` 时，更新 `.ai-coding-md/迭代-YYYYMMDD.md`。
