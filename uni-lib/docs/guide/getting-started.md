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
