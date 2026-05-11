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
  }
}
