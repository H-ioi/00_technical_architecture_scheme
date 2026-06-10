import attendanceAccessApi from './modules/attendance-access'
import attendanceDailyApi from './modules/attendance-daily'
import attendanceHolidayApi from './modules/attendance-holiday'
import attendanceSchoolApi from './modules/attendance-school'
import attendanceStudentApi from './modules/attendance-student'
import attendanceWechatNoticeApi from './modules/attendance-wechat-notice'
import attendanceWechatOpenidApi from './modules/attendance-wechat-openid'
import authApi from './modules/auth'
import activityApi from './modules/activity'
import activityParentStudentApi from './modules/activity-parent-student'
import activityProgramApi from './modules/activity-program'
import activityQuestionnaireApi from './modules/activity-questionnaire'
import activityLotteryPoolApi from './modules/activity-lottery-pool'
import activityPrizeApi from './modules/activity-prize'
import activityVoteProgramApi from './modules/activity-vote-program'
import bulkEmailApi from './modules/bulk-email'
import baseDictApi from './modules/base-dict'
import captchaApi from './modules/captcha'
import contentAnnouncementApi from './modules/content-announcement'
import contentArticleApi from './modules/content-article'
import contentCategoryApi from './modules/content-category'
import contentCommonApi from './modules/content-common'
import contentDiscussionApi from './modules/content-discussion'
import contentDiscussionCommentApi from './modules/content-discussion-comment'
import contentDiscussionLikeSaveApi from './modules/content-discussion-like-save'
import contentDiscussionTagApi from './modules/content-discussion-tag'
import dormAssignRuleApi from './modules/dorm-assign-rule'
import dormBedApi from './modules/dorm-bed'
import dormBuildingApi from './modules/dorm-building'
import dormFloorApi from './modules/dorm-floor'
import dormProjectApi from './modules/dorm-project'
import dormRoomApi from './modules/dorm-room'
import dormStudentApi from './modules/dorm-student'
import contentFoodWeeklyApi from './modules/content-food-weekly'
import contentMomentApi from './modules/content-moment'
import medicalArchiveApi from './modules/medical-archive'
import medicalInfoApi from './modules/medical-info'
import membershipApi from './modules/membership'
import studentApi from './modules/member-student'
import teacherApi from './modules/member-teacher'
import menuApi from './modules/menu'
import permissionDeptApi from './modules/permission-dept'
import permissionMenuApi from './modules/permission-menu'
import permissionRoleApi from './modules/permission-role'
import permissionUserApi from './modules/permission-user'
import protocolApi from './modules/protocol'
import publicFileApi from './modules/public-file'
import schoolBusAttendanceApi from './modules/school-bus-attendance'
import schoolDoctorDiseaseSettingApi from './modules/school-doctor-disease-setting'
import schoolDoctorRegulationApi from './modules/school-doctor-regulation'
import schoolDoctorVisitRecordApi from './modules/school-doctor-visit-record'
import schoolDoctorMedicineApplyApi from './modules/school-doctor-medicine-apply'
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
import schoolEmailConfigApi from './modules/school-email-config'
import templateDynamicApi from './modules/template-dynamic'
import wechatSchoolInfoApi from './modules/wechat-school-info'

export {
  activityApi,
  activityParentStudentApi,
  activityProgramApi,
  activityLotteryPoolApi,
  activityPrizeApi,
  activityQuestionnaireApi,
  activityVoteProgramApi,
  attendanceAccessApi,
  attendanceDailyApi,
  attendanceHolidayApi,
  attendanceSchoolApi,
  attendanceStudentApi,
  attendanceWechatNoticeApi,
  attendanceWechatOpenidApi,
  authApi,
  baseDictApi,
  bulkEmailApi,
  captchaApi,
  contentAnnouncementApi,
  contentArticleApi,
  contentCategoryApi,
  contentCommonApi,
  contentDiscussionApi,
  contentDiscussionCommentApi,
  contentDiscussionLikeSaveApi,
  contentDiscussionTagApi,
  dormAssignRuleApi,
  dormBedApi,
  dormBuildingApi,
  dormFloorApi,
  dormProjectApi,
  dormRoomApi,
  dormStudentApi,
  contentFoodWeeklyApi,
  contentMomentApi,
  medicalArchiveApi,
  medicalInfoApi,
  membershipApi,
  studentApi,
  teacherApi,
  menuApi,
  permissionDeptApi,
  permissionMenuApi,
  permissionRoleApi,
  permissionUserApi,
  protocolApi,
  publicFileApi,
  schoolBusAttendanceApi,
  schoolDoctorDiseaseSettingApi,
  schoolDoctorRegulationApi,
  schoolDoctorVisitRecordApi,
  schoolDoctorMedicineApplyApi,
  schoolBusCarApi,
  schoolBusCommonApi,
  schoolBusDriverApi,
  schoolBusExceptionApi,
  schoolBusFollowTeacherApi,
  schoolBusLineApi,
  schoolBusOperationApi,
  schoolBusOrderApi,
  schoolBusSectionApi,
  schoolBusStationApi,
  schoolEmailConfigApi,
  templateDynamicApi,
  wechatSchoolInfoApi
}
export type { CaptchaImageData } from '@/types/modules/captcha'
