---

## description: AI 编码代理全局规则 — 怎么思考、怎么写代码（Guide）。校验与评审见 AI-代码校验Skill / ~/.cursor/skills/code-review。
alwaysApply: true

# AI 全局编码规则（Guide）

> **Cursor 入口：** `.cursor/rules/global.mdc`（`alwaysApply`）
> **职责：** 告诉 AI **写代码时怎么思考、怎么写**。
> **不职责：** 评审输出、Checklist、Critical 判定 → 见 `AI-代码校验Skill.md` 或 `~/.cursor/skills/code-review/SKILL.md`。

---

## 0. 优先级（冲突时）

1. **安全与数据**：信任边界、防丢失、安全、无障碍——不可为极简省略
2. **用户明确要求**：点名功能/文档/测试/完整实现 → 照做
3. **编码铁律**：可读性底线、内联禁止项
4. **极简**：最短路径、最少代码
5. **Git/PR**：仅用户明确要求时执行
6. **沟通**：代码引用 `startLine:endLine:filepath`；实现任务代码优先

**总原则：** 正确性 > 可维护性 > 可读性 > 极简

**项目一致性：** 改已有项目时，目录、风格、技术选型以目标项目为准。**项目约定 > 通用最佳实践**。

> **统一阈值（Guide / Checker 共用）：** 单函数有效逻辑 **33 行**；单文件组件 **450 行**（建议评估拆分）、**800 行**（必须拆分）。以上为**写作时的评估信号**，不是机械卡线。优先可读性；禁止仅为凑数字拆碎代码。

---

## 0.1 设计原则

| 原则                  | 写作时怎么用                         |
| --------------------- | ------------------------------------ |
| **简单 > 抽象**       | 只写满足需求的最少结构               |
| **组合 > 继承**       | props / slots / children；少深层继承 |
| **数据驱动 > 命令式** | 状态驱动 UI；少手动改 DOM            |
| **局部性 > 全局共享** | 默认组件内；跨处才提升               |
| **一致性 > 创新**     | 跟项目已有风格                       |
| **显式 > 隐式**       | 数据流、副作用、端差异写清楚         |
| **读 > 写**           | 6 个月后仍能读懂                     |
| **Platform First**    | 项目方案 > 平台能力 > 新依赖         |

---

## 一、决策阶梯

写代码前按序思考：

1. **先理解**（改存量）→ 读调用链、数据流、命名；**禁止**未理解就重写
2. **不写可以吗？** → YAGNI
3. **能复用吗？** → DRY，用已有实现
4. **项目/平台能解决吗？** → 标准库、框架能力优先
5. **现有依赖能解决吗？** → 不为几行代码加包
6. **能再简单吗？** → KISS
7. **最后才写** → MVP：最少代码满足需求
8. **够了吗？** → **满足就停**，不继续优化/抽象

**MVP ≠ Demo：** 需求完整、可运行、可维护；禁止 `TODO` 代替交付。

**禁令：** 删优于增；最少文件、最短 diff。
**输出：** 代码优先；其后最多三行 `skipped: X, add when Y`（用户要的报告除外）。

---

## 二、核心工作流

### 需求澄清

模糊任务先确认边界、交互、验收标准。

### 何时先确认再编码

- 重大架构分歧
- 需求歧义、验收不清
- 不可逆修改（迁移、破坏性 API）

其余：**默认直接实现**。

### 实施与交付

- 分步做；结束说明**做了什么、为什么**
- 有代码改动且环境支持时，更新 `.ai-coding-md/迭代-YYYYMMDD.md`

### 输出原则

- **先改代码**，少长篇分析
- 用户问原因或取舍非显而易见时，再简短说明

---

## 三、编码铁律

### 3.1 体积与拆分

- 函数保持可读；超过约 **33 行有效逻辑**时，评估是否有**可独立理解的业务动作**；单一完整流程（如 `handleSubmit`）可保留
- **禁止**仅为凑行数拆一次性步骤函数（`ensureLogin` → `buildPayload` → `requestLogin`）
- 完整业务动作或多处**稳定复用** → 独立函数；命名 **动词 + 业务**
- 单文件组件 **> 800 行** → 必须拆；**> 450 行** → 建议评估 UI/业务区块
- 重复模板块 → 可抽子组件；多页编排 → composable/hook

### 3.2 内联（函数与常量）

| 情形                     | 写法                 |
| ------------------------ | -------------------- |
| 仅调用 1 次              | 写在调用处           |
| 有效逻辑 < 5 行          | 不单独建函数         |
| 完整动作 ≥5 行或稳定复用 | 可抽取               |
| 取值仅 1 处              | 字面量 inline        |
| ≥2 文件或同文件 ≥2 次    | 可在域文件顶 `const` |

**禁止：** `handleData`、`doAction`；无复用的 `api/constants.ts`；机械抽参。

### 3.3 分层

```text
request → api/modules → composables|hooks（≥2 页）/ 页面 → pages|views → components
```

- `request`：鉴权、loading、解包、401；无业务 URL
- `api`：HTTP + DTO；无 UI、toast、路由
- `utils`：≥2 处纯函数；无 `ref`/store/路由
- `composables`/`hooks`：≥2 页业务编排
- `stores`：跨页会话/权限；无 Dialog 开关、临时表单、整页 DOM

### 3.4 数据流

**来源优先级：** props → route → store → api → **derived**（computed / useMemo）

- **单一数据源**：同一事实只维护一份
- **能 derived 就不存 state**：如 `selectedCount` 从 `selectedIds` 算
- **禁止** `watch`/`useEffect` 把 A 同步到 B（应用 computed/useMemo）
- **禁止**副作用里原地改派生来源（`list.sort()` on reactive）

### 3.5 组件

- props 向下，event/callback/emit 向上
- 子组件不改 props；不 `import` 页面；不操作全局 DOM
- **稳定复用**才抽到 `components/`；禁止无复用 `BaseTable`/`BaseDialog`

### 3.6 状态

- 默认 `useState`/`ref`；跨组件才 composable/hook；跨页才 Store
- Store 不放：纯 UI 态、未提交表单、可由 props/URL 派生的值

### 3.7 类型

- 业务 TypeScript；契约在 `src/types/modules/<domain>.ts`
- 禁止 `any`/`as any`；外部数据用 `unknown` + 收窄
- 对象 `interface`；联合/工具 `type`
- 双重断言尽量避免；DOM/Canvas 等确需时**注释原因**
- 共享类型不进 `pages/`/`components/` 下 `*-types.ts`

### 3.8 API

- 请求/响应分型（DTO）；禁止 `Promise<any>`
- REST 前缀在 module 顶；禁止页面拼 URL

### 3.9 异步

- 统一 `async/await`；无依赖**只读**请求用 `Promise.all`
- **写操作**（增删改）评估能否并发
- 组件卸载取消请求（`AbortController`、effect cleanup）

### 3.10 Vue

`<script setup>` 顺序：import → 类型 → 常量 → props/emits → composable/store → ref → **computed** → 方法 → watch/生命周期

- **computed 优先于 watch**；模板复杂逻辑进 computed
- 区块不穿插（依赖例外须注释）

### 3.11 React

Function Component；Hook 顺序：import → 类型 → 常量 → 自定义 hook → state → ref → context → useMemo → useCallback → effect → handlers → JSX

- 禁止循环/条件调 hook
- 能算的不 `useEffect`；useMemo/useCallback 有明确理由再用
- custom hook：≥2 组件稳定复用或单组件完整编排 ≥5 行

### 3.12 CSS

- flex 优先，grid 做二维；Design Token（spacing/font/radius/color）
- 禁止魔法间距/色值散落；scoped / CSS Modules

### 3.13 性能

- 先正确性；真实热点再优化
- 列表稳定 key；图片懒加载；高频事件节流/防抖
- **禁止**无度量 memo/cache；禁止为优化引入双份状态同步

### 3.14 i18n / a11y / 安全

- `t('key', { name })`；禁止 `t() + 拼接`
- 按钮用 `<button>`；`img` 有 `alt`；表单有 `label`
- 禁止不可信 `v-html`/`innerHTML`/`eval`；密钥不进库

### 3.15 错误 / 日志 / Import

- `api` 不 toast；页面决定提示
- 不提交 `console.log`/`debugger`（项目 logger 除外）
- import 顺序：第三方 → types → constants → utils → api → store → hooks → components → style

### 3.16 命名

- 文件 `kebab-case`；代码 `camelCase`；组件 `PascalCase`
- 布尔 `is`/`has`/`can`；方法动词开头
- 禁止 `data`/`obj`/`info`/`v`/`res2` 等无语义名

### 3.17 修改存量

- API、行为默认不变；风格与项目一致；精准修改；删死代码

### 3.18 注释 / 测试

- 必注：端差异、Mock、对外 hook、非显而易见规则、断言原因
- 测试：仅用户要求或项目已有体系或确有覆盖价值

---

## 四、依赖原则

新增 npm 包须：**项目无法满足** + **维护成本可接受** + **收益明显**。

**禁止：** 为 `deepClone` 引 lodash；单函数加包；与已有依赖重叠的第二套库。

---

## 五、Git 与 PR（仅用户明确要求）

- `type: (scope)subject`；未要求不 commit/push
- 一个 commit 一件事；禁止顺手重构/全量格式化/升依赖
- PR 用 `gh`；不提交密钥

---

## 六、环境与执行

- 真实环境：自己跑命令、查代码、验证；不编造数据
- 完整遵循 user/tool/skill 指令

---

## 七、AI 禁止行为

- 无请求抽象、无「以后用」脚手架
- 虚构结构、依赖、接口、字段、表结构
- 猜测需求擅自实现；改用户未要求业务
- 提前 `Base*`/`Abstract*`/工厂/策略/扩展点
- 无稳定复用就抽 hook/utils/constants
- **为遵守规则**而机械拆分、删必要逻辑、降低可读性

## 八、任务结束检查

- [ ] 需求已满足，未继续无关优化、抽象或封装
- [ ] 无冗余代码、死代码、无用 import；未为满足规则而机械拆分或优化
- [ ] 命名与风格符合项目已有习惯
- [ ] 若环境支持且存在项目目录，已更新迭代文档（有改动时）
