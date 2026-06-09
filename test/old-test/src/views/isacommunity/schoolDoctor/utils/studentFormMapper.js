/**
 * 将 membership/searchList 返回的学生数据映射为各业务表单字段
 * @param {Object} student 接口返回的学生对象
 * @param {string} fieldType 表单类型：studentRecord | medicineApply | healthReport | infectiousDisease | visitRecord
 * @param {Array} schoolSelectList 校区下拉列表
 */
export function mapStudentToFormFields(student, fieldType, schoolSelectList) {
  if (!student) return {};

  const admissionNo = student.admissonNo || student.studentId || "";
  const studentName =
    student.cnFullName || student.fullName || student.showName || "";
  const schoolId = resolveSchoolId(student, schoolSelectList);
  const gradeName = student.grade || "";
  const className = student.formCode || "";
  const allergenText = [
    student.healthAllergiesDescription,
    student.allergySource,
    student.allergyMedication,
  ]
    .filter(Boolean)
    .join("；");

  const baseFields = {
    schoolId,
    gradeName,
    className,
    grade: gradeName,
    formCode: className,
  };

  if (fieldType === "medicineApply") {
    return {
      ...baseFields,
      admissionNo,
      fullName: studentName,
    };
  }

  if (fieldType === "medicalInfo") {
    return {
      ...baseFields,
      admissionNo,
      fullName: studentName,
      dormitoryStatus: student.dormitoryStatus === 1 ? 1 : 0,
    };
  }

  if (fieldType === "visitRecord") {
    return {
      schoolId,
      admissionNo,
      fullName: studentName,
      grade: gradeName,
      formCode: className,
      drugAllergy: allergenText,
    };
  }

  /** 校巴考勤（接口字段 grade） */
  if (fieldType === "busAttendance") {
    return {
      schoolId,
      admissionNo,
      studentName,
      grade: gradeName,
      studentGrade: gradeName,
      formCode: className,
    };
  }

  const recordFields = {
    ...baseFields,
    admissionNo,
    studentName,
  };

  if (fieldType === "studentRecord") {
    return {
      ...recordFields,
      isBoarding: student.dormitoryStatus === 1 ? 1 : 0,
      hasAllergen: allergenText ? 1 : 0,
      allergen: allergenText,
      regularMedication: student.medication ? 1 : 0,
      medicationName: student.medication || "",
      hasDisease: student.disease ? 1 : 0,
      diseaseDesc: student.disease || "",
    };
  }

  return recordFields;
}

/** 从表单或接口数据构建学生信息卡片展示数据 */
export function buildStudentCardInfo(source, schoolSelectList) {
  if (!source) return null;

  const admissionNo =
    source.admissonNo ||
    source.admissionNo ||
    source.studentNo ||
    source.studentId ||
    "";
  const fullName = source.fullName || source.showName || "";
  const cnFullName = source.cnFullName || source.studentName || "";

  if (!admissionNo && !fullName && !cnFullName) return null;

  const school = (schoolSelectList || []).find(
    (item) => item.id === source.schoolId
  );
  const schoolName =
    source.schoolName || (school ? school.cnName || school.enName : "") || "";
  const grade = source.grade || source.gradeName || "";
  const formCode = source.formCode || source.className || "";
  const gradeClassParts = [grade, formCode ? `班级 ${formCode}` : ""].filter(
    Boolean
  );

  const allergenText = [
    source.healthAllergiesDescription,
    source.allergySource,
    source.allergySourceFood,
    source.allergyMedication,
    source.allergyReaction,
    source.allergen,
  ]
    .filter(Boolean)
    .join("、");

  const hasAllergen = !!allergenText;
  const hasDisease = !!(source.disease || source.diseaseDesc);
  let displayName = "";

  if (fullName && cnFullName && fullName !== cnFullName) {
    displayName = `${fullName} (${cnFullName})`;
  } else {
    displayName = cnFullName || fullName || source.showName || "";
  }

  return {
    avatarUrl: source.profilePhoto || source.image || "",
    avatarText: getAvatarInitials(fullName, cnFullName),
    displayName,
    studentId: admissionNo,
    healthStatus: hasAllergen || hasDisease ? "warning" : "normal",
    schoolName,
    gradeClassText: gradeClassParts.join(" | "),
    bloodType: parseBloodType(source.customFields),
    allergenText,
    hasAllergen,
    emergencyName: source.firstRelationship || source.secondRelationship || "",
    emergencyPhone: source.firstTelephone || source.secondTelephone || "",
  };
}

/** 从表单数据还原学生展示信息（兼容旧调用） */
export function buildStudentDisplayInfo(form, fieldType, schoolSelectList) {
  return buildStudentCardInfo(form, schoolSelectList);
}

/** 头像 initials */
function getAvatarInitials(fullName, cnFullName) {
  const name = fullName || cnFullName || "";
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/** 从 customFields 解析血型 */
function parseBloodType(customFields) {
  if (!customFields) return "-";
  try {
    const obj =
      typeof customFields === "string"
        ? JSON.parse(customFields)
        : customFields;
    return obj.bloodType || obj.blood_type || obj["血型"] || "-";
  } catch (error) {
    return "-";
  }
}

/** 匹配校区 id */
function resolveSchoolId(student, schoolSelectList) {
  if (!Array.isArray(schoolSelectList) || !schoolSelectList.length) {
    return undefined;
  }

  const studentKeys = [student.schoolId, student.schoolCode, student.externId]
    .filter(Boolean)
    .map(String);

  const matched = schoolSelectList.find((school) => {
    const schoolKeys = [school.id, school.externId, school.schoolCode]
      .filter(Boolean)
      .map(String);
    return schoolKeys.some((key) => studentKeys.includes(key));
  });

  return matched ? matched.id : undefined;
}
