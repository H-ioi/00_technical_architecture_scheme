import { UniDataTable } from "./components/uni-data-table";
import { UniForm } from "./components/uni-form";
import { UniSearchForm } from "./components/uni-search-form";
import { UniUpload } from "./components/uni-upload";
import { install } from "./plugins/install";
import "./style.scss";

export { UniDataTable, UniForm, UniSearchForm, UniUpload };
export * from "./plugins/install";
export * from "./types/shared";
export * from "./directives/permission";
export * from "./composables/use-uni-permission";
export * from "./services/request";
export * from "./services/auth";
export * from "./services/i18n";
export * from "./theme";
export * from "./utils/format";
export * from "./utils/copy";

export default {
  install,
};
