import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

export type UniRequestProgress = {
  start: () => void;
  done: () => void;
};

export interface UniRequestOptions {
  baseURL?: string;
  timeout?: number;
  getAccessToken?: () => string | undefined;
  getTenantId?: () => string | number | undefined;
  /** 默认 <code>X-Tenant-Id</code>，可改为如 <code>TENANT-ID</code> */
  tenantIdHeaderName?: string;
  /** 每次请求合并的固定请求头（如 <code>version</code>） */
  commonHeaders?: Record<string, string>;
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
  /**
   * 在默认响应处理前解析 <code>response.data</code>（如 <code>{ code, data, message }</code> 业务壳）。
   * 抛出错误将走 Axios 错误链路。
   */
  parseResponseData?: (data: unknown) => unknown;
}
