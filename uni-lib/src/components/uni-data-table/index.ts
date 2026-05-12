import type { App } from 'vue'

import UniDataTable from './index.vue'

export { UniDataTable }
export * from '@/types/shared'
export * from '@/types/uni-table'

export default {
  install(app: App) {
    app.component('UniDataTable', UniDataTable)
  }
}
