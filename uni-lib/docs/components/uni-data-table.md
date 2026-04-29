# UniDataTable

标准后台表格组件，基于 Element Plus `ElTable`，内置分页、加载态、空态、列展示类型和操作列。

## 基础用法

```vue
<UniDataTable :columns="columns" :request="loadUsers" />
```

## 不做事项

不写死接口、路由、store 或业务按钮文案；搜索区域由 `UniSearchForm` 或页面自行组合。
