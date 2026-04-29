<template>
  <UniForm v-model="formModel" :config="formConfig" />
</template>

<script setup lang="ts">
import type { UploadRequestOptions } from "element-plus";
import { ref } from "vue";
import type { UniFormConfig } from "uni-ui-lib";

const cascaderOptions = [
  {
    value: "zj",
    label: "浙江",
    children: [
      { value: "hz", label: "杭州" },
      { value: "nb", label: "宁波" },
    ],
  },
  {
    value: "js",
    label: "江苏",
    children: [
      { value: "nj", label: "南京" },
      { value: "sz", label: "苏州" },
    ],
  },
];

const treeSelectData = [
  {
    value: "dept-1",
    label: "研发部",
    children: [
      { value: "dept-1-1", label: "前端组" },
      { value: "dept-1-2", label: "后端组" },
    ],
  },
  { value: "dept-2", label: "市场部" },
];

const formModel = ref<Record<string, unknown>>({
  inputText: "",
  inputPassword: "",
  inputTextarea: "",
  selectSingle: "",
  radioSingle: "opt1",
  checkboxMulti: ["c1"],
  inputNumber: 0,
  switchVal: false,
  dateSingle: "",
  datetimeSingle: "",
  timeSingle: "",
  dateRange: [],
  cascaderVal: [],
  treeSelectVal: "",
  uploadFiles: [],
});

const formConfig: UniFormConfig = {
  rowProps: { gutter: 16 },
  colProps: { xs: 24, sm: 12, md: 8 },
  sections: [
    {
      title: "文本（ElInput）",
      description: "单行 / 密码 / 多行；字段级 colProps 覆盖默认栅格",
      fields: ["inputText", "inputPassword", "inputTextarea"],
    },
    {
      title: "选择与枚举",
      fields: ["selectSingle", "radioSingle", "checkboxMulti"],
    },
    {
      title: "数字与开关",
      fields: ["inputNumber", "switchVal"],
    },
    {
      title: "日期与时间（ElDatePicker / ElTimePicker）",
      fields: ["dateSingle", "datetimeSingle", "timeSingle", "dateRange"],
    },
    {
      title: "级联与树（ElCascader / ElTreeSelect）",
      fields: ["cascaderVal", "treeSelectVal"],
    },
    {
      title: "上传（UniUpload）",
      fields: ["uploadFiles"],
    },
  ],
  schema: [
    {
      field: "inputText",
      label: "单行文本",
      component: "ElInput",
      componentProps: { placeholder: "ElInput", clearable: true },
      colProps: { xs: 24, sm: 12, md: 8 },
    },
    {
      field: "inputPassword",
      label: "密码",
      component: "ElInput",
      componentProps: {
        type: "password",
        placeholder: "ElInput type=password",
        showPassword: true,
        clearable: true,
      },
      colProps: { xs: 24, sm: 12, md: 8 },
    },
    {
      field: "inputTextarea",
      label: "多行文本",
      component: "ElInput",
      componentProps: {
        type: "textarea",
        rows: 2,
        placeholder: "textarea",
      },
      colProps: { xs: 24, sm: 12, md: 8 },
    },
    {
      field: "selectSingle",
      label: "下拉",
      component: "ElSelect",
      options: [
        { label: "选项 A", value: "a" },
        { label: "选项 B", value: "b" },
        { label: "选项 C", value: "c" },
      ],
      componentProps: {
        placeholder: "ElSelect",
        clearable: true,
        style: { width: "100%" },
      },
      colProps: { xs: 24, sm: 12, md: 8 },
    },
    {
      field: "radioSingle",
      label: "单选组",
      component: "ElRadioGroup",
      options: [
        { label: "方案一", value: "opt1" },
        { label: "方案二", value: "opt2" },
      ],
      colProps: { xs: 24, sm: 12, md: 8 },
    },
    {
      field: "checkboxMulti",
      label: "多选组",
      component: "ElCheckboxGroup",
      options: [
        { label: "标签一", value: "c1" },
        { label: "标签二", value: "c2" },
        { label: "标签三", value: "c3" },
      ],
      colProps: { xs: 24, sm: 12, md: 8 },
    },
    {
      field: "inputNumber",
      label: "数字",
      component: "ElInputNumber",
      componentProps: { min: 0, max: 9999, controlsPosition: "right", style: { width: "100%" } },
      colProps: { xs: 24, sm: 12, md: 8 },
    },
    {
      field: "switchVal",
      label: "开关",
      component: "ElSwitch",
      componentProps: { activeText: "开", inactiveText: "关" },
      colProps: { xs: 24, sm: 12, md: 8 },
    },
    {
      field: "dateSingle",
      label: "日期",
      component: "ElDatePicker",
      componentProps: {
        type: "date",
        valueFormat: "YYYY-MM-DD",
        placeholder: "ElDatePicker date",
        style: { width: "100%" },
      },
      colProps: { xs: 24, sm: 12, md: 8 },
    },
    {
      field: "datetimeSingle",
      label: "日期时间",
      component: "ElDatePicker",
      componentProps: {
        type: "datetime",
        valueFormat: "YYYY-MM-DD HH:mm:ss",
        placeholder: "datetime",
        style: { width: "100%" },
      },
      colProps: { xs: 24, sm: 12, md: 8 },
    },
    {
      field: "timeSingle",
      label: "时间",
      component: "ElTimePicker",
      componentProps: {
        valueFormat: "HH:mm:ss",
        placeholder: "ElTimePicker",
        style: { width: "100%" },
      },
      colProps: { xs: 24, sm: 12, md: 8 },
    },
    {
      field: "dateRange",
      label: "日期范围",
      component: "ElDatePicker",
      componentProps: {
        type: "daterange",
        startPlaceholder: "开始",
        endPlaceholder: "结束",
        valueFormat: "YYYY-MM-DD",
        style: { width: "100%" },
      },
      colProps: { xs: 24, md: 12 },
    },
    {
      field: "cascaderVal",
      label: "级联",
      component: "ElCascader",
      componentProps: {
        options: cascaderOptions,
        placeholder: "ElCascader",
        clearable: true,
        style: { width: "100%" },
      },
      colProps: { xs: 24, sm: 12, md: 8 },
    },
    {
      field: "treeSelectVal",
      label: "树选择",
      component: "ElTreeSelect",
      componentProps: {
        data: treeSelectData,
        placeholder: "ElTreeSelect",
        clearable: true,
        style: { width: "100%" },
      },
      colProps: { xs: 24, sm: 12, md: 8 },
    },
    {
      field: "uploadFiles",
      label: "附件",
      component: "UniUpload",
      componentProps: {
        listType: "text",
        limit: 3,
        request: (options: UploadRequestOptions) => {
          const file = options.file;
          setTimeout(() => {
            options.onSuccess?.({ url: URL.createObjectURL(file) } as never);
          }, 120);
        },
      },
      colProps: { xs: 24, md: 12 },
    },
  ],
};
</script>
