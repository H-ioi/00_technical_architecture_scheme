<script setup lang="ts">
import { ref } from "vue";

import type { UniFormConfig } from "@/types/shared";

import codeActions from "../.vitepress/snippets/uni-form/actions-slot.vue?raw";
import codeAllInputsGrid from "../.vitepress/snippets/uni-form/all-inputs-grid.vue?raw";
import AllInputsGridDemo from "../.vitepress/snippets/uni-form/all-inputs-grid.vue";
import codeBasic from "../.vitepress/snippets/uni-form/basic.vue?raw";
import codeDynamicActions from "../.vitepress/snippets/uni-form/dynamic-actions.vue?raw";
import codeFieldSlot from "../.vitepress/snippets/uni-form/field-slot.vue?raw";
import codeLinkage from "../.vitepress/snippets/uni-form/linkage-visible.vue?raw";
import codeLoadOptions from "../.vitepress/snippets/uni-form/load-options.vue?raw";
import codeRadioNumber from "../.vitepress/snippets/uni-form/radio-number.vue?raw";
import codeReadonly from "../.vitepress/snippets/uni-form/readonly.vue?raw";
import codeRules from "../.vitepress/snippets/uni-form/rules-validate.vue?raw";
import codeSectionTitleSlot from "../.vitepress/snippets/uni-form/section-title-slot.vue?raw";
import codeSections from "../.vitepress/snippets/uni-form/sections.vue?raw";
import codeViewRender from "../.vitepress/snippets/uni-form/view-render.vue?raw";

const mode = ref<"edit" | "view">("edit");

const formModel = ref<Record<string, unknown>>({
  name: "",
  remark: "",
});

const formConfig: UniFormConfig = {
  schema: [
    {
      field: "name",
      label: "名称",
      component: "ElInput",
      componentProps: { placeholder: "请输入名称", maxlength: 50, showWordLimit: true },
      colProps: { span: 12 },
    },
    {
      field: "remark",
      label: "备注",
      component: "ElInput",
      componentProps: { type: "textarea", rows: 3, placeholder: "选填" },
      colProps: { span: 24 },
    },
  ],
  colProps: { span: 12 },
};

const formModelReadonly = ref<Record<string, unknown>>({ title: "只读示例" });
const formConfigReadonly: UniFormConfig = {
  disabled: true,
  schema: [
    {
      field: "title",
      label: "标题",
      component: "ElInput",
      colProps: { span: 24 },
    },
  ],
  colProps: { span: 12 },
};

const formModelView = ref<Record<string, unknown>>({
  name: "演示项目",
  status: 1,
  startedAt: "2026-04-29 10:00:00",
  remark: "",
});
const formConfigView: UniFormConfig = {
  view: { emptyText: "未填写" },
  schema: [
    { field: "name", label: "名称", component: "ElInput", colProps: { span: 12 } },
    {
      field: "status",
      label: "状态",
      component: "ElSelect",
      viewType: "enum",
      options: [
        { label: "启用", value: 1 },
        { label: "停用", value: 0 },
      ],
      colProps: { span: 12 },
    },
    {
      field: "startedAt",
      label: "开始时间",
      component: "ElDatePicker",
      viewType: "datetime",
      colProps: { span: 12 },
    },
    {
      field: "remark",
      label: "备注",
      component: "ElInput",
      viewRender: ({ value }) => (value ? `备注：${value}` : "暂无备注"),
      colProps: { span: 12 },
    },
  ],
  rowProps: { gutter: 12 },
  colProps: { span: 12 },
};

const formRefRules = ref<{ validate: () => Promise<boolean | undefined> } | null>(
  null,
);
const formModelRules = ref<Record<string, unknown>>({ email: "" });
const formConfigRules: UniFormConfig = {
  schema: [
    {
      field: "email",
      label: "邮箱",
      component: "ElInput",
      componentProps: { placeholder: "必填" },
      colProps: { span: 12 },
    },
  ],
  colProps: { span: 12 },
  rules: {
    email: [
      { required: true, message: "请输入邮箱", trigger: "blur" },
      { type: "email", message: "格式不正确", trigger: "blur" },
    ],
  },
};

async function submitRules() {
  await formRefRules.value?.validate();
}

const formModelSections = ref<Record<string, unknown>>({
  baseName: "",
  extCode: "",
});

const formConfigSections: UniFormConfig = {
  sections: [
    {
      title: "基础信息",
      description: "分组标题与说明文案来自 sections",
      fields: ["baseName"],
    },
    { title: "扩展", fields: ["extCode"] },
  ],
  schema: [
    {
      field: "baseName",
      label: "名称",
      component: "ElInput",
      colProps: { span: 12 },
    },
    {
      field: "extCode",
      label: "编码",
      component: "ElInput",
      colProps: { span: 12 },
    },
  ],
  colProps: { span: 12 },
};

const formModelSectionSlot = ref<Record<string, unknown>>({
  name: "",
  code: "",
});
const formConfigSectionSlot: UniFormConfig = {
  sections: [
    { title: "基础信息", description: "可用插槽替换默认标题", fields: ["name"] },
    { title: "扩展信息", fields: ["code"] },
  ],
  schema: [
    { field: "name", label: "名称", component: "ElInput", colProps: { span: 12 } },
    { field: "code", label: "编码", component: "ElInput", colProps: { span: 12 } },
  ],
  rowProps: { gutter: 12 },
  colProps: { span: 12 },
};

const formModelLinkage = ref<Record<string, unknown>>({
  showExtra: "no",
  extraNote: "",
});

const formConfigLinkage: UniFormConfig = {
  schema: [
    {
      field: "showExtra",
      label: "展示备注",
      component: "ElRadioGroup",
      options: [
        { label: "否", value: "no" },
        { label: "是", value: "yes" },
      ],
      colProps: { span: 24 },
    },
    {
      field: "extraNote",
      label: "备注",
      component: "ElInput",
      dependencies: ["showExtra"],
      visible: (ctx) => ctx.model.showExtra === "yes",
      componentProps: { type: "textarea", rows: 2 },
      colProps: { span: 24 },
    },
  ],
  colProps: { span: 12 },
};

const formModelDynamic = ref<Record<string, unknown>>({
  type: "normal",
  owner: "",
  reason: "",
});
const formConfigDynamic: UniFormConfig = {
  schema: [
    {
      field: "type",
      label: "类型",
      component: "ElSelect",
      options: [
        { label: "普通", value: "normal" },
        { label: "特殊", value: "special" },
      ],
      componentProps: { placeholder: "请选择类型" },
      colProps: { span: 12 },
      onChange: ({ value, actions }) => {
        actions.setDisabled("owner", value === "special");
        actions.setVisible("reason", value === "special");
        if (value === "special") {
          actions.setValue("reason", "特殊类型需填写原因");
        } else {
          actions.clearValue("reason");
        }
      },
    },
    {
      field: "owner",
      label: "负责人",
      component: "ElInput",
      componentProps: { placeholder: "特殊类型时禁用" },
      colProps: { span: 12 },
    },
    {
      field: "reason",
      label: "原因",
      component: "ElInput",
      visible: false,
      componentProps: { type: "textarea", rows: 2 },
      colProps: { span: 24 },
    },
  ],
  rowProps: { gutter: 12 },
  colProps: { span: 12 },
};

const formModelFieldSlot = ref<Record<string, unknown>>({ customSku: "" });
const formConfigFieldSlot: UniFormConfig = {
  schema: [
    {
      field: "customSku",
      label: "自定义列",
      component: "ElInput",
      colProps: { span: 24 },
    },
  ],
  colProps: { span: 12 },
};

const formModelActions = ref<Record<string, unknown>>({ note: "" });
const formConfigActions: UniFormConfig = {
  schema: [
    {
      field: "note",
      label: "备注",
      component: "ElInput",
      colProps: { span: 24 },
    },
  ],
  colProps: { span: 12 },
};

const formModelRadio = ref<Record<string, unknown>>({ level: 1, qty: 10 });
const formConfigRadio: UniFormConfig = {
  schema: [
    {
      field: "level",
      label: "等级",
      component: "ElRadioGroup",
      options: [
        { label: "低", value: 1 },
        { label: "中", value: 2 },
        { label: "高", value: 3 },
      ],
      colProps: { span: 24 },
    },
    {
      field: "qty",
      label: "数量",
      component: "ElInputNumber",
      componentProps: { min: 1, max: 999 },
      colProps: { span: 12 },
    },
  ],
  colProps: { span: 12 },
};

const formModelLoad = ref<Record<string, unknown>>({ city: "" });
const formConfigLoad: UniFormConfig = {
  schema: [
    {
      field: "city",
      label: "城市",
      component: "ElSelect",
      componentProps: { filterable: true, placeholder: "异步加载选项" },
      loadOptions: async () => {
        await new Promise((r) => setTimeout(r, 400));
        return [
          { label: "上海", value: "sh" },
          { label: "北京", value: "bj" },
        ];
      },
      colProps: { span: 12 },
    },
  ],
  colProps: { span: 12 },
};
</script>

# UniForm

动态表单编排组件，基于 Element Plus 表单原子组件，使用单一 `config` 对象初始化字段、分组、布局、联动和查看/编辑模式。

## `UniFormConfig` 要点

| 字段                    | 说明                                                                                    |
| ----------------------- | --------------------------------------------------------------------------------------- |
| `schema`                | `UniFormField[]`，每项含 `field`、`label`、`component`、`componentProps`、`colProps` 等 |
| `sections`              | 分组标题与字段分组                                                                      |
| `rules`                 | Element Plus 表单校验规则                                                               |
| `disabled` / `readonly` | 整表禁用或只读                                                                          |
| `mode`                  | 也可写在 `config.mode`，组件 `mode` 优先                                                |
| `view`                  | 查看态空值、冒号等展示配置                                                              |

字段联动可通过 `dependencies`、`visible`、`disabled`、`onChange` 及上下文里的 `actions` 完成；异步选项使用字段上的 `loadOptions`。

---

## 全类型输入与栅格

`config.rowProps` 传给 `el-row`（常用 `gutter` 列间距）；`config.colProps` 为整表默认列宽（与 Element Plus `Col` 一致，如 `xs` / `sm` / `md` / `span`）；单个字段可用 `colProps` 覆盖。UniForm 内置支持的 `component` 包括：`ElInput`、`ElInputNumber`、`ElSwitch`、`ElDatePicker`、`ElTimePicker`、`ElCascader`、`ElTreeSelect`、`ElSelect`、`ElRadioGroup`、`ElCheckboxGroup`、`UniUpload`。

<CompDemo title="全类型控件 + rowProps / colProps" :code="codeAllInputsGrid">
  <AllInputsGridDemo />
</CompDemo>

---

## 编辑 / 查看模式

<CompDemo title="mode：edit / view" :code="codeBasic">
  <el-radio-group v-model="mode" size="small" style="margin-bottom: 12px">
    <el-radio-button value="edit">编辑</el-radio-button>
    <el-radio-button value="view">查看</el-radio-button>
  </el-radio-group>
  <UniForm v-model="formModel" :config="formConfig" :mode="mode" />
</CompDemo>

## 整表禁用

<CompDemo title="config.disabled" :code="codeReadonly">
  <UniForm v-model="formModelReadonly" :config="formConfigReadonly" />
</CompDemo>

## 查看态格式化

查看态会优先使用字段上的 `viewRender`，其次可通过 `viewType` 复用枚举、日期等格式化逻辑；空值文案可在 `config.view.emptyText` 中统一配置。

<CompDemo title="mode=view + viewType / viewRender" :code="codeViewRender">
  <UniForm v-model="formModelView" :config="formConfigView" mode="view" />
</CompDemo>

## 分组 sections

<CompDemo title="sections 分组标题与字段归属" :code="codeSections">
  <UniForm v-model="formModelSections" :config="formConfigSections" />
</CompDemo>

## 自定义分组标题

默认分组标题只展示标题与描述；需要加图标、说明、操作按钮时可使用 `section-title` 插槽。

<CompDemo title="#section-title 自定义分组标题" :code="codeSectionTitleSlot">
  <UniForm v-model="formModelSectionSlot" :config="formConfigSectionSlot">
    <template #section-title="{ section }">
      <div style="display: flex; gap: 8px; align-items: center; margin: 12px 0">
        <strong>{{ section.title }}</strong>
        <span v-if="section.description" style="font-size: 12px; color: var(--vp-c-text-2)">
          {{ section.description }}
        </span>
      </div>
    </template>
  </UniForm>
</CompDemo>

## 联动显隐（dependencies + visible）

<CompDemo title="依赖字段控制展示" :code="codeLinkage">
  <UniForm v-model="formModelLinkage" :config="formConfigLinkage" />
</CompDemo>

## 动态字段状态 actions

字段 `onChange` 中可通过上下文 `actions` 主动设置其他字段的值、显隐、禁用态或选项，用于处理比 `visible` / `disabled` 更复杂的联动。

<CompDemo title="onChange + actions.setValue / setVisible / setDisabled" :code="codeDynamicActions">
  <UniForm v-model="formModelDynamic" :config="formConfigDynamic" />
</CompDemo>

## 校验 rules

<CompDemo title="config.rules + 调用 validate" :code="codeRules">
  <UniForm ref="formRefRules" v-model="formModelRules" :config="formConfigRules" />
  <el-button type="primary" style="margin-top: 12px" @click="submitRules">
    校验并提交
  </el-button>
</CompDemo>

## 字段插槽 field-xxx

<CompDemo title="#field-customSku 自定义控件" :code="codeFieldSlot">
  <UniForm v-model="formModelFieldSlot" :config="formConfigFieldSlot">
    <template #field-customSku="{ model }">
      <el-input v-model="model.customSku" placeholder="插槽完全自定义控件">
        <template #prepend>SKU</template>
      </el-input>
    </template>
  </UniForm>
</CompDemo>

## 底部操作插槽 actions

<CompDemo title="#actions（submit / reset）" :code="codeActions">
  <UniForm v-model="formModelActions" :config="formConfigActions">
    <template #actions="{ submit, reset }">
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button @click="reset">重置表单</el-button>
    </template>
  </UniForm>
</CompDemo>

## ElRadioGroup / ElInputNumber

<CompDemo title="单选组与数字输入" :code="codeRadioNumber">
  <UniForm v-model="formModelRadio" :config="formConfigRadio" />
</CompDemo>

## 异步 loadOptions

<CompDemo title="字段 loadOptions 远程选项" :code="codeLoadOptions">
  <UniForm v-model="formModelLoad" :config="formConfigLoad" />
</CompDemo>

## Props

| 属性         | 说明                             | 类型                      | 默认值   |
| ------------ | -------------------------------- | ------------------------- | -------- |
| `modelValue` | 表单数据（`v-model`）            | `Record<string, unknown>` | `{}`     |
| `config`     | 表单配置（schema、分组、校验等） | `UniFormConfig`           | —        |
| `mode`       | `edit` 可编辑，`view` 只读展示   | `'edit' \| 'view'`        | `'edit'` |

## Events

| 事件名              | 说明                   | 参数                      |
| ------------------- | ---------------------- | ------------------------- |
| `update:modelValue` | 模型变更               | `Record<string, unknown>` |
| `change`            | 模型变更（业务侧监听） | `Record<string, unknown>` |
| `field-change`      | 单字段变更             | `{ field, value, model }` |
| `linkage-change`    | 联动变更               | `{ field, model }`        |
| `validate`          | 校验结果               | `boolean`                 |
| `submit`            | 提交（若内部触发）     | `Record<string, unknown>` |
| `reset`             | 重置                   | —                         |

## Slots

| 插槽             | 说明                                                         |
| ---------------- | ------------------------------------------------------------ |
| `section-title`  | 自定义分组标题区，作用域：`section`                          |
| `field-${field}` | 完全自定义某一字段控件，作用域：`field`、`model`             |
| `actions`        | 底部操作区，作用域：`submit`、`reset`（与内置提交/重置对齐） |
