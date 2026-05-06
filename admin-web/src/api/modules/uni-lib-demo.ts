import type {
  CustomerListParams,
  CustomerRecord,
  DepartmentRecord,
  PageResult
} from '@/types/modules/uni-lib-demo'

const wait = (timeout = 240) => new Promise((resolve) => window.setTimeout(resolve, timeout))

const customerRows: CustomerRecord[] = [
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

const departmentRows: DepartmentRecord[] = [
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

export const fetchCustomerList = async (
  params: CustomerListParams
): Promise<PageResult<CustomerRecord>> => {
  await wait()

  const keyword = String(params.keyword ?? '').trim()
  const filtered = customerRows.filter((row) => {
    const matchedKeyword = keyword
      ? row.name.includes(keyword) || row.customerNo.includes(keyword)
      : true
    const matchedLevel = params.level ? row.level === params.level : true
    const matchedStatus =
      params.status === '' || params.status === undefined
        ? true
        : row.status === Number(params.status)

    return matchedKeyword && matchedLevel && matchedStatus
  })
  const start = (params.pageNo - 1) * params.pageSize

  return {
    records: filtered.slice(start, start + params.pageSize),
    total: filtered.length
  }
}

export const fetchActiveCustomers = async () => {
  await wait()

  return customerRows.filter((item) => item.status === 1)
}

export const fetchCustomerDetail = async (id: string | number) => {
  await wait()

  return customerRows.find((item) => String(item.id) === String(id)) ?? null
}

export const fetchDepartmentTree = async () => {
  await wait()

  return departmentRows
}
