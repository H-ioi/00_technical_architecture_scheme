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
| Activity | P1 | 3 | 3 | ✅ 静态对齐 |
| Attendance | P1 | 3 | 3 | ✅ 销假已迁移 |
| Email | — | 0 | 0 | ✅ 已核对 OK |
| School bus | P2 | 1 | 1 | ✅ 静态对齐 |
| Content | P2 | 1 | 1 | ✅ 导航按钮已迁移 |
| Dorm | — | 0 | 0 | ✅ 已核对 OK |
| School doctor | P2 | 1 | 1 | 就诊记录操作编辑权限已对齐 |
| Member / Base / Protocol / Permission | — | 0 | 0 | ✅ 已核对 OK |

**合计**：11 条发现（P0: 0 · P1: 5 · P2: 6）· **本轮修复 10 条**（累计 1 条 N/A）

---

## 已修复（本轮）

| ID | 模块 | 描述 | 修复 |
| --- | --- | --- | --- |
| DEV-001 | Activity | 活动列表缺少「批量取消发布」API 与工具栏按钮 | `activity.ts` 增加 `batchResetToPending`；`list.vue` 增加按钮与 i18n |
| DEV-003 | Activity | 问卷列表权限码与旧页不一致 | 改为 `questionnaire_add/delete/edit_status/edit_frozen/edit/copy` |
| DEV-004 | Attendance | 请假 Tab 删除按钮未校验 `holiday-delete` | `tab.vue` 删除 action 增加 `code: 'holiday-delete'` |
| DEV-002 | Activity | 活动项目详情绑定区未受 `canEditProgram` 约束 | `program-detail-bindings.vue` 增加 `bindingEditable`；`edit/index.vue` 传入 `canEdit` |
| DEV-006 | Attendance | 请假 Tab 缺少「销假」入口 | `holidayReturnSave` API + `cancel-return-dialog.vue` + `tab.vue` 行操作（1101 且 dataFrom≠MB） |
| DEV-005 | Activity | 问卷设计页权限码与旧页不一致 | `edit.vue` 保存/进入设计改为 `questionnaire_edit`（旧 index 行内编辑同码；设计页本身无独立权限） |
| DEV-011 | School doctor | 待用药操作记录编辑权限 | `pending-detail-panel.vue` `canEditOperation` 对齐旧 `pendingmedication_operation_edit` |
| DEV-010 | Content | 导航按钮模块未迁移 | `views/content/navigate-button/` + `content-navigate-button.ts` API；路由 `/content/navigate-button`；`MENU_PATH_ALIASES` |
| DEV-009 | School bus | 导入导出权限码/模板文件名 | 下载模板按钮对齐旧 `*_download` / `busorder_down_*` 权限；模板/导出改用 `content-disposition`（`downloadResponseBlob`） |

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

#### DEV-002 · P1 · 已修复
| | |
| --- | --- |
| **旧** | `activity/program/detail/index.vue`：`canEditProgram` 受活动 `activityStatus` 约束 |
| **新** | `program-detail-bindings.vue` + `use-program-edit.ts` `canEdit` |
| **预期** | 活动已结束（status=3）或项目不可编辑时，绑定区隐藏新增/编辑/删除/导入；`canEdit` 与旧 `canEditProgram` 等价（非进行中活动可编辑、进行中按 program 规则） |
| **实际（修复前）** | 绑定区写操作始终可见；`canEdit` 始终走 `canEditProgramRow` |
| **建议** | ✅ `bindingEditable={canEdit}`；OPT-001 已修复 `canEdit` 分支逻辑 |

#### DEV-003 · P1 · 已修复
见「已修复」表。

#### DEV-005 · P2 · 已修复
| | |
| --- | --- |
| **旧** | `activity/questionnaire/index.vue` 行内「编辑」→ `questionnaire_edit`；`templateform.vue` 设计页无独立权限按钮 |
| **新** | `questionnaire/edit.vue` |
| **预期** | 设计/保存按钮与列表编辑同权限码 |
| **实际（修复前）** | 使用 `busdriver_edit` |
| **建议** | ✅ 已改为 `questionnaire_edit` |

---

### Attendance

#### DEV-006 · P1 · 已修复
| | |
| --- | --- |
| **旧** | `attendance/holiday/leaveManage.vue`：`status==1101 && dataFrom!='MB'` → `dialog/cancel.vue` → POST `/attendance/holiday-return/save-holiday-return` |
| **新** | `tab.vue` + `components/cancel-return-dialog.vue` + `attendance-holiday.ts` `holidayReturnSave` |
| **预期** | 休假中记录可发起销假；payload 与旧 `cancel.vue` 一致 |
| **建议** | ✅ 已迁移；浏览器 QA 销假 Tab 列表刷新 |

#### DEV-007 · P1 · 已修复（撤销规则）
| | |
| --- | --- |
| **旧** | 撤销：`(status 1100/1103) && dataFrom !== 'MB'` |
| **新** | `tab.vue` `leaveActions` 条件一致 |
| **状态** | ✅ 逻辑已对齐（静态核对） |

#### DEV-004 · P1 · 已修复
见「已修复」表。

#### DEV-008 · P2 · 不修复（N/A）
| | |
| --- | --- |
| **旧** | `holiday.js` 含 `cancelHoliday`（POST `/holiday/cancel`）、`startFlowInstance` |
| **新** | 未封装上述接口 |
| **实际** | 旧 `add.vue` 新建/编辑仅调 `saveHoliday`/`updateHoliday`，上述 API 在旧 views 中**无引用** |
| **建议** | ⏭ **Won't fix / N/A** — 旧 views 无调用；若后端流程变更再单独立项 |

---

### Email · ✅ 已核对 OK

- API：`bulk-email.ts` 与 `mail.js` 路径一致（`/isacommunity/mailing/*`、TENANT-ID 由请求层注入）。
- 群组：筛选 `includeParentMails`/`includeStudentMails`、权限 `mailgroup-add/gd/sy/delete` 与旧 `group.vue` 一致。
- 年级下拉：新 `group-dialog.vue` 使用 `attendanceStudentApi.gradeList` → `/attendance/common/getGradeList`（旧 `mail.js` `getGradeList` 同路径）。

---

### School bus

#### DEV-009 · P2 · 已修复（静态对齐）
| | |
| --- | --- |
| **旧** | 9 处导入导出：`busdriver/car/busorder/busoperation/busexception/busline/busstation/teacheruser`；模板下载权限 `*_download` / `busorder_down_*`；文件名取自 `content-disposition` |
| **新** | `school-bus-*.ts` API + `views/school-bus/**` 列表页 |
| **预期** | 路径/HTTP/FormData `file` 字段一致；下载与导入权限分离；导出参数 `{ ...search, 去 size/current }` |
| **实际（修复前）** | API 路径已对齐；部分页下载模板误用 `*_import` 权限；模板/导出使用硬编码文件名 |
| **建议** | ✅ 已修复：权限码 + `rawResponse`/`downloadResponseBlob` 对齐旧 `util/download.js` 行为 |

**模块核对摘要**

| 模块 | 导入 API | 模板 API | 导出 API | 下载权限 | 导入权限 |
| --- | --- | --- | --- | --- | --- |
| 司机 | POST `/busdriver/import` | GET `/download` | — | `busdriver_download` | `busdriver_import` |
| 车辆 | POST `/buscarinfo/import` | GET `/download` | — | `buscarinfo_download` | `buscarinfo_import` |
| 跟车老师 | POST `/teacher/user/import` | GET `/download` | GET `/export` | `teacheruser_download` | `teacheruser_import` |
| 申请意向 | POST `/busorder/importIntentionOrder` | GET `/downloadIntentionOrder` | — | `busorder_down_intention_order` | `busorder_import_intention_order` |
| 乘车学生 | POST `/busorder/importOrder` | GET `/downloadOrder` | GET `/exportOrder` | `busorder_down_order` | `busorder_import_order` |
| 路线运营 | POST `/busoperation/import` | GET `/download` | GET `/export` | `busoperation_download` | `busoperation_import` |
| 异常上报 | POST `/busexception/import` | GET `/download` | GET `/export` | `busexception_download` | `busexception_import` |
| 路线规划 | POST `/busline/import` | GET `/download` | — | `busline_download` | `busline_import` |
| 站点 | POST `/busstation/import` | GET `/download` | — | `busstation_download` | `busstation_import` |

---

### Content

#### DEV-010 · P2 · 已修复
| | |
| --- | --- |
| **旧** | `content/navbutton/` + `content.js` → `/isacommunity/content/navigate-button/*` |
| **新** | `views/content/navigate-button/`、`api/modules/content-navigate-button.ts`、`router/modules/content.ts`、`menu.ts` 别名 |
| **预期** | 列表分页、CRUD、`el-transfer` 关联文章（`/article/visible`）、图标上传（`parent_weapp_upload`）、权限 `busdriver_edit` |
| **建议** | ✅ 已迁移；浏览器 QA 关联文章与图标上传 |

其余 10 个子模块（公告、食谱、校园生活、文章/分类、讨论列表/标签/评论/点赞收藏、**导航按钮**）：API 前缀与 HTTP 方法与 `content.js` 一致。

---

### Dorm · ✅ 已核对 OK

- API：`/isacommunity/dormitory/*` 与 `dorm.js` 一致。
- 权限：`boarding-*`、`building/floor/room/rule/attribute-*` 与旧页 `permissions[...]` 一致（含 `boarding-parent-view`）。

---

### School doctor

#### DEV-011 · P2 · 已修复
| | |
| --- | --- |
| **旧** | `visitRecord/detail.vue`：`pendingmedication_operation_edit`（未下发时不拦截） |
| **新** | `pending-detail-panel.vue` + `pending-drawer.vue` |
| **预期** | 操作记录「编辑」按钮受 `pendingmedication_operation_edit` 约束 |
| **实际（修复前）** | `canEditOperation` 恒为 `true` |
| **建议** | ✅ 已对齐；旧代码无其他 `pendingmedication_*` 字段级权限 |

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

1. **问卷设计页 `?id=` 书签**（QA C-25 可选）— 旧 `templateresult`/`form` query 风格 vs 新 path 参数。
2. **活动绑定区行为**（DEV-002 / OPT-001）— 静态已对齐 `canEditProgram`；D-52～D-56 仍建议浏览器回归。
3. **销假流程**（DEV-006）— 静态已迁移；浏览器 QA 销假 Tab 列表刷新。
4. **导航按钮**（DEV-010）— 静态已迁移；浏览器 QA 图标上传与文章关联。
5. **校车导入导出**（DEV-009）— 静态已闭合；可选浏览器冒烟 D-08/D-11 等。

---

## 变更记录

| 日期 | 说明 |
| --- | --- |
| 2026-06-11 | 首版：8 模块静态对照；修复 DEV-001/003/004 |
| 2026-06-11 | 修复 DEV-002/006：活动绑定只读态、请假销假流程 |
| 2026-06-11 | 修复 DEV-005/011；DEV-008 N/A、DEV-009 静态 OK |
| 2026-06-11 | 修复 DEV-010：迁移内容「导航按钮」模块 |
| 2026-06-11 | 修复 DEV-009：校车导入导出权限码 + content-disposition 文件名对齐 |
| 2026-06-11 | OPT-001：`canEdit` 对齐旧 `canEditProgram`（DEV-002 绑定区逻辑闭合） |
