import request from "@/router/newaxios/axios";

const path = "/isacommunity/busattendance";

/** 校巴考勤分页列表 */
export function getAttendancePage(params) {
  return request({
    url: `${path}/getAttendancePage`,
    method: "get",
    params,
  });
}

/** 校巴考勤详情 */
export function getAttendanceDetail(id) {
  return request({
    url: `${path}/get/${id}`,
    method: "get",
  });
}

/** 新增校巴考勤 */
export function addAttendance(data) {
  return request({
    url: `${path}/add`,
    method: "post",
    data,
  });
}

/** 编辑校巴考勤 */
export function editAttendance(data) {
  return request({
    url: `${path}/edit`,
    method: "post",
    data,
  });
}

/** 删除校巴考勤（ids 多选） */
export function delAttendance(params) {
  return request({
    url: `${path}/del`,
    method: "delete",
    params,
  });
}
