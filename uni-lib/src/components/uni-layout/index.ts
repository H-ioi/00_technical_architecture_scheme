import type { App } from "vue";

import UniLayout from "./index.vue";

export { UniLayout };
export * from "@/types/uni-layout";

export default {
  install(app: App) {
    app.component("UniLayout", UniLayout);
  },
};
