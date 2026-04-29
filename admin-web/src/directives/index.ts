import type { App } from 'vue'

import { permissionDirective } from './permission'

export const setupDirectives = (app: App) => {
  app.directive('permission', permissionDirective)
}
