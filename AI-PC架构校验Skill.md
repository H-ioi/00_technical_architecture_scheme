---
name: uni-review-web
description: Self-contained standards for admin-web—Vue 3, Vite, Element Plus, Pinia, uni-ui-lib, list/list.config, permissions, inline rules. Use for admin-web or @uni-review-web. Does not require 前端开发规范.md.
---

# uni-review-web — 管理后台

## 0. 适用范围与裁决顺序

| 项 | 说明 |
| --- | --- |
| **典型项目** | `admin-web`（标准模板） |
| **技术栈** | Vue 3 + Vite + Vue Router + Element Plus + Pinia + TypeScript + Sass + **`uni-ui-lib`**（npm；仓库 **uni-lib**，对外组件 **`Uni*`**） |
| **规范来源** | 评审与**新增/改动**以本 Skill 为**唯一**裁决依据；**不**依赖 `前端开发规范.md` |
| **存量治理** | 历史 `use-list.ts`、`api/constants.ts`、根目录 `components/*.vue` 等可渐进修复；**新代码必须合规** |
| **基线对照** | 以仓库 `admin-web` 为准；落地说明见 `前端管理后台(admin-web)构建方案.md`（参考，非裁决依据） |
| **与移动端差异** | **`customer-mobile` 不接入 `uni-ui-lib`**（见 **uni-review-mobile**）；后台**必须**经 `uni.ts` 注册组件库；**禁止**在后台改用 `uni-request` / 移动端 `utils/request` 形态替代 `uni-ui-lib` 的 `request` |

**行数规则关系：**

- 单函数有效逻辑 **> 33 行** → 必须拆分（§3.2）。
- 有效逻辑 **< 5 行且仅调用 1 次** → 禁止单独成函数（§9.1）。
- **5～33 行**且表达完整业务动作 → 可保留在一个函数内。

---

## 1. 技术栈与基础约束

| 项 | 要求 |
| --- | --- |
| 语言 | 业务代码 TypeScript；禁止新增纯 JS 业务模块 |
| 样式 | Sass；禁止以 Less/Stylus 为主方案 |
| 状态 | Pinia；页面临时 UI 优先 `ref`；布局/菜单/权限等壳层 store 来自 **`uni-ui-lib`**（§12） |
| UI 基础 | Element Plus（`main.ts` 全量注册） |
| 业务 UI | **`uni-ui-lib`**：`UniSearchForm`、`UniDataTable`、`UniForm`、`UniLayout` 等；配置驱动列表/表单**避免**裸 `el-form` 堆字段 |
| HTTP | **`uni-ui-lib` 的 `request`**，在 `src/uni.ts` 注入 `baseURL`、租户、版本头；`api/modules` **统一** `import { request } from 'uni-ui-lib'` |
| i18n | `src/locales/` + `types/i18n.ts`；`createUniLibI18n` / `useUniI18n`；用户可见文案走 `t()` |
| 环境 | `.env.*` 的 `VITE_*`；密钥不进仓库 |

**初始化（`src/uni.ts`）：** `app.use(UniLib, { config })` 注入 `request`、`auth`（如 `authApi.login`）；**不写死**业务菜单 path。`main.ts` 顺序建议：`pinia` → `router` → `ElementPlus` → `i18n` → **`initUniLib(app)`**。

**`UniSearchForm`：** `config` 必须为 **`UniFormConfig`**（含 **`schema: UniFormField[]`**）；禁止传入无 `schema` 的字段数组（运行时会 `reduce` 报错）。

---

## 2. 目录结构

禁止随意新增与下表无关的 `src/` 平级目录。

```text
admin-web/（节选）
├── .env.*、vite.config.ts
└── src/
    ├── main.ts、App.vue
    ├── uni.ts                 # uni-ui-lib 安装与 request/auth 注入
    ├── api/modules/、api/index.ts
    ├── assets/styles/、assets/images/
    ├── components/<name>/index.vue   # §2.2
    ├── composables/
    ├── layouts/
    ├── locales/、types/（含 types/modules/、types/i18n.ts）
    ├── router/modules/、routes.ts、index.ts、guards/
    ├── stores/index.ts        # 再导出 uni-ui-lib store + 项目 modules
    ├── stores/modules/        # 仅业务 store
    ├── utils/                 # 纯工具；**无**独立 request 客户端
    ├── views/<domain>/
    └── __tests__/
```

### 2.0 标准模板 `admin-web`（评审对照）

| 路径 | 说明 |
| --- | --- |
| `uni.ts` | `initUniLib`；`request.baseURL`、`auth.login/logout` |
| `api/modules/*.ts` | `const path` / `base` 在文件顶；`request` 来自 `uni-ui-lib` |
| `views/**/list.vue` + `list.config.ts` | 配置静态 / 请求编排在页内 |
| `stores/index.ts` | `useMenuStore`、`useUserStore` 等从 `uni-ui-lib` 导出 |
| `router/modules/` + `layout.ts` children | 按域注册；详情 `meta.hidden` + `activeMenu` |
| `components/list-table-empty/index.vue` | 目录 + `index.vue` 范例 |
| 禁止（新增） | `api/constants.ts`、复制 `uni-lib` 源码、业务组件 `Uni` 前缀、`views/**/use-list.ts` |

**层级：** `views` ≤3 级；页内 `components/` ≤2 层；`utils` ≤2 层。
**放置顺序：** 页面 `.vue` `<script setup>` → `composables/` / `utils/` → `components/` → **`uni-lib`（跨项目）**。

**禁止：** `utils/`、`api/` 中 `import` `.vue`；`views/` 下长期 `*-utils.ts`（纯函数 ≥2 消费者进 `utils/`）。

### 2.1 `composables/` 与 `utils/`

| 目录 | 职责 |
| --- | --- |
| **`composables/`** | ≥2 页业务：api、`ref`、路由、`t()`、权限、字典选项 |
| **`utils/`** | ≥2 处纯函数：无 `vue`、无 store/路由；或有稳定契约的归一化/下载 |

**判定：** 单页域 → 对应 `.vue` 的 `<script setup>`，**不**新建 `use-list.ts` / 页面 `use-*.ts`。≥2 页且需接口/状态 → `composables/`。纯计算且 **非**下表「不宜进 utils」→ `utils/`；否则**调用处内联**。

**不宜进 `utils/`（须内联，即使 2+ 处相同也优先复制）：** 仅类型/空值判断；单步 `trim`/`split`；有效逻辑 <5 行；仅 1 次调用的步骤函数；薄包装 `return x || '--'`。

**仍宜进 `utils/`：** 多形态字段归一化、Blob 下载、CSV、可文档化且 ≥5 行的纯计算。

**禁止：** `utils/` 用 `ref`/store；`composables/` 堆纯日期工具（下沉 `utils/` 再被 composable 调用）；单页逻辑提前进 `composables/`。

### 2.2 `components/`（必遵）

**路径：** `src/components/<component-name>/index.vue`

| 项 | 规则 |
| --- | --- |
| 目录名 | `kebab-case`，**至多 3 个英文词**（如 `list-table-empty`） |
| 入口 | 固定 `index.vue`；可选同目录子块、`index.ts` barrel |
| 禁止 | 根目录新增 `components/xxx.vue`（存量可保留，迁改须改目录结构） |
| 前缀 | 业务项目组件**不得**用 **`Uni*`** 作组件名；`uni-editor` 等**目录**名允许 `uni-` |
| 跨项目 | 2+ 项目复用 → **`uni-lib`**，不在 `components/` 长期堆 |

页内私有 → `views/.../components/`；2+ 页 → 提升到 `src/components/<name>/index.vue`。

---

## 3. 页面形态与体积

### 3.1 页面形态（勿强行统一文件组合）

| 形态 | 典型文件 |
| --- | --- |
| 标准 CRUD | `list.vue` + `list.config.ts` |
| Tab 列表 | `tab.vue` + `tab.config.ts` |
| 字典维护 | `list.vue` → `components/dict.vue` + `dict.config.ts` |
| 详情/编辑 | `detail.vue` / `edit.vue` + `*.config.ts`（`meta.hidden`、`activeMenu`） |

| 文件 | 职责 |
| --- | --- |
| `*.config.ts` | **仅静态 schema**：`UniSearchForm` / `UniDataTable` / `UniForm` 列、rules、toolbar/actions；**禁止** `onMounted`、调 API |
| `list.vue` 等 | 模板、`v-uni-permission`；`fetchList`、`handleSubmit`、弹窗状态；调 `api/modules`；**禁止**裸 `axios` 拼 URL |

### 3.2 体积

| 阈值 | 动作 |
| --- | --- |
| 任意 `.vue` **> 800 行** | **必须**拆分 |
| `.vue` **> 440 行** | **新增/改动**不得超限；存量须排期治理 |
| 单函数有效逻辑 **> 33 行** | 同页拆函数或多页 `composables/` |
| 同页 **2+** 重复模板块 | 抽子组件 |

---

## 4. 代码分层

```text
uni.ts（request/auth）→ api/modules → list.vue / composables / store → components / uni-ui-lib
```

| 层 | 允许 | 禁止 |
| --- | --- | --- |
| `uni-ui-lib` | 布局、表格/表单、request、权限 store、主题 | 业务 URL、业务页面写死在库内 |
| `api/modules` | `request.*`、类型、薄封装 | UI、`ElMessage`、路由 |
| `list.vue` 等 | 单页编排、调 api | 跨页逻辑；裸 axios |
| `*.config.ts` | 静态 schema | 请求、弹窗、`onMounted` |
| `composables/` | 多页业务 | 纯格式化 |
| `utils/` | 纯方法、下载、归一化 | `ref`、api、页面编排 |
| `stores/modules/` | 业务跨页状态 | DOM、视图细节 |

- **禁止**复制 `uni-lib` / `uni-ui-lib` 源码进 `admin-web` 修改。
- **禁止**为对齐移动端而在后台引入 `uni-request` 或自建与组件库并行的第二套 HTTP 客户端。

---

## 5. 路由与菜单

- 新路由：`router/modules/<domain>.ts` → 挂到 `layout` 的 `children` → `routes.ts` 聚合。
- 隐藏详情：`meta.hidden: true`、`meta.activeMenu`、`tagDetailParam`（标签页）。
- 菜单与权限：**后端菜单** + `router.getRoutes()`；禁止静态菜单表替代权限体系。
- 路由文件不写接口逻辑。

---

## 6. 权限

- 模板：`v-uni-permission="'permission_code'"`。
- 表格：`UniDataTable` actions / toolbar 的 `code`。
- 脚本：`hasUniPermission('permission_code')` / `useUniPermission()`（`uni-ui-lib`）。
- 权限码须与后端/菜单一致；禁止抄其他域遗留码（如活动页用 `busdriver_*`）。
- **禁止**为权限单独造按钮包装组件。

### 6.1 权限码内联（禁止抽离）

权限字符串**直接**写在 `v-uni-permission`、action `code`、`hasUniPermission(...)` 上。

**禁止：** `permission-codes.ts`、`PERMISSION.xxx`、模板 `:permission="X.add"`。
**存量** 常量文件可渐进删除；**新增与改动**须字面量。

---

## 7. 组件抽离

**仅当**降阅读成本或 **≥2 页**复用（第 3 次相同逻辑必须抽取）。

| 范围 | 位置 |
| --- | --- |
| 当前页 | `views/.../components/` |
| 2+ 页 | `components/<name>/index.vue` |
| 2+ 项目 | `uni-lib` |

**禁止：** 无复用进 `components/`；无跨项目进 `uni-lib`；根目录裸 `.vue`。

---

## 8. 内联原则（函数与常量）

### 8.1 禁止拆碎步骤函数

**适用一切函数：** `list.vue`、`composables`、`utils`、`api/modules`、store、组件方法等。

| 情形 | 处理 |
| --- | --- |
| 仅调用 1 次 | 写在唯一调用处 |
| 有效逻辑 < 5 行 | 不单独建函数 |
| 拆碎 submit（多个 <5 行 validate→build→post） | 合并进一个 `handleSubmit` |
| 完整动作且 ≥5 行，或 ≥2 处调用 | 可独立函数 |
| loading 栈等多处基建 | 可保留 |

**方法即动作：** `handleSubmit`、`fetchList`、`openEditDialog`。**禁止** `handleData`、`doAction`。

### 8.2 禁止无谓常量/配置抽离

**权限码**见 §6.1；**REST 前缀**见 §10。

先数真实消费者（文件数、同文件重复次数）。

| 情形 | 处理 |
| --- | --- |
| 取值仅 1 处 | 字面量 inline |
| 对象每 key 仅用 1 次 | 禁止 `APP_ROUTES` 等表 |
| 单文件 constants 仅 1 个消费者 | 写在消费文件内 |
| ≥2 文件或同文件同值 ≥2 次 | 可在 `api/modules` 顶 `const path` |
| 环境变量、Vite、设计 token | 平台级，允许 |

---

## 9. 命名

| 类别 | 规则 |
| --- | --- |
| 目录/文件 | `kebab-case`：`list.vue`、`list.config.ts` |
| `components/` 目录 | ≤3 个英文词；入口 `index.vue` |
| 代码 | `camelCase`；布尔 `is`/`has`/`can` |
| 禁止泛名 | `data`、`obj`、`info`、`temp`、`flag` |

---

## 10. 接口（`api/modules`）

- 按业务域单文件；类型在 `types/modules/` 或同模块旁。
- **REST 前缀**写在**该文件顶部** `const path` / `const base` 等；多资源域允许多个 `const`（如 `path` + `feedbackPath`）。
- **禁止** `api/constants.ts`、`API_PATHS` 集中表（存量渐进内联后删除）。
- 调用：`import { request } from 'uni-ui-lib'`；鉴权/401/默认错误由组件库 request 与 `uni.ts` 配置处理。
- 方法名语义化：`fetchXxx`、`createXxx`；避免 `getData`。

```ts
// ✅
const base = '/isacommunity/busorder'
export default {
  page: {
    name: '乘车订单分页',
    get: async (params: OrderListParams) =>
      await request.get<PageResult<OrderRow>>(`${base}/getOrderPage`, { params })
  }
}

// ❌
import { API_PATHS } from '@/api/constants'
```

---

## 11. 注释

**必须：** 复杂业务规则、权限/状态机、接口契约差异、兼容方案、对外 composable/utils。
**禁止：** 翻译式注释；注释保留废弃代码；注释含密钥。
**新增非 trivial 业务逻辑须有注释。**

---

## 12. 样式

- 组件 `<style scoped lang="scss">`；变量/mixin 在 `assets/styles/`。
- 主题 token / CSS 变量优先；通用 Element 覆盖优先沉淀 **`uni-ui-lib`**。
- 避免深层嵌套与多页复制大段样式。

---

## 13. 状态（Pinia）

- 页面临时 UI → 组件内。
- **壳层**（菜单、用户、权限码、tags-view、主题等）→ 使用 **`uni-ui-lib` 导出 store**（`stores/index.ts` 再导出），宿主须先 `app.use(pinia)`。
- **业务**跨页状态 → `stores/modules/`。
- Store：状态 + 动作；禁止大量 DOM/视图编排。

---

## 14. 质量、提交与测试

```bash
npm run lint
npm run lint:style
npm run type-check
npm run test:run    # admin-web 已配置 Vitest
```

- 禁止提交：`console.log`/`debug`、`debugger`（ESLint 允许的 `warn`/`error` 除外）。
- 提交格式：`<type>(<scope>): <subject>`（Conventional Commits）。
- `utils/`、核心 composable 优先单测（`src/__tests__/`）。
- 改动本 monorepo 的 `admin-web` 时，更新 `.ai-coding-md/迭代-YYYYMMDD.md`。

---

## 15. Critical 禁止清单

- 列表页裸 `axios`、绕过 `api/modules`
- **新增** `views/**/use-list.ts` 或页面专用 `use-*.ts`
- 权限未绑码；权限码/constants 抽离（§6.1）
- 新建/恢复 `api/constants.ts`（§10）
- 复制 `uni-lib` 源码；业务组件 `Uni` 前缀
- `components/` 根目录新增裸 `.vue`；目录名 >3 词
- 新增 `.vue` >440 行或 >800 行不拆
- `api/` 写 UI；`utils/` 写页面业务或步骤函数（§8）
- 在后台引入 `uni-request` / 移动端 request 形态替代 `uni-ui-lib`
- Mock 未标注且结构不符真实接口

---

## 16. 评审输出格式

```markdown
## Summary

## Findings
### Critical — `path:line` — 问题 — 修复建议
### Suggestion
### Nice to have
```

---

## 17. Finish Checklist

- [ ] `uni.ts` 已注册 `UniLib`；`api/modules` 使用 `uni-ui-lib` 的 `request`
- [ ] 列表：`*.config.ts` 仅静态；逻辑在 `list.vue`（无新建 `use-list.ts`）
- [ ] `UniSearchForm` 的 `config.schema` 完整
- [ ] 权限码内联；REST 前缀在 module 顶，无 `api/constants.ts`
- [ ] `components/<name>/index.vue`（≤3 词）；无业务 `Uni*` 组件名
- [ ] 新增 `.vue` ≤440 行；任意 `.vue` ≤800 行
- [ ] §8 无步骤函数/单处常量抽离；`utils` 符合 §2.1
- [ ] `lint` + `lint:style` + `type-check` + `test:run`（若改逻辑）
- [ ] 无调试 console/debugger
- [ ] 未混用移动端 HTTP/UI 方案
- [ ] monorepo 迭代日志已更新（若适用）
