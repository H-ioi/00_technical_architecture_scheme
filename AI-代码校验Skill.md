---
name: code-review-common
description: >-
  全前端项目通用代码校验规则（Vue / React / UniApp / H5 / 小程序 / SSR / Electron 等）。
  AI Coding Agent 的公共裁决依据；框架与平台差异见各专项 Skill。
---

# 代码校验 Skill — 全前端公共规则

## 0. 适用范围与裁决顺序

| 项 | 说明 |
| --- | --- |
| **用途** | 代码评审、提交前自查、AI 编码完成后的 Finish Check |
| **覆盖** | Vue 3、React、UniApp、H5、小程序、SSR（Next/Nuxt）、Electron 等**所有前端项目** |
| **裁决依据** | 本文档为**跨框架公共**规则；与平台/框架 Skill 冲突时，**专项 Skill 优先** |
| **平台专项** | 移动端 → `uni-review-mobile`；管理后台 → `uni-review-web`；其他栈按目标项目 `package.json` 与既有约定 |
| **存量治理** | 历史违规可渐进修复；**新增与改动必须合规** |
| **项目一致性** | 改已有项目时，目录、风格、技术选型以目标项目为准；**项目约定 > 通用最佳实践** |

**优先级（冲突时）：** 安全与数据 > 用户明确要求 > 编码铁律 > 极简 > Git/PR

**质量总原则：** 正确性 > 可维护性 > 可读性 > 极简

> **阈值裁决：** 下文数字（33 行、800 行等）**仅作预警，非唯一裁决依据**。优先保证可读性与维护性；**禁止**为满足某条数字规则而违反 §0.1 设计原则或机械拆分/抽取。

---

## 0.1 设计原则（总纲）

规则细节服从以下原则；冲突时以此为准：

| 原则 | 含义 |
| --- | --- |
| **简单 > 抽象** | 满足需求的最少结构；不为「以后可能」设计 |
| **组合 > 继承** | 优先组合式 API、props/slots/children；避免深层继承树 |
| **数据驱动 > 命令式** | 声明式 UI；状态驱动渲染，少手动改 DOM |
| **局部性 > 全局共享** | 状态、样式、逻辑默认就近；全局化须有真实跨处需求 |
| **一致性 > 创新** | 跟项目已有风格；不引入第二套范式 |
| **显式 > 隐式** | 数据流、副作用、端差异写清楚 |
| **读代码速度 > 写代码速度** | 维护者 6 个月后能读懂 |
| **修改成本 > 初次实现速度** | 少抽象层、少跳转文件 |

**体积与行数（原则导向）：**

| 信号 | 建议动作 |
| --- | --- |
| 单函数有效逻辑 **超过约 33 行** | **评估**是否存在可独立理解的业务动作；**若无**，允许保留（如完整提交流程） |
| 有效逻辑 **< 5 行** 且仅调用 **1 次** | **禁止**单独成函数 |
| **5～33 行**且表达完整业务动作 | 可保留在一个函数内 |
| 单文件组件 **> 800 行** | **必须**拆分 |
| 单文件组件 **约 400～500 行** | **建议**评估是否可拆；非硬性上限 |
| 同文件重复模板块 | 降阅读成本时可抽子组件 |

> 「有效逻辑」= 去空行、纯注释后的可执行语句行数。`.vue` / `.tsx` 均适用。

**核心禁令：** **禁止**仅为满足行数阈值而拆碎一次性步骤函数或拆成跳读碎文件。

---

## 1. 技术栈基础（公共）

| 项 | 要求 |
| --- | --- |
| 语言 | 业务代码 **TypeScript**；禁止新增纯 JS 业务模块 |
| 样式 | 以项目为准，常见 **Sass/scss** 或 **CSS Modules**；禁止无理由混用多套主方案 |
| 状态 | **局部状态优先组件内部**；跨组件/跨页才进 Store（Pinia / Redux / Zustand / Jotai 等以项目为准） |
| i18n | 用户可见文案走 `t()`；禁止多页硬编码（见 §17） |
| 环境 | `.env.*` 的 `VITE_*` / `NEXT_PUBLIC_*` 等；密钥不进仓库 |
| HTTP | **唯一请求入口** + **`api/modules`（或等价）**；禁止页面裸拼 URL、绕过接口层 |

### 1.1 依赖原则

**新增 npm 依赖须满足：**

1. 项目已有方案无法满足
2. 维护成本可接受（体积、安全、活跃度）
3. 收益明显（非「以防万一」）

**禁止：**

- 为 `deepClone`、`debounce` 等几行逻辑引入 `lodash` 全量或同类大包
- 仅为一个工具函数新增依赖
- 与项目已有依赖功能重叠的第二套库

**优先：** 标准库、平台 API、项目 `utils/`、已有 transitive 依赖。

---

## 2. 代码分层（公共）

```text
request → api/modules → hooks|composables（≥2 页）/ 页面 → pages|views → components
```

| 层 | 允许 | 禁止 |
| --- | --- | --- |
| `request` | Token、loading、code 校验、解包、401 | 业务 URL、toast |
| `api/modules` | 接口定义 + 调 HTTP；请求/响应类型（DTO） | UI、路由、toast、无复用 constants 汇总 |
| `pages` / `views` | 编排、调 `api`、权限、错误提示决策 | 大量直连 HTTP 拼 URL |
| `composables/` / `hooks/` | ≥2 页业务编排 | 单页薄包装；纯格式化堆入 |
| `utils/`（除 request） | ≥2 处纯函数 | 框架状态、store、路由、页面业务 |
| `stores/` | 跨页/跨组件持久或会话状态 | UI 开关、临时表单、Dialog 状态、整页 DOM 编排 |
| `data/`（Mock） | 种子/样例；文件头标注 Mock | 接 api 后仍作唯一生产数据源 |

**禁止：** `utils/`、`api/` 中 `import` 组件文件；`pages/` / `views/` 下长期 `*-utils.ts`。

---

## 3. 目录与放置（公共）

### 3.1 `composables/` / `hooks/` 与 `utils/`

| 目录 | 职责 | 命名 |
| --- | --- | --- |
| **`composables/`**（Vue） / **`hooks/`**（React） | ≥2 页业务：可调 `api`、store、路由 | `use-xxx.ts` → `useXxx()` |
| **`utils/`** | ≥2 处纯函数：不依赖框架响应式、不绑 store/路由 | `format-date.ts` 等 |

**判定：** 仅 1 页/组件 → 页内或就近 `use-*.ts`；≥2 页且纯计算 → `utils/`；否则 → composable/hook。

**不宜进 `utils/`：** 类型/空值判断；单步 `trim`/`split`；<5 行；仅 1 次调用的步骤函数；`return x || '--'` 薄包装。

**禁止：** 单消费者文件；`draft.ts` 无 `useXxx()` 导出；`useFetchList` 仅包三行代码（见 §27）。

### 3.2 类型文件位置

见 §10；契约放 `src/types/modules/<domain>.ts`，与 `api` 域对齐。

### 3.3 组件文件放置

**仅当**降阅读成本或 **达到稳定复用**时抽取（≥2 处且预期持续使用；非「第 N 次出现」机械计数）。

| 范围 | 位置 |
| --- | --- |
| 当前页/路由 | `pages/.../components/` 或 `views/.../components/` |
| 2+ 页（本项目） | `components/<name>/`（入口 `index.vue` 或 `index.tsx` 以项目为准） |
| 2+ 项目 | monorepo 共享包 |

**禁止：** 为美观拆微组件；无稳定复用进 `components/`；组件 `import` 页面/路由文件。

---

## 4. 组件设计原则（公共）

| 项 | 规则 |
| --- | --- |
| 数据流 | **props 单向向下**；子组件通过 **event / callback / emit** 通知父级 |
| 职责 | 展示 + 局部交互；业务编排留在页面或 composable/hook |
| 受控 | 表单/列表等优先受控模式；非受控须注释原因 |

**禁止：**

- 子组件**直接修改 props**（含突变对象字段）
- 组件依赖**父组件内部非 props 状态**（隐式耦合）
- 组件 **`import` 页面/路由** 文件
- 组件内 **`document.querySelector` / 直接操作全局 DOM**（除 ref 挂载点等明确场景）
- 无真实复用的 `BaseTable`、`BaseDialog`、`BaseForm`（见 §27）

---

## 5. 状态管理（公共）

| 层级 | 适用 |
| --- | --- |
| **组件内** `useState` / `ref` | 默认：表单输入中、展开折叠、hover、单页临时 UI |
| **composable / custom hook** | ≥2 组件共享且含业务编排 |
| **Store**（Pinia / Redux / Zustand / Jotai 等） | 用户会话、权限、跨页草稿、需持久化的全局配置 |

**禁止放入 Store：**

- 所有列表数据「以防万一」
- Dialog / Modal 开关、Tab 索引等**纯 UI 状态**（除非跨路由持久）
- 未提交的**临时表单**（除非明确跨页草稿需求）
- 可由 props 或 URL 派生的状态

**原则：** 能局部就不提升；能 derived 就不同步两份 state（见 §5.1）。

### 5.1 数据流（Data Flow）

**状态来源优先级（从高到低）：**

```text
props / 父级传入
    ↓
route（URL 参数、query）
    ↓
store（跨页/会话）
    ↓
api（服务端数据）
    ↓
derived（computed / useMemo / 纯函数派生）
```

| 规则 | 说明 |
| --- | --- |
| **单一数据源** | 同一业务事实只维护一份权威状态 |
| **优先 derived** | 可计算的不存 state；如 `selectedCount` 由 `selectedIds` 派生 |
| **禁止同步链** | 不用 watch/effect 把 A 同步到 B（两份重复状态） |

**禁止（AI 高频）：**

```ts
// Vue — 禁止
watch(source, () => { target.value = f(source) })  // target 应 computed

// React — 禁止
useEffect(() => { setDerived(f(props)) }, [props])  // derived 应 useMemo 或渲染时计算
```

**禁止重复维护：**

```ts
// ❌ selectedCount 应 derived
const selectedIds = ref<string[]>([])
const selectedCount = ref(0)  // 与 selectedIds 重复

// ❌ 副作用突变派生来源
watch(list, () => { list.value.sort() })  // 应 [...list].sort() 或 computed
```

**禁止：** 副作用中**原地修改** computed/派生所依赖的响应式数据（如 `list.sort()` on reactive source）。

---

## 6. 体积与拆分

- 函数超过约 **33 行有效逻辑**时，**评估**是否含可独立业务动作；**单一完整流程**（如 `handleSubmit`）可保留
- **禁止**仅为满足行数拆一次性步骤函数
- 完整业务动作或多处稳定复用 → 允许独立函数；命名 **动词 + 业务**

组件 **> 800 行**必须拆分；**约 400～500 行**建议评估 UI/业务区块与子组件，非硬性卡线。**禁止**为凑行数拆成跳读碎文件。

---

## 7. 内联原则（函数与常量）

### 7.1 禁止拆碎步骤函数

**适用一切函数**（含 hook、composable、api、store）。

| 情形 | 处理 |
| --- | --- |
| 仅调用 1 次 | 写在唯一调用处 |
| 有效逻辑 < 5 行 | 不单独建函数 |
| 拆碎 validate→build→post | 合并进 `handleSubmit` 等 |
| 完整动作 ≥5 行，或 ≥2 处稳定复用 | 可抽取 |

**禁止：** `handleData`、`doAction`、`processItem`。

### 7.2 禁止无谓常量/配置抽离

先数**真实消费者**（文件数、同文件重复次数）。

| 情形 | 处理 |
| --- | --- |
| 取值仅 1 处 | 字面量 inline |
| 仅 1 个文件 import 的 `constants/*.ts` | 禁止 |
| 同文件 ≥2 次，或 ≥2 文件引用 | 可在消费域文件顶 `const` |
| 环境变量、路由表、框架级 locales | 平台配置，允许集中 |

**禁止：** 无复用的 `api/constants.ts`、为 Lint 机械抽参。

---

## 8. 命名

| 类别 | 规则 |
| --- | --- |
| 目录/文件 | `kebab-case`；hook/composable `use-xxx.ts` |
| 代码 | `camelCase`；布尔 `is`/`has`/`can` |
| 组件 | `PascalCase`（React/Vue 均以项目为准，保持一致） |
| 方法 | 动词开头：`fetchProfile`、`handleSubmit` |
| 禁止泛名 | `data`、`obj`、`info`、`temp`、`flag` |
| 禁止短名 | `v`、`n`、`p`、`s`、`d`、`e`、`res2` 等（`i`/`j` 循环下标除外） |

---

## 9. 修改已有代码

- API、类型、对外行为默认不变
- 风格、目录、异常处理、日志与项目一致
- 不引入第二套范式；精准修改；删无用 import / 死代码

---

## 10. TypeScript 类型规范

### 10.1 基本规则

| 项 | 规则 |
| --- | --- |
| `any` | **禁止**（含隐式）；存量渐进消除 |
| 未知外部数据 | 优先 `unknown` + 类型收窄 |
| 对象形状 | 优先 `interface`（可扩展契约） |
| 联合 / 交叉 / 工具类型 | 用 `type` |
| `as any` | **禁止** |
| 类型断言 | 确需 `as T` 须注释原因 |
| 双重断言 `as unknown as T` | **避免**；浏览器 API、DOM、Canvas、Monaco 等确需使用时**必须注释原因** |

### 10.2 放置与组织

- 可复用契约：`src/types/modules/<domain>.ts`，与 `api/modules` 同域
- 仅当前文件私有且不导出 → 留在当前文件
- **禁止**在 `pages/`、`components/`、`hooks/` 下长期维护共享 `*-types.ts`
- 全局声明：`types/env.d.ts` 等；**禁止** `src/` 根重复 `env.d.ts`

---

## 11. API 与 DTO

```text
types/modules/<domain>.ts  ←→  api/modules/<domain>.ts
```

| 项 | 规则 |
| --- | --- |
| 请求参数 | 独立类型，如 `CreateOrderParams` |
| 响应体 | 独立类型，如 `OrderDetailVO` |
| 分页 | 复用项目已有 `PageResult<T>` 等，不另造轮子 |
| 返回值 | `api` 返回具名类型；**禁止** `Promise<any>`、响应 `any` |
| 职责 | `api` 只负责请求与类型；**禁止** toast、路由、DOM |

---

## 12. 异步规范

| 项 | 规则 |
| --- | --- |
| 风格 | 统一 **`async/await`**；**禁止** `then().then().then()` 链（简单单次 `then` 可接受） |
| 并发 | 互不依赖的**只读请求**用 **`Promise.all`** / `Promise.allSettled` |
| 副作用 | 涉及**写操作**（创建、更新、删除）时，**评估**是否允许并发；禁止无脑 `Promise.all` |
| 串行 | **禁止**无依赖的 `await A; await B; await C` |
| 错误 | 能向上抛就不吞；`try/catch` 须有明确处理，禁止空 catch |
| 取消 | 组件卸载时取消订阅/请求（`AbortController`、effect cleanup） |

```ts
// ❌ 无依赖只读却串行
const user = await fetchUser()
const orders = await fetchOrders()

// ✅ 只读并发
const [user, orders] = await Promise.all([fetchUser(), fetchOrders()])

// ⚠️ 写操作须评估：删除 + 更新可能不能并发
```

---

## 13. Vue 专项

**组合式 API + `<script setup>`**；区块顺序：

1. `import`（顺序见 §22）
2. 本页私有类型
3. 常量
4. `defineOptions` → `defineProps` → `defineEmits`
5. composable / store / i18n
6. `ref` / `reactive`
7. `computed`（**优先 computed，其次 watch**）
8. 方法：格式化 → 业务方法（按用户流程）
9. `watch` / 生命周期 / `onShow` 等

- **能 derived 就 derived**：禁止 `watch` 同步可由 `computed` 派生的状态（§5.1）
- 模板声明式；复杂逻辑放 `computed` 或方法
- 禁止生命周期、watch、业务方法穿插（依赖顺序例外须注释）

---

## 14. React 专项

| 项 | 规则 |
| --- | --- |
| 组件 | **Function Component**；**禁止**新增 class 组件（存量除外） |
| 文件 | 单组件单文件为主；**> 800 行**必须拆分 |

**Hook 顺序（同一组件内保持一致）：**

1. `import`
2. 本文件私有类型
3. 常量
4. 自定义 hook 调用
5. `useState` / `useReducer`
6. `useRef`
7. `useContext`（如有）
8. `useMemo`（派生数据）
9. `useCallback`（传给 memo 子组件或稳定依赖时）
10. `useEffect` / `useLayoutEffect`
11. 事件处理与业务函数
12. 条件返回前的 JSX

**Hook 规则：**

- **禁止**在循环、条件、嵌套函数中调用 hook
- **禁止**一个 `useEffect` 承担多个无关业务；按职责拆分
- **能计算的不 `useEffect`**：派生值用 `useMemo` 或直接计算（§5.1）
- `useMemo` / `useCallback`：**有度量或明确依赖稳定需求再用**；禁止无差别包裹（§16）

**Custom Hook：**

- 仅当 **≥2 组件**稳定复用，或单组件内 **完整业务编排 ≥5 行**
- **禁止** `useFetchList` 仅包 `setLoading` + `http.get` 三行
- 命名 `useXxx`；文件 `use-xxx.ts`

---

## 15. CSS 规范（公共）

| 项 | 规则 |
| --- | --- |
| 布局 | 优先 **flex**；复杂二维用 **grid** |
| 禁止 | `float` 布局；滥用 `!important`；**>3 层**深层选择器 |
| Design Token | 统一 **spacing / font / radius / color** token（CSS 变量、`uni.scss`、主题配置等） |
| 禁止魔法数 | 散落色值（`#1890ff`）、间距（`margin: 13px`、`padding: 17px`、`19px` 等） |
| 作用域 | 组件样式 scoped / CSS Modules；全局样式进 `styles/` 或 `assets/styles/` |
| 响应式 | 以项目断点为准；移动端注意 `rpx`、安全区 |

---

## 16. 性能原则（公共）

**默认优先正确性**；以下在真实场景或明确热点时应用：

| 场景 | 规则 |
| --- | --- |
| 列表 | 稳定 **`key`**（禁止随机数作 key；index 仅静态列表） |
| 图片 | 懒加载；合适尺寸与格式 |
| 高频事件 | 滚动、resize、输入搜索 → **节流/防抖** |
| 长列表 | 虚拟滚动（项目已有方案优先） |
| 请求 | 只读且无依赖 → `Promise.all`（§12）；写操作评估并发 |
| Memo | **禁止**无度量堆砌 `useMemo`/`useCallback`/`React.memo`/`shallowRef` |
| Cache | **禁止**提前 `Map`/`WeakMap`/全局对象 cache「以防万一」 |
| 同步成本 | **禁止**为性能优化引入更高状态同步成本（cache + 手动失效、双份状态维护） |

---

## 17. 国际化（i18n）

| 项 | 规则 |
| --- | --- |
| 入口 | 用户可见文案走 `t()` / `useTranslation` 等 |
| 新增 key | 按项目要求同步各语言包 |
| 占位符 | **优先** `t('welcome', { name })` |
| **禁止** | 字符串拼接：`t('hello') + name` |
| **禁止** | 多页硬编码中文/英文；`tabBar` 等与 locales 脱节 |
| 框架级 | `locales/constants.ts` 语言枚举等多消费者配置允许集中 |

---

## 18. 无障碍（Accessibility）

| 项 | 规则 |
| --- | --- |
| 交互 | 可点击用 **`<button>`** / `<a>`；**禁止** `<div onClick>` 冒充按钮（无 role 补救时） |
| 图片 | **`<img alt="...">`**；装饰图 `alt=""` |
| 表单 | **`<label>`** 关联控件；错误信息可被读屏感知 |
| 焦点 | 模态打开时焦点管理；勿 `outline: none` 无替代 |
| 语义 | 标题层级连续；列表用 `ul/ol` |

---

## 19. 安全（公共）

| 项 | 规则 |
| --- | --- |
| XSS | **禁止** `v-html`、`dangerouslySetInnerHTML`、`innerHTML` 渲染不可信内容 |
| 执行 | **禁止** `eval`、`new Function`、动态 `import()` 不可信字符串 |
| 密钥 | Token、API Key **禁止**入库；用环境变量 |
| 链接 | 外链 `rel="noopener noreferrer"`；`target="_blank"` 时尤须 |
| 输入 | 富文本须消毒（项目已有方案）；URL 参数不信任 |

---

## 20. 错误处理（公共）

| 层 | 职责 |
| --- | --- |
| `request` | HTTP 状态、业务 code、401 跳转、统一错误对象 |
| `api` | 抛出或返回错误；**禁止** toast / `ElMessage` / `uni.showToast` |
| 页面 / 组件 | **决定**是否提示、提示文案、重试、空态 |

**禁止：** 所有 `catch` 都弹 toast；`api.ts` 内写 UI 反馈。

---

## 21. 日志（公共）

| 项 | 规则 |
| --- | --- |
| 开发 | 临时调试后删除 |
| **禁止提交** | `console.log`、`console.debug`、`console.table`、`console.time`、`debugger` |
| 允许 | ESLint 配置的 `console.warn` / `console.error`；统一 `logger`（若项目已封装） |
| 生产 | 不上线裸 `console`；敏感信息不打日志 |

---

## 22. Import 顺序（公共）

同一文件内保持一致（以项目 ESLint 为准，无配置时按下述）：

```text
1. 第三方库（react、vue、lodash…）
2. 项目 alias — types（import type）
3. 项目 alias — constants / config（若有）
4. 项目 alias — utils
5. 项目 alias — api
6. 项目 alias — stores
7. 项目 alias — composables / hooks
8. 项目 alias — components
9. 样式（.scss / .css）
```

组间空一行；组内按字母或项目约定。

---

## 23. 极简与风格

- **No Dead Code**；删优于增；最短 diff
- **Platform First**：项目方案 > 平台能力 > 新依赖（§1.1）
- 满足需求后**停止**；禁止 `TODO` 代替交付
- 平铺 `if/else`；可读性 > 错误抽象

---

## 24. 注释

**必须：** 端差异、Mock、对外 hook/composable/utils、非显而易见业务规则、接口契约差异、`as` / 双重断言原因。

**禁止：** 密钥；无归属 `TODO`；注释保留废弃代码。

---

## 25. 质量门禁与 Git

### 25.1 本地校验（目标项目根）

```bash
npm run lint
npm run lint:style    # 若已配置
npm run type-check
npm run test:run      # 若已配置
```

### 25.2 Git

| 项 | 规则 |
| --- | --- |
| 提交格式 | `type(scope): subject`（Conventional Commits） |
| 原子性 | **一个 commit 一件事** |
| **禁止** | 顺手重构、顺手全量格式化、顺手升级依赖（分 commit） |
| 迭代日志 | monorepo 有改动时更新 `.ai-coding-md/迭代-YYYYMMDD.md` |

---

## 26. AI 常见错误（Critical）

AI 编码时**最高频**违规；优先自查：

### 26.1 过度抽象

**禁止（无稳定复用前）：**

- 提前抽 hook/composable/utils/constants
- `BaseTable`、`BaseDialog`、`BaseForm`、`AbstractXxx`、`FactoryXxx`
- 策略模式、工厂模式、扩展点、「以后可能支持」
- 为减少行数**机械拆函数**；为 DRY **复制粘贴改个名**

### 26.2 错误分层与数据流

- `api` 里写 toast / 路由
- `utils` 里用 `ref` / `useState` / store
- 组件 `import` 页面
- 所有状态塞进 Store
- `watch` / `useEffect` 同步可 derived 的状态（§5.1）
- 重复维护 `selectedIds` + `selectedCount` 等双份状态

### 26.3 类型偷懒

- `as any`、`Promise<any>`、参数不写类型
- 接口返回未定义 DTO

### 26.4 异步与性能误用

- 无依赖只读请求却串行 `await`
- 写操作无脑 `Promise.all`
- 全量 `useMemo` / `memo` / 全局 cache 包裹

### 26.5 安全与 i18n

- `v-html` / `dangerouslySetInnerHTML` 渲染后端字段
- `t('a') + variable` 拼接

---

## 27. Critical 禁止清单（公共）

- 绕过 `api/modules` 裸拼 URL / 第二套 HTTP 客户端
- `utils` 含框架状态或页面业务
- 单文件组件 **> 800 行** 不拆
- 仅为凑行数拆碎函数；**< 5 行** 单调用却拆函数
- **重复维护同一份业务状态**；可 derived 却用 watch/effect 同步
- **副作用原地修改** computed/派生所依赖的响应式数据（如 `list.sort()`）
- 步骤函数碎拆、单处 constants 抽离
- `any` / `as any`；`Promise<any>`
- `api` 写 UI；Store 存 Dialog/临时表单/UI 态
- Mock 未标注作生产数据；密钥入库
- XSS 向量：`eval`、`innerHTML`、`v-html` 不可信内容
- 仅为遵守规则而降低可读性

> 平台专项（`uni-ui-lib`、权限码内联、`pages.json` 等）见 `uni-review-mobile` / `uni-review-web`。

---

## 28. 评审输出格式

```markdown
## Summary

## Findings
### Critical — `path:line` — 问题 — 修复建议
### Suggestion
### Nice to have
```

---

## 29. Finish Checklist

- [ ] 设计原则 §0.1：无过度抽象、无提前 Base/Factory
- [ ] **数据流 §5.1：无重复状态；无可 derived 却同步的 state**
- [ ] 分层：`request` → `api` → 页面/hook → 组件
- [ ] 状态：局部优先；Store 无 UI/临时表单
- [ ] 组件：props 向下、event 向上；不修改 props
- [ ] `types/modules` + DTO 完整；无 `any` / `as any`
- [ ] 异步：`async/await`；只读无依赖用 `Promise.all`；写操作评估并发
- [ ] Vue：computed 优先；script 顺序合规
- [ ] React：hook 规则合规；无条件/循环 hook
- [ ] CSS：Design Token；无魔法间距/色值
- [ ] i18n 占位符；a11y 基础项；无 XSS 向量
- [ ] 错误：api 无 toast；页面决定提示
- [ ] import 顺序一致；无调试 console/debugger
- [ ] 单文件 **≤ 800 行**；无机械凑行数拆分
- [ ] `lint` + `type-check`（+ `test:run` 若改逻辑）
- [ ] Git 原子提交；平台专项 Skill 已对照（若适用）
- [ ] 迭代日志已更新（monorepo 有改动时）
