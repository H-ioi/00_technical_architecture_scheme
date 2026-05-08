export default {
  page: {
    title: '协议管理',
    description: '维护协议文档、签署要求和启停状态。'
  },
  fields: {
    school: '校区',
    cnName: '中文名',
    enName: '英文名',
    protocolType: '协议类型',
    module: '所属模块',
    needSign: '是否需要签名',
    status: '状态',
    documentUrl: '文档',
    createTime: '创建时间',
    updateTime: '更新时间',
    studentName: '姓名',
    admissionNo: '学号',
    grade: '年级',
    signImageUrl: '签名'
  },
  placeholders: {
    school: '请选择校区',
    cnName: '请输入中文名',
    enName: '请输入英文名',
    protocolType: '请选择协议类型',
    module: '请选择所属模块',
    needSign: '请选择是否需要签名',
    status: '请选择状态'
  },
  actions: {
    add: '新增',
    edit: '编辑',
    detail: '查看',
    delete: '删除',
    search: '查询',
    reset: '重置',
    submit: '确认',
    cancel: '取消',
    close: '关闭'
  },
  options: {
    yes: '是',
    no: '否',
    enabled: '启用',
    disabled: '禁用'
  },
  messages: {
    saveSuccess: '保存成功',
    deleteSuccess: '删除成功',
    confirmDelete: '确定要删除选中的协议吗？',
    uploadPdfOnly: '只能上传 PDF 文件',
    uploadPdfSize: 'PDF 文件不能超过 10M',
    uploadRequired: '请上传协议文档'
  },
  detail: {
    title: '协议详情',
    signRecords: '签署记录'
  }
}
