import type { App } from 'vue'

import UniForm from './index.vue'

export { UniForm }
export * from '@/types/shared'
export * from '@/types/uni-form'

export default {
  install(app: App) {
    app.component('UniForm', UniForm)
  }
}
