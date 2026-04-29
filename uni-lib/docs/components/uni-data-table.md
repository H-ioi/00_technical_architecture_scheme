<script setup lang="ts">
import type { UniTableColumn } from "@/types/shared";

const columns: UniTableColumn[] = [
  { prop: "name", label: "名称", type: "text", minWidth: 120 },
  { prop: "status", label: "状态", type: "text", minWidth: 100 },
  { prop: "updatedAt", label: "更新时间", type: "text", minWidth: 160 },
];

const data = [
  { id: 1, name: "示例一行", status: "启用", updatedAt: "2026-04-29 10:00" },
  { id: 2, name: "示例二行", status: "停用", updatedAt: "2026-04-28 15:30" },
];
</script>

# UniDataTable

标准后台表格组件，基于 Element Plus `ElTable`，内置分页、加载态、空态、列展示类型和操作列。

## 基础用法（静态数据）

<ClientOnly>
  <div class="vp-raw uni-lib-demo">
    <UniDataTable
      :columns="columns"
      :data="data"
      :pagination="false"
      row-key="id"
    />
  </div>
</ClientOnly>

远程分页请传入 `request`，例如：

```vue
<UniDataTable :columns="columns" :request="loadUsers" />
```

## 不做事项

不写死接口、路由、store 或业务按钮文案；搜索区域由 `UniSearchForm` 或页面自行组合。
