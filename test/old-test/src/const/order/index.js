export const order = {
  visitTypeList: [
    {
      label: "施工",
      enLabel: "Construction",
      value: 1,
    },
    {
      label: "非施工",
      enLabel: "Non-Constructional",
      value: 2,
    },
  ],
  visitStatusList: [
    {
      label: "待审批",
      enLabel: "Pending Approval",
      value: 1,
      name: "待审批",
      type: 1,
      btnList: [
        {
          name: "查看",
          type: "look",
          icon: "",
          permission: "look",
        },
        {
          name: "编辑",
          type: "edit",
          icon: "",
          permission: "order_demand_edit",
        },
        {
          name: "审批",
          type: "approve",
          icon: "",
          permission: "oms_visit_info_audit_one",
        },
      ],
    },

    {
      label: "已同意",
      enLabel: "Approved",
      value: 3,
      name: "已同意",
      type: 3,
      btnList: [{ name: "查看", type: "look", icon: "", permission: "look" }],
    },
    {
      label: "已到达",
      enLabel: "Arrived",
      value: 4,
      name: "已到达",
      type: 4,
      btnList: [{ name: "查看", type: "look", icon: "", permission: "look" }],
    },
    {
      label: "已离开",
      enLabel: "Left",
      value: 5,
      name: "已离开",
      type: 5,
      btnList: [{ name: "查看", type: "look", icon: "", permission: "look" }],
    },
    {
      label: "已拒绝",
      enLabel: "Rejected",
      value: 2,
      name: "已拒绝",
      type: 2,
      btnList: [
        { name: "查看", type: "look", icon: "", permission: "look" },
        // {
        //   name: "重新提交",
        //   type: "resubmit",
        //   icon: "",
        //   permission: "oms_visit_info_add",
        // },
      ],
    },
    {
      label: "全部",
      enLabel: "All",
      value: "all",
      name: "全部",
      type: "all",
      btnList: [{ name: "查看", type: "look", icon: "", permission: "look" }],
    },
  ],
  orderTypePermissions: {
    1: "order_demand_add",
    2: "order_carry_add",
    3: "order_inspect_add",
    4: "order_repair_add",
    5: "order_spotcheck_add",
    6: "order_upkeep_add",
  },
  // 工单状态
  orderStatus: {
    1: "待处理",
    2: "处理中",
    5: "已完成",
    6: "已评价",
    10: "已取消",
  },
  // 工单类型
  orderType: [
    {
      label: "服务需求",
      enLabel: "Service Request",
      value: "1",
      add: "/order/service/add",
      edit: "/order/service/edit",
      detail: "/order/service/detail",
    },
    {
      label: "搬运服务",
      enLabel: "Relocation Request",
      value: "2",
      add: "/order/carry/add",
      edit: "/order/carry/edit",
      detail: "/order/carry/detail",
    },
    {
      label: "巡检工单",
      enLabel: "Inspect Request",
      value: "3",
      add: "/order/inspect/add",
      edit: "/order/inspect/edit",
      detail: "/order/inspect/detail",
    },
    {
      label: "维修工单",
      enLabel: "Repair Request",
      value: "4",
      add: "/order/repair/add",
      edit: "/order/repair/edit",
      detail: "/order/repair/detail",
    },
    {
      label: "点检工单",
      enLabel: "Spot Check Request",
      value: "5",
      add: "/order/spotcheck/add",
      edit: "/order/spotcheck/edit",
      detail: "/order/spotcheck/detail",
    },
    {
      label: "保养工单",
      enLabel: "UPKEEP Request",
      value: "6",
      add: "/order/upkeep/add",
      edit: "/order/upkeep/edit",
      detail: "/order/upkeep/detail",
    },
  ],
  orderTitle: [
    {
      label: "工单类型",
      prop: "typeName",
      width: "",
    },
    {
      label: "紧急程度",
      prop: "urgencyName",
      width: "",
    },
    {
      label: "申请人",
      prop: "contact",
      width: "",
    },
    {
      label: "电话",
      prop: "phone",
      width: "",
    },
    {
      label: "所属部门",
      prop: "department",
      width: "",
    },
    {
      label: "创建时间",
      prop: "createTime",
      width: "",
    },
  ],
  orderListStatus: [
    {
      name: "待处理",
      type: "1",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "派单",
          type: "distribute",
          permissions: "order_distribute",
          icon: "el-icon-edit-outline",
        },
        {
          name: "取消",
          type: "cancel",
          permissions: "order_cancel",
          icon: "el-icon-circle-close",
        },
      ],
    },
    {
      name: "处理中",
      type: "2",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "派单",
          type: "distribute",
          permissions: "order_distribute",
          icon: "el-icon-edit-outline",
        },
        {
          name: "完单",
          type: "complete",
          permissions: "order_complete",
          icon: "el-icon-edit-outline",
        },
        {
          name: "补充",
          type: "supply",
          permissions: "order_supply",
          icon: "el-icon-edit-outline",
        },
        {
          name: "取消",
          type: "cancel",
          permissions: "order_cancel",
          icon: "el-icon-circle-close",
        },
      ],
    },
    {
      name: "已完成",
      type: "5",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "评价",
          type: "appraise",
          permissions: "order_appraise",
          icon: "el-icon-chat-dot-round",
        },
      ],
    },
    {
      name: "已评价",
      type: "6",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
        // { name: "取消", type: "cancel", icon: "el-icon-circle-close" },
      ],
    },
    {
      name: "已取消",
      type: "10",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
      ],
    },
    {
      name: "全部",
      type: "all",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
      ],
    },
  ],
  orderMyStatus: [
    {
      name: "处理中",
      type: "2",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "派单",
          type: "distribute",
          permissions: "order_distribute",
          icon: "el-icon-edit-outline",
        },
        {
          name: "完单",
          type: "complete",
          permissions: "order_complete",
          icon: "el-icon-edit-outline",
        },
        {
          name: "补充",
          type: "supply",
          permissions: "order_supply",
          icon: "el-icon-edit-outline",
        },
        {
          name: "取消",
          type: "cancel",
          permissions: "order_cancel",
          icon: "el-icon-circle-close",
        },
      ],
    },
    {
      name: "待处理",
      type: "1",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "派单",
          type: "distribute",
          permissions: "order_distribute",
          icon: "el-icon-edit-outline",
        },
        {
          name: "取消",
          type: "cancel",
          permissions: "order_cancel",
          icon: "el-icon-circle-close",
        },
      ],
    },
    {
      name: "已完成",
      type: "5",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "评价",
          type: "appraise",
          permissions: "order_appraise",
          icon: "el-icon-chat-dot-round",
        },
      ],
    },
    {
      name: "已评价",
      type: "6",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
        // { name: "取消", type: "cancel", icon: "el-icon-circle-close" },
      ],
    },
    {
      name: "已取消",
      type: "10",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
      ],
    },
    {
      name: "全部",
      type: "all",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
      ],
    },
  ],
};
