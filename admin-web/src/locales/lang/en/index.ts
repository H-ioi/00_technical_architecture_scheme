import type zhCN from '../zh-CN'

import common from './common'
import dashboard from './dashboard'
import activity from './modules/activity'
import email from './modules/email'
import attendance from './modules/attendance'
import base from './modules/base'
import member from './modules/member'
import permission from './modules/permission'
import protocol from './modules/protocol'
import schoolBus from './modules/school-bus'
import schoolBusMore from './modules/school-bus-more'
import route from './route'

const en: typeof zhCN = {
  app: {
    title: 'Smart Campus Admin'
  },
  common,
  route,
  dashboard,
  activity,
  email,
  attendance,
  base,
  member,
  permission,
  protocol,
  schoolBus: { ...schoolBus, ...schoolBusMore }
}

export default en
