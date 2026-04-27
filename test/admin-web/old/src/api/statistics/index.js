import request from '@/router/axios'

// 工作统计
export function ClientAddiction(data) {
  return request({
    url: '/contact/client/chart/addiction/num/ware2',
    method: 'get',
    params: data
  })
}
export function ContacterAddiction(data) {
  return request({
    url: '/contact/contacter/chart/addiction/num/ware2',
    method: 'get',
    params: data
  })
}
export function ClueAddiction(data) {
  return request({
    url: '/clue/statistics/addition',
    method: 'get',
    params: data
  })
}
export function SignupAddiction(data) {
  return request({
    url: '/contract/contract/chart/addiction/amount/signup/ware',
    method: 'get',
    params: data
  })
}
export function PaybackAddiction(data) {
  return request({
    url: '/contract/contract/chart/addiction/amount/payback/ware',
    method: 'get',
    params: data
  })
}
// 累计统计
export function ClientAccumulation(data) {
  return request({
    url: '/contact/client/chart/accumulation/num/ware',
    method: 'get',
    params: data
  })
}
export function ContacterAccumulation(data) {
  return request({
    url: '/contact/contacter/chart/accumulation/num/ware',
    method: 'get',
    params: data
  })
}
export function ClueAccumulation(data) {
  return request({
    url: '/clue/statistics/accumulate',
    method: 'get',
    params: data
  })
}
export function PaybackAccumulation(data) {
  return request({
    url: '/contract/contract/chart/accumulation/amount/payback/ware',
    method: 'get',
    params: data
  })
}
export function SignupAccumulation(data) {
  return request({
    url: '/contract/contract/chart/accumulation/amount/signup/ware',
    method: 'get',
    params: data
  })
}

// 销售简报
export function addNewClient(data) {
  return request({
    url: '/contact/client/chart/addiction/num/ware1',
    method: 'get',
    params: data
  })
}
export function addNewContacter(data) {
  return request({
    url: '/contact/contacter/chart/addiction/num/ware1',
    method: 'get',
    params: data
  })
}
export function addNewClue(data) {
  return request({
    url: '/clue/statistics/get/count',
    method: 'get',
    params: data
  })
}
export function addNewOpportunity(data) {
  return request({
    url: '/opportunity/statistics/get/count',
    method: 'get',
    params: data
  })
}
export function addNewContract(data) {
  return request({
    url: '/contract/contract/chart/addiction/num/ware',
    method: 'get',
    params: data
  })
}
// 线索转化
export function fetchClueConversion(data) {
  return request({
    url: '/clue/statistics/conversion',
    method: 'get',
    params: data
  })
}
export function fetchOpportunityConversion(data) {
  return request({
    url: '/opportunity/statistics/conversion',
    method: 'get',
    params: data
  })
}

// 销售漏斗
export function fetchStatisticsOpportunity() {
  return request({
    url: '/opportunity/statistics/get/stage/percent',
    method: 'get',
  })
}
// 线索状态
export function fetchClueStatus() {
  return request({
    url: '/clue/statistics/get/status/count',
    method: 'get',
  })
}

// 计数排行榜
export function fetchClueRanking(data) {
  return request({
    url: '/clue/statistics/ranking/num',
    method: 'get',
    params: data
  })
}
export function fetchContacterRanking(data) {
  return request({
    url: '/contact/contacter/chart/accumulation/num/person',
    method: 'get',
    params: data
  })
}
export function fetchClienterRanking(data) {
  return request({
    url: '/contact/client/chart/accumulation/num/person',
    method: 'get',
    params: data
  })
}
export function fetchOpportunityRanking(data) {
  return request({
    url: '/opportunity/statistics/ranking/num',
    method: 'get',
    params: data
  })
}
export function fetchSignupRanking(data) {
  return request({
    url: '/contract/contract/chart/addiction/amount/signup/person',
    method: 'get',
    params: data
  })
}
export function fetchContractRanking(data) {
  return request({
    url: '/contract/contract/chart/addiction/num/person',
    method: 'get',
    params: data
  })
}
// 转化率排行榜
export function fetchEffectiveRate(data) {
  return request({
    // url: '/clue/statistics/ranking/effective/rate',
    url: '/contact/client/chart/ranking/effective/rate',
    method: 'get',
    params: data
  })
}
export function fetchConversionRate(data) {
  return request({
    url: '/clue/statistics/ranking/conversion/rate',
    method: 'get',
    params: data
  })
}
export function fetchOpportunityRate(data) {
  return request({
    url: '/opportunity/statistics/ranking/sign/rate',
    method: 'get',
    params: data
  })
}
export function fetchContractRateNum(data) {
  return request({
    url: '/contract/contract/chart/addiction/num/payback/rate/person',
    method: 'get',
    params: data
  })
}
export function fetchContractRateAmount(data) {
  return request({
    url: '/contract/contract/chart/addiction/amount/payback/rate/person',
    method: 'get',
    params: data
  })
}

