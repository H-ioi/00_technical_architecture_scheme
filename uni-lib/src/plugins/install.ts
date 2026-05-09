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
import { setupCopyDirective } from "@/directives/copy";
import { setupDebounceClickDirective } from "@/directives/debounce-click";
import {
  setupPermissionDirective,
  type UniPermissionOptions,
} from "@/directives/permission";
import { initUniHttpClient } from "@/plugins/http-client";
import { setUniStoragePrefix } from "@/plugins/storage";
import { setUniRuntimeConfig, type UniLibRuntimeOptions } from "@/runtime/config";
import {
  setupUniTheme,
  type UniThemeSetupOptions,
} from "@/components/uni-theme-settings/runtime";

export interface UniLibInstallOptions {
  /** 模板注入：存储前缀、HTTP、鉴权、改密接口等 */
  runtime?: UniLibRuntimeOptions;
  permission?: UniPermissionOptions;
  theme?: UniThemeSetupOptions;
}

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
    setUniStoragePrefix(options.runtime.storagePrefix);
    setUniRuntimeConfig(options.runtime);
    initUniHttpClient();
  }

  if (options.theme) {
    setupUniTheme(options.theme);
  }

  components.forEach(({ name, component }) => {
    app.component(name, component);
  });
  setupPermissionDirective(app, options.permission);
  setupCopyDirective(app);
  setupDebounceClickDirective(app);
};
