import Layout from "@/page/index/";

export default [
  {
    path: "/enquiry",
    component: Layout,
    children: [
      {
        path: "/student/detail",
        name: "学生详情",
        meta: {},
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/page/thepool/student/detail"
          ),
      },
      {
        path: "/guardian/detail",
        name: "家长详情",
        meta: {},
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/page/thepool/guardian/detail"
          ),
      },
      {
        path: "/thepool/enquiry/index/index",
        name: "咨询列表",
        meta: {
          keepAlive: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/thepool/enquiry/index/index"
          ),
      },
      {
        path: "/thepool/enquiry/my/index",
        name: "我的咨询",
        meta: {
          keepAlive: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/thepool/enquiry/my/index"
          ),
      },
      {
        path: "/thepool/enquiry/detail",
        name: "咨询详情",
        meta: {},
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/page/thepool/consult/detail"
          ),
      },
      {
        path: "/thepool/user/student/index",
        name: "学生管理",
        meta: {
          keepAlive: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/thepool/user/student/index"
          ),
      },
      {
        path: "/thepool/user/student/mine",
        name: "我的学生",
        meta: {
          keepAlive: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/thepool/user/student/mine"
          ),
      },
      {
        path: "/thepool/user/guardian/index",
        name: "家长管理",
        meta: {
          keepAlive: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/thepool/user/guardian/index"
          ),
      },
      {
        path: "/thepool/user/guardian/mine",
        name: "我的家长",
        meta: {
          keepAlive: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/thepool/user/guardian/mine"
          ),
      },
      {
        path: "/thepool/activity/list",
        name: "活动列表",
        meta: {
          keepAlive: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/thepool/activity/list"
          ),
      },
      {
        path: "/thepool/activity/detail",
        name: "活动详情",
        meta: {},
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/page/thepool/activity/detail"
          ),
      },
      {
        path: "/thepool/activity/templatelist",
        name: "收集信息表",
        meta: {},
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/thepool/activity/templatelist"
          ),
      },
      {
        path: "/thepool/activity/templateresult",
        name: "收集信息结果",
        meta: {},
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/thepool/activity/templateresult"
          ),
      },
      {
        path: "/thepool/activity/templateform",
        name: "收集表动态表单",
        meta: {},
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/page/thepool/activity/templateform"
          ),
      },
      {
        path: "/thepool/template",
        name: "模板表单",
        meta: {},
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/page/thepool/template/index"
          ),
      },
      {
        path: "/thepool/collaboration/team/detail",
        name: "团队详情",
        meta: {},
        component: () =>
          import(/* webpackChunkName: "views" */ "@/page/thepool/team/detail"),
      },
      {
        path: "/thepool/collaboration/task/detail",
        name: "任务详情",
        meta: {},
        component: () =>
          import(/* webpackChunkName: "views" */ "@/page/thepool/task/detail"),
      },
      {
        path: "/thepool/collaboration/event/detail",
        name: "事件详情",
        meta: {},
        component: () =>
          import(/* webpackChunkName: "views" */ "@/page/thepool/event/detail"),
      },
      {
        path: "/thepool/email/detail",
        name: "邮箱详情",
        meta: {},
        component: () =>
          import(/* webpackChunkName: "views" */ "@/page/thepool/email/detail"),
      },
      {
        path: "/thepool/email/senddetail",
        name: "邮件详情",
        meta: {},
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/page/thepool/email/senddetail"
          ),
      },
      {
        path: "/thepool/activity/templateform_show",
        name: "收集表动态表单",
        meta: {},
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/page/thepool/activity/templateform_show"
          ),
      },
      {
        path: "/thepool/activity/guardianchild",
        name: "家长表单模板",
        meta: {},
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/thepool/activity/guardianchild"
          ),
      },
    ],
  },
];
