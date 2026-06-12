# admin-web

管理后台模板项目。落地说明见《前端管理后台(admin-web)构建方案.md》；评审与实现以 Cursor Skill **`uni-review-web`** 为准。

## 技术栈

- Vue 3 + Vite + TypeScript
- Vue Router 4 + Pinia
- Element Plus + **`uni-ui-lib`** + Sass
- ESLint + Prettier + Stylelint + vue-tsc + Vitest

## Scripts

```bash
npm install
npm run dev              # 本地开发（vite.config.local.ts）
npm run dev:force        # 清 Vite 缓存后启动，uni-lib dist 更新后样式仍旧时用
npm run build            # 生产构建（vite.config.ts）
npm run preview          # 预览构建产物
npm run lint
npm run lint:style
npm run type-check
npm run test:run
npm run test:e2e
```

Playwright E2E：复制 `.env.e2e.example` 为 `.env.e2e.local` 并填写 `E2E_USERNAME` / `E2E_PASSWORD` 后执行 `npm run test:e2e`；无账号时仅跑 smoke 用例。

## Vite 配置

配置拆成三份，按场景选用：

| 文件 | 用途 | 对应命令 |
| --- | --- | --- |
| `vite.config.shared.ts` | 公共配置（PWA、代理、分包、SCSS、公共 alias） | — |
| `vite.config.local.ts` | 本地联调 `uni-lib` | `dev` / `dev:force` |
| `vite.config.ts` | 上线构建，走 `node_modules` 标准解析 | `build` / `preview` |

**本地联调**（`vite.config.local.ts`）会优先将 `uni-ui-lib` 解析到 monorepo 同级目录 `../uni-lib/dist`，并排除 `optimizeDeps` 预构建缓存，避免 Windows 下 `file:../uni-lib` 复制到 `node_modules` 后仍读到旧 dist。

**构建 / 预览**（`vite.config.ts`）不含上述 alias，直接使用依赖中的 `uni-ui-lib`。

联调组件库时，在 `uni-lib` 目录执行 `yarn dev:watch`（或手动 `yarn build`），admin-web 保存 dist 后刷新即可；样式仍旧时执行 `npm run dev:force`。

## 目录约定

`src/` 顶层目录按模板保持稳定：`api`、`assets`、`components`、`composables`、`directives`、`layouts`、`plugins`、`router`、`stores`、`types`、`utils`、`views`。

路由按业务域拆在 `src/router/modules/`（如 `member.ts`、`activity.ts`），由 `src/router/routes.ts` 聚合后供 `router/index.ts` 注册；新增页面时在对应模块文件追加路由，勿再堆进单文件。

**与移动端：** `customer-mobile` **不**接入 `uni-ui-lib`；后台 HTTP 走 `uni.ts` 注入的组件库 `request`，勿照搬移动端的 `utils/request.ts`。

## 组件库示例

模板已接入发布包 `uni-ui-lib`，可通过侧边栏“组件库示例”查看：

- `UniSearchForm` 与 `UniDataTable` 组合的列表筛选示例。
- `UniForm` 的配置化表单、字段联动、查看/编辑模式示例。
- `UniUpload` 的自定义请求上传示例。
- `v-uni-permission` 与模板权限 store 的集成示例。
