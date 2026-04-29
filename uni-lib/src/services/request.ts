import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

type UniRequestProgress = {
  start: () => void;
  done: () => void;
};

export interface UniRequestOptions {
  baseURL?: string;
  timeout?: number;
  getAccessToken?: () => string | undefined;
  getTenantId?: () => string | number | undefined;
  onUnauthorized?: () => void;
  onForbidden?: () => void;
  onServiceUnavailable?: () => void;
  onError?: (error: Error | AxiosError) => void;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  validateStatus?: AxiosRequestConfig["validateStatus"];
  paramsSerializer?: AxiosRequestConfig["paramsSerializer"];
  preventDuplicate?: boolean | ((config: InternalAxiosRequestConfig) => string);
  progress?: UniRequestProgress;
  onRequest?: (
    config: InternalAxiosRequestConfig,
  ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
  onResponse?: (
    response: AxiosResponse,
  ) => AxiosResponse | Promise<AxiosResponse>;
}

type UniInternalRequestConfig = InternalAxiosRequestConfig & {
  __uniRequestKey?: string;
};

const pendingRequests = new Map<string, AbortController>();

const serializeParams = (params: unknown) => {
  if (!params || typeof params !== "object") {
    return "";
  }

  const searchParams = new URLSearchParams();

  Object.entries(params as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
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

const normalizeRequestPayload = (value: unknown) => {
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
    normalizeRequestPayload(config.data),
  ].join("&");
};

const removePendingRequest = (config?: UniInternalRequestConfig) => {
  const key = config?.__uniRequestKey;

  if (!key) {
    return;
  }

  pendingRequests.delete(key);
};

export const createUniRequest = (
  options: UniRequestOptions = {},
): AxiosInstance => {
  const instance = axios.create({
    baseURL: options.baseURL,
    timeout: options.timeout ?? 15000,
    headers: options.headers,
    paramsSerializer: options.paramsSerializer ?? {
      serialize: serializeParams,
    },
    validateStatus: options.validateStatus,
    withCredentials: options.withCredentials,
  });

  instance.interceptors.request.use(
    async (config: UniInternalRequestConfig) => {
      options.progress?.start();

      const token = options.getAccessToken?.();
      const tenantId = options.getTenantId?.();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (tenantId !== undefined && tenantId !== null && tenantId !== "") {
        config.headers["X-Tenant-Id"] = String(tenantId);
      }

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
  );

  instance.interceptors.response.use(
    async (response) => {
      removePendingRequest(response.config as UniInternalRequestConfig);
      options.progress?.done();

      return options.onResponse ? options.onResponse(response) : response;
    },
    (error: AxiosError) => {
      removePendingRequest(error.config as UniInternalRequestConfig);
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

export const downloadBlob = (
  data: BlobPart,
  filename: string,
  type = "application/octet-stream",
) => {
  if (typeof document === "undefined") {
    return;
  }

  const blob = data instanceof Blob ? data : new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
