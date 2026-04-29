<script setup lang="ts">
import { ref } from "vue";

import type { UniFormConfig } from "@/types/shared";

import codeActionMin from "../.vitepress/snippets/uni-search-form/action-min-span.vue?raw";
import codeBasic from "../.vitepress/snippets/uni-search-form/basic.vue?raw";
import codeCollapse from "../.vitepress/snippets/uni-search-form/collapse.vue?raw";
import codeCollapsedRows2 from "../.vitepress/snippets/uni-search-form/collapsed-rows-2.vue?raw";
import codeLabels from "../.vitepress/snippets/uni-search-form/labels.vue?raw";
import codeNoLabel from "../.vitepress/snippets/uni-search-form/no-label.vue?raw";
import codeSlot from "../.vitepress/snippets/uni-search-form/slot-actions.vue?raw";

const queryBasic = ref<Record<string, unknown>>({
  keyword: "",
  status: "",
});

const searchConfigBasic: UniFormConfig = {
  formProps: { labelWidth: "auto" },
  schema: [
    {
      field: "keyword",
      label: "关键词",
      component: "ElInput",
      componentProps: { placeholder: "请输入", clearable: true },
      colProps: { span: 6 },
    },
    {
      field: "status",
      label: "状态",
      component: "ElSelect",
      options: [
        { label: "启用", value: "1" },
        { label: "停用", value: "0" },
      ],
      componentProps: { clearable: true, placeholder: "全部" },
      colProps: { span: 6 },
    },
    {
      field: "createdAt",
      label: "创建时间",
      component: "ElDatePicker",
      componentProps: {
        type: "daterange",
        startPlaceholder: "开始",
        endPlaceholder: "结束",
        valueFormat: "YYYY-MM-DD",
      },
      colProps: { span: 8 },
    },
  ],
  colProps: { span: 6 },
};

function loadList() {
  console.info("[docs] search", queryBasic.value);
}

const queryCollapse = ref<Record<string, unknown>>({
  a: "",
  b: "",
  c: "",
  d: "",
  e: "",
});

const searchConfigCollapse: UniFormConfig = {
  formProps: { labelWidth: "auto" },
  schema: [
    { field: "a", label: "条件一", component: "ElInput", colProps: { span: 6 } },
    { field: "b", label: "条件二", component: "ElInput", colProps: { span: 6 } },
    { field: "c", label: "条件三", component: "ElInput", colProps: { span: 6 } },
    { field: "d", label: "条件四", component: "ElInput", colProps: { span: 6 } },
    { field: "e", label: "条件五", component: "ElInput", colProps: { span: 6 } },
  ],
  colProps: { span: 6 },
  rowProps: { gutter: 12 },
};

const queryLabel = ref<Record<string, unknown>>({ name: "" });
const searchConfigLabel: UniFormConfig = {
  formProps: { labelWidth: "auto" },
  schema: [
    {
      field: "name",
      label: "名称",
      component: "ElInput",
      componentProps: { clearable: true },
      colProps: { span: 8 },
    },
  ],
  colProps: { span: 8 },
};

const queryActionMin = ref<Record<string, unknown>>({});
const searchConfigActionMin: UniFormConfig = {
  formProps: { labelWidth: "auto" },
  schema: [
    { field: "a", label: "A", component: "ElInput", colProps: { span: 6 } },
    { field: "b", label: "B", component: "ElInput", colProps: { span: 6 } },
    { field: "c", label: "C", component: "ElInput", colProps: { span: 6 } },
    { field: "d", label: "D", component: "ElInput", colProps: { span: 6 } },
  ],
  colProps: { span: 6 },
};

const queryRows2 = ref<Record<string, unknown>>({});
const searchConfigRows2: UniFormConfig = {
  formProps: { labelWidth: "auto" },
  schema: Array.from({ length: 8 }).map((_, i) => ({
    field: `r${i}`,
    label: `条件 ${i + 1}`,
    component: "ElInput" as const,
    colProps: { span: 6 },
  })),
  colProps: { span: 6 },
};

const queryNoLabel = ref<Record<string, unknown>>({
  keyword: "",
  status: "",
});

const searchConfigNoLabel: UniFormConfig = {
  schema: [
    {
      field: "keyword",
      label: "",
      component: "ElInput",
      componentProps: {
        placeholder: "关键词",
        clearable: true,
      },
      colProps: { span: 8 },
    },
    {
      field: "status",
      label: "",
      component: "ElSelect",
      options: [
        { label: "启用", value: "1" },
        { label: "停用", value: "0" },
      ],
      componentProps: {
        clearable: true,
        placeholder: "状态",
      },
      colProps: { span: 6 },
    },
  ],
  colProps: { span: 6 },
  rowProps: { gutter: 12 },
};
</script>

# UniSearchForm

查询表单组件，基于 `UniForm` 的 `config.schema` 渲染字段，并内置查询、重置、展开收起与 `@search` 事件。表单模型与 `UniForm` 一致，为「单对象 + schema」。

组件内部会为 `config.formProps` 合并默认值 **`labelWidth: '0px'`**（不展示左侧标签列，适合 placeholder 驱动的紧凑检索栏）。需要展示字段 `label` 时，在 `config.formProps` 中设置 `labelWidth`（如 `'auto'`、`'80px'`）覆盖即可。

## `config` 与 `UniForm` 一致

字段结构为 `UniFormField[]`，详见 **UniForm** 文档与源码类型 `UniFormConfig` / `UniFormField`。

---

## 基础查询

<CompDemo title="常用筛选：输入、下拉、日期范围" :code="codeBasic">
  <UniSearchForm
    v-model="queryBasic"
    :config="searchConfigBasic"
    @search="loadList"
  />
</CompDemo>

## 紧凑检索栏（默认无左侧 Label）

组件已默认 `labelWidth: '0px'`。字段将 `label` 置空，用 **`placeholder`**（及下拉占位）表达含义即可；若某一列需单独标签宽度，可在该字段 `formItemProps` 上覆盖 `labelWidth`。

<CompDemo title="placeholder 驱动（与默认行为一致）" :code="codeNoLabel">
  <UniSearchForm
    v-model="queryNoLabel"
    :config="searchConfigNoLabel"
    @search="() => {}"
  />
</CompDemo>

## 多字段与折叠

当 schema 总栅格宽度超过 `collapsedRows` 换算出的可视区域时，出现「展开 / 收起」。

<CompDemo title="五个条件触发折叠（collapsedRows=1）" :code="codeCollapse">
  <UniSearchForm
    v-model="queryCollapse"
    :config="searchConfigCollapse"
    :collapsed-rows="1"
    @search="() => {}"
  />
</CompDemo>

## 自定义按钮文案

<CompDemo title="submit-text / reset-text" :code="codeLabels">
  <UniSearchForm
    v-model="queryLabel"
    :config="searchConfigLabel"
    submit-text="筛选"
    reset-text="清空"
    @search="() => {}"
  />
</CompDemo>

## 自定义操作区插槽

<CompDemo title="插槽 #actions" :code="codeSlot">
  <UniSearchForm v-model="queryLabel" :config="searchConfigLabel">
    <template #actions="{ search, reset }">
      <el-button type="primary" @click="search">立即搜索</el-button>
      <el-button @click="reset">清空条件</el-button>
    </template>
  </UniSearchForm>
</CompDemo>

## actionMinSpan：右侧操作区更宽

增大后左侧可用栅格变少，更容易出现折叠（与 `collapsedRows` 共同作用）。

<CompDemo title="action-min-span=10" :code="codeActionMin">
  <UniSearchForm
    v-model="queryActionMin"
    :config="searchConfigActionMin"
    :action-min-span="10"
    :collapsed-rows="1"
    @search="() => {}"
  />
</CompDemo>

## collapsedRows：收起时保留多行

<CompDemo title="collapsed-rows=2（约两行后再折叠）" :code="codeCollapsedRows2">
  <UniSearchForm
    v-model="queryRows2"
    :config="searchConfigRows2"
    :collapsed-rows="2"
    @search="() => {}"
  />
</CompDemo>

## Props

| 属性               | 说明                                         | 类型                      | 默认值 |
| ------------------ | -------------------------------------------- | ------------------------- | ------ |
| `modelValue`       | 查询条件对象（`v-model`）                    | `Record<string, unknown>` | —      |
| `config`           | 表单配置，字段定义见 `UniFormConfig`         | `UniFormConfig`           | —      |
| `collapsed`        | 是否收起（字段过多时与内部折叠联动）         | `boolean`                 | —      |
| `collapsedRows`    | 收起时最多展示「几行」栅格高度（24 栅格/行） | `number`                  | `1`    |
| `actionMinSpan`    | 右侧操作区预留栅格宽度                       | `number`                  | `6`    |
| `showSelectedTags` | 预留属性，当前模板未接入 UI                  | `boolean`                 | —      |
| `submitText`       | 主按钮文案                                   | `string`                  | `查询` |
| `resetText`        | 重置按钮文案                                 | `string`                  | `重置` |

## Events

| 事件名              | 说明                                           | 参数                      |
| ------------------- | ---------------------------------------------- | ------------------------- |
| `update:modelValue` | 条件变更                                       | `Record<string, unknown>` |
| `search`            | 点击查询                                       | 当前 `modelValue`         |
| `reset`             | 点击重置（内部已清空模型，事件用于刷新列表等） | —                         |
| `update:collapsed`  | 展开/收起切换                                  | `boolean`                 |
| `field-change`      | 单字段变更透传自 `UniForm`                     | `{ field, value, model }` |

## Slots

| 插槽      | 说明                                                                                        |
| --------- | ------------------------------------------------------------------------------------------- |
| `actions` | 自定义操作区，作用域参数：`search`、`reset`、`collapsed`、`needCollapse`、`toggleCollapsed` |
