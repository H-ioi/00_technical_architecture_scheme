# isacommunity → admin-web 重构 QA 清单

> 对照依据：`test/old-test/src/views/isacommunity/...`  
> 落地工程：`admin-web`  
> 方案文档：`../plans/isacommunity重构方案.md`  
> 别名配置：`src/api/modules/menu.ts` → `MENU_PATH_ALIASES`

建议复制到 Excel / 飞书表格，增加列：**执行人 / 日期 / 结果 / 备注**。  
结果标记：☐ 未测 / ✅ 通过 / ❌ 失败 / ⏭ 跳过（附原因）

**推荐流程**：A 节 CI 四门 → **H 节 E2E**（基座 smoke/shell）→ B/C/D/E 人工补测。E2E 通过 ≠ 清单项 ✅，须对照 H 节映射表逐项勾选；未纳入 spec 的仍须浏览器 QA。

---

## 执行记录


| 日期         | 执行内容                                                                                 | 结果          | 备注                                                       |
| ---------- | ------------------------------------------------------------------------------------ | ----------- | -------------------------------------------------------- |
| 2026-06-11 | **业务偏差审计** → [`QA-deviation-report.md`](./QA-deviation-report.md)（旧代码静态对照） | **11 发现 / 4 修复** | P1 待补：销假流程、活动项目只读态 QA；P2：导航按钮、校医就诊权限 |
| 2026-06-11 | CI 四门：`type-check` / `lint` / `lint:style` / `build`（Node **v22**，`nvm use`） | **全部 PASS** | 默认 shell Node v14.21.3 无法跑 vue-tsc/ESLint 10，须切 Node ≥18（见 `.nvmrc`） |
| 2026-06-11 | C-1 别名表 vs `MENU_PATH_ALIASES`（14 项）                                                 | **PASS**    | 清单所列旧 path 均已登记                                          |
| 2026-06-11 | C-2 隐藏路由与 redirect（activity / attendance / dorm / protocol）                          | **PASS**    | 路由与组件 import 存在；页面行为待浏览器                                 |
| 2026-06-11 | D 节路由 + view 文件覆盖（D-01～D-80）                                                         | **PASS**    | 无缺失路由/视图；业务 CRUD 待人工 QA                                  |
| 2026-06-11 | Phase 8 `program-detail-bindings.vue` 接线                                             | **PASS**    | `program/edit/index.vue` 在 `detailId` 时渲染绑定区             |
| 2026-06-11 | 可选书签 `questionnaire/form`、`templateresult`                                           | **未登记**     | 旧链用 query `?id=`，与现 path 参数不一致；待生产菜单确认后再加                |
| 2026-06-11 | A-05 后端 `/upms/menu/user`、业务 API 可用；A-06 清缓存/无痕登录确认                              | **PASS**    | 用户确认；配置 `E2E_USERNAME`/`E2E_PASSWORD` 后 `auth.setup` 可复验登录与 dashboard |
| 2026-06-11 | H 节 E2E：`npm run test:e2e`（Node **v22.22.2**）                                          | **7/7 PASS** | setup 1 + smoke 2 + chromium 4；`auth.setup` 复用 `e2e/.auth/user.json`（~3.7s）；CI 四门复验 PASS |
| 2026-06-11 | 人工项统一 ⏭ 跳过                                                                          | **DEFERRED** | B/C/D/E 节须浏览器 QA 的 ☐ 项本轮标 ⏭；E2E/静态审计 ✅ 保留；下轮补测 |


> **C-15～C-24 说明**：C-01～C-14、C-19～C-24 静态 ✅；C-15～C-18 交互项本轮 ⏭（人工 QA，下轮补测）。

## A. 测试前准备（必做）


| ID   | 步骤                                                          | 预期                    | 结果  |
| ---- | ----------------------------------------------------------- | --------------------- | --- |
| A-01 | `admin-web` 下执行 `npm run type-check`（须 Node ≥18，见 `.nvmrc`） | PASS                  | ✅   |
| A-02 | `npm run lint`                                              | 0 errors / 0 warnings | ✅   |
| A-03 | `npm run lint:style`                                        | 0 errors              | ✅   |
| A-04 | `npm run build`                                             | PASS                  | ✅   |
| A-05 | 确认后端 `/upms/menu/user`、业务 API 可用                            | 登录后能拉菜单               | ✅   |
| A-06 | 浏览器清缓存 / 无痕窗口登录                                             | 避免旧 token 干扰          | ✅   |


**测试账号建议**：超管（全菜单）、业务岗（部分菜单）、无权限账号。

---

## B. 全局基座（P0 / P12 横切）


| ID   | 场景    | 操作                     | 预期                       | E2E | 结果  |
| ---- | ----- | ---------------------- | ------------------------ | --- | --- |
| B-01 | 登录    | 正确账号密码登录               | 跳转 `/dashboard`，token 写入 | shell（需账号） | ✅（E2E：auth.setup + dashboard） |
| B-02 | 退出    | 点击退出                   | token 清除，回登录页            | 人工 | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| B-03 | 未登录访问 | 直接打开 `/member/student` | 重定向登录                    | smoke | ✅   |
| B-04 | 无菜单权限 | 无权限账号访问业务 URL          | 403 或菜单不可见               | 人工 | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| B-05 | 侧栏分组  | 检查校车/活动/内容/宿舍/校医父级     | 子菜单在父级下，非顶层散落            | 人工 | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| B-06 | 菜单标题  | 对比后端菜单 label           | 标题正确，icon 来自本地路由         | 人工 | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| B-07 | 404   | 访问不存在路径                | 404 页                    | shell | ✅   |
| B-08 | 主题/布局 | 切换语言、主题（如有）            | 无白屏、无控制台报错               | 人工 | ⏭ 跳过（人工）：人工 QA，本轮跳过 |


---

## C. 别名与隐藏路由审计（P12 §15.13 专项）

对照 `src/api/modules/menu.ts` 的 `MENU_PATH_ALIASES` 与 `src/router/modules/`*。

### C-1 菜单 path 映射（侧栏 + 直链）

对下表每一行：**旧 path 书签直链** → 应落到**新路由**且页面正常。


| ID   | 旧 path（示例）                                     | 新路由                             | 结果  |
| ---- | ---------------------------------------------- | ------------------------------- | --- |
| C-01 | `/isacommunity/home/index`                     | `/dashboard`                    | ✅   |
| C-02 | `/isacommunity/member/student/index`           | `/member/student`               | ✅   |
| C-03 | `/isacommunity/user/teacher/index`             | `/school-bus/follow-teacher`    | ✅   |
| C-04 | `/isacommunity/schoolbus/attendance/index`     | `/school-bus/attendance`        | ✅   |
| C-05 | `/admin/menu/index`                            | `/permission/menu`              | ✅   |
| C-06 | `/isacommunity/attendance/holiday/flow`        | `/attendance/flow`              | ✅   |
| C-07 | `/isacommunity/attendance/holiday/task`        | `/attendance/task`              | ✅   |
| C-08 | `/isacommunity/attendance/holiday/config`      | `/attendance/config`            | ✅   |
| C-09 | `/isacommunity/attendance/holiday/pass`        | `/attendance/pass`              | ✅   |
| C-10 | `/attendance/holiday/flow`（历史存库）               | `/attendance/flow`              | ✅   |
| C-11 | `/isacommunity/activity/program/detail/index`  | `/activity/program/detail`      | ✅   |
| C-12 | `/isacommunity/content/moent/foodweekly/index` | `/content/moment/food-weekly`   | ✅   |
| C-13 | `/isacommunity/dorm/space/room/:id`            | `/dorm/space/room-assign/:id`   | ✅   |
| C-14 | `/isacommunity/schoolDoctor/studentRecord`     | `/school-doctor/student-record` | ✅   |


### C-2 隐藏路由（不在侧栏，须从列表跳入）


| ID   | 新路由                                       | 入口             | 验收点                     | 结果  |
| ---- | ----------------------------------------- | -------------- | ----------------------- | --- |
| C-15 | `/activity/detail`                        | 活动列表 → 详情      | 9 个 Tab 均可切换            | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| C-16 | `/activity/program/detail`                | 活动项目列表 → 详情/编辑 | 查看态含绑定区（见 D-52～D-56）    | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| C-17 | `/activity/questionnaire/edit/:id`        | 问卷列表 → 设计      | 设计器可保存                  | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| C-18 | `/activity/questionnaire/submissions/:id` | 问卷列表 → 答卷      | 答卷列表分页                  | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| C-19 | `/activity/questionnaire/design/:id`      | 旧书签            | 重定向到 edit 路由            | ✅（shell E2E） |
| C-20 | `/protocol/detail/:id`                    | 协议列表 → 详情      | 详情只读/编辑态正确              | ✅   |
| C-21 | `/dorm/space/room-assign/:id`             | 房间列表 → 床位分配    | 床位卡片、分配提交               | ✅   |
| C-22 | `/attendance/flow/edit/create`            | 流程列表 → 新建      | 流程设计器                   | ✅   |
| C-23 | `/attendance/flow/edit/:id`               | 流程列表 → 编辑      | 同旧页字段                   | ✅   |
| C-24 | `/attendance/holiday/flow`                | 旧书签            | 重定向到 `/attendance/flow` | ✅（shell E2E） |


### C-3 未接入项（产品决策）


| ID   | 旧 path                                  | 状态                  | 结果  |
| ---- | --------------------------------------- | ------------------- | --- |
| C-25 | `/isacommunity/content/navigate-button` | 列表 + CRUD + 文章关联 + 图标上传；路由 `/content/navigate-button` | ✅   |


---

## D. 业务模块逐页 QA

每页通用步骤：**列表加载 → 筛选/重置 → 新增 → 编辑 → 查看（如有）→ 删除/批量 → 导出/导入（如有）→ 权限按钮显隐**。

### D-1 Phase 1：登录 / 首页 / 成员


| ID   | 新路由               | 旧对照              | 关键权限         | 结果  |
| ---- | ----------------- | ---------------- | ------------ | --- |
| D-01 | `/login`          | 旧登录页             | —            | ✅（E2E smoke：表单渲染）；⏭ 完整登录/验证码边界（人工 QA，本轮跳过） |
| D-02 | `/dashboard`      | `home/index`     | —            | ✅（E2E shell：URL + layout）；⏭ widgets/数据（人工 QA，本轮跳过） |
| D-03 | `/member/student` | `member/student` | 学生 CRUD / 导出 | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-04 | `/member/teacher` | `member/teacher` | 教师 CRUD / 导出 | ⏭ 跳过（人工）：人工 QA，本轮跳过 |


### D-2 Phase 2：基础设置


| ID   | 新路由            | 旧对照           | 结果  |
| ---- | -------------- | ------------- | --- |
| D-05 | `/base/school` | `base/school` | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-06 | `/base/grade`  | `base/grade`  | ⏭ 跳过（人工）：人工 QA，本轮跳过 |


### D-3 Phase 3：校车管理


| ID   | 新路由                           | 旧对照                         | 关键权限                                       | 结果  |
| ---- | ----------------------------- | --------------------------- | ------------------------------------------ | --- |
| D-07 | `/school-bus/route/plan`      | `schoolbus/route/plan`      | 路线规划 Tab                                   | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-08 | `/school-bus/route/operation` | `schoolbus/route/operation` | `busoperation_`*、导入导出                      | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-09 | `/school-bus/route/exception` | `schoolbus/route/exception` | `busexception_del`                         | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-10 | `/school-bus/student/apply`   | `schoolbus/student/apply`   | 申请意向                                       | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-11 | `/school-bus/student/order`   | `schoolbus/student/order`   | `busorder_*`、导入导出                          | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-12 | `/school-bus/driver`          | `schoolbus/driver`          | `busdriver_*`                              | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-13 | `/school-bus/follow-teacher`  | `user/teacher`              | `teacheruser_*`                            | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-14 | `/school-bus/car`             | `schoolbus/car`             | `buscarinfo_*`                             | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-15 | `/school-bus/attendance`      | `schoolbus/attendance`      | `busattendance_add/edit/del`；学生远程检索、路线站点联动 | ⏭ 跳过（人工）：人工 QA，本轮跳过 |


### D-4 Phase 4：协议


| ID   | 新路由         | 旧对照              | 关键权限                     | 结果  |
| ---- | ----------- | ---------------- | ------------------------ | --- |
| D-16 | `/protocol` | `protocol/index` | `protocol_add/del`、发布/停用 | ⏭ 跳过（人工）：人工 QA，本轮跳过 |


### D-5 Phase 5：权限


| ID   | 新路由                | 旧对照             | 关键权限                  | 结果  |
| ---- | ------------------ | --------------- | --------------------- | --- |
| D-17 | `/permission/menu` | `admin/menu`    | 菜单树 CRUD              | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-18 | `/permission/role` | `admin/role`    | `sys_role_add`        | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-19 | `/permission/dept` | `admin/dept`    | `sys_dept_add`        | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-20 | `/permission/user` | `admin/isauser` | `sys_user_add`、角色分配弹窗 | ⏭ 跳过（人工）：人工 QA，本轮跳过 |


### D-6 Phase 6：考勤


| ID   | 新路由                         | 旧对照                         | 专项验收                                           | 结果  |
| ---- | --------------------------- | --------------------------- | ---------------------------------------------- | --- |
| D-21 | `/attendance/student`       | `attendance/student`        | 导出 `student_attendance_export`                 | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-22 | `/attendance/school`        | `attendance/school`         | 导出                                             | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-23 | `/attendance/access`        | `attendance/access`         | 门禁记录                                           | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-24 | `/attendance/wechat`        | `attendance/wechat`         | `archive_wx_openid`                            | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-25 | `/attendance/wechat-notice` | `attendance/wechatnotice`   | 通知发送                                           | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-26 | `/attendance/daily`         | `attendance/index`          | 每日考勤                                           | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-27 | `/attendance/holiday`       | `attendance/holiday`        | **撤销**：仅 `status=1100/1103` 且 `dataFrom≠MB` 显示 | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-28 | `/attendance/flow`          | `attendance/holiday/flow`   | 流程列表 + 设计器跳转                                   | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-29 | `/attendance/task`          | `attendance/holiday/task`   | 待办/已办                                          | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-30 | `/attendance/config`        | `attendance/holiday/config` | 配置项保存                                          | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-31 | `/attendance/pass`          | `attendance/holiday/pass`   | 放行条                                            | ⏭ 跳过（人工）：人工 QA，本轮跳过 |


### D-7 Phase 7：群发邮件（跨模块回归重点）


| ID   | 新路由             | 旧对照           | 专项验收                                   | 结果  |
| ---- | --------------- | ------------- | -------------------------------------- | --- |
| D-32 | `/email/group`  | `email/group` | 群组 CRUD；**收件人选择弹窗**；字段与旧页逐项核对（旧页近期有大改） | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-33 | `/email/send`   | `email/send`  | 发件箱配置                                  | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-34 | `/email/outbox` | `email/outgo` | 草稿/已发 Tab；撰写抽屉；发送流程                    | ⏭ 跳过（人工）：人工 QA，本轮跳过 |


### D-8 Phase 8：活动管理（高风险）

#### 主菜单页


| ID   | 新路由                        | 旧对照                      | 关键权限                 | 结果  |
| ---- | -------------------------- | ------------------------ | -------------------- | --- |
| D-35 | `/activity/list`           | `activity/list`          | `busdriver_edit/del` | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-36 | `/activity/program`        | `activity/program`       | 复制、编辑、删除             | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-37 | `/activity/prize`          | `activity/prize`         | 奖品 CRUD              | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-38 | `/activity/vote-program`   | `activity/voteprogram`   | 投票节目 CRUD            | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-39 | `/activity/questionnaire`  | `activity/questionnaire` | 设计/答卷入口              | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-40 | `/activity/parent-student` | `activity/parentstudent` | 关联管理                 | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-41 | `/activity/wechat-school`  | `activity/wechatSchool`  | 微信配置                 | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-42 | `/activity/email-school`   | `activity/emailSchool`   | 邮箱配置                 | ⏭ 跳过（人工）：人工 QA，本轮跳过 |


#### 活动详情 Tab（`/activity/detail`）


| ID   | Tab name      | 验收点                    | 结果  |
| ---- | ------------- | ---------------------- | --- |
| D-43 | base          | 基本信息编辑保存               | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-44 | program       | 项目列表联动                 | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-45 | questionnaire | 问卷内容                   | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-46 | registration  | 导入票券、模板下载、导出 CSV       | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-47 | checkin       | 活动 status=3 时可导出       | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-48 | winner        | 新增获奖、导出                | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-49 | voteInfo      | 新增、导出                  | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-50 | blessing      | 祝福语 CRUD、导出（**非独立菜单**） | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-51 | feedback      | 反馈导出                   | ⏭ 跳过（人工）：人工 QA，本轮跳过 |


#### 活动项目详情子能力（`/activity/program/detail`，Phase 8 闭合关键）

对照旧 `activity/program/detail/index.vue`：


| ID   | 项目类型                         | 验收点                            | 结果  |
| ---- | ---------------------------- | ------------------------------ | --- |
| D-52 | type=1 抽奖                    | 绑定奖品（单条）；弹窗固定 programId、无项目下拉  | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-53 | type=1 + createLotteryPool=1 | 奖池模板下载、Excel 导入、文件列表删除         | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-54 | type=1                       | 奖池名单抽屉：分页、listByPool           | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-55 | type=2 投票                    | 绑定投票节目列表 CRUD                  | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-56 | 权限                           | 模板/导入/删除区 `busdriver_edit/del` | ⏭ 跳过（人工）：人工 QA，本轮跳过 |


### D-9 Phase 9：内容管理（人工 QA 重点）


| ID   | 新路由                             | 旧对照                              | 关键权限             | 专项        | 结果  |
| ---- | ------------------------------- | -------------------------------- | ---------------- | --------- | --- |
| D-57 | `/content/announcement`         | `content/announcement`           | `announcement_`* | 校区筛选      | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-58 | `/content/moment/food-weekly`   | `content/moent/foodweekly`       | `foodweekly_*`   | 富文本/图片    | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-59 | `/content/moment/school-life`   | `content/moent/schoollife`       | `schoollife_*`   | 富文本/图片    | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-60 | `/content/article/list`         | `content/article/list`           | `article_*`      | 封面上传、详情预览 | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-61 | `/content/article/category`     | `content/article/category`       | `category_*`     | 分类树       | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-62 | `/content/discussion/list`      | `content/discussion/list`        | `discussion_*`   | 详情抽屉      | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-63 | `/content/discussion/tag`       | `content/discussion/tag`         | `tag_*`          | —         | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-64 | `/content/discussion/comment`   | `content/discussion/comment`     | `comment_*`      | —         | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-65 | `/content/discussion/like-save` | `content/discussion/likeandsave` | `likeandsave_*`  | —         | ⏭ 跳过（人工）：人工 QA，本轮跳过 |


**内容域通用加测**：多语言标题切换、状态变更、无权限时按钮隐藏、CMS 预览 `v-html` 渲染正常。

### D-10 Phase 10：宿舍管理


| ID   | 新路由                           | 旧对照                     | 关键权限                       | 专项        | 结果  |
| ---- | ----------------------------- | ----------------------- | -------------------------- | --------- | --- |
| D-66 | `/dorm/boarding-student`      | `dorm/boarding-student` | —                          | 当前/历史 Tab | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-67 | `/dorm/space/building`        | `dorm/space/building`   | `building-add/edit/delete` | 学校筛选联动    | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-68 | `/dorm/space/floor`           | `dorm/space/floor`      | `floor-`*                  | 楼栋联动      | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-69 | `/dorm/space/room`            | `dorm/space/room`       | `room-add`                 | 跳转床位分配    | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-70 | `/dorm/space/room-assign/:id` | `dorm/space/room/:id`   | —                          | 床位卡片、分配提交 | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-71 | `/dorm/space/attribute`       | `dorm/space/attribute`  | `attribute-*`              | —         | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-72 | `/dorm/space/rule`            | `dorm/space/rule`       | `rule-add/delete`          | 规则表单      | ⏭ 跳过（人工）：人工 QA，本轮跳过 |


### D-11 Phase 11：校医管理（8 路由冒烟重点）


| ID   | 新路由                                 | 旧对照                              | 关键权限                        | 专项                            | 结果  |
| ---- | ----------------------------------- | -------------------------------- | --------------------------- | ----------------------------- | --- |
| D-73 | `/school-doctor/student-record`     | `schoolDoctor/studentRecord`     | —                           | 搜索展开收起（collapsed-rows=1）；档案抽屉 | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-74 | `/school-doctor/medical-info`       | `schoolDoctor/medicalInfo`       | `medicalinfo_add`           | 过敏原/定期用药筛选                    | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-75 | `/school-doctor/regulation`         | `schoolDoctor/regulation`        | —                           | 规章制度表单抽屉                      | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-76 | `/school-doctor/disease-setting`    | `schoolDoctor/diseaseSetting`    | —                           | 疾病设置                          | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-77 | `/school-doctor/visit-record`       | `schoolDoctor/visitRecord`       | —                           | 就诊/待处理 Tab；操作记录弹窗             | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-78 | `/school-doctor/medicine-apply`     | `schoolDoctor/medicineApply`     | `medicationapplication_add` | 家长信息区、提交                      | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-79 | `/school-doctor/infectious-disease` | `schoolDoctor/infectiousDisease` | —                           | —                             | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| D-80 | `/school-doctor/health-report`      | `schoolDoctor/healthReport`      | —                           | 体检报告                          | ⏭ 跳过（人工）：人工 QA，本轮跳过 |


**校医父级别名**：`/isacommunity/schoolDoctor` → `/school-doctor`，侧栏「校医管理」分组不丢失。

---

## E. 跨模块联调回归（P12 §15.13）


| ID   | 场景     | 操作路径                                           | 预期                           | 结果  |
| ---- | ------ | ---------------------------------------------- | ---------------------------- | --- |
| E-01 | 邮件群组   | 创建群组 → 选收件人 → 发件箱撰写引用群组                        | 收件人、字段与旧系统一致                 | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| E-02 | 活动导入导出 | 活动详情 registration Tab 导入票券                     | 模板格式、错误提示与旧页一致               | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| E-03 | 活动导出   | winner / voteInfo / blessing / feedback 各导出一次  | 文件内容、编码正确                    | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| E-04 | 考勤书签   | 收藏 `/isacommunity/attendance/holiday/flow` 旧链接 | 打开新 `/attendance/flow` 且有权访问 | ✅（E2E：`/attendance/holiday/flow`→`/attendance/flow`）；⏭ 旧 isacommunity 前缀书签（人工 QA，本轮跳过） |
| E-05 | 问卷书签   | 旧 `questionnaire/design/:id`                   | 重定向到 edit 路由                 | ✅（E2E shell：design→edit）；⏭ 设计器保存/答卷（人工 QA，本轮跳过） |
| E-06 | 校区联动   | 校车考勤、宿舍、校医页切换校区                                | 下级下拉/列表随校区刷新                 | ⏭ 跳过（人工）：人工 QA，本轮跳过 |
| E-07 | 权限闭环   | 去掉某菜单权限后刷新                                     | 侧栏隐藏 + 直链 403                | ⏭ 跳过（人工）：人工 QA，本轮跳过 |


---

## F. 缺陷记录模板

```text
缺陷 ID：QA-xxx
关联项：D-xx / C-xx / E-xx
模块：
复现步骤：
预期（旧系统）：
实际（admin-web）：
截图/录屏：
严重级别：P0阻塞 / P1功能 / P2体验 / P3文案
```

---

## H. E2E 自动化测试（Playwright）

> 配置与用例：`playwright.config.ts`、`e2e/`。README 有简要说明。

### 何时运行

| 场景 | 命令 | 说明 |
| ---- | ---- | ---- |
| 日常调试 / 看逐步执行 | `npm run test:e2e:ui` | 打开 Playwright **UI Mode**，可选 project、单用例重跑、看 trace |
| CI / 本地一次性跑全量 | `npm run test:e2e` | 无界面；失败后可 `npm run test:e2e:report` 看 HTML 报告 |
| 仅静态门禁后快速冒烟 | `npm run test:e2e -- --project=smoke` | 无需账号，约 10s |

建议在 **A 节 CI 四门 PASS** 后、**B 节人工 QA 前** 跑 E2E；发版前再跑全量（含 `setup` + `chromium`）。

### 前置条件

1. **Node**：`.nvmrc` 为 **22**（≥18）；在 `admin-web` 目录执行 `nvm use`。
2. **依赖**：`npm install`；首次需 `npx playwright install chromium`。
3. **环境变量**：复制 `.env.e2e.example` → `.env.e2e.local`（已 gitignore），填写：
   - `E2E_USERNAME` / `E2E_PASSWORD`（或 `E2E_USER` / `E2E_PASS`）— 须能登录并访问 dashboard。
   - 可选 `PLAYWRIGHT_BASE_URL`（默认 `http://localhost:8100`，与 `vite.config.ts` port 一致）。
4. **Dev 服务**：`playwright.config.ts` 的 `webServer` 会自动 `npm run dev`；本地已有 dev 在 8100 运行时会复用（非 CI）。
5. **登录态**：`setup` project 写 `e2e/.auth/user.json`（4h 内复用）；强制重登：`E2E_FORCE_LOGIN=true`。

### Project 分层

```text
setup（auth.setup.ts）→ smoke（免登录）→ chromium（storageState 已登录，shell.spec.ts）
```

- **无账号**：仅 `smoke` 通过；`shell` / `setup` 中需登录用例 skip。
- **有账号**：`setup` 经登录页 + 滑块验证码（首次约 1～5 分钟）→ `shell` 跑 dashboard / 404 / 书签重定向。

### QA ID ↔ Spec 映射

| QA ID | Spec | 用例名 | 覆盖范围 | 仍须人工 |
| ----- | ---- | ------ | -------- | -------- |
| B-03 | `e2e/smoke.spec.ts` | `protected route redirects to login` | 未登录访问 `/member/student` → 登录页 + redirect 参数 | — |
| B-07 | `e2e/shell.spec.ts` | `unknown route shows 404` | 404 文案展示 | 侧栏/菜单上下文 |
| B-01 | `e2e/shell.spec.ts` + `auth.setup.ts` | `dashboard loads after login` / `authenticate` | 登录后进 dashboard、layout 可见 | 退出、token 持久化细节 |
| D-01 | `e2e/smoke.spec.ts` | `login page renders…` | 账号/密码/登录按钮可见 | 完整登录、验证码边界 |
| D-02 | `e2e/shell.spec.ts` | `dashboard loads after login` | URL 与 layout | 首页 widgets / 数据 |
| C-19 / E-05 | `e2e/shell.spec.ts` | `activity questionnaire design bookmark…` | `/activity/questionnaire/design/:id` → `edit/:id` | 设计器保存、答卷 |
| C-24 / E-04 | `e2e/shell.spec.ts` | `legacy attendance holiday flow bookmark…` | `/attendance/holiday/flow` → `/attendance/flow` | 旧 `/isacommunity/...` 前缀书签、流程页 CRUD |
| A-05 | `e2e/auth.setup.ts` | `authenticate` | 间接验证 OAuth + 菜单可达（需真实后端） | 全业务 API 抽检 |
| A-06 | — | — | E2E 每次独立 context / 可删 `e2e/.auth` 模拟 | 人工无痕习惯 |

**未纳入 E2E（须人工）**：C-01～C-18、C-20～C-23 别名直链与隐藏页交互；D-03～D-80 全模块 CRUD；E-01～E-03、E-06～E-07；B-02、B-04～B-06、B-08。旧 isacommunity 前缀书签因 router 未注册，当前 spec **只测新路由内 redirect**。

### E2E 执行记录（模板）

| 日期 | 命令 | Project | 结果 | 备注 |
| ---- | ---- | ------- | ---- | ---- |
| 2026-06-11 | `npm run test:e2e` | setup | **1/1 PASS** | `authenticate` 复用 `e2e/.auth/user.json`（~3.7s） |
| 2026-06-11 | `npm run test:e2e` | smoke | **2/2 PASS** | 登录页渲染、未登录重定向 |
| 2026-06-11 | `npm run test:e2e` | chromium | **4/4 PASS** | dashboard、404、考勤/问卷书签重定向 |

---

## G. 验收签字条件

**可宣称「重构完成」需同时满足：**


| #   | 条件                                           | 本轮状态（2026-06-11） |
| --- | -------------------------------------------- | ------------------ |
| 1   | A 节 CI 四门全部 PASS；H 节 E2E smoke + shell（有账号时）无 ❌ | ✅ 已满足 |
| 2   | C 节别名/隐藏路由审计无 P0 遗漏          | ✅ 静态审计已满足；C-15～C-18 交互 ⏭ 延后 |
| 3   | D 节全部 ☐ 转为 ✅（或 ⏭ 有书面豁免）                      | ⏭ D-03～D-80 人工项本轮统一跳过，下轮补测 |
| 4   | E 节跨模块回归 7 项全部 ✅                             | ⏭ E-01/E-02/E-03/E-06/E-07 跳过；E-04/E-05 仅 E2E 部分 ✅ |
| 5   | Phase 8 的 D-52～D-56 与旧 `program/detail` 行为一致 | ⏭ 延后（D-52～D-56 本轮跳过） |
| 6   | Phase 9 富文本/上传/预览专项无 P0/P1                   | ⏭ 延后（D-57～D-65 本轮跳过） |
| 7   | 校医 8 路由（D-73～D-80）冒烟无 P0/P1                  | ⏭ 延后（D-73～D-80 本轮跳过） |

> **本轮结论**：自动化门禁（A + H）与静态路由/别名审计（C-01～C-14、C-19～C-24）已通过；**浏览器人工 QA 有意延后**，不构成「重构完成」签字，须下轮将 ⏭ 项补测为 ✅ 或书面豁免后再签 G 节。


---

## 建议执行顺序（约 3～5 人日）

```text
Day 1：A（CI 四门）+ H（test:e2e:ui 或 test:e2e）+ B + C（别名审计）
Day 2：D-01～D-31（基座～考勤）+ E-04
Day 3：D-32～D-56（邮件 + 活动，含项目详情子能力）
Day 4：D-57～D-80（内容 + 宿舍 + 校医）+ E-01～E-07
Day 5：缺陷修复复测 + H 全量回归 + G 节签字
```

