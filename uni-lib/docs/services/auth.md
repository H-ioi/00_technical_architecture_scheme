# Auth

`createUniAuth()` 提供登录、退出、刷新 token 和 token 变更通知协议，由业务工程注入真实接口。

## 基础用法

```ts
import { createUniAuth } from "uni-ui-lib";

const auth = createUniAuth({
  login: (credentials) => api.login(credentials),
  logout: () => api.logout(),
  refreshToken: (refreshToken) => api.refreshToken(refreshToken),
  onRefreshError: () => {
    tokenStore.clear();
  },
  clearTokenOnRefreshError: true,
  onTokenChange: (tokens) => {
    if (tokens) {
      tokenStore.set(tokens);
    } else {
      tokenStore.clear();
    }
  },
});
```

## 返回方法

| 方法           | 说明                         |
| -------------- | ---------------------------- |
| `login`        | 调用业务登录接口并保存 token |
| `logout`       | 调用退出逻辑并清空 token     |
| `refreshToken` | 使用 refresh token 刷新令牌  |
| `getTokens`    | 获取当前 token               |
| `getUser`      | 获取登录返回的用户信息       |
| `setTokens`    | 手动更新 token               |
| `clearToken`   | 清空 token                   |

认证服务只维护 token 生命周期和回调协议，不包含登录页 UI、品牌资源、租户入口或路由跳转。
