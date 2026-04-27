# admin-web 无界 + Vite 共享依赖（对照《调研方案》可运行示例）

**方案论证（以多域名、非统一 UI 为前提，为何主选「模版 + 组件库」）**：见 [`微前端与组件库方案对比.md`](./微前端与组件库方案对比.md)（**§5 为结论**）。


本目录按 `调研方案.md` 搭了**主应用**、**子应用**、**共享组件库**三件套，便于你本地验证「主应用注入 `__SHARED_DEPS` → 无界 `jsBeforeLoaders` 写入子应用 `__SHARED_DEPS_FROM_MAIN` → 子应用依赖加载器优先读共享」整条链路。

## 前置

- Node 18+（推荐 20+）
- 本仓库根目录 `.gitignore` 忽略了 `test/`，若需纳入 Git，请自行调整忽略规则。

## 安装

在 `test/admin-web` 下执行：

```bash
npm install
```

## 主应用 / 子应用「菜单」示例（本仓库已接好）

演示目标：一眼看清 **壳菜单（主应用）** 与 **域内菜单（子应用）** 各自管什么。

1. **主应用壳菜单**（`main-app/src/App.vue`）
   - 左侧两项：子应用首页、子应用设置。
   - 点击后修改嵌入地址 `subUrl`（子应用入口 + `hash`），例如 `http://localhost:3001/#/`、`http://localhost:3001/#/settings`。
   - 同时通过无界 `:props` 下发 `shellMenuKey`，子应用可读 `window.$wujie.props.shellMenuKey`（见子应用 `Home.vue` / `Settings.vue`）。

2. **子应用域内菜单**（`sub-app/src/App.vue`）
   - 左侧「首页 / 设置」切换本应用内页面（监听 `hashchange`，不占用主应用 history）。

3. **说明**
   - 为减少「壳频繁改 URL + alive 保活」带来的边界问题，示例里 `:alive=\"false\"`；线上若保活，可改为 **无界 bus** 通知子应用切页，而不仅依赖改 `url`。

## 启动（联调）

在一个终端同时起主、子（推荐）：

```bash
npm run dev
```

或两个终端分别：

```bash
npm run dev:main
npm run dev:sub
```

- 主应用：<http://localhost:3000>
- 子应用：<http://localhost:3001>

浏览器打开主应用地址，中间区域为无界加载的子应用。打开控制台可看到依赖加载器日志（`[Micro Mode]` / `[Dev Mode]` / `[Standalone Mode]`）。

## 单独验证子应用（无宿主）

直接访问 <http://localhost:3001>：子应用在开发模式下会通过 `src/dev-mock-shared.js` 模拟主应用注入的 `window.__SHARED_DEPS_FROM_MAIN`（与调研文档「开发环境模拟」一致，但不依赖 EJS，而是用模块动态 import）。

## 子应用微前端构建（可选）

与调研文档一致，通过 `VITE_MICRO_MODE=true` 打带子应用 external 的包（需自行保证运行环境提供对应 `window` 全局变量，见 `sub-app/vite.config.js`）：

```bash
npm run build:sub:micro
```

## 目录说明

| 路径 | 说明 |
|------|------|
| `main-app/` | 主应用：初始化 `window.__SHARED_DEPS`、无界 `WujieVue`、`createSharedDepsPlugin` |
| `sub-app/` | 子应用：`vite-dependency-loader.js`、无界生命周期、`vite.config.js` 条件 external |
| `shared-components/` | 本地 `shared-components` 包，供主/子引用 |

## 常见问题

### 控制台里像「主应用」报错、但堆栈有 `__WUJIE_MOUNT` / `sub-app` 的 `main.js`

宿主页面和 iframe 会共用**同一个 DevTools 控制台**；**子应用**在无界里运行，其报错会出现在**当前标签页**控制台，容易误以为是主应用。请看堆栈里的文件名/路径是否指向 `sub-app` 及 `VM` 里加载的 `vue-router`。

### 子应用出现 `Cannot read properties of null (reading 'parent')`（与 `RouterView` / `warnDeprecatedUsage` 相关）

常见两类原因：

1. **同页两套 `vue` / `vue-router`**：入口用共享 `loadLibrary('vue')` 而 SFC 又静态 `import` 了本地 `vue-router`，`app.use(router)` 与 `<RouterView>` 对不上。
2. **无界 iframe/沙箱时序**：`RouterView` 的 `setup` 会读 `getCurrentInstance().parent`，在部分场景下为 `null` 会触发 vue-router 内部 `warnDeprecatedUsage` 的报错。

**本仓库子应用已去掉 `vue-router` 与 `<router-view />`，改为 `App.vue` 直接挂 `Home`，优先保证能稳定跑通无界 + 共享依赖演示。** 若你必须要路由，需自行保证**仅一份** `vue`/`vue-router` 与合适的 history（可考虑 `createWebHashHistory`），并在 `sub-app/vite.config.js` 中已加 `resolve.dedupe: ['vue','vue-router','pinia']` 作辅助。

## 与《调研方案》的差异说明（刻意简化）

1. 子应用 `index.html` 未使用 EJS 条件块；开发模拟改为 `src/dev-mock-shared.js`，避免额外 HTML 插件。
2. 无界子应用生命周期在示例里改为在 `__WUJIE_MOUNT` 内完成 `createApp` + `mount`，`__WUJIE_UNMOUNT` 内 `unmount`，避免文档片段里「只保存 instance 不挂载」无法运行的问题。
3. `rollup-plugin-visualizer`、严格 `terser` 等可按需在子应用 `vite.config.js` 中自行加回。
