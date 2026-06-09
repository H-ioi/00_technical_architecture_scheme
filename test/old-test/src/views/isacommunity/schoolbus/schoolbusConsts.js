/**
 * 校巴模块配置（仅 schoolbus 使用，勿放入全局 tabletitle.js / consts.js）
 */

export const BUS_TABLE_STYLE = {
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
};
export const BUS_APPROVAL_STATUS = [
  { label: "待审批", value: "0", enLabel: "Pending" },
  { label: "同意", value: "1", enLabel: "Agree" },
  { label: "拒绝", value: "2", enLabel: "Reject" },
];

export const BUS_PAYMENT_STATUS = [
  { label: "未缴费", value: "1", enLabel: "Unpaid" },
  { label: "缴费", value: "2", enLabel: "Paid" },
];

export const BUS_STUDENT_LINE_TYPE = [
  { label: "日校车(走读生)", value: "0", enLabel: "daily(Day Student)" },
  { label: "周校车(寄宿生)", value: "1", enLabel: "Stay" },
];

export const BUS_ROUTE_TYPE = [
  { label: "日车", value: "1", enLabel: "Daily Bus" },
  { label: "周车", value: "2", enLabel: "Weekly Bus" },
];

export const BUS_PICKUP_METHOD = [
  { label: "自行回家", enLabel: "Self Pickup", value: "1" },
  { label: "接送人接送", enLabel: "Guardian Pickup", value: "2" },
];

export const BUS_WEEKLY_DAYS = [
  { label: "Mondays", value: "Mon" },
  { label: "Tuesdays", value: "Tue" },
  { label: "Wednesdays", value: "Wed" },
  { label: "Thursdays", value: "Thu" },
  { label: "Fridays", value: "Fri" },
];

export const BUS_SERVICE_TYPE = [
  { label: "在职", id: 1, value: 1, enLabel: "Employed" },
  { label: "离职", id: 0, value: 0, enLabel: "Resign" },
];

/** 启用/禁用（路线详情车辆等） */
export const BUS_STATUS_TYPE = [
  { label: "启用", id: 1, value: 1, enLabel: "Enabled" },
  { label: "禁用", id: 0, value: 0, enLabel: "Disabled" },
];

export const BUS_VISIBLE_TYPE = [
  { label: "不可见", value: false, enLabel: "Invisible" },
  { label: "可见", value: true, enLabel: "Visible" },
];

export const BUS_CAR_STATUS = [
  { label: "空闲", id: 0, value: 0, enLabel: "Free" },
  { label: "使用", id: 1, value: 1, enLabel: "Used" },
  { label: "维修", id: 2, value: 2, enLabel: "Repair" },
];

export const BUS_OPERATION_STATUS = [
  { label: "早点", id: "0", value: "0", enLabel: "Early" },
  { label: "准点", id: "1", value: "1", enLabel: "OnTime" },
  { label: "晚点", id: "2", value: "2", enLabel: "Late" },
  { label: "到站", id: "3", value: "3", enLabel: "Arrive" },
];

export const BUS_EXCEPTION_TYPE = [
  { label: "行为异常", id: "0", value: "0", enLabel: "Behavioral Exception" },
  { label: "车辆异常", id: "1", value: "1", enLabel: "Vehicle Exception" },
];

export const BUS_STATION_TIME_TYPE = [
  { label: "上学时间", value: "1", enLabel: "School Time" },
  { label: "放学时间", value: "2", enLabel: "Home Time" },
];

export const BUS_YES_OR_NO = [
  { label: "Yes", value: "1", id: 1, enLabel: "Yes" },
  { label: "No", value: "0", id: 0, enLabel: "No" },
];

/** 缴费方式（申请/订单） */
export const BUS_PAYMENT_METHOD = [
  { label: "支付宝", value: 1, enLabel: "Alipay" },
  { label: "微信", value: 2, enLabel: "Wechat" },
  { label: "现金", value: 3, enLabel: "Cash" },
  { label: "银联", value: 4, enLabel: "UnionPay" },
];

/** 内嵌子表：绑定路线 */
export function bindRouteTableColumns(vm) {
  return [
    { label: vm.$t("schoolbus.路线"), prop: "lineName", minWidth: "140", fixed: "left" },
    { label: vm.$t("schoolbus.站点"), prop: "stationName", minWidth: "120" },
    { label: vm.$t("schoolbus.乘车类型"), prop: "lineTypeName", width: "110" },
    { label: vm.$t("schoolbus.乘车星期"), prop: "ridingWeekDay", minWidth: "120" },
    { label: vm.$t("schoolbus.车牌号"), prop: "carNumber", width: "110" },
    { label: vm.$t("schoolbus.开始时间"), prop: "ridingStartDay", width: "120" },
    { label: vm.$t("schoolbus.结束时间"), prop: "ridingEndDay", width: "120" },
  ];
}

/** 内嵌子表：接送人 */
export function bindPersonTableColumns(vm) {
  return [
    { label: vm.$t("schoolbus.关系"), prop: "pickupRelationships", width: "100" },
    { label: vm.$t("schoolbus.联系方式"), prop: "pickupPhone", minWidth: "130" },
    { label: vm.$t("schoolbus.照片"), prop: "pickupImageUrl", width: "100" },
  ];
}

/** 路线表单：绑定站点 */
export function bindStationTableColumns(vm) {
  return [
    { label: vm.$t("schoolbus.站点"), prop: "stationName", minWidth: "120" },
    { label: vm.$t("schoolbus.上学上车时间"), prop: "showGoTime", width: "130" },
    { label: vm.$t("schoolbus.放学下车时间"), prop: "showBackTime", width: "130" },
    { label: vm.$t("schoolbus.日价格"), prop: "price", width: "90" },
    { label: vm.$t("schoolbus.周价格"), prop: "weekPrice", width: "90" },
  ];
}

/** 路线详情：绑定车辆 */
export function bindCarTableColumns(vm) {
  return [
    { label: vm.$t("schoolbus.车牌号"), prop: "carNumber", minWidth: "110" },
    { label: vm.$t("schoolbus.跟车老师"), prop: "carTeacher", minWidth: "120" },
    { label: vm.$t("schoolbus.司机姓名"), prop: "driverName", minWidth: "120" },
    { label: vm.$t("schoolbus.座位数"), prop: "seatNumber", width: "90" },
    { label: vm.$t("schoolbus.照片"), prop: "carImageUrl", width: "90", isUrl: true },
  ];
}
