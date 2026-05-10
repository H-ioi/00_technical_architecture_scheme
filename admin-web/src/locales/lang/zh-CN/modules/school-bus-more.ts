export default {
  studentApply: {
    page: { title: '申请意向管理', description: '维护校车乘车意向申请、审批与缴费状态（对齐旧版）。' },
    columns: {
      id: 'ID',
      applyTime: '申请时间',
      approvalStatus: '申请状态',
      paymentStatus: '缴费状态',
      school: '校区',
      section: '学期',
      admissionNo: '学号',
      studentName: '姓名',
      grade: '年级',
      line: '路线',
      station: '站点',
      pickup: '接送方式'
    },
    placeholders: {
      school: '请选择学校',
      approvalStatus: '审批状态',
      section: '请选择学期',
      line: '请选择路线',
      station: '请选择站点',
      keyword: '输入学号姓名',
      car: '请选择车辆'
    },
    actions: { batchApprove: '批量同意', batchReject: '批量拒绝', batchPayment: '批量缴费' },
    messages: {
      onlyPending: '只有全部为待审批数据可以修改，请重新选择',
      paymentRule: '只有审核通过的未缴费订单才能修改，请重新选择',
      confirmApprove: '确定要同意吗？',
      confirmPayment: '确定要缴费吗？',
      confirmDelete: '确定要删除吗？',
      success: '成功',
      addFormTodo: '新增/编辑表单将按旧版 apply/modal/form.vue 在后续迭代完整接入'
    },
    reject: { reason: '拒绝原因', reasonRequired: '请输入拒绝原因' },
    detail: {
      title: '详情',
      loading: '加载中…',
      amountDue: '应缴金额',
      denyReason: '拒绝理由',
      payTitle: '缴费信息',
      paymentAmount: '实缴金额',
      paymentMethod: '支付方式',
      paymentDate: '缴费日期',
      paymentAccount: '付款账户',
      paymentOrderNo: '支付单号',
      receivingAccount: '收款账户',
      sign: '签名',
      routeTitle: '路线明细',
      routeLine: '路线',
      routeStation: '站点',
      lineType: '乘车类型',
      ridingWeekDay: '乘车星期',
      startDay: '开始时间',
      endDay: '结束时间',
      personTitle: '接送人',
      relation: '关系',
      phone: '联系方式',
      photo: '照片'
    }
  },
  studentOrder: {
    page: { title: '乘车学生管理', description: '维护正式乘车学生名单（对齐旧版）。' },
    columns: {
      id: 'ID',
      school: '校区',
      section: '学期',
      admissionNo: '学号',
      studentName: '姓名',
      grade: '年级',
      line: '路线',
      station: '站点',
      pickup: '接送方式',
      createTime: '创建时间',
      car: '车牌号'
    },
    placeholders: { school: '请选择学校', section: '请选择学期', line: '请选择路线', station: '请选择站点', keyword: '输入学号姓名', car: '请选择车辆' },
    messages: { exportSuccess: '导出成功', confirmDelete: '确定要删除吗？', addFormTodo: '新增/编辑表单对齐旧版，后续迭代接入' },
    enums: {
      approval: { pending: '待审批', agree: '同意', reject: '拒绝' },
      payment: { unpaid: '未缴费', paid: '缴费' },
      pickup: { self: '自行回家', guardian: '接送人接送' },
      lineType: { daily: '日校车(走读生)', weekly: '周校车(寄宿生)' },
      payMethod: { alipay: '支付宝', wechat: '微信', cash: '现金', union: '银联' }
    }
  },
  car: {
    page: { title: '车辆管理', description: '维护校车车辆档案（对齐旧版）。' },
    columns: {
      id: 'ID',
      school: '校区',
      carNumber: '车牌号',
      carTeacher: '跟车老师',
      driverName: '司机姓名',
      seatNumber: '座位数',
      status: '状态',
      createTime: '创建时间',
      updateTime: '更新时间'
    },
    fields: { school: '校区', carNumber: '车牌号', carTeacher: '跟车老师', seatNumber: '座位数', driver: '司机', status: '状态', carImage: '车辆照片' },
    placeholders: { school: '请选择学校', carNumber: '车牌号', driver: '司机姓名', carTeacher: '跟车老师', status: '状态', imageUrl: '上传后自动填入图片地址' },
    options: { free: '空闲', used: '使用', repair: '维修' },
    rules: {
      schoolIds: '请选择校区',
      carNumber: '请输入车牌号',
      carTeacherId: '请选择跟车老师',
      seatNumber: '请输入座位数',
      driverId: '请选择司机',
      status: '请选择状态'
    },
    actions: { pickImage: '上传图片' },
    messages: { confirmDelete: '确定删除所选车辆吗？', uploadFail: '图片上传失败' }
  },
  followTeacher: {
    page: { title: '跟车老师', description: '维护跟车老师账号（对齐旧版 user/teacher）。' },
    columns: { id: 'ID', nickname: '昵称', school: '校区', department: '部门', email: '邮箱', phone: '手机号', status: '状态', lastLogin: '最后登录时间' },
    fields: { school: '校区', nickname: '昵称', department: '部门', email: '邮箱', phone: '手机号', password: '密码', status: '状态' },
    placeholders: { keyword: '关键词', school: '请选择学校', status: '状态' },
    rules: {
      school: '请选择校区',
      nickname: '请输入昵称',
      department: '请输入部门',
      email: '请输入邮箱',
      emailFormat: '邮箱格式不正确',
      phone: '请输入手机号',
      password: '请输入密码',
      status: '请选择状态'
    },
    actions: { enable: '启用', disable: '禁用' },
    messages: { confirmEnable: '确定要启用吗？', confirmDisable: '确定要禁用吗？', confirmDelete: '确定要删除吗？' }
  }
}
