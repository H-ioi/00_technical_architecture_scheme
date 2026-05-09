import { createPinia } from 'pinia'

export const pinia = createPinia()

export { useAppStore, usePermissionStore, useUserStore } from 'uni-ui-lib'
