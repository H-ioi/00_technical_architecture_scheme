# 快速开始

```ts
import { createApp } from 'vue'
import UniLib from 'uni-ui-lib'
import 'uni-ui-lib/style.css'

createApp(App)
  .use(UniLib, {
    permission: {
      hasPermission: (code) => permissionStore.hasPermission(code)
    },
    theme: {
      primaryColor: '#1677ff'
    }
  })
  .mount('#app')
```

先在宿主创建 **`createUniLibI18n`** 导出的实例并 **`app.use(i18n)`**（合并宿主文案后同 key 由宿主覆盖库）。再在根组件用 `UniConfigProvider` 包裹，使 **Element Plus 原子组件**（日期、分页等）与 `vue-i18n` 语言一致。

```vue
<template>
  <UniConfigProvider>
    <RouterView />
  </UniConfigProvider>
</template>
```

详见 [I18n](/locales/i18n)。（已不再使用 `app.use(UniLib, { i18n: … })` 桥接。）

## 按需导入

```ts
import { UniDataTable } from 'uni-ui-lib/components/uni-data-table'
import 'uni-ui-lib/components/uni-data-table/style.css'
```

当前组件样式会复用全量样式出口；按需路径用于稳定类型和组件导入。

## 内置指令

全量安装后会注册以下指令：

```vue
<template>
  <el-button v-uni-permission="'user:create'">新增</el-button>
  <el-button v-uni-copy="'ORD-001'">复制订单号</el-button>
  <el-button v-uni-debounce-click="submit">防重复提交</el-button>
</template>
```

`v-uni-copy` 支持字符串、函数或 `{ text, successMessage, errorMessage }`；`v-uni-debounce-click` 支持函数或 `{ handler, wait, immediate }`。
