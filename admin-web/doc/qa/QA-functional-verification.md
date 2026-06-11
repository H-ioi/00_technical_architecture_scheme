# admin-web 逐项功能核对报告

> **日期**：2026-06-11  
> **依据**：`QA-checklist.md`、`QA-deviation-report.md`、`test/old-test/src/views/isacommunity/`  
> **说明**：本轮以**静态代码对照 + 已有 CI/E2E 记录**为主；浏览器交互项标「待人工」。

---

## 执行摘要

| 类别 | 已核 | 通过 | 待确认/人工 | 备注 |
| --- | --- | --- | --- | --- |
| A. CI 四门 | 4 | 4 | 0 | 见 QA-checklist 执行记录（2026-06-11 PASS） |
| H. E2E | 7 用例 | 7 | 0 | setup + smoke + chromium |
| DEV-001～011 | 11 | 11 | 0 | DEV-008 N/A；DEV-002/OPT-001 已对齐 `canEditProgram` |
| C 节别名/隐藏路由 | 14+6 | 20 | 4 | C-15～C-18 交互待浏览器 |
| D 节业务页 | 80 项 | 0 全量 | 80 | 本轮静态路由/文件覆盖 PASS；CRUD 待人工 |

**结论**：自动化门禁与偏差修复项**静态闭合**；P1 OPT-001 已修复。D 节全量浏览器 QA 尚未执行，不构成 G 节签字。

---

## A. CI 四门

| ID | 命令 | 结果 | 备注 |
| --- | --- | --- | --- |
| A-01 | `npm run type-check` | ✅ | Node ≥18（`.nvmrc` v22） |
| A-02 | `npm run lint` | ✅ | 0 errors |
| A-03 | `npm run lint:style` | ✅ | 0 errors |
| A-04 | `npm run build` | ✅ | 2026-06-11 已验 |

---

## H. E2E（摘录）

| QA ID | 结果 | 覆盖 |
| --- | --- | --- |
| B-03 | ✅ | 未登录 → 登录页 |
| B-07 | ✅ | 404 |
| B-01 / D-02 | ✅ | dashboard layout |
| C-19 / E-05 | ✅ | 问卷 design → edit 重定向 |
| C-24 / E-04 | ✅ | `/attendance/holiday/flow` → `/attendance/flow` |

---

## 偏差修复项 DEV-001～011

| ID | 模块 | 静态核对 | 结论 |
| --- | --- | --- | --- |
| DEV-001 | Activity | `activity.ts` `batchResetToPending` → POST `batchResetActivityStatusToPending?ids=`；`list.vue` 工具栏 `unpublishBatch` | ✅ 与旧 `cancelPublishData` 一致（不筛 status） |
| DEV-002 | Activity | `program-detail-bindings.vue` `bindingEditable`；`edit/index.vue` 传入 `canEdit` | ✅ OPT-001：`canEdit` 已对齐旧 `canEditProgram`（非进行中活动忽略 programStatus） |
| DEV-003 | Activity | 问卷列表 `questionnaire_add/delete/edit_status/edit_frozen/edit/copy` | ✅ |
| DEV-004 | Attendance | `tab.vue` 删除 action `code: 'holiday-delete'` | ✅ |
| DEV-005 | Activity | `questionnaire/edit.vue` 保存/设计 `questionnaire_edit` | ✅ |
| DEV-006 | Attendance | `holidayReturnSave` + `cancel-return-dialog.vue`；条件 `1101 && dataFrom≠MB`；payload 字段对齐旧 `cancel.vue` | ✅ 静态；浏览器：销假后列表刷新 |
| DEV-007 | Attendance | 撤销 `(1100/1103) && dataFrom≠MB` | ✅ |
| DEV-008 | Attendance | 旧 API 无 views 引用 | ⏭ N/A |
| DEV-009 | School bus | 9 模块 `*_download` / `*_import` 分离；`downloadResponseBlob` + content-disposition | ✅ 静态；导出 fallback 文件名可接受 |
| DEV-010 | Content | `/content/navigate-button` CRUD + transfer + 图标上传；权限 `busdriver_edit` | ✅ 静态；浏览器：transfer/上传 |
| DEV-011 | School doctor | `pending-detail-panel.vue` / `pending-drawer.vue` `pendingmedication_operation_edit` | ✅ |

---

## P1 · 已修复

### OPT-001 · 活动项目 `canEdit` vs 旧 `canEditProgram` ✅

| | 旧 | 新（修复后） |
| --- | --- | --- |
| 活动 status 空/null | 不可编辑 | 不可编辑 ✅ |
| 活动 status ≠ 2 且 ≠ 3 | **直接可编辑**（不看 programStatus） | 直接可编辑 ✅ |
| 活动 status = 3 | 不可编辑 | 不可编辑 ✅ |
| 活动 status = 2 | 按 programStatus/type/rounds | `canEditProgramRow` ✅ |

**修复**：`use-program-edit.ts` `canEdit` 计算属性；`edit/index.vue` `:binding-editable="canEdit"` 无需改动。

---

## C 节 · 别名与隐藏路由（静态）

| 范围 | 结果 |
| --- | --- |
| C-01～C-14 别名 | ✅ `MENU_PATH_ALIASES` 已登记 |
| C-19～C-24 隐藏/重定向 | ✅ 路由与组件存在 |
| C-15～C-18 交互 | ⏭ 待浏览器（活动详情 Tab、项目绑定、问卷设计/答卷） |
| C-25 导航按钮 | ✅ 已接入 |

---

## D 节 · 业务页（按 Phase 静态抽样）

| Phase | 路由/视图 | 静态 | 人工 CRUD |
| --- | --- | --- | --- |
| D-1 成员 | `/member/*` | ✅ 文件+API | ⏭ |
| D-3 校车 | `/school-bus/*` | ✅ DEV-009 闭合 | ⏭ D-07～D-15 |
| D-6 考勤 | `/attendance/holiday` 等 | ✅ DEV-004/006/007 | ⏭ D-21～D-31 |
| D-8 活动 | `/activity/*` | ✅ DEV-001/002/003/005 | ⏭ D-35～D-56 |
| D-9 内容 | `/content/navigate-button` 等 | ✅ DEV-010 | ⏭ D-57～D-65 |
| D-10 宿舍 | `/dorm/*` | ✅ API 对齐 | ⏭ |
| D-11 校医 | `/school-doctor/*` | ✅ DEV-011 | ⏭ D-73～D-80 |

---

## 规范符合度（抽样）

| 项 | 结果 |
| --- | --- |
| 权限码内联 | ✅ 偏差修复项 |
| `api/modules` + uni-ui-lib request | ✅ |
| 改动 `.vue` ≤440 行（本轮文件） | ✅；`questionnaire/edit.vue` ~788 行属存量债 |
| 单页 `use-program-edit.ts` | ⚠️ 仅 1 消费者，为控行数可接受 |

---

## 建议下一轮浏览器 QA（优先级）

1. **D-27** 请假 Tab：撤销 / 销假 / 删除权限显隐  
2. **D-52～D-56** 活动项目详情：绑定区只读态、奖池导入  
3. **D-57 导航按钮**（C-25）：图标上传、文章 transfer  
4. **D-08/D-11** 校车导入导出冒烟  
5. **C-15** 活动详情 9 Tab  

---

## 变更记录

| 日期 | 说明 |
| --- | --- |
| 2026-06-11 | 首版：后台子任务中止后由主会话补写；静态逐项核对 DEV + C/D 抽样 |
| 2026-06-11 | OPT-001：`canEdit` 对齐旧 `canEditProgram` |
