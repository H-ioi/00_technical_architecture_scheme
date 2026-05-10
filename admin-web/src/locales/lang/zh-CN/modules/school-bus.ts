export default {
  driver: {
    page: {
      title: '司机管理',
      description: '维护校车司机档案，支持按校区与关键字筛选、批量导入与删除。'
    },
    fields: {
      school: '所属校区',
      name: '姓名',
      employeeNo: '工号',
      contact: '联系方式',
      age: '年龄',
      licenseType: '准驾车型',
      status: '状态'
    },
    placeholders: {
      school: '请选择校区',
      keyword: '姓名 / 工号',
      status: '状态',
      name: '请输入姓名',
      employeeNo: '请输入工号',
      contact: '请输入联系方式',
      licenseType: '如 C1、A1'
    },
    actions: {
      search: '查询',
      reset: '重置',
      add: '新增',
      edit: '编辑',
      delete: '删除',
      import: '导入',
      downloadTemplate: '下载模板',
      cancel: '取消',
      submit: '确定'
    },
    messages: {
      saveSuccess: '保存成功',
      deleteSuccess: '删除成功',
      importSuccess: '导入成功',
      confirmDelete: '确定删除所选司机吗？'
    },
    options: {
      enabled: '启用',
      disabled: '停用'
    },
    rules: {
      schoolIds: '请选择所属校区',
      name: '请输入姓名',
      employeeNo: '请输入工号',
      status: '请选择状态'
    }
  }
}
