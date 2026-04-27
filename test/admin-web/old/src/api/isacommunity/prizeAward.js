import request from "@/router/newaxios/axios";

const path = "/isacommunity/activity/program/prize/award";

export function addPrizeAward(data) {
  return request({
    url: `${path}/add`,
    method: "post",
    data,
  });
}

export function editPrizeAward(data) {
  return request({
    url: `${path}/edit`,
    method: "post",
    data,
  });
}

export function delPrizeAward(params) {
  return request({
    url: `${path}/del`,
    method: "delete",
    params,
  });
}

export function getPrizeAwardDetail(id) {
  return request({
    url: `${path}/get/${id}`,
    method: "get",
  });
}

export function getPrizeAwardLotteryPage(params) {
  return request({
    url: `${path}/getLotteryPage`,
    method: "get",
    params: { ...params },
  });
}

export function getPrizeAwardVotePage(params) {
  return request({
    url: `${path}/getVotePage`,
    method: "get",
    params: { ...params },
  });
}

export function getPrizeAwardCompetitionPage(params) {
  return request({
    url: `${path}/getCompetitionPage`,
    method: "get",
    params: { ...params },
  });
}

/** GET `/activity/program/prize/award/getByTicketCode` — query: ticketCode（必填） */
export function getPrizeAwardByTicketCode(params) {
  return request({
    url: `${path}/getByTicketCode`,
    method: "get",
    params: { ...params },
  });
}

export function exportPrizeAwardLottery(params) {
  return request({
    url: `${path}/exportLottery`,
    method: "get",
    params: { ...params },
    responseType: "blob",
  });
}

export function exportPrizeAwardVote(params) {
  return request({
    url: `${path}/exportVote`,
    method: "get",
    params: { ...params },
    responseType: "blob",
  });
}

export function exportPrizeAwardCompetition(params) {
  return request({
    url: `${path}/exportCompetition`,
    method: "get",
    params: { ...params },
    responseType: "blob",
  });
}
