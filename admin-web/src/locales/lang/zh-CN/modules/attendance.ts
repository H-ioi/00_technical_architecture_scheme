export default {
  student: {
    page: {
      title: '学生考勤',
      description: '按校区、学号、年级与日期区间查询学生入校离校记录；导出与旧系统权限一致。'
    },
    actions: {
      export: '导出',
      detail: '查看'
    },
    messages: {
      exportSuccess: '导出已开始'
    },
    placeholders: {
      school: '请选择学校',
      admissionNo: '学号',
      grade: '年级',
      boarding: '是否住宿',
      onBus: '是否坐校巴',
      schoolStatus: '状态',
      beginDate: '考勤开始时间',
      endDate: '考勤结束时间'
    },
    columns: {
      id: 'ID',
      schoolName: '校区',
      studentName: '姓名',
      admissionNo: '学号',
      grade: '年级',
      form: '班级',
      boarding: '是否住宿',
      schoolBus: '是否坐校巴',
      schoolStatus: '状态',
      attendanceDate: '考勤日期',
      entryTime: '入校时间',
      leavingTime: '离校时间',
      updatedAt: '更新时间',
      createdAt: '创建时间'
    },
    options: {
      ynYes: '是',
      ynNo: '否',
      statusNoRecord: '无记录',
      statusOnSite: '入校',
      statusOffSite: '离校',
      statusLeave: '请假',
      statusAbsent: '缺勤'
    }
  },
  daily: {
    page: {
      title: '学生每日考勤',
      description:
        '按校区、学号、校巴/住宿、日期区间、来源与状态查询每日考勤；接口与旧 `holiday.js` 一致（导出无单独权限码）。'
    },
    actions: {
      export: '导出'
    },
    messages: {
      exportSuccess: '导出已开始'
    },
    placeholders: {
      school: '请选择学校',
      admissionNo: '学号',
      busStatus: '是否坐校巴',
      dormitoryStatus: '是否住宿',
      beginTime: '开始日期',
      endTime: '结束日期',
      dataFrom: '来源',
      status: '状态'
    },
    columns: {
      schoolName: '学校',
      admissionNo: '学号',
      studentName: '姓名',
      grade: '年级',
      form: '班级',
      busStatus: '是否坐校巴',
      dormitoryStatus: '是否住宿',
      date: '出勤日期',
      attendanceTime: '考勤时间',
      status: '状态',
      dataFrom: '来源',
      comment: '备注',
      createdAt: '创建时间'
    },
    options: {
      ynYes: '是',
      ynNo: '否',
      dataFromGate: '闸机',
      dataFromSchoolBus: '校巴',
      dataFromCommunity: '爱莎圈',
      dataFromMb: 'MB',
      statusPresent: '出勤',
      statusLate: '迟到',
      statusLeave: '请假',
      statusAbsent: '缺勤',
      statusEnter: '入校',
      statusExit: '离校'
    },
    mbLesson: '第{period}节课'
  },
  school: {
    page: {
      title: '校园考勤',
      description: '按校区、部门、人员与通道筛选教职员工考勤记录；导出权限与旧系统一致。'
    },
    actions: {
      export: '导出',
      detail: '查看'
    },
    messages: {
      exportSuccess: '导出已开始'
    },
    placeholders: {
      school: '请选择学校',
      dept: '所属部门',
      personName: '姓名',
      personCode: '人员编号',
      schoolStatus: '状态',
      cardNumber: '卡号',
      entryChannel: '进入通道',
      leavingChannel: '离开通道',
      beginDate: '考勤开始时间',
      endDate: '考勤结束时间'
    },
    columns: {
      id: 'ID',
      schoolName: '校区',
      personCode: '人员编号',
      personName: '人员姓名',
      deptName: '所属部门',
      cardNumber: '卡号',
      schoolStatus: '状态',
      entryOpenType: '入校类型',
      entryTime: '入校时间',
      entryChannel: '入校通道',
      leavingOpenType: '离校类型',
      leavingTime: '离校时间',
      leavingChannel: '离校通道',
      attendanceDate: '考勤日期',
      createdAt: '创建时间'
    },
    options: {
      openCard: '刷卡开门',
      openIllegalCard: '非法刷卡开门',
      openFace: '人脸开门',
      openIllegalFace: '非法人脸开门'
    }
  },
  access: {
    page: {
      title: '门禁记录',
      description:
        '按校区、部门、人员与通道查询门禁刷卡记录；旧版列表未开放导出按钮，此处保持一致。'
    },
    actions: {
      detail: '查看'
    },
    placeholders: {
      school: '请选择学校',
      dept: '所属部门',
      personName: '人员姓名',
      personCode: '人员编号',
      cardNumber: '卡号',
      channel: '通道',
      beginDate: '考勤开始时间',
      endDate: '考勤结束时间'
    },
    columns: {
      id: 'ID',
      schoolName: '校区',
      deptName: '所属部门',
      personCode: '人员编号',
      personName: '人员姓名',
      acsChannelName: '通道',
      attendanceDate: '考勤日期',
      enterOrExit: '状态',
      openType: '开门类型',
      openResult: '开门结果',
      cardNumber: '卡号',
      deviceName: '设备名称',
      swingTime: '打卡时间',
      createTime: '创建时间'
    },
    options: {
      enter: '入校',
      exit: '离校',
      leave: '请假',
      absent: '缺勤',
      resultSuccess: '成功',
      resultFail: '失败'
    }
  },
  wechatOpenid: {
    page: {
      title: '微信 OpenID',
      description:
        '绑定账号与微信公众号身份的状态维护；批量归档/使用接口与旧系统一致（导出按钮旧版未开放）。'
    },
    actions: {
      detail: '查看',
      archive: '归档',
      activate: '使用'
    },
    messages: {
      needSelection: '请先勾选记录',
      batchSuccess: '操作成功'
    },
    placeholders: {
      school: '请选择学校',
      admissionNo: '学号',
      nickname: '人员姓名',
      openId: 'OpenID',
      status: '状态',
      beginDate: '开始时间',
      endDate: '结束时间'
    },
    columns: {
      id: 'ID',
      schoolName: '校区',
      admissionNo: '学号',
      nickname: '人员姓名',
      status: '状态',
      encryptedOpenId: 'OpenID',
      updateTime: '更新时间',
      createTime: '创建时间'
    },
    options: {
      /** 使用中 */
      active: '使用中',
      /** 归档 */
      archived: '归档'
    }
  },
  wechatNotice: {
    page: {
      title: '微信通知',
      description:
        '查看推送微信通知的记录；筛选「状态」与旧页一致（成功=0、失败=1）；列表未开放导出。'
    },
    actions: {
      detail: '查看'
    },
    placeholders: {
      school: '请选择学校',
      admissionNo: '学号',
      personName: '姓名',
      openId: 'OpenID',
      sendStatus: '状态',
      beginDate: '开始时间',
      endDate: '结束时间'
    },
    columns: {
      id: 'ID',
      schoolName: '校区',
      admissionNo: '学号',
      personName: '人员姓名',
      sendStatus: '状态',
      sendOpenId: 'OpenID',
      result: '通知结果',
      updateTime: '更新时间',
      createTime: '创建时间'
    },
    options: {
      /** 与旧页一致：value 0 成功，1 失败 */
      sendOk: '成功',
      sendFail: '失败'
    }
  },
  holiday: {
    page: {
      title: '请假管理',
      description:
        '分为「请假」「销假」两个 Tab：请假列表对齐 `GET /attendance/holiday/page`，销假列表对齐 `GET /attendance/holiday-return/return-page`（旧 `listHolidayEnd`）；页面结构参考校车「路线规划」聚合 Tab。'
    },
    tabs: {
      leave: '请假',
      return: '销假'
    },
    actions: {
      add: '新增',
      withdraw: '撤销',
      detail: '查看',
      delete: '删除'
    },
    messages: {
      withdrawPrompt: '提示',
      withdrawConfirm: '确定撤销该请假流程吗？（procId={procId}，id={id}）',
      withdrawSuccess: '撤销成功',
      withdrawMissingId: '无法撤销：缺少请假主键 id。',
      withdrawFail: '撤销失败，请稍后重试或查看网络请求返回。',
      deletePrompt: '提示',
      deleteConfirm: '确定删除该请假记录吗？（id={id}）',
      deleteSuccess: '删除成功'
    },
    form: {
      title: '请假申请',
      pickStudent: '选择学生',
      pickStudentPh: '输入学号或姓名检索',
      selectType: '请选择请假类型',
      reasonPh: '请详细描述请假原因',
      attachments: '附件',
      needPass: '是否需要放行条',
      parentAck: '请假期间，家长负责孩子的安全',
      submit: '确定申请',
      timeStart: '开始时间',
      timeEnd: '结束时间',
      ruleStudent: '请选择学生',
      ruleType: '请选择请假类型',
      ruleScope: '请选择请假范围',
      ruleReason: '请填写请假原因',
      ruleDate: '请选择请假时间',
      ruleSlot: '请选择时段',
      ruleWeek: '请选择星期',
      ruleSickAttach: '病假须上传附件',
      ruleParent: '请勾选家长安全确认',
      fileTooLarge: '附件须小于 20MB',
      uploadFail: '附件上传失败',
      saveOk: '申请已提交',
      saveFail: '提交失败，请稍后重试',
      weekMon: '周一',
      weekTue: '周二',
      weekWed: '周三',
      weekThu: '周四',
      weekFri: '周五'
    },
    placeholders: {
      leaveType: '请假类型',
      school: '学校',
      scope: '请假范围',
      beginTime: '开始日期',
      endTime: '结束日期',
      keyword: '学号/姓名'
    },
    columns: {
      id: 'ID',
      admissionNo: '学号',
      studentName: '姓名',
      school: '学校',
      grade: '年级',
      className: '班级',
      leaveType: '请假类型',
      scope: '请假范围',
      reason: '请假原因',
      dateRange: '请假时间',
      timeSlot: '时段',
      infectious: '传染病',
      fixed: '固定假',
      weekDays: '星期',
      status: '状态',
      createdAt: '创建时间'
    },
    return: {
      columns: {
        /** 旧「销假管理」表头：返校时间 */
        returnSchoolTime: '返校时间'
      }
    },
    detail: {
      beginTime: '开始时间',
      endTime: '结束时间',
      procId: '流程实例',
      parentResponsible: '家长确认安全'
    },
    options: {
      leavePersonal: '事假',
      leaveSick: '病假',
      scopeCourse: '课程',
      scopeDorm: '宿舍',
      scopeBus: '校巴',
      yes: '是',
      no: '否',
      statusPending: '待审批',
      statusRejected: '已拒绝',
      statusWithdrawn: '已撤回',
      statusOnLeave: '休假中',
      statusFinished: '已结束',
      statusLeaveSoon: '待休假'
    }
  },
  holidayConfig: {
    page: {
      title: '请假模块配置',
      description: '维护学校、部门、年级与通知邮箱；接口对齐 `GET/POST /attendance/sys/config/*`（旧 `config.vue`）。'
    },
    placeholders: {
      school: '请选择学校'
    },
    columns: {
      school: '学校',
      grades: '年级',
      department: '部门',
      email: '邮箱'
    },
    form: {
      school: '学校',
      department: '部门',
      grades: '年级',
      email: '邮箱',
      emailInvalid: '邮箱格式不正确'
    },
    department: {
      all: '所有',
      course: '学部',
      dorm: '宿舍',
      bus: '校巴',
      doctor: '校医'
    },
    rules: {
      school: '请选择学校',
      department: '请选择部门',
      email: '请输入邮箱'
    },
    actions: {
      add: '新增配置',
      edit: '编辑',
      delete: '删除'
    },
    messages: {
      deleteConfirm: '确定删除该配置吗？',
      deleteTitle: '提示',
      addOk: '已新增',
      saveOk: '已保存'
    }
  },
  holidayPass: {
    page: {
      title: '放行条管理',
      description: '对齐旧 `pass.vue`：`GET /attendance/leave/pass/page`，权限码 `pass-add` 等。'
    },
    placeholders: {
      school: '学校',
      dorm: '是否住宿',
      keyword: '学号/姓名'
    },
    columns: {
      studentNo: '学号',
      studentName: '姓名',
      school: '学校',
      grade: '年级',
      className: '班级',
      dorm: '是否住宿',
      releasedBy: '放行人',
      way: '放行方式',
      leaveRange: '作息时间',
      passTime: '放行日期',
      isLeave: '是否离校',
      slot: '时段'
    },
    options: {
      wayParents: '父母接送',
      waySelf: '自行离开'
    },
    status: {
      active: '已生效',
      voided: '作废',
      pendingGenerate: '待生成',
      expired: '已过期'
    },
    actions: {
      add: '新增',
      batchGenerate: '批量生成',
      void: '作废',
      generate: '生成'
    },
    form: {
      way: '放行方式'
    },
    rules: {
      way: '请选择放行方式',
      passTime: '请选择放行日期',
      slot: '请选择时段'
    },
    dialog: {
      addTitle: '放行条',
      editTitle: '放行条',
      batchTitle: '批量生成放行条'
    },
    messages: {
      needSelection: '请先勾选记录',
      batchOnlyPending: '只能选择待生成状态的记录',
      cannotDeleteActive: '已生效的数据不能删除',
      batchDeleteConfirm: '确定删除选中记录？',
      actionConfirm: '确定执行此操作？'
    }
  },
  holidayFlow: {
    page: {
      title: '流程设计',
      description: '流程定义建模与已部署流程；对齐旧 `flow.vue` / `flowdef.vue` / `procdef.vue`。'
    },
    tabs: {
      model: '流程定义',
      deployed: '流程部署'
    },
    flowDef: {
      add: '新增',
      searchKey: '关键字',
      colId: 'ID',
      colName: '流程名称',
      colKey: '流程KEY',
      colLeaveType: '请假类型',
      needApproval: '需要审批',
      creator: '创建人',
      deploy: '部署',
      deployHint: '部署成功后尽量不要修改请假类型；若需修改请重新部署流程定义。',
      deployConfirm: '确定部署 id={id} 的流程定义吗？',
      deployOk: '部署成功',
      deleteConfirm: '确定删除 id={id} 的流程定义吗？'
    },
    procDef: {
      colDefId: '定义编号',
      colType: '类型',
      colLeaveLabel: '请假类型',
      colDeploymentId: '部署 ID',
      colDeployedAt: '部署时间',
      colVersion: '版本',
      viewImg: '查看流程图',
      setAssignee: '设置审批人',
      deleteConfirm: '确定删除该部署吗？',
      assignOk: '已保存'
    },
    design: {
      tabForm: '流程配置',
      tabBpmn: '流程设计',
      pageTitleCreate: '新增流程',
      pageTitleEdit: '编辑流程（ID：{id}）',
      pageDescription: '配置流程基本信息与 BPMN 图；保存后返回「流程设计」列表。',
      flowType: '流程类型',
      typeLeave: '请假流程',
      typeReturn: '销假流程',
      save: '保存配置',
      back: '返回',
      viewXml: '查看 XML',
      importXml: '导入 XML',
      copyXml: '复制',
      copyOk: '已复制',
      importPh: '粘贴 BPMN XML',
      importEmpty: '请输入 XML',
      saveOk: '保存成功',
      ruleType: '请选择流程类型',
      ruleName: '请输入流程名称',
      ruleSchool: '请选择学校',
      ruleLeaveType: '请选择请假类型',
      ruleScope: '请选择请假范围'
    }
  },
  holidayTask: {
    page: {
      title: '任务处理',
      description: '待办 / 已办 / 我的发起；对齐旧 `task.vue` 与 `flow/instance/*`。'
    },
    tabs: {
      todo: '我的待办',
      done: '我的已办',
      instance: '我的发起'
    },
    colTaskId: '任务编号',
    colTaskName: '任务名称',
    colProcName: '流程名称',
    colStarter: '发起人',
    colStartTime: '发起时间',
    colEndTime: '结束时间',
    colAssignee: '审批人',
    colFlowDefId: '流程定义ID',
    colInstanceId: '实例ID',
    approve: '审批',
    trace: '查看流程进度',
    approveTitle: '流程审批',
    reject: '审批拒绝',
    approveOk: '已通过',
    rejectOk: '已拒绝',
    to: '至',
    extendTime: '延期时间',
    flowChart: '流程图',
    defaultApproveRemark: '审批通过',
    remarkPh: '审批备注'
  }
}
