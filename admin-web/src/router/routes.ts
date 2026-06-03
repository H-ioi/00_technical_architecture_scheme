import type { AppRouteRecord } from '@/types/route'

import { forbiddenRoute, loginRoute, notFoundRoute } from './modules/constant'
import { layoutRoute } from './modules/layout'

/** 静态路由表（登录、布局子路由、403/404），按业务域拆分见 `router/modules/` */
export const routes: AppRouteRecord[] = [loginRoute, layoutRoute, forbiddenRoute, notFoundRoute]
