/**
 * 校巴模块二级页路径，避免列表 / 表单多处硬编码不一致。
 */
export const SCHOOLBUS_PATHS = {
  routePlanList: "/isacommunity/schoolbus/route/plan/index",
  routeForm: "/isacommunity/schoolbus/route/plan/form",
  studentApplyList: "/isacommunity/schoolbus/student/apply/index",
  studentApplyForm: "/isacommunity/schoolbus/student/apply/form",
  studentOrderList: "/isacommunity/schoolbus/student/order/index",
  studentOrderForm: "/isacommunity/schoolbus/student/order/form",
};

/** @param {import('vue-router').default} router */
export function navigateToRouteForm(router, mode = "add", id) {
  const query = { mode };
  if (id != null && id !== "") {
    query.id = String(id);
  }
  return router.push({ path: SCHOOLBUS_PATHS.routeForm, query });
}

/** @param {import('vue-router').default} router */
export function navigateToStudentApplyForm(router, mode = "add", id) {
  const query = { mode };
  if (id != null && id !== "") {
    query.id = String(id);
  }
  return router.push({ path: SCHOOLBUS_PATHS.studentApplyForm, query });
}

/** @param {import('vue-router').default} router */
export function navigateToStudentOrderForm(router, mode = "add", id) {
  const query = { mode };
  if (id != null && id !== "") {
    query.id = String(id);
  }
  return router.push({ path: SCHOOLBUS_PATHS.studentOrderForm, query });
}
