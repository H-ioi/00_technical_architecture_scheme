import type zhCN from '../zh-CN'

import common from './common'
import dashboard from './dashboard'
import login from './login'
import route from './route'
import uniLibDemo from './modules/uni-lib-demo'

const en: typeof zhCN = {
  app: {
    title: 'Admin Web'
  },
  common,
  route,
  login,
  dashboard,
  uniLibDemo
}

export default en
