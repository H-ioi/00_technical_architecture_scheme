import { i18n } from "@/locales";
import type { ApiResponse } from "@/types/modules/http";

interface RequestOptions<TData> extends UniNamespace.RequestOptions {
  mockData?: TData;
  hideLoading?: boolean;
  loadingText?: string;
}

interface RawApiResponse<TData> {
  code?: number;
  message?: string;
  msg?: string;
  data?: TData;
  success?: boolean;
}

let apiLoadingDepth = 0;

function pushApiLoading(title?: string) {
  apiLoadingDepth += 1;
  if (apiLoadingDepth === 1) {
    const fallback = String(i18n.global.t("common.loading"));
    const t = title != null && title.trim().length > 0 ? title.trim() : fallback;
    uni.showLoading({ title: t, mask: true });
  }
}

function popApiLoading() {
  if (apiLoadingDepth > 0) {
    apiLoadingDepth -= 1;
  }
  if (apiLoadingDepth <= 0) {
    apiLoadingDepth = 0;
    uni.hideLoading();
  }
}

export function resetApiLoading() {
  apiLoadingDepth = 0;
  uni.hideLoading();
}

function resolveRequestUrl(url?: string): string {
  if (!url) {
    return "";
  }

  if (/^https?:\/\//.test(url)) {
    return url;
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
  return `${baseUrl}${url}`;
}

function normalizeResponse<TData>(rawData: unknown): ApiResponse<TData> {
  const raw = (rawData ?? {}) as RawApiResponse<TData>;
  const rawCode = raw.code;
  const code = typeof rawCode === "number" ? rawCode : raw.success ? 0 : -1;

  return {
    code,
    message: raw.message ?? raw.msg ?? "",
    data: (raw.data ?? null) as TData,
  };
}

export async function request<TData>(options: RequestOptions<TData>): Promise<ApiResponse<TData>> {
  if (options.mockData !== undefined) {
    return {
      code: 0,
      message: "ok",
      data: options.mockData,
    };
  }

  const skipLoading = options.hideLoading === true;
  if (!skipLoading) {
    pushApiLoading(options.loadingText);
  }

  const { mockData: _mock, hideLoading: _hl, loadingText: _lt, ...uniOptions } = options;

  const token = uni.getStorageSync("token");
  try {
    const result = await uni.request({
      ...uniOptions,
      method: options.method ?? "GET",
      timeout: options.timeout ?? 10000,
      url: resolveRequestUrl(options.url),
      header: {
        ...(options.header ?? {}),
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
              Token: token,
            }
          : {}),
      },
    });

    return normalizeResponse<TData>(result.data);
  } finally {
    if (!skipLoading) {
      popApiLoading();
    }
  }
}
