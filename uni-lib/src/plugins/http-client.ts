import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { ElMessage } from "element-plus";

import { getUniRuntimeConfig } from "@/runtime/config";
import { createUniRequest } from "@/plugins/request";
import { useUserStore } from "@/stores/uni-user";

let client: AxiosInstance | null = null;

const resolveSuccessCodes = (
  apiSuccessCodes: number[] | undefined,
  apiSuccessCode: number | undefined,
): number[] => {
  if (apiSuccessCodes?.length) {
    return apiSuccessCodes;
  }

  if (apiSuccessCode !== undefined) {
    return [apiSuccessCode];
  }

  return [0, 200];
};

const mergeParseResponseData = (
  unwrap: boolean | undefined,
  apiSuccessCodes: number[] | undefined,
  apiSuccessCode: number | undefined,
  userParse: ((data: unknown) => unknown) | undefined,
  msg: ReturnType<typeof getUniRuntimeConfig>["httpMessages"],
) => {
  if (userParse) {
    return userParse;
  }

  if (!unwrap) {
    return undefined;
  }

  const successCodes = resolveSuccessCodes(apiSuccessCodes, apiSuccessCode);

  return (data: unknown) => {
    if (data === null || typeof data !== "object") {
      return data;
    }

    if (Array.isArray(data)) {
      return data;
    }

    const result = data as Record<string, unknown>;

    if (typeof result.code !== "number") {
      return data;
    }

    if (!successCodes.includes(result.code)) {
      const message =
        (typeof result.message === "string" ? result.message : undefined) ??
        (typeof result.msg === "string" ? result.msg : undefined);

      ElMessage.error(message || msg?.badResponse || "请求处理失败");
      throw new Error(message || msg?.badResponse || "请求处理失败");
    }

    return result.data !== undefined ? result.data : data;
  };
};

const applyAuthAndTenantHeaders = (
  config: InternalAxiosRequestConfig,
  opts: {
    getTenantId?: () => string | number | undefined;
    commonHeaders?: Record<string, string>;
    tenantIdHeaderName?: string;
  },
) => {
  const headers = config.headers as unknown as Record<string, unknown>;

  const skipSessionBearer = headers.isToken === false;
  const token = useUserStore().accessToken;

  if (token && !skipSessionBearer) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (skipSessionBearer) {
    delete headers.isToken;
  }

  if (opts.commonHeaders) {
    Object.assign(headers, opts.commonHeaders);
  }

  const tenantId = opts.getTenantId?.();

  if (tenantId !== undefined && tenantId !== null && tenantId !== "") {
    const tenantKey = opts.tenantIdHeaderName ?? "X-Tenant-Id";
    headers[tenantKey] = String(tenantId);
  }

  return config;
};

export const initUniHttpClient = () => {
  const rt = getUniRuntimeConfig();
  const msg = rt.httpMessages ?? {};

  const {
    unwrapApiEnvelope,
    apiSuccessCode,
    apiSuccessCodes,
    onRequest: userOnRequest,
    getTenantId,
    commonHeaders,
    tenantIdHeaderName,
    parseResponseData: userParseResponse,
    ...axiosOptions
  } = rt.request;

  const parseResponseData = mergeParseResponseData(
    unwrapApiEnvelope,
    apiSuccessCodes,
    apiSuccessCode,
    userParseResponse,
    msg,
  );

  const chainOnRequest = async (config: InternalAxiosRequestConfig) => {
    let next = config;

    if (userOnRequest) {
      next = await userOnRequest(next);
    }

    next = applyAuthAndTenantHeaders(next, {
      getTenantId,
      commonHeaders,
      tenantIdHeaderName,
    });

    if (
      next.method?.toLowerCase() === "get" &&
      !axiosOptions.paramsSerializer
    ) {
      next.paramsSerializer = {
        serialize: (params) => {
          const searchParams = new URLSearchParams();

          Object.entries((params ?? {}) as Record<string, unknown>).forEach(
            ([key, value]) => {
              if (value === undefined || value === null || value === "") {
                return;
              }

              if (Array.isArray(value)) {
                value.forEach((item) => searchParams.append(key, String(item)));
                return;
              }

              searchParams.append(key, String(value));
            },
          );

          return searchParams.toString();
        },
      };
    }

    return next;
  };

  client = createUniRequest({
    ...axiosOptions,
    getAccessToken: undefined,
    getTenantId: undefined,
    parseResponseData,
    onRequest: chainOnRequest,
    onUnauthorized: () => {
      useUserStore().resetAuth();
      ElMessage.error(msg.unauthorized || "登录已过期，请重新登录");
      axiosOptions.onUnauthorized?.();
    },
    onForbidden: () => {
      ElMessage.error(msg.forbidden || "没有权限访问该资源");
      axiosOptions.onForbidden?.();
    },
    onError: (error) => {
      ElMessage.error(
        error.message || msg.networkError || "网络异常，请稍后重试",
      );
      axiosOptions.onError?.(error);
    },
  });
};

export const getUniRequest = (): AxiosInstance => {
  if (!client) {
    throw new Error(
      "[uni-ui-lib] HTTP client not initialized. Ensure app.use(UniLib) ran with options.runtime.",
    );
  }

  return client;
};

/**
 * 与模板项目中 Axios 实例用法一致：在 <code>app.use(UniLib, {{ runtime }})</code> 之后可用。
 */
export const request = new Proxy({} as AxiosInstance, {
  get(_target, prop, receiver) {
    return Reflect.get(getUniRequest(), prop, receiver);
  },
});
