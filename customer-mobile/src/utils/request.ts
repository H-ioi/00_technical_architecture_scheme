/**
 * HTTP 请求封装（基于 uni-request，axios 风格 API）
 *
 * 在 main.ts 中已 side-effect 引入：`import '@/utils/request'`
 *
 * 提供方法：
 * - http.request(config)
 * - http.get(url[, config])
 * - http.post(url[, data[, config]])
 * - http.put / patch / delete / head / options
 *
 * 请求 config.headers：
 * - hideLoad: true 时不显示全局 loading
 *
 * 业务约定：
 * - 成功 code：0 或 200（见 REQUEST_CONFIG.apiSuccessCodes）
 * - 401：toast + 清 token；若配置了 loginPath 则跳转登录页
 *
 * 响应：拦截器校验 code 后，将 `res.data` 置为后端 JSON 的 **业务 data**（已剥掉 { code, message, data } 外壳）。
 *
 * 示例：
 * ```ts
 * import http from '@/utils/request'
 * const res = await http.get<UserProfile>('/user/profile')
 * const user = res.data
 * ```
 */
import { i18n } from "@/locales";
import uniRequest from "uni-request";
import type { UniRequestConfig, UniRequestResponse } from "uni-request";

/** 运行配置：域名来自 .env 的 VITE_API_BASE_URL */
const REQUEST_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? "",
  apiSuccessCodes: [0, 200] as number[],
  application: "applet",
  /** 无登录页时留空，401 仅提示不跳转 */
  loginPath: "",
  authRedirectDelayMs: 1500,
  requestTimeoutMs: 10000,
};

const TOKEN_STORAGE_KEY = "token";

/** 后端 JSON 壳：{ code, data, message | msg }；成功后在拦截器内解包，对外只暴露 data */
interface ApiBody {
  code?: number;
  data?: unknown;
  message?: string;
  msg?: string;
}

/** HTTP 状态码文案（与历史小程序项目保持一致） */
const HTTP_STATUS_MESSAGES: Record<number, string> = {
  301: "请求的数据具有新的位置且更改是永久的",
  302: "请求的数据临时具有不同 URI",
  304: "未按预期修改文档",
  305: "必须通过代理来访问请求的资源",
  400: "请求中有语法问题，或不能满足请求",
  402: "所使用的模块需要付费使用",
  403: "当前操作没有权限",
  404: "服务器找不到给定的资源",
  407: "客户机首先必须使用代理认证自身",
  415: "请求类型不支持，服务器拒绝服务",
  417: "未绑定登录账号，请使用密码登录后绑定",
  426: "用户名不存在或密码错误",
  429: "请求过于频繁",
  500: "服务器内部错误，无法完成请求",
  501: "服务不支持请求",
  502: "网络错误，服务器接收到上游服务器无效响应",
  503: "服务器无法处理请求",
  504: "网络请求超时",
  999: "系统未知错误，请反馈给管理员",
};

/** 并发请求时计数，避免先结束的请求提前 hideLoading */
let loadingDepth = 0;

function pushRequestLoading() {
  loadingDepth += 1;
  if (loadingDepth === 1) {
    uni.showLoading({
      title: String(i18n.global.t("common.loading")),
      mask: true,
    });
  }
}

function popRequestLoading() {
  if (loadingDepth > 0) {
    loadingDepth -= 1;
  }
  if (loadingDepth <= 0) {
    loadingDepth = 0;
    uni.hideLoading();
  }
}

function resetRequestLoading() {
  loadingDepth = 0;
  uni.hideLoading();
}

// —— 全局默认项 ——
uniRequest.defaults.baseURL = REQUEST_CONFIG.baseUrl;
uniRequest.defaults.timeout = REQUEST_CONFIG.requestTimeoutMs;

// —— 请求拦截 ——
uniRequest.interceptors.request.use((rawConfig) => {
  const config = rawConfig as UniRequestConfig;
  if (!config.headers) {
    config.headers = {};
  }
  const headers = config.headers;
  const hideLoad = headers.hideLoad === true || headers.hideLoad === "true";

  if (!hideLoad) {
    pushRequestLoading();
  }
  headers.application = REQUEST_CONFIG.application;
  headers["x-access-token"] = uni.getStorageSync(TOKEN_STORAGE_KEY) || "";
  if (config.method === "get") {
    config.params = { ...config.params, _t: Date.now() };
  }

  return config;
}, (err) => Promise.reject(err));

// —— 响应拦截 ——
uniRequest.interceptors.response.use((rawResponse) => {
  const response = rawResponse as UniRequestResponse<ApiBody>;
  popRequestLoading();
  uni.stopPullDownRefresh();

  const body = response.data ?? {};
  if (body.code === 401) {
    resetRequestLoading();
    try {
      uni.removeStorageSync(TOKEN_STORAGE_KEY);
    } catch {
      // ignore
    }
    const expiredMsg = body.msg || body.message || String(i18n.global.t("auth.sessionExpired"));
    uni.showToast({ title: String(i18n.global.t("auth.sessionExpired")), icon: "none", duration: 2000 });
    if (REQUEST_CONFIG.loginPath) {
      setTimeout(() => {
        uni.redirectTo({ url: REQUEST_CONFIG.loginPath });
      }, REQUEST_CONFIG.authRedirectDelayMs);
    }
    return Promise.reject(expiredMsg);
  }
  const bizCode = body.code;
  const bizOk = bizCode === undefined || REQUEST_CONFIG.apiSuccessCodes.includes(bizCode);
  if (!bizOk) {
    const errMsg = body.msg || body.message || String(i18n.global.t("common.apiError"));
    uni.showToast({ title: errMsg, icon: "none", duration: 2000 });
    return Promise.reject(errMsg);
  }
  return Promise.resolve({ ...response, data: body.data } as UniRequestResponse);
}, (rawErr) => {
  const err = rawErr as { message?: string; response?: { status?: number } };
  popRequestLoading();
  uni.stopPullDownRefresh();

  const status = err?.response?.status;
  const message = status
    ? (HTTP_STATUS_MESSAGES[status] ?? `请求失败（${status}）`)
    : err?.message || String(i18n.global.t("common.networkError"));

  uni.showToast({ title: message, icon: "none", duration: 2000 });
  return Promise.reject(err);
});

export default uniRequest;
