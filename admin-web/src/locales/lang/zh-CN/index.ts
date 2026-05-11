import common from './common'
import dashboard from './dashboard'
import base from './modules/base'
import member from './modules/member'
import permission from './modules/permission'
import protocol from './modules/protocol'
import schoolBus from './modules/school-bus'
import schoolBusMore from './modules/school-bus-more'
import route from './route'

export default {
  app: {
    title: '智慧校园管理后台'
  },
  common,
  route,
  dashboard,
  base,
  member,
  permission,
  protocol,
  schoolBus: { ...schoolBus, ...schoolBusMore },
}
