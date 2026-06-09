import {
  formatLeaveDestination,
  formatOperateStatus,
  mapOperationRecordRow,
} from "../../visitRecord/utils/visitRecordOptions.js";

/** 用药申请状态 */
export const MEDICATION_APPLY_STATUS = [
  { value: 0, labelKey: "待审批" },
  { value: 1, labelKey: "待用药" },
  { value: 2, labelKey: "用药中" },
  { value: 3, labelKey: "拒绝用药" },
  { value: 4, labelKey: "结束" },
  { value: 5, labelKey: "已撤回" },
];

/** 列表筛选/列：是否申请用药 */
export const APPLY_MEDICATION_YES_NO = [
  { value: 1, labelKey: "是" },
  { value: 0, labelKey: "否" },
];

/** 表单：是否需要用药 */
export const NEED_MEDICATION_OPTIONS = [
  { value: 1, labelKey: "在校医监督下用药" },
  { value: 0, labelKey: "无需用药" },
];

export const ADMINISTRATION_TIME_OPTIONS = [
  { value: 1, labelKey: "给药时间无特殊" },
  { value: 2, labelKey: "按频率给药" },
  { value: 3, labelKey: "严格按规定时间给药" },
];

export const FREQUENCY_OPTIONS = [
  { value: 1, labelKey: "一天一次" },
  { value: 2, labelKey: "一天两次" },
  { value: 3, labelKey: "一天三次" },
  { value: 4, labelKey: "六小时一次" },
  { value: 5, labelKey: "其他" },
];

export const ROUTE_OPTIONS = [
  { value: 1, labelKey: "口服" },
  { value: 2, labelKey: "外用" },
  { value: 3, labelKey: "吸入" },
  { value: 4, labelKey: "滴眼" },
  { value: 5, labelKey: "其他" },
];

export const MEAL_TIMING_OPTIONS = [
  { value: 1, labelKey: "餐前" },
  { value: 2, labelKey: "餐后" },
];

export const LEFTOVER_DISPOSAL_OPTIONS = [
  { value: 1, labelKey: "周五放学领取" },
  { value: 2, labelKey: "周末返校家长领取" },
  { value: 3, labelKey: "护士丢弃" },
];

/** 格式化列表时间为 yyyy-MM-dd HH:mm:ss */
export function formatDateTimeMinute(value) {
  if (value === null || value === undefined || value === "") return "-";
  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(text)) return text;
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(text)) return `${text}:00`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return `${text} 00:00:00`;
  return text;
}

/** 用药详情行映射（待用药操作记录，与就诊记录-操作记录表一致） */
export function mapMedicationDetailRow(item, t) {
  const op = mapOperationRecordRow(item);
  const translate = typeof t === "function" ? t : () => "-";
  const dateTime = formatDateTimeMinute(
    item.operationTime || item.operateTime || item.visitTime || item.createTime
  );
  return {
    ...op,
    rawRecord: item,
    pendingId: item.pendingId || item.pendingMedicationId,
    visitDate: dateTime !== "-" ? dateTime.slice(0, 10) : "-",
    visitTime: dateTime,
    operateStatusText: formatOperateStatus(op.operateStatus, translate),
    specificSituation: op.specificSituation,
    leaveDestinationText: formatLeaveDestination(op.leaveDestination, translate),
    leaveTime: op.leaveTime,
    operatorName: op.operatorName,
    attachmentList: op.attachmentList || [],
  };
}

/** 新增时校验用药内容必填项，返回 i18n key */
export function validateMedicationContentList(contentList) {
  if (!contentList || !contentList.length) {
    return "请填写用药内容";
  }
  const first = contentList[0];
  if (!first.medicineName || !String(first.medicineName).trim()) {
    return "请输入药物名称";
  }
  if (!first.startDate) {
    return "请选择用药开始日期";
  }
  if (!first.endDate) {
    return "请选择用药结束日期";
  }
  return "";
}

export const NURSE_APPROVAL_OPTIONS = [
  { value: 1, labelKey: "同意" },
  { value: 2, labelKey: "拒绝" },
];

export function createEmptyContentItem() {
  return {
    medicineName: "",
    bringQuantity: "",
    dosage: "",
    startDate: "",
    endDate: "",
    administrationTimeType: undefined,
    frequencyType: undefined,
    frequencyOther: "",
    routeType: undefined,
    routeOther: "",
    mealTiming: undefined,
    sideEffects: "",
  };
}

export function createEmptyForm() {
  return {
    id: undefined,
    admissionNo: "",
    fullName: "",
    schoolId: undefined,
    grade: "",
    formCode: "",
    applyMedication: undefined,
    physicalCondition: "",
    diseaseId: undefined,
    symptomDetails: "",
    informedConsent: 0,
    contentList: [createEmptyContentItem()],
    diagnosisImageList: [],
    parentName: "",
    parentContact: "",
    parentSignaturePath: "",
    leftoverDisposal: undefined,
    remark: "",
    nurseApproval: undefined,
    nurseOperator: "",
    status: undefined,
  };
}

function findOptionLabel(options, value, t, prefix = "schoolDoctor.") {
  const item = options.find((opt) => opt.value === value);
  return item ? t(`${prefix}${item.labelKey}`) : "-";
}

export function formatApplyStatus(status, t) {
  return findOptionLabel(MEDICATION_APPLY_STATUS, status, t);
}

export function formatYesNo(value, t) {
  return findOptionLabel(APPLY_MEDICATION_YES_NO, value, t);
}

export function formatNeedMedication(value, t) {
  return findOptionLabel(NEED_MEDICATION_OPTIONS, value, t);
}

export function formatOptionValue(options, value, t, otherText) {
  const label = findOptionLabel(options, value, t);
  if (value === 5 && otherText) return `${label}：${otherText}`;
  return label;
}
