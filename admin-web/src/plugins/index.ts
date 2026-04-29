import type { App } from 'vue'

import { setupBusinessUi } from './business-ui'

export const setupPlugins = (app: App) => {
  setupBusinessUi(app)
}
