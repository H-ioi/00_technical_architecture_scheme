export const consult = {
  tablestyle: {
    headercellstyle: {
      background: "#F3F8FD",
      color: " #333333",
      "font-size": "14px",
      "font-weight": "400",
      height: "40px",
      "box-sizing": "border-box",
    },
    rowstyle: {
      color: " #666666",
      "font-size": "14px",
      "font-weight": "400",
      height: "40px",
      border: "none",
      padding: "0px",
      "box-sizing": "border-box",
    },
  },
  acTemplateTableTitle: [
    {
      label: "收集表名",
      prop: "collectionName",
      width: "",
      fixed: true,
    },
    {
      label: "学校",
      prop: "schoolsLabel",
      width: "",
      fixed: false,
    },
    {
      label: "活动名称",
      prop: "activityNames",
      width: "",
      fixed: false,
    },
    {
      label: "填报须知",
      prop: "guideline",
      width: "",
      fixed: false,
    },
    {
      label: "编辑人",
      prop: "editorName",
      width: "",
      fixed: false,
    },
    {
      label: "状态",
      prop: "statusLabel",
      width: "",
      fixed: false,
    },
    {
      label: "创建时间",
      prop: "createTime",
      width: "",
      fixed: false,
    },
    {
      label: "更新时间",
      prop: "updateTime",
      width: "",
      fixed: false,
    },
  ],
  activityInfo: [
    {
      label: "活动名称",
      prop: "activityName",
      width: "",
      fixed: true,
    },
    {
      label: "活动校区",
      prop: "schoolsLabel",
      width: "",
      fixed: false,
    },
    {
      label: "活动类型",
      prop: "activityTypeLabel",
      width: "",
      fixed: false,
    },
    {
      label: "开始时间",
      prop: "startDate",
      width: "",
      fixed: false,
    },
    {
      label: "结束时间",
      prop: "endDate",
      width: "",
      fixed: false,
    },

    {
      label: "活动负责人",
      prop: "managerName",
      width: "",
      fixed: false,
    },
    {
      label: "编辑人",
      prop: "editorName",
      width: "",
      fixed: false,
    },
    {
      label: "创建时间",
      prop: "createTime",
      width: "",
      fixed: false,
    },
    {
      label: "活动详情",
      prop: "activityDetails",
      width: "",
      fixed: false,
    },
  ],
  activityTableTitle: [
    {
      label: "活动名称",
      prop: "activityName",
      width: "",
      fixed: true,
    },
    // {
    // 	label: "活动校区",
    // 	prop: "schoolsLabel",
    // 	width: "100px",
    // 	fixed: false
    // },
    {
      label: "活动类型",
      prop: "activityTypeLabel",
      width: "",
      fixed: false,
    },
    {
      label: "开始时间",
      prop: "startDate",
      width: "",
      fixed: false,
    },
    {
      label: "结束时间",
      prop: "endDate",
      width: "",
      fixed: false,
    },

    {
      label: "活动详情",
      prop: "activityDetails",
      width: "",
      fixed: false,
    },
    {
      label: "活动负责人",
      prop: "managerName",
      width: "",
      fixed: false,
    },
    {
      label: "编辑人",
      prop: "editorName",
      width: "",
      fixed: false,
    },
    {
      label: "创建时间",
      prop: "createTime",
      width: "",
      fixed: false,
    },
  ],
  guardiansTableTitle: [
    {
      label: "姓",
      prop: "lastName",
      width: "100px",
      fixed: true,
    },
    {
      label: "名",
      prop: "firstName",
      width: "100px",
    },
    {
      label: "其他姓名",
      prop: "otherName",
      width: "100px",
    },
    {
      label: "性别",
      prop: "sexlabel",
      width: "100px",
    },
    // {
    //   label: "和申请人的关系",
    //   prop: "relationTypeLabel",
    //   width: "200px",
    // },
    {
      label: "电话",
      prop: "phone",
      width: "200px",
    },
    {
      label: "微信号",
      prop: "wechat",
      width: "200px",
    },
    {
      label: "身份证/护照号",
      prop: "idNumber",
      width: "200px",
    },
    {
      label: "邮箱",
      prop: "email",
      width: "200px",
    },
    {
      label: "国籍",
      prop: "nationality",
      width: "200px",
    },
    {
      label: "语言",
      prop: "language",
      width: "200px",
    },
    {
      label: "第二语言",
      prop: "secondLanguage",
      width: "200px",
    },
    {
      label: "工作单位",
      prop: "employer",
      width: "200px",
    },
    {
      label: "职位",
      prop: "jobTitle",
      width: "200px",
    },
    {
      label: "地址第一行",
      prop: "address",
      width: "200px",
    },
    {
      label: "地址第二行",
      prop: "addressIi",
      width: "200px",
    },
    {
      label: "省",
      prop: "state",
      width: "200px",
    },
    {
      label: "市",
      prop: "city",
      width: "200px",
    },
    {
      label: "首次探校时间",
      prop: "schoolTour",
      width: "200px",
    },
    {
      label: "新增时间",
      prop: "createTime",
      width: "200px",
    },
  ],
  studentTitle: [
    {
      label: "校区",
      prop: "applySchoolLabel",
      width: "200px",
      fixed: true,
      show: true,
    },
    {
      label: "姓",
      prop: "lastName",
      width: "200px",
      show: true,
    },
    {
      label: "名",
      prop: "firstName",
      width: "200px",
      show: true,
    },
    {
      label: "英文名",
      prop: "studentNameEn",
      width: "200px",
      show: true,
    },
    {
      label: "偏好称呼的名字",
      prop: "preferredName",
      width: "200px",
      show: false,
    },
    {
      label: "其他名字",
      prop: "otherName",
      width: "200px",
      show: false,
    },
    {
      label: "性别",
      prop: "sexlabel",
      width: "200px",
      show: true,
    },
    {
      label: "出生日期",
      prop: "birthday",
      width: "200px",
      show: true,
    },
    {
      label: "身份证/护照号",
      prop: "identityCard",
      width: "200px",
      show: true,
    },
    {
      label: "邮箱",
      prop: "email",
      width: "200px",
      show: true,
    },
    {
      label: "班级",
      prop: "studentClass",
      width: "200px",
      show: true,
    },
    {
      label: "学号",
      prop: "studentNumber",
      width: "200px",
      show: true,
    },
    {
      label: "在读学校",
      prop: "atSchool",
      width: "200px",
      show: true,
    },
    {
      label: "在读年级",
      prop: "enrollLevelInLabel",
      width: "200px",
      show: true,
    },
    {
      label: "申请年级",
      prop: "enrollLevelLabel",
      width: "200px",
      show: true,
    },
    {
      label: "入学年级",
      prop: "enrollmentGradeLabel",
      width: "200px",
      show: true,
    },
    {
      label: "方向",
      prop: "directionLabel",
      width: "200px",
      show: true,
    },

    {
      label: "国籍",
      prop: "nationality",
      width: "200px",
      show: true,
    },
    {
      label: "语言",
      prop: "language",
      width: "200px",
      show: true,
    },
    {
      label: "第二语言",
      prop: "secondLanguage",
      width: "200px",
      show: false,
    },
    {
      label: "第三语言",
      prop: "thirdLanguage",
      width: "200px",
      show: false,
    },
    {
      label: "入学年份",
      prop: "enrollYear",
      width: "200px",
      show: true,
    },
    {
      label: "奖学金",
      prop: "awardScholarship",
      width: "200px",
      show: true,
    },
    {
      label: "奖学金返点",
      prop: "scholarshipRemission",
      width: "200px",
      show: true,
    },
    {
      label: "缴费主体",
      prop: "paySubjectLabel",
      width: "200px",
      show: true,
    },
    {
      label: "家庭住址",
      prop: "homeAddress",
      width: "200px",
      show: true,
    },
    {
      label: "是否休学",
      prop: "isDropoutLabel",
      width: "200px",
      show: true,
    },
    {
      label: "新增时间",
      prop: "createTime",
      width: "200px",
      show: true,
    },
  ],
  tableTitle: [
    {
      label: "校区",
      prop: "applySchoolLabel",
      width: "200px",
      fixed: true,
    },
    {
      label: "渠道",
      prop: "channellLabel",
      width: "200px",
    },
    {
      label: "来源",
      prop: "origin",
      width: "200px",
    },
    {
      label: "学生姓名",
      prop: "studentName",
      width: "200px",
    },

    {
      label: "申请年级",
      prop: "enrollLevelLabel",
      width: "200px",
    },
    {
      label: "方向",
      prop: "directionLabel",
      width: "200px",
    },
    {
      label: "在读学校",
      prop: "atSchoolLabel",
      width: "200px",
    },
    {
      label: "在读年级",
      prop: "enrollLevelInLabel",
      width: "200px",
    },
    {
      label: "家长称谓",
      prop: "guardianTitle",
      width: "200px",
    },
    {
      label: "联系方式",
      prop: "contactMethod",
      width: "200px",
    },
    {
      label: "首次探校时间",
      prop: "schoolTour",
      width: "200px",
    },
    {
      label: "跟进标签",
      prop: "followTags",
      width: "200px",
    },
    {
      label: "跟进人",
      prop: "followers",
      width: "200px",
    },
    {
      label: "创建人",
      prop: "createUsername",
      width: "200px",
    },
    {
      label: "新增时间",
      prop: "createTime",
      width: "200px",
    },
    {
      label: "更新时间",
      prop: "updateTime",
      width: "200px",
    },
  ],
  guardiansTitle: [
    {
      label: "姓",
      prop: "lastName",
      width: "100px",
      fixed: true,
    },
    {
      label: "名",
      prop: "firstName",
      width: "100px",
    },

    {
      label: "性别",
      prop: "sexlabel",
      width: "100px",
    },
    {
      label: "和申请人的关系",
      prop: "relationTypeLabel",
      width: "200px",
    },
    {
      label: "电话",
      prop: "phone",
      width: "200px",
    },
    {
      label: "邮箱",
      prop: "email",
      width: "200px",
    },
    {
      label: "国籍",
      prop: "nationality",
      width: "200px",
    },
    {
      label: "语言",
      prop: "language",
      width: "200px",
    },

    {
      label: "首次探校时间",
      prop: "schoolTour",
      width: "200px",
    },
    {
      label: "新增时间",
      prop: "createTime",
      width: "200px",
    },
  ],
  // 工单状态
  followStatus: {
    0: "待分配",
    1: "待跟进",
    2: "已申请",
    3: "已入学",
    4: "已关闭",
  },
  sexList: [
    {
      label: "男-Male",
      enLabel: "男-Male",
      value: 1,
    },
    {
      label: "女-Female",
      enLabel: "女-Female",
      value: 0,
    },
  ],
  statusList: [
    {
      name: "待跟进",
      type: "1",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
          followStatus: 1,
        },
        {
          name: "入学",
          type: "enter",
          permissions: "enquiry_all_status_enter",
          icon: "el-icon-circle-close",
          followStatus: 1,
        },
        {
          name: "关闭",
          type: "close",
          permissions: "enquiry_all_status_close",
          icon: "el-icon-circle-close",
          followStatus: 1,
        },
      ],
    },
    {
      name: "已入学",
      type: "2",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
          followStatus: 1,
        },
      ],
    },
    {
      name: "已关闭",
      type: "3",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
          followStatus: 1,
        },
        {
          name: "激活",
          type: "activate",
          permissions: "enquiry_all_status_active",
          icon: "el-icon-view",
          followStatus: 1,
        },
      ],
    },
    {
      name: "全部",
      type: "-1",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
          followStatus: 1,
        },
        {
          name: "入学",
          type: "enter",
          permissions: "enquiry_all_status_enter",
          icon: "el-icon-circle-close",
          followStatus: 1,
        },
        {
          name: "关闭",
          type: "close",
          permissions: "enquiry_all_status_close",
          icon: "el-icon-circle-close",
          followStatus: 1,
        },
      ],
    },
  ],
  statusAllList: [
    {
      name: "待分配",
      type: "0",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
          followStatus: 0,
        },
        {
          name: "申请",
          type: "apply",
          permissions: "enquiry_all_status_close",
          icon: "el-icon-circle-close",
          followStatus: 0,
        },
        {
          name: "关闭",
          type: "close",
          permissions: "enquiry_status_close",
          icon: "el-icon-circle-close",
          followStatus: 1,
        },
      ],
    },
    {
      name: "待跟进",
      type: "1",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "enquiry_mine_view",
          icon: "el-icon-view",
          followStatus: 1,
        },
        {
          name: "申请",
          type: "apply",
          permissions: "thepool_user_student_edit",
          icon: "el-icon-circle-close",
          followStatus: 1,
        },
        {
          name: "关闭",
          type: "close",
          permissions: "enquiry_status_close",
          icon: "el-icon-circle-close",
          followStatus: 1,
        },
      ],
    },
    {
      name: "已申请",
      type: "2",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "enquiry_mine_view",
          icon: "el-icon-view",
          followStatus: 2,
        },
        {
          name: "入学",
          type: "enter",
          permissions: "enquiry_all_status_enter",
          icon: "el-icon-circle-close",
          followStatus: 2,
        },
        {
          name: "关闭",
          type: "close",
          permissions: "enquiry_all_status_batch_apply_close",
          icon: "el-icon-circle-close",
          followStatus: 2,
        },
      ],
    },
    {
      name: "已入学",
      type: "3",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "enquiry_mine_view",
          icon: "el-icon-view",
          followStatus: 3,
        },
        {
          name: "离校",
          type: "leaving",
          permissions: "thepool_user_student_leaving",
          icon: "el-icon-view",
          followStatus: 4,
        },
      ],
    },
    {
      name: "已关闭",
      type: "4",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "enquiry_mine_view",
          icon: "el-icon-view",
          followStatus: 4,
        },
        {
          name: "激活",
          type: "activate",
          permissions: "enquiry_all_status_active",
          icon: "el-icon-view",
          followStatus: 4,
        },
      ],
    },
    {
      name: "全部",
      type: "-1",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "enquiry_mine_view",
          icon: "el-icon-view",
          followStatus: "-1",
        },
      ],
    },
  ],
  statusMineList: [
    {
      name: "待跟进",
      type: "1",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "enquiry_mine_view",
          icon: "el-icon-view",
          followStatus: 1,
        },
        {
          name: "申请",
          type: "apply",
          permissions: "enquiry_mine_status_enter",
          icon: "el-icon-circle-close",
          followStatus: 1,
        },
        {
          name: "关闭",
          type: "close",
          permissions: "enquiry_mine_status_close",
          icon: "el-icon-circle-close",
          followStatus: 1,
        },
      ],
    },
    {
      name: "已申请",
      type: "2",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "enquiry_mine_view",
          icon: "el-icon-view",
          followStatus: 2,
        },
        {
          name: "入学",
          type: "enter",
          permissions: "enquiry_mine_status_enter",
          icon: "el-icon-circle-close",
          followStatus: 2,
        },
        {
          name: "关闭",
          type: "close",
          permissions: "enquiry_mine_status_batch_apply_close",
          icon: "el-icon-circle-close",
          followStatus: 2,
        },
      ],
    },
    {
      name: "已入学",
      type: "3",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "enquiry_mine_view",
          icon: "el-icon-view",
          followStatus: 3,
        },
        {
          name: "离校",
          type: "leaving",
          permissions: "thepool_user_student_mine_leaving",
          icon: "el-icon-view",
          followStatus: 4,
        },
      ],
    },
    {
      name: "已关闭",
      type: "4",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "enquiry_mine_view",
          icon: "el-icon-view",
          followStatus: 4,
        },
        {
          name: "激活",
          type: "activate",
          permissions: "enquiry_mine_status_active",
          icon: "el-icon-view",
          followStatus: 4,
        },
      ],
    },
    {
      name: "全部",
      type: "-1",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "enquiry_mine_view",
          icon: "el-icon-view",
          followStatus: 1,
        },
      ],
    },
  ],
  sortMode: [
    {
      label: "新增时间",
      value: "orderByCreateTime",
    },
    {
      label: "更新时间",
      value: "orderByUpdateTime",
    },
  ],
  filterStatusList: [
    {
      name: "待分配",
      type: "0",
    },
    {
      name: "待跟进",
      type: "1",
    },
    {
      name: "已申请",
      type: "2",
    },
    {
      name: "已入学",
      type: "3",
    },
    {
      name: "已关闭",
      type: "4",
    },
  ],
  enrolledStatusObj: {
    0: "未入学",
    1: "已申请",
    2: "已入学",
    3: "已离校",
    4: "已毕业",
  },
  enrolledStatus: [
    {
      label: "未入学",
      enLabel: "Not Enrolled",
      value: "0",
    },
    {
      label: "已申请",
      enLabel: "Applied",
      value: "1",
    },
    {
      label: "已入学",
      enLabel: "Enrolled",
      value: "2",
    },
    {
      label: "已离校",
      enLabel: "Leaving",
      value: "3",
    },
    {
      label: "已毕业",
      enLabel: "Graduated",
      value: "4",
    },
  ],
  enrolledStatusMyList: [
    {
      name: "未入学",
      type: "0",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "编辑",
          type: "edit",
          permissions: "thepool_user_student_mine_edit",
          icon: "el-icon-view",
        },
        {
          name: "申请",
          type: "apply",
          permissions: "thepool_user_student_mine_apply",
          icon: "el-icon-circle-close",
        },
      ],
    },
    {
      name: "已申请",
      type: "1",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "编辑",
          type: "edit",
          permissions: "thepool_user_student_mine_edit",
          icon: "el-icon-view",
        },
        {
          name: "入学",
          type: "enter",
          permissions: "thepool_user_student_mine_enter",
          icon: "el-icon-circle-close",
        },
      ],
    },
    {
      name: "已入学",
      type: "2",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "编辑",
          type: "edit",
          permissions: "thepool_user_student_mine_edit",
          icon: "el-icon-view",
        },
        {
          name: "离校",
          type: "leaving",
          permissions: "thepool_user_student_mine_leaving",
          icon: "el-icon-circle-close",
        },
        {
          name: "毕业",
          type: "graduation",
          permissions: "thepool_user_student_mine_graduated",
          icon: "el-icon-circle-close",
        },
      ],
    },
    {
      name: "已离校",
      type: "3",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "重新入学",
          type: "enter",
          permissions: "thepool_user_student_mine_leaving",
          icon: "el-icon-circle-close",
        },
      ],
    },
    {
      name: "已毕业",
      type: "4",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
      ],
    },
    {
      name: "全部",
      type: "-1",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
      ],
    },
  ],
  enrolledStatusList: [
    {
      name: "未入学",
      type: "0",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "编辑",
          type: "edit",
          permissions: "thepool_user_student_edit",
          icon: "el-icon-view",
        },
        {
          name: "申请",
          type: "apply",
          permissions: "thepool_user_student_apply",
          icon: "el-icon-circle-close",
        },
      ],
    },
    {
      name: "已申请",
      type: "1",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "编辑",
          type: "edit",
          permissions: "thepool_user_student_edit",
          icon: "el-icon-view",
        },
        {
          name: "入学",
          type: "enter",
          permissions: "thepool_user_student_enter",
          icon: "el-icon-circle-close",
        },
      ],
    },
    {
      name: "已入学",
      type: "2",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "编辑",
          type: "edit",
          permissions: "thepool_user_student_edit",
          icon: "el-icon-view",
        },
        {
          name: "离校",
          type: "leaving",
          permissions: "thepool_user_student_leaving",
          icon: "el-icon-circle-close",
        },
        {
          name: "毕业",
          type: "graduation",
          permissions: "thepool_user_student_graduated",
          icon: "el-icon-circle-close",
        },
      ],
    },
    {
      name: "已离校",
      type: "3",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "重新入学",
          type: "enter",
          permissions: "thepool_user_student_leaving",
          icon: "el-icon-circle-close",
        },
      ],
    },
    {
      name: "已毕业",
      type: "4",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
      ],
    },
    {
      name: "全部",
      type: "-1",
      btn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
      ],
    },
  ],
  selectTableTitle: [
    {
      label: "校区",
      prop: "applySchoolLabel",
      // width: "200px",
      show: true,
      fixed: false,
    },
    {
      label: "家长称谓",
      prop: "guardianTitle",
      // width: "200px",
      show: true,
      fixed: false,
    },
    {
      label: "学生姓名",
      prop: "studentName",
      // width: "200px",
      show: true,
      fixed: false,
    },

    {
      label: "渠道",
      prop: "channellLabel",
      // width: "200px",
      show: true,
      fixed: false,
    },
    {
      label: "来源",
      prop: "origin",
      // width: "200px",
      show: true,
      fixed: false,
    },
    {
      label: "联系方式",
      prop: "contactMethod",
      // width: "200px",
      show: true,
      fixed: false,
    },
    {
      label: "申请年级",
      prop: "enrollLevelLabel",
      // width: "200px",
      show: true,
      fixed: false,
    },
    {
      label: "方向",
      prop: "directionLabel",
      // width: "200px",
      show: true,
      fixed: false,
    },
    {
      label: "在读学校",
      prop: "atSchoolLabel",
      // width: "200px",
      show: false,
      fixed: false,
    },
    {
      label: "在读年级",
      prop: "enrollLevelInLabel",
      // width: "200px",
      show: false,
      fixed: false,
    },
    {
      label: "期望入读日期",
      prop: "expectReadDate",
      // width: "200px",
      show: false,
      fixed: false,
    },
    {
      label: "首次探校时间",
      prop: "schoolTour",
      // width: "200px",
      show: false,
      fixed: false,
    },
    {
      label: "跟进标签",
      prop: "followTags",
      // width: "200px",
      show: false,
      fixed: false,
    },
    {
      label: "跟进人",
      prop: "followers",
      // width: "200px",
      show: false,
      fixed: false,
    },
    {
      label: "首次来源信息",
      prop: "firstChannel",
      // width: "200px",
      show: true,
      fixed: false,
    },
    {
      label: "创建人",
      prop: "createUsername",
      // width: "200px",
      show: false,
      fixed: false,
    },
    {
      label: "新增时间",
      prop: "createTime",
      // width: "200px",
      show: false,
      fixed: false,
    },
    {
      label: "更新时间",
      prop: "updateTime",
      // width: "200px",
      show: false,
      fixed: false,
    },
  ],
  coverClueTableTitle: [
    {
      label: "校区",
      prop: "applySchool",
    },
    {
      label: "家长称谓",
      prop: "guardianTitle",
    },
    {
      label: "学生姓名",
      prop: "studentName",
    },
    {
      label: "渠道",
      prop: "channel",
    },
    {
      label: "来源",
      prop: "origin",
    },
    {
      label: "联系方式",
      prop: "contactMethod",
    },

    {
      label: "首次探校时间",
      prop: "schoolTour",
    },
    {
      label: "跟进标签",
      prop: "followTags",
    },
  ],
  coverStudentTitle: [
    {
      label: "校区",
      prop: "applySchool",
    },
    {
      label: "姓",
      prop: "lastName",
    },
    {
      label: "名",
      prop: "firstName",
    },
    {
      label: "英文名",
      prop: "studentNameEn",
    },

    {
      label: "性别",
      prop: "sex",
    },
    {
      label: "出生日期",
      prop: "birthday",
    },
    {
      label: "身份证/护照号",
      prop: "identityCard",
    },
    {
      label: "学号",
      prop: "studentNumber",
    },
    {
      label: "在读学校",
      prop: "atSchool",
    },
    {
      label: "在读年级",
      prop: "enrollLevelIn",
    },

    {
      label: "状态",
      prop: "status",
    },

    {
      label: "申请年级",
      prop: "enrollLevel",
    },
    {
      label: "方向",
      prop: "direction",
    },

    {
      label: "国籍",
      prop: "nationality",
    },
    {
      label: "语言",
      prop: "language",
    },
    {
      label: "入学年份",
      prop: "enrollYear",
    },
    {
      label: "奖学金",
      prop: "awardScholarship",
    },
    {
      label: "奖学金返点",
      prop: "scholarshipRemission",
    },
    {
      label: "家庭住址",
      prop: "homeAddress",
    },
  ],
  coverParentTableTitle: [
    {
      label: "姓",
      prop: "lastName",
    },
    {
      label: "名",
      prop: "firstName",
    },
    {
      label: "性别",
      prop: "sexlabel",
    },
    {
      label: "和申请人的关系",
      prop: "relationType",
    },
    {
      label: "电话",
      prop: "phone",
    },
    {
      label: "微信号",
      prop: "wechat",
    },
    {
      label: "邮箱",
      prop: "email",
    },
    {
      label: "国籍",
      prop: "nationality",
    },
    {
      label: "语言",
      prop: "language",
    },
    {
      label: "首次探校时间",
      prop: "schoolTour",
    },
  ],
  upgradeList: [
    {
      name: "未升学",
      type: "0",
    },
    {
      name: "已升学",
      type: "1",
    },
  ],
  upgradeStudentTitle: [
    // {
    // 	label: "ID",
    // 	prop: "id",
    // },
    {
      label: "校区",
      prop: "applySchoolLabel",
    },
    {
      label: "姓名",
      prop: "name",
    },
    {
      label: "学号",
      prop: "number",
    },
    {
      label: "班级",
      prop: "studentClass",
    },
    {
      label: "在读年级",
      prop: "enrollLevel",
    },
  ],
  teamTableTitle: [
    {
      label: "名称",
      prop: "participantsName",
      width: "120px",
      fixed: true,
    },
    {
      label: "咨询数",
      prop: "enquiryNum",
      width: "100px",
    },
    {
      label: "任务数",
      prop: "taskNum",
      width: "100px",
    },
    {
      label: "已完成",
      prop: "completeNum",
      width: "100px",
    },

    {
      label: "待完成",
      prop: "incompleteNum",
      width: "100px",
    },
    {
      label: "已延期",
      prop: "delayNum",
      width: "100px",
    },
    {
      label: "延期率",
      prop: "delayRate",
    },
  ],
  taskTableTitle: [
    {
      label: "任务主题",
      prop: "taskSubject",
      fixed: true,
    },
    {
      label: "任务类型",
      prop: "taskTimeTypeLabel",
    },
    {
      label: "任务时间",
      prop: "taskTime",
    },
    {
      label: "咨询",
      prop: "clueName",
    },
    {
      label: "负责人",
      prop: "personInChargeName",
    },
  ],
  teamDynamicsTitle: [
    {
      label: "姓名",
      prop: "userName",
      fixed: true,
      width: "120px",
    },
    {
      label: "动态类型",
      prop: "dynamicsTypeName",
      width: "120px",
    },
    {
      label: "动态内容",
      prop: "dynamicsContent",
    },
    {
      label: "时间",
      prop: "createTime",
      width: "150px",
    },
  ],
  taskInfo: [
    {
      label: "任务主题",
      prop: "taskSubject",
      fixed: true,
    },
    {
      label: "咨询",
      prop: "clueName",
    },
    {
      label: "完成状态",
      prop: "statusLabel",
    },
    {
      label: "任务类型",
      prop: "taskTimeTypeLabel",
    },
    {
      label: "任务时间",
      prop: "taskTime",
    },

    {
      label: "重要程度",
      prop: "importanceLevelLabel",
    },
    {
      label: "提醒方式",
      prop: "expirationReminderLabel",
    },
    {
      label: "负责人",
      prop: "personInChargeName",
      fixed: true,
    },
    {
      label: "创建人",
      prop: "createName",
      fixed: true,
    },
    {
      label: "创建时间",
      prop: "createTime",
      fixed: true,
    },
    {
      label: "完成进度",
      prop: "completeProgress",
      width: "100%",
    },
    {
      label: "参与人员",
      prop: "participantName",
      width: "100%",
    },
    {
      label: "任务描述",
      prop: "taskDetails",
      width: "100%",
    },
  ],
  eventInfo: [
    {
      label: "事件主题",
      prop: "eventSubject",
      fixed: true,
    },
    {
      label: "咨询",
      prop: "clueName",
    },
    {
      label: "事件时间",
      prop: "eventTime",
    },
    {
      label: "事件类型",
      prop: "eventTypeLabel",
    },
    {
      label: "事件重复",
      prop: "eventRepeatLabel",
    },
    {
      label: "提醒方式",
      prop: "expirationReminderLabel",
    },
    {
      label: "公开程度",
      prop: "publicTypeLabel",
    },
    // {
    // 	label: "参与人员",
    // 	prop: "userNames",
    // 	width: "100%"
    // },
    // {
    // 	label: "事件详情",
    // 	prop: "eventDetails",
    // 	width: "100%"
    // },
  ],
  completeStatus: [
    {
      label: "未完成",
      enLabel: "Not Completed",
      value: "0",
    },
    {
      label: "已完成",
      enLabel: "Completed",
      value: "1",
    },
    // {
    // 	label: "已过期",
    // 	enLabel: "Expired",
    // 	value: "2"
    // },
  ],
  expirationReminder: [
    {
      label: "不提醒",
      enLabel: "Not Reminded",
      value: "0",
    },
    {
      label: "站内提醒",
      enLabel: "In-site Reminder",
      value: "1",
    },

    {
      label: "邮件提醒",
      enLabel: "Email Reminder",
      value: "2",
    },
    {
      label: "站内提醒/邮件提醒",
      enLabel: "In-site Reminder/Email Reminder",
      value: "3",
    },
  ],
  importanceLevel: [
    {
      label: "普通",
      enLabel: "Normal",
      value: "0",
    },
    {
      label: "紧急",
      enLabel: "Urgent",
      value: "1",
    },
  ],
  taskStatus: [
    {
      label: "未开始",
      enLabel: "Not Started",
      value: "0",
    },
    {
      label: "进行中",
      enLabel: "In Progress",
      value: "1",
    },
    {
      label: "已过期",
      enLabel: "Expired",
      value: "2",
    },
    {
      label: "已完成",
      enLabel: "Completed",
      value: "3",
    },
  ],
  taskTimeType: [
    {
      label: "尽快完成",
      enLabel: "As Soon As Possible",
      value: "1",
    },
    {
      label: "指定时间",
      enLabel: "Designated Time",
      value: "0",
    },
  ],
  priorityList: [
    {
      label: "按照优先级",
      enLabel: "By Priority",
      value: "0",
    },
    // {
    // 	label: "按项目",
    // 	enLabel: "By Project",
    // 	value: "1"
    // },
    // {
    // 	label: "按更新时间",
    // 	enLabel: "By Update Time",
    // 	value: "2"
    // },
    {
      label: "按完成时间",
      enLabel: "By Completion Time",
      value: "3",
    },
    {
      label: "按截止时间",
      enLabel: "By Deadline",
      value: "4",
    },
  ],
  roleTypeList: [
    // {
    // 	label: "所有角色",
    // 	enLabel: "All Roles",
    // 	value: "0"
    // },
    {
      label: "我派发的",
      enLabel: "My Assigned",
      value: "1",
    },
    {
      label: "我负责的",
      enLabel: "My Responsible",
      value: "2",
    },
    {
      label: "我参与的",
      enLabel: "My Involved",
      value: "3",
    },
  ],
  eventRepeat: [
    {
      label: "不重复",
      enLabel: "Not Repeated",
      value: "0",
    },
    {
      label: "每天",
      enLabel: "Daily",
      value: "1",
    },
    {
      label: "每周",
      enLabel: "Weekly",
      value: "2",
    },
    {
      label: "每月",
      enLabel: "Monthly",
      value: "3",
    },
    {
      label: "每年",
      enLabel: "Yearly",
      value: "4",
    },
  ],
  eventType: [
    {
      label: "全天",
      enLabel: "All day",
      value: "1",
    },
    {
      label: "非全天",
      enLabel: "Non-all-day",
      value: "0",
    },
  ],
  publicTypeList: [
    {
      label: "公开",
      enLabel: "Public",
      value: "0",
    },
    {
      label: "仅自己可见",
      enLabel: "Private",
      value: "1",
    },
    {
      label: "部门可见",
      enLabel: "Department",
      value: "2",
    },
    {
      label: "校区可见",
      enLabel: "Campus",
      value: "3",
    },
    {
      label: "团队可见",
      enLabel: "Team",
      value: "4",
    },
  ],
  yesOrno: [
    {
      label: "是",
      enLabel: "Yes",
      value: "1",
    },
    {
      label: "否",
      enLabel: "No",
      value: "0",
    },
  ],
  successType: [
    {
      label: "失败",
      enLabel: "Failure",
      value: "0",
    },
    {
      label: "成功",
      enLabel: "Success",
      value: "1",
    },
    {
      label: "部分成功",
      enLabel: "Partial Success",
      value: "2",
    },
  ],
  userEmailType: [
    {
      label: "个人",
      enLabel: "Personal",
      value: "1",
    },
    {
      label: "校区",
      enLabel: "Campus",
      value: "2",
    },
    // {
    // 	label: "团队",
    // 	enLabel: "Team",
    // 	value: "3"
    // },
  ],
  userEmailTitle: [
    {
      label: "用户名",
      prop: "username",
      fixed: true,
    },
    {
      label: "邮箱",
      prop: "emailAddress",
    },
    {
      label: "类型",
      prop: "userTypeLabel",
    },
    {
      label: "是否允许使用个人邮箱发送",
      prop: "isAllowPersonalEmailLabel",
    },
    {
      label: "更新时间",
      prop: "updateTime",
    },
    {
      label: "创建时间",
      prop: "createTime",
    },
  ],
  emailTitle: [
    {
      label: "邮件主题",
      prop: "subject",
      fixed: true,
    },
    {
      label: "发送人",
      prop: "sender",
    },
    {
      label: "收件人",
      prop: "toRecipients",
    },
    {
      label: "抄送人",
      prop: "ccRecipients",
    },
    {
      label: "是否批量发送",
      prop: "isBatchLabel",
    },
    {
      label: "是否成功",
      prop: "isSuccessLabel",
    },
    {
      label: "发送时间",
      prop: "sendTime",
    },
    {
      label: "操作人",
      prop: "operatorName",
    },
  ],
  studentExtendTitle: [
    {
      label: "MDId",
      prop: "mbId",
      width: "200px",
    },
    {
      label: "自定义ID",
      prop: "customId",
      width: "200px",
    },
    {
      label: "Managebac学生ID",
      prop: "managebacStudentId",
      width: "200px",
    },
    {
      label: "姓名",
      prop: "name",
      width: "200px",
      fixed: true,
    },
    {
      label: "代表人信息",
      prop: "representative",
      width: "200px",
    },
    {
      label: "来源营销活动信息",
      prop: "sourceCampaign",
      width: "200px",
    },
    {
      label: "学校",
      prop: "campus",
      width: "200px",
    },
    {
      label: "州/省",
      prop: "state",
      width: "200px",
    },
    {
      label: "城市",
      prop: "city",
      width: "200px",
    },
    {
      label: "邮政编码",
      prop: "postalCode",
      width: "200px",
    },
    {
      label: "地址第一行",
      prop: "address",
      width: "200px",
    },
    {
      label: "地址第二行",
      prop: "address_ii",
      width: "200px",
    },
    {
      label: "申请日期",
      prop: "appliedDate",
      width: "200px",
    },
    {
      label: "申请时间",
      prop: "appliedAt",
      width: "200px",
    },
    {
      label: "注册日期",
      prop: "enrolledDate",
      width: "200px",
    },
    {
      label: "注册时间",
      prop: "enrolledAt",
      width: "200px",
    },
    {
      label: "拒绝日期",
      prop: "declinedDate",
      width: "200px",
    },

    {
      label: "毕业日期",
      prop: "graduatedDate",
      width: "200px",
    },
    {
      label: "咨询日期",
      prop: "inquiredDate",
      width: "200px",
    },
    {
      label: "咨询时间",
      prop: "inquiredAt",
      width: "200px",
    },
    {
      label: "退学日期",
      prop: "withdrawnDate",
      width: "200px",
    },
  ],
  upOrdown: [
    {
      label: "正序",
      enLabel: "Ascending",
      value: "0",
    },
    {
      label: "倒序",
      enLabel: "Descending",
      value: "1",
    },
  ],
};
