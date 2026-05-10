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
      look: 'View',
      delete: 'Delete',
      import: 'Import',
      downloadTemplate: 'Download template',
      export: 'Export',
      cancel: 'Cancel',
      submit: 'OK'
    },
    messages: {
      saveSuccess: 'Saved',
      deleteSuccess: 'Deleted',
      importSuccess: 'Imported',
      importInvalidType: 'Only .xls and .xlsx files are allowed',
      importTooLarge: 'File size must be under 10MB',
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
      contact: 'Enter contact',
      age: 'Enter age',
      ageRange: 'Age must be between 18 and 80',
      licenseType: 'Enter license class',
      status: 'Select status'
    }
  },
  routePlan: {
    page: {
      title: 'Route planning',
      description: 'Manage routes, terms and stops (same tabs as legacy).'
    },
    tabs: {
      routes: 'All routes',
      term: 'Terms',
      station: 'Stations'
    },
    placeholders: {
      section: 'Select term',
      station: 'Select stop',
      lineName: 'Route name',
      carNumber: 'Plate number',
      termKeyword: 'Term name',
      stationNameKeyword: 'Stop name'
    },
    messages: {
      needWeekdaysAndStops:
        'Pick at least one weekday row and add stops before saving.',
      selectRowsFirst: 'Select at least one route first',
      copySuccess: 'Routes copied',
      confirmDeleteLines: 'Delete selected routes? This cannot be undone.',
      selectTermsFirst: 'Select at least one term first',
      confirmDeleteTerms: 'Delete selected terms? This cannot be undone.',
      selectStationsFirst: 'Select at least one stop first',
      confirmDeleteStations: 'Delete selected stops? This cannot be undone.'
    },
    routeType: {
      daily: 'Daily',
      weekly: 'Weekly'
    },
    visible: {
      yes: 'Visible',
      no: 'Hidden'
    },
    term: {
      intentStart: 'Intent start',
      intentEnd: 'Intent end',
      serviceStart: 'Service start',
      serviceEnd: 'Service end'
    },
    fields: {
      stationName: 'Stop'
    },
    actions: {
      addRoute: 'Add route',
      importRoute: 'Import',
      downloadRouteTemplate: 'Download template',
      copyRoute: 'Copy routes',
      addTerm: 'Add term',
      editTerm: 'Edit term',
      addStation: 'Add stop',
      editStation: 'Edit stop',
      importStation: 'Import',
      downloadStationTemplate: 'Download template',
      editRoute: 'Edit route'
    },
    form: {
      cnName: 'Chinese name',
      enName: 'English name',
      intentRange: 'Application period',
      serviceRange: 'Service period',
      lineType: 'Route type',
      plateList: 'License plates',
      status: 'Status',
      routeWeekdays: 'Weekdays',
      addWeekRow: 'Add',
      removeWeekRow: 'Remove',
      bindAddStop: 'Add stop',
      stop: 'Stop',
      afternoonLeave: 'Afternoon pickup',
      dayPrice: 'Daily price',
      weekPriceLabel: 'Weekly price',
      pickGoOrBackTime: 'Please select morning or afternoon time',
      confirmDeleteStop: 'Remove this stop from this weekday row?',
      modalAdd: 'Add',
      modalEdit: 'Edit',
      actionsColumn: 'Actions',
      routeScheduleSection: 'Weekdays & stops',
      scheduleBlockTitle: 'Group {n}',
      stationTableEmpty: 'No stops for this weekday group yet',
      addScheduleGroup: '+ Add weekday group',
      stationCol: {
        name: 'Stop',
        goTime: 'Morning pickup',
        backTime: 'Afternoon pickup',
        price: 'Single fare',
        weekPrice: 'Weekly fare'
      }
    }
  },
  routeOperation: {
    pleaseSelect: 'Please select',
    page: {
      title: 'Route operations',
      description: 'Search and manage school bus operation records.'
    },
    columns: {
      id: 'ID',
      status: 'Status',
      statusLabel: 'Status',
      arrivalStatusLabel: 'Arrival status',
      schoolEnNames: 'Campus',
      sectionName: 'Term',
      carNumber: 'Plate No.',
      carTeacher: 'Bus teacher',
      lineName: 'Route',
      stationName: 'Stop',
      rideDate: 'Ride date',
      arrivalTime: 'Arrival time',
      createTime: 'Created',
      updateTime: 'Updated',
      remark: 'Remark'
    },
    placeholders: {
      school: 'School',
      line: 'Route',
      station: 'Stop',
      status: 'Status',
      rideDateStart: 'From date',
      rideDateEnd: 'To date'
    },
    form: {
      school: 'Campus',
      section: 'Term',
      line: 'Route',
      station: 'Stop',
      timeType: 'Time type',
      car: 'Vehicle plate',
      driver: 'Driver',
      teacher: 'Bus teacher',
      seats: 'Seats',
      rideDate: 'Ride date',
      arrivalTime: 'Arrival time',
      remark: 'Remark',
      schoolTrip: 'To school',
      homeTrip: 'Home time'
    },
    status: {
      early: 'Early',
      onTime: 'On time',
      late: 'Late',
      arrive: 'Arrived'
    },
    messages: {
      confirmDelete: 'Delete selected operation records?',
      exportSuccess: 'Exported successfully'
    }
  },
  routeException: {
    pleaseSelect: 'Please select',
    page: {
      title: 'Exceptions',
      description: 'Search and manage school bus exception reports.'
    },
    columns: {
      id: 'ID',
      schoolEnNames: 'Campus',
      sectionName: 'Term',
      lineName: 'Route',
      carNumber: 'Plate No.',
      driver: 'Driver',
      teacher: 'Bus teacher',
      exceptionTypeLabel: 'Exception type',
      exceptionDate: 'Exception date',
      needDispatchLabel: 'Dispatch',
      dispatchCarNumber: 'Dispatch plate',
      dispatchDriver: 'Dispatch driver',
      createTime: 'Created',
      details: 'Details'
    },
    placeholders: {
      school: 'School',
      section: 'Term',
      line: 'Route',
      car: 'Vehicle',
      exceptionType: 'Exception type',
      needDispatch: 'Dispatch?',
      exceptionDateStart: 'From date',
      exceptionDateEnd: 'To date'
    },
    form: {
      school: 'Campus',
      section: 'Term',
      line: 'Route',
      car: 'Vehicle',
      driver: 'Driver',
      teacher: 'Bus teacher',
      exceptionDate: 'Exception date',
      exceptionType: 'Exception type',
      needDispatch: 'Dispatch',
      dispatchCar: 'Dispatch plate',
      dispatchDriver: 'Dispatch driver',
      details: 'Details'
    },
    exceptionType: {
      behavior: 'Behavior',
      vehicle: 'Vehicle'
    },
    options: {
      yes: 'Yes',
      no: 'No'
    },
    messages: {
      confirmDelete: 'Delete selected exception records?',
      exportSuccess: 'Exported successfully'
    }
  }
}
