import type zhCN from '../zh-CN'

import common from './common'
import dashboard from './dashboard'
import activity from './modules/activity'
import content from './modules/content'
import dorm from './modules/dorm'
import email from './modules/email'
import attendance from './modules/attendance'
import base from './modules/base'
import member from './modules/member'
import permission from './modules/permission'
import protocol from './modules/protocol'
import schoolBus from './modules/school-bus'
import schoolBusMore from './modules/school-bus-more'
import schoolDoctor from './modules/school-doctor'
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
  content,
  dorm,
  attendance,
  base,
  member,
  permission,
  protocol,
  schoolBus: { ...schoolBus, ...schoolBusMore },
  schoolDoctor
}

export default en
