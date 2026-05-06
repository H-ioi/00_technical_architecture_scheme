import type { App } from 'vue'

import { setupBusinessUi } from './business-ui'
import { setupI18n } from './i18n'

export const setupPlugins = (app: App) => {
  setupI18n(app)
  setupBusinessUi(app)
}
