export const tablestyle = {
    headercellstyle: {
        background: "#F8F8F8",
        color: " #333333",
        "font-size": "16px",
        "font-weight": "400",
        height: "60px"
    },
    rowstyle: {
        color: " #999999",
        "font-size": "14px",
        "font-weight": "400",
        height: "54px",
        border: "none",
        padding: "0px"
    }
}
export const Clue_labelType = [
    // { label: "刷新时间", prop: "updateTime" },
    { label: "业务需求名称", prop: "name" },
    { label: "业务类型", prop: "typeName" },
    { label: "联系人", prop: "contacterName" },
    { label: "联系电话", prop: "contacterPhone" },
    { label: "公司名称", prop: "contacterCompany" },
    { label: "职务", prop: "contacterPosition" },
]
export const Client_labelType = [
    { label: "客户名称", prop: "name" },
    { label: "客户类型", prop: "typeLabel" },
    { label: "客户等级", prop: "levelLabel" },
    { label: "创建人", prop: "createrName" },
    { label: "关联线索", prop: "clueNum" },
    { label: "关联商机", prop: "opportunityNum" },
    { label: "关联合同", prop: "contractNum" },
    { label: "启用", prop: "status" },
]
export const Client = [
    { label: "客户名称", prop: "name" },
    { label: "客户类型", prop: "typeLabel" },
    { label: "客户等级", prop: "levelLabel" },
    { label: "创建人", prop: "createrName" },
    { label: "关联线索", prop: "clueNum" },
    { label: "关联商机", prop: "opportunityNum" },
    { label: "关联合同", prop: "contractNum" },

]
export const Contacter_labelType = [
    // { label: "刷新时间", prop: "updateTime" },
    { label: "联系人", prop: "name" },
    { label: "联系人电话", prop: "phone" },
    { label: "创建人", prop: "createrName" },
    { label: "关联商机", prop: "opportunityNum" },
    { label: "关联客户", prop: "clientNum" },
    { label: "关联线索", prop: "clueNum" },
    { label: "启用", prop: "status" },
]
export const Contract_labelType = [
    { label: "签约时间", prop: "signupTime" },
    { label: "合同名称", prop: "name" },
    { label: "合同类型", prop: "templateName" },
    { label: "合同签约金额", prop: "amount" },
    { label: "签约人", prop: "signerName" },
]
export const Opportunity_labelType = [
    // { label: "刷新时间", prop: "updateTime" },
    { label: "商机名称", prop: "name" },
    { label: "跟进人", prop: "followUserName" },
    { label: "更新时间", prop: "updateTime" },
    { label: "客户名称", prop: "clientName" },
    // { label: "联系人", prop: "contacterName" },
    // { label: "联系电话", prop: "contacterPhone" },
    // { label: "职务", prop: "contacterPosition" },
]
export const Contacter = [
    { label: "机构名称", prop: "company" },
    { label: "联系人", prop: "name" },
    { label: "联系电话", prop: "phone" },
    { label: "职务", prop: "position" },
    { label: "邮箱", prop: "email" },
]
export const Finance = [
    { label: "税号", prop: "taxSn" },
    { label: "发票抬头", prop: "invoiceTitle" },
    { label: "开户银行", prop: "depositBank" },
    { label: "银行账号", prop: "depositBankAccount" },
    { label: "电话号码", prop: "invoicePhone" },
    { label: "单位地址", prop: "invoiceSite" },
]
export const tableObj = {
    headercellstyle: {
        background: '#F8F8F8',
        color: ' #333333',
        'font-size': '16px',
        'font-weight': '600',
    },
    rowstyle: {
        color: ' #999999',
        'font-size': '16px',
        'font-weight': '400',
    },
    contact_client: {
        labelType: Client_labelType,
        BtnObj: [{ name: "导出", btn: "contact_client_export" },],
        PlayBtn: [
            { name: "查看", btn: "look" },
            { name: "编辑", btn: "contact_client_edit" },
            { name: "设置标签", btn: "contact_client_tag" }
        ],
        isSelection: true,
        haveTableTitle: true,
        tableTitle: "客户列表",
        isplay: true
    },
    client: {
        labelType: Client,
        BtnObj: [],
        PlayBtn: [{ name: "删除", btn: "look" }],
        isSelection: false,
        haveTableTitle: false,
        tableTitle: "",
        isplay: true
    },
    clientlist: {
        labelType: Client,
        BtnObj: [],
        PlayBtn: [],
        isSelection: true,
        haveTableTitle: false,
        tableTitle: "",
        isplay: false
    },
    client_look: {
        labelType: Client,
        BtnObj: [],
        PlayBtn: [{ name: "查看", btn: "look" }],
        isSelection: false,
        haveTableTitle: false,
        tableTitle: "",
        isplay: true
    },
    clientlists: {
        labelType: Client,
        BtnObj: [],
        PlayBtn: [],
        isSelection: false,
        haveTableTitle: false,
        tableTitle: "",
        isplay: false
    },
    contact_contacter: {
        labelType: Contacter_labelType,
        BtnObj: [
            { name: "导入", btn: "contact_contacter_import" },
            { name: "导出", btn: "contact_contacter_export" }
        ],
        tableTitle: "筛选结果",
        PlayBtn: [
            { name: "查看", btn: "look" },
            { name: "编辑", btn: "contact_contacter_edit" },
            { name: "设置标签", btn: "contact_contacter_tag" }
        ],
        isSelection: true,
        haveTableTitle: true,
        isplay: true
    },
    contacter: {
        labelType: Contacter,
        BtnObj: [],
        tableTitle: '',
        PlayBtn: [{ name: '删除', btn: "look" }],
        isSelection: false,
        haveTableTitle: false,
        isplay: true
    },
    contacterlist: {
        labelType: Contacter,
        BtnObj: [],
        tableTitle: '',
        PlayBtn: [],
        isSelection: true,
        haveTableTitle: false,
        isplay: false
    },
    contacterlist_edit: {
        labelType: Contacter,
        BtnObj: [],
        tableTitle: '',
        PlayBtn: [
            { name: "编辑", btn: "look" },
            { name: '删除', btn: "look" }
        ],
        isSelection: true,
        haveTableTitle: false,
        isplay: true
    },
    contacterlist_detail: {
        labelType: Contacter,
        BtnObj: [],
        tableTitle: '',
        PlayBtn: [],
        isSelection: false,
        haveTableTitle: false,
        isplay: false
    },
    clue_my: {
        labelType: Clue_labelType,
        BtnObj: [
            { name: "新增", btn: "clue_my_add" },
            { name: "分配", btn: "clue_assign" },
            { name: "退回", btn: "clue_reback" },
            { name: "关闭", btn: "clue_my_close" },
        ],
        tableTitle: "线索列表",
        PlayBtn: [
            { name: "查看", btn: "look" },
            { name: "编辑", btn: "clue_edit" },
            { name: "转商机", btn: "clue_to_opportunity" }
        ],
        isSelection: true,
        haveTableTitle: true,
        isplay: true
    },
    cluelist: {
        labelType: Clue_labelType,
        BtnObj: [],
        tableTitle: "",
        PlayBtn: [],
        isSelection: false,
        haveTableTitle: false,
        isplay: false
    },
    clue_archives: {
        labelType: Clue_labelType,
        BtnObj: [],
        tableTitle: "线索列表",
        PlayBtn: [
            { name: "查看", btn: "look" },
            { name: "编辑", btn: "clue_edit" }
        ],
        isSelection: true,
        haveTableTitle: true,
        isplay: true
    },
    clue_pool: {
        labelType: Clue_labelType,
        BtnObj: [
            { name: "新增", btn: "clue_pool_add" },
            { name: "分配", btn: "clue_assign" },
            { name: "关闭", btn: "clue_pool_close" },
        ],
        tableTitle: "数据列表",
        PlayBtn: [
            { name: "查看", btn: "look" },
            { name: "编辑", btn: "clue_edit" },
            { name: "认领", btn: "clue_claim" }
        ],
        isSelection: true,
        haveTableTitle: true,
        isplay: true
    },
    cluelist_look: {
        labelType: Clue_labelType,
        BtnObj: [],
        tableTitle: "",
        PlayBtn: [{ name: "查看", btn: "look" }],
        isSelection: false,
        haveTableTitle: false,
        isplay: true
    },
    contract: {
        labelType: Contract_labelType,
        BtnObj: [],
        PlayBtn: [{ name: "查看", btn: "look" },],
        isSelection: false,
        haveTableTitle: true,
        tableTitle: "筛选结果",
        isSelection: true,
        haveTableTitle: true,
        isplay: true
    },
    contract_archives: {
        labelType: Contract_labelType,
        BtnObj: [],
        PlayBtn: [
            { name: "查看", btn: "look" },
            { name: "编辑", btn: "contract_contract_edit" }
        ],
        isSelection: false,
        haveTableTitle: true,
        tableTitle: "筛选结果",
        isSelection: true,
        haveTableTitle: true,
        isplay: true
    },
    contractlist: {
        labelType: Contract_labelType,
        BtnObj: [],
        PlayBtn: [],
        haveTableTitle: false,
        tableTitle: "",
        isSelection: false,
        haveTableTitle: false,
        isplay: false
    },
    contract_look: {
        labelType: Contract_labelType,
        BtnObj: [],
        tableTitle: "",
        PlayBtn: [{ name: "查看", btn: "look" }],
        isSelection: false,
        haveTableTitle: false,
        isplay: true
    },
    finance: {
        labelType: Finance,
        BtnObj: [],
        PlayBtn: [],
        isSelection: false,
        haveTableTitle: false,
        tableTitle: "",
        isSelection: false,
        haveTableTitle: false,
        isplay: false
    },
    finance_edit: {
        labelType: Finance,
        BtnObj: [],
        PlayBtn: [
            { name: "编辑", btn: "contact_client_finance_edit" },
            { name: "删除", btn: "contact_client_finance_del" }
        ],
        isSelection: false,
        haveTableTitle: false,
        tableTitle: "",
        isSelection: false,
        haveTableTitle: false,
        isplay: true
    },
    opportunity_my: {
        labelType: Opportunity_labelType,
        // BtnObj: ['新增', '延期申请', '退回'],
        BtnObj: [{ name: "新增", btn: "opportunity_add" }, { name: "延期申请", btn: "opportunity_extension" }],
        PlayBtn: [
            { name: "查看", btn: "look" },
            { name: "编辑", btn: "opportunity_edit" },
            { name: '签约', btn: "opportunity_sign" },
            { name: "退回", btn: "opportunity_reback" }],
        isSelection: false,
        haveTableTitle: true,
        tableTitle: "筛选结果",
        isSelection: true,
        haveTableTitle: true,
        isplay: true
    },
    opportunity_archives: {
        labelType: Opportunity_labelType,
        // BtnObj: ['新增', '退回', '签约'],
        BtnObj: [],
        PlayBtn: [
            { name: "查看", btn: "look" },
            { name: "编辑", btn: "opportunity_edit" },
            { name: '签约', btn: "opportunity_sign" },
            { name: "退回", btn: "opportunity_reback" }
        ],
        isSelection: false,
        haveTableTitle: true,
        tableTitle: "筛选结果",
        isSelection: true,
        haveTableTitle: true,
        isplay: true
    },
    opportunity_look: {
        labelType: Opportunity_labelType,
        BtnObj: [],
        PlayBtn: [{ name: "查看", btn: "look" }],
        isSelection: false,
        haveTableTitle: false,
        tableTitle: "",
        isSelection: false,
        haveTableTitle: false,
        isplay: true
    },
}
