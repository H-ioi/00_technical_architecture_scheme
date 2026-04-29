import type { App } from "vue";

import UniUpload from "./uni-upload.vue";

export { UniUpload };

export default {
  install(app: App) {
    app.component("UniUpload", UniUpload);
  },
};
