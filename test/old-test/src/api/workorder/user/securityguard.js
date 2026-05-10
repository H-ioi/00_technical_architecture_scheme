import request from "@/router/axios";
const path = "/workorder/visit/security/guard";
/**
 * 获取列表
 */
export function getSecurityGuardList(data) {
  return request({
    url: `${path}/paginate`,
    method: "get",
    params: { ...data },
  });
}
/**
 * 新增
 */
export function addSecurityGuard(data) {
  return request({
    url: `${path}/add`,
    method: "post",
    data: data,
  });
}
/**
 * 编辑
 */
export function editSecurityGuard(data) {
  return request({
    url: `${path}/edit`,
    method: "post",
    data: data,
  });
}
/**
 * 删除
 */
export function delSecurityGuard(id) {
  return request({
    url: `${path}/del/${id}`,
    method: "delete",
  });
}
/**
 * 修改密码
 */
export function editSecurityGuardPassword(data) {
  return request({
    url: `${path}/reset/password/${data.id}`,
    method: "put",
    params: {
      password: data.password,
    },
  });
}
