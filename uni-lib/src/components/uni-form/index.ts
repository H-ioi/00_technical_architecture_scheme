import type { App } from "vue";

import UniForm from "./uni-form.vue";

export { UniForm };
export * from "@/types/shared";

export default {
  install(app: App) {
    app.component("UniForm", UniForm);
  },
};
