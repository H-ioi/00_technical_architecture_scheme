import request from "@/router/axios";
import requestouter from "@/router/axiosouter";
const collection = "/enquiry/collection";
export function getViewCollection(query) {
  return requestouter({
    url: `${collection}/view`,
    method: "post",
    data: query,
  });
}
export function signUpCollection(data) {
  return requestouter({
    url: `${collection}/signUp`,
    method: "post",
    data: data,
  });
}
export async function checkCollection(params) {
  try {
    const res = await requestouter({
      url: `${collection}/view`,
      method: "post",
      data: params,
    });
    return res.data.data;
  } catch (error) {
    throw error;
  }
}
// 分页
export function getCollectionList(query) {
  return request({
    url: `${collection}/page/collection`,
    method: "post",
    data: query,
  });
}
export function getCollectionDetail(id) {
  return request({
    url: `${collection}/getEditInfo`,
    method: "post",
    data: { id },
  });
}
export function getCollectionInfo(id) {
  return request({
    url: `${collection}/getInfo`,
    method: "post",
    data: { id },
  });
}
export function getDynamicInfo(data) {
  return request({
    url: `${collection}/page/dynamicInfo`,
    method: "post",
    data,
  });
}
export function getCollectionOpt() {
  return request({
    url: `${collection}/opt`,
    method: "get",
    params: query,
  });
}
export function addCollection(data) {
  return request({
    url: `${collection}/add`,
    method: "post",
    data: data,
  });
}
export function editCollection(data) {
  return request({
    url: `${collection}/edit`,
    method: "post",
    data: data,
  });
}
export function delCollection(id) {
  return request({
    url: `${collection}/del/` + id,
    method: "post",
  });
}

export function passCollection(data) {
  return request({
    url: `${collection}/pass`,
    method: "post",
    data: data,
  });
}
export function rejectCollection(data) {
  return request({
    url: `${collection}/reject`,
    method: "post",
    data: data,
  });
}
export function batchPassCollection(data) {
  return request({
    url: `${collection}/batch/pass`,
    method: "post",
    data: data,
  });
}
export function batchRejectCollection(data) {
  return request({
    url: `${collection}/batch/reject`,
    method: "post",
    data: data,
  });
}
export function confirmCollection(query) {
  return request({
    url: `${collection}/batch/confirm`,
    method: "post",
    data: query,
  });
}
export function copyCollection(query) {
  return request({
    url: `${collection}/copyCollection`,
    method: "post",
    data: query,
  });
}
export function exportCollection(id) {
  return request({
    url: `${collection}/export/` + id,
    method: "get",
    header: {
      headers: {
        "Content-Type": "application/x-download",
      },
    },
    responseType: "blob",
  });
}

export function relatedActivity(data) {
  return request({
    url: `${collection}/relatedActivity`,
    method: "post",
    data,
  });
}
export function getRelatedInfo(data) {
  return request({
    url: `${collection}/getRelatedInfoTable`,
    method: "post",
    data,
  });
}
export function editCollectionView(data) {
  return request({
    url: `enquiry/template/editView`,
    method: "post",
    data: data,
  });
}
export async function getStudentByPhone(data) {
  try {
    const res = await requestouter({
      url: "/enquiry/collection/getStudentByPhone",
      method: "post",
      data: data,
      headers: {
        "collection-token": "2675bfd7-6fe8-4f89-8d60-8143b9fa4226",
      },
    });
    console.log("getStudentByPhone", res);
    return res;
  } catch (error) {
    throw error;
  }
}
export async function getPhoneCode(data) {
  try {
    const res = await requestouter({
      url: "/enquiry/sms/get/phone/code",
      method: "post",
      data: data,
      headers: {
        token: "2675bfd7-6fe8-4f89-8d60-8143b9fa4226",
      },
    });
    console.log("getStudentByPhone", res);
    return res;
  } catch (error) {
    throw error;
  }
}
export async function autoFill(data) {
  try {
    const res = await requestouter({
      url: "/enquiry/collection/autoFill",
      method: "post",
      data: data,
      headers: {
        "collection-token": "2675bfd7-6fe8-4f89-8d60-8143b9fa4226",
      },
    });
    console.log("autoFill", res);
    return res;
  } catch (error) {
    throw error;
  }
}
export async function getChildDynamicInfo(data) {
  try {
    const res = await request({
      url: "/enquiry/collection/list/childDynamicInfo",
      method: "post",
      data: data,
    });
    console.log("autoFill", res);
    return res;
  } catch (error) {
    throw error;
  }
}
/**
 * 获取动态表单模板
 */
export function getRelatedInfoTable(data, school) {
  return new Promise((resolve, reject) => {
    getRelatedInfo(data).then((res) => {
      if (res.data.success) {
        // console.log('getRelatedInfoTable', res);
        let list = [];
        let { clue, guardian, student } = res.data.data;
        let clueData = resetRelatedInfo(clue);
        let studentData = resetRelatedInfo(student);
        let clueBase = clueData.filter((item) => {
          return item["type"] == "clue_info";
        });
        let clueTemplate = clueData.filter((item) => {
          return item["type"] != "clue_info";
        });
        let studentBase = studentData.filter((item) => {
          return item["type"] == "student_info";
        });
        let studentTemplate = studentData.filter((item) => {
          return item["type"] != "student_info";
        });
        list.push({
          label: "线索表",
          type: "clue",
          value: "clue",
          disabled: true,
          children: clueTemplate,
        });
        list.push({
          label: "学生表",
          type: "student",
          value: "student",
          disabled: true,
          children: studentTemplate,
        });
        resolve({
          school,
          list,
          clue: {
            label: "线索基础信息",
            type: "clue_info",
            value: "clue_info",
            disabled: true,
            children: clueBase,
          },
          student: {
            label: "学生基础信息",
            type: "student_info",
            value: "student_info",
            disabled: true,
            children: studentBase,
          },
          guardian: {
            label: "家长基础信息",
            type: "guardian",
            value: "guardian",
            disabled: true,
            children: resetRelatedInfo(guardian),
          },
        });
      } else {
        resolve({});
      }
    });
  });
}
function resetRelatedInfo(data) {
  let types = [
    "enquiry_clue_school",
    "enquiry_guardian",
    "enquiry_student_school",
  ];
  data.map((item) => {
    item["disabled"] = true;
    item["label"] =
      types.includes(item["type"]) && item["value"] == ""
        ? "模板表单"
        : item["value"];
    item["value"] = item["type"];
    if (item["rateInfoList"]) {
      item["rateInfoList"].map((rate) => {
        rate["label"] =
          rate["remark"] == "1" ? rate["label"] + "(唯一)" : rate["label"];
        rate["value"] =
          (rate["remark"] == "1" ? "unique_field" : "other_field") +
          "@" +
          item["type"] +
          "@" +
          rate["value"];
      });
    }
    item["children"] = item["rateInfoList"] ? item["rateInfoList"] : [];
    delete item["rateInfoList"];
  });
  return data;
}
