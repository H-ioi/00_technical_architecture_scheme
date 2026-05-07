export default {
  page: {
    title: '成员管理',
    description: '维护后台成员资料、模块角色和账号状态。',
    selectedSummary: '已选择 {selected} 项，共 {total} 项'
  },
  student: {
    page: {
      title: '学生列表',
      description: '维护学生基础资料、家长联系人和账号状态。'
    },
    fields: {
      name: '学生姓名',
      admissionNo: '学号',
      cnFullName: '中文名',
      fullName: '英文名',
      grade: '年级',
      className: '班级',
      form: '班级',
      bus: '校巴',
      dormitory: '住宿',
      parentName: '家长姓名'
    },
    placeholders: {
      keyword: '请输入学生、年级、班级、家长或手机号',
      name: '请输入学生姓名',
      grade: '请输入年级',
      className: '请输入班级',
      form: '请选择班级',
      yearGroup: '请选择年级',
      bus: '请选择校巴',
      dormitory: '请选择住宿',
      parentName: '请输入家长姓名'
    },
    options: {
      enrolled: 'Enrolled',
      leaving: 'Leaving'
    }
  },
  teacher: {
    page: {
      title: '教师列表',
      description: '维护教师资料、模块角色和账号状态。'
    },
    fields: {
      teacherCode: '工号',
      fullName: '姓名',
      gender: '性别',
      nationalities: '国籍',
      role: '职位'
    },
    placeholders: {
      role: '请选择职位'
    },
    options: {
      unarchived: 'Unarchived',
      archived: 'Archived'
    }
  },
  fields: {
    keyword: '关键词',
    school: '校区',
    nickname: '昵称',
    department: '部门',
    email: '邮箱',
    phone: '手机号',
    modules: '模块',
    roles: '角色',
    password: '密码',
    status: '状态',
    lastLoginTime: '最后登录时间',
    createTime: '创建时间'
  },
  placeholders: {
    keyword: '请输入昵称、部门、邮箱或手机号',
    keywordInput: '请输入关键词',
    school: '请选择校区',
    nickname: '请输入昵称',
    department: '请输入部门',
    email: '请输入邮箱',
    phone: '请输入手机号',
    modules: '请选择模块',
    roles: '请选择角色',
    status: '请选择状态',
    input: '请输入',
    select: '请选择'
  },
  actions: {
    add: '新增',
    import: '导入',
    export: '导出',
    detail: '查看',
    edit: '编辑',
    enable: '启用',
    disable: '禁用',
    delete: '删除',
    search: '查询',
    reset: '重置',
    save: '保存',
    cancel: '取消',
    close: '关闭',
    submit: '提交',
    downloadTemplate: '下载模板',
    selectFile: '选择文件'
  },
  options: {
    enabled: '启用',
    disabled: '禁用',
    schoolBus: '校巴',
    activity: '活动',
    schoolBusOperation: '校巴运营',
    carTeacher: '跟车老师',
    activityCheckIn: '活动签到'
  },
  sections: {
    baseInfo: '基础信息',
    accountInfo: '账号信息',
    importInfo: '导入成员'
  },
  validation: {
    nicknameRequired: '请输入昵称',
    departmentRequired: '请输入部门',
    emailRequired: '请输入邮箱',
    phoneRequired: '请输入手机号',
    modulesRequired: '请选择模块',
    rolesRequired: '请选择角色',
    passwordRequired: '请输入密码',
    statusRequired: '请选择状态'
  },
  messages: {
    saved: '保存成功',
    deleted: '删除成功',
    enabled: '启用成功',
    disabled: '禁用成功',
    imported: '导入成功',
    exported: '导出成功',
    templateDownloaded: '模板下载成功',
    selectRows: '请选择成员',
    deleteConfirm: '确定删除选中的成员吗？',
    enableConfirm: '确定启用选中的成员吗？',
    disableConfirm: '确定禁用选中的成员吗？',
    uploadTip: '仅支持 xls、xlsx 文件，大小不超过 10M。',
    uploadRequired: '请先选择导入文件',
    noPermission: '没有操作权限'
  }
}
