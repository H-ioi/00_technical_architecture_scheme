export default {
  page: {
    title: 'Protocol Management',
    description: 'Maintain protocol documents, signing requirements, and status.'
  },
  fields: {
    school: 'Campus',
    cnName: 'Chinese Name',
    enName: 'English Name',
    protocolType: 'Protocol Type',
    module: 'Module',
    needSign: 'Requires Signature',
    status: 'Status',
    documentUrl: 'Document',
    createTime: 'Created At',
    updateTime: 'Updated At',
    studentName: 'Name',
    admissionNo: 'Admission No.',
    grade: 'Grade',
    signImageUrl: 'Signature'
  },
  placeholders: {
    school: 'Select campus',
    cnName: 'Chinese name',
    enName: 'English name',
    protocolType: 'Select protocol type',
    module: 'Select module',
    needSign: 'Select signing requirement',
    status: 'Select status'
  },
  actions: {
    add: 'Add',
    edit: 'Edit',
    detail: 'View',
    delete: 'Delete',
    search: 'Search',
    reset: 'Reset',
    submit: 'Confirm',
    cancel: 'Cancel',
    close: 'Close',
    back: 'Back'
  },
  options: {
    yes: 'Yes',
    no: 'No',
    enabled: 'Enabled',
    disabled: 'Disabled'
  },
  messages: {
    saveSuccess: 'Saved successfully',
    deleteSuccess: 'Deleted successfully',
    confirmDelete: 'Delete selected protocols?',
    uploadPdfOnly: 'Only PDF files are allowed',
    uploadPdfSize: 'PDF files cannot exceed 10 MB',
    uploadRequired: 'Please upload the protocol document'
  },
  detail: {
    title: 'Protocol Detail',
    signRecords: 'Signature Records'
  }
}
