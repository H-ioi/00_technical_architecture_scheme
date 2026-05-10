import authApi from './modules/auth'
import baseDictApi from './modules/base-dict'
import captchaApi from './modules/captcha'
import membershipApi from './modules/membership'
import studentApi from './modules/member-student'
import teacherApi from './modules/member-teacher'
import menuApi from './modules/menu'
import protocolApi from './modules/protocol'
import schoolBusCommonApi from './modules/school-bus-common'
import schoolBusDriverApi from './modules/school-bus-driver'
import schoolBusExceptionApi from './modules/school-bus-exception'
import schoolBusLineApi from './modules/school-bus-line'
import schoolBusOperationApi from './modules/school-bus-operation'
import schoolBusSectionApi from './modules/school-bus-section'
import schoolBusStationApi from './modules/school-bus-station'

export {
  authApi,
  baseDictApi,
  captchaApi,
  membershipApi,
  studentApi,
  teacherApi,
  menuApi,
  protocolApi,
  schoolBusCommonApi,
  schoolBusDriverApi,
  schoolBusExceptionApi,
  schoolBusLineApi,
  schoolBusOperationApi,
  schoolBusSectionApi,
  schoolBusStationApi
}
export type { CaptchaImageData } from '@/types/modules/captcha'
