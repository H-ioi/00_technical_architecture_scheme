# 快速开始

```ts
import { createApp } from "vue";
import UniLib from "uni-lib";
import "uni-lib/style.css";

createApp(App)
  .use(UniLib, {
    permission: {
      hasPermission: (code) => permissionStore.hasPermission(code),
    },
  })
  .mount("#app");
```
