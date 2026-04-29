# 快速开始

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

在根组件用 `UniConfigProvider` 包裹，使 **Element Plus 原子组件**（日期、分页、空态文案等）与组件库语言一致；未接 `vue-i18n` 时默认按中文处理。

```vue
<template>
  <UniConfigProvider>
    <RouterView />
  </UniConfigProvider>
</template>
```

若已使用 `createUniI18nBridge` 并传入 `localeRef`，切换语言时 Element Plus 会同步更新。详见 [I18n](/services/i18n)。
