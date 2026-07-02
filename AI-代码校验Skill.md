---
name: code-review-common
description: >-
  全前端代码校验 Checker（Vue/React/UniApp/H5/SSR/Electron）。
  代码完成后的质量门禁：检查项、违规判定、修复建议、评审输出。
  编码写法见 AI-全局编码规则 / .cursor/rules/global.mdc。
---

# 代码校验 Skill — Checker

> **Cursor 入口（用户级）：** `~/.cursor/skills/code-review/SKILL.md`（工作流 + 输出）+ `checks.md`（CHK-xxx 明细）  
> **职责：** **怎么判** — 检查、违规、修复、输出格式。  
> **不职责：** 决策阶梯、需求澄清、设计思想长文 → 见 `AI-全局编码规则.md`。

**触发：** 用户要求 review / 校验 / 自查；或编码任务完成后的 Finish Check。

**平台专项：** 移动端 `uni-review-mobile`；后台 `uni-review-web`（冲突时专项优先）。

**阈值：** 33 行、800 行等为**预警信号**；判定须结合是否机械拆分、是否单一业务流程。

---

## 判定等级

| 等级 | 含义 |
| --- | --- |
| **Critical** | 必须修复才能合并 |
| **Warning** | 建议修复 |
| **Pass** | 合规 |

---

## 1. 分层检查

### CHK-LAYER-01 绕过 api 层

| 检查 | 页面/views 是否裸拼 URL 或直连第二套 HTTP 客户端？ |
| --- | --- |
| YES | **Critical** — 改走 `api/modules` + 项目唯一 `request` |
| NO | Pass |

### CHK-LAYER-02 api 写 UI

| 检查 | `api/modules` 是否含 toast、路由、`ElMessage`、`uni.showToast`？ |
| --- | --- |
| YES | **Critical** — UI 上移到页面；api 只抛错/返回 |
| NO | Pass |

### CHK-LAYER-03 utils 含框架状态

| 检查 | `utils/` 是否 `import 'vue'`/`useState`/store/路由？ |
| --- | --- |
| YES | **Critical** — 迁 composable/hook 或内联页面 |
| NO | Pass |

### CHK-LAYER-04 utils/api import 组件

| 检查 | `utils/` 或 `api/` 是否 `import` `.vue`/`.tsx`？ |
| --- | --- |
| YES | **Critical** — 移除反向依赖 |
| NO | Pass |

### CHK-LAYER-05 Store 存 UI 态

| 检查 | Store 是否存 Dialog 开关、Tab 索引、未提交临时表单（非跨页草稿）？ |
| --- | --- |
| YES | **Warning** — 下沉组件 `ref`/`useState` |
| NO | Pass |

### CHK-LAYER-06 composable/hook 判定

| 检查 | 新建 composable/hook 是否仅 1 页消费且 <5 行业务？ |
| --- | --- |
| YES | **Warning** — 内联页面；禁止薄包装 |
| NO | Pass |

### CHK-LAYER-07 utils 单消费者

| 检查 | 新建 `utils/*.ts` 是否仅 1 处 import？ |
| --- | --- |
| YES | **Warning** — 内联消费文件 |
| NO | Pass |

---

## 2. 函数与体积检查

### CHK-FN-01 函数超过约 33 行

```
超过 33 行有效逻辑？
  NO → Pass
  YES → 是否单一完整业务动作（如完整 handleSubmit）？
    YES → Pass
    NO → 是否仅为凑行数拆/合？
      YES → Critical：合并或按业务动作拆分
      NO → Warning：评估拆分
```

### CHK-FN-02 碎函数

| 检查 | 是否存在 <5 行、仅调用 1 次的独立函数？ |
| --- | --- |
| YES | **Critical** — 内联调用处 |
| NO | Pass |

### CHK-FN-03 泛名方法

| 检查 | 是否有 `handleData`、`doAction`、`processItem`？ |
| --- | --- |
| YES | **Warning** — 改为动词+业务名 |
| NO | Pass |

### CHK-FILE-01 单文件组件行数

```
.vue/.tsx 超过 800 行？
  YES → Critical：必须拆分
  NO → 超过约 500 行？
    YES → Warning：评估 UI/业务子组件
    NO → Pass
```

### CHK-FN-04 机械凑行数

| 检查 | 是否为满足行数阈值而拆碎或强行合并？ |
| --- | --- |
| YES | **Critical** — 以可读性为准重组 |
| NO | Pass |

---

## 3. 常量检查

### CHK-CONST-01 单处 constants 文件

| 检查 | 是否存在仅 1 个消费者的新 `constants/*.ts` 或 `api/constants.ts`？ |
| --- | --- |
| YES | **Critical** — 内联消费文件 |
| NO | Pass |

---

## 4. 数据流检查

### CHK-DATA-01 重复状态

| 检查 | 是否同时维护可互相派生的状态（如 `selectedIds` + `selectedCount`）？ |
| --- | --- |
| YES | **Critical** — 保留权威源，其余改 computed/useMemo |
| NO | Pass |

### CHK-DATA-02 watch/effect 同步派生

| 检查 | 是否 `watch`/`useEffect` 把 props/state A 同步到可计算的 B？ |
| --- | --- |
| YES | **Critical** — 改 computed/useMemo 或渲染时计算 |
| NO | Pass |

### CHK-DATA-03 副作用突变来源

| 检查 | 是否在 watch/effect 中对 reactive 源原地 `sort`/`splice` 等？ |
| --- | --- |
| YES | **Critical** — 非突变拷贝或 computed |
| NO | Pass |

### CHK-DATA-04 组件改 props

| 检查 | 子组件是否直接修改 props 或突变 props 对象字段？ |
| --- | --- |
| YES | **Critical** — emit/callback 通知父级 |
| NO | Pass |

---

## 5. 组件与目录检查

### CHK-COMP-01 无复用 Base 组件

| 检查 | 是否新增 `BaseTable`/`BaseDialog`/`BaseForm`/`Abstract*` 且无稳定复用？ |
| --- | --- |
| YES | **Critical** — 删除或内联 |
| NO | Pass |

### CHK-COMP-02 组件 import 页面

| 检查 | 组件是否 `import` pages/views/路由文件？ |
| --- | --- |
| YES | **Critical** — 反转依赖 |
| NO | Pass |

### CHK-COMP-03 抽取时机

| 检查 | 新抽组件是否无稳定复用、仅为「第 N 次出现」？ |
| --- | --- |
| YES | **Warning** — 回内联或等稳定复用再抽 |
| NO | Pass |

---

## 6. TypeScript 检查

### CHK-TS-01 any

| 检查 | 是否新增 `any`、隐式 any、`as any`？ |
| --- | --- |
| YES | **Critical** — 具名类型或 `unknown`+收窄 |
| NO | Pass |

### CHK-TS-02 Promise any

| 检查 | api 是否 `Promise<any>` 或无类型响应？ |
| --- | --- |
| YES | **Critical** — 补 DTO |
| NO | Pass |

### CHK-TS-03 类型文件位置

| 检查 | 是否在 pages/components/hooks 下新增共享 `*-types.ts`？ |
| --- | --- |
| YES | **Warning** — 迁 `types/modules/` |
| NO | Pass |

### CHK-TS-04 双重断言

| 检查 | 是否有 `as unknown as T` 且无注释原因？ |
| --- | --- |
| YES | **Warning** — 补注释或改类型 |
| NO | Pass |

### CHK-TS-05 DTO 完整

| 检查 | api 请求/响应是否均有独立类型并与 `types/modules` 对齐？ |
| --- | --- |
| NO | **Warning** — 补 Params/VO |
| YES | Pass |

---

## 7. 异步检查

### CHK-ASYNC-01 then 链

| 检查 | 是否 `then().then().then()` 链（非单次 then）？ |
| --- | --- |
| YES | **Warning** — 改 async/await |
| NO | Pass |

### CHK-ASYNC-02 无依赖串行

| 检查 | 无依赖的只读请求是否串行 `await`？ |
| --- | --- |
| YES | **Warning** — `Promise.all` |
| NO | Pass |

### CHK-ASYNC-03 写操作无脑并发

| 检查 | 增删改是否未评估就用 `Promise.all`？ |
| --- | --- |
| YES | **Critical** — 按业务顺序或显式注释可并发 |
| NO | Pass |

### CHK-ASYNC-04 卸载未取消

| 检查 | 组件卸载后请求/订阅是否可能 setState（无 abort/cleanup）？ |
| --- | --- |
| YES | **Warning** — AbortController 或 effect cleanup |
| NO | Pass |

---

## 8. Vue 检查

### CHK-VUE-01 computed vs watch

| 检查 | 是否 `watch` 同步可由 `computed` 派生的值？ |
| --- | --- |
| YES | **Critical** — 改 computed |
| NO | Pass |

### CHK-VUE-02 script 顺序

| 检查 | import/props/ref/computed/watch/生命周期是否混乱穿插？ |
| --- | --- |
| YES | **Warning** — 按项目顺序整理 |
| NO | Pass |

---

## 9. React 检查

### CHK-REACT-01 hook 规则

| 检查 | 是否在循环/条件/嵌套函数中调用 hook？ |
| --- | --- |
| YES | **Critical** — 移到顶层 |
| NO | Pass |

### CHK-REACT-02 effect 派生

| 检查 | 是否 `useEffect`+`setState` 同步可计算值？ |
| --- | --- |
| YES | **Critical** — useMemo 或渲染时计算 |
| NO | Pass |

### CHK-REACT-03 无度量 memo

| 检查 | 是否全量 `useMemo`/`useCallback`/`memo` 无热点依据？ |
| --- | --- |
| YES | **Warning** — 移除不必要的 |
| NO | Pass |

### CHK-REACT-04 薄 hook

| 检查 | custom hook 是否仅包 2～3 行且无复用？ |
| --- | --- |
| YES | **Warning** — 内联组件 |
| NO | Pass |

---

## 10. CSS 检查

### CHK-CSS-01 魔法数

| 检查 | 是否散落 `#1890ff`、`margin:13px` 等非 token 值？ |
| --- | --- |
| YES | **Warning** — 用 Design Token |
| NO | Pass |

### CHK-CSS-02 深层选择器

| 检查 | 是否 >3 层嵌套或滥用 `!important`？ |
| --- | --- |
| YES | **Warning** — 简化选择器 |
| NO | Pass |

---

## 11. 性能检查

### CHK-PERF-01 列表 key

| 检查 | 动态列表是否用 index/随机数作 key？ |
| --- | --- |
| YES | **Warning** — 稳定业务 id |
| NO | Pass |

### CHK-PERF-02 提前 cache

| 检查 | 是否无度量新增 `Map`/全局 cache 且增加同步成本？ |
| --- | --- |
| YES | **Warning** — 移除或证明收益 |
| NO | Pass |

---

## 12. i18n 检查

### CHK-I18N-01 硬编码

| 检查 | 用户可见文案是否未走 `t()`？ |
| --- | --- |
| YES | **Warning** — 补 locales |
| NO | Pass |

### CHK-I18N-02 拼接

| 检查 | 是否 `t('a') + variable`？ |
| --- | --- |
| YES | **Critical** — 占位符 `t('a', { variable })` |
| NO | Pass |

---

## 13. 无障碍检查

### CHK-A11Y-01 假按钮

| 检查 | 是否 `div`/`span` onClick 无 role/keyboard？ |
| --- | --- |
| YES | **Warning** — 改 `<button>` 或补 a11y |
| NO | Pass |

### CHK-A11Y-02 img alt

| 检查 | 内容图是否缺 `alt`？ |
| --- | --- |
| YES | **Warning** — 补 alt |
| NO | Pass |

---

## 14. 安全检查

### CHK-SEC-01 XSS

| 检查 | 是否用 `v-html`/`dangerouslySetInnerHTML`/`innerHTML` 渲染不可信内容？ |
| --- | --- |
| YES | **Critical** — 消毒或纯文本 |
| NO | Pass |

### CHK-SEC-02 密钥

| 检查 | 是否提交 Token/API Key/密码？ |
| --- | --- |
| YES | **Critical** — 移除；改环境变量 |
| NO | Pass |

### CHK-SEC-03 eval

| 检查 | 是否 `eval`/`new Function`？ |
| --- | --- |
| YES | **Critical** — 删除 |
| NO | Pass |

---

## 15. 错误与日志检查

### CHK-ERR-01 api toast

| 检查 | catch 是否一律弹 toast？ |
| --- | --- |
| YES | **Warning** — 页面决定提示 |
| NO | Pass |

### CHK-LOG-01 调试残留

| 检查 | 是否含 `console.log`/`debugger`/`console.table`？ |
| --- | --- |
| YES | **Critical** — 删除（warn/error/logger 除外） |
| NO | Pass |

---

## 16. Import 检查

### CHK-IMP-01 顺序

| 检查 | import 是否第三方/alias/样式混乱无分组？ |
| --- | --- |
| YES | **Warning** — 按 types→utils→api→store→hooks→components→style |
| NO | Pass |

---

## 17. 依赖检查

### CHK-DEP-01 多余依赖

| 检查 | 是否为少量工具逻辑新加大包（如 lodash 全量）？ |
| --- | --- |
| YES | **Warning** — 内联或项目已有工具 |
| NO | Pass |

---

## 18. AI 高频违规（快速扫描）

| 违规模式 | 等级 |
| --- | --- |
| 提前 `Base*`/`Abstract*`/工厂/策略 | Critical |
| 无复用抽 hook/utils/constants | Critical |
| 机械拆函数凑行数 | Critical |
| `watch`/`useEffect` 同步 derived | Critical |
| 重复维护双份状态 | Critical |
| 写操作无脑 `Promise.all` | Critical |
| `as any` / `Promise<any>` | Critical |
| 全量 memo/cache | Warning |
| Mock 未标注作生产数据 | Critical |

---

## 19. Critical 禁止清单（汇总）

- 绕过 api；api 写 UI；utils 含状态
- 单文件 **>800 行**不拆；碎函数；单处 constants
- 重复状态；watch/effect 同步 derived；原地突变派生源
- `any`/`as any`/`Promise<any>`
- XSS；密钥入库；`eval`
- 仅为遵守规则降低可读性

> 平台专项见 `uni-review-mobile` / `uni-review-web`。

---

## 20. 质量门禁

目标项目根执行：

```bash
npm run lint
npm run lint:style    # 若已配置
npm run type-check
npm run test:run      # 若已配置
```

| 失败项 | 等级 |
| --- | --- |
| lint / type-check 失败 | Critical |
| test 失败（若项目要求） | Critical |

---

## 21. 评审输出格式

```markdown
## Summary
（1～3 句结论）

## Findings
### Critical — `path:line` — 问题 — 修复建议
### Warning — `path:line` — 问题 — 修复建议
### Suggestion
### Nice to have
```

**Block 条件：** 任一 Critical 未修复 → 不建议合并。

---

## 22. Finish Checklist

编码任务完成或提交前逐项勾选：

- [ ] CHK-LAYER：api 层无 UI；页面无裸 URL
- [ ] CHK-DATA：无重复状态；无可 derived 的 watch/effect 同步
- [ ] CHK-FN/FILE：无碎函数；单文件 ≤800 行；无机械凑行数
- [ ] CHK-TS：无 any；DTO 完整
- [ ] CHK-ASYNC：只读并发；写操作已评估
- [ ] CHK-VUE/REACT：computed/useMemo 优先；hook 合规
- [ ] CHK-CSS：Token；无魔法间距
- [ ] CHK-I18N/A11Y/SEC：占位符；alt/button；无 XSS
- [ ] CHK-LOG：无 console.log/debugger
- [ ] CHK-AI：无 Base*/提前抽象
- [ ] `lint` + `type-check`（+ `test:run`）通过
- [ ] 平台专项 Skill 已对照（若适用）
