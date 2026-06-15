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

### 更新全局脚手架

从 npm 拉取最新版：

```bash
npm install -g uni-lib-cli@latest
```

安装 v0.1.1+ 后，也可使用 CLI 子命令：

```bash
uni-lib-cli update
```

Monorepo 内快捷命令（注意当前目录）：

```bash
# 已在 uni-lib-cli 目录
npm run update:global

# 在仓库根目录
npm run update:global --prefix uni-lib-cli
```

若 `uni-lib-cli update` 报 `too many arguments`，说明全局版本过旧，请先执行 `npm install -g uni-lib-cli@latest`。

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
npm run release              # 默认 patch 递增并发布
npm run release -- minor     # minor 版本
npm run release -- major     # major 版本
```

流程：同步模版 → 构建 → 递增版本 → `npm publish`。版本号不会自动 git commit/tag，发布后可自行提交。

单独同步模版（不发布）：

```bash
npm run sync:templates
```

本地 npm 认证：复制 `.npmrc.example` 为 `.npmrc` 并配置 token（勿提交 `.npmrc`）。

## 开发

- Node.js >= 18.12.0
- `npm run build` — 编译 TypeScript 到 `dist/`
- `npm run dev` — 直接运行 `src/index.ts`（tsx）
- `npm run sync:template:admin-web` — 从 `admin-web` 同步模版（工作台 + 路线规划、协议管理、学生档案）
