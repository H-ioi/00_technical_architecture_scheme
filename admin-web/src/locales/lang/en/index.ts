import type zhCN from '../zh-CN'

import common from './common'
import dashboard from './dashboard'
import login from './login'
import member from './modules/member'
import route from './route'

const en: typeof zhCN = {
  app: {
    title: 'Smart Campus Admin'
  },
  common,
  route,
  login,
  dashboard,
  member
}

export default en
