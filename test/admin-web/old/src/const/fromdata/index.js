import { formrules } from "@/util/form.js";
export const ContactFormData = [
    {
        label: "客户名称", //中文名称
        prop: "client_name", //属性唯一
        placeholder: "请输入客户名称", //描述文字
        formitemtype: "input", //是否是选择框
        rules: [{ required: true, message: "请填写", trigger: "blur" },
        { validator: formrules["repeatName"], trigger: "blur" }],
    },
    {
        label: "客户类型",
        prop: "client_type",
        placeholder: "请选择客户类型",
        selectArr: [],
        formitemtype: "select",
        rules: [{ required: true, message: "请选择", trigger: "blur" }],
    },
    {
        label: "客户等级",
        prop: "client_level",
        placeholder: "请选择客户等级",
        selectArr: [],
        formitemtype: "select",
        rules: [{ required: false, message: "请选择", trigger: "blur" }],
    },
    {
        label: "客户区域",
        prop: "client_district",
        placeholder: "请选择客户区域",
        selectArr: [],
        formitemtype: "select",
        rules: [
            { required: false, message: "请选择", trigger: "blur" },
        ],
    },
]
export const ContacterFormData = [
    {
        label: "联系人", //中文名称
        prop: "name", //属性唯一
        placeholder: "请输入联系人", //描述文字
        formitemtype: "input", //是否是选择框
        rules: [
            { required: true, message: "请填写", trigger: "blur" },
        ],
    },
    {
        label: "电话",
        prop: "phone",
        placeholder: "请输入电话",
        formitemtype: "input",
        rules: [
            { required: true, message: "请填写", trigger: "blur" },
        ],
    },
    {
        label: "所属机构",
        prop: "company",
        placeholder: "请输入所属机构",
        formitemtype: "input",
        rules: [
            { required: false, message: "请填写", trigger: "blur" },
        ],
    },
    {
        label: "职务",
        prop: "position",
        placeholder: "请输入职务",
        formitemtype: "input",
        rules: [
            { required: false, message: "请填写", trigger: "blur" },
        ],
    },
    {
        label: "邮箱",
        prop: "email",
        placeholder: "请输入邮箱",
        formitemtype: "input",
        rules: [
            { required: false, message: "请填写", trigger: "blur" },
        ],
    },
]
export const ContactDemand = [
    {
        label: "客户需求名称",
        prop: "email",
        placeholder: "请输入客户需求名称",
        formitemtype: "input",
        rules: [
            { required: true, message: "请填写", trigger: "blur" },
        ],
    },
    {
        label: "需求类型",
        prop: "email",
        placeholder: "请选择需求类型",
        formitemtype: "select",
        rules: [
            { required: true, message: "请选择", trigger: "blur" },
        ],
    },

]
export const ContactTeare = {
    label: "客户需求详情",
    prop: "email",
    placeholder: "请输入客户需求详情",
    rules: [
        { required: false, message: "请填写", trigger: "blur" },
    ],
}
export const Clue = [
    {
        label: "业务类型",
        prop: "bussiness_type",
        placeholder: "请选择业务类型",
        formitemtype: "select",
        rules: [
            { required: true, message: "请选择", trigger: "blur" },
        ],
    },
    {
        label: "线索质量",
        prop: "clue_quality",
        placeholder: "请选择线索质量",
        formitemtype: "select",
        rules: [
            { required: true, message: "请选择", trigger: "blur" },
        ],
    },
    {
        label: "业务需求名称",
        prop: "name",
        placeholder: "请输入业务需求名称",
        formitemtype: "input",
        rules: [
            { required: true, message: "请填写", trigger: "blur" },
        ],
    },

]
export const ClueTeare = {
    label: "业务需求详情",
    prop: "description",
    placeholder: "请输入业务需求详情",
    rules: [
        { required: true, message: "请填写", trigger: "blur" },
    ],
}
export const Source = [
    {
        label: "来源部门",
        prop: "source_dept",
        placeholder: "请选择业务类型",
        formitemtype: "select",
        rules: [
            { required: true, message: "请选择", trigger: "blur" },
        ],
    },
    {
        label: "来源方式",
        prop: "source_way",
        placeholder: "请选择来源方式",
        formitemtype: "select",
        rules: [
            { required: true, message: "请选择", trigger: "blur" },
        ],
    },
    {
        label: "来源渠道",
        prop: "channel",
        placeholder: "请选择来源渠道",
        formitemtype: "input",
        rules: [
            { required: false, message: "请填写", trigger: "blur" },
        ],
    },

]
export const FinancialForm = [
    {
        label: "税号",
        prop: "taxSn",
        placeholder: "请输入税号",
        formitemtype: "input",
        rules: [
            { required: true, message: "请填写", trigger: "blur" },
        ],
    },
    {
        label: "发票抬头",
        prop: "invoiceTitle",
        placeholder: "请输入发票抬头",
        formitemtype: "input",
        rules: [
            { required: true, message: "请填写", trigger: "blur" },
        ],
    },
    {
        label: "开户银行",
        prop: "depositBank",
        placeholder: "请输入开户银行",
        formitemtype: "input",
        rules: [
            { required: true, message: "请填写", trigger: "blur" },
        ],
    },
    {
        label: "银行账号",
        prop: "depositBankAccount",
        placeholder: "请输入银行账号",
        formitemtype: "input",
        rules: [
            { required: true, message: "请填写", trigger: "blur" },
        ],
    },
    {
        label: "电话号码",
        prop: "invoicePhone",
        placeholder: "请输入电话号码",
        formitemtype: "input",
        rules: [
            { required: true, message: "请填写", trigger: "blur" },
        ],
    },
    {
        label: "单位地址",
        prop: "invoiceSite",
        placeholder: "单位地址",
        formitemtype: "input",
        rules: [
            { required: true, message: "请填写", trigger: "blur" },
        ],
    },

]
export const Contract = [
    {
        label: "合同名称",
        prop: "contractName",
        placeholder: "请输入合同名称",
        formitemtype: "input",
        rules: [
            { required: true, message: "请填写", trigger: "blur" },
        ],
    },
    {
        label: "合同模板",
        prop: "contract_type",
        placeholder: "请选择合同模板",
        formitemtype: "select",
        rules: [
            { required: true, message: "请选择", trigger: "blur" },
        ],
    },
    {
        label: "签约金额(元)",
        prop: "contracAmount",
        placeholder: "请输入签约金额(元)",
        formitemtype: "input",
        rules: [
            { required: true, message: "请填写", trigger: "blur" },
        ],
    },

]
export const OpportunityForm = [
    {
        label: "商机名称",
        prop: "name",
        placeholder: "请输入合同名称",
        formitemtype: "input",
        rules: [
            { required: true, message: "请填写", trigger: "blur" },
        ],
    },
    {
        label: "跟进人/跟进团队",
        prop: "contract_quota",
        placeholder: "请选择跟进人/跟进团队",
        formitemtype: "select",
        rules: [
            { required: true, message: "请选择", trigger: "blur" },
        ],
    },
    {
        label: "协作人/协作团队",
        prop: "amount",
        placeholder: "请选择协作人/协作团队",
        formitemtype: "input",
        rules: [
            { required: true, message: "请填写", trigger: "blur" },
        ],
    },
    {
        label: "预签金额",
        prop: "amount",
        placeholder: "请输入预签金额",
        formitemtype: "input",
        rules: [
            { required: true, message: "请填写", trigger: "blur" },
        ],
    },
    {
        label: "商机级别",
        prop: "opportunity_level",
        placeholder: "请选择商机级别",
        formitemtype: "input",
        rules: [
            { required: true, message: "请选择", trigger: "blur" },
        ],
    },
    {
        label: "预计到期时间",
        prop: "amount",
        placeholder: "请选择预计到期时间",
        formitemtype: "date",
        rules: [
            { required: true, message: "请选择", trigger: "blur" },
        ],
    },

]
export function filterRlues(data) {
    let rules = {}
    data.map(item => {
        rules[item.prop] = item.rules
    })
    return rules
}
export function rulesAll() {
    let obj = {}
    obj = {
        ...obj,
        ...filterRlues(ContactFormData),
        ...filterRlues(ContacterFormData),
        ...filterRlues(ContactDemand),
        ...filterRlues(Clue),
        ...filterRlues(Source),
        ...filterRlues(FinancialForm),
        ...filterRlues(Contract),
        ...ContactTeare,
        ...ClueTeare,
    }
    return obj
}

