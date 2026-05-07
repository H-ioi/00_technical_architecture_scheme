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
      grade: 'Grade',
      className: 'Class',
      parentName: 'Parent'
    },
    placeholders: {
      keyword: 'Student, grade, class, parent, or phone',
      name: 'Student name',
      grade: 'Grade',
      className: 'Class',
      parentName: 'Parent name'
    }
  },
  teacher: {
    page: {
      title: 'Teachers',
      description: 'Maintain teacher profiles, module roles, and account status.'
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
    uploadRequired: 'Please select an import file first'
  }
}
