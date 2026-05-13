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

## 组件库示例

模板已接入发布包 `uni-ui-lib`，可通过侧边栏“组件库示例”查看：

- `UniSearchForm` 与 `UniDataTable` 组合的列表筛选示例。
- `UniForm` 的配置化表单、字段联动、查看/编辑模式示例。
- `UniUpload` 的自定义请求上传示例。
- `v-uni-permission` 与模板权限 store 的集成示例。
