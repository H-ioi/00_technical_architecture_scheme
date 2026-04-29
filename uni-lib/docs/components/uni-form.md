<script setup lang="ts">
import { ref } from "vue";

import type { UniFormConfig } from "@/types/shared";

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
</script>

# UniForm

动态表单编排组件，基于 Element Plus 表单原子组件，使用单一 `config` 对象初始化字段、分组、布局、联动和查看/编辑模式。

## 基础用法

<ClientOnly>
  <div class="vp-raw uni-lib-demo">
    <el-radio-group v-model="mode" size="small" style="margin-bottom: 12px">
      <el-radio-button value="edit">编辑</el-radio-button>
      <el-radio-button value="view">查看</el-radio-button>
    </el-radio-group>
    <UniForm v-model="formModel" :config="formConfig" :mode="mode" />
  </div>
</ClientOnly>

```vue
<UniForm v-model="formModel" :config="formConfig" :mode="mode" />
```

## 联动

字段可通过 `dependencies` 声明依赖，并使用 `visible`、`disabled`、`onChange`、`actions.setValue()`、`actions.clearValue()` 等能力完成显隐和值联动。
