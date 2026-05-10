export default {
    courseName: {
        1: "课程",
        2: "活动",
        3: "赛事",
        4: "俱乐部",
    },
    courseCover: {
        1: "isaic_course_cover",
        2: "isaic_activity_cover",
        3: "isaic_competition_cover",
        4: "isaic_club_cover",
    },
    courseCode: {
        1: "isaic_course_signup_success_qr_code",
        2: "isaic_activity_signup_success_qr_code",
        3: "isaic_competition_signup_success_qr_code",
        4: "isaic_club_signup_success_qr_code",
    },
    courseKind: {
        1: "是",
        2: "否",
    },
    payMethod: {
        1: "线下交易",
        2: "微信支付",
    },
    refundStatusObj: {
        1: '待审批',
        2: '已通过',
        3: '已拒绝',
        4: '已取消',
    },
    refundStatusList: [
        {
            name: "待审批",
            type: 1,
        },
        {
            name: "已通过",
            type: 2,
        },
        {
            name: "已拒绝",
            type: 3,
        },
        {
            name: "已取消",
            type: 4,
        },
    ],
    orderStatusObj: {
        'unpaid': '待支付',
        'paid': '已支付',
        'scheduled': '已排课',
        'finished': '已完成',
        'closed': '已关闭',
        'cancelled': '已取消',
        'refunded': '已退款',
        'refund_apply': '申请退款',
        'refund_amount': '部分退款',
        'all_sub_scheduled': '已排课',
        'refund_applying': '申请退款中',
        'refund_applyingAll': '申请退款中',
    },
    orderStatus: [
        {
            name: "待支付",
            type: "unpaid",

        },
        {
            name: "已支付",
            type: "paid",

        },
        {
            name: "已完成",
            type: "finished",

        },

        {
            name: "已取消",
            type: "cancelled",

        },
        // {
        //     name: "申请退款",
        //     type: "refund_apply",

        // },
        {
            name: "已退款",
            type: "refunded",

        },
        {
            name: "已关闭",
            type: "closed",

        },

    ],
    orderStatusList: [
        {
            name: "全部",
            type: "1",
            btn: [{
                name: "查看",
                type: "look",
                permissions: "look",
                icon: "el-icon-view",
                followStatus: 1
            },
            ],
        },
        {
            name: "待支付",
            type: "unpaid",
            btn: [{
                name: "查看",
                type: "look",
                permissions: "look",
                icon: "el-icon-view",
                followStatus: 1
            },
            ],
        },
        {
            name: "已支付",
            type: "paid",
            btn: [{
                name: "查看",
                type: "look",
                permissions: "look",
                icon: "el-icon-view",
                followStatus: 1
            },
            ],
        },
        {
            name: "已完成",
            type: "finished",
            btn: [{
                name: "查看",
                type: "look",
                permissions: "look",
                icon: "el-icon-view",
                followStatus: 1
            },
            ],
        },

        {
            name: "已取消",
            type: "cancelled",
            btn: [{
                name: "查看",
                type: "look",
                permissions: "look",
                icon: "el-icon-view",
                followStatus: 1
            },
            ],
        },
        // {
        //     name: "申请退款",
        //     type: "refund_apply",
        //     btn: [{
        //         name: "查看",
        //         type: "look",
        //         permissions: "look",
        //         icon: "el-icon-view",
        //         followStatus: 1
        //     },
        //     ],
        // },
        {
            name: "已退款",
            type: "refunded",
            btn: [{
                name: "查看",
                type: "look",
                permissions: "look",
                icon: "el-icon-view",
                followStatus: 1
            },
            ],
        },
        {
            name: "已关闭",
            type: "closed",
            btn: [{
                name: "查看",
                type: "look",
                permissions: "look",
                icon: "el-icon-view",
                followStatus: 1
            },
            ],
        },

    ],
    refundTableTitle: [
        { label: "订单号", prop: "tradeNo", width: "", fixed: 'left' },
        { label: "中文名称", prop: "sceneNameCn", width: "" },
        { label: "下单电话", prop: "parentPhone", width: "200px" },
        { label: "是否主课程", prop: "kind", width: "200px" },
        { label: "价格(RMB/元)", prop: "price", width: "200px" },
        { label: "状态", prop: "statusLabel", width: "200px" },
    ],
    orderTableTitle: [
        { label: "编号", prop: "tradeNo", width: "", fixed: 'left' },
        { label: "中文名称", prop: "nameCn", width: "" },
        // { label: "退款信息", prop: "marks", width: "200px" },
        { label: "价格(RMB/元)", prop: "price", width: "200px" },
        { label: "状态", prop: "statusLabel", width: "200px" },
    ],
    courseTableTitle: [
        { label: "编号", prop: "id", width: "100px", fixed: 'left' },
        { label: "中文名称", prop: "nameCn", width: "200px" },
        { label: "英文名称", prop: "nameEn", width: "200px" },
        { label: "是否置顶", prop: "recommendLabel", width: "200px" },
        { label: "价格(RMB/元)", prop: "price", width: "200px" },
        { label: "销量", prop: "salesNum", width: "200px" },
        { label: "上传人", prop: "username", width: "" },
        { label: "创建时间", prop: "createTime", width: "200px" },
        { label: "状态", prop: "releaseLabel", width: "100px" },
    ],
    courseBindTableTitle: [
        { label: "编号", prop: "id", width: "100px", fixed: 'left' },
        { label: "中文名称", prop: "nameCn", width: "" },
        { label: "英文名称", prop: "nameEn", width: "" },
        { label: "价格(RMB/元)", prop: "price", width: "200px" },
        { label: "销量", prop: "salesNum", width: "200px" },
        { label: "状态", prop: "releaseLabel", width: "100px" },
    ],
    clubTableTitle: [
        { label: "编号", prop: "id", width: "100px", fixed: 'left' },
        { label: "中文名称", prop: "nameCn", width: "200px" },
        { label: "英文名称", prop: "nameEn", width: "200px" },
        // { label: "封面", prop: "coverFileId", width: "200px" },
        { label: "价格(RMB/元)", prop: "price", width: "200px" },
        { label: "销量", prop: "salesNum", width: "200px" },
        { label: "上传人", prop: "username", width: "" },
        { label: "学生理事", prop: "studentCouncil", width: "" },
        { label: "指导老师", prop: "academicAdvisor", width: "" },
        { label: "状态", prop: "releaseLabel", width: "100px" },
    ],
    swiperTableTitle: [
        { label: "名称", prop: "title", width: "200px", fixed: 'left' },
        // { label: "缩略图", prop: "fullName", width: "200px" },
        { label: "上传人", prop: "username", width: "" },
        { label: "说明", prop: "description", width: "200px" },
        { label: "排序", prop: "sort", width: "200px" },
        { label: "状态", prop: "releaseLabel", width: "200px" },
    ],
    studentTableTitle: [
        { label: "姓名(中)", prop: "nameCn", width: "200px", fixed: 'left' },
        { label: "姓名(英)", prop: "nameEn", width: "200px" },
        { label: "学号", prop: "admissionNo", width: "200px" },
        { label: "关联家长账号", prop: "parentPhone", width: "" },
        { label: "是否爱莎学生", prop: "isIsaLabel", width: "200px" },
    ],
    bindStudentTable: [
        { label: "姓名(中)", prop: "nameCn", width: "200px", fixed: 'left' },
        { label: "姓名(英)", prop: "nameEn", width: "200px" },
        { label: "学号", prop: "admissionNo", width: "200px" },
        { label: "是否爱莎学生", prop: "isIsaLabel", width: "200px" },
        { label: "学校", prop: "schoolNameCn", width: "200px" },
        { label: "年级", prop: "gradeName", width: "200px" },
        { label: "性别", prop: "genderLabel", width: "200px" },
    ],
    parentTableTitle: [
        { label: "用户ID", prop: "id", width: "200px", fixed: 'left' },
        { label: "邮箱", prop: "email", width: "200px", },
        { label: "手机号", prop: "phone", width: "200px" },
        { label: "付费总额", prop: "payingSum", width: "200px" },
        { label: "订单数量", prop: "orderNum", width: "200px" },
        { label: "启用", prop: "isActiveLabel", width: "" },
        { label: "最近登录时间", prop: "loginTime", width: "200px" },
    ],
    courseTableBtn: [
        // {
        //     name: "查看",
        //     type: "look",
        //     icon: "",
        //     permissions: ""
        // },
        {
            name: "编辑",
            type: "edit",
            icon: "",
            permissions: ""
        },
        {
            name: "下架",
            type: "look",
            icon: "",
            permissions: ""
        },
        {
            name: "上架",
            type: "look",
            icon: "",
            permissions: ""
        },
        {
            name: "下载报名表",
            type: "look",
            icon: "",
            permissions: ""
        },
        {
            name: "删除",
            type: "look",
            icon: "",
            permissions: ""
        },
    ],
    language: [
        { label: "中文", value: '1' },
        { label: "英文", value: '2' },
        { label: "中英双语", value: '3' },
    ],
    grade: [
        { label: "一年级", value: '1' },
        { label: "二年级", value: '2' },
        { label: "三年级", value: '3' },
    ],
    courseType: [
        { label: "主数据", value: '1' },
        { label: "子数据", value: '2' },
    ],
    courseStatus: [
        { label: "上架", value: 1 },
        { label: "下架", value: 2 },
    ],
    yesOrNo: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
    ],
    courseStatusObj: {
        0: "待上架",
        1: "上架",
        2: "下架",
    },
    courseFormType: [
        { label: "主课程", value: '1' },
        { label: "子课程", value: '2' },
    ],
    activityFormType: [
        { label: "主活动", value: '1' },
        { label: "子活动", value: '2' },
    ],
    competitionFormType: [
        { label: "主赛事", value: '1' },
        { label: "子赛事", value: '2' },
    ],

}
