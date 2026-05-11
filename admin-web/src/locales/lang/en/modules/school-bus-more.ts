export default {
  studentApply: {
    page: { title: 'Applications', description: 'Manage school bus ride applications (legacy parity).' },
    columns: {
      id: 'ID',
      applyTime: 'Applied at',
      approvalStatus: 'Approval',
      paymentStatus: 'Payment',
      school: 'Campus',
      section: 'Term',
      admissionNo: 'Student No.',
      studentName: 'Name',
      grade: 'Grade',
      line: 'Route',
      station: 'Stop',
      pickup: 'Pickup'
    },
    placeholders: {
      school: 'School',
      approvalStatus: 'Approval status',
      section: 'Term',
      line: 'Route',
      station: 'Stop',
      keyword: 'Student no. / name',
      car: 'Vehicle'
    },
    actions: { batchApprove: 'Approve', batchReject: 'Reject', batchPayment: 'Mark paid' },
    messages: {
      onlyPending: 'Only pending rows can be changed. Please reselect.',
      paymentRule: 'Only approved and unpaid rows can be changed. Please reselect.',
      confirmApprove: 'Approve selected?',
      confirmPayment: 'Mark as paid?',
      confirmDelete: 'Delete selected?',
      success: 'Done',
      addFormTodo: 'Full add/edit form will mirror legacy apply/modal/form.vue in a follow-up.'
    },
    reject: { reason: 'Reason', reasonRequired: 'Please enter a reason' },
    detail: {
      title: 'Detail',
      loading: 'Loading…',
      amountDue: 'Amount due',
      denyReason: 'Reject reason',
      payTitle: 'Payment',
      paymentAmount: 'Paid amount',
      paymentMethod: 'Method',
      paymentDate: 'Paid at',
      paymentAccount: 'Payer account',
      paymentOrderNo: 'Order no.',
      receivingAccount: 'Payee account',
      sign: 'Signature',
      routeTitle: 'Lines',
      routeLine: 'Route',
      routeStation: 'Stop',
      lineType: 'Ride type',
      ridingWeekDay: 'Weekdays',
      startDay: 'Start',
      endDay: 'End',
      personTitle: 'Pickup contacts',
      relation: 'Relation',
      phone: 'Phone',
      photo: 'Photo'
    }
  },
  studentOrder: {
    page: { title: 'Riders', description: 'Official rider list (legacy parity).' },
    columns: {
      id: 'ID',
      school: 'Campus',
      section: 'Term',
      admissionNo: 'Student No.',
      studentName: 'Name',
      grade: 'Grade',
      line: 'Route',
      station: 'Stop',
      pickup: 'Pickup',
      createTime: 'Created',
      car: 'Plate'
    },
    placeholders: { school: 'School', section: 'Term', line: 'Route', station: 'Stop', keyword: 'Student no. / name', car: 'Vehicle' },
    messages: { exportSuccess: 'Exported', confirmDelete: 'Delete selected?', addFormTodo: 'Add/edit form comes in a follow-up.' },
    form: {
      school: 'Campus',
      section: 'Term',
      admissionNo: 'Student No.',
      studentName: 'Name',
      grade: 'Grade',
      amountDue: 'Amount due',
      pickupMethod: 'Pickup',
      routes: 'Routes',
      addRoute: 'Add route',
      addPerson: 'Add pickup contact',
      dateOption: 'Schedule',
      rideRange: 'Date range',
      plate: 'Plate',
      approvalStatus: 'Approval',
      paymentStatus: 'Payment',
      signImage: 'Signature',
      ops: 'Actions',
      routeRequired: 'Add at least one route.',
      personRequired: 'Add pickup contacts when pickup mode is guardian.',
      selectPlaceholder: 'Select',
      ruleSelect: 'Please select',
      ruleInput: 'Please enter',
      ruleUpload: 'Please upload'
    },
    enums: {
      approval: { pending: 'Pending', agree: 'Approved', reject: 'Rejected' },
      payment: { unpaid: 'Unpaid', paid: 'Paid' },
      pickup: { self: 'Self pickup', guardian: 'Guardian pickup' },
      lineType: { daily: 'Daily bus (day student)', weekly: 'Weekly (boarding)' },
      payMethod: { alipay: 'Alipay', wechat: 'WeChat', cash: 'Cash', union: 'UnionPay' }
    }
  },
  car: {
    page: { title: 'Vehicles', description: 'Manage school buses (legacy parity).' },
    columns: {
      id: 'ID',
      school: 'Campus',
      carNumber: 'Plate',
      carTeacher: 'Bus teacher',
      driverName: 'Driver',
      seatNumber: 'Seats',
      status: 'Status',
      createTime: 'Created',
      updateTime: 'Updated'
    },
    fields: { school: 'Campus', carNumber: 'Plate', carTeacher: 'Bus teacher', seatNumber: 'Seats', driver: 'Driver', status: 'Status', carImage: 'Photo' },
    placeholders: { school: 'School', carNumber: 'Plate', driver: 'Driver', carTeacher: 'Bus teacher', status: 'Status', imageUrl: 'URL after upload' },
    options: { free: 'Free', used: 'In use', repair: 'Repair' },
    rules: {
      schoolIds: 'Select campus',
      carNumber: 'Enter plate',
      carTeacherId: 'Select bus teacher',
      seatNumber: 'Enter seats',
      driverId: 'Select driver',
      status: 'Select status'
    },
    actions: { pickImage: 'Upload image' },
    messages: { confirmDelete: 'Delete selected vehicles?', uploadFail: 'Upload failed' }
  },
  followTeacher: {
    page: { title: 'Bus teachers', description: 'Bus teacher accounts (legacy user/teacher).' },
    columns: { id: 'ID', nickname: 'Nickname', school: 'Campus', department: 'Dept', email: 'Email', phone: 'Phone', status: 'Status', lastLogin: 'Last login' },
    fields: {
      school: 'Campus',
      nickname: 'Nickname',
      department: 'Department',
      email: 'Email',
      phone: 'Phone',
      modules: 'Module',
      roles: 'Role',
      password: 'Password',
      status: 'Status'
    },
    moduleOptions: { schoolBus: 'School Bus', activity: 'Activity' },
    roleOptions: {
      busOperation: 'School Bus Operation',
      carTeacher: 'Car Teacher',
      activityCheckIn: 'Activity Check-in'
    },
    placeholders: { keyword: 'Keyword', school: 'School', status: 'Status', select: 'Select' },
    rules: {
      school: 'Select campus',
      nickname: 'Enter nickname',
      department: 'Enter department',
      email: 'Enter email',
      emailFormat: 'Invalid email',
      phone: 'Enter phone',
      modules: 'Select module(s)',
      roles: 'Select role(s)',
      password: 'Enter password',
      status: 'Select status'
    },
    actions: { enable: 'Enable', disable: 'Disable' },
    messages: { confirmEnable: 'Enable selected?', confirmDisable: 'Disable selected?', confirmDelete: 'Delete selected?' }
  }
}
