declare module "uni-request" {
  export interface UniRequestConfig {
    url?: string;
    method?: string;
    data?: unknown;
    params?: Record<string, unknown>;
    headers?: Record<string, unknown>;
    baseURL?: string;
    timeout?: number;
    hideLoad?: boolean;
  }

  export interface UniRequestResponse<T = unknown> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
  }

  export interface UniRequestInterceptors {
    use: (
      onFulfilled: (value: unknown) => unknown,
      onRejected?: (error: unknown) => unknown,
    ) => void;
  }

  export interface UniRequestInstance {
    defaults: UniRequestConfig;
    interceptors: {
      request: UniRequestInterceptors;
      response: UniRequestInterceptors;
    };
    request<T = unknown>(config: UniRequestConfig): Promise<UniRequestResponse<T>>;
    get<T = unknown>(url: string, config?: UniRequestConfig): Promise<UniRequestResponse<T>>;
    delete<T = unknown>(url: string, config?: UniRequestConfig): Promise<UniRequestResponse<T>>;
    head<T = unknown>(url: string, config?: UniRequestConfig): Promise<UniRequestResponse<T>>;
    options<T = unknown>(url: string, config?: UniRequestConfig): Promise<UniRequestResponse<T>>;
    post<T = unknown>(
      url: string,
      data?: unknown,
      config?: UniRequestConfig,
    ): Promise<UniRequestResponse<T>>;
    put<T = unknown>(
      url: string,
      data?: unknown,
      config?: UniRequestConfig,
    ): Promise<UniRequestResponse<T>>;
    patch<T = unknown>(
      url: string,
      data?: unknown,
      config?: UniRequestConfig,
    ): Promise<UniRequestResponse<T>>;
  }

  const uniRequest: UniRequestInstance;
  export default uniRequest;
}
