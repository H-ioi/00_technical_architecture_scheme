import type { App } from "vue";

import { UniConfigProvider } from "@/components/uni-config-provider";
import { UniDataTable } from "@/components/uni-data-table";
import { UniForm } from "@/components/uni-form";
import { UniSearchForm } from "@/components/uni-search-form";
import { UniUpload } from "@/components/uni-upload";
import {
  setupPermissionDirective,
  type UniPermissionOptions,
} from "@/directives/permission";

export interface UniLibInstallOptions {
  permission?: UniPermissionOptions;
}

const components = [
  { name: "UniConfigProvider", component: UniConfigProvider },
  { name: "UniDataTable", component: UniDataTable },
  { name: "UniForm", component: UniForm },
  { name: "UniSearchForm", component: UniSearchForm },
  { name: "UniUpload", component: UniUpload },
];

export const install = (app: App, options: UniLibInstallOptions = {}) => {
  components.forEach(({ name, component }) => {
    app.component(name, component);
  });
  setupPermissionDirective(app, options.permission);
};
