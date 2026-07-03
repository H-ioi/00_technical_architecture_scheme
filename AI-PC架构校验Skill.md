---
name: uni-review-web
description: admin-web 项目架构与约定—Vue 3、Vite、Element Plus、Pinia、uni-ui-lib、list.config、权限、目录结构。编码写法见 AI-全局编码规则；违规判定见 AI-代码校验Skill。Use for admin-web or @uni-review-web.
---

# uni-review-web — admin-web 项目架构

> **职责：** 描述 **admin-web 应该长什么样** — 目录、分层、组件库、页面形态、权限、Store、API 形态。  
> **不职责：** 函数拆分、命名、注释、行数阈值 → 见 `AI-全局编码规则.md`；Critical/Warning/评审输出 → 见 `AI-代码校验Skill.md`。

---

## 0. 适用范围

| 项 | 说明 |
| --- | --- |
| **典型项目** | `admin-web`（标准模板） |
| **技术栈** | Vue 3 + Vite + Vue Router + Element Plus + Pinia + TypeScript + Sass + **`uni-ui-lib`**（npm；仓库 **uni-lib**，对外组件 **`Uni*`**） |
| **规范来源** | 项目架构以本 Skill 为准；**不**依赖 `前端开发规范.md` |
| **存量治理** | 历史 `use-list.ts`、`api/constants.ts`、根目录 `components/*.vue` 等可渐进修复；**新代码按本 Skill 约定** |
| **基线对照** | 以仓库 `admin-web` 为准；落地说明见 `前端管理后台(admin-web)构建方案.md`（参考，非裁决依据） |
| **与移动端差异** | **`customer-mobile` 不接入 `uni-ui-lib`**（见 **uni-review-mobile**）；后台经 `uni.ts` 注册组件库；**不采用** `uni-request` / 移动端 `utils/request` 形态替代 `uni-ui-lib` 的 `request` |
| **编码原则** | 函数拆分、内联、数据流、命名、注释、体积阈值等遵循 **`AI-全局编码规则.md`** |

---

## 1. 技术栈与基础约束

| 项 | 要求 |
| --- | --- |
| 语言 | 业务代码 TypeScript |
| 样式 | Sass |
| 状态 | Pinia；页面临时 UI 优先 `ref`；布局/菜单/权限等壳层 store 来自 **`uni-ui-lib`**（§10） |
| UI 基础 | Element Plus（`main.ts` 全量注册） |
| 业务 UI | **`uni-ui-lib`**：`UniSearchForm`、`UniDataTable`、`UniForm`、`UniLayout` 等；配置驱动列表/表单，**不采用**裸 `el-form` 堆字段 |
| HTTP | **`uni-ui-lib` 的 `request`**，在 `src/uni.ts` 注入 `baseURL`、租户、版本头；`api/modules` **统一** `import { request } from 'uni-ui-lib'` |
| i18n | `src/locales/` + `types/i18n.ts`；`createUniLibI18n` / `useUniI18n`；用户可见文案走 `t()` |
| 环境 | `.env.*` 的 `VITE_*`；密钥不进仓库 |

**初始化（`src/uni.ts`）：** `app.use(UniLib, { config })` 注入 `request`、`auth`（如 `authApi.login`）；**不写死**业务菜单 path。`main.ts` 顺序建议：`pinia` → `router` → `ElementPlus` → `i18n` → **`initUniLib(app)`**。

**`UniSearchForm`：** `config` 须为 **`UniFormConfig`**（含 **`schema: UniFormField[]`**）；不传入无 `schema` 的字段数组（运行时会 `reduce` 报错）。

---

## 2. 目录结构

推荐目录如下；不随意新增与下表无关的 `src/` 平级目录。

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

### 2.0 标准模板 `admin-web`（对照）

| 路径 | 说明 |
| --- | --- |
| `uni.ts` | `initUniLib`；`request.baseURL`、`auth.login/logout` |
| `api/modules/*.ts` | `const path` / `base` 在文件顶；`request` 来自 `uni-ui-lib` |
| `views/**/list.vue` + `list.config.ts` | 配置静态 / 请求编排在页内 |
| `stores/index.ts` | `useMenuStore`、`useUserStore` 等从 `uni-ui-lib` 导出 |
| `router/modules/` + `layout.ts` children | 按域注册；详情 `meta.hidden` + `activeMenu` |
| `components/list-table-empty/index.vue` | 目录 + `index.vue` 范例 |

**项目约定（新增）：** 不采用 `api/constants.ts`、不复制 `uni-lib` 源码、业务组件不用 `Uni` 前缀、`views/**/use-list.ts`。

**层级：** `views` ≤3 级；页内 `components/` ≤2 层；`utils` ≤2 层。  
**放置顺序：** 页面 `.vue` `<script setup>` → `composables/` / `utils/` → `components/` → **`uni-lib`（跨项目）**。

**项目约定：** `utils/`、`api/` 不 `import` `.vue`；`views/` 下不长期保留 `*-utils.ts`（纯函数 ≥2 消费者进 `utils/`）。

### 2.1 `composables/` 与 `utils/`

| 目录 | 职责 |
| --- | --- |
| **`composables/`** | ≥2 页业务：api、`ref`、路由、`t()`、权限、字典选项 |
| **`utils/`** | ≥2 处纯函数：无 `vue`、无 store/路由；或有稳定契约的归一化/下载 |

**判定：** 单页域 → 对应 `.vue` 的 `<script setup>`，**不采用** `use-list.ts` / 页面 `use-*.ts`。≥2 页且需接口/状态 → `composables/`。纯计算 → `utils/` 或调用处内联（遵循 Guide §3.2）。

**项目约定：** `utils/` 不用 `ref`/store；`composables/` 不堆纯日期工具（下沉 `utils/` 再被 composable 调用）；单页逻辑不提前进 `composables/`。

### 2.2 `components/`（项目约定）

**路径：** `src/components/<component-name>/index.vue`

| 项 | 约定 |
| --- | --- |
| 目录名 | `kebab-case`，**至多 3 个英文词**（如 `list-table-empty`） |
| 入口 | 固定 `index.vue`；可选同目录子块、`index.ts` barrel |
| 新增公共组件 | 统一 `components/<name>/index.vue`；历史根目录裸 `.vue` 允许渐进治理 |
| 前缀 | 业务项目组件**不用** **`Uni*`** 作组件名；`uni-editor` 等**目录**名允许 `uni-` |
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
| `*.config.ts` | **仅静态 schema**：`UniSearchForm` / `UniDataTable` / `UniForm` 列、rules、toolbar/actions；**不含** `onMounted`、调 API |
| `list.vue` 等 | 模板、`v-uni-permission`；`fetchList`、`handleSubmit`、弹窗状态；调 `api/modules`；**不采用**裸 `axios` 拼 URL |

### 3.2 体积

单文件行数、函数拆分阈值遵循 **`AI-全局编码规则.md` §3.1**（33 / 450 / 800）。  
同页 **2+** 重复模板块 → 抽子组件。

---

## 4. 代码分层

```text
uni.ts（request/auth）→ api/modules → list.vue / composables / store → components / uni-ui-lib
```

| 层 | 职责 | 不放在此层 |
| --- | --- | --- |
| `uni-ui-lib` | 布局、表格/表单、request、权限 store、主题 | 业务 URL、业务页面写死在库内 |
| `api/modules` | `request.*`、类型、薄封装 | UI、`ElMessage`、路由 |
| `list.vue` 等 | 单页编排、调 api | 跨页逻辑；裸 axios |
| `*.config.ts` | 静态 schema | 请求、弹窗、`onMounted` |
| `composables/` | 多页业务 | 纯格式化 |
| `utils/` | 纯方法、下载、归一化 | `ref`、api、页面编排 |
| `stores/modules/` | 业务跨页状态 | DOM、视图细节 |

**项目约定：** 不复制 `uni-lib` / `uni-ui-lib` 源码进 `admin-web` 修改；不为对齐移动端而在后台引入 `uni-request` 或自建与组件库并行的第二套 HTTP 客户端。

---

## 5. 路由与菜单

- 新路由：`router/modules/<domain>.ts` → 挂到 `layout` 的 `children` → `routes.ts` 聚合。
- 隐藏详情：`meta.hidden: true`、`meta.activeMenu`、`tagDetailParam`（标签页）。
- 菜单与权限：**后端菜单** + `router.getRoutes()`；不采用静态菜单表替代权限体系。
- 路由文件不写接口逻辑。

---

## 6. 权限

- 模板：`v-uni-permission="'permission_code'"`。
- 表格：`UniDataTable` actions / toolbar 的 `code`。
- 脚本：`hasUniPermission('permission_code')` / `useUniPermission()`（`uni-ui-lib`）。
- 权限码须与后端/菜单一致；不抄其他域遗留码（如活动页用 `busdriver_*`）。
- **不采用**为权限单独造按钮包装组件。

### 6.1 权限码内联（项目约定）

权限字符串**直接**写在 `v-uni-permission`、action `code`、`hasUniPermission(...)` 上。

**不采用：** `permission-codes.ts`、`PERMISSION.xxx`、模板 `:permission="X.add"`。  
**存量** 常量文件可渐进删除；**新增与改动** 用字面量。

---

## 7. 组件抽离

**仅当**降阅读成本或 **≥2 页**复用（第 3 次相同逻辑再抽取）。

| 范围 | 位置 |
| --- | --- |
| 当前页 | `views/.../components/` |
| 2+ 页 | `components/<name>/index.vue` |
| 2+ 项目 | `uni-lib` |

**项目约定：** 无复用不进 `components/`；无跨项目不进 `uni-lib`；新增公共组件用目录 + `index.vue`。

---

## 8. 接口（`api/modules`）

- 按业务域单文件；类型在 `types/modules/` 或同模块旁。
- **REST 前缀**写在**该文件顶部** `const path` / `const base` 等；多资源域允许多个 `const`（如 `path` + `feedbackPath`）。
- **不采用** `api/constants.ts`、`API_PATHS` 集中表（存量渐进内联后删除）。
- 调用：`import { request } from 'uni-ui-lib'`；鉴权/401/默认错误由组件库 request 与 `uni.ts` 配置处理。
- 方法名语义化：`fetchXxx`、`createXxx`。

```ts
// 推荐
const base = '/isacommunity/busorder'
export default {
  page: {
    name: '乘车订单分页',
    get: async (params: OrderListParams) =>
      await request.get<PageResult<OrderRow>>(`${base}/getOrderPage`, { params })
  }
}

// 不采用
import { API_PATHS } from '@/api/constants'
```

---

## 9. 样式

- 组件 `<style scoped lang="scss">`；变量/mixin 在 `assets/styles/`。
- 主题 token / CSS 变量优先；通用 Element 覆盖优先沉淀 **`uni-ui-lib`**。
- 避免深层嵌套与多页复制大段样式。

---

## 10. 状态（Pinia）

- 页面临时 UI → 组件内。
- **壳层**（菜单、用户、权限码、tags-view、主题等）→ 使用 **`uni-ui-lib` 导出 store**（`stores/index.ts` 再导出），宿主须先 `app.use(pinia)`。
- **业务**跨页状态 → `stores/modules/`。
- Store：状态 + 动作；不含大量 DOM/视图编排。

---

## 11. Mock 与迭代日志

- Mock 须在文件头标注，结构对齐真实接口。
- 改动本 monorepo 的 `admin-web` 时，更新 `.ai-coding-md/迭代-YYYYMMDD.md`。
