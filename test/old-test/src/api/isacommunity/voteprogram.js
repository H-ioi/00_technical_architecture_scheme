import request from "@/router/newaxios/axios";
const path = "/isacommunity/activity/program/voteProgram";
// 获取投票列表
export function getVoteProgramPage(params) {
  return request({
    url: `${path}/getVoteProgramPage`,
    method: "get",
    params: {
      ...params,
    },
  });
}

export function getVoteProgramDetail(id) {
  return request({
    url: `${path}/get/${id}`,
    method: "get",
  });
}
export function addVoteProgram(data) {
  return request({
    url: `${path}/add`,
    method: "post",
    data,
  });
}
export function editVoteProgram(data) {
  return request({
    url: `${path}/edit`,
    method: "post",
    data,
  });
}
export function delVoteProgram(params) {
  return request({
    url: `${path}/del`,
    method: "delete",
    params,
  });
}
export function getVoteProgramList(params) {
  return request({
    url: `${path}/list`,
    method: "get",
    params: {
      ...params,
    },
  });
}
export async function getVoteProgram(params) {
  try {
    const res = await request({
      url: `${path}/list`,
      method: "get",
      params: {
        ...params,
      },
    });
    return res.data.data;
  } catch (error) {
    throw error;
  }
}

/** 按活动项目 ID 查询投票节目（listByprogram）：活动详情-活动项目 TAB 回显、活动项目详情-投票节目表格 */
export async function getVoteProgramListByprogram(params) {
  try {
    const res = await request({
      url: `${path}/listByprogram`,
      method: "get",
      params: {
        ...params,
      },
    });
    return res.data.data;
  } catch (error) {
    throw error;
  }
}

/** 投票记录（活动详情-投票信息） */
const voteRecordPath = `${path}/voteRecord`;

export function addVoteRecord(data) {
  return request({
    url: `${voteRecordPath}/add`,
    method: "post",
    data,
  });
}

export function editVoteRecord(data) {
  return request({
    url: `${voteRecordPath}/edit`,
    method: "post",
    data,
  });
}

export function delVoteRecord(params) {
  return request({
    url: `${voteRecordPath}/del`,
    method: "delete",
    params,
  });
}

export function getVoteRecordDetail(id) {
  return request({
    url: `${voteRecordPath}/get/${id}`,
    method: "get",
  });
}

/** 投票记录分页 */
export function getVoteRecordPage(params) {
  return request({
    url: `${voteRecordPath}/getVoteRecordPage`,
    method: "get",
    params: { ...params },
  });
}

/** 列表（可按投票节目 ID 过滤） */
export function getVoteRecordList(params) {
  return request({
    url: `${voteRecordPath}/list`,
    method: "get",
    params: { ...params },
  });
}
