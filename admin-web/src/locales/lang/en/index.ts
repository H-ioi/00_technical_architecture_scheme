import type zhCN from '../zh-CN'

import common from './common'
import dashboard from './dashboard'
import base from './modules/base'
import member from './modules/member'
import protocol from './modules/protocol'
import route from './route'

const en: typeof zhCN = {
  app: {
    title: 'Smart Campus Admin'
  },
  common,
  route,
  dashboard,
  base,
  member,
  protocol
}

export default en
