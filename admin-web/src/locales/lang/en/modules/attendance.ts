export default {
  student: {
    page: {
      title: 'Student attendance',
      description:
        'Filter by campus, admission number, grade and date range; export aligns with legacy permission.'
    },
    actions: {
      export: 'Export',
      detail: 'View'
    },
    messages: {
      exportSuccess: 'Export started'
    },
    placeholders: {
      school: 'Campus',
      admissionNo: 'Admission No.',
      grade: 'Grade',
      boarding: 'Boarding',
      onBus: 'School bus',
      schoolStatus: 'Status',
      beginDate: 'Attendance start',
      endDate: 'Attendance end'
    },
    columns: {
      id: 'ID',
      schoolName: 'Campus',
      studentName: 'Name',
      admissionNo: 'Admission No.',
      grade: 'Grade',
      form: 'Class',
      boarding: 'Boarding',
      schoolBus: 'School bus',
      schoolStatus: 'Status',
      attendanceDate: 'Date',
      entryTime: 'Entry',
      leavingTime: 'Leaving',
      updatedAt: 'Updated',
      createdAt: 'Created'
    },
    options: {
      ynYes: 'Yes',
      ynNo: 'No',
      statusNoRecord: 'No record',
      statusOnSite: 'On site',
      statusOffSite: 'Off site',
      statusLeave: 'Leave',
      statusAbsent: 'Absent'
    }
  },
  school: {
    page: {
      title: 'Campus attendance',
      description:
        'Filter staff attendance by campus, department, person and channels; export matches legacy permission.'
    },
    actions: {
      export: 'Export',
      detail: 'View'
    },
    messages: {
      exportSuccess: 'Export started'
    },
    placeholders: {
      school: 'Campus',
      dept: 'Department',
      personName: 'Name',
      personCode: 'Staff ID',
      schoolStatus: 'Status',
      cardNumber: 'Card No.',
      entryChannel: 'Entry channel',
      leavingChannel: 'Exit channel',
      beginDate: 'Attendance start',
      endDate: 'Attendance end'
    },
    columns: {
      id: 'ID',
      schoolName: 'Campus',
      personCode: 'Staff ID',
      personName: 'Name',
      deptName: 'Department',
      cardNumber: 'Card No.',
      schoolStatus: 'Status',
      entryOpenType: 'Entry type',
      entryTime: 'Entry time',
      entryChannel: 'Entry channel',
      leavingOpenType: 'Exit type',
      leavingTime: 'Exit time',
      leavingChannel: 'Exit channel',
      attendanceDate: 'Date',
      createdAt: 'Created'
    },
    options: {
      openCard: 'Card open',
      openIllegalCard: 'Illegal card open',
      openFace: 'Face open',
      openIllegalFace: 'Illegal face open'
    }
  },
  access: {
    page: {
      title: 'Access records',
      description:
        'Filter door access by campus, department, person and channel; legacy UI had export commented out — same here.'
    },
    actions: {
      detail: 'View'
    },
    placeholders: {
      school: 'Campus',
      dept: 'Department',
      personName: 'Name',
      personCode: 'Staff ID',
      cardNumber: 'Card No.',
      channel: 'Channel',
      beginDate: 'Start date',
      endDate: 'End date'
    },
    columns: {
      id: 'ID',
      schoolName: 'Campus',
      deptName: 'Department',
      personCode: 'Staff ID',
      personName: 'Name',
      acsChannelName: 'Channel',
      attendanceDate: 'Date',
      enterOrExit: 'Direction',
      openType: 'Open type',
      openResult: 'Result',
      cardNumber: 'Card No.',
      deviceName: 'Device',
      swingTime: 'Swipe time',
      createTime: 'Created'
    },
    options: {
      enter: 'Enter',
      exit: 'Exit',
      leave: 'Leave',
      absent: 'Absent',
      resultSuccess: 'Success',
      resultFail: 'Fail'
    }
  },
  wechatOpenid: {
    page: {
      title: 'WeChat OpenID',
      description:
        'Campus member binding state for WeChat OpenID; batch archive/activate matches legacy (export was disabled in legacy UI).'
    },
    actions: {
      detail: 'View',
      archive: 'Archive',
      activate: 'Activate'
    },
    messages: {
      needSelection: 'Select at least one row',
      batchSuccess: 'Done'
    },
    placeholders: {
      school: 'Campus',
      admissionNo: 'Admission No.',
      nickname: 'Name',
      openId: 'OpenID',
      status: 'Status',
      beginDate: 'Start date',
      endDate: 'End date'
    },
    columns: {
      id: 'ID',
      schoolName: 'Campus',
      admissionNo: 'Admission No.',
      nickname: 'Name',
      status: 'Status',
      encryptedOpenId: 'OpenID',
      updateTime: 'Updated',
      createTime: 'Created'
    },
    options: {
      active: 'Active',
      archived: 'Archived'
    }
  },
  wechatNotice: {
    page: {
      title: 'WeChat notifications',
      description:
        'Notification delivery log; send status filter matches legacy (success=0, fail=1); export disabled like legacy UI.'
    },
    actions: {
      detail: 'View'
    },
    placeholders: {
      school: 'Campus',
      admissionNo: 'Admission No.',
      personName: 'Name',
      openId: 'OpenID',
      sendStatus: 'Status',
      beginDate: 'Start date',
      endDate: 'End date'
    },
    columns: {
      id: 'ID',
      schoolName: 'Campus',
      admissionNo: 'Admission No.',
      personName: 'Name',
      sendStatus: 'Status',
      sendOpenId: 'OpenID',
      result: 'Result',
      updateTime: 'Updated',
      createTime: 'Created'
    },
    options: {
      sendOk: 'Success',
      sendFail: 'Fail'
    }
  }
}
