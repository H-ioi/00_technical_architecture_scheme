import attendanceAccessApi from './modules/attendance-access'
import attendanceSchoolApi from './modules/attendance-school'
import attendanceStudentApi from './modules/attendance-student'
import attendanceWechatOpenidApi from './modules/attendance-wechat-openid'
import authApi from './modules/auth'
import baseDictApi from './modules/base-dict'
import captchaApi from './modules/captcha'
import membershipApi from './modules/membership'
import studentApi from './modules/member-student'
import teacherApi from './modules/member-teacher'
import menuApi from './modules/menu'
import permissionDeptApi from './modules/permission-dept'
import permissionMenuApi from './modules/permission-menu'
import permissionRoleApi from './modules/permission-role'
import permissionUserApi from './modules/permission-user'
import protocolApi from './modules/protocol'
import schoolBusCarApi from './modules/school-bus-car'
import schoolBusCommonApi from './modules/school-bus-common'
import schoolBusDriverApi from './modules/school-bus-driver'
import schoolBusExceptionApi from './modules/school-bus-exception'
import schoolBusFollowTeacherApi from './modules/school-bus-follow-teacher'
import schoolBusLineApi from './modules/school-bus-line'
import schoolBusOperationApi from './modules/school-bus-operation'
import schoolBusOrderApi from './modules/school-bus-order'
import schoolBusSectionApi from './modules/school-bus-section'
import schoolBusStationApi from './modules/school-bus-station'

export {
  attendanceAccessApi,
  attendanceSchoolApi,
  attendanceStudentApi,
  attendanceWechatOpenidApi,
  authApi,
  baseDictApi,
  captchaApi,
  membershipApi,
  studentApi,
  teacherApi,
  menuApi,
  permissionDeptApi,
  permissionMenuApi,
  permissionRoleApi,
  permissionUserApi,
  protocolApi,
  schoolBusCarApi,
  schoolBusCommonApi,
  schoolBusDriverApi,
  schoolBusExceptionApi,
  schoolBusFollowTeacherApi,
  schoolBusLineApi,
  schoolBusOperationApi,
  schoolBusOrderApi,
  schoolBusSectionApi,
  schoolBusStationApi
}
export type { CaptchaImageData } from '@/types/modules/captcha'
