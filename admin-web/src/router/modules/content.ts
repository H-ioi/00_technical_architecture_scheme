import type { AppRouteRecord } from '@/types/route'

/** 内容管理 */
export const contentRoute: AppRouteRecord = {
  path: 'content',
  name: 'Content',
  redirect: '/content/announcement',
  meta: {
    title: '内容管理',
    titleKey: 'route.content',
    icon: 'Document'
  },
  children: [
    {
      path: 'announcement',
      name: 'ContentAnnouncement',
      component: () => import('@/views/content/announcement/list.vue'),
      meta: {
        title: '公告内容',
        titleKey: 'route.contentAnnouncement'
      }
    },
    {
      path: 'article',
      name: 'ContentArticle',
      redirect: '/content/article/list',
      meta: {
        title: '文章管理',
        titleKey: 'route.contentArticle'
      },
      children: [
        {
          path: 'list',
          name: 'ContentArticleList',
          component: () => import('@/views/content/article/list/list.vue'),
          meta: {
            title: '文章内容',
            titleKey: 'route.contentArticleList'
          }
        },
        {
          path: 'category',
          name: 'ContentArticleCategory',
          component: () => import('@/views/content/article/category/list.vue'),
          meta: {
            title: '文章分类',
            titleKey: 'route.contentArticleCategory'
          }
        }
      ]
    },
    {
      path: 'moment',
      name: 'ContentMoment',
      redirect: '/content/moment/food-weekly',
      meta: {
        title: '动态内容',
        titleKey: 'route.contentMoment'
      },
      children: [
        {
          path: 'food-weekly',
          name: 'ContentFoodWeekly',
          component: () => import('@/views/content/moment/food-weekly/list.vue'),
          meta: {
            title: '一周食谱',
            titleKey: 'route.contentFoodWeekly'
          }
        },
        {
          path: 'school-life',
          name: 'ContentSchoolLife',
          component: () => import('@/views/content/moment/school-life/list.vue'),
          meta: {
            title: '校园生活',
            titleKey: 'route.contentSchoolLife'
          }
        }
      ]
    },
    {
      path: 'discussion',
      name: 'ContentDiscussion',
      redirect: '/content/discussion/list',
      meta: {
        title: '讨论管理',
        titleKey: 'route.contentDiscussion'
      },
      children: [
        {
          path: 'list',
          name: 'ContentDiscussionList',
          component: () => import('@/views/content/discussion/list/list.vue'),
          meta: {
            title: '内容列表',
            titleKey: 'route.contentDiscussionList'
          }
        },
        {
          path: 'tag',
          name: 'ContentDiscussionTag',
          component: () => import('@/views/content/discussion/tag/list.vue'),
          meta: {
            title: '讨论标签',
            titleKey: 'route.contentDiscussionTag'
          }
        },
        {
          path: 'comment',
          name: 'ContentDiscussionComment',
          component: () => import('@/views/content/discussion/comment/list.vue'),
          meta: {
            title: '讨论评论',
            titleKey: 'route.contentDiscussionComment'
          }
        },
        {
          path: 'like-save',
          name: 'ContentDiscussionLikeSave',
          component: () => import('@/views/content/discussion/like-save/list.vue'),
          meta: {
            title: '点赞收藏',
            titleKey: 'route.contentDiscussionLikeSave'
          }
        }
      ]
    }
  ]
}
