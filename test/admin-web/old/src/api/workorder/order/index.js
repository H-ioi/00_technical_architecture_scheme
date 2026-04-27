import request from '@/router/axios'
const path = "/workorder"
/**
 * 获取资产绑定的工单列表
 */
export function getOrderAssetList(assetId) {
  return request({
    url: `${path}/order/list/by/assetId?assetId=${assetId}`,
    method: 'get',
  })
}
/**
 * 获取空间绑定的工单列表
 */
export function getOrderSpaceList(spaceId) {
  return request({
    url: `${path}/order/list/by/spaceId?spaceId=${spaceId}`,
    method: 'get',
  })
}

/**
 * 获取工单列表
 */
export function getOrderList(data) {
  return request({
    url: `${path}/order/page`,
    method: 'get',
    params: {
      ...data
    },
  })
}


/**
 * 获取工单详情
 */
export function getOrderDetail(id) {
  return request({
    url: `${path}/order/get/${id}`,
    method: 'get',
  })
}
/**
 * 取消工单
 */
export function cancelOrder(data) {
  return request({
    url: `${path}/order/cancel`,
    method: 'post',
    data: data
  })
}
/**
 * 评价工单
 */
export function appraiseOrder(data) {
  return request({
    url: `${path}/order/appraise`,
    method: 'post',
    data: data
  })
}
/**
 * 提交工单
 */
export function completeOrder(data) {
  return request({
    url: `${path}/order/complete`,
    method: 'post',
    data: data
  })
}
/**
 * 催办工单
 */
export function urgeOrder(data) {
  return request({
    url: `${path}/order/urge`,
    method: 'post',
    data: data
  })
}
/**
 * 分发工单
 */
export function distributeOrder(data) {
  return request({
    url: `${path}/order/distribute`,
    method: 'post',
    data: data
  })
}
/**
 * 补充工单
 */
export function supplyOrder(data) {
  return request({
    url: `${path}/order/supply`,
    method: 'post',
    data: data
  })
}
/**
 * 新建服务工单
 */
export function addOrderDemand(data) {
  return request({
    url: `${path}/order/demand/save`,
    method: 'post',
    data: data
  })
}
/**
 * 编辑服务工单
 */
export function putOrderDemand(data) {
  return request({
    url: `${path}/order/demand/update`,
    method: 'put',
    data: data
  })
}
/**
 * 新建搬运工单
 */
export function addOrderCarry(data) {
  return request({
    url: `${path}/order/carry/save`,
    method: 'post',
    data: data
  })
}
/**
 * 编辑搬运工单
 */
export function putOrderCarry(data) {
  return request({
    url: `${path}/order/carry/update`,
    method: 'put',
    data: data
  })
}
/**
 * 新建保养工单
 */
export function addOrderUpkeep(data) {
  return request({
    url: `${path}/order/upkeep/save`,
    method: 'post',
    data: data
  })
}
/**
 * 编辑保养工单
 */
export function putOrderUpkeep(data) {
  return request({
    url: `${path}/order/upkeep/update`,
    method: 'put',
    data: data
  })
}
/**
 * 新建巡检工单
 */
export function addOrderInspect(data) {
  return request({
    url: `${path}/order/inspect/save`,
    method: 'post',
    data: data
  })
}
/**
 * 编辑巡检工单
 */
export function putOrderInspect(data) {
  return request({
    url: `${path}/order/inspect/update`,
    method: 'put',
    data: data
  })
}
/**
 * 新建点检工单
 */
export function addOrderSpotcheck(data) {
  return request({
    url: `${path}/order/spotcheck/save`,
    method: 'post',
    data: data
  })
}
/**
 * 编辑点检工单
 */
export function putOrderSpotcheck(data) {
  return request({
    url: `${path}/order/spotcheck/update`,
    method: 'put',
    data: data
  })
}
/**
 * 新建维修工单
 */
export function addOrderRepair(data) {
  return request({
    url: `${path}/order/repair/save`,
    method: 'post',
    data: data
  })
}
/**
 * 编辑维修工单
 */
export function putOrderRepair(data) {
  return request({
    url: `${path}/order/repair/update`,
    method: 'put',
    data: data
  })
}
/**
 * 获取我的工单列表
 */
export function getMyOrderList(data) {
  return request({
    url: `${path}/order/my/page`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 获取工单详情
 */
export function getMyOrderDetail(id) {
  return request({
    url: `${path}/order/my/get/${id}`,
    method: 'get',
  })
}
/**
 * 取消工单
 */
export function cancelMyOrder(data) {
  return request({
    url: `${path}/order/my/cancel`,
    method: 'post',
    data: data
  })
}
/**
 * 评价工单
 */
export function appraiseMyOrder(data) {
  return request({
    url: `${path}/order/my/appraise`,
    method: 'post',
    data: data
  })
}
/**
 * 提交工单
 */
export function completeMyOrder(data) {
  return request({
    url: `${path}/order/my/complete`,
    method: 'post',
    data: data
  })
}
/**
 * 分发工单
 */
export function distributeMyOrder(data) {
  return request({
    url: `${path}/order/my/distribute`,
    method: 'post',
    data: data
  })
}
/**
 * 补充工单
 */
export function supplyMyOrder(data) {
  return request({
    url: `${path}/order/my/supply`,
    method: 'post',
    data: data
  })
}


// 统计报表
/**
 * 服务指标数据
 */
export function getOrderIndicators(data) {
  return request({
    url: `${path}/chart/indicators`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 服务类型
 */
export function getOrderServicetype(data) {
  return request({
    url: `${path}/chart/servicetype`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 工单状态
 */
export function getOrderStatus(data) {
  return request({
    url: `${path}/chart/status`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 工单时间
 */
export function getOrderTime(data) {
  return request({
    url: `${path}/chart/time`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 工单类型
 */
export function getOrderType(data) {
  return request({
    url: `${path}/chart/type`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 紧急程度
 */
export function getOrderUrgency(data) {
  return request({
    url: `${path}/chart/urgency`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 获取工单协作人
 */
export function getCollaboratorsList(data) {
  return request({
    url: `${path}/order/collaborators/get`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 添加工单协作人
 */
export function addCollaborators(data) {
  return request({
    url: `${path}/order/collaborators/edit`,
    method: 'post',
    data: data
  })
}
/**
 * 导出工单
 */
export function exportOrder(data) {
  return request({
    url: `${path}/order/export`,
    method: 'get',
    params: {
      ...data
    },
    header: {
      headers: {
        "Content-Type": "application/x-download"
      }
    },
    responseType: "blob"
  })
}
/**
 * 导出工单
 */
export function exportMyOrder(data) {
  return request({
    url: `${path}/order/my/export`,
    method: 'get',
    params: {
      ...data
    },
    header: {
      headers: {
        "Content-Type": "application/x-download"
      }
    },
    responseType: "blob"
  })
}
/**
* 通过校区字典值查询资产数据列表
*/
export function getOrderAsset(data) {
  return request({
    url: `${path}/public/asset/list`,
    method: 'get',
    params: data
  })
}
/**
* 通过校区字典值查询空间
*/
export function getOrderSpace(schoolId) {
  return request({
    url: `${path}/public/space/tree?school=${schoolId}`,
    method: 'get',
  })
}

