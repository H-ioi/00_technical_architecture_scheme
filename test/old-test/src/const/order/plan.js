export default {
  // 周期计划类型
  orderPlanTypeObj: {
    1: '天',
    2: '周',
    3: '月',
    4: '季度',
  },
  orderPlanType: [
    {
      label: "天",
      value: 1,
      range: {
        default: 1,
        min: 1,
        max: 365,
      }
    },
    {
      label: "周",
      value: 2,
      range: {
        default: 1,
        min: 1,
        max: 92,
      }
    },
    {
      label: "月",
      value: 3,
      range: {
        default: 1,
        min: 1,
        max: 72,
      }
    },
    {
      label: "季度",
      value: 4,
      range: {
        default: 1,
        min: 1,
        max: 24,
      }
    },
  ],
  // 周期计划状态
  orderPlanStatus: [
    {
      name: "待执行",
      type: "1",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "编辑",
          type: "edit",
          permissions: "order_periodic_plan_edit",
          icon: "el-icon-view",
        },
        {
          name: "启用",
          type: "enable",
          permissions: "order_periodic_plan_enable",
          icon: "el-icon-view",
        },
        {
          name: "禁用",
          type: "disable",
          permissions: "order_periodic_plan_disable",
          icon: "el-icon-view",
        },
        {
          name: "删除",
          type: "del",
          permissions: "order_periodic_plan_del",
          icon: "el-icon-view",
        },
      ]
    },
    {
      name: "执行中",
      type: "2",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "编辑",
          type: "edit",
          permissions: "order_periodic_plan_edit",
          icon: "el-icon-view",
        },
        {
          name: "启用",
          type: "enable",
          permissions: "order_periodic_plan_enable",
          icon: "el-icon-view",
        },
        {
          name: "禁用",
          type: "disable",
          permissions: "order_periodic_plan_disable",
          icon: "el-icon-view",
        },
        {
          name: "删除",
          type: "del",
          permissions: "order_periodic_plan_del",
          icon: "el-icon-view",
        },
      ]
    },
    {
      name: "已结束",
      type: "3",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },

      ]
    },
    {
      name: "全部",
      type: "4",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "编辑",
          type: "edit",
          permissions: "order_periodic_plan_edit",
          icon: "el-icon-view",
        },
        {
          name: "启用",
          type: "enable",
          permissions: "order_periodic_plan_enable",
          icon: "el-icon-view",
        },
        {
          name: "禁用",
          type: "disable",
          permissions: "order_periodic_plan_disable",
          icon: "el-icon-view",
        },
        {
          name: "删除",
          type: "del",
          permissions: "order_periodic_plan_del",
          icon: "el-icon-view",
        },
      ]
    },
  ],
  // 周期计划表头
  orderPlanTitle: [{
    label: "工单类型",
    prop: "orderTypeLabel",
    width: ""
  },
  {
    label: "计划名称",
    prop: "contact",
    width: ""
  },
  {
    label: "开始时间",
    prop: "beginTime",
    width: ""
  },
  {
    label: "结束时间",
    prop: "endTime",
    width: ""
  },
  {
    label: "紧急程度",
    prop: "urgencyLabel",
    width: ""
  },
  {
    label: "单位",
    prop: "timeUnitLabel",
    width: ""
  },
  {
    label: "指派人",
    prop: "distributeUserName",
    width: ""
  },
  {
    label: "协作人",
    prop: "collaboratorsUserName",
    width: ""
  },
  ],
}
