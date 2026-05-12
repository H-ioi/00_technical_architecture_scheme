export default {
  driver: {
    page: {
      title: '司机管理',

      description: '维护校车司机档案，支持按校区与关键字筛选、批量导入与删除。'
    },

    fields: {
      school: '所属校区',

      name: '姓名',

      employeeNo: '工号',

      contact: '联系方式',

      age: '年龄',

      licenseType: '准驾车型',

      status: '状态'
    },

    placeholders: {
      school: '请选择校区',

      keyword: '姓名 / 工号',

      status: '状态',

      name: '请输入姓名',

      employeeNo: '请输入工号',

      contact: '请输入联系方式',

      licenseType: '如 C1、A1'
    },

    actions: {
      search: '查询',

      reset: '重置',

      add: '新增',

      edit: '编辑',

      look: '查看',

      delete: '删除',

      import: '导入',

      downloadTemplate: '下载模板',

      export: '导出',

      cancel: '取消',

      submit: '确定'
    },

    messages: {
      saveSuccess: '保存成功',

      deleteSuccess: '删除成功',

      importSuccess: '导入成功',

      importInvalidType: '仅支持上传 xls、xlsx 文件',

      importTooLarge: '文件大小不能超过 10MB',

      confirmDelete: '确定删除所选司机吗？'
    },

    options: {
      enabled: '启用',

      disabled: '停用'
    },

    rules: {
      schoolIds: '请选择所属校区',

      name: '请输入姓名',

      employeeNo: '请输入工号',

      contact: '请输入联系方式',

      age: '请输入年龄',

      ageRange: '年龄需在 18～80',

      licenseType: '请输入准驾车型',

      status: '请选择状态'
    }
  },

  routePlan: {
    page: {
      title: '路线规划',

      description: '维护路线、学期与站点基础数据（与旧版三 Tab 一致）。'
    },

    tabs: {
      routes: '全部路线',

      term: '学期配置',

      station: '站点配置'
    },

    placeholders: {
      section: '请选择学期',

      station: '请选择站点',

      lineName: '输入路线名称',

      carNumber: '输入车牌号',

      termKeyword: '输入学期',

      stationNameKeyword: '输入站点名称'
    },

    messages: {
      needWeekdaysAndStops: '请至少选择一条「路线日期」，并为该日期添加站点后再保存。',

      selectRowsFirst: '请先勾选路线',

      copySuccess: '复制成功',

      confirmDeleteLines: '确定删除所选路线？删除后不可恢复。',
      selectTermsFirst: '请先勾选学期',
      confirmDeleteTerms: '确定删除所选学期？删除后不可恢复。',
      selectStationsFirst: '请先勾选站点',
      confirmDeleteStations: '确定删除所选站点？删除后不可恢复。'
    },

    routeType: {
      daily: '日车',

      weekly: '周车'
    },

    visible: {
      yes: '可见',

      no: '不可见'
    },

    term: {
      intentStart: '申请开始',

      intentEnd: '申请结束',

      serviceStart: '服务开始',

      serviceEnd: '服务结束'
    },

    fields: {
      stationName: '站点'
    },

    actions: {
      addRoute: '新增路线',

      importRoute: '导入',

      downloadRouteTemplate: '下载模板',

      copyRoute: '复制路线',

      addTerm: '新增学期',
      editTerm: '编辑学期',

      addStation: '新增站点',
      editStation: '编辑站点',

      importStation: '导入',

      downloadStationTemplate: '下载模板',

      editRoute: '编辑路线'
    },

    form: {
      cnName: '中文名',

      enName: '英文名',

      intentRange: '申请时间',

      serviceRange: '服务时间',

      lineType: '路线类型',

      plateList: '车牌号',

      status: '状态',

      routeWeekdays: '路线日期',

      addWeekRow: '增加',

      removeWeekRow: '减少',

      bindAddStop: '新增站点',

      stop: '站点',

      afternoonLeave: '放学下车时间',

      dayPrice: '日价格',

      weekPriceLabel: '周价格',

      pickGoOrBackTime: '请选择上学或放学时间',

      confirmDeleteStop: '确定从本条路线日期中移除该站点？',

      modalAdd: '新增',

      modalEdit: '编辑',

      actionsColumn: '操作',

      routeScheduleSection: '路线日期与站点',

      scheduleBlockTitle: '第 {n} 组',

      stationTableEmpty: '该路线日期下尚未添加站点',

      addScheduleGroup: '+ 添加路线日期组',

      stationCol: {
        name: '站点',

        goTime: '上学上车时间',

        backTime: '放学上车时间',

        price: '单次价',

        weekPrice: '周价格'
      }
    }
  },

  routeOperation: {
    pleaseSelect: '请选择',

    page: {
      title: '路线运营',

      description: '查询与维护校车运营记录；字段与权限与旧系统一致。'
    },

    columns: {
      id: 'ID',

      status: '状态',

      statusLabel: '状态',

      arrivalStatusLabel: '实际状态',

      schoolEnNames: '校区',

      sectionName: '学期',

      carNumber: '车牌号',

      carTeacher: '跟车老师',

      lineName: '路线',

      stationName: '站点',

      rideDate: '乘车日期',

      arrivalTime: '到达时间',

      createTime: '创建时间',

      updateTime: '更新时间',

      remark: '备注'
    },

    placeholders: {
      school: '请选择学校',

      line: '请选择路线',

      station: '请选择站点',

      status: '状态',

      rideDateStart: '开始日期',

      rideDateEnd: '结束日期'
    },

    form: {
      school: '校区',

      section: '学期',

      line: '路线',

      station: '站点',

      timeType: '时间类型',

      car: '车牌号',

      driver: '司机',

      teacher: '跟车老师',

      seats: '座位数',

      rideDate: '乘车日期',

      arrivalTime: '到达时间',

      remark: '备注',

      schoolTrip: '上学时间',

      homeTrip: '放学时间'
    },

    status: {
      early: '早点',

      onTime: '准点',

      late: '晚点',

      arrive: '到站'
    },

    messages: {
      confirmDelete: '确定删除所选运营记录吗？',

      exportSuccess: '导出成功'
    }
  },

  routeException: {
    pleaseSelect: '请选择',

    page: {
      title: '异常上报',

      description: '查询与维护校车异常上报记录。'
    },

    columns: {
      id: 'ID',

      schoolEnNames: '校区',

      sectionName: '学期',

      lineName: '路线',

      carNumber: '车牌号',

      driver: '司机',

      teacher: '跟车老师',

      exceptionTypeLabel: '异常类型',

      exceptionDate: '异常日期',

      needDispatchLabel: '是否调度',

      dispatchCarNumber: '调度车牌号',

      dispatchDriver: '调度司机',

      createTime: '创建时间',

      details: '详情'
    },

    placeholders: {
      school: '请选择学校',

      section: '请选择学期',

      line: '请选择路线',

      car: '请选择车辆',

      exceptionType: '异常类型',

      needDispatch: '是否调度',

      exceptionDateStart: '开始日期',

      exceptionDateEnd: '结束日期'
    },

    form: {
      school: '校区',

      section: '学期',

      line: '路线',

      car: '车牌号',

      driver: '司机',

      teacher: '跟车老师',

      exceptionDate: '异常日期',

      exceptionType: '异常类型',

      needDispatch: '是否调度',

      dispatchCar: '调度车牌号',

      dispatchDriver: '调度司机',

      details: '详情'
    },

    exceptionType: {
      behavior: '行为异常',

      vehicle: '车辆异常'
    },

    options: {
      yes: '是',

      no: '否'
    },

    messages: {
      confirmDelete: '确定删除所选异常记录吗？',

      exportSuccess: '导出成功'
    }
  }
}
