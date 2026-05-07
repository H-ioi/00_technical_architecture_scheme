export default {
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
      yes: '是',
      no: '否',
      enrolled: '已入读',
      leaving: '离校'
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
    school: '校区',
    email: '邮箱',
    phone: '手机号',
    status: '状态',
    createTime: '创建时间'
  },
  placeholders: {
    keywordInput: '请输入关键词',
    school: '请选择校区',
    status: '请选择状态'
  },
  actions: {
    detail: '查看',
    search: '查询',
    reset: '重置',
    close: '关闭'
  }
}
