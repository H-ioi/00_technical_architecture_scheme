import type { App } from "vue";

import UniDataTable from "./uni-data-table.vue";

export { UniDataTable };
export * from "@/types/shared";

export default {
  install(app: App) {
    app.component("UniDataTable", UniDataTable);
  },
};
