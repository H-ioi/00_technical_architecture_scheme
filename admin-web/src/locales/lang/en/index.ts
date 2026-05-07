import type zhCN from '../zh-CN'

import common from './common'
import dashboard from './dashboard'
import login from './login'
import member from './modules/member'
import route from './route'
import uniLibDemo from './modules/uni-lib-demo'

const en: typeof zhCN = {
  app: {
    title: 'Smart Campus Admin'
  },
  common,
  route,
  login,
  dashboard,
  member,
  uniLibDemo
}

export default en
