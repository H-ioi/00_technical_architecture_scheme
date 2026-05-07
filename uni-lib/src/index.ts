/** uni-lib 入口：导出组件、插件安装函数、类型与各业务工具模块（请求、鉴权、主题等）。 */
import { UniConfigProvider } from "./components/uni-config-provider";
import { UniDataTable } from "./components/uni-data-table";
import { UniForm } from "./components/uni-form";
import { UniSearchForm } from "./components/uni-search-form";
import { UniThemeSettings } from "./components/uni-theme-settings";
import { UniUpload } from "./components/uni-upload";
import { install } from "./plugins/install";
import "./style.scss";

export { UniConfigProvider, UniDataTable, UniForm, UniSearchForm, UniThemeSettings, UniUpload };
export * from "./plugins/install";
export * from "./types/shared";
export * from "./types/uni-data-table";
export * from "./directives/copy";
export * from "./directives/debounce-click";
export * from "./directives/permission";
export * from "./composables/use-uni-permission";
export * from "./services/request";
export * from "./services/auth";
export * from "./services/element-plus-locale";
export * from "./services/i18n";
export * from "./theme";
export * from "./utils/format";
export * from "./utils/copy";

export default {
  install,
};
