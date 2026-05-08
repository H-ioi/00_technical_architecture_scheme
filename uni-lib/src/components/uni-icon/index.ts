import type { App } from "vue";

import UniIcon from "./index.vue";

export { UniIcon };

export default {
  install(app: App) {
    app.component("UniIcon", UniIcon);
  },
};
