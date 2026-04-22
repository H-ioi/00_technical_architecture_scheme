import type { ApiResponse } from "@/types/modules/http";

interface RequestOptions<TData> extends UniNamespace.RequestOptions {
  mockData?: TData;
}

export async function request<TData>(options: RequestOptions<TData>): Promise<ApiResponse<TData>> {
  if (options.mockData !== undefined) {
    return {
      code: 0,
      message: "ok",
      data: options.mockData,
    };
  }

  const result = await uni.request({
    method: "GET",
    timeout: 10000,
    ...options,
  });

  return (result.data ?? {
    code: -1,
    message: "empty response",
    data: null,
  }) as ApiResponse<TData>;
}
