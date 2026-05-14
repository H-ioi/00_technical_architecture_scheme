import type { UniLibConfigInput } from './uni-runtime'
import type { UniPermissionOptions } from './uni-permission'
import type { UniThemeSetupOptions } from './uni-theme'

export interface UniLibInstallOptions {
  /** 组件库配置：存储前缀、HTTP、鉴权、改密接口等 */
  config?: UniLibConfigInput
  permission?: UniPermissionOptions
  theme?: UniThemeSetupOptions
  /**
   * 是否在 `install()` 初期为配套的 Element Plus 注入默认 props。
   * 当前包含：`ElInputNumber` 默认 `controlsPosition: 'right'`。
   * 须在应用首屏渲染对应组件之前执行；一般与 `app.use(ElementPlus)` 同应用生命周期内、`app.mount` 之前即可。
   *
   * 设为 `false` 时可由业务项目在入口自行调用 `ElInputNumber.setPropsDefaults(...)`。
   * @default true
   */
  applyElementPlusPropDefaults?: boolean
}
