import type { App } from "vue";

import UniLayoutChangePasswordDialog from "./components/change-password-dialog.vue";
import UniLayout from "./index.vue";

export { UniLayout, UniLayoutChangePasswordDialog };
export * from "@/types/uni-layout";

export default {
  install(app: App) {
    app.component("UniLayout", UniLayout);
    app.component(
      "UniLayoutChangePasswordDialog",
      UniLayoutChangePasswordDialog,
    );
  },
};
