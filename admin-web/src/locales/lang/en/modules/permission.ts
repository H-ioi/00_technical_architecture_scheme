export default {
  actions: {
    search: 'Search',
    reset: 'Reset',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    assignMenu: 'Menus',
    add: 'Add',
    addDept: 'Add',
    updateDept: 'Edit',
    saveDept: 'Save',
    deptUpdate: 'Update',
    deptDelete: 'Remove'
  },
  menu: {
    title: 'Menus',
    description: 'Tenant menu tree and allowed field edits (legacy `/admin/menu`).',
    columns: {
      name: 'Name',
      icon: 'Icon',
      sort: 'Sort',
      path: 'Path',
      type: 'Type',
      cache: 'Cache',
      permission: 'Permission key',
      ops: 'Actions'
    },
    type: {
      left: 'Side menu',
      top: 'Top menu',
      button: 'Button',
      unknown: '—'
    },
    cacheOn: 'On',
    cacheOff: 'Off',
    editTitle: 'Edit menu',
    parent: 'Parent',
    icon: 'Icon',
    name: 'Name',
    sort: 'Sort',
    rootParent: 'Root'
  },
  dept: {
    title: 'Departments',
    description: 'Department tree and form (legacy `/admin/dept`).',
    parent: 'Parent id',
    code: 'Dept id',
    name: 'Name',
    sort: 'Sort'
  },
  role: {
    title: 'Roles',
    description: 'Role CRUD, simplified data scope and menu assignment (legacy `/admin/role`).',
    columns: {
      name: 'Role name',
      code: 'Role code',
      desc: 'Description',
      dpType: 'Data scope',
      created: 'Created',
      ops: 'Actions'
    },
    formAdd: 'Add role',
    formEdit: 'Edit role',
    dpAll: 'All data',
    dpSelf: 'Self only',
    dpSelfBranch: 'Self & subordinates',
    dpDept: 'Current dept',
    dpDeptBranch: 'Dept & children',
    dpCustom: 'Custom (departments)'
  },
  user: {
    title: 'Users',
    description: 'Filter by department, CRUD users (legacy `/admin/isauser`).',
    columns: {
      username: 'Username',
      nickname: 'Nickname',
      email: 'Email',
      phone: 'Phone',
      dept: 'Department',
      roles: 'Roles',
      status: 'Status',
      created: 'Created',
      ops: 'Actions'
    },
    statusActive: 'Active',
    statusLocked: 'Locked',
    formAdd: 'Add user',
    formEdit: 'Edit user',
    placeholders: {
      username: 'Username',
      nickname: 'Nickname',
      email: 'Email',
      phone: 'Phone',
      password: 'Password (optional on edit)',
      dept: 'Department',
      role: 'Roles'
    }
  },
  messages: {
    deleteRoleConfirm: 'Delete role "{name}"?',
    deleteUserConfirm: 'Delete user "{name}"?',
    assignMenuSaved: 'Menu permissions saved',
    saveOk: 'Saved',
    deleteDeptConfirm: 'Delete this department permanently?',
    deptLoadErr: 'Failed to load departments',
    pickDeptErr: 'Select a department in the tree first',
    customDeptWarn: 'Pick departments when using custom data scope.',
    deptScopeHint: 'When data scope is custom, select accessible departments here.'
  }
}
