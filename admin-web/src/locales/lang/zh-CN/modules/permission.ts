export default {
  actions: {
    search: '查询',
    reset: '重置',
    save: '保存',
    cancel: '取消',
    edit: '编辑',
    delete: '删除',
    assignMenu: '分配菜单',
    add: '新增',
    addDept: '添加',
    updateDept: '编辑',
    saveDept: '保存',
    deptUpdate: '更新',
    deptDelete: '删除'
  },
  menu: {
    title: '菜单管理',
    description: '租户菜单树查看与租户侧允许的字段编辑（对齐旧 `/admin/menu`）。',
    columns: {
      name: '菜单名称',
      icon: '图标',
      sort: '排序',
      path: '路径',
      type: '类型',
      cache: '缓存',
      permission: '权限标识',
      ops: '操作'
    },
    type: {
      left: '左侧菜单',
      top: '顶栏菜单',
      button: '按钮',
      unknown: '—'
    },
    cacheOn: '开启',
    cacheOff: '关闭',
    editTitle: '编辑菜单',
    parent: '上级菜单',
    icon: '图标',
    name: '名称',
    sort: '排序',
    rootParent: '根节点'
  },
  dept: {
    title: '部门管理',
    description: '部门树与表单维护（对齐旧 `/admin/dept`）。',
    parent: '上级节点 id',
    code: '部门编码',
    name: '部门名称',
    sort: '排序'
  },
  role: {
    title: '角色管理',
    description:
      '角色分页 CRUD、数据权限简明配置与菜单分配（对齐旧 `/admin/role`；字典级授权后续迭代补强）。',
    columns: {
      name: '角色名称',
      code: '角色标识',
      desc: '描述',
      dpType: '数据权限',
      created: '创建时间',
      ops: '操作'
    },
    formAdd: '新增角色',
    formEdit: '编辑角色',
    dpAll: '全部数据',
    dpSelf: '仅本人数据',
    dpSelfBranch: '本人及下级',
    dpDept: '本部门',
    dpDeptBranch: '本部门及子部门',
    dpCustom: '自定义（部门勾选）'
  },
  user: {
    title: '用户管理',
    description: '按部门筛选系统用户列表，支持新增编辑删除（对齐旧 `/admin/isauser`）。',
    columns: {
      username: '用户名',
      nickname: '昵称',
      email: '邮箱',
      phone: '手机',
      dept: '部门',
      roles: '角色',
      status: '状态',
      created: '创建时间',
      ops: '操作'
    },
    statusActive: '有效',
    statusLocked: '锁定',
    formAdd: '新增用户',
    formEdit: '编辑用户',
    placeholders: {
      username: '用户名',
      nickname: '昵称',
      email: '邮箱',
      phone: '手机',
      password: '登录密码（编辑可留空）',
      dept: '请选择部门',
      role: '请选择角色'
    }
  },
  messages: {
    deleteRoleConfirm: '确认删除角色「{name}」?',
    deleteUserConfirm: '确认删除用户「{name}」?',
    assignMenuSaved: '权限已保存',
    saveOk: '保存成功',
    deleteDeptConfirm: '将永久删除所选部门，是否继续？',
    deptLoadErr: '部门数据加载失败',
    pickDeptErr: '请先在左侧选择部门节点',
    customDeptWarn: '数据权限「自定义」需勾选管辖部门。',
    deptScopeHint: '当数据权限为「自定义」时，在此勾选可访问部门。'
  }
}
