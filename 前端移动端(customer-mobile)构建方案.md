# 前端移动端（customer-mobile）构建方案

本文档基于 `前端架构方案总览.md` 与 `前端开发规范.md` 编制，作为 `customer-mobile` 项目的落地基线。目标是统一移动端跨端工程（H5 / 微信小程序等）的建设方式，明确从初始化、目录分层、状态管理、接口组织、样式规范到构建发布的完整路径。

---

## 一、项目定位

`customer-mobile` 用于承载移动端业务场景，如移动门户、活动页、会员中心、个人中心与轻交易流程等。

该类项目核心诉求：

- 一套代码适配多端（小程序 + H5）
- 首屏体验稳定、交互流畅
- 页面目录与路由结构一致，便于协作
- 接口能力集中管理，避免页面散写请求

统一采用：`uni-app + Vue 3（Vite）+ TypeScript + Sass`。

---

## 二、建设目标

- 固化移动端跨端项目的初始化模板与目录边界
- 统一页面、组件、composable、service、store 的职责分层
- 统一样式变量与适配口径，避免多套规则并存
- 建立可复制的质量门禁（Lint / 格式化 / 类型检查）
- 建立标准化构建发布流程（多端构建、产物归档、回滚）

---

## 三、技术选型与约束

### 3.1 选型总览

| 类别 | 选型 |
| --- | --- |
| 框架 | uni-app（Vue 3 + Vite） |
| 语言 | TypeScript（默认开启） |
| 样式 | Sass（SCSS） |
| 状态管理 | Pinia（uni-app 适配方案） |
| 接口层 | `services/` 或 `api/` 二选一并全局统一 |
| 质量体系 | ESLint + Prettier + Stylelint + lint-staged + commitlint |

### 3.2 基础约束

- 新模块必须使用 TypeScript，不新增纯 JavaScript 业务文件
- 样式统一使用 Sass，不引入 Less / Stylus 作为主方案
- 状态管理统一使用 Pinia，不混用多套全局状态方案
- 接口目录命名统一为 `services/` 或 `api/`，项目内不得并存
- 跨页面复用能力优先沉淀 `components/`、`composables/`

---

## 四、目录结构与分层

推荐目录（按规范落地）：

```bash
customer-mobile/
├── src/
│   ├── main.ts                      # 应用入口
│   ├── App.vue                      # 应用根组件
│   ├── pages.json                   # uni-app 页面路由与窗口配置
│   ├── manifest.json                # 应用平台配置
│   ├── uni.scss                     # uni-app 全局变量（可与 app.scss 配合）
│   ├── app.scss                     # 全局样式入口
│   ├── pages/                       # 页面路由层，按业务页面划分
│   │   ├── home/
│   │   │   └── index.vue
│   │   └── mine/
│   │       └── index.vue
│   ├── components/                  # 项目复用组件
│   │   ├── common/
│   │   └── business/
│   ├── composables/                 # 逻辑复用（use-xxx.ts）
│   ├── stores/                      # Pinia 状态层（按业务域拆分）
│   ├── services/                    # 接口能力封装（若选 api/ 则保持唯一）
│   ├── types/                       # 全局类型与接口契约
│   ├── utils/                       # 纯函数与工具封装
│   └── static/                      # 静态资源（图片、图标等）
├── vite.config.ts
├── package.json
└── tsconfig.json
```

分层职责：

- `pages/`：页面编排与交互组织，不散落底层请求细节
- `components/`：项目内复用视图组件
- `composables/`：跨页面逻辑复用与状态编排
- `stores/`：跨组件/跨页面共享状态
- `services/`：按业务域封装接口，集中处理请求能力
- `types/`：参数、响应与领域模型类型定义
- `utils/`：纯工具函数，不依赖页面上下文

---

## 五、路由与页面组织方案

### 5.1 路由组织

- 应用路由在 `pages.json` 统一声明
- 页面目录结构需贴近路由结构，避免深层嵌套
- 全局导航栏、分包、tabBar 等统一在 `pages.json` 管理

### 5.2 分包建议（小程序端）

满足以下条件建议分包：

- 非首页高频路径（低频业务页、配置页）
- 体积较大且启动非必需页面
- 活动类临时页面

约束：

- 主包仅保留首屏与公共基础能力
- 分包页面禁止重复引入大体积依赖

---

## 六、数据流与接口方案

标准数据流：

```text
Page / Component -> composable(use-xxx) -> service(api) -> request client
```

### 6.1 实施要求

- 页面层仅消费 composable 暴露的数据与动作
- 请求实例、鉴权、错误处理在请求层统一处理
- 同业务域接口统一放在同一个 service 文件（如 `user.ts`、`order.ts`）
- 类型契约优先定义在 `types/`，避免 any 扩散

### 6.2 禁止事项

- 在页面中直接拼接大量请求逻辑
- 在 `utils/` 写依赖页面生命周期的业务逻辑
- 同一接口在多个页面复制粘贴调用实现

---

## 七、状态管理策略（Pinia）

使用原则：

- 页面私有临时状态优先放组件内部
- 跨组件共享、跨页面复用、需持久化状态再进入 Pinia
- Store 按业务域拆分，不做“全局大仓库”

推荐目录：

```bash
src/stores/
├── modules/
│   ├── user.ts
│   ├── app.ts
│   └── order.ts
└── index.ts
```

禁止事项：

- 将所有数据无差别塞入全局 Store
- 在 Store 编写 DOM 逻辑或页面渲染细节

---

## 八、组件与复用策略

组件分层：

- 页面私有组件：页面目录内就近维护
- 项目复用组件：放 `components/common` 或 `components/business`
- 跨项目复用组件：评估后进入 `lg-lib`，不在本项目硬拷贝

抽离触发条件：

- 同组件在 `2` 个及以上页面重复出现
- 同类结构与交互被复制实现
- 组件输入输出边界已清晰（props / emits）

---

## 九、样式体系与适配口径

### 9.1 样式组织

- 全局变量、mixin、reset 按职责拆分到 `assets/styles/` 或 `uni.scss`
- 组件样式默认局部隔离，避免全局污染
- 优先使用设计 token，不长期写死魔法值

### 9.2 端侧适配建议

- uni-app 端建议统一使用 `rpx` 作为核心尺寸单位
- 字体、间距、点击区尺寸使用统一变量和 mixin
- 不混杂多套断点体系，减少样式维护成本

### 9.3 样式约束

- 禁止深层级选择器嵌套滥用
- 避免复制粘贴大段重复样式，复用样式应抽象

---

## 十、命名与代码规范

命名口径（与团队规范一致）：

- 标识符使用 `camelCase`
- 目录和文件使用 `kebab-case`
- 组合式函数使用 `use-xxx.ts`
- 组件名语义清晰，避免 `data`、`temp`、`info` 等泛化命名

代码分层约束：

- 页面层不承担底层请求实现
- 接口层不编写视图逻辑
- 工具层保持纯函数属性

---

## 十一、工程脚本与质量门禁

建议脚本（示例）：

```json
{
  "scripts": {
    "dev:h5": "uni",
    "dev:mp-weixin": "uni -p mp-weixin",
    "build:h5": "uni build -p h5",
    "build:mp-weixin": "uni build -p mp-weixin",
    "lint": "eslint \"src/**/*.{ts,vue}\" --max-warnings 0",
    "lint:fix": "eslint \"src/**/*.{ts,vue}\" --fix",
    "lint:style": "stylelint \"src/**/*.{scss,css,vue}\" --allow-empty-input",
    "format": "prettier --write \"src/**/*.{ts,vue,scss,md,json}\"",
    "type-check": "vue-tsc --noEmit"
  }
}
```

门禁要求：

- 提交前必须通过 `lint`、`lint:style`、`type-check`
- `pre-commit` 执行 `lint-staged`
- 禁止提交调试 `console.log`、`console.debug`、`debugger`
- 提交信息遵循 Conventional Commits

---

## 十二、环境配置与多端差异处理

### 12.1 环境文件建议

- `.env.development`
- `.env.test`
- `.env.production`

### 12.2 配置要求

- 运行时配置统一由环境变量注入，不在业务代码硬编码地址
- 按端差异（H5 / 小程序）封装在 `utils/platform.ts` 等统一入口
- 禁止页面散写端能力判断与兼容逻辑

---

## 十三、开发与联调流程

### 13.1 本地开发

```bash
npm install
npm run dev:mp-weixin
# 或
npm run dev:h5
```

### 13.2 新增页面标准动作

1. 在 `pages/` 新建页面目录并在 `pages.json` 注册
2. 页面逻辑优先抽到 `composables/use-xxx.ts`
3. 若涉及接口，先补 `types/` 契约，再新增 `services/` 能力
4. 样式变量统一进入 `uni.scss` 或 `_vars.scss`

### 13.3 新增接口标准动作

1. 按业务域新增 `services/*.ts`
2. 完善请求参数与响应类型
3. 页面只调用 composable / service，不散写请求实现

---

## 十四、构建与发布方案

### 14.1 多端构建

- 微信小程序构建：`npm run build:mp-weixin`
- H5 构建：`npm run build:h5`

### 14.2 发布建议流程

1. 合并前通过 `lint`、`type-check`、`build`
2. 测试环境验证核心流程（登录、列表、详情、支付前链路）
3. 执行灰度发布并观察错误监控
4. 保留可回滚版本与构建产物记录

---

## 十五、测试与验收清单

测试建议：

- `utils/`、`composables/` 纯逻辑优先补单元测试
- 核心交互组件补基础组件测试
- 关键业务链路补端到端验证（至少覆盖主路径）

验收清单：

- 功能符合需求
- 无明显控制台报错
- 无 Lint / 类型错误
- 命名、目录、分层符合规范
- 复用层级判断合理（页面内 / 项目内 / 组件库）
- 提交信息与发布记录完整

---

## 十六、当前仓库落地建议（customer-mobile）

当前 `customer-mobile` 尚未形成完整工程结构，建议按本方案执行初始化：

1. 使用 `uni-app Vue3 + TypeScript + Vite` 模板初始化项目骨架
2. 按本文第四章建立标准目录并补齐基础脚本
3. 先完成首页与个人中心双页面最小闭环（页面 + service + store）
4. 接入 ESLint / Prettier / Stylelint / Husky / lint-staged
5. 建立首个多端发布流水线（mp-weixin + h5）

该阶段完成后，再按业务节奏逐步补齐分包策略、监控埋点与测试覆盖。
