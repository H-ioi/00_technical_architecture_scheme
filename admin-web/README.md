# admin-web

管理后台模板项目，按仓库内《前端管理后台(admin-web)构建方案.md》和《前端开发规范.md》落地。

## 技术栈

- Vue 3 + Vite + TypeScript
- Vue Router 4 + Pinia
- Element Plus + Sass
- ESLint + Prettier + Stylelint + vue-tsc

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run lint:style
npm run type-check
npm run build
```

## 目录约定

`src/` 顶层目录按模板保持稳定：`api`、`assets`、`components`、`composables`、`directives`、`layouts`、`plugins`、`router`、`stores`、`types`、`utils`、`views`。

跨项目复用组件预留在 `plugins/business-ui.ts` 统一接入 `uni-lib`，当前模板不默认引入微前端。
