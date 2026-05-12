import type { App } from 'vue'

import UniUpload from './index.vue'

export { UniUpload }

export default {
  install(app: App) {
    app.component('UniUpload', UniUpload)
  }
}
