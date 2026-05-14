import type { UniLibConfigInput } from './uni-runtime'
import type { UniPermissionOptions } from './uni-permission'
import type { UniThemeSetupOptions } from './uni-theme'

export interface UniLibInstallOptions {
  /** 组件库配置：存储前缀、HTTP、鉴权、改密接口等 */
  config?: UniLibConfigInput
  permission?: UniPermissionOptions
  theme?: UniThemeSetupOptions
}
