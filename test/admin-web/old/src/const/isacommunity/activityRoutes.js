/**
 * 活动模块页面路径与导航，避免列表 / 详情 / 编辑多处硬编码不一致。
 * 查看与编辑共用详情页，通过 query.mode=view|edit 区分。
 */
export const ACTIVITY_PATHS = {
  list: "/isacommunity/activity/list/index",
  detail: "/isacommunity/activity/detail/index",
};

/**
 * @param {import('vue-router').default} router
 * @param {string|number} id 活动 id
 */
export function navigateToActivityDetail(router, id) {
  return router.push({
    path: ACTIVITY_PATHS.detail,
    query: { id: String(id), mode: "view" },
  });
}

/**
 * @param {import('vue-router').default} router
 * @param {string|number} id 活动 id
 */
export function navigateToActivityEdit(router, id) {
  return router.push({
    path: ACTIVITY_PATHS.detail,
    query: { id: String(id), mode: "edit" },
  });
}

/** 新增活动：二级页无 id，仅 mode=edit */
export function navigateToActivityCreate(router) {
  return router.push({
    path: ACTIVITY_PATHS.detail,
    query: { mode: "edit" },
  });
}
