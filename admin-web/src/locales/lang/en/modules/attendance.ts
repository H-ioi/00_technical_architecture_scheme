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
  }
}
