# uni-ui-lib

`uni-ui-lib` 是面向管理后台的 Vue 3 + Element Plus 业务组件库。

## 安装

```bash
npm install uni-ui-lib
```

## 使用

```ts
import { createApp } from 'vue'
import UniLib from 'uni-ui-lib'
import 'uni-ui-lib/style.css'

createApp(App)
  .use(UniLib, {
    permission: {
      hasPermission: (code) => permissionStore.hasPermission(code)
    }
  })
  .mount('#app')
```

也可以按需使用命名导出（推荐，与全量安装共用同一入口）：

```ts
import UniLib, { UniDataTable, UniForm, registerServiceWorker } from 'uni-ui-lib'
```

旧版子路径（如 `uni-ui-lib/components/uni-data-table`）仍兼容，但均指向主入口 bundle。

## Scripts

```bash
npm install
npm run type-check
npm run build
npm run format:check
npm run docs:dev
npm run docs:build
```

## 发布

发布前会自动执行 `prepublishOnly`，包括格式检查、类型检查、库构建和文档构建。

```bash
npm login
npm publish
```
