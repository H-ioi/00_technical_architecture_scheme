/** uni-lib 入口：导出组件、插件安装函数、类型与各业务工具模块（请求、鉴权、主题等）。 */
import { UniConfigProvider } from './components/uni-config-provider'
import { UniDataTable } from './components/uni-data-table'
import { UniForm } from './components/uni-form'
import { UniIcon } from './components/uni-icon'
import { UniLayout, UniLayoutChangePasswordDialog } from './components/uni-layout'
import { UniSearchForm } from './components/uni-search-form'
import { UniThemeSettings } from './components/uni-theme-settings'
import { UniUpload } from './components/uni-upload'
import UniLoginPage from './components/uni-login-page/index.vue'
import { install } from './plugins/install'
import { pinia } from './stores'
import './styles/index.scss'
import defaultLayoutLogoUrl from './assets/images/logo-top.png'

export const uniLayoutDefaultLogoUrl = defaultLayoutLogoUrl

export {
  UniConfigProvider,
  UniDataTable,
  UniForm,
  UniIcon,
  UniLayout,
  UniLayoutChangePasswordDialog,
  UniSearchForm,
  UniThemeSettings,
  UniUpload,
  UniLoginPage
}
export * from './plugins/install'
export * from './icons'
export * from './types/shared'
export * from './types/uni-table'
export * from './types/uni-form'
export * from './types/uni-runtime'
export * from './types/uni-data-table'
export * from './types/uni-layout'
export * from './types/i18n'
export * from './types/i18n-messages'
export * from './types/api'
export * from './types/user-profile'
export * from './types/uni-theme'
export * from './types/uni-request'
export * from './types/uni-permission'
export * from './types/uni-directives'
export * from './types/uni-install'
export * from './types/uni-list-state'
export * from './types/uni-options'
export * from './types/uni-login'
export * from './directives/copy'
export * from './directives/debounce-click'
export * from './directives/permission'
export * from './composables/use-uni-list-state'
export * from './composables/use-uni-permission'
export * from './stores'
export * from './plugins/request'
export * from './plugins/storage'
export * from './locales'
export * from './components/uni-theme-settings/runtime'
export * from './utils/format'
export * from './utils/copy'
export * from './utils/options'
export * from './utils/icons'
export * from './utils/pwa'

export default {
  install,
  pinia
}
