/**
 * 接口层统一出口
 *
 * 新增模块：
 * 1. 在 modules/ 下新增 <domain>.ts，默认导出 { action: { url, name, get|post... } }
 * 2. 在本文件 import 并以 xxxApi 命名导出
 * 3. 类型放在 src/types/modules/<domain>.ts
 *
 * 页面 / composable 用法：
 * ```ts
 * import { homeApi } from '@/api'
 * const status = await homeApi.status.get()
 * ```
 */
import authorityApi from './modules/authority'
import commonsApi from './modules/commons'
import homeApi from './modules/home'
export type { HomeConfigQuery, HomeConfigVO, HomeStatusVO } from '@/types/modules/home'
export { authorityApi, commonsApi, homeApi }
