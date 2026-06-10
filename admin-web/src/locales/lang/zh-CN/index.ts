import common from './common'
import content from './modules/content'
import dorm from './modules/dorm'
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
import schoolDoctor from './modules/school-doctor'
import route from './route'

export default {
  app: {
    title: '智慧校园管理后台'
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
