export default {
  page: {
    title: 'Member Management',
    description: 'Maintain member profiles, module roles, and account status.',
    selectedSummary: '{selected} selected, {total} total'
  },
  student: {
    page: {
      title: 'Students',
      description: 'Maintain student profiles, parent contacts, and account status.'
    },
    fields: {
      name: 'Student Name',
      admissionNo: 'Admission No.',
      cnFullName: 'Chinese Name',
      fullName: 'English Name',
      grade: 'Grade',
      className: 'Class',
      form: 'Class',
      bus: 'Bus',
      dormitory: 'Dormitory',
      parentName: 'Parent'
    },
    placeholders: {
      keyword: 'Student, grade, class, parent, or phone',
      name: 'Student name',
      grade: 'Grade',
      className: 'Class',
      form: 'Select class',
      yearGroup: 'Select grade',
      bus: 'Select bus',
      dormitory: 'Select dormitory',
      parentName: 'Parent name'
    },
    options: {
      enrolled: 'Enrolled',
      leaving: 'Leaving'
    }
  },
  teacher: {
    page: {
      title: 'Teachers',
      description: 'Maintain teacher profiles, module roles, and account status.'
    },
    fields: {
      teacherCode: 'Teacher Code',
      fullName: 'Name',
      gender: 'Gender',
      nationalities: 'Nationality',
      role: 'Role'
    },
    placeholders: {
      role: 'Select role'
    },
    options: {
      unarchived: 'Unarchived',
      archived: 'Archived'
    }
  },
  fields: {
    keyword: 'Keyword',
    school: 'Campus',
    nickname: 'Nickname',
    department: 'Department',
    email: 'Email',
    phone: 'Phone',
    modules: 'Modules',
    roles: 'Roles',
    password: 'Password',
    status: 'Status',
    lastLoginTime: 'Last Login',
    createTime: 'Created At'
  },
  placeholders: {
    keyword: 'Nickname, department, email, or phone',
    keywordInput: 'Keyword',
    school: 'Select campus',
    nickname: 'Nickname',
    department: 'Department',
    email: 'Email',
    phone: 'Phone',
    modules: 'Select modules',
    roles: 'Select roles',
    status: 'Select status',
    input: 'Please input',
    select: 'Please select'
  },
  actions: {
    add: 'Add',
    import: 'Import',
    export: 'Export',
    detail: 'View',
    edit: 'Edit',
    enable: 'Enable',
    disable: 'Disable',
    delete: 'Delete',
    search: 'Search',
    reset: 'Reset',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    submit: 'Submit',
    downloadTemplate: 'Download Template',
    selectFile: 'Select File'
  },
  options: {
    enabled: 'Enabled',
    disabled: 'Disabled',
    schoolBus: 'School Bus',
    activity: 'Activity',
    schoolBusOperation: 'School Bus Operation',
    carTeacher: 'Car Teacher',
    activityCheckIn: 'Activity Check-in'
  },
  sections: {
    baseInfo: 'Base Info',
    accountInfo: 'Account Info',
    importInfo: 'Import Members'
  },
  validation: {
    nicknameRequired: 'Please input nickname',
    departmentRequired: 'Please input department',
    emailRequired: 'Please input email',
    phoneRequired: 'Please input phone',
    modulesRequired: 'Please select modules',
    rolesRequired: 'Please select roles',
    passwordRequired: 'Please input password',
    statusRequired: 'Please select status'
  },
  messages: {
    saved: 'Saved',
    deleted: 'Deleted',
    enabled: 'Enabled',
    disabled: 'Disabled',
    imported: 'Imported',
    exported: 'Exported',
    templateDownloaded: 'Template downloaded',
    selectRows: 'Please select members',
    deleteConfirm: 'Delete selected members?',
    enableConfirm: 'Enable selected members?',
    disableConfirm: 'Disable selected members?',
    uploadTip: 'Only xls and xlsx files under 10M are supported.',
    uploadRequired: 'Please select an import file first',
    noPermission: 'No permission'
  }
}
