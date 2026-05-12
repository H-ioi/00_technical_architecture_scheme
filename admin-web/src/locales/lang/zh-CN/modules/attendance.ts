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
  }
}
