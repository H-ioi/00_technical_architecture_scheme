# isacommunity 重构方案

本仓库内需同时对照两套目录开展工作：

| 角色                 | 路径（相对仓库根）                              | 说明                                                         |
| -------------------- | ----------------------------------------------- | ------------------------------------------------------------ |
| **旧系统参考代码**   | `test/old-test`（Windows 亦可 `test\old-test`） | 业务行为、接口、权限、页面的**对齐依据**，不作为本期交付产物 |
| **重构后的管理后台** | `admin-web`                                     | 本期重构的**落地工程**（Vue3 + `uni-lib`/`uni-ui-lib` 等）   |

**当前进度**：重构已推进到 **Phase 8 活动管理**（主链路已通，**活动项目详情子能力待补齐**，见 §15.9）。`admin-web` 已阶段性落地基座、登录/首页/成员、基础设置、校车、协议、权限、考勤、群发邮件；活动管理已接入活动列表、活动详情、活动项目列表/编辑、奖品列表、投票节目、问卷管理、问卷设计、答卷页与家长学生关联管理、微信/邮箱配置，活动详情内 Tab 已与旧页对齐（含祝福语，**非独立菜单**）。`test/old-test` 另新增 **宿舍管理**、**校医管理**、**校巴考勤** 三块旧方案未覆盖域，已纳入 **Phase 10～11 与 P3 扩展**（见 §2.7）。后续：Phase 8 收尾 → Phase 9 内容 → Phase 10 宿舍 → Phase 11 校医 → Phase 12 收尾。

---

## 〇、方案执行提示（强制遵守）

1. **旧项目 `test/old-test` 为唯一事实来源（路径与对齐方式）**
   - **对照仓库**：旧可运行页面与接口以 **`test/old-test`** 为准（与本仓库根目录相对；PowerShell／资源管理器中可写作 `test\old-test`）。典型目录：`test/old-test/src/views/isacommunity/...` 及同模块下的 **`api`、`mixins`、共用组件**等真实调用链。
   - **开发与接口**：页面功能边界、交互、**接口路径、请求/响应字段、权限码**一律以旧项目代码为准逐项对齐。**开发过程中严禁揣测功能或接口形态**（不凭习惯补字段、不改路径语义、不为“更好用”而自造旧页不存在的操作）。**有疑问必须先查旧项目再动手**；无法在旧代码中印证的能力默认不落地。

2. **组件库 `uni-lib`（发布依赖名 `uni-ui-lib`）：改库必发布、业务项目用 Yarn 拉最新**
   - **组件库源码所在**：本仓库内 **`uni-lib/`** 目录（非 npm 安装目录）。通用 UI/协议能力以 **`uni-lib` 的实现与导出**为准。
   - **若本次迭代改动了 `uni-lib` 源码**：必须在 **`uni-lib` 仓库根目录**执行 **`npm run release`**，按既有流程完成版本递增与发布提交（脚本见 `scripts/publish.mjs` 等）；**不得在只改源码却不 release 的情况下**，让其他人仅靠本地构建猜测版本。
   - **`admin-web` 对齐已发布组件库**：release 完成后，在 **`admin-web`** 目录使用 **Yarn** 将依赖更新到对应版本，例如 **`yarn upgrade uni-ui-lib`**（或 **`yarn upgrade uni-ui-lib@<版本号>`** / 按需调整 `package.json` 后用 **`yarn install`**），确保拉取到**已发布**的构建，而不是长期依赖手工 `yarn link`/本地拷贝导致与 CI、他机不一致。
   - **未改 `uni-lib` 时**：不要重复 release；仅改 **`admin-web` 业务代码**时按常规划分提交即可。

3. **迭代节奏与当前轮次**
   - 方案按阶段（P0～P12 / Phase 0～12）推进；**每完成一块可交付切片**（单业务域、单列表/表单闭环）应在 **`admin-web`** 目录执行 **`yarn lint`、`yarn type-check`、`yarn build`**（以 `package.json` 脚本为准），合并前代码评审。
   - **当前状态**：`admin-web` 中已阶段性落地 **Phase 0～Phase 7**；**当前进行到 Phase 8 活动管理**（活动项目详情内奖品绑定、投票节目绑定、获奖池文件/名单等待补齐）。
   - **当前执行方式**：继续按旧菜单逐项认领 → **先在 `test/old-test` 定位旧页与调用链并完成盘点** → 再在 **`admin-web`** 补齐类型、API、`views`、i18n、路由与 `MENU_PATH_ALIASES`。Phase 8 收尾后再进入 Phase 9 内容；**宿舍 / 校医 / 校巴考勤** 按 §2.7 排期，不提前臆造接口。**严禁跳步、严禁无旧代码依据的新能力**。

## 一、重构目标

本次重构以旧系统 `test/old-test/src/views/isacommunity` 为业务来源，将其重构为一个独立管理后台项目。

新项目基于 `admin-web` 当前架构建设，复用 `uni-lib` 已抽离的表单、表格、搜索、上传、权限、请求、认证等公共能力。

重构后代码中不再保留 `isacommunity` 业务层级。`isacommunity` 仅作为旧代码来源标识，不进入新项目目录、路由模块名、API 模块名和 i18n 模块名。

## 二、重构范围和全量节奏

以下为历史第一轮范围，用于说明首批闭环的形成方式；当前进度以本节上方“当前状态”和第十五章阶段表为准。

第一轮只重构以下模块：

| 模块     | 范围                         | 说明                                                |
| -------- | ---------------------------- | --------------------------------------------------- |
| 登录     | 登录页、认证流程、退出流程   | UI 保留旧项目风格并优化，认证逻辑走 `uni-lib`       |
| 首页     | 首页入口、基础卡片、快捷入口 | 用于承载独立项目首页，不照搬模板 demo               |
| 成员管理 | 学生列表、教师列表           | 来源为旧菜单 `成员管理`，不包含校车下的跟车老师列表 |

第一轮不处理校车管理、协议管理、基础设置、权限管理、考勤管理、内容管理、群发邮件、活动管理等模块，只预留菜单和后续扩展边界。

### 2.1 全量功能拆分

全量重构不按旧目录机械搬迁，而是按后台业务域拆分。每个业务域独立维护 `views`、`api/modules`、`types/modules`、`locales/lang/*/modules`、`router/modules`。

| 阶段 | 业务域         | 主要功能                                                                                                         | 交付目标                                                                          |
| ---- | -------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| P0   | 项目底座       | 登录、退出、路由、权限、菜单、请求、i18n、布局、标签页                                                           | 建立可持续扩展的模板基础                                                          |
| P1   | 首页和成员管理 | 首页概览、学生列表、教师列表                                                                                     | 完成首个完整业务闭环                                                              |
| P2   | 基础设置       | 校区配置、年级配置                                                                                               | 建立成员、校车、考勤等模块的基础数据                                              |
| P3   | 校车管理       | 路线规划、路线运营、异常上报、申请意向、乘车学生、司机、跟车老师、车辆；**扩展：校巴考勤**（旧 `schoolbus/attendance`，见 §2.7） | 完成校车完整业务链；校巴考勤可在 P3 联调后插单补齐                                |
| P4   | 协议管理       | 协议列表、协议详情、协议编辑、发布/停用                                                                          | 完成独立低耦合模块                                                                |
| P5   | 权限管理       | 菜单、角色、部门、用户                                                                                           | 完成后台权限闭环                                                                  |
| P6   | 考勤管理       | 学生考勤、校园考勤、门禁记录、微信 Openid、微信通知、每日考勤、请假、流程、任务、配置、放行条                    | 完成考勤和流程模块                                                                |
| P7   | 群发邮件       | 群组配置、发件箱配置、发件列表                                                                                   | 完成邮件触达模块                                                                  |
| P8   | 活动管理       | 活动列表、活动详情、活动项目、奖品列表、投票节目、家长学生关联、微信/邮箱配置、问卷管理/设计/答卷；**活动项目详情：奖品绑定、投票绑定、获奖池** | **当前进行中**：主菜单页与活动详情 Tab 已对齐；**项目详情子能力待补齐**（§15.9） |
| P9   | 内容管理       | 公告、动态内容、文章、讨论管理                                                                                   | 完成内容运营模块                                                                  |
| P10  | 宿舍管理       | 住宿生（当前/历史）、楼栋/楼层/房间、属性、分配规则、床位分配（隐藏路由）                                        | 对齐 `test/old-test/src/views/isacommunity/dorm`                                  |
| P11  | 校医管理       | 学生档案、医疗信息、规章制度、用药申请、就诊记录、疾病设置、传染病、体检报告                                     | 对齐 `schoolDoctor/` 与 `router/schoolDoctor`                                     |
| P12  | 收尾优化       | 测试、类型补齐、构建优化、遗留样式与路径映射清理                                                                 | 全量稳定交付                                                                      |

### 2.2 重构节奏

每个阶段都按“旧功能盘点 -> 类型/API -> 页面配置 -> 页面实现 -> 权限接入 -> 联调验证 -> 代码清理”的节奏推进。

```text
功能盘点
  -> 确认旧页面功能、接口、权限码、字段含义
  -> 设计新模块命名和目录
  -> 先写 types 和 api
  -> 再写表格、搜索、表单配置
  -> 实现页面和弹窗
  -> 接入路由、菜单、权限、i18n
  -> 联调接口、空状态、错误态、下载上传
  -> 执行 lint、type-check、build
```

### 2.3 阶段节奏要求

| 阶段  | 建议节奏                           | 说明                                                                                                                                        |
| ----- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| P0    | 先行完成                           | 底座不稳定时不进入大规模页面迁移                                                                                                            |
| P1    | 单模块完整闭环                     | 成员管理作为后续模块模板，必须做到代码结构、命名、权限、接口、i18n 全部规范                                                                 |
| P2-P4 | 每次一个业务域                     | 基础设置、校车、协议都属于基础业务能力，优先保证结构一致                                                                                    |
| P5    | 独立评审后实施                     | 权限管理会影响菜单、路由、按钮、数据范围，不能夹在普通页面迁移里顺手做                                                                      |
| P6-P12 | 按阶段顺序滚动推进（**内容置末、宿舍校医后置**） | 默认：考勤 → 邮件 → 活动 → **内容** → **宿舍** → **校医** → 收尾；校巴考勤可插在 P3 之后；若上线急需可单列插单，仍以旧代码对齐为前提 |

### 2.4 旧菜单到新模块映射

新项目菜单划分以旧菜单数据为主要参考，但去掉 `/isacommunity`、`/admin` 等旧路径前缀。

| 一级菜单 | 二级/三级菜单           | 新模块建议                     | 说明                                                      |
| -------- | ----------------------- | ------------------------------ | --------------------------------------------------------- |
| 首页     | -                       | `dashboard`                    | 新路径建议 `/dashboard`                                   |
| 成员管理 | 学生列表                | `member/student`               | 新路径建议 `/member/student`                              |
| 成员管理 | 教师列表                | `member/teacher`               | 新路径建议 `/member/teacher`                              |
| 校车管理 | 路线管理 / 路线规划     | `school-bus/route/plan`        | 对应旧路线规划                                            |
| 校车管理 | 路线管理 / 路线运营     | `school-bus/route/operation`   | 对应旧路线运营                                            |
| 校车管理 | 路线管理 / 异常上报     | `school-bus/route/exception`   | 对应旧异常上报                                            |
| 校车管理 | 学生管理 / 申请意向管理 | `school-bus/student/apply`     | 对应旧申请意向                                            |
| 校车管理 | 学生管理 / 乘车学生管理 | `school-bus/student/order`     | 对应旧乘车学生                                            |
| 校车管理 | 司机管理                | `school-bus/driver`            | 对应旧司机管理                                            |
| 校车管理 | 跟车老师列表            | `school-bus/follow-teacher`    | 旧路径是 `/isacommunity/user/teacher/index`，归属校车管理 |
| 校车管理 | 车辆管理                | `school-bus/car`               | 对应旧车辆管理                                            |
| 校车管理 | 校巴考勤                | `school-bus/attendance`        | 旧 `schoolbus/attendance`；API `/isacommunity/busattendance`；**待迁移** |
| 协议管理 | -                       | `protocol`                     | 独立一级模块                                              |
| 基础设置 | 校区配置                | `base/school`                  | 基础数据                                                  |
| 基础设置 | 年级配置                | `base/grade`                   | 基础数据                                                  |
| 权限管理 | 菜单管理                | `permission/menu`              | 旧 `/admin/menu/index`                                    |
| 权限管理 | 角色管理                | `permission/role`              | 旧 `/admin/role/index`                                    |
| 权限管理 | 部门管理                | `permission/dept`              | 旧 `/admin/dept/index`                                    |
| 权限管理 | 用户管理                | `permission/user`              | 旧 `/admin/isauser/index`                                 |
| 活动管理 | 活动列表                | `activity/list`                | 活动主列表                                                |
| 活动管理 | 活动项目                | `activity/program`             | 活动项目配置                                              |
| 活动管理 | 奖品列表                | `activity/prize`               | 奖品配置                                                  |
| 活动管理 | 投票节目                | `activity/vote-program`        | 投票节目                                                  |
| 活动管理 | 问卷管理                | `activity/questionnaire`       | 问卷                                                      |
| 活动管理 | 家长学生关联管理        | `activity/parent-student`      | 关联关系                                                  |
| 活动管理 | 微信配置                | `activity/wechat-school`       | 微信配置                                                  |
| 活动管理 | 邮箱配置                | `activity/email-school`        | 邮箱配置                                                  |
| 考勤管理 | 学生考勤                | `attendance/student`           | 学生考勤                                                  |
| 考勤管理 | 校园考勤                | `attendance/school`            | 校园考勤                                                  |
| 考勤管理 | 门禁记录                | `attendance/access`            | 门禁记录                                                  |
| 考勤管理 | 微信Openid              | `attendance/wechat`            | 微信身份                                                  |
| 考勤管理 | 微信通知                | `attendance/wechat-notice`     | 微信通知                                                  |
| 考勤管理 | 学生每日考勤            | `attendance/daily`             | 每日考勤                                                  |
| 考勤管理 | 请假管理                | `attendance/holiday`           | 请假流程                                                  |
| 考勤管理 | 流程设计                | `attendance/flow`              | 旧 `/isacommunity/attendance/holiday/flow`；新项目**去掉 `holiday` 段**（与 `menu.ts`、路由一致） |
| 考勤管理 | 任务处理                | `attendance/task`              | 旧 `.../holiday/task`                                     |
| 考勤管理 | 配置管理                | `attendance/config`            | 旧 `.../holiday/config`                                   |
| 考勤管理 | 放行条管理              | `attendance/pass`              | 旧 `.../holiday/pass`                                     |
| 宿舍管理 | 住宿生管理              | `dorm/boarding-student`        | 旧 `dorm/boarding-student`；当前/历史 Tab；**待迁移（P10）** |
| 宿舍管理 | 楼栋管理                | `dorm/space/building`          | 旧 `dorm/space/building`                                  |
| 宿舍管理 | 楼层管理                | `dorm/space/floor`             | 旧 `dorm/space/floor`                                     |
| 宿舍管理 | 房间管理                | `dorm/space/room`              | 旧 `dorm/space/room`                                      |
| 宿舍管理 | 床位分配（隐藏）        | `dorm/space/room-assign/:id`   | 旧 `dorm/space/room/:id` → `room-assigne.vue`             |
| 宿舍管理 | 属性管理                | `dorm/space/attribute`         | 旧 `dorm/space/attribute`                                 |
| 宿舍管理 | 自动分配规则            | `dorm/space/rule`              | 旧 `dorm/space/rule`                                      |
| 校医管理 | 学生档案                | `school-doctor/student-record` | 旧 `/isacommunity/schoolDoctor/studentRecord`；**待迁移（P11）** |
| 校医管理 | 医疗信息                | `school-doctor/medical-info`   | 旧 `.../medicalInfo`                                      |
| 校医管理 | 规章制度                | `school-doctor/regulation`     | 旧 `.../regulation`                                       |
| 校医管理 | 用药申请                | `school-doctor/medicine-apply` | 旧 `.../medicineApply`                                    |
| 校医管理 | 就诊记录                | `school-doctor/visit-record`   | 旧 `.../visitRecord`                                      |
| 校医管理 | 疾病设置                | `school-doctor/disease-setting`| 旧 `.../diseaseSetting`                                   |
| 校医管理 | 传染病管理              | `school-doctor/infectious-disease` | 旧 `.../infectiousDisease`                            |
| 校医管理 | 体检报告                | `school-doctor/health-report`  | 旧 `.../healthReport`                                     |
| 内容管理 | 公告内容                | `content/announcement`         | 公告                                                      |
| 内容管理 | 动态内容 / 一周食谱     | `content/moment/food-weekly`   | 旧目录 `moent` 统一修正为 `moment`                        |
| 内容管理 | 动态内容 / 校园生活     | `content/moment/school-life`   | 校园生活                                                  |
| 内容管理 | 文章管理 / 文章内容     | `content/article/list`         | 文章内容                                                  |
| 内容管理 | 文章管理 / 文章分类     | `content/article/category`     | 文章分类                                                  |
| 内容管理 | 讨论管理 / 内容列表     | `content/discussion/list`      | 讨论内容                                                  |
| 内容管理 | 讨论管理 / 讨论标签     | `content/discussion/tag`       | 讨论标签                                                  |
| 内容管理 | 讨论管理 / 讨论评论     | `content/discussion/comment`   | 评论                                                      |
| 内容管理 | 讨论管理 / 点赞收藏     | `content/discussion/like-save` | 点赞收藏                                                  |
| 群发邮件 | 群组配置                | `email/group`                  | 群组                                                      |
| 群发邮件 | 发件箱配置              | `email/send`                   | 发件箱                                                    |
| 群发邮件 | 发件列表                | `email/outbox`                 | 发件列表                                                  |

### 2.5 每个模块的完成标准

一个模块只有同时满足以下条件才算完成：

- 路由、菜单、权限码、页面标题全部接入。
- 类型全部放入 `src/types/modules`。
- API 全部放入 `src/api/modules`，方法命名使用新业务语义。
- 页面文案全部进入 `src/locales/lang/*/modules`。
- 列表、搜索、表单、上传下载优先使用 `uni-lib`。
- 页面私有组件只放当前 `views/<module>/components`。
- 跨模块复用但不跨项目的能力放 `components/business` 或 `composables`。
- 跨项目通用能力才抽入 `uni-lib`。
- `lint`、`type-check`、`build` 通过。

### 2.5.1 详情与查看态的容器（全局约定）

按**字段数量与信息密度**选择承载方式（新建/轻型编辑仍可优先 `el-dialog`，与列表同屏完成）：

| 体量       | 容器               | 说明                                                                                                 |
| ---------- | ------------------ | ---------------------------------------------------------------------------------------------------- |
| **一般**   | `el-dialog`        | 字段少、一屏内可读全，保持居中弹窗。                                                                 |
| **中等**   | `el-drawer`        | 字段较多、需纵向滚动但不必占满整页；侧滑保留部分列表上下文。                                         |
| **特别多** | **独立路由详情页** | 多分组、长流程、大块富文本等：`router.push` 打开 `/.../detail/:id`（或同级约定路径），避免超大弹层。 |

**考勤请假**（`views/attendance/holiday`）：**查看、新增、编辑**均为中等体量表单，**统一使用 `el-drawer`**（查看可用略窄宽度、编辑略宽，具体见实现）；不再使用居中 `el-dialog` 承载该表单。其它模块对照上表迭代，不在此强制改历史页，但**新迁页面**应遵守。

### 2.6 P2 基础设置落地备忘（问题与注意点）

本节记录 **校区配置 / 年级配置**（字典类型 `order_school`、`isacommunity_enroll_level`，接口 `/publik/dict/item/*`）迁入 `admin-web` 时出现的问题与约定，供后续模块对照。

| 类别                       | 说明                                                                                                                                                                                                                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **旧代码依据**             | 页面与接口以 `test/old-test/src/views/isacommunity/base/school/index.vue`、`grade/index.vue` 及 `api/workorder/order/orderlist.js`（`/publik/dict/item/*`）为准，不臆测字段与 URL。 |
| **新项目落地路径**         | 视图：`views/base/school`、`views/base/grade`；共享逻辑：`views/base/components/dict.vue` + `dict.config.ts`（组件文件名尽量简短）；API：`api/modules/base-dict.ts`；类型：`types/modules/base-dict.ts`；菜单别名：`api/modules/menu.ts` 中 `/isacommunity/base/...` → `/base/...`。        |
| **列表必须用 uni-lib**     | 主列表使用 `UniSearchForm` + `useUniListState` + `UniDataTable`（`request`、`filters`、`@load-success`），风格与成员/协议列表一致；配置集中在 `*.config.ts`，避免手写整块 `el-table`（弹窗内二层表同样优先 `UniDataTable`）。                                                               |
| **分页**                   | 旧接口为全量列表、业务上无需分页时：`UniDataTable` 设 `:pagination="false"`，`request` 返回完整 `data`，**不要**为迁就组件再前端切片分页。                                                                                                                                                  |
| **启用状态列**             | 有启停接口时，优先列类型 `type: 'switch'` + `@switch-change` 调 enable/disable；操作列不再重复「启用/禁用」链接。`action-column` 用**固定 `width`**（勿仅用 `min-width`），避免最后一列被拉满；必要时 `:deep` 收紧 link 按钮 `padding`。                                                    |
| **ElSwitch 误触发 change** | Element Plus `ElSwitch` 在 setup 阶段若 `modelValue` 与 `activeValue`/`inactiveValue` **严格相等**不满足（常见：后端 `status` 为 `1`/`0`，列为 `true`/`false`），会 **emit change** 纠错，导致 **一进页面每行都打接口**。解决办法：数据进表前将 `status` **规范为布尔**（与开关取值一致）。 |
| **数字表单控件**           | 排序、数量等语义为数字的字段，表单用 **`ElInputNumber`**（配合 `min`/`step`/`precision`/`controlsPosition`），列表列可用 `type: 'number'`；提交前注意与旧接口约定（空值仍可为 `''` 或统一数字，需在页面层明确）。                                                                           |
| **i18n**                   | `base.school` / `base.grade` 下补齐 `search`、`actions.search`/`reset` 等与检索条、按钮一致的文案，中英同步注册到 `locales/lang/*/index.ts`。                                                                                                                                               |

后续迁移其它模块时，凡出现 **表格开关列 + 后端非严格布尔**、**无真实分页的全量列表**、**操作列宽度**，可直接套用本节约定。

### 2.7 `test/old-test` 增量盘点（2026-06 校验）

相对方案初稿，`test/old-test/src/views/isacommunity` 顶层除既有模块外，**新增或显著扩充**以下域（须以旧代码为唯一事实来源，不得凭菜单名猜测接口）：

| 旧目录 / 路由 | 说明 | 方案阶段 | `admin-web` 状态 |
| ------------- | ---- | -------- | ---------------- |
| `dorm/` | 住宿生、楼栋/楼层/房间、属性、分配规则、床位分配；API `api/isacommunity/dorm.js`（`/isacommunity/dormitory/*`） | P10 | 未迁移 |
| `schoolDoctor/` | 8 个子模块；独立路由 `router/schoolDoctor/index.js`；需求见 `schoolDoctor/校医需求.md` | P11 | 未迁移 |
| `schoolbus/attendance/` | 校巴考勤列表与详情；API `busattendance.js`；权限 `busattendance_*`；**无静态路由表项**，依赖菜单下发 | P3 扩展 | 未迁移 |

**活动域澄清（避免误判为独立菜单）：**

- **祝福语**：旧实现为活动详情 Tab（`list/detail/tabs/blessinglist.vue`），`admin-web` 已在 `activity/detail` 内实现；`activity/blessing/index.vue` 等为无效副本，**不作为菜单迁移依据**。
- **获奖池名单**：旧实现内嵌于 **活动项目详情**（`program/detail/index.vue` + `lotteryPoolFile.js` / `lotteryPoolList`），非一级菜单；`activity/lotteryPoolList/index.vue` 文件内容不可信，以 **项目详情页** 为准。
- **问卷答卷 / 设计**：管理端以 `questionnaire/edit`、`submissions` 承载；旧 `questionnaire/form`、`templateresult` 多为内嵌或 C 端场景，迁移时对照实际跳转链再定是否保留书签映射。

**旧项目联调注意：** `router/isacommunity/index.js` 中宿舍 building/floor/room 路由**重复注册**，重构时不要照搬；`email/group/index.vue` 近期有大改，Phase 7 联调时以旧页字段与权限码为准逐项核对。

## 三、新项目目录结构

重构后不设置 `views/isacommunity`、`api/modules/isacommunity` 等层级。

```text
admin-web/src/
├── api/
│   ├── index.ts
│   └── modules/
│       ├── auth.ts
│       ├── dashboard.ts
│       ├── member-student.ts
│       └── member-teacher.ts
├── assets/
│   ├── images/
│   └── styles/
├── components/
│   ├── common/
│   └── business/
├── composables/
│   ├── use-auth.ts
│   └── use-dict.ts
├── layouts/
│   ├── index.vue
│   └── components/
│       ├── content.vue
│       ├── header.vue
│       ├── menu-tree.vue
│       ├── sidebar.vue
│       └── tags-view.vue
├── router/
│   ├── index.ts          # createRouter、导航守卫
│   ├── routes.ts         # 聚合导出 routes
│   └── modules/          # 按业务域拆分（与 views 域对应）
│       ├── constant.ts   # 登录、403、404
│       ├── layout.ts     # 主布局及 children 聚合
│       ├── dashboard.ts
│       ├── member.ts
│       ├── activity.ts
│       ├── base.ts
│       ├── school-bus.ts
│       ├── permission.ts
│       ├── attendance.ts
│       ├── email.ts
│       ├── protocol.ts
│       ├── content.ts          # Phase 9
│       ├── dorm.ts             # Phase 10
│       └── school-doctor.ts    # Phase 11
├── stores/
│   └── modules/
│       ├── app.ts
│       ├── user.ts
│       ├── permission.ts
│       └── tags-view.ts
├── types/
│   ├── api.ts
│   └── modules/
│       ├── auth.ts
│       ├── dashboard.ts
│       ├── member-student.ts
│       └── member-teacher.ts
├── views/
│   ├── login/
│   ├── dashboard/
│   └── member/
│       ├── student/
│       │   ├── components/
│       │   ├── list.config.ts
│       │   ├── list.vue
│       │   └── use-list.ts
│       └── teacher/
│           ├── components/
│           ├── list.config.ts
│           ├── list.vue
│           └── use-list.ts
└── locales/
    └── lang/
        └── zh-CN/
            └── modules/
                ├── dashboard.ts
                ├── member-student.ts
                └── member-teacher.ts
```

## 四、组件库使用原则

第一轮重构必须使用 `uni-lib` 承担后台高频业务组件能力。

| 场景                             | 使用方式                                                                                                                                                                                                                                                                |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 列表表格                         | `UniDataTable`                                                                                                                                                                                                                                                          |
| 查询条件                         | `UniSearchForm`                                                                                                                                                                                                                                                         |
| 详情 / 新增 / 编辑表单（含弹窗） | `UniForm`：`schema`、`rules`、选项类字段放在同目录 `list.config.ts`；**多 Tab 聚合页**（如路线规划）主文件为 **`tab.vue`**，配置为 **`tab.config.ts`**。禁止在已能映射为 `UniFormConfig` 的场景下直接使用裸 `el-form`；若组件库暂不支持，须在方案或 PR 中写明例外原因。 |
| 权限控制                         | `v-uni-permission` / `useUniPermission`                                                                                                                                                                                                                                 |
| 请求封装                         | `createUniRequest` 或 `admin-web` 当前 `request` 适配后统一出口                                                                                                                                                                                                         |
| 登录认证                         | `createUniAuth` / 项目 `userStore`                                                                                                                                                                                                                                      |

页面私有 UI 放在对应页面目录的 `components` 下，例如 `views/member/teacher/components`。跨页面复用但不跨项目的能力放在 `components/business`。跨项目可复用能力才进入 `uni-lib`。

`UniSearchForm` 统一负责输出干净查询参数。查询和重置事件都必须过滤空字符串、纯空格、空数组、`null`、`undefined`，字符串统一 `trim` 后再抛给业务页面。页面和 API 层不再重复写空值清理逻辑。

`uni-lib` 组件目录命名同样遵循“目录表达语义，文件表达职责”的规则。对外组件目录下主组件使用 `index.vue`，入口使用 `index.ts`，内部子组件使用短功能名。

```text
uni-lib/src/components/uni-data-table/
├── index.ts
├── index.vue
├── cell.vue
├── toolbar.vue
├── column-settings.vue
├── use-columns.ts
├── use-data.ts
└── use-export.ts
```

不使用 `uni-data-table.vue`、`uni-table-cell.vue`、`use-uni-table-columns.ts` 这类重复目录语义的文件名。

## 五、登录重构方案

登录采用“项目 UI + 组件库认证逻辑”的方式。

### 5.1 项目侧

```text
views/login/
├── login-page.vue
├── components/
│   └── login-form.vue
└── use-login.ts
```

项目侧负责：

- 登录页布局、Logo、背景、文案、语言切换入口。
- 表单校验和提交 loading。
- 登录成功后的跳转。
- 登录失败提示。

### 5.2 组件库侧

`uni-lib` 负责认证协议：

- `login`
- `logout`
- `refreshToken`
- `setTokens`
- `getTokens`
- `clearToken`
- `onTokenChange`
- `onRefreshError`

登录页不直接写 token 存储、请求头注入、401 清理逻辑。

### 5.3 登录流程

```text
输入账号密码
  -> 表单校验
  -> userStore.login()
  -> createUniAuth.login()
  -> 写入 token 和用户信息
  -> 拉取菜单和权限码
  -> 保存授权菜单和允许访问路径
  -> 跳转首页
```

## 六、首页重构方案

首页不继续使用模板 demo 数据，改为独立项目首页。

第一轮首页包含：

- 欢迎区。
- 待办/提醒/今日活动/成员数量等统计卡片。
- 常用入口，如成员管理、校车管理及后续已授权业务模块（实施顺序上以考勤、群发邮件、活动优先，**内容管理置于末段 Phase 9**）。
- 权限演示逻辑移除或改为真实权限控制。

首页接口放在 `api/modules/dashboard.ts`，类型放在 `types/modules/dashboard.ts`。

示例：

```ts
/** 查询首页概览。 */
export const fetchDashboardOverview = () => {
  return request.get<DashboardOverview>('/dashboard/overview')
}
```

## 七、成员管理重构方案

成员管理来源于旧系统：

```text
test/old-test/src/views/isacommunity/member
```

旧菜单范围：

- 学生列表。
- 教师列表。

注意：旧页面 `test/old-test/src/views/isacommunity/user/teacher` 对应旧菜单 `校车管理 / 跟车老师列表`，不归属顶层 `成员管理`。如果继续迁移该页面，新模块应命名为 `school-bus/follow-teacher`，不应命名为 `member`。

成员管理旧页面能力按学生/教师列表分别盘点，第一轮只迁移旧页面真实存在且可运行的能力：

- 关键词搜索。
- 学校筛选。
- 学生列表、教师列表。
- 查询、重置、分页。
- 查看详情，权限码为 `dataform_file_look`。

旧项目学生列表和教师列表未提供新增、编辑、删除、启用、禁用、导入、导出、模板下载等页面按钮能力，第一轮不得凭经验补造这些功能；后续如需新增，必须先确认旧系统来源、后端接口和权限码。

### 7.1 新页面结构

```text
views/member/
├── components/
│   └── detail-dialog.vue
├── student/
│   ├── list.config.ts
│   ├── list.vue
│   └── use-list.ts
└── teacher/
    ├── list.config.ts
    ├── list.vue
    └── use-list.ts
```

### 7.2 页面职责

`student/list.vue`、`teacher/list.vue` 只负责页面组合：

- 顶部标题。
- `UniSearchForm` 查询区。
- `UniDataTable` 表格区。
- 详情弹窗挂载。

各自目录下的 `use-list.ts` 负责页面逻辑：

- 查询参数。
- 列表加载。
- 当前行。
- 详情弹窗控制。

各自目录下的 `list.config.ts` 负责页面配置：

- 搜索 schema。
- 表格 columns。
- 表单 schema。
- 状态选项。
- 学校、年级等业务选项。
- 状态选项。

### 7.3 成员 API

成员接口建议按学生和教师拆分，避免一个 `member.ts` 过大：

```text
api/modules/member-student.ts
api/modules/member-teacher.ts
```

成员列表接口命名示例：

| 旧接口           | 新接口方法         |
| ---------------- | ------------------ |
| `getStudentPage` | `fetchStudentPage` |
| `getTeacherPage` | `fetchTeacherPage` |

API 注释使用精炼单句。

```ts
/** 分页查询教师列表。 */
export const fetchTeacherPage = (params: TeacherListParams) => {
  return request.get<PageResult<TeacherRecord>>('/isacommunity/membership/getTeacherPage', {
    params
  })
}
```

真实路径以后端接口为准。第一轮对接旧后端路径，只保留页面实际用到的列表和选项接口。

### 7.4 成员类型

成员类型按页面拆分：

```text
types/modules/member-student.ts
types/modules/member-teacher.ts
```

核心类型：

```ts
export interface TeacherListParams extends PageQuery {
  keywordssearch?: string
  schoolIds?: string | number
  role?: string
  archived?: string
}

export interface TeacherRecord {
  id: string | number
  schoolName?: string
  isaTeacherCode?: string
  fullName?: string
  gender?: string
  nationalities?: string
  phoneNumber?: string
  email?: string
  role?: string
  archived?: string
  createTime?: string
  teacherIdInt?: string | number
}
```

复杂字段可写短注释，普通字段不逐个解释。

### 7.5 搜索表单

使用 `UniSearchForm`。

成员搜索字段必须与旧项目页面和接口字段对齐，不按新项目主观改名。

学生列表搜索字段：

- `keywordssearch`：关键词。
- `schoolIds`：校区。
- `yearGroupName`：年级。
- `form`：班级。
- `dormitoryStatus`：住宿。
- `busStatus`：校巴。
- `studentStatus`：状态。

教师列表搜索字段：

- `keywordssearch`：关键词。
- `schoolIds`：校区。
- `role`：职位。
- `archived`：状态。

搜索表单只产出查询条件，不直接请求接口。

空搜索字段不传给后端。该规则由 `UniSearchForm` 统一控制，业务页面只接收清理后的查询对象并刷新表格。

### 7.6 表格

使用 `UniDataTable`。

学生列按旧接口字段展示：校区、学号、中文名、英文名、年级、班级、校巴、住宿、状态。

教师列按旧接口字段展示：校区、工号、姓名、性别、国籍、手机号、邮箱、职位、状态、创建时间。

列表表格默认使用 `UniDataTable` 的自动最大高度计算能力，让表体内部滚动，避免外层页面被长列表撑出浏览器级滚动条；特殊页面可通过 `maxHeight` 显式覆盖。

日期列使用 `datetime` 类型。状态使用 `tag` 或枚举映射，不再通过 `formatData()` 改写原始数据。只有存在 `dataform_file_look` 权限时显示查看操作列。

### 7.7 详情

详情弹窗优先使用 `UniForm` 的 `mode: 'view'`。

不再手写 `v-for tabletitle` 详情布局。

## 八、权限设计

第一轮沿用旧系统权限语义，但代码改成 `uni-lib` 权限能力。

成员管理旧页面真实使用的按钮权限：

| 操作     | 权限码               |
| -------- | -------------------- |
| 查看详情 | `dataform_file_look` |

按钮示例：

```vue
<el-button v-uni-permission="'dataform_file_look'" type="primary">
  查看
</el-button>
```

业务逻辑中使用 `useUniPermission()` 判断，不直接读取权限 store。

## 九、菜单和路由

第一轮菜单按当前系统截图建立基础结构，但只开放已重构模块。

菜单建议（全量规划；**仅已重构模块对接路由与 `MENU_PATH_ALIASES`**）：

```text
首页
成员管理
校车管理          # 含校巴考勤（待迁移）
协议管理
基础设置
权限管理
考勤管理
群发邮件
活动管理
内容管理          # Phase 9
宿舍管理          # Phase 10，旧代码已存在
校医管理          # Phase 11，旧代码已存在
```

第一轮路由：

```text
/dashboard
/member/student
/member/teacher
/login
```

未重构菜单可以先隐藏、禁用或仅保留后续规划，不接入空页面。

## 十、样式和布局

整体布局基于 `admin-web/src/layouts` 实现。导航结构和核心操作习惯延续旧系统，页面内容区域可以结合 `admin-web` 与 `uni-lib` 做 UX 优化。

重构原则：

- 保留旧系统主导航结构和用户操作路径。
- 保留旧系统菜单分组、主要入口、按钮操作顺序和弹窗操作方式。
- 保留旧系统主要配色和菜单选中态。
- 顶部用户下拉保留旧系统“修改密码、退出系统”入口，新增“主题设置”入口并通过 `uni-lib` 的 `UniThemeSettings` 抽屉调整主题。
- 内容区域不强制照搬旧 UI，可按用户习惯优化查询区、表格区、表单区和详情区。
- 允许做间距、对齐、响应式、空态、加载态、按钮层级等 UX 微调。
- 不为追求模板统一而改变用户熟悉的模块入口和操作顺序。

视觉方向采用旧系统风格：

- 左侧菜单白底。
- 深蓝色选中态。
- 菜单图标和文字保持清晰间距。
- 内容区优先采用清晰的“标题 + 查询 + 表格 + 操作”结构，不强制复刻旧样式。
- 登录页保留旧项目品牌氛围并优化响应式。

可优化项：

- 内容区卡片层级和留白。
- 查询区字段间距统一。
- 表格 loading、空态、分页位置统一。
- 批量按钮禁用态更明确。
- 弹窗宽度和表单栅格更稳定。
- 长文本、日期、状态、枚举展示更清晰。
- 移除旧系统无效样式、调试样式和重复覆盖。

项目级样式放在 `admin-web/src/assets/styles`。不把旧项目全局样式整包搬入。

## 十一、页面命名规范

页面和页面私有组件命名保持简洁，目录已经表达业务域时，文件名不重复业务名前缀。

该规则适用于 `views`、`layouts`、`components`、`uni-lib/src/components` 等所有目录。目录名已经表达上下文时，文件名只表达职责，不再重复目录语义。

推荐：

```text
views/member/
├── components/
│   └── detail-dialog.vue
└── teacher/
    ├── list.vue
    ├── list.config.ts
    └── use-list.ts
```

不推荐：

```text
views/member/teacher/
├── member-list-page.vue
└── components/
    ├── member-form-dialog.vue
    ├── member-detail-dialog.vue
    └── member-import-dialog.vue
```

命名规则：

- 列表页使用 `list.vue`。
- 详情页使用 `detail.vue`。
- 编辑页使用 `edit.vue`。
- 新增页使用 `create.vue`。
- 页面私有弹窗使用 `form-dialog.vue`、`detail-dialog.vue`、`import-dialog.vue` 等功能名。
- 第一轮成员管理只保留 `detail-dialog.vue`，不创建旧页面不存在的 `form-dialog.vue`、`import-dialog.vue`。
- 页面组合式逻辑使用 `use-list.ts`，页面配置使用 `list.config.ts`。
- 页面目录已表达业务语义时，配置函数和页面方法也只保留职责名，例如 `createSearchConfig`、`createColumns`、`createDetailConfig`、`loadData`，不写 `createStudentColumns`、`loadStudents`。
- 页面目录名使用业务域表达模块语义，文件名尽量表达页面职责。
- 布局入口使用 `layouts/index.vue`，布局子组件使用 `header.vue`、`sidebar.vue`、`content.vue`、`tags-view.vue`、`menu-tree.vue`。
- 组件库对外组件使用 `index.vue` + `index.ts`，组件内部文件使用 `cell.vue`、`toolbar.vue`、`column-settings.vue` 等短功能名。
- 组件库目录内组合式逻辑使用 `use-columns.ts`、`use-data.ts`、`use-export.ts` 等短职责名。

不推荐：

```text
layouts/admin-layout.vue
layouts/components/layout-header.vue
uni-lib/src/components/uni-form/uni-form.vue
uni-lib/src/components/uni-data-table/uni-table-cell.vue
uni-lib/src/components/uni-data-table/use-uni-table-columns.ts
```

## 十二、API 和注释规范

API 文件必须使用 TypeScript，并为每个接口方法添加精炼注释。

```ts
/** 分页查询教师列表。 */
export const fetchTeacherPage = (params: TeacherListParams) => {
  return request.get<PageResult<TeacherRecord>>('/isacommunity/membership/getTeacherPage', {
    params
  })
}
```

全局关键逻辑保留短注释：

```ts
// 登录失效后清理认证状态。
if (status === 401) {
  userStore.resetAuth()
}
```

注释规则：

- 必要位置写。
- 单句说明意图。
- 不解释简单实现。
- 不写大段背景说明。
- 不保留调试注释和无效注释。

## 十三、请求和响应处理

页面不直接处理旧系统的 `res.data.success`。

推荐由 `request.ts` 统一处理：

- token 注入。
- 业务错误码。
- 401 登录失效。
- 403 权限不足。
- blob 下载响应。
- 错误提示。

若第一轮仍接旧后端响应结构，可在请求层或 API 层做兼容，页面只接收业务数据。

## 十四、菜单渲染和鉴权重构

旧系统菜单和鉴权主要集中在 Vue2 路由守卫、Vuex、AVUE 标签页和页面内 `permissions[...]` 判断。新项目改为 Vue Router 4、Pinia、递归菜单组件、`uni-lib` 权限指令和认证服务。

### 14.1 旧系统逻辑处理

旧系统逻辑保留思路，不保留实现：

| 旧逻辑                                  | 新实现                                  |
| --------------------------------------- | --------------------------------------- |
| `store.getters.access_token` 判断登录态 | `userStore.isLoggedIn`                  |
| `meta.isAuth === false` 白名单          | `whiteList` + 路由 `meta.public`        |
| `permissions[...]` 页面按钮判断         | `v-uni-permission` / `useUniPermission` |
| AVUE tag 添加                           | `tags-view` store                       |
| `canEnterPage` 路由跳转判断             | 路由 meta + permission store            |
| 多登录入口跳转                          | 项目登录页 + 可配置 redirect            |
| 外链菜单打开新窗口                      | 菜单 meta 标记 external                 |
| 锁屏逻辑                                | 第一轮不迁移，后续单独评估              |

### 14.2 菜单数据来源和兼容原则

菜单采用“旧菜单接口是权限源，本地路由是前端实现源”的方式。

当前重构项目仍复用旧接口 `/upms/menu/user` 判断用户可见菜单。接口返回的菜单树决定：

- 哪些菜单显示在左侧。
- 哪些页面路径允许访问。
- 菜单标题可按接口返回覆盖。
- 菜单节点中的 `permission`、`permissions`、`authority` 可补充按钮/业务权限码。

本地路由 `src/router/routes.ts`（由 `router/modules/*` 聚合）/ `router.getRoutes()` 决定：

- 页面组件注册。
- `meta.titleKey`、`meta.activeMenu`、`meta.hidden` 等前端行为。
- 菜单 `icon`。图标必须使用本地路由 `meta.icon`，不要使用旧接口返回的 icon 覆盖。

不要再用本地静态菜单模拟权限，也不要请求菜单接口后丢弃响应。否则用户知道 URL 时可能绕过菜单权限访问页面。

```text
登录成功
  -> 拉取用户信息
  -> 拉取 /upms/menu/user
  -> 将旧菜单 path/url 映射到新路由 path
  -> 用 router.getRoutes() 补充本地 route meta
  -> permissionStore 保存菜单、允许访问路径、权限码
  -> 侧边栏递归渲染菜单
```

当前实现位置：

- `src/api/modules/menu.ts`：请求旧菜单接口，做路径兼容和菜单标准化。
- `src/router/index.ts`：`beforeEach` 中调用 `menuApi.user.get(router.getRoutes())` 拉取菜单与可访问路径，避免 `menu.ts` 直接导入路由表造成循环依赖。
- `src/stores/modules/permission.ts`：保存 `menus`、`allowedPaths`、`permissionCodes`。

### 14.2.1 旧路径到新路径映射

旧系统菜单路径包含 `/isacommunity` 和旧页面层级，新项目路由已去掉这些旧层级。必须在 `src/api/modules/menu.ts` 的 `MENU_PATH_ALIASES` 中维护旧路径到新路径的映射。

完整旧菜单映射：

| 旧菜单层级                         | 旧菜单路径                                           | 新路由 / 新模块                                                  |
| ---------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------- |
| 首页                               | `/isacommunity/home/index`                           | `/dashboard`                                                     |
| 成员管理                           | `/isacommunity/member`                               | `/member`                                                        |
| 成员管理 / 学生列表                | `/isacommunity/member/student/index`                 | `/member/student`                                                |
| 成员管理 / 教师列表                | `/isacommunity/member/teacher/index`                 | `/member/teacher`                                                |
| 校车管理                           | `/isacommunity/schoolbus`                            | `/school-bus`                                                    |
| 校车管理 / 路线管理                | `/isacommunity/schoolbus/route`                      | `/school-bus/route`                                              |
| 校车管理 / 路线管理 / 路线规划     | `/isacommunity/schoolbus/route/plan/index`           | `/school-bus/route/plan`（页面 `tab.vue`，配置 `tab.config.ts`） |
| 校车管理 / 路线管理 / 路线运营     | `/isacommunity/schoolbus/route/operation/index`      | `/school-bus/route/operation`                                    |
| 校车管理 / 路线管理 / 异常上报     | `/isacommunity/schoolbus/route/exception/index`      | `/school-bus/route/exception`                                    |
| 校车管理 / 学生管理                | `/isacommunity/schoolbus/student`                    | `/school-bus/student`                                            |
| 校车管理 / 学生管理 / 申请意向管理 | `/isacommunity/schoolbus/student/apply/index`        | `/school-bus/student/apply`                                      |
| 校车管理 / 学生管理 / 乘车学生管理 | `/isacommunity/schoolbus/student/order/index`        | `/school-bus/student/order`                                      |
| 校车管理 / 司机管理                | `/isacommunity/schoolbus/driver/index`               | `/school-bus/driver`                                             |
| 校车管理 / 跟车老师列表            | `/isacommunity/user/teacher/index`                   | `/school-bus/follow-teacher`                                     |
| 校车管理 / 车辆管理                | `/isacommunity/schoolbus/car/index`                  | `/school-bus/car`                                                |
| 校车管理 / 校巴考勤                | `/isacommunity/schoolbus/attendance/index`（或菜单实际 path） | `/school-bus/attendance`（**待接入**）                    |
| 协议管理                           | `/isacommunity/protocol/index`                       | `/protocol`                                                      |
| 基础设置                           | `/isacommunity/base`                                 | `/base`                                                          |
| 基础设置 / 校区配置                | `/isacommunity/base/school/index`                    | `/base/school`                                                   |
| 基础设置 / 年级配置                | `/isacommunity/base/grade/index`                     | `/base/grade`                                                    |
| 权限管理                           | `/admin`                                             | `/permission`                                                    |
| 权限管理 / 菜单管理                | `/admin/menu/index`                                  | `/permission/menu`                                               |
| 权限管理 / 角色管理                | `/admin/role/index`                                  | `/permission/role`                                               |
| 权限管理 / 部门管理                | `/admin/dept/index`                                  | `/permission/dept`                                               |
| 权限管理 / 用户管理                | `/admin/isauser/index`                               | `/permission/user`                                               |
| 活动管理                           | `/isacommunity/activity`                             | `/activity`                                                      |
| 活动管理 / 活动列表                | `/isacommunity/activity/list/index`                  | `/activity/list`                                                 |
| 活动管理 / 活动项目                | `/isacommunity/activity/program/index`               | `/activity/program`                                              |
| 活动管理 / 奖品列表                | `/isacommunity/activity/prize/index`                 | `/activity/prize`                                                |
| 活动管理 / 投票节目                | `/isacommunity/activity/voteprogram/index`           | `/activity/vote-program`                                         |
| 活动管理 / 问卷管理                | `/isacommunity/activity/questionnaire/index`         | `/activity/questionnaire`                                        |
| 活动管理 / 家长学生关联管理        | `/isacommunity/activity/parentstudent/index`         | `/activity/parent-student`                                       |
| 活动管理 / 微信配置                | `/isacommunity/activity/wechatSchool/index`          | `/activity/wechat-school`                                        |
| 活动管理 / 邮箱配置                | `/isacommunity/activity/emailSchool/index`           | `/activity/email-school`                                         |
| 考勤管理                           | `/isacommunity/attendance`                           | `/attendance`                                                    |
| 考勤管理 / 学生考勤                | `/isacommunity/attendance/student/index`             | `/attendance/student`                                            |
| 考勤管理 / 校园考勤                | `/isacommunity/attendance/school/index`              | `/attendance/school`                                             |
| 考勤管理 / 门禁记录                | `/isacommunity/attendance/access/index`              | `/attendance/access`                                             |
| 考勤管理 / 微信Openid              | `/isacommunity/attendance/wechat/index`              | `/attendance/wechat`                                             |
| 考勤管理 / 微信通知                | `/isacommunity/attendance/wechatnotice/index`        | `/attendance/wechat-notice`                                      |
| 考勤管理 / 学生每日考勤            | `/isacommunity/attendance/index`                     | `/attendance/daily`                                              |
| 考勤管理 / 请假管理                | `/isacommunity/attendance/holiday/index`             | `/attendance/holiday`                                            |
| 考勤管理 / 流程设计                | `/isacommunity/attendance/holiday/flow`              | `/attendance/flow`（非 `/attendance/holiday/flow`）              |
| 考勤管理 / 任务处理                | `/isacommunity/attendance/holiday/task`              | `/attendance/task`                                               |
| 考勤管理 / 配置管理                | `/isacommunity/attendance/holiday/config`            | `/attendance/config`                                             |
| 考勤管理 / 放行条管理              | `/isacommunity/attendance/holiday/pass`              | `/attendance/pass`                                               |
| 宿舍管理 / 住宿生管理              | `/isacommunity/dorm/boarding-student/index`（以菜单为准） | `/dorm/boarding-student`（**待接入**）                        |
| 宿舍管理 / 楼栋管理                | `/isacommunity/dorm/space/building`                  | `/dorm/space/building`（**待接入**）                             |
| 宿舍管理 / 楼层管理                | `/isacommunity/dorm/space/floor`                     | `/dorm/space/floor`（**待接入**）                                |
| 宿舍管理 / 房间管理                | `/isacommunity/dorm/space/room`                      | `/dorm/space/room`（**待接入**）                                 |
| 宿舍管理 / 床位分配（隐藏）        | `/isacommunity/dorm/space/room/:id`                  | `/dorm/space/room-assign/:id`（**待接入**）                      |
| 宿舍管理 / 属性管理                | `/isacommunity/dorm/space/attribute`                 | `/dorm/space/attribute`（**待接入**）                            |
| 宿舍管理 / 自动分配规则            | `/isacommunity/dorm/space/rule`                      | `/dorm/space/rule`（**待接入**）                                 |
| 校医管理 / 学生档案                | `/isacommunity/schoolDoctor/studentRecord`           | `/school-doctor/student-record`（**待接入**）                    |
| 校医管理 / 医疗信息                | `/isacommunity/schoolDoctor/medicalInfo`             | `/school-doctor/medical-info`（**待接入**）                      |
| 校医管理 / 规章制度                | `/isacommunity/schoolDoctor/regulation`              | `/school-doctor/regulation`（**待接入**）                        |
| 校医管理 / 用药申请                | `/isacommunity/schoolDoctor/medicineApply`           | `/school-doctor/medicine-apply`（**待接入**）                    |
| 校医管理 / 就诊记录                | `/isacommunity/schoolDoctor/visitRecord`             | `/school-doctor/visit-record`（**待接入**）                      |
| 校医管理 / 疾病设置                | `/isacommunity/schoolDoctor/diseaseSetting`          | `/school-doctor/disease-setting`（**待接入**）                   |
| 校医管理 / 传染病管理              | `/isacommunity/schoolDoctor/infectiousDisease`       | `/school-doctor/infectious-disease`（**待接入**）                |
| 校医管理 / 体检报告                | `/isacommunity/schoolDoctor/healthReport`            | `/school-doctor/health-report`（**待接入**）                     |
| 内容管理                           | `/isacommunity/content`                              | `/content`                                                       |
| 内容管理 / 公告内容                | `/isacommunity/content/announcement/index`           | `/content/announcement`                                          |
| 内容管理 / 动态内容                | `/isacommunity/content/moent`                        | `/content/moment`                                                |
| 内容管理 / 动态内容 / 一周食谱     | `/isacommunity/content/moent/foodweekly/index`       | `/content/moment/food-weekly`                                    |
| 内容管理 / 动态内容 / 校园生活     | `/isacommunity/content/moent/schoollife/index`       | `/content/moment/school-life`                                    |
| 内容管理 / 文章管理                | `/isacommunity/content/article`                      | `/content/article`                                               |
| 内容管理 / 文章管理 / 文章内容     | `/isacommunity/content/article/list/index`           | `/content/article/list`                                          |
| 内容管理 / 文章管理 / 文章分类     | `/isacommunity/content/article/category/index`       | `/content/article/category`                                      |
| 内容管理 / 讨论管理                | `/isacommunity/content/discussion`                   | `/content/discussion`                                            |
| 内容管理 / 讨论管理 / 内容列表     | `/isacommunity/content/discussion/list/index`        | `/content/discussion/list`                                       |
| 内容管理 / 讨论管理 / 讨论标签     | `/isacommunity/content/discussion/tag/index`         | `/content/discussion/tag`                                        |
| 内容管理 / 讨论管理 / 讨论评论     | `/isacommunity/content/discussion/comment/index`     | `/content/discussion/comment`                                    |
| 内容管理 / 讨论管理 / 点赞收藏     | `/isacommunity/content/discussion/likeandsave/index` | `/content/discussion/like-save`                                  |
| 群发邮件                           | `/isacommunity/email`                                | `/email`                                                         |
| 群发邮件 / 群组配置                | `/isacommunity/email/group`                          | `/email/group`                                                   |
| 群发邮件 / 发件箱配置              | `/isacommunity/email/send/index`                     | `/email/send`                                                    |
| 群发邮件 / 发件列表                | `/isacommunity/email/outgo/index`                    | `/email/outbox`                                                  |

当前代码已接入首页、成员、基础设置、校车（**不含校巴考勤**）、协议、权限、考勤、群发邮件和活动管理相关映射。活动管理主菜单页、活动详情、问卷设计/答卷等已有本地路由；微信/邮箱配置已拆为独立页面。

**`MENU_PATH_ALIASES` 待登记（迁移对应模块时同步写入 `menu.ts`）：**

- **P9 内容管理**：`/isacommunity/content/**` 全表（见上表）。
- **P10 宿舍管理**：`/isacommunity/dorm/**`。
- **P11 校医管理**：`/isacommunity/schoolDoctor/**`。
- **P3 扩展校巴考勤**：`/isacommunity/schoolbus/attendance/**` 或后端实际下发的 busattendance 路径（以菜单接口为准）。
- **活动可选书签**（若生产仍下发）：`/isacommunity/activity/questionnaire/form`、`.../templateresult` → 映射到现有 `questionnaire/edit` 或 `submissions`，须对照旧跳转链再定。

**考勤路径约定：** 请假列表仍为 `/attendance/holiday`；流程/任务/配置/放行条在 `admin-web` 中为 `/attendance/flow`、`/task`、`/config`、`/pass`。`menu.ts` 已对旧 `.../holiday/flow` 等做映射，并保留 `/attendance/holiday/*` → 新路径的**兼容重定向**（见 `router/modules/attendance.ts`）。

后续每迁移一个旧菜单入口，都必须同步补充：

- 本地 `constantRoutes` 中的新路由。
- `MENU_PATH_ALIASES` 中旧路径到新路径的映射。
- 页面按钮权限码使用 `v-uni-permission` 或 `useUniPermission()`。

如果接口菜单路径没有映射到本地路由，该菜单不会显示，也不会进入 `allowedPaths`。

### 14.3 标准菜单结构

菜单和路由统一使用标准结构。

```ts
export interface AppMenuRecord {
  path: string
  name: string
  meta: AppRouteMeta
  children?: AppMenuRecord[]
}
```

字段约定：

- `path` 使用映射后的新项目路由路径。
- `name` 优先使用本地路由 `name`。
- `meta` 以本地路由 meta 为主，接口只允许覆盖菜单标题。
- `meta.icon` 使用本地路由配置。
- `children` 由旧接口菜单树递归转换而来。

### 14.4 菜单和本地路由匹配

第一轮不根据接口动态注册组件路由。页面路由由本地 `constantRoutes` 注册，菜单接口只做授权和显示过滤。

生成规则：

- 后端返回菜单树。
- 前端按 `MENU_PATH_ALIASES` 把旧 path/url 转成新路由 path。
- 前端用 `router.getRoutes()` 查找本地路由。
- 无组件的父级菜单只作为分组。
- 未匹配本地路由的菜单不显示，不进入 `allowedPaths`。
- 隐藏路由不显示在菜单中。
- 详情页等隐藏路由通过 `meta.activeMenu` 复用列表页权限。

### 14.5 侧边栏渲染

侧边栏不再硬编码菜单。

新侧边栏结构：

```text
sidebar.vue
  -> menu-tree.vue
```

渲染规则：

- 从 `permissionStore.menuRoutes` 读取菜单。
- 递归渲染 `el-menu-item` 和 `el-sub-menu`。
- `hidden` 菜单不显示。
- 无权限菜单不显示。
- `activeMenu` 用于详情页高亮所属列表菜单。
- 外链菜单点击后新窗口打开。

### 14.6 鉴权流程

路由守卫按以下顺序执行：

```text
设置页面标题
  -> 判断白名单
  -> 判断登录态
  -> 首次进入时拉菜单和权限
  -> 保存授权菜单和允许访问路径
  -> 校验路由权限
  -> 写入 tags-view
  -> 放行
```

关键点：

- 未登录访问业务页跳转 `/login?redirect=xxx`。
- 已登录访问 `/login` 跳转首页。
- 菜单和权限只在首次进入或刷新后加载一次。
- 普通业务页必须存在于 `permissionStore.allowedPaths`。
- 隐藏详情页使用 `activeMenu` 对应路径做权限校验。
- 退出登录必须清空 token、用户信息、菜单、权限码、tags-view。
- 401 由请求层触发退出和跳转登录。
- 403 跳转无权限页。

### 14.7 权限码使用

权限分三层：

| 类型         | 用法                    | 示例                 |
| ------------ | ----------------------- | -------------------- |
| 路由权限     | `route.meta.permission` | `member:view`        |
| 按钮权限     | `v-uni-permission`      | `dataform_file_look` |
| 业务逻辑权限 | `useUniPermission()`    | 查看前判断           |

第一轮允许暂时沿用旧权限码，但新代码不直接读 `permissions[...]`。

### 14.8 Store 职责

`userStore`：

- token。
- 用户信息。
- 登录。
- 退出。
- 清理认证状态。

`permissionStore`：

- 菜单树。
- 权限码。
- 菜单权限加载状态。
- `hasPermission()`。
- `canAccessPath()`。
- 允许访问路径 `allowedPaths`。
- 清理权限状态。

`tagsViewStore`：

- 已打开页面。
- 固定页签。
- 关闭页签。
- 退出时清空。

### 14.9 组件库边界

菜单渲染不进入 `uni-lib`，因为不同项目布局和菜单样式会不同。

进入 `uni-lib` 的是：

- `createUniAuth`。
- `createUniRequest`。
- `v-uni-permission`。
- `useUniPermission`。
- 权限配置注入协议。
- `UniThemeSettings`。
- `setupUniTheme` / `applyUniTheme`，统一覆盖 Element Plus 和项目级 CSS 变量。

保留在 `admin-web` 的是：

- 侧边栏 UI。
- 菜单递归组件。
- 旧菜单路径映射。
- 菜单接口。
- 权限 store。
- tags-view。

## 十五、全量功能重构顺序和节奏

全量重构按“基座优先、低风险 CRUD 先行、复杂流程后置”的节奏推进。当前已推进到 **Phase 8 活动管理**（主链路已通，项目详情子能力待补齐）；Phase 0～7 进入联调修正；后续 **Phase 9 内容** → **Phase 10 宿舍** → **Phase 11 校医** → **Phase 12 收尾**。

| 阶段      | 模块                 | 重构内容                                                                                      | 目标                     |
| --------- | -------------------- | --------------------------------------------------------------------------------------------- | ------------------------ |
| Phase 0   | 基座准备             | 路由、菜单、权限、请求、字典、下载、主题、布局                                                | 建立可复制页面范式       |
| Phase 1   | 登录、首页、成员管理 | 登录认证、首页概览、学生列表、教师列表                                                        | 完成第一条业务闭环       |
| Phase 2   | 基础设置             | 校区配置、年级配置                                                                            | 先稳定基础字典和筛选来源 |
| Phase 3   | 校车管理             | 路线规划、路线运营、异常上报、申请意向、乘车学生、司机、跟车老师、车辆；**校巴考勤（扩展）**  | 完成校车完整业务链       |
| Phase 4   | 协议管理             | 协议列表、协议详情、协议配置                                                                  | 独立迁移低耦合模块       |
| Phase 5   | 权限管理             | 菜单、角色、部门、用户                                                                        | 完成后台权限闭环         |
| Phase 6   | 考勤管理             | 学生考勤、校园考勤、门禁记录、微信 Openid、微信通知、每日考勤、请假、流程、任务、配置、放行条 | 迁移考勤和流程链路       |
| Phase 7   | 群发邮件             | 群组配置、发件箱配置、发件列表                                                                | 阶段性完成，进入联调修正 |
| Phase 8   | 活动管理             | 主菜单页与活动详情 Tab 已对齐；**活动项目详情：奖品/投票绑定、获奖池文件与名单待补齐**        | **当前进行中**           |
| Phase 9   | 内容管理             | 公告、动态内容、文章、讨论管理                                                                | 迁移内容发布和互动模块   |
| Phase 10  | 宿舍管理             | 住宿生、空间管理、属性与分配规则、床位分配                                                    | 对齐 `dorm/`             |
| Phase 11  | 校医管理             | 学生档案、医疗信息、就诊、用药、传染病、体检等 8 子模块                                       | 对齐 `schoolDoctor/`     |
| Phase 12  | 收尾优化             | 测试、类型补齐、构建优化、遗留样式与路径映射清理                                              | 全量稳定交付             |

### 15.1 Phase 0：基座准备

先完成以下公共底座：

- 请求层统一处理 token、错误码、401、403、blob。
- 权限层统一支持菜单权限、按钮权限、JS 权限判断。
- 字典层统一学校、状态、角色、模块等选项来源。
- 下载工具统一处理导出和模板下载。
- 布局层完成旧系统视觉风格适配。
- 路由层支持动态菜单和页面缓存。

### 15.2 Phase 1：登录、首页、成员管理

第一轮交付必须形成完整闭环：

- 登录页可登录、退出、登录失效清理。
- 右上角用户下拉可修改密码、打开主题设置抽屉、退出系统。
- 首页替换模板 demo 内容。
- 学生列表可查询、重置、分页、查看详情。
- 教师列表可查询、重置、分页、查看详情。
- 成员页面全部使用 `uni-lib` 表格、搜索和详情表单能力。

### 15.3 Phase 2：基础设置

第二轮先迁移基础设置：

- 校区配置。
- 年级配置。

该阶段完成后，后续业务模块不再写临时学校和年级选项。

### 15.4 Phase 3：校车管理

校车管理按旧菜单顺序迁移：

- 路线管理：路线规划、路线运营、异常上报。
- 学生管理：申请意向管理、乘车学生管理。
- 司机管理。
- 跟车老师列表。
- 车辆管理。
- **校巴考勤**（扩展）：旧 `schoolbus/attendance/index.vue`，API `api/isacommunity/busattendance.js`；权限 `busattendance_add` / `edit` / `del`；可与 P3 主体联调后插单。

该阶段重点验证多级菜单、多表格、多弹窗、多选项联动。乘车意向/订单表单在 `admin-web` 以 **弹窗** 承载，不必复刻旧独立 form 路由（见 §2.5.1）。

### 15.5 Phase 4：协议管理

协议管理独立迁移：

- 协议列表。
- 协议详情。
- 协议新增编辑。
- 协议启用禁用。

若协议存在富文本，先做项目内封装，稳定后再评估是否抽到 `uni-lib`。

### 15.6 Phase 5：权限管理

权限管理按旧后台管理菜单迁移：

- 菜单管理。
- 角色管理。
- 部门管理。
- 用户管理。

该阶段需要和菜单渲染、按钮权限、数据权限一起评审。

### 15.7 Phase 6：考勤管理

考勤管理按旧菜单顺序迁移：

1. 学生考勤。
2. 校园考勤。
3. 门禁记录。
4. 微信 Openid。
5. 微信通知。
6. 学生每日考勤。
7. 请假管理。
8. 流程设计。
9. 任务处理。
10. 配置管理。
11. 放行条管理。

**请假管理（`/attendance/holiday`）对齐说明**：旧菜单路径对应 **`test/old-test/src/views/isacommunity/attendance/holiday/index.vue`**，该页为 Tab 容器，**「请假」Tab 内嵌 `leaveManage.vue`**。列表「撤销」按钮显示条件为 **`(status 为待审批 1100 或待休假 1103) 且 `dataFrom !== 'MB'`**（见该文件模板）；接口 **`cancelFlow(procId, id)`** 即 `GET .../holiday/back/:procId/:id`。请勿与仓库内其他目录下同名 `holiday/index.vue`（仅含 `procId`、`!isEnd`、`status !== '102'` 的旧实现）混为一套规则。

流程设计、任务处理和请假审批不在前期抽象，先项目内稳定实现。

**详情容器**：参见 **§2.5.1**；请假列表的**查看 / 新增 / 编辑**均使用 **`el-drawer`**（附件预览等二级浮层仍可用 `el-dialog`）。

### 15.8 Phase 7：群发邮件

当前状态：已阶段性接入群组配置、发件箱配置、发件列表，后续只做联调、缺陷修正和旧接口差异收敛，不再作为当前主线新增范围。

群发邮件独立迁移：

- 群组配置。
- 发件箱配置。
- 发件列表。

如出现通用收件人选择弹窗，可先在项目内封装，复用稳定后再评估抽离。

### 15.9 Phase 8：活动管理

当前状态：**进行中（主链路已通，项目详情子能力未闭合）**。已接入活动列表、活动详情（含全部 Tab）、活动项目列表与编辑页、奖品列表、投票节目、家长学生关联、微信/邮箱配置、问卷管理/设计/答卷。

活动管理按业务链迁移：

1. 活动列表。
2. 活动详情、新增、编辑（含 Tab：项目、问卷、报名、签到、获奖、投票、**祝福语**、反馈）。
3. 活动项目列表、详情、新增、编辑。
4. 问卷管理、问卷设计、答卷查看。
5. 奖品列表。
6. 投票节目。
7. 家长学生关联管理。
8. 微信配置。
9. 邮箱配置。
10. **活动项目详情子能力**（旧 `activity/program/detail/index.vue`，**当前 `admin-web` 缺口**）：
    - 绑定奖品列表（旧 `PrizForm` + 表格）。
    - 绑定投票节目（旧 `VoteProgramForm` + 表格，`programType == 2`）。
    - 获奖池文件：模板下载、导入、文件列表（`lotteryPoolFile.js`）。
    - 奖池名单抽屉（`lotteryPoolList` + `listByPool`）。

**不作为独立菜单迁移：** `activity/blessing/index.vue`、`lotteryPoolList/index.vue` 等孤立文件若与详情页不一致，以 **活动详情 Tab / 项目详情内嵌** 为准（§2.7）。

该阶段重点处理详情页、多 Tab、问卷动态表单、批量发送微信、导出多个文件等复杂操作。Phase 8 宣称完成前，须逐项验收 §15.9 第 10 点与旧项目详情页行为一致。

### 15.10 Phase 9：内容管理

内容管理按旧菜单层级迁移：

1. 公告内容。
2. 动态内容：一周食谱、校园生活。
3. 文章管理：文章内容、文章分类。
4. 讨论管理：内容列表、讨论标签、讨论评论、点赞收藏。

该阶段重点处理富文本、图片上传、详情预览、内容状态和多语言标题。须同步补齐 §14.2 内容域 `MENU_PATH_ALIASES` 与 `router/modules/content.ts`。

### 15.11 Phase 10：宿舍管理

旧代码目录：`test/old-test/src/views/isacommunity/dorm/`，API：`api/isacommunity/dorm.js`（前缀 `/isacommunity/dormitory/*`）。

建议迁移顺序：

1. 住宿生管理（当前/历史 Tab，`boarding-student`）。
2. 楼栋、楼层、房间管理。
3. 属性管理、自动分配规则。
4. 床位分配隐藏页（从房间列表跳入，`room-assigne`）。

该阶段注意权限码（如 `building-add`、`attribute-add`、`rule-add`）与学校筛选联动；**不要**复制旧路由文件中重复的 dorm 路由注册。

### 15.12 Phase 11：校医管理

旧代码目录：`schoolDoctor/`，路由：`router/schoolDoctor/index.js`，需求：`schoolDoctor/校医需求.md`。

建议迁移顺序（与旧路由一致）：

1. 学生档案、医疗信息。
2. 规章制度、疾病设置。
3. 就诊记录、用药申请。
4. 传染病管理、体检报告。

该阶段表单体量大、权限细（如家长联系方式、操作记录编辑），详情容器优先 `el-drawer` 或独立详情路由（§2.5.1）。校巴考勤详情若复用 `studentFormMapper.js`，稳定后可评估抽到 `components/business`。

### 15.13 Phase 12：收尾优化

- 全量 `lint`、`type-check`、`build`。
- 补齐 P9～P11 的 `MENU_PATH_ALIASES` 与隐藏路由。
- 清理无效样式、重复映射、未使用权限码占位。
- 跨模块联调回归（邮件群组、活动导入导出、考勤流程书签路径）。

## 十六、需要抽离到组件库的能力

抽离原则：只抽机制、协议、通用交互，不抽具体业务页面。

### 16.1 第一优先级

这些能力必须在第一轮或前两轮稳定进入 `uni-lib`：

| 能力     | 组件库形态                                           | 说明                                     |
| -------- | ---------------------------------------------------- | ---------------------------------------- |
| 标准列表 | `UniDataTable`                                       | 列配置、分页、选择、操作列、加载态       |
| 查询表单 | `UniSearchForm`                                      | 查询、重置、展开收起、选项加载、空值清理 |
| 动态表单 | `UniForm`                                            | 新增、编辑、详情查看共用 schema          |
| 上传     | `UniUpload`                                          | 导入、图片、附件上传统一交互             |
| 权限     | `v-uni-permission`、`useUniPermission`               | UI 和 JS 权限统一                        |
| 请求     | `createUniRequest`                                   | token、错误码、401、403、重复请求        |
| 认证     | `createUniAuth`                                      | 登录、退出、刷新、清理 token             |
| 主题     | `UniThemeSettings`、`setupUniTheme`、`applyUniTheme` | 主题抽屉、持久化、Element Plus 变量覆盖  |
| 下载     | `downloadBlob` / `useUniDownload`                    | 导出、模板下载                           |
| 格式化   | `formatEmpty`、`formatDate`、`formatOptionLabel`     | 空值、日期、枚举回显                     |

### 16.2 第二优先级

这些能力在两个以上模块复用后再进入 `uni-lib`：

| 能力         | 建议形态           | 触发条件                               |
| ------------ | ------------------ | -------------------------------------- |
| 字典选择     | `UniDictSelect`    | 多模块都需要字典下拉                   |
| 远程选择弹窗 | `UniPickerDialog`  | 成员、学校、活动、收件人等选择模式稳定 |
| 导入弹窗     | `UniImportDialog`  | 多模块导入流程一致                     |
| 确认弹窗     | `UniConfirmDialog` | 删除、启用、禁用确认文案和交互稳定     |
| 日志时间线   | `UniLogTimeline`   | 审批、操作日志、状态流转复用           |
| 步骤条       | `UniStepBox`       | 活动、考勤、流程等复用                 |
| 二维码       | `UniQrCode`        | 多模块生成、复制、下载二维码           |

### 16.3 第三优先级

这些能力依赖重、业务差异大，后期专项评估：

| 能力       | 建议形态            | 说明                               |
| ---------- | ------------------- | ---------------------------------- |
| 富文本     | `UniRichTextEditor` | 上传、资源路径、工具栏差异需先稳定 |
| 流程设计器 | `UniBpmnDesigner`   | 考勤流程稳定后再评估               |
| 表单设计器 | `UniFormDesigner`   | 等 `UniForm` schema 稳定后再做     |
| 日历       | `UniCalendar`       | 若活动和考勤同时复用再抽           |
| 签名       | `UniSignaturePad`   | 仅多端签字场景明确后再抽           |

### 16.4 不进入组件库

以下内容不抽到 `uni-lib`：

- 成员管理整页。
- 校车管理整页。
- 活动管理整页。
- 内容管理整页。
- 考勤流程业务规则。
- 学校、角色、模块等具体业务接口。
- 项目 Logo、登录页、菜单图标、品牌文案。
- 旧系统整包样式。

## 十七、项目内业务模块抽离说明

不适合进 `uni-lib` 但可在 `admin-web` 内复用的能力，放在 `components/business`、`composables` 或业务模块目录。

| 能力           | 放置位置                                | 说明                       |
| -------------- | --------------------------------------- | -------------------------- |
| 学校选择器     | `components/business/school-select`     | 绑定本项目学校字典         |
| 状态操作按钮组 | `components/business/status-actions`    | 启用、禁用、删除等项目文案 |
| 业务导入弹窗   | `components/business/import-dialog`     | 若多个模块导入规则一致     |
| 业务下载工具   | `utils/download.ts`                     | 文件名解析、导出提示       |
| 学校字典       | `composables/use-school-options.ts`     | 本项目学校选项和默认学校   |
| 成员模块逻辑   | `views/member/<sub-module>/use-list.ts` | 只服务对应成员子模块       |
| 活动详情 tab   | `views/activity/detail/tabs`            | 只服务活动管理             |
| 活动项目详情子区 | `views/activity/program/edit` 内嵌组件 | 奖品/投票绑定、获奖池（Phase 8 待补齐） |
| 考勤审批弹窗   | `views/attendance/components`           | 只服务考勤流程             |
| 校医表单映射   | 迁校巴考勤时评估 `studentFormMapper` 等价逻辑 | 旧 `schoolDoctor/utils` |

业务模块内部推荐保持：

```text
views/<module>/
├── components/
├── list.config.ts
├── list.vue
└── use-list.ts
```

复杂模块可继续拆分：

```text
views/activity/
├── list/
├── detail/
├── edit/
└── components/
```

## 十八、第一轮交付清单

第一轮完成后应具备：

- 登录页可登录、退出、登录失效清理。
- 首页替换模板 demo 内容。
- 成员管理按 `学生列表`、`教师列表` 拆分为二级菜单。
- 学生列表可查询、重置、分页、查看详情。
- 教师列表可查询、重置、分页、查看详情。
- 成员页面全部使用 `uni-lib` 表格、搜索和详情表单能力。
- API 方法均有精炼注释。
- 全局关键代码有必要短注释。
- 不出现 `views/isacommunity` 这类旧业务层级。

## 十九、第一轮暂不处理事项

> **说明：** 以下为 **历史第一轮（仅登录/首页/成员）** 的边界记录；校车、协议、基础设置、权限、考勤、邮件、活动等已由后续 Phase 承接，**不再表示当前未做**。当前未纳入排期的增量域见 **§2.7**（宿舍、校医、校巴考勤）。

历史第一轮暂不处理：

- 校车管理具体页面。
- 协议管理具体页面。
- 基础设置具体页面。
- 权限管理具体页面。
- 考勤管理具体页面。
- 群发邮件具体页面。
- 活动管理具体页面。
- 内容管理具体页面。
- 宿舍管理、校医管理、校巴考勤（现分别对应 Phase 10、11 与 P3 扩展）。
- 微前端改造。
- 复杂流程设计器、富文本、BPMN 等重型能力。

## 二十、确认后第一轮实施顺序

确认方案后按以下顺序实施：

1. 对接登录接口，完成 token 写入和退出清理。
2. 对接当前用户接口，完成用户信息、角色、权限码写入。
3. 对接菜单接口，完成菜单树标准化和侧边栏渲染。
4. 接入路由守卫，完成登录态、菜单加载、权限校验、401/403 处理。
5. 调整首页页面和已授权快捷入口。
6. 新增成员列表 API 和类型。
7. 新增成员列表页面配置和 composable。
8. 实现成员列表页。
9. 实现成员详情弹窗。
10. 联调请求、分页和错误处理。
11. 执行 lint、type-check、build。
