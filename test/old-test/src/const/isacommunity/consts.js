export default {
  tablestyle: {
    headercellstyle: {
      background: "#F5F8FD",
      color: "#333333 !important",
      "font-size": "14px",
      "font-weight": "400",
      height: "38px",
      "font-family": "AlibabaPuHuiTiM",
    },
    rowstyle: {
      color: " #666666",
      "font-size": "14px",
      "font-weight": "400",
      height: "44px",
      padding: "0px",
    },
  },
  // 校区ids
  schoolIds: {
    ISAIC: "爱莎科创中心",
    "CL6-0003": "武汉爱莎文华高级中学",
    "ISAWH-AC": "爱莎武汉国际学苑",
    ISALW: "爱莎荔湾学校",
    ISAIEG: "爱莎国际教育集团",
    "CL6-0002": "武汉爱莎外籍人员子女学校",
    "CL6-0001": "武汉爱莎文华学校",
    "CL5-0002": "广州荔湾爱莎外籍人员子女学校",
    "CL5-0001": "广州荔湾爱莎文华学校",
    ISA: "爱莎国际学苑",
    "CL4-4268": "爱莎文华国际课程学院A Level中心",
    "CL3-323": "广州科学城爱莎外籍人员子女学校",
    "CL2-1312": "广州外国语爱莎文华IB国际课程",
    "CL1-ISG": "广州天河爱莎外籍人员子女学校",
  },
  isOrNo: [
    { label: "Yes", value: "1", id: 1, enLabel: "Yes" },
    { label: "No", value: "0", id: 0, enLabel: "No" },
  ],
  studentStatus: [
    // { label: "Applied", value: '0' },
    { label: "Enrolled", value: "1" },
    { label: "Leaving", value: "2" },
  ],
  teacherStatus: [
    { label: "Unarchived", value: "0" },
    { label: "Archived", value: "1" },
  ],
  genderList: [
    { label: "Male", value: "1" },
    { label: "Female", value: "0" },
    { label: "Unknow", value: "0" },
  ],
  // 审批状态
  approvalStatus: [
    { label: "待审批", value: "0", enLabel: "Pending" },
    { label: "同意", value: "1", enLabel: "Agree" },
    { label: "拒绝", value: "2", enLabel: "Reject" },
  ],
  // 缴费状态
  paymentStatus: [
    { label: "未缴费", value: "1", enLabel: "Unpaid" },
    { label: "缴费", value: "2", enLabel: "Paid" },
    // { label: "退费", value: '3', enLabel: "Refund", },
  ],
  // 乘车类型
  studentLineType: [
    { label: "日校车(走读生)", value: "0", enLabel: "daily(Day Student)" },
    { label: "周校车(寄宿生)", value: "1", enLabel: "Stay" },
  ],
  // 路线类型
  routeType: [
    { label: "日车", value: "1", enLabel: "Daily Bus" },
    { label: "周车", value: "2", enLabel: "Weekly Bus" },
  ],
  // 订单路线类型
  orderRouteType: [
    { label: "日车", value: "1", enLabel: "Daily Bus" },
    { label: "周车", value: "2", enLabel: "Weekly Bus" },
  ],
  // 接送方式
  pickupMethod: [
    { label: "自行回家", enLabel: "Self Pickup", value: "1" },
    { label: "接送人接送", enLabel: "Guardian Pickup", value: "2" },
  ],
  WeeklyDays: [
    { label: "Mondays", value: "Mon" },
    { label: "Tuesdays", value: "Tue" },
    { label: "Wednesdays", value: "Wed" },
    { label: "Thursdays", value: "Thu" },
    { label: "Fridays", value: "Fri" },
    // { label: "Saturdays", value: 'Sat' },
    // { label: "Sundays", value: 'Sun' },
  ],
  // 状态
  statusType: [
    { label: "启用", id: 1, value: 1, enLabel: "Enabled" },
    { label: "禁用", id: 0, value: 0, enLabel: "Disabled" },
  ],
  // 在职状态
  serviceType: [
    { label: "在职", id: 1, value: 1, enLabel: "Employed" },
    { label: "离职", id: 0, value: 0, enLabel: "Resign" },
  ],
  // 可见状态
  visibleType: [
    { label: "不可见", value: false, enLabel: "Invisible" },
    { label: "可见", value: true, enLabel: "Visible" },
  ],
  paymentMethod: [
    { label: "支付宝", value: 1, enLabel: "Alipay" },
    { label: "微信", value: 2, enLabel: "Wechat" },
    { label: "现金", value: 3, enLabel: "Cash" },
    { label: "银联", value: 4, enLabel: "UnionPay" },
  ],
  // 车辆状态
  carStatus: [
    { label: "空闲", id: 0, value: 0, enLabel: "Free" },
    { label: "使用", id: 1, value: 1, enLabel: "Used" },
    { label: "维修", id: 2, value: 2, enLabel: "Repair" },
  ],
  // 路线运营状态
  operationStatus: [
    { label: "早点", id: "0", value: "0", enLabel: "Early" },
    { label: "准点", id: "1", value: "1", enLabel: "OnTime" },
    { label: "晚点", id: "2", value: "2", enLabel: "Late" },
    { label: "到站", id: "3", value: "3", enLabel: "Arrive" },
  ],
  // 异常状态
  exceptionType: [
    { label: "行为异常", id: "0", value: "0", enLabel: "Behavioral Exception" },
    { label: "车辆异常", id: "1", value: "1", enLabel: "Vehicle Exception" },
  ],
  // 时间类型
  stationTimeType: [
    { label: "上学时间", value: "1", enLabel: "School Time" },
    { label: "放学时间", value: "2", enLabel: "Home Time" },
  ],
  yesOrno: [
    {
      label: "是",
      enLabel: "Yes",
      value: "1",
      id: "1",
      boolean: true,
    },
    {
      label: "否",
      enLabel: "No",
      value: "0",
      id: "0",
      boolean: false,
    },
  ],
  successOrfail: [
    {
      label: "成功",
      enLabel: "Success",
      value: "1",
      id: "1",
    },
    {
      label: "失败",
      enLabel: "Fail",
      value: "0",
      id: "0",
    },
  ],
  // 活动状态
  activityStatus: [
    { label: "待发布", id: "0", value: "0", enLabel: "Pending" },
    { label: "已发布", id: "1", value: "1", enLabel: "Published" },
    { label: "已开始", id: "2", value: "2", enLabel: "Started" },
    { label: "已结束", id: "3", value: "3", enLabel: "Ended" },
  ],
  // 活动状态
  activityCheckinMethod: [
    { label: "自助签到", id: "0", value: "0", enLabel: "SelfCheckin" },
    { label: "员工扫码验票", id: "1", value: "1", enLabel: "EmployeeScan" },
    // { label: "自助扫码验票", id: "2", value: "2", enLabel: "SelfScan" },
    { label: "无需签到", id: "2", value: "2", enLabel: "NoCheckin" },
  ],
  programStatus: [
    { label: "待开始", id: "0", value: "0", enLabel: "Pending" },
    { label: "进行中", id: "1", value: "1", enLabel: "In progress" },
    { label: "已结束", id: "2", value: "2", enLabel: "Ended" },
  ],
  programType: [
    { label: "抽奖", id: "1", value: "1", enLabel: "Lottery draw" },
    { label: "比赛", id: "2", value: "2", enLabel: "Competition" },
    { label: "祝福", id: "3", value: "3", enLabel: "Blessing" },
  ],
  blessingDisplayRule: [
    {
      label: "从上到下",
      enLabel: "From top to bottom",
      value: "1",
      id: "1",
    },
    {
      label: "从左到右",
      enLabel: "From left to right",
      value: "0",
      id: "0",
    },
  ],
  lotteryParticipantScope: [
    {
      label: "所有人员",
      enLabel: "All personnel",
      value: "0",
      id: "0",
    },
    {
      label: "未中奖人员",
      enLabel: "Unwon participants",
      value: "1",
      id: "1",
    },
  ],
  lotteryIdentifierType: [
    {
      label: "无",
      enLabel: "None",
      value: "0",
      id: "0",
    },
    {
      label: "手机号",
      enLabel: "Phone number",
      value: "1",
      id: "1",
    },
    {
      label: "邮箱",
      enLabel: "Email",
      value: "2",
      id: "2",
    },
  ],
  attendanceOpenType: [
    {
      label: "刷卡开门",
      enLabel: "Card Open",
      value: "51",
      id: "51",
    },
    {
      label: "非法刷卡开门",
      enLabel: "Illegal Card Open",
      value: "52",
      id: "52",
    },
    {
      label: "人脸开门",
      enLabel: "Face Open",
      value: "61",
      id: "61",
    },
    {
      label: "非法人脸开门",
      enLabel: "Illegal Face Open",
      value: "62",
      id: "62",
    },
  ],
  attendanceSchoolType: [
    {
      label: "无记录",
      enLabel: "No Record",
      value: "0",
      id: "0",
    },
    {
      label: "入校",
      enLabel: "On Site",
      value: "1",
      id: "1",
    },
    {
      label: "离校",
      enLabel: "Off Site",
      value: "2",
      id: "2",
    },
    {
      label: "请假",
      enLabel: "Leave",
      value: "3",
      id: "3",
    },
    {
      label: "缺勤",
      enLabel: "Absent",
      value: "4",
      id: "4",
    },
  ],
  wechatOpenidType: [
    {
      label: "归档",
      enLabel: "Archived",
      value: "1",
      id: "1",
    },
    {
      label: "使用中",
      enLabel: "Active",
      value: "0",
      id: "0",
    },
  ],
  cardStatus: [
    {
      label: "过期",
      enLabel: "Expired",
      value: "0",
      id: "0",
    },
    {
      label: "使用中",
      enLabel: "Active",
      value: "1",
      id: "1",
    },
  ],
  enterOrExit: [
    {
      label: "入校",
      enLabel: "Enter",
      value: "1",
      id: "1",
    },
    {
      label: "离校",
      enLabel: "Exit",
      value: "2",
      id: "2",
    },
    {
      label: "请假",
      enLabel: "Leave",
      value: "3",
      id: "3",
    },
    {
      label: "缺勤",
      enLabel: "Absent",
      value: "4",
      id: "4",
    },
  ],
  urgencyLevel: [
    {
      label: "一般",
      enLabel: "General",
      value: 1,
      id: 1,
    },
    {
      label: "紧急",
      enLabel: "Urgent",
      value: 2,
      id: 2,
    },
  ],
  articleImportent: [
    {
      label: "一般",
      enLabel: "General",
      value: 1,
      id: 1,
    },
    {
      label: "重要",
      enLabel: "Important",
      value: 2,
      id: 2,
    },
  ],
  wechatOption: [
    {
      label: "无",
      enLabel: "Null",
      value: 0,
      id: 0,
    },
    {
      label: "草稿",
      enLabel: "Draft",
      value: 1,
      id: 1,
    },
    // {
    //   label: "直接发布",
    //   enLabel: "Publish",
    //   value: 2,
    //   id: 2,
    // },
    // {
    //   label: "群发推送",
    //   enLabel: "Mass Push",
    //   value: 3,
    //   id: 3,
    // },
  ],
  scopeList: [
    // {
    //   label: "不公开",
    //   enLabel: "Not Public",
    //   value: 0,
    //   id: 0,
    // },
    {
      label: "公开",
      enLabel: "Public",
      value: 1,
      id: 1,
    },
    {
      label: "校内",
      enLabel: "School",
      value: 2,
      id: 2,
    },
  ],
};
