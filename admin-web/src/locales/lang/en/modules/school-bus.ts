export default {
  driver: {
    page: {
      title: 'Drivers',
      description: 'Manage school bus drivers: filter by campus or keyword, import and batch delete.'
    },
    fields: {
      school: 'Campus',
      name: 'Name',
      employeeNo: 'Employee No.',
      contact: 'Contact',
      age: 'Age',
      licenseType: 'License class',
      status: 'Status'
    },
    placeholders: {
      school: 'Campus',
      keyword: 'Name / employee no.',
      status: 'Status',
      name: 'Name',
      employeeNo: 'Employee no.',
      contact: 'Contact',
      licenseType: 'e.g. C1, A1'
    },
    actions: {
      search: 'Search',
      reset: 'Reset',
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      import: 'Import',
      downloadTemplate: 'Template',
      cancel: 'Cancel',
      submit: 'OK'
    },
    messages: {
      saveSuccess: 'Saved',
      deleteSuccess: 'Deleted',
      importSuccess: 'Imported',
      confirmDelete: 'Delete selected drivers?'
    },
    options: {
      enabled: 'Enabled',
      disabled: 'Disabled'
    },
    rules: {
      schoolIds: 'Select campus',
      name: 'Enter name',
      employeeNo: 'Enter employee no.',
      status: 'Select status'
    }
  }
}
