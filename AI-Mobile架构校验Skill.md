---
name: uni-review-mobile
description: Self-contained standards for uni-app mobile (H5 / 小程序)—Vue 3, pages.json, Pinia, api + utils/request; no uni-lib/uni-ui-lib. Use for customer-mobile, 01_community-teacher, or @uni-review-mobile. Does not require 前端开发规范.md.
---

# uni-review-mobile — H5 & 小程序

## 0. 适用范围与裁决顺序

| 项                    | 说明                                                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **典型项目**          | `customer-mobile`（标准模板）、`01_community-teacher` 等教师/家长端                                                                               |
| **技术栈**            | 以目标项目 `package.json` 为准；常见为 **Vue 3 + TypeScript + Sass + uni-app**（`@dcloudio/uni-app`）+ **uni-request** + **vue-i18n** + **Pinia** |
| **非本 Skill 范围**   | Taro、React Native 等；仅作对比时提及 `app.config.ts`，**不得**臆测栈                                                                             |
| **与 admin-web 差异** | 管理后台接入 **`uni-ui-lib`（`uni-lib`）** + Element Plus；**移动端不加载该库**（见 §1）                                                          |
| **规范来源**          | 评审与**新增/改动**代码以本 Skill 为**唯一**裁决依据；**不**依赖仓库 `前端开发规范.md`                                                            |
| **存量治理**          | 历史违规可渐进修复；**新代码必须合规**                                                                                                            |
| **基线对照**          | 目录与分层以仓库 `customer-mobile` 为准；与本文冲突时以本文为准                                                                                   |

**行数规则关系（避免误读）：**

- **单函数有效逻辑 > 33 行** → 必须拆分（§3）。
- **有效逻辑 < 5 行且仅调用 1 次** → 禁止单独成函数（§7.1）。
- **5～33 行、表达完整业务动作** → 可保留在一个函数内，不强制再拆。

---

## 1. 技术栈与基础约束

| 项      | 要求                                                                                                                                                         |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 语言    | 业务代码 TypeScript；禁止新增纯 JS 业务模块                                                                                                                  |
| 样式    | Sass / `scss`；禁止以 Less/Stylus 为主方案；注意 rpx、安全区、胶囊按钮                                                                                       |
| 状态    | Pinia；页面临时 UI 优先组件内 `ref`                                                                                                                          |
| 跨端    | H5、微信等差异用 `#ifdef` / 运行时分支，**须注释**兼容原因                                                                                                   |
| 接口    | 全项目 **`api/`** 或 **`services/`** 二选一；**禁止**两套并存（模板已选 `api/`）                                                                             |
| HTTP    | 唯一入口 **`utils/request.ts`**；禁止在 `api/` 再建 `request.ts`、`http-helpers.ts`、`pickData`                                                              |
| i18n    | `src/locales/`；用户可见文案走 `t()`；禁止多页硬编码（`tabBar` 文案宜与 locales 同步）                                                                       |
| 路由    | `src/pages.json` + `src/manifest.json`；**不单靠** `app.config.ts` 替代页面注册                                                                              |
| 环境    | `.env.*` 中 `VITE_*`；密钥不进仓库；`types/env.d.ts` 声明 `ImportMetaEnv`                                                                                    |
| UI 组件 | **禁止**依赖 / 安装 / `app.use` **`uni-ui-lib`（`uni-lib`）**；UI 用 uni-app 内置组件、`@dcloudio/uni-components`、官方/合规 uni-ui 插件、项目 `components/` |

**Mock：** `src/data/` 须在文件头标注 Mock，结构对齐真实接口；接 api 后改走 `api/modules`，`data/` 仅保留种子/样例。

---

## 2. 目录结构

禁止随意新增 `src/` 平级目录（如 `services/` 与 `api/` 并存、`src/constants/` 单消费者汇总）。

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

### 2.0 标准模板 `customer-mobile`（评审对照）

| 路径                                     | 说明                                                                        |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| `pages/home/index.vue`                   | 示例页；`onShow` + `uni.setNavigationBarTitle` + `t('nav.*')`               |
| `api/modules/home.ts`                    | 接口标准案例；文件顶 `const baseUrl` 拼多 url；`function` + `this.url`      |
| `api/modules/authority.ts`、`commons.ts` | 登录 / 公共能力示例                                                         |
| `api/index.ts`                           | 聚合 `xxxApi`；类型可从 `@/types/modules/*` re-export                       |
| `utils/request.ts`                       | `res.data` 已是业务体；`headers.hideLoad` 控制 loading                      |
| `composables/use-locale.ts`              | 多页语言切换                                                                |
| `composables/use-app-common.ts`          | 登录/跳转/定位等编排；**勿**再拆 `use-navigation-title` 等单页薄包装        |
| `stores/modules/user.ts`、`app.ts`       | 用户与会话/应用级状态                                                       |
| `main.ts`                                | 注册 `LocaleToggle` 等**少量**全局组件                                      |
| 禁止项                                   | 无 `services/`、无 `api/constants.ts`、无 `src/env.d.ts`（类型在 `types/`） |

**层级：** `pages/` 业务路径建议 ≤3 级（`pages/a/b/c`）；超过 4 级须评估过度嵌套。
**放置顺序：** 页面 `.vue` → 页内 `use-*.ts`（仅单页）→ `composables/` / `utils/` → `components/`。

**禁止：** `utils/`、`api/` 中 `import` `.vue`；`pages/` 下长期 `*-utils.ts`；单页 `setNavigationBarTitle` 包成 composable。

### 2.1 `composables/` 与 `utils/`

| 目录               | 职责                                                         | 命名                      |
| ------------------ | ------------------------------------------------------------ | ------------------------- |
| **`composables/`** | ≥2 页业务：可调 `api`、Pinia、`uni.*`；可有 `ref`/`computed` | `use-xxx.ts` → `useXxx()` |
| **`utils/`**       | ≥2 处纯函数：不 `import 'vue'`、不 `ref`/store/路由          | `format-date.ts` 等       |

**判定：** 仅 1 页 → 页内或 `pages/<页>/use-*.ts`；≥2 页且「参数→返回值」无接口 → `utils/`；否则 → `composables/`。
**禁止：** `utils/` 用 `ref`/store；`composables/` 堆纯格式化；`draft.ts` 无 `useXxx()` 导出。

### 2.2 样式与 `static/`

| 落点                   | 职责                                     |
| ---------------------- | ---------------------------------------- |
| `uni.scss`             | 仅 SCSS 变量，不写 class                 |
| `app.scss` → `styles/` | 全局 class（`common/`、`modules/`）      |
| 页面 `<style scoped>`  | 本页样式；≥2 页重复 class 上提 `styles/` |

`static/` 按域分子目录（`common/`、`tabbar/`、`auth/`…）；禁止根目录堆散文件、拼音文件名。
引用：模板 `/static/...`；脚本 `@/static/...`；`pages.json` tabBar 用 `static/...`（无前导 `/`）。

### 2.3 页面与路由

- `pages.json` 的 `path` 与磁盘路径一致；末段 **不必** 叫 `index.vue`（可与 path 末段同名，如 `floors.vue`）。
- 新建页面须同步 `pages.json`；分包用 `subPackages`，跳转 path 与注册一致。
- 运行时标题：页内 `onShow` + `t('nav.*')`；`pages.json` 的 `navigationBarTitleText` 作兜底/编译期默认。

### 2.4 国际化（i18n）

- 默认语言包：`zh-CN`、`en-US`、`ja-JP`、`ko-KR`；每语言 `lang/<locale>/index.ts` 聚合 `home`、`nav`、`common`、`auth` 等域文件。
- 新增用户可见文案：在对应域 `.ts` 增加 key，**四国语言同步**；页面用 `t('domain.key')`。
- **`locales/constants.ts` 为例外**：`LOCALE_STORAGE_KEY`、`SUPPORTED_LOCALES` 等被 `use-locale`、组件、store **多处**引用，允许集中；**禁止**把仅单页使用的文案 key 抽到 constants。
- 切换语言：走 `use-locale`（或等价 composable），持久化 Storage Key 与 `constants` 一致。

### 2.5 环境变量与类型

- API 基址等：`import.meta.env.VITE_*`（见 `types/env.d.ts`）；按 mode 使用 `.env.development` / `.env.test` / `.env.production`。
- 业务契约：`types/modules/<domain>.ts`，与 `api/modules/<domain>.ts` 同域；`api/index.ts` 可按需 re-export 类型。
- 全局声明：`types/env.d.ts`、`shims-uni.d.ts`、`uni-request.d.ts`；**禁止**在 `src/` 根再放 `env.d.ts`。

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

| 允许                                                               | 禁止                                            |
| ------------------------------------------------------------------ | ----------------------------------------------- |
| `get/post/put/delete`；`this.url`；类型从 `@/types/modules/*` 引入 | UI、toast、路由；`api/constants.ts`；页面拼 URL |
| `api/index.ts` 聚合 `xxxApi`                                       | 在 api 再写 `pickData`（request 已解包）        |

页面：`import { homeApi } from '@/api'` → `await homeApi.status.get()`。

### 2.7 Pinia（`stores/modules`）

- 跨页、需持久化或全局会话的状态（用户、应用配置、草稿等）。
- **禁止**在 store 内做整页 UI 编排、DOM；401 跳转等放在 `utils/request` 或 composable。
- 与 `api` 协作：store action 可调 `xxxApi`，不绕过 `api` 在 store 拼 URL。

---

## 3. 体积与拆分

| 阈值                                           | 动作                                            |
| ---------------------------------------------- | ----------------------------------------------- |
| `pages/`、`components/` 下 `.vue` **> 800 行** | **必须**拆分                                    |
| 单 `.vue` **> 440 行**                         | **新增/改动**不得使文件超限；存量超标须排期治理 |
| 单函数有效逻辑 **> 33 行**                     | 同页拆函数或 `use-*.ts` / `composables/`        |
| 同页 **2+** 相同模板块                         | 抽 `pages/.../components/` 或 `components/`     |

推荐：列表/提交 → `use-*.ts` 或 composable；大块 UI → 子组件。

---

## 4. 代码分层

```text
utils/request → api/modules → composables（≥2 页）/ 页面 script → pages/*.vue → components
```

| 层                    | 允许                                        | 禁止                            |
| --------------------- | ------------------------------------------- | ------------------------------- |
| `utils/request`       | Token、loading、code 校验、解包 `data`、401 | 业务 URL                        |
| `api/modules`         | 接口定义 + 调 `http`                        | UI、路由、无复用 constants 文件 |
| `pages`               | 编排、`onShow` 标题、`t()`                  | 大量直连 `http` 拼 URL          |
| `composables`         | ≥2 页业务编排                               | 单页薄包装；纯格式化            |
| `utils`（除 request） | ≥2 处纯函数                                 | `ref`、单处引用独立文件         |
| `stores`              | 跨页状态                                    | 整页流程、DOM                   |
| `data/`               | Mock、种子                                  | 接 api 后仍作唯一数据源         |

---

## 5. 跨端（H5 / 小程序）

- 仅 H5 能力（摄像头、DOM、部分 npm 包）须有 **非 H5 分支或提示**，并注释原因。
- 条件编译：`// #ifdef H5` … `// #endif`；或运行时 `isH5()` + 模板分支。
- 样式：避免仅 H5 的 px 在小程序无适配；自定义 tabBar 与 `custom-tab-bar/`、 `pages.json` 一致。
- 多页端判断 → `composables/`；单页 → 页内。

---

## 6. 组件

**仅当**降低阅读成本或 **≥2 页**复用（第 3 次相同逻辑必须抽取）。

| 范围            | 位置                                                                          |
| --------------- | ----------------------------------------------------------------------------- |
| 当前页          | `pages/.../components/`                                                       |
| 2+ 页（本项目） | `components/`                                                                 |
| 2+ 移动端项目   | 抽成独立 npm 包或 monorepo 内共享 `components/`；**不得**为复用接入 `uni-lib` |

全局注册：仅 **极少数**全站组件在 `main.ts` `app.component`；其余就近 import。
**禁止：** 为美观拆微组件；无复用进 `components/`；为对齐后台而引入 `Uni*` / `uni-ui-lib` / Element Plus。

---

## 7. 内联原则（函数与常量）

### 7.1 禁止拆碎步骤函数

**适用：** 页面、composables、utils、`api`、request 拦截器、store、组件方法等**一切**函数。

读一条用户路径时，不为 2～4 行「步骤」单独建函数（`attach*`、`ensure*` 仅一处调用）。

| 情形                                             | 处理                         |
| ------------------------------------------------ | ---------------------------- |
| 仅调用 1 次                                      | 写在唯一调用处               |
| 有效逻辑 < 5 行（去空行/纯注释后）               | 不单独建函数                 |
| 拆碎同一动作链（多个 <5 行 validate→build→post） | 合并进一个 `handleSubmit` 等 |
| 完整业务动作且 ≥5 行                             | 可独立函数                   |
| ≥2 处真实调用且 ≥5 行                            | 可抽取                       |
| 多处复用的基建（如 loading 计数 push/pop）       | 可保留                       |

```ts
// ❌ 仅一处调用的步骤函数
function attachToken(h: Record<string, unknown>) {
  h['x-access-token'] = uni.getStorageSync('token') || ''
}

// ✅ 内联在拦截器
uniRequest.interceptors.request.use((config) => {
  if (!config.headers) config.headers = {}
  config.headers['x-access-token'] = uni.getStorageSync('token') || ''
  return config
})
```

**方法命名：** 动词 + 业务，如 `handleSubmit`、`fetchList`；**禁止** `handleData`、`doAction`。

### 7.2 禁止无谓常量/配置抽离

先数**真实消费者**（引用该取值或文件数）。

| 情形                                   | 处理                                     |
| -------------------------------------- | ---------------------------------------- |
| 取值仅 1 处                            | 字面量 inline                            |
| 对象每 key 仅用 1 次                   | 禁止建 `APP_ROUTES` 表                   |
| 仅 1 个文件 import 的 `constants/*.ts` | 禁止；写在消费文件顶                     |
| 同文件内同值 ≥2 次，或 ≥2 文件引用     | 可在消费域文件顶 `const`（如 `baseUrl`） |
| 环境变量、`pages.json`、`manifest`     | 平台配置，职责不同                       |
| `locales/constants.ts` 语言枚举        | 框架级多消费者，允许                     |

**禁止：** 无复用的 `api/constants.ts`、`config/` 汇总、为 Lint 机械抽参。

---

## 8. 命名

| 类别       | 规则                                       |
| ---------- | ------------------------------------------ |
| 目录/文件  | `kebab-case`；composable 文件 `use-xxx.ts` |
| 代码       | `camelCase`；布尔 `is`/`has`/`can`         |
| 方法       | 动词开头：`fetchProfile`、`submitRollcall` |
| composable | 导出 `useXxx()`                            |

---

## 9. 注释

**必须：** 端差异、Mock、对外 composable/utils、非显而易见的接口契约、`api/modules` 文件头说明形态。
**禁止：** 密钥；无归属长期 `TODO`；注释保留废弃代码。

---

## 10. 质量与提交

### 10.1 本地校验（在目标项目根执行）

```bash
npm run lint
npm run lint:style    # 若已配置
npm run type-check
```

- 禁止提交：`console.log`/`debug`、`debugger`（ESLint 明确允许的除外）。
- 无 `test` 脚本时不强制单测；`utils/`、核心 composable 建议 Vitest。

### 10.2 Git 提交（Conventional Commits）

```text
<type>(<scope>): <subject>
```

类型：`feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert`

---

## 11. Critical 禁止清单

- `api/` + `services/` 混用
- 新页面未注册 `pages.json` / 分包
- 仅 H5 API 无小程序降级 → 白屏
- 密钥、生产 Token 入库
- `utils/` 含 `ref` 或页面上下文业务
- 新增 `.vue` **> 440 行** 或 **> 800 行** 不拆
- 多页复制相同接口调用不抽 composable
- Mock 未标注且作生产数据源
- 步骤函数拆碎、单处 constants 抽离（§7）
- 页面绕过 `api` 大量拼 URL
- 引入 **`uni-ui-lib` / `uni-lib`**、`app.use(UniLib)`，或以 Element Plus 作为移动 UI 底座

---

## 12. 评审输出格式

```markdown
## Summary

## Findings

### Critical — `path:line` — 问题 — 修复建议

### Suggestion

### Nice to have
```

**Critical 典型：** 分层错误、路由未注册、跨端白屏、混用 api/services、超行数、lint/类型失败、密钥入库。

---

## 13. Finish Checklist

- [ ] `pages.json` / `manifest.json` 与磁盘一致（§2.3）；分包已配置
- [ ] 仅 `api/` 或仅 `services/`；请求仅 `utils/request.ts`
- [ ] `api/modules` 形态与 `home.ts` 案例一致；无 `api/constants.ts`
- [ ] `types/modules` 与 api 域对齐；`types/env.d.ts` 无 `src/env.d.ts`
- [ ] `composables` = 多页业务；`utils` = 纯函数且 ≥2 消费者
- [ ] i18n 四国同步；`locales/constants` 仅框架级多消费者
- [ ] `uni.scss` 仅变量；公共 class 在 `styles/`；`static/` 分域
- [ ] 跨端分支有注释；Mock 已标注
- [ ] `.vue` 新增 ≤440 行；存量 >440 已登记治理
- [ ] `lint` + `type-check`；无调试 console/debugger
- [ ] §7 无步骤函数/单处常量抽离
- [ ] `package.json` 无 `uni-ui-lib`；`main.ts` 无 `UniLib` / 组件库样式全量引入
