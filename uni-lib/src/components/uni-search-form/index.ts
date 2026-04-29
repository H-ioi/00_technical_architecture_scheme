import type { App } from "vue";

import UniSearchForm from "./uni-search-form.vue";

export { UniSearchForm };

export default {
  install(app: App) {
    app.component("UniSearchForm", UniSearchForm);
  },
};
