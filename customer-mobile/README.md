# customer-mobile

uni-app **标准项目模板**（Vue 3 + Vite + TypeScript + Pinia + vue-i18n），用于 H5 / 微信小程序等移动端场景。

## 文档

- 落地说明：[前端移动端(customer-mobile)构建方案.md](../前端移动端(customer-mobile)构建方案.md)
- 评审规范：Cursor Skill **`uni-review-mobile`**（`~/.cursor/skills/uni-review-mobile/SKILL.md`）

## 快速开始

```bash
npm install
npm run dev:h5
# 或
npm run dev:mp-weixin
```

## 质量门禁

```bash
npm run lint
npm run lint:style
npm run type-check
```

## 模板要点（当前仓库）

| 项 | 约定 |
| --- | --- |
| 接口层 | 仅 `src/api/`（`admin-web` 同款 `{ url, name, get/post }` 模块） |
| 请求 | `src/utils/request.ts`（`uni-request`；拦截器内解包 `data`） |
| 页面 | 示例仅 `pages/home/index` |
| 跨页逻辑 | `use-locale.ts`、`use-app-common.ts`（勿为单页薄包装再建 composable） |
| 类型声明 | `src/types/env.d.ts`、`shims-uni.d.ts`、`uni-request.d.ts` |
| 环境变量 | `.env.development` / `.env.test` / `.env.production` → `VITE_API_BASE_URL` |
| UI 组件库 | **不接入** `uni-ui-lib`（`uni-lib`）；仅用 uni-app 组件 + 项目 `components/` |

新业务：在 `api/modules` 增域模块 → `pages.json` 注册页面 → 页面内直接 `uni.*` / `t()`，遵循 Skill 内联原则（无单处引用的 constants / utils 文件）。
