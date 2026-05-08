/**
 * 全量注册 uni-lib 组件与权限指令的 `app.use(UniLib)` 安装函数实现。
 */
import type { App } from "vue";

import { UniConfigProvider } from "@/components/uni-config-provider";
import { UniDataTable } from "@/components/uni-data-table";
import { UniForm } from "@/components/uni-form";
import { UniIcon } from "@/components/uni-icon";
import { UniSearchForm } from "@/components/uni-search-form";
import { UniThemeSettings } from "@/components/uni-theme-settings";
import { UniUpload } from "@/components/uni-upload";
import { setupCopyDirective } from "@/directives/copy";
import { setupDebounceClickDirective } from "@/directives/debounce-click";
import {
  setupPermissionDirective,
  type UniPermissionOptions,
} from "@/directives/permission";
import { createUniI18nBridge, type UniI18nBridge } from "@/services/i18n";
import { setupUniTheme, type UniThemeSetupOptions } from "@/theme";

export interface UniLibInstallOptions {
  i18n?: UniI18nBridge;
  permission?: UniPermissionOptions;
  theme?: UniThemeSetupOptions;
}

const components = [
  { name: "UniConfigProvider", component: UniConfigProvider },
  { name: "UniDataTable", component: UniDataTable },
  { name: "UniForm", component: UniForm },
  { name: "UniIcon", component: UniIcon },
  { name: "UniSearchForm", component: UniSearchForm },
  { name: "UniThemeSettings", component: UniThemeSettings },
  { name: "UniUpload", component: UniUpload },
];

export const install = (app: App, options: UniLibInstallOptions = {}) => {
  if (options.i18n) {
    createUniI18nBridge(options.i18n);
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
