import { createPinia, defineStore as piniaDefineStore } from 'pinia'

/** 与 uni-lib 各 store 配套的单一实例；宿主 `app.use(pinia)` 须早于使用 store / `app.use(UniLib)`。 */
export const pinia = createPinia()
export const defineStore = piniaDefineStore

export { useAppStore } from './modules/app'
export { useMenuStore } from './modules/menu'
export { usePermissionCodeStore } from './modules/permission-code'
export { useRouteAccessStore } from './modules/route-access'
export { useUniTagsViewStore } from './modules/tags-view'
export { useUserStore } from './modules/user'
