import { rule } from "@/util/validateRules.js";
export const formlist = [
  {
    name: "单文本",
    type: "input",
    icon: "el-icon-tickets",
    outerType: "base",
    attribute: {
      outerType: "base",
      type: "input",
      label: "单文本", //标签(字段显示名)
      labelVisible: 1, //标签是否显示
      readonly: false, //是否只读
      required: false, //是否必填
      //附加属性
      properties: {
        placeholder: "请输入", //占位文本
        ciphertext: false, //是否明文显示
      },
    },
  },
  {
    name: "多文本",
    type: "textarea",
    icon: "el-icon-document-copy",
    outerType: "base",
    attribute: {
      outerType: "base",
      type: "textarea",
      label: "多文本",
      readonly: false,
      required: false,
      properties: {
        placeholder: "请输入",
        text_num_line: 5, //显示行数
        text_num_column: 100, //最大显示字数
      },
    },
  },
  {
    name: "单选框",
    type: "radio",
    icon: "el-icon-circle-check",
    outerType: "base",
    attribute: {
      outerType: "base",
      label: "单选框",
      type: "radio",
      disabled: false, //是否禁用
      required: false, //是否必填
      readonly: false, //是否只读
      properties: {
        option_default: "", //默认选项
        option: [
          {
            label: "选项一",
            id: -1,
            isHidden: false,
          },
          {
            label: "选项二",
            id: -2,
            isHidden: false,
          },
        ], //字典配置
      },
    },
  },
  {
    name: "多选框",
    type: "checkbox",
    icon: "el-icon-circle-check",
    outerType: "base",
    attribute: {
      outerType: "base",
      label: "多选框",
      type: "checkbox",
      disabled: false, //是否禁用
      required: false, //是否必填
      readonly: false, //是否只读

      properties: {
        option_default: [], //默认选项
        option: [
          {
            label: "选项一",
            id: -1,
            isHidden: false,
          },
          {
            label: "选项二",
            id: -2,
            isHidden: false,
          },
        ], //字典配置
        // option_min: '', //最小数量
        // option_max: '', //最大数量
      },
    },
  },
  {
    name: "下拉选框",
    type: "select",
    icon: "el-icon-circle-check",
    outerType: "base",
    attribute: {
      outerType: "base",
      label: "下拉选框",
      type: "select",
      disabled: false, //是否禁用
      required: false, //是否必填
      readonly: false, //是否只读
      properties: {
        option_multi: false, //是否多选
        placeholder: "请选择",
        searchable: false,
        option_default: [], //默认选项
        option: [
          {
            label: "选项一",
            id: -1,
            isHidden: false,
          },
          {
            label: "选项二",
            id: -2,
            isHidden: false,
          },
        ], //字典配置
        // option_min: 0, //最小数量
        // option_max: null, //最大数量
      },
    },
  },
  {
    name: "时间选择",
    type: "time",
    icon: "el-icon-time",
    outerType: "base",
    attribute: {
      outerType: "base",
      label: "日期选择",
      type: "datetimepicker",
      required: false, //是否必填
      readonly: false, //是否只读
      datetime_type: "date",
      properties: {
        placeholder: "请选择",
        // datetime_default: '', //默认时间
        // datetime_begin: '', //默认可选起始时间
        // datetime_end: '', //默认可选结束时间
        datetime_pattern: "yyyy-MM-dd", //格式
        datetime_type: "date", //默认日期时间选择
      },
    },
  },
  {
    name: "上传",
    type: "upload",
    icon: "el-icon-upload2",
    outerType: "base",
    attribute: {
      outerType: "base",
      label: "上传",
      type: "upload",
      disabled: false, //是否禁用
      require: false, //是否必填
      readonly: false, //是否只读
      properties: {
        placeholder: "请上传",
        // upload_url: "",
        upload_num: 1,
        upload_size_min: 1,
        upload_size_max: 10,
        // upload_size_total: 1024,
        upload_file_type: "image/*",
      },
    },
  },
  {
    name: "意向校区",
    type: "select",
    icon: "el-icon-circle-check",
    outerType: "school",
    attribute: {
      outerType: "school",
      label: "意向校区",
      type: "select",
      disabled: false, //是否禁用
      required: false, //是否必填
      readonly: false, //是否只读
      mark: "applyschool",
      properties: {
        option_multi: false, //是否多选
        placeholder: "请选择",
        searchable: false,
        option_default: [], //默认选项
        option: [
          {
            label: "选项一",
            id: -1,
            value: -1,
          },
          {
            label: "选项二",
            id: -2,
            value: -2,
          },
        ],
      },
    },
  },
  {
    name: "签名",
    type: "sign",
    icon: "el-icon-upload2",
    outerType: "base",
    attribute: {
      outerType: "base",
      label: "签名",
      type: "sign",
      disabled: false, //是否禁用
      require: false, //是否必填
      readonly: false, //是否只读
      properties: {
        placeholder: "请签名",
        // upload_url: "",
        upload_num: 1,
        upload_size_min: 1,
        upload_size_max: 10,
        // upload_size_total: 1024,
        upload_file_type: "image/*",
      },
    },
  },
  {
    name: "Banner",
    type: "banner",
    icon: "el-icon-circle-check",
    outerType: "base",
    attribute: {
      outerType: "base",
      label: "Banner",
      type: "banner",
      disabled: false, //是否禁用
      required: false, //是否必填
      readonly: false, //是否只读
      properties: {
        option_default: "", //默认选项
        option: [], //字典配置
      },
    },
  },
  {
    name: "协议",
    type: "protocol",
    icon: "el-icon-circle-check",
    outerType: "base",
    attribute: {
      outerType: "base",
      label: "协议",
      type: "protocol",
      disabled: false, //是否禁用
      required: true, //是否必填
      readonly: false, //是否只读
      properties: {
        option_default: "", //默认选项
        option: [], //字典配置
      },
    },
  },
  {
    name: "手机号",
    type: "autoFill",
    icon: "el-icon-circle-check",
    outerType: "base",
    attribute: {
      outerType: "base",
      label: "手机号",
      type: "autoFill",
      disabled: false, //是否禁用
      required: false, //是否必填
      readonly: false, //是否只读
      properties: {
        placeholder: "请选择",
      },
    },
  },
  {
    name: "标题",
    type: "title",
    icon: "el-icon-tickets",
    outerType: "base",
    attribute: {
      outerType: "base",
      type: "title",
      label: "标题", //标签(字段显示名)
      labelVisible: 1, //标签是否显示
      readonly: true, //是否只读
      required: false, //是否必填
      //附加属性
      properties: {
        // placeholder: "请选择", //占位文本
        // ciphertext: false, //是否明文显示
      },
    },
  },
  {
    name: "国籍",
    type: "nationality",
    icon: "el-icon-tickets",
    outerType: "base",
    attribute: {
      outerType: "base",
      type: "nationality",
      label: "国籍", //标签(字段显示名)
      labelVisible: 1, //标签是否显示
      readonly: true, //是否只读
      required: false, //是否必填
      //附加属性
      properties: {
        placeholder: "请选择", //占位文本
        // ciphertext: false, //是否明文显示
      },
    },
  },
  {
    name: "语言",
    type: "language",
    icon: "el-icon-tickets",
    outerType: "base",
    attribute: {
      outerType: "base",
      type: "language",
      label: "语言", //标签(字段显示名)
      labelVisible: 1, //标签是否显示
      readonly: true, //是否只读
      required: false, //是否必填
      //附加属性
      properties: {
        placeholder: "请选择", //占位文本
        // ciphertext: false, //是否明文显示
      },
    },
  },
  {
    name: "地区",
    type: "region",
    icon: "el-icon-tickets",
    outerType: "base",
    attribute: {
      outerType: "base",
      type: "region",
      label: "地区", //标签(字段显示名)
      labelVisible: 1, //标签是否显示
      readonly: true, //是否只读
      required: false, //是否必填
      //附加属性
      properties: {
        placeholder: "请选择", //占位文本
        // ciphertext: false, //是否明文显示
      },
    },
  },
  {
    name: "其他监护人",
    type: "guardian",
    icon: "el-icon-tickets",
    outerType: "base",
    attribute: {
      outerType: "base",
      type: "guardian",
      label: "其他监护人", //标签(字段显示名)
      labelVisible: 1, //标签是否显示
      readonly: false, //是否只读
      required: false, //是否必填
      //附加属性
      properties: {},
    },
  },
];
export const dateTimeType = [
  // 年选择器
  {
    name: "年",
    type: "year",
    format: "yyyy",
    datetime_type: "year",
    default: "",
    isArr: false,
  },
  // 月选择器
  {
    name: "月",
    type: "month",
    format: "yyyy-MM",
    datetime_type: "month",
    default: "",
    isArr: false,
  },
  // // 周选择器
  // {
  //   name: "周",
  //   type: "week",
  //   format: "yyyy 第 WW 周"
  // },
  // 日期选择器
  {
    name: "日期",
    type: "date",
    format: "yyyy-MM-dd",
    datetime_type: "date",
    default: "",
    isArr: false,
  },
  // 日期时间选择器
  {
    name: "日期时间",
    type: "datetime",
    format: "yyyy-MM-dd HH:mm",
    datetime_type: "datetime",
    default: "",
    isArr: false,
  },
  // 日期范围选择器
  {
    name: "日期范围",
    type: "daterange",
    format: "yyyy-MM-dd HH:mm",
    datetime_type: "date_range",
    default: [],
    isArr: true,
  },
  // 月范围选择器
  {
    name: "月范围",
    type: "monthrange",
    format: "yyyy-MM",
    datetime_type: "month_range",
    default: [],
    isArr: true,
  },
  // 时间日期范围选择器
  {
    name: "日期时间范围",
    type: "datetimerange",
    format: "yyyy-MM-dd HH:mm",
    datetime_type: "datetime_range",
    default: [],
    isArr: true,
  },
];
export const uploadAccept = [
  {
    id: "1",
    name: "图片",
    type: "image/*",
    list: ".png/.jpg/.jpeg/.etc",
    contentType: "image/png,image/jpg,image/jpeg,image/etc",
  },
  // {
  // 	id: "2",
  // 	name: "视频",
  // 	type: "video/*",
  // 	list: '.avi/.mpg/.mpeg/.mp4',
  // 	contentType: "video/mp4,video/mpg,video/mpeg,video/avi"
  // },
  // {
  //   id: "3",
  //   name: "音频",
  //   type: "audio/*",
  //   list: '.mp3/.wav/.etc'
  // },
  {
    id: "4",
    name: "文件",
    type: "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/msword,application/pdf,text/plain",
    list: ".xls/.xlsx/.ppt/.doc/.pdf/.txt",
    contentType:
      "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/msword,application/pdf,text/plain",
  },
  {
    id: "5",
    name: "文件和图片",
    type: "image/*,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/msword,application/pdf,text/plain",
    list: "文件/图片",
    contentType:
      "image/png,image/jpg,image/jpeg,image/etc/application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/msword,application/pdf,text/plain",
  },
];
// 基础字段的校验
export let setformrules = {
  label: [
    {
      required: true,
      message: "请输入",
      trigger: "blur",
    },
    // {
    //   validator: rule.validatorNameCn,
    //   trigger: "blur",
    // },
  ],
  //显示行数
  text_num_line: [
    {
      pattern: "^(0|-?[1-9]\\d*)$",
      message: "请输入整数",
      trigger: "blur",
    },
  ],
  //最大显示字数
  text_num_column: [
    {
      pattern: "^(0|-?[1-9]\\d*)$",
      message: "请输入整数",
      trigger: "blur",
    },
  ],
  //最小数量
  option_min: [
    {
      pattern: "^(0|-?[1-9]\\d*)$",
      message: "请输入整数",
      trigger: "blur",
    },
  ],
  //最大数量
  option_max: [
    {
      pattern: "^(0|-?[1-9]\\d*)$",
      message: "请输入整数",
      trigger: "blur",
    },
  ],
  //最小上传数量
  upload_num: [
    {
      pattern: "^(0|-?[1-9]\\d*)$",
      message: "请输入整数",
      trigger: "blur",
    },
  ],
};
