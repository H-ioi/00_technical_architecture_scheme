export const API_PATHS = {
  membership: '/isacommunity/membership',
  protocol: '/isacommunity/protocol',
  protocolSign: '/isacommunity/protocolsign',
  /** 校车司机（旧 `api/isacommunity/busdriver.js`，前缀 `/isacommunity/busdriver`） */
  schoolBusDriver: '/isacommunity/busdriver',
  /** 校车公共下拉（旧 `api/isacommunity/buscommon.js`） */
  schoolBusCommon: '/isacommunity/buscommon',
  /** 路线运营（旧 `api/isacommunity/busoperation.js`） */
  schoolBusOperation: '/isacommunity/busoperation',
  /** 异常上报（旧 `api/isacommunity/busexception.js`） */
  schoolBusException: '/isacommunity/busexception',
  /** 路线规划-线路（旧 `api/isacommunity/route.js`，`/isacommunity/busline`） */
  schoolBusLine: '/isacommunity/busline',
  /** 学期（旧 `api/isacommunity/term.js`，`/isacommunity/bussection`） */
  schoolBusSection: '/isacommunity/bussection',
  /** 站点（旧 `api/isacommunity/station.js`，`/isacommunity/busstation`） */
  schoolBusStation: '/isacommunity/busstation',
  /** 公共字典项（旧 `api/workorder/order/orderlist.js`） */
  publicDictItem: '/publik/dict/item',
  /** 校车乘车订单 / 意向（旧 `api/isacommunity/busorder.js`，`/isacommunity/busorder`） */
  schoolBusOrder: '/isacommunity/busorder',
  /** 校车车辆（旧 `api/isacommunity/car.js`，`/isacommunity/buscarinfo`） */
  schoolBusCarInfo: '/isacommunity/buscarinfo',
  /** 跟车老师账号（旧 `api/isacommunity/user.js`，`/isacommunity/teacher/user`） */
  schoolBusFollowTeacher: '/isacommunity/teacher/user',
  /** 考勤（旧 `api/isacommunity/attendance.js`） */
  attendance: '/isacommunity/attendance',
  /** 考勤公共下拉（旧 `${attendance}/common`） */
  attendanceCommon: '/isacommunity/attendance/common',
  /** 考勤请假 REST 前缀（旧 `holiday.js` baseUrl `/attendance`，含学生每日考勤 getData/getData2） */
  attendanceHolidayRest: '/attendance',
  /** 群发邮件（旧 `api/isacommunity/mail.js`，`/isacommunity/mailing`） */
  mailing: '/isacommunity/mailing',
  /** 活动主数据（旧 `api/isacommunity/activity.js`） */
  activity: '/isacommunity/activity',
  /** 问卷（旧 `api/isacommunity/questionnaire.js`） */
  activityQuestionnaire: '/isacommunity/activity/questionnaire',
  /** 公共动态表单、文件信息等（前缀 `/publik`） */
  publik: '/publik'
} as const
