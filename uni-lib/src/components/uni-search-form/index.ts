import type { App } from 'vue'

import UniSearchForm from './index.vue'

export { UniSearchForm }

export default {
  install(app: App) {
    app.component('UniSearchForm', UniSearchForm)
  }
}
