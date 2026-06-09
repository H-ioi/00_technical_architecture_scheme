import Layout from "@/page/index/";

export default [
  {
    path: "/isacommunity",
    component: Layout,
    children: [
      {
        path: "/isacommunity/schoolDoctor/studentRecord",
        name: "学生档案",
        meta: {
          keepAlive: true,
          enName: "Student Record",
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/isacommunity/schoolDoctor/studentRecord/index"
          ),
      },
      {
        path: "/isacommunity/schoolDoctor/medicalInfo",
        name: "医疗信息",
        meta: {
          keepAlive: true,
          enName: "Medical Information",
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/isacommunity/schoolDoctor/medicalInfo/index"
          ),
      },
      {
        path: "/isacommunity/schoolDoctor/regulation",
        name: "规章制度",
        meta: {
          keepAlive: true,
          enName: "Regulation",
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/isacommunity/schoolDoctor/regulation/index"
          ),
      },
      {
        path: "/isacommunity/schoolDoctor/medicineApply",
        name: "用药申请",
        meta: {
          keepAlive: true,
          enName: "Medicine Apply",
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/isacommunity/schoolDoctor/medicineApply/index"
          ),
      },
      {
        path: "/isacommunity/schoolDoctor/visitRecord",
        name: "就诊记录",
        meta: {
          keepAlive: true,
          enName: "Visit Record",
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/isacommunity/schoolDoctor/visitRecord/index"
          ),
      },
      {
        path: "/isacommunity/schoolDoctor/diseaseSetting",
        name: "疾病设置",
        meta: {
          keepAlive: true,
          enName: "Disease Setting",
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/isacommunity/schoolDoctor/diseaseSetting/index"
          ),
      },
      {
        path: "/isacommunity/schoolDoctor/infectiousDisease",
        name: "传染病管理",
        meta: {
          keepAlive: true,
          enName: "Infectious Disease Management",
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/isacommunity/schoolDoctor/infectiousDisease/index"
          ),
      },
      {
        path: "/isacommunity/schoolDoctor/healthReport",
        name: "体检报告",
        meta: {
          keepAlive: true,
          enName: "Health Report",
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */ "@/views/isacommunity/schoolDoctor/healthReport/index"
          ),
      },
    ],
  },
];
