import type {
  Recordable,
  UniFormConfig,
  UniOption,
  UniTableColumn,
  UniTableRequest,
  UniTableToolbarConfig
} from 'uni-ui-lib'

export interface CustomerRecord extends Recordable {
  id: number
  customerNo: string
  name: string
  level: 'vip' | 'normal' | 'trial'
  owner: string
  status: 0 | 1
  contractAmount: number
  progress: number
  tags: string[]
  createdAt: string
  lastFollowAt: string
  remark: string
}

export interface DepartmentRecord extends Recordable {
  id: number
  name: string
  manager: string
  memberCount: number
  status: 0 | 1
  createdAt: string
  children?: DepartmentRecord[]
}

export const levelOptions: UniOption[] = [
  { label: 'VIP客户', value: 'vip', type: 'success' },
  { label: '普通客户', value: 'normal', type: 'info' },
  { label: '试用客户', value: 'trial', type: 'warning' }
]

export const statusOptions: UniOption[] = [
  { label: '启用', value: 1, type: 'success' },
  { label: '停用', value: 0, type: 'info' }
]

export const valueEnums: Record<string, UniOption[]> = {
  level: levelOptions,
  status: statusOptions
}

export const customerRows: CustomerRecord[] = [
  {
    id: 1001,
    customerNo: 'CUS-202604-001',
    name: '杭州云舟科技有限公司',
    level: 'vip',
    owner: '张三',
    status: 1,
    contractAmount: 128000,
    progress: 86,
    tags: ['重点客户', '续费中'],
    createdAt: '2026-04-01 10:20:00',
    lastFollowAt: '2026-04-28 09:30:00',
    remark: '本季度重点跟进续费合同。'
  },
  {
    id: 1002,
    customerNo: 'CUS-202604-002',
    name: '上海北辰供应链',
    level: 'normal',
    owner: '李四',
    status: 1,
    contractAmount: 56000,
    progress: 52,
    tags: ['供应链', '标准版'],
    createdAt: '2026-04-03 14:10:00',
    lastFollowAt: '2026-04-25 16:15:00',
    remark: '等待客户确认二期实施排期。'
  },
  {
    id: 1003,
    customerNo: 'CUS-202604-003',
    name: '深圳星河制造',
    level: 'trial',
    owner: '王五',
    status: 0,
    contractAmount: 18000,
    progress: 24,
    tags: ['试用', '制造业'],
    createdAt: '2026-04-09 11:05:00',
    lastFollowAt: '2026-04-22 13:40:00',
    remark: '试用反馈较少，需要安排回访。'
  },
  {
    id: 1004,
    customerNo: 'CUS-202604-004',
    name: '成都远景医疗',
    level: 'vip',
    owner: '赵六',
    status: 1,
    contractAmount: 218000,
    progress: 95,
    tags: ['医疗', '集团客户'],
    createdAt: '2026-04-12 09:45:00',
    lastFollowAt: '2026-04-29 10:00:00',
    remark: '已进入交付验收阶段。'
  },
  {
    id: 1005,
    customerNo: 'CUS-202604-005',
    name: '南京青禾教育',
    level: 'normal',
    owner: '钱七',
    status: 1,
    contractAmount: 72000,
    progress: 61,
    tags: ['教育', '增购'],
    createdAt: '2026-04-16 15:30:00',
    lastFollowAt: '2026-04-27 11:20:00',
    remark: '计划增购数据看板模块。'
  },
  {
    id: 1006,
    customerNo: 'CUS-202604-006',
    name: '武汉湖畔零售',
    level: 'trial',
    owner: '孙八',
    status: 0,
    contractAmount: 32000,
    progress: 35,
    tags: ['零售', '试点门店'],
    createdAt: '2026-04-18 17:00:00',
    lastFollowAt: '2026-04-23 10:10:00',
    remark: '先以三家门店试点。'
  }
]

export const departmentRows: DepartmentRecord[] = [
  {
    id: 1,
    name: '总部',
    manager: '张三',
    memberCount: 36,
    status: 1,
    createdAt: '2026-01-01',
    children: [
      {
        id: 11,
        name: '销售中心',
        manager: '李四',
        memberCount: 18,
        status: 1,
        createdAt: '2026-01-05',
        children: [
          {
            id: 111,
            name: '华东销售组',
            manager: '王五',
            memberCount: 8,
            status: 1,
            createdAt: '2026-02-01'
          },
          {
            id: 112,
            name: '华南销售组',
            manager: '赵六',
            memberCount: 6,
            status: 0,
            createdAt: '2026-02-10'
          }
        ]
      },
      {
        id: 12,
        name: '交付中心',
        manager: '钱七',
        memberCount: 12,
        status: 1,
        createdAt: '2026-01-08'
      }
    ]
  },
  {
    id: 2,
    name: '分公司',
    manager: '孙八',
    memberCount: 16,
    status: 1,
    createdAt: '2026-03-01',
    children: [
      {
        id: 21,
        name: '西南办事处',
        manager: '周九',
        memberCount: 9,
        status: 1,
        createdAt: '2026-03-12'
      }
    ]
  }
]

export const searchConfig: UniFormConfig = {
  schema: [
    {
      field: 'keyword',
      label: '关键词',
      component: 'ElInput',
      componentProps: {
        placeholder: '客户名称 / 编号',
        clearable: true
      },
      colProps: { span: 8 }
    },
    {
      field: 'level',
      label: '客户等级',
      component: 'ElSelect',
      options: levelOptions,
      componentProps: {
        placeholder: '全部',
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'status',
      label: '状态',
      component: 'ElSelect',
      options: statusOptions,
      componentProps: {
        placeholder: '全部',
        clearable: true
      },
      colProps: { span: 6 }
    }
  ],
  formProps: { labelWidth: '82px' },
  rowProps: { gutter: 16 },
  colProps: { span: 8 }
}

export const customerColumns: UniTableColumn[] = [
  { prop: 'customerNo', label: '客户编号', type: 'copy', minWidth: 150 },
  { prop: 'name', label: '客户名称', type: 'text', minWidth: 190, showOverflowTooltip: true },
  { prop: 'level', label: '客户等级', type: 'tag', width: 110 },
  { prop: 'owner', label: '负责人', type: 'text', width: 100 },
  { prop: 'status', label: '状态', type: 'tag', width: 90 },
  { prop: 'contractAmount', label: '合同金额', type: 'money', minWidth: 120 },
  {
    prop: 'progress',
    label: '跟进进度',
    type: 'percent',
    percent: { scale: 1, digits: 0 },
    width: 110
  },
  {
    prop: 'tags',
    label: '标签',
    type: 'array',
    array: { renderMode: 'tag' },
    minWidth: 160
  },
  { prop: 'lastFollowAt', label: '最近跟进', type: 'datetime', minWidth: 170 }
]

export const departmentColumns: UniTableColumn[] = [
  { prop: 'name', label: '部门名称', type: 'text', minWidth: 220 },
  { prop: 'manager', label: '负责人', type: 'text', width: 120 },
  { prop: 'memberCount', label: '成员数', type: 'number', width: 100 },
  { prop: 'status', label: '状态', type: 'tag', width: 100 },
  { prop: 'createdAt', label: '创建日期', type: 'date', minWidth: 140 }
]

export const tableToolbar: UniTableToolbarConfig = {
  refresh: true,
  density: true,
  columnSetting: true,
  fullscreen: true,
  export: true,
  print: true,
  exportFileName: 'customer-list'
}

export const wait = (timeout = 240) => new Promise((resolve) => window.setTimeout(resolve, timeout))

export const getCustomerById = (id: string | number) =>
  customerRows.find((item) => String(item.id) === String(id))

export const createCustomerRequest =
  (): UniTableRequest =>
  async ({ pageNo, pageSize, filters }) => {
    await wait()

    const keyword = String(filters?.keyword ?? '').trim()
    const level = filters?.level
    const status = filters?.status
    const filtered = customerRows.filter((row) => {
      const matchedKeyword = keyword
        ? row.name.includes(keyword) || row.customerNo.includes(keyword)
        : true
      const matchedLevel = level ? row.level === level : true
      const matchedStatus =
        status === '' || status === undefined ? true : row.status === Number(status)

      return matchedKeyword && matchedLevel && matchedStatus
    })
    const start = (pageNo - 1) * pageSize

    return {
      records: filtered.slice(start, start + pageSize),
      total: filtered.length
    }
  }

export const createCustomerDetailConfig = (): UniFormConfig => ({
  mode: 'view',
  view: {
    emptyText: '-'
  },
  formProps: { labelWidth: '78px' },
  rowProps: { gutter: 16 },
  colProps: { span: 12 },
  schema: [
    { field: 'customerNo', label: '客户编号', component: 'ElInput', colProps: { span: 12 } },
    { field: 'name', label: '客户名称', component: 'ElInput', colProps: { span: 12 } },
    {
      field: 'level',
      label: '客户等级',
      component: 'ElSelect',
      viewType: 'tag',
      options: levelOptions,
      colProps: { span: 12 }
    },
    { field: 'owner', label: '负责人', component: 'ElInput', colProps: { span: 12 } },
    {
      field: 'status',
      label: '状态',
      component: 'ElSelect',
      viewType: 'tag',
      options: statusOptions,
      colProps: { span: 12 }
    },
    {
      field: 'contractAmount',
      label: '合同金额',
      component: 'ElInputNumber',
      viewType: 'money',
      colProps: { span: 12 }
    },
    {
      field: 'progress',
      label: '跟进进度',
      component: 'ElInputNumber',
      viewType: 'percent',
      viewRender: ({ value }) => `${String(value ?? 0)}%`,
      colProps: { span: 12 }
    },
    {
      field: 'lastFollowAt',
      label: '最近跟进',
      component: 'ElDatePicker',
      viewType: 'datetime',
      colProps: { span: 12 }
    },
    {
      field: 'remark',
      label: '备注',
      component: 'ElInput',
      componentProps: { type: 'textarea' },
      colProps: { span: 24 }
    }
  ],
  sections: [
    {
      title: '客户信息',
      description: '这里复用 UniForm 的查看态能力，适合详情页和弹窗详情。',
      fields: [
        'customerNo',
        'name',
        'level',
        'owner',
        'status',
        'contractAmount',
        'progress',
        'lastFollowAt',
        'remark'
      ]
    }
  ]
})

export const createCustomerEditConfig = (): UniFormConfig => ({
  mode: 'edit',
  formProps: { labelWidth: '85px' },
  rowProps: { gutter: 16 },
  colProps: { span: 12 },
  rules: {
    name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
    level: [{ required: true, message: '请选择客户等级', trigger: 'change' }],
    owner: [{ required: true, message: '请输入负责人', trigger: 'blur' }]
  },
  schema: [
    {
      field: 'customerNo',
      label: '客户编号',
      component: 'ElInput',
      readonly: true,
      componentProps: { placeholder: '系统自动生成' },
      colProps: { span: 12 }
    },
    {
      field: 'name',
      label: '客户名称',
      component: 'ElInput',
      componentProps: { placeholder: '请输入客户名称', clearable: true },
      colProps: { span: 12 }
    },
    {
      field: 'level',
      label: '客户等级',
      component: 'ElSelect',
      options: levelOptions,
      componentProps: { placeholder: '请选择客户等级', clearable: true },
      colProps: { span: 12 }
    },
    {
      field: 'owner',
      label: '负责人',
      component: 'ElInput',
      componentProps: { placeholder: '请输入负责人', clearable: true },
      colProps: { span: 12 }
    },
    {
      field: 'status',
      label: '状态',
      component: 'ElSwitch',
      componentProps: { activeValue: 1, inactiveValue: 0 },
      colProps: { span: 12 }
    },
    {
      field: 'contractAmount',
      label: '合同金额',
      component: 'ElInputNumber',
      componentProps: { min: 0, precision: 2, controlsPosition: 'right' },
      colProps: { span: 12 }
    },
    {
      field: 'progress',
      label: '跟进进度',
      component: 'ElSlider',
      componentProps: { min: 0, max: 100 },
      colProps: { span: 12 }
    },
    {
      field: 'lastFollowAt',
      label: '最近跟进',
      component: 'ElDatePicker',
      componentProps: {
        type: 'datetime',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        placeholder: '请选择最近跟进时间'
      },
      colProps: { span: 12 }
    },
    {
      field: 'remark',
      label: '备注',
      component: 'ElInput',
      componentProps: { type: 'textarea', rows: 4, placeholder: '请输入备注' },
      colProps: { span: 24 }
    }
  ],
  sections: [
    {
      title: '编辑客户',
      description: '这里复用 UniForm 的编辑态能力，适合编辑页和弹窗编辑。',
      fields: [
        'customerNo',
        'name',
        'level',
        'owner',
        'status',
        'contractAmount',
        'progress',
        'lastFollowAt',
        'remark'
      ]
    }
  ]
})
