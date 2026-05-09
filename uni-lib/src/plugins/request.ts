import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { ElMessage } from "element-plus";

import { getUniConfig } from "@/plugins/config";
import { useUserStore } from "@/stores";
import type { UniRequestOptions } from "@/types/uni-request";

export type {
  UniRequestOptions,
  UniRequestProgress,
} from "@/types/uni-request";

type UniInternalRequestConfig = InternalAxiosRequestConfig & {
  __uniRequestKey?: string;
};

type HeaderMap = Record<string, unknown>;

const DEFAULT_TIMEOUT = 15000;
const DEFAULT_TENANT_HEADER = "X-Tenant-Id";
const DEFAULT_SUCCESS_CODES = [0, 200];
const DEFAULT_MESSAGES = {
  badResponse: "请求处理失败",
  unauthorized: "登录已过期，请重新登录",
  forbidden: "没有权限访问该资源",
  networkError: "网络异常，请稍后重试",
};

const isFilled = (value: unknown) =>
  value !== undefined && value !== null && value !== "";

const getHeaders = (config: InternalAxiosRequestConfig): HeaderMap =>
  config.headers as unknown as HeaderMap;

const serializeParams = (params: unknown) => {
  if (!params || typeof params !== "object") {
    return "";
  }

  const searchParams = new URLSearchParams();
  Object.entries(params as Record<string, unknown>).forEach(([key, value]) => {
    if (!isFilled(value)) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
      return;
    }

    searchParams.append(key, String(value));
  });

  return searchParams.toString();
};

const stringifyPayload = (value: unknown) => {
  if (value === undefined || value === null || typeof value === "string") {
    return value ?? "";
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const getDuplicateKey = (
  config: InternalAxiosRequestConfig,
  preventDuplicate: UniRequestOptions["preventDuplicate"],
) => {
  if (typeof preventDuplicate === "function") {
    return preventDuplicate(config);
  }

  return [
    config.method?.toUpperCase() ?? "GET",
    config.baseURL ?? "",
    config.url ?? "",
    serializeParams(config.params),
    stringifyPayload(config.data),
  ].join("&");
};

const setCommonHeaders = (
  config: InternalAxiosRequestConfig,
  options: Pick<
    UniRequestOptions,
    "commonHeaders" | "getAccessToken" | "getTenantId" | "tenantIdHeaderName"
  >,
) => {
  const headers = getHeaders(config);
  const token = options.getAccessToken?.();
  const tenantId = options.getTenantId?.();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (options.commonHeaders) {
    Object.assign(headers, options.commonHeaders);
  }
  if (isFilled(tenantId)) {
    headers[options.tenantIdHeaderName ?? DEFAULT_TENANT_HEADER] =
      String(tenantId);
  }
};

export const createUniRequest = (
  options: UniRequestOptions = {},
): AxiosInstance => {
  const pendingRequests = new Map<string, AbortController>();
  const instance = axios.create({
    baseURL: options.baseURL,
    timeout: options.timeout ?? DEFAULT_TIMEOUT,
    headers: options.headers,
    paramsSerializer: options.paramsSerializer ?? {
      serialize: serializeParams,
    },
    validateStatus: options.validateStatus,
    withCredentials: options.withCredentials,
  });

  const clearPending = (config?: UniInternalRequestConfig) => {
    const key = config?.__uniRequestKey;
    if (!key) {
      return;
    }

    const controller = pendingRequests.get(key);
    if (!controller || controller.signal === config.signal) {
      pendingRequests.delete(key);
    }
  };

  instance.interceptors.request.use(
    async (config: UniInternalRequestConfig) => {
      options.progress?.start();
      setCommonHeaders(config, options);

      if (options.preventDuplicate) {
        const key = getDuplicateKey(config, options.preventDuplicate);
        pendingRequests.get(key)?.abort();

        const controller = new AbortController();
        pendingRequests.set(key, controller);
        config.signal = controller.signal;
        config.__uniRequestKey = key;
      }

      return options.onRequest ? options.onRequest(config) : config;
    },
    (error) => {
      options.progress?.done();
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    async (response) => {
      clearPending(response.config as UniInternalRequestConfig);
      options.progress?.done();

      const next = {
        ...response,
        data: options.parseResponseData
          ? options.parseResponseData(response.data)
          : response.data,
      };
      const resolved = options.onResponse
        ? await Promise.resolve(options.onResponse(next))
        : next;

      return resolved.data;
    },
    (error: AxiosError) => {
      clearPending(error.config as UniInternalRequestConfig);
      options.progress?.done();

      const status = error.response?.status;
      if (status === 401) {
        options.onUnauthorized?.();
      }
      if (status === 403) {
        options.onForbidden?.();
      }
      if (status === 503) {
        options.onServiceUnavailable?.();
      }

      options.onError?.(error);
      return Promise.reject(error);
    },
  );

  return instance;
};

const createApiEnvelopeParser = (
  unwrap: boolean | undefined,
  successCode: number | undefined,
  successCodes: number[] | undefined,
  userParse: UniRequestOptions["parseResponseData"],
  messages: typeof DEFAULT_MESSAGES,
) => {
  if (userParse || !unwrap) {
    return userParse;
  }

  const okCodes = successCodes?.length
    ? successCodes
    : successCode !== undefined
      ? [successCode]
      : DEFAULT_SUCCESS_CODES;

  return (data: unknown) => {
    if (data === null || typeof data !== "object" || Array.isArray(data)) {
      return data;
    }

    const result = data as Record<string, unknown>;
    if (typeof result.code !== "number") {
      return data;
    }
    if (!okCodes.includes(result.code)) {
      const message =
        (typeof result.message === "string" ? result.message : undefined) ??
        (typeof result.msg === "string" ? result.msg : undefined) ??
        messages.badResponse;

      ElMessage.error(message);
      throw new Error(message);
    }

    return result.data !== undefined ? result.data : data;
  };
};

let defaultClient: AxiosInstance | null = null;

export const initUniHttpClient = () => {
  const runtime = getUniConfig();
  const messages = {
    ...DEFAULT_MESSAGES,
    ...runtime.httpMessages,
  };
  const {
    unwrapApiEnvelope,
    apiSuccessCode,
    apiSuccessCodes,
    commonHeaders,
    getTenantId,
    tenantIdHeaderName,
    onRequest,
    parseResponseData,
    ...requestOptions
  } = runtime.request;

  defaultClient = createUniRequest({
    ...requestOptions,
    parseResponseData: createApiEnvelopeParser(
      unwrapApiEnvelope,
      apiSuccessCode,
      apiSuccessCodes,
      parseResponseData,
      messages,
    ),
    onRequest: async (config) => {
      const next = onRequest ? await onRequest(config) : config;
      const headers = getHeaders(next);
      const skipToken = headers.isToken === false;
      const token = useUserStore().accessToken;

      if (token && !skipToken) {
        headers.Authorization = `Bearer ${token}`;
      }
      if (skipToken) {
        delete headers.isToken;
      }

      setCommonHeaders(next, {
        commonHeaders,
        getTenantId,
        tenantIdHeaderName,
      });

      return next;
    },
    onUnauthorized: () => {
      useUserStore().resetAuth();
      ElMessage.error(messages.unauthorized);
      requestOptions.onUnauthorized?.();
    },
    onForbidden: () => {
      ElMessage.error(messages.forbidden);
      requestOptions.onForbidden?.();
    },
    onError: (error) => {
      ElMessage.error(error.message || messages.networkError);
      requestOptions.onError?.(error);
    },
  });
};

export const getUniRequest = (): AxiosInstance => {
  if (!defaultClient) {
    throw new Error(
      "[uni-ui-lib] HTTP client not initialized. Ensure app.use(UniLib) ran with options.config.",
    );
  }
  return defaultClient;
};

export const http = {
  get<T = unknown>(
    url: string,
    params: Record<string, unknown> = {},
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    return getUniRequest().get(url, { params, ...config });
  },

  post<T = unknown>(
    url: string,
    data: unknown = {},
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    return getUniRequest().post(url, data, config);
  },

  put<T = unknown>(
    url: string,
    data: unknown = {},
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    return getUniRequest().put(url, data, config);
  },

  patch<T = unknown>(
    url: string,
    data: unknown = {},
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    return getUniRequest().patch(url, data, config);
  },

  delete<T = unknown>(
    url: string,
    data: unknown = {},
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    return getUniRequest().delete(url, { data, ...config });
  },
};

export const request = new Proxy({} as AxiosInstance, {
  get(_target, prop, receiver) {
    return Reflect.get(getUniRequest(), prop, receiver);
  },
});
