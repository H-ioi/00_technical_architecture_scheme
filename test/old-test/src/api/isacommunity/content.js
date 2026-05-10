import request from "@/router/newaxios/axios";
// 通用接口
const contentCommon = "/isacommunity/content/common";
// 导航按钮
const navigateButton = "/isacommunity/content/navigate-button";
// 导航按钮关联文章
const navigateButtonArticle = "/isacommunity/content/navigate-button-article";
// 内容分类
const contentCategory = "/isacommunity/content/category";
// 公告内容
const contentAnnouncement = "/isacommunity/content/announcement";
// 文章内容
const contentArticle = "/isacommunity/content/article";
// 讨论标签
const discussionTag = "/isacommunity/content/discussion-tag";
// 讨论内容
const discussionContent = "/isacommunity/content/discussion";
// 讨论评论
const discussionComment = "/isacommunity/content/comment";
// 一周食谱
const foodWeekly = "/isacommunity/content/foodweekly";
// 讨论内容点赞和收藏
const discussionLikeAndFavor = "/isacommunity/content/like-and-favor";
// 校园生活
const contentMoment = "/isacommunity/content/moment";
// 通用接口
export async function getContentSchoolList(params) {
  try {
    const res = await request({
      url: `/isacommunity/buscommon/getNewSchoolList`,
      method: "get",
    });
    return res.data.data;
  } catch (error) {
    throw error;
  }
}
export async function getContentMomentTypeList(params) {
  try {
    const res = await request({
      url: `${contentCommon}/momentTypeList`,
      method: "get",
    });
    return res.data.data;
  } catch (error) {
    throw error;
  }
}
// 导航按钮接口
export async function getnavigateButtonArticle(id) {
  try {
    const res = await request({
      url: `${navigateButtonArticle}/${id}`,
      method: "get",
    });
    return res.data.data;
  } catch (error) {
    throw error;
  }
}
export function getNavigateButtonPage(params) {
  return request({
    url: `${navigateButton}/page`,
    method: "get",
    params: params,
  });
}

export function getNavigateButtonDetail(id) {
  return request({
    url: `${navigateButton}/${id}`,
    method: "get",
  });
}
export function addNavigateButton(data) {
  return request({
    url: `${navigateButton}/create`,
    method: "post",
    data,
  });
}
export function editNavigateButton(data) {
  return request({
    url: `${navigateButton}/update`,
    method: "post",
    data,
  });
}
export function delNavigateButton(data) {
  return request({
    url: `${navigateButton}/delete`,
    method: "post",
    data,
  });
}
// 内容分类接口
export async function getContentCategoryList(params) {
  try {
    const res = await request({
      url: `${contentCategory}/list`,
      method: "get",
    });
    return res.data.data;
  } catch (error) {
    throw error;
  }
}
export function getContentCategoryPage(params) {
  return request({
    url: `${contentCategory}/page`,
    method: "get",
    params: params,
  });
}

export function getContentCategoryDetail(id) {
  return request({
    url: `${contentCategory}/${id}`,
    method: "get",
  });
}
export function addContentCategory(data) {
  return request({
    url: `${contentCategory}/create`,
    method: "post",
    data,
  });
}
export function editContentCategory(data) {
  return request({
    url: `${contentCategory}/update`,
    method: "post",
    data,
  });
}
export function delContentCategory(data) {
  return request({
    url: `${contentCategory}/delete`,
    method: "post",
    data,
  });
}
// 公告内容接口
export function getContentAnnouncementPage(params) {
  return request({
    url: `${contentAnnouncement}/page`,
    method: "get",
    params: params,
  });
}

export function getContentAnnouncementDetail(id) {
  return request({
    url: `${contentAnnouncement}/${id}`,
    method: "get",
  });
}
export function addContentAnnouncement(data) {
  return request({
    url: `${contentAnnouncement}/create`,
    method: "post",
    data,
  });
}
export function editContentAnnouncement(data) {
  return request({
    url: `${contentAnnouncement}/update`,
    method: "post",
    data,
  });
}
export function delContentAnnouncement(data) {
  return request({
    url: `${contentAnnouncement}/delete`,
    method: "post",
    data,
  });
}
// 文章内容接口
export async function getContentArticleList(params = {}) {
  try {
    const res = await request({
      url: `${contentArticle}/visible`,
      method: "get",
      params: params,
    });
    let data = res.data.data || [];
    return data.map((item) => ({
      label: item.cnTitle,
      enLabel: item.enTitle,
      key: item.id,
    }));
  } catch (error) {
    throw error;
  }
}
export function getContentArticlePage(params) {
  return request({
    url: `${contentArticle}/page`,
    method: "get",
    params: params,
  });
}
export function getContentArticleDetail(id) {
  return request({
    url: `${contentArticle}/${id}`,
    method: "get",
  });
}
export function addContentArticle(data) {
  return request({
    url: `${contentArticle}/create`,
    method: "post",
    data,
  });
}
export function editContentArticle(data) {
  return request({
    url: `${contentArticle}/update`,
    method: "post",
    data,
  });
}
export function delContentArticle(data) {
  return request({
    url: `${contentArticle}/delete`,
    method: "post",
    data,
  });
}
// 讨论标签接口
export async function getDiscussionTagList(params) {
  try {
    const res = await request({
      url: `${discussionTag}/list`,
      method: "get",
    });
    return res.data.data;
  } catch (error) {
    throw error;
  }
}
export function getDiscussionTagPage(params) {
  return request({
    url: `${discussionTag}/page`,
    method: "get",
    params: params,
  });
}

export function getDiscussionTagDetail(id) {
  return request({
    url: `${discussionTag}/${id}`,
    method: "get",
  });
}
export function addDiscussionTag(data) {
  return request({
    url: `${discussionTag}/create`,
    method: "post",
    data,
  });
}
export function editDiscussionTag(data) {
  return request({
    url: `${discussionTag}/update`,
    method: "put",
    data,
  });
}
export function delDiscussionTag(id) {
  return request({
    url: `${discussionTag}/delete?id=${id}`,
    method: "post",
  });
}
// 讨论评论接口
export function getDiscussionCommentPage(params) {
  return request({
    url: `${discussionComment}/page`,
    method: "get",
    params: params,
  });
}

export function getDiscussionCommentDetail(id) {
  return request({
    url: `${discussionComment}/detail/${id}`,
    method: "get",
  });
}
export function addDiscussionComment(data) {
  return request({
    url: `${discussionComment}/create`,
    method: "post",
    data,
  });
}
export function editDiscussionComment(data) {
  return request({
    url: `${discussionComment}/update`,
    method: "post",
    data,
  });
}
export function delDiscussionComment(id) {
  return request({
    url: `${discussionComment}/${id}`,
    method: "post",
  });
}
// 一周食谱接口
export function getFoodWeeklyPage(params) {
  return request({
    url: `${foodWeekly}/page`,
    method: "get",
    params: params,
  });
}

export function getFoodWeeklyDetail(id) {
  return request({
    url: `${foodWeekly}/${id}`,
    method: "get",
  });
}
export function addFoodWeekly(data) {
  return request({
    url: `${foodWeekly}/create`,
    method: "post",
    data,
  });
}
export function editFoodWeekly(data) {
  return request({
    url: `${foodWeekly}/update`,
    method: "post",
    data,
  });
}
export function delFoodWeekly(data) {
  return request({
    url: `${foodWeekly}/delete`,
    method: "post",
    data,
  });
}
// 讨论内容点赞和收藏接口
export function getDiscussionLikeAndFavorPage(params) {
  return request({
    url: `${discussionLikeAndFavor}/page`,
    method: "get",
    params: params,
  });
}

export function getDiscussionLikeAndFavorDetail(id) {
  return request({
    url: `${discussionLikeAndFavor}/${id}`,
    method: "get",
  });
}
export function addDiscussionLikeAndFavor(data) {
  return request({
    url: `${discussionLikeAndFavor}/create`,
    method: "post",
    data,
  });
}
export function editDiscussionLikeAndFavor(data) {
  return request({
    url: `${discussionLikeAndFavor}/update`,
    method: "post",
    data,
  });
}
export function delDiscussionLikeAndFavor(data) {
  return request({
    url: `${discussionLikeAndFavor}/delete`,
    method: "post",
    data,
  });
}
// 讨论内容
export function getDiscussionContentPage(params) {
  return request({
    url: `${discussionContent}/page`,
    method: "get",
    params: params,
  });
}
export async function getDiscussionContentList(params) {
  try {
    const res = await request({
      url: `${discussionContent}/listAll`,
      method: "get",
      params: params,
    });
    return res.data.data;
  } catch (error) {
    throw error;
  }
}
export function getDiscussionContentDetail(id) {
  return request({
    url: `${discussionContent}/${id}`,
    method: "get",
  });
}
export function addDiscussionContent(data) {
  return request({
    url: `${discussionContent}/create`,
    method: "post",
    data,
  });
}
export function editDiscussionContent(data) {
  return request({
    url: `${discussionContent}/update`,
    method: "post",
    data,
  });
}
export function delDiscussionContent(data) {
  return request({
    url: `${discussionContent}/delete`,
    method: "post",
    data,
  });
}
// 校园生活接口
export function getContentMomentPage(params) {
  return request({
    url: `${contentMoment}/page`,
    method: "get",
    params: params,
  });
}

export function getContentMomentDetail(id) {
  return request({
    url: `${contentMoment}/${id}`,
    method: "get",
  });
}
export function addContentMoment(data) {
  return request({
    url: `${contentMoment}/create`,
    method: "post",
    data,
  });
}
export function editContentMoment(data) {
  return request({
    url: `${contentMoment}/update`,
    method: "post",
    data,
  });
}
export function delContentMoment(data) {
  return request({
    url: `${contentMoment}/delete`,
    method: "post",
    data,
  });
}
