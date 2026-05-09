import { UNI_DEFAULT_LOCALE } from "@/types/i18n";
import type {
  UniChangePasswordRuntime,
  UniHttpMessages,
  UniLibConfig,
  UniLibConfigInput,
  UniConfigShell,
} from "@/types/uni-runtime";

let config: UniLibConfig | null = null;

export const setUniConfig = (next: UniLibConfig) => {
  config = next;
};

export const getUniConfig = (): UniLibConfig => {
  if (!config) {
    throw new Error(
      "[uni-ui-lib] Config is not set. Pass options.config to app.use(UniLib, ...).",
    );
  }

  return config;
};

export const tryGetUniConfig = (): UniLibConfig | null => config;

export const UNI_DEFAULT_HTTP_MESSAGES_ZH: Required<UniHttpMessages> = {
  badResponse: "请求处理失败",
  unauthorized: "登录已过期，请重新登录",
  forbidden: "没有权限访问该资源",
  networkError: "网络异常，请稍后重试",
};

const shellLogoutDefault = "/login";

const defaultThemeTokens = {
  primaryColor: "#BA8E62",
} as const;

export const normalizeUniConfig = (
  input: UniLibConfigInput,
  defaultChangePasswordOnSuccess: () => void | Promise<void>,
): UniLibConfig => {
  const shell: UniConfigShell = {
    logoutRedirect: shellLogoutDefault,
    ...input.shell,
    themeStorageKey: input.shell?.themeStorageKey ?? `${input.name}:theme`,
    defaultTheme: {
      ...defaultThemeTokens,
      ...input.shell?.defaultTheme,
    },
  };

  const changePassword: UniChangePasswordRuntime = {
    api: input.changePassword?.api ?? {
      path: "/upms/user/edit",
      method: "put",
    },
    onSuccess:
      input.changePassword?.onSuccess ?? defaultChangePasswordOnSuccess,
  };

  return {
    name: input.name,
    defaultLocale: input.defaultLocale ?? UNI_DEFAULT_LOCALE,
    shell,
    request: {
      timeout: 60_000,
      unwrapApiEnvelope: true,
      tenantIdHeaderName: "TENANT-ID",
      ...input.request,
    },
    auth: input.auth,
    changePassword,
    httpMessages: {
      ...UNI_DEFAULT_HTTP_MESSAGES_ZH,
      ...input.httpMessages,
    },
  };
};
