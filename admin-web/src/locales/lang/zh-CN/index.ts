import common from './common'
import dashboard from './dashboard'
import login from './login'
import member from './modules/member'
import protocol from './modules/protocol'
import route from './route'

export default {
  app: {
    title: '智慧校园管理后台'
  },
  common,
  route,
  login,
  dashboard,
  member,
  protocol
}
