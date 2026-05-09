/**
 * 全量注册 uni-lib 组件与权限指令的 `app.use(UniLib)` 安装函数实现。
 */
import type { App } from "vue";

import { UniConfigProvider } from "@/components/uni-config-provider";
import { UniDataTable } from "@/components/uni-data-table";
import { UniForm } from "@/components/uni-form";
import { UniIcon } from "@/components/uni-icon";
import { UniLayout, UniLayoutChangePasswordDialog } from "@/components/uni-layout";
import { UniSearchForm } from "@/components/uni-search-form";
import { UniThemeSettings } from "@/components/uni-theme-settings";
import { UniUpload } from "@/components/uni-upload";
import { setupUniTheme } from "@/components/uni-theme-settings/runtime";
import { setupCopyDirective } from "@/directives/copy";
import { setupDebounceClickDirective } from "@/directives/debounce-click";
import {
  setupPermissionDirective,
} from "@/directives/permission";
import { initUniHttpClient } from "@/plugins/http-client";
import { setUniAppName } from "@/plugins/storage";
import { setUniRuntimeConfig, tryGetUniRuntimeConfig } from "@/runtime";
import type { UniLibInstallOptions } from "@/types/uni-install";

const components = [
  { name: "UniConfigProvider", component: UniConfigProvider },
  { name: "UniDataTable", component: UniDataTable },
  { name: "UniForm", component: UniForm },
  { name: "UniIcon", component: UniIcon },
  { name: "UniLayout", component: UniLayout },
  {
    name: "UniLayoutChangePasswordDialog",
    component: UniLayoutChangePasswordDialog,
  },
  { name: "UniSearchForm", component: UniSearchForm },
  { name: "UniThemeSettings", component: UniThemeSettings },
  { name: "UniUpload", component: UniUpload },
];

export const install = (app: App, options: UniLibInstallOptions = {}) => {
  if (options.runtime) {
    setUniAppName(options.runtime.name);
    setUniRuntimeConfig(options.runtime);
    initUniHttpClient();
  }

  const shell = tryGetUniRuntimeConfig()?.shell;
  setupUniTheme({
    ...(shell?.themeStorageKey != null
      ? { storageKey: shell.themeStorageKey }
      : {}),
    ...(shell?.defaultTheme != null ? { defaultTheme: shell.defaultTheme } : {}),
    ...options.theme,
  });

  components.forEach(({ name, component }) => {
    app.component(name, component);
  });
  setupPermissionDirective(app, options.permission);
  setupCopyDirective(app);
  setupDebounceClickDirective(app);
};

export type { UniLibInstallOptions } from "@/types/uni-install";
