<script setup lang="ts">
import { ref } from "vue";

import type { UniFormConfig } from "@/types/shared";

const query = ref<Record<string, unknown>>({
  keyword: "",
  status: "",
});

const searchConfig: UniFormConfig = {
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
  // 文档示例：实际项目里在此发起列表请求
  console.info("[docs] search", query.value);
}
</script>

# UniSearchForm

查询表单组件，基于 `UniForm`，增加查询、重置、展开收起和筛选场景事件。

## 示例

<ClientOnly>
  <div class="vp-raw uni-lib-demo">
    <UniSearchForm v-model="query" :config="searchConfig" @search="loadList" />
  </div>
</ClientOnly>

## 代码

```vue
<UniSearchForm v-model="query" :config="searchConfig" @search="loadList" />
```
