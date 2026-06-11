# admin-web 业务偏差报告（旧代码对照）

> **对照依据**：`test/old-test/src/views/isacommunity/` + 同模块 `api/`、`mixins/`、组件  
> **落地工程**：`admin-web`  
> **方案**：`isacommunity重构方案.md`  
> **QA 清单**：`QA-checklist.md`  
> **审计日期**：2026-06-11

---

## 摘要

| 模块 | 最高严重度 | 发现数 | 已修复 | 状态 |
| --- | --- | --- | --- | --- |
| Activity | P1 | 3 | 2 | 1 项待产品/人工 QA |
| Attendance | P1 | 3 | 1 | 销假流程未迁移 |
| Email | — | 0 | 0 | ✅ 已核对 OK |
| School bus | P2 | 1 | 0 | API 对齐；导入字段待浏览器 QA |
| Content | P2 | 1 | 0 | 导航按钮未迁移（已知） |
| Dorm | — | 0 | 0 | ✅ 已核对 OK |
| School doctor | P2 | 1 | 0 | 就诊记录细粒度权限待补 |
| Member / Base / Protocol / Permission | — | 0 | 0 | ✅ 已核对 OK |

**合计**：11 条发现（P0: 0 · P1: 5 · P2: 6）· **本轮修复 4 条**

---

## 已修复（本轮）

| ID | 模块 | 描述 | 修复 |
| --- | --- | --- | --- |
| DEV-001 | Activity | 活动列表缺少「批量取消发布」API 与工具栏按钮 | `activity.ts` 增加 `batchResetToPending`；`list.vue` 增加按钮与 i18n |
| DEV-003 | Activity | 问卷列表权限码与旧页不一致 | 改为 `questionnaire_add/delete/edit_status/edit_frozen/edit/copy` |
| DEV-004 | Attendance | 请假 Tab 删除按钮未校验 `holiday-delete` | `tab.vue` 删除 action 增加 `code: 'holiday-delete'` |

---

## 发现明细

### Activity

#### DEV-001 · P1 · 已修复
| | |
| --- | --- |
| **旧** | `test/old-test/src/api/isacommunity/activity.js` → `batchResetActivityStatusToPending`；`activity/list/index.vue` 工具栏「取消发布」 |
| **新** | `admin-web/src/api/modules/activity.ts`、`views/activity/list/list.vue` |
| **预期** | POST `/isacommunity/activity/batchResetActivityStatusToPending?ids=…`，选中任意状态活动批量改回待发布 |
| **实际（修复前）** | 仅有 `batchPublish`，无取消发布入口 |
| **建议** | ✅ 已按旧接口补齐 |

#### DEV-002 · P1 · 待补
| | |
| --- | --- |
| **旧** | `activity/program/detail/index.vue`：抽奖项目 `programType==1` 时展示奖品绑定、奖池导入、投票项目 `programType==2` 时展示投票绑定 |
| **新** | `views/activity/program/edit/components/program-detail-bindings.vue`（查看态 `detailId` 时渲染） |
| **预期** | 绑定区 API：`prize/listByProgram`、`lotteryPoolFile/*`、`voteProgram/listByprogram`；编辑按钮受活动 `activityStatus` 只读约束 |
| **实际** | 组件与 API 路径已对齐；**活动只读态**（已结束活动）下编辑/导入按钮是否应隐藏需浏览器 QA（旧 `canEditProgram` 逻辑） |
| **建议** | 人工 QA D-52～D-56；若只读态仍可操作则补 `readOnly` 与旧 `canEditProgram` 一致 |

#### DEV-003 · P1 · 已修复
见「已修复」表。

#### DEV-005 · P2
| | |
| --- | --- |
| **旧** | `activity/questionnaire/index.vue`：`questionnaire_add` 等独立权限 |
| **新（修复前）** | 问卷页统一使用 `busdriver_edit/del` |
| **建议** | ✅ 行内/批量权限已改回旧码；`questionnaire/edit.vue` 内按钮仍为 `busdriver_edit`（旧设计页无独立菜单，影响低） |

---

### Attendance

#### DEV-006 · P1 · 待补
| | |
| --- | --- |
| **旧** | `attendance/holiday/leaveManage.vue`：`status==1101 && dataFrom!='MB'` 显示「销假」→ `dialog/cancel.vue` → POST `/attendance/holiday-return/save-holiday-return` |
| **新** | `views/attendance/holiday/tab.vue` 请假 Tab 仅有「撤销」(1100/1103)、查看、删除；**无销假入口** |
| **预期** | 休假中记录可发起销假；销假 Tab 仅展示历史 |
| **实际** | `attendance-holiday.ts` 无 `holidayReturnSave`；无销假弹窗组件 |
| **建议** | 迁移 `cancel.vue` 交互 + API `save-holiday-return`（勿猜测表单字段，照抄旧 payload） |

#### DEV-007 · P1 · 已修复（撤销规则）
| | |
| --- | --- |
| **旧** | 撤销：`(status 1100/1103) && dataFrom !== 'MB'` |
| **新** | `tab.vue` `leaveActions` 条件一致 |
| **状态** | ✅ 逻辑已对齐（静态核对） |

#### DEV-004 · P1 · 已修复
见「已修复」表。

#### DEV-008 · P2
| | |
| --- | --- |
| **旧** | `holiday.js` 含 `cancelHoliday`（POST `/holiday/cancel`）、`startFlowInstance` |
| **新** | 未封装上述接口 |
| **实际** | 旧 `add.vue` 新建/编辑仅调 `saveHoliday`/`updateHoliday`，上述 API 在旧 views 中**无引用** |
| **建议** | 暂不实现；若后端仍要求单独启动流程再立项 |

---

### Email · ✅ 已核对 OK

- API：`bulk-email.ts` 与 `mail.js` 路径一致（`/isacommunity/mailing/*`、TENANT-ID 由请求层注入）。
- 群组：筛选 `includeParentMails`/`includeStudentMails`、权限 `mailgroup-add/gd/sy/delete` 与旧 `group.vue` 一致。
- 年级下拉：新 `group-dialog.vue` 使用 `attendanceStudentApi.gradeList` → `/attendance/common/getGradeList`（旧 `mail.js` `getGradeList` 同路径）。

---

### School bus

#### DEV-009 · P2
| | |
| --- | --- |
| **旧** | `busorder.js` 乘车学生/意向导入导出、`busattendance.js` CRUD |
| **新** | `school-bus-order.ts`、`school-bus-attendance.ts` |
| **预期** | 路径与方法一致 |
| **实际** | 静态对比 **API 对齐**；批量导入 VERSION 头、模板文件名需浏览器 QA |
| **建议** | QA D-19～D-24 |

---

### Content

#### DEV-010 · P2 · 产品决策
| | |
| --- | --- |
| **旧** | `content/navbutton/` + `content.js` → `/isacommunity/content/navigate-button/*` |
| **新** | **未迁移**（方案 §15.10 / QA C-25） |
| **建议** | 确认生产菜单是否仍下发；若需要则单独立项 |

其余 9 个子模块（公告、食谱、校园生活、文章/分类、讨论列表/标签/评论/点赞收藏）：API 前缀与 HTTP 方法与 `content.js` 一致。

---

### Dorm · ✅ 已核对 OK

- API：`/isacommunity/dormitory/*` 与 `dorm.js` 一致。
- 权限：`boarding-*`、`building/floor/room/rule/attribute-*` 与旧页 `permissions[...]` 一致（含 `boarding-parent-view`）。

---

### School doctor

#### DEV-011 · P2
| | |
| --- | --- |
| **旧** | `visitRecord/detail.vue`：多条 `pendingmedication_*` / 就诊字段级权限 |
| **新** | `visit-record/components/pending-drawer.vue` 部分使用 `pendingmedication_operation_edit` |
| **建议** | 对照旧 detail 权限表逐项补 `code`；人工 QA D-73～D-80 |

其余模块（档案、医疗信息、规章、用药、疾病、传染病、体检）：API 与主列表权限（`medicalinfo_*`、`medicationapplication_add` 等）静态对齐。

---

### Member / Base / Protocol / Permission · ✅ 已核对 OK

| 域 | 核对结论 |
| --- | --- |
| Member | `getStudentPage` / `getTeacherPage` / 下拉接口与 `merber.js` 一致 |
| Base | 校区/年级 CRUD 路径对齐 |
| Protocol | `getProtocolPage`、`getDictList`、签章接口对齐 |
| Permission | 菜单/角色/部门/用户 API 与 `/admin/*` 映射一致；`MENU_PATH_ALIASES` 已登记 |

---

## 无需修复（与旧一致说明）

- **Activity 权限 `busdriver_edit/del`**：旧活动列表/详情 Tab 同样使用（历史命名），非偏差。
- **活动详情 Tab 9 项**：路由与 API 已落地；交互待人工 QA。
- **奖池 API**：`activity-lottery-pool.ts` 与 `lotteryPoolFile.js` 路径一致。

---

## Top 5 · 需产品/后续决策

1. **请假「销假」入口缺失**（DEV-006）— 影响业务闭环，建议 P1 排期迁移旧 `cancel.vue`。
2. **内容「导航按钮」未迁移**（DEV-010）— 菜单若仍下发则用户 404。
3. **活动项目详情只读态**（DEV-002）— 已结束活动是否禁止绑定/导入，需确认旧 `canEditProgram` 行为。
4. **校医就诊记录字段级权限**（DEV-011）— 是否全量照搬旧 detail 权限表。
5. **问卷设计页 `?id=` 书签**（QA C-25 可选）— 旧 `templateresult`/`form` query 风格 vs 新 path 参数。

---

## 变更记录

| 日期 | 说明 |
| --- | --- |
| 2026-06-11 | 首版：8 模块静态对照；修复 DEV-001/003/004 |
