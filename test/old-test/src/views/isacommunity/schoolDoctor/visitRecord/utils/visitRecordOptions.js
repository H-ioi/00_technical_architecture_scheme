import {
  ADMINISTRATION_TIME_OPTIONS,
  formatOptionValue,
  FREQUENCY_OPTIONS,
  MEAL_TIMING_OPTIONS,
  ROUTE_OPTIONS,
} from "../../medicineApply/utils/medicationApplyOptions.js";

/** 待用药列表状态展示（结合待用药记录与用药申请状态） */
export const PENDING_STATUS = [
  { value: 0, labelKey: "待用药" },
  { value: 1, labelKey: "已结束" },
];

/** 待用药列表搜索状态 */
export const PENDING_SEARCH_STATUS = [
  { value: "waiting", labelKey: "待用药" },
  { value: "inProgress", labelKey: "用药中" },
  { value: "ended", labelKey: "已结束" },
];

/** 待用药记录 status=1（已结束） */
export const PENDING_MEDICATION_STATUS_ENDED = 1;
/** 用药申请 status=1（待用药） */
export const APPLICATION_STATUS_WAITING_MEDICATION = 1;
/** 用药申请 status=2（用药中） */
export const APPLICATION_STATUS_IN_PROGRESS = 2;

/** 离开去向 */
export const LEAVE_DESTINATION_OPTIONS = [
  { value: 1, labelKey: "课室" },
  { value: 2, labelKey: "回家" },
  { value: 3, labelKey: "医院" },
];

/** 操作情况 */
export const OPERATE_STATUS_OPTIONS = [
  { value: 1, labelKey: "正常" },
  { value: 2, labelKey: "异常" },
];

/** 给药时段（待用药列表/详情） */
export const MEDICATION_TIME_OPTIONS = [
  { value: 1, labelKey: "早上" },
  { value: 2, labelKey: "中午" },
  { value: 3, labelKey: "晚上" },
  { value: 4, labelKey: "早晚一次" },
  { value: 5, labelKey: "早中晚各一次" },
];

export function formatDateTimeMinute(value) {
  if (value === null || value === undefined || value === "") return "-";
  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(text)) return text;
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(text)) return `${text}:00`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return `${text} 00:00:00`;
  return text;
}

export function formatYesNo(value, t) {
  if (value === 1) return t("schoolDoctor.是");
  if (value === 0) return t("schoolDoctor.否");
  return "-";
}

export function formatLeaveDestination(value, t) {
  const item = LEAVE_DESTINATION_OPTIONS.find((opt) => opt.value === value);
  return item ? t(`schoolDoctor.${item.labelKey}`) : "-";
}

export function formatPendingStatus(value, t) {
  const item = PENDING_STATUS.find((opt) => opt.value === value);
  return item ? t(`schoolDoctor.${item.labelKey}`) : "-";
}

/** 待用药列表状态文案：已结束 > 用药中 > 待用药 */
export function formatPendingListStatus(pendingStatus, applicationStatus, t) {
  if (Number(pendingStatus) === PENDING_MEDICATION_STATUS_ENDED) {
    return t("schoolDoctor.已结束");
  }
  if (Number(applicationStatus) === APPLICATION_STATUS_IN_PROGRESS) {
    return t("schoolDoctor.用药中");
  }
  return t("schoolDoctor.待用药");
}

/** 组装待用药分页查询参数 */
export function buildPendingSearchParams(pagination, form, dateRange) {
  const params = { ...pagination, ...form };
  if (params.schoolId) {
    params.schoolIds = [params.schoolId];
    delete params.schoolId;
  }
  if (dateRange && dateRange.length === 2) {
    params.applyMedicationDateStart = dateRange[0];
    params.applyMedicationDateEnd = dateRange[1];
  }
  const searchStatus = params.searchStatus;
  delete params.searchStatus;
  if (searchStatus === "waiting") {
    params.status = 0;
    params.applicationStatus = APPLICATION_STATUS_WAITING_MEDICATION;
  } else if (searchStatus === "inProgress") {
    params.status = 0;
    params.applicationStatus = APPLICATION_STATUS_IN_PROGRESS;
  } else if (searchStatus === "ended") {
    params.status = PENDING_MEDICATION_STATUS_ENDED;
  }
  return params;
}

export function formatMedicationTime(value, t) {
  const item = MEDICATION_TIME_OPTIONS.find((opt) => opt.value === value);
  return item ? t(`schoolDoctor.${item.labelKey}`) : "-";
}

export function formatOperateStatus(value, t) {
  const item = OPERATE_STATUS_OPTIONS.find((opt) => opt.value === value);
  return item ? t(`schoolDoctor.${item.labelKey}`) : "-";
}

export function getNowDateTime() {
  const now = new Date();
  const pad = (num) => String(num).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

export function createEmptyVisitForm() {
  return {
    id: undefined,
    admissionNo: "",
    fullName: "",
    schoolId: undefined,
    schoolName: "",
    grade: "",
    formCode: "",
    drugAllergy: "",
    visitTime: "",
    leaveTime: "",
    chiefComplaint: "",
    physicalExam: "",
    diagnosisAdvice: "",
    remark: "",
    attachmentList: [],
    leaveDestination: undefined,
    notifyParent: 1,
    executeOperation: 0,
    operator: "",
    contactParent: undefined,
    parentAgree: undefined,
    parentName: "",
    parentContact: "",
    parentSignaturePath: "",
  };
}

export function createEmptyPendingOperationForm() {
  return {
    operationId: undefined,
    operateTime: "",
    operateStatus: 1,
    specificSituation: "",
    operator: "",
    notifyParent: 1,
    attachmentList: [],
    leaveTime: "",
    leaveDestination: undefined,
  };
}

/** 是否已有家长回执（以家长签字为准） */
export function hasParentReceipt(form) {
  if (!form) return false;
  return !!form.parentSignaturePath;
}

/** 格式化用药内容展示文本 */
export function formatMedicationContentLines(content, t) {
  if (!content) return [];
  const lines = [];
  if (content.medicineName) lines.push(`${t("schoolDoctor.药物名称")}：${content.medicineName}`);
  if (content.bringQuantity) lines.push(`${t("schoolDoctor.带到学校的数量")}：${content.bringQuantity}`);
  if (content.dosage) lines.push(`${t("schoolDoctor.用药剂量")}：${content.dosage}`);
  if (content.startDate || content.endDate) {
    lines.push(`${t("schoolDoctor.用药开始日期")}：${content.startDate || "-"} ~ ${content.endDate || "-"}`);
  }
  if (content.administrationTimeType) {
    lines.push(`${t("schoolDoctor.给药时间")}：${formatOptionValue(ADMINISTRATION_TIME_OPTIONS, content.administrationTimeType, t)}`);
  }
  if (content.frequencyType) {
    lines.push(`${t("schoolDoctor.用药频率")}：${formatOptionValue(FREQUENCY_OPTIONS, content.frequencyType, t, content.frequencyOther)}`);
  }
  if (content.routeType) {
    lines.push(`${t("schoolDoctor.用药途径")}：${formatOptionValue(ROUTE_OPTIONS, content.routeType, t, content.routeOther)}`);
  }
  if (content.mealTiming) {
    lines.push(`${t("schoolDoctor.餐前餐后")}：${formatOptionValue(MEAL_TIMING_OPTIONS, content.mealTiming, t)}`);
  }
  if (content.sideEffects) lines.push(`${t("schoolDoctor.副作用及其他重要事宜")}：${content.sideEffects}`);
  return lines;
}

/** 接口附件 → 表单附件 */
export function mapPendingOperationAttachmentsFromApi(list) {
  return (list || []).map((file, index) => {
    const url = file.attachmentUrl || file.attachmentPath || file.url || "";
    return {
      id: file.id,
      operationId: file.operationId,
      attachmentUrl: url,
      url,
      name: file.name || (url ? url.split("/").pop() : ""),
    };
  }).filter((file) => file.url);
}

/** 表单附件 → 接口附件 */
export function mapPendingOperationAttachmentsToApi(list) {
  return (list || [])
    .map((file) => ({
      id: file.id,
      operationId: file.operationId,
      attachmentUrl: file.attachmentUrl || file.attachmentPath || file.url,
    }))
    .filter((item) => item.attachmentUrl);
}

/** 格式化日期（年月日） */
export function formatDateOnly(value) {
  if (value === null || value === undefined || value === "") return "-";
  return String(value).slice(0, 10);
}

/** 待用药详情-用药申请 */
export function getPendingApplication(detail) {
  if (!detail || typeof detail !== "object") return {};
  return detail.application || detail.applyInfo || detail;
}

/** 待用药详情-学生医疗信息 */
export function getPendingStudentMedical(detail) {
  if (!detail || typeof detail !== "object") return {};
  return detail.studentMedicalInfo || {};
}

/** 待用药详情-学生信息回显表单 */
export function buildPendingStudentDisplayForm(detail) {
  const application = getPendingApplication(detail);
  const medical = getPendingStudentMedical(detail);
  return {
    schoolId: application.schoolId || medical.schoolId,
    schoolName: application.schoolName || medical.schoolName,
    admissionNo: application.admissionNo || medical.admissionNo,
    fullName: application.fullName || medical.fullName,
    grade: application.grade || medical.grade,
    formCode: application.formCode || medical.formCode,
    parentName: application.parentName,
    parentContact: application.parentContact,
    firstRelationship: application.parentName,
    firstTelephone: application.parentContact,
  };
}

/** 待用药详情-用药内容列表 */
export function getPendingMedicationContentList(detail) {
  const application = getPendingApplication(detail);
  const list = application.contentList || detail.contentList || [];
  return Array.isArray(list) ? list : [];
}

/** 待用药详情-诊断说明图片 */
export function getPendingDiagnosisImages(detail) {
  const application = getPendingApplication(detail);
  return application.diagnosisImageList || detail.diagnosisImageList || [];
}

/** 单条用药内容 → 展示字段 */
export function buildMedicationDisplayFields(content, t) {
  if (!content) return [];
  const fields = [];
  const push = (labelKey, value, span) => {
    if (value !== undefined && value !== null && value !== "" && value !== "-") {
      fields.push({ label: t(`schoolDoctor.${labelKey}`), value, span: span || 8 });
    }
  };
  push("带到学校的数量", content.bringQuantity);
  push("用药剂量", content.dosage);
  if (content.startDate || content.endDate) {
    fields.push({
      label: t("schoolDoctor.用药周期"),
      value: `${formatDateOnly(content.startDate)} ~ ${formatDateOnly(content.endDate)}`,
      span: 16,
    });
  }
  if (content.administrationTimeType) {
    push("给药时间", formatOptionValue(ADMINISTRATION_TIME_OPTIONS, content.administrationTimeType, t));
  }
  if (content.frequencyType) {
    push("用药频率", formatOptionValue(FREQUENCY_OPTIONS, content.frequencyType, t, content.frequencyOther));
  }
  if (content.routeType) {
    push("用药途径", formatOptionValue(ROUTE_OPTIONS, content.routeType, t, content.routeOther));
  }
  if (content.mealTiming) {
    push("餐前餐后", formatOptionValue(MEAL_TIMING_OPTIONS, content.mealTiming, t));
  }
  push("副作用及其他重要事宜", content.sideEffects, 24);
  return fields;
}

/** 过敏信息展示列表 */
export function buildAllergyDisplayList(medical, t) {
  if (!medical) return [];
  const items = [
    { labelKey: "药物过敏", value: medical.drugAllergy, warn: true },
    { labelKey: "食物过敏", value: medical.foodAllergy },
    { labelKey: "接触过敏", value: medical.contactAllergy },
    { labelKey: "其他过敏", value: medical.otherAllergy },
  ];
  return items
    .filter((item) => item.value)
    .map((item) => ({ label: t(`schoolDoctor.${item.labelKey}`), value: item.value, warn: item.warn }));
}

/** 解析待用药关联的用药申请 ID */
export function resolvePendingApplicationId(detail) {
  if (!detail || typeof detail !== "object") return undefined;
  const candidates = [
    detail.applicationId,
    detail.medicationApplicationId,
    detail.medicationApplyId,
    detail.applyId,
    detail.medicationApplication && detail.medicationApplication.id,
    detail.application && detail.application.id,
    detail.applyInfo && detail.applyInfo.id,
  ];
  for (let i = 0; i < candidates.length; i += 1) {
    const value = candidates[i];
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
  return undefined;
}

/** 构建单条操作记录编辑请求体（/operate 接口直接提交 operation 对象） */
export function buildPendingOperationRecordPayload(pendingDetail, operationForm) {
  const pendingId = pendingDetail && pendingDetail.id;
  const payload = {
    pendingId,
    operationTime: operationForm.operateTime,
    operationStatus: operationForm.operateStatus,
    situationDetail: operationForm.specificSituation,
    operator: operationForm.operator,
    notifyParent: operationForm.notifyParent,
    leaveTime: operationForm.leaveTime || undefined,
    leaveDestination: operationForm.leaveDestination,
    attachmentList: mapPendingOperationAttachmentsToApi(operationForm.attachmentList),
  };
  if (operationForm.operationId) {
    payload.id = operationForm.operationId;
  }
  return payload;
}

/** 构建待用药 operate 请求体；endMedication=true 时将待用药状态置为已结束 */
export function buildPendingMedicationOperatePayload(pendingDetail, operationForm, isEdit, endMedication = false) {
  const pendingId = pendingDetail.id;
  const applicationId = resolvePendingApplicationId(pendingDetail);
  const operation = {
    pendingId,
    operationTime: operationForm.operateTime,
    operationStatus: operationForm.operateStatus,
    situationDetail: operationForm.specificSituation,
    operator: operationForm.operator,
    notifyParent: operationForm.notifyParent,
    leaveTime: operationForm.leaveTime || undefined,
    leaveDestination: operationForm.leaveDestination,
    attachmentList: mapPendingOperationAttachmentsToApi(operationForm.attachmentList),
  };
  if (isEdit && operationForm.operationId) {
    operation.id = operationForm.operationId;
  }
  const pendingStatus = endMedication
    ? PENDING_MEDICATION_STATUS_ENDED
    : pendingDetail.status;
  return {
    id: pendingId,
    applicationId,
    status: pendingStatus,
    operationList: [operation],
  };
}

/** 接口操作记录 → 列表/表单展示 */
export function mapOperationRecordRow(item) {
  const operateTime = item.operationTime || item.operateTime || item.createTime;
  const operateStatus = item.operationStatus !== undefined ? item.operationStatus : item.operateStatus;
  return {
    id: item.id || item.operationId,
    operationId: item.id || item.operationId,
    operateDate: formatDateTimeMinute(operateTime),
    operateTime: formatDateTimeMinute(operateTime),
    operateStatus,
    specificSituation: item.situationDetail || item.specificSituation || item.remark || "-",
    operatorName: item.operator || item.operatorName || item.creator || "-",
    leaveTime: formatDateTimeMinute(item.leaveTime),
    leaveDestination: item.leaveDestination,
    attachmentList: mapPendingOperationAttachmentsFromApi(item.attachmentList),
  };
}
