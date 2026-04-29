# uni-ui-lib

`uni-ui-lib` 是面向管理后台的 Vue 3 + Element Plus 业务组件库。

## 安装

```bash
npm install uni-ui-lib
```

## 使用

```ts
import { createApp } from "vue";
import UniLib from "uni-ui-lib";
import "uni-ui-lib/style.css";

createApp(App)
  .use(UniLib, {
    permission: {
      hasPermission: (code) => permissionStore.hasPermission(code),
    },
  })
  .mount("#app");
```

也可以按需使用命名导出：

```ts
import { UniDataTable, UniForm, UniSearchForm, UniUpload } from "uni-ui-lib";
```

或使用组件子路径：

```ts
import { UniDataTable } from "uni-ui-lib/components/uni-data-table";
import "uni-ui-lib/components/uni-data-table/style.css";
```

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
