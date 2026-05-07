export default {
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
    school: 'Campus',
    email: 'Email',
    phone: 'Phone',
    status: 'Status',
    createTime: 'Created At'
  },
  placeholders: {
    keywordInput: 'Keyword',
    school: 'Select campus',
    status: 'Select status'
  },
  actions: {
    detail: 'View',
    search: 'Search',
    reset: 'Reset',
    close: 'Close'
  }
}
