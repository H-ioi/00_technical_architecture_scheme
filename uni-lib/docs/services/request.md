# Request

`createUniRequest()` 基于 Axios 创建请求实例，支持 token、租户、401 回调和统一错误出口。

## 基础用法

```ts
import { createUniRequest } from "uni-ui-lib";

const request = createUniRequest({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  getAccessToken: () => userStore.accessToken,
  getTenantId: () => tenantStore.currentTenantId,
  onUnauthorized: () => userStore.logout(),
  onForbidden: () => router.replace("/403"),
  onError: (error) => {
    console.error(error);
  },
});
```

## 配置项

| 属性                   | 说明                                        |
| ---------------------- | ------------------------------------------- |
| `baseURL`              | Axios `baseURL`                             |
| `timeout`              | 超时时间，默认 `15000`                      |
| `headers`              | 默认请求头                                  |
| `withCredentials`      | 是否携带 cookie                             |
| `getAccessToken`       | 获取 access token，自动写入 `Authorization` |
| `getTenantId`          | 获取租户 ID，自动写入 `X-Tenant-Id`         |
| `onUnauthorized`       | 401 回调                                    |
| `onForbidden`          | 403 回调                                    |
| `onServiceUnavailable` | 503 回调                                    |
| `onError`              | 统一错误回调                                |
| `paramsSerializer`     | 自定义 query 序列化                         |
| `preventDuplicate`     | 重复请求取消；可传 `true` 或自定义 key 函数 |
| `progress`             | 请求开始/结束回调，可接入 NProgress         |
| `onRequest`            | 请求拦截扩展                                |
| `onResponse`           | 响应拦截扩展                                |

## 重复请求与进度

```ts
const request = createUniRequest({
  preventDuplicate: true,
  progress: {
    start: () => NProgress.start(),
    done: () => NProgress.done(),
  },
});
```

## 下载 Blob

```ts
import { downloadBlob } from "uni-ui-lib";

const response = await request.get("/export", { responseType: "blob" });
downloadBlob(response.data, "export.xlsx");
```

组件库只负责请求实例与通用协议，不写死具体接口路径、错误码全集或登录跳转路由。
