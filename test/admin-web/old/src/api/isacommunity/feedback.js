import request from "@/router/newaxios/axios";

const path = "/isacommunity/activity/feedback";

export function getFeedbackPage(params) {
  return request({
    url: `${path}/getFeedbackPage`,
    method: "get",
    params: { ...params },
  });
}

export function getFeedbackDetail(id) {
  return request({
    url: `${path}/get/${id}`,
    method: "get",
  });
}

export function addFeedback(data) {
  return request({
    url: `${path}/add`,
    method: "post",
    data,
  });
}

export function editFeedback(data) {
  return request({
    url: `${path}/edit`,
    method: "post",
    data,
  });
}

export function delFeedback(params) {
  return request({
    url: `${path}/del`,
    method: "delete",
    params,
  });
}

/** 按活动导出反馈 */
export function exportActivityFeedback(activityId) {
  return request({
    url: `${path}/exportFeedback/${activityId}`,
    method: "get",
    responseType: "blob",
  });
}
