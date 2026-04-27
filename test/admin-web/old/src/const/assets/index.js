// 资产状态
export const assetsStatus = [{
  name: "闲置",
  type: 1
},
{
  name: "使用",
  type: 2
},
{
  name: "报废",
  type: 3
},
{
  name: "借用",
  type: 4
}
]
// 资产类型
export const assetsType = [{
  name: "大类",
  type: 2
},
{
  name: "中类",
  type: 3
},
{
  name: "小类",
  type: 4
}
]
// 资产同步类型
export const assetsSyncType = [{
  name: "未同步",
  type: '1',
  btn: [{
    name: "同步",
    type: "enter",
    permissions: "look",
    icon: "el-icon-view",
  },
  {
    name: "不同步",
    type: "noenter",
    permissions: "",
    icon: "el-icon-view",
  },
  ],
},
{
  name: "已同步",
  type: '2',
  btn: []
},
{
  name: "无需同步",
  type: '3',
  btn: []
},
{
  name: "全部",
  type: '4',
  btn: []
},
]
// 采购方式
export const purchaseMethodList = [{
  label: "采购",
  type: 1,
  value: "AaBaCcDd"
},
{
  label: "租赁",
  type: 2,
  value: "EeFfGgHh"
},
{
  label: "其他",
  type: 3,
  value: "IiJjKkL1"
}
]
// 同步资产状态
export const assetsSyncStatus = [{
  label: "闲置",
  type: '1',
  value: "AaBaCcDd"
},
{
  label: "使用中",
  type: '2',
  value: "IiJjKkLl"
},
{
  label: "已报废",
  type: '3',
  value: "Pr6soZ0c"
},
{
  label: "借用中",
  type: '4',
  value: "EeFfGgHh"
},
{
  label: "维修中",
  type: '5',
  value: "POah04Ej"
},
{
  label: "已出售",
  type: '6',
  value: "5jIkDx07"
},
{
  label: "借用(预占领)",
  type: '7',
  value: "GOPkOIqx"
},
{
  label: "领用(预占领)",
  type: '8',
  value: "jQT7Fsau"
},
{
  label: "调拨中(预占领)",
  type: '9',
  value: "WnSIC7y6"
},

]
