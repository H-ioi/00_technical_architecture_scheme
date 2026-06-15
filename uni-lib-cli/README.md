# uni-lib-cli

uni-lib 多端前端项目脚手架，支持从模版快速创建工程。

## 支持的模版

| 模版 | 说明 |
| --- | --- |
| `admin-web` | Vue 3 管理后台（Element Plus + uni-ui-lib） |
| `customer-web` | Nuxt 3 C 端站点 |
| `customer-mobile` | uni-app 移动端跨端 |
| `native-app` | Flutter 原生应用骨架 |

## 使用方式

### 全局安装

```bash
npm install -g uni-lib-cli
uni-lib-cli create
```

### Monorepo 本地调试

```bash
cd uni-lib-cli
npm install
npm run build
node dist/index.js create
# 或
npm run dev
```

### 非交互创建

```bash
uni-lib-cli create my-admin --template admin-web
uni-lib-cli create my-admin --template admin-web --dir ./apps --force
```

## 模版来源

创建项目时按以下顺序查找模版目录：

1. monorepo 同级目录（如 `../admin-web`）
2. 包内 `templates/<模版名>/`

开发 monorepo 时会优先使用仓库内最新工程；发布后使用 npm 包内 bundled templates。

## 发布

```bash
npm run build
npm publish
```

本地 npm 认证：复制 `.npmrc.example` 为 `.npmrc` 并配置 token（勿提交 `.npmrc`）。

## 开发

- Node.js >= 18.12.0
- `npm run build` — 编译 TypeScript 到 `dist/`
- `npm run dev` — 直接运行 `src/index.ts`（tsx）
