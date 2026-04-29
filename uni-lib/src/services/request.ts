import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

export interface UniRequestOptions {
  baseURL?: string;
  timeout?: number;
  getAccessToken?: () => string | undefined;
  getTenantId?: () => string | number | undefined;
  onUnauthorized?: () => void;
  onError?: (error: Error | AxiosError) => void;
  headers?: Record<string, string>;
}

export const createUniRequest = (
  options: UniRequestOptions = {},
): AxiosInstance => {
  const instance = axios.create({
    baseURL: options.baseURL,
    timeout: options.timeout ?? 15000,
    headers: options.headers,
  });

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = options.getAccessToken?.();
    const tenantId = options.getTenantId?.();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (tenantId !== undefined && tenantId !== null && tenantId !== "") {
      config.headers["X-Tenant-Id"] = String(tenantId);
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        options.onUnauthorized?.();
      }

      options.onError?.(error);
      return Promise.reject(error);
    },
  );

  return instance;
};
