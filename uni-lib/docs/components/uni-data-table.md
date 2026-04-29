<script setup lang="ts">
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";

import type {
  Recordable,
  UniOption,
  UniPaginationConfig,
  UniTableAction,
  UniTableColumn,
  UniTableRequest,
} from "@/types/shared";

import codeActionsSlot from "../.vitepress/snippets/uni-data-table/actions-slot.vue?raw";
import codeColHeader from "../.vitepress/snippets/uni-data-table/column-header-slots.vue?raw";
import codeLoading from "../.vitepress/snippets/uni-data-table/loading.vue?raw";
import codePageCustom from "../.vitepress/snippets/uni-data-table/pagination-custom.vue?raw";
import codePaginationRemote from "../.vitepress/snippets/uni-data-table/pagination-remote.vue?raw";
import codeRowClick from "../.vitepress/snippets/uni-data-table/row-click.vue?raw";
import codeSelection from "../.vitepress/snippets/uni-data-table/selection-actions.vue?raw";
import codeStatic from "../.vitepress/snippets/uni-data-table/static.vue?raw";
import codeSelEvents from "../.vitepress/snippets/uni-data-table/selection-events.vue?raw";
import codeTagSort from "../.vitepress/snippets/uni-data-table/tag-sort.vue?raw";
import codeToolbarEmpty from "../.vitepress/snippets/uni-data-table/toolbar-empty.vue?raw";
import codeValueEnums from "../.vitepress/snippets/uni-data-table/value-enums.vue?raw";

const columns: UniTableColumn[] = [
  { prop: "name", label: "名称", type: "text", minWidth: 120 },
  { prop: "status", label: "状态", type: "text", minWidth: 100 },
  { prop: "updatedAt", label: "更新时间", type: "text", minWidth: 160 },
];

const data = [
  { id: 1, name: "示例一行", status: "启用", updatedAt: "2026-04-29 10:00" },
  { id: 2, name: "示例二行", status: "停用", updatedAt: "2026-04-28 15:30" },
];

const allRows = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  name: `数据项 ${i + 1}`,
  status: i % 2 === 0 ? "启用" : "停用",
  updatedAt: "2026-04-29 10:00",
}));

const loadPage: UniTableRequest = async ({ pageNo, pageSize }) => {
  await new Promise((r) => setTimeout(r, 280));
  const start = (pageNo - 1) * pageSize;

  return {
    records: allRows.slice(start, start + pageSize),
    total: allRows.length,
  };
};

const columnsSel: UniTableColumn[] = [
  { prop: "name", label: "名称", type: "text", minWidth: 120 },
];

const dataSel = [
  { id: 1, name: "行 A" },
  { id: 2, name: "行 B" },
];

const actions: UniTableAction[] = [
  {
    label: "详情",
    type: "primary",
    onClick: (row) => console.info("[docs]", row),
  },
];

const columnsSlot: UniTableColumn[] = [
  { prop: "name", label: "名称", type: "text", minWidth: 100 },
  { prop: "status", label: "状态", type: "text", minWidth: 80 },
  { prop: "remark", label: "备注列单元格", minWidth: 140 },
];

const dataSlot = [{ id: 1, name: "A", status: "ok", remark: "自定义列" }];

const paginationCustom: UniPaginationConfig = {
  pageSizes: [5, 10],
  position: "left",
  layout: "total, prev, pager, next",
};

const allPageCustom = Array.from({ length: 23 }).map((_, i) => ({
  id: i + 1,
  name: `第 ${i + 1} 条`,
}));

const loadPageCustom: UniTableRequest = async ({ pageNo, pageSize }) => {
  await new Promise((r) => setTimeout(r, 200));
  const start = (pageNo - 1) * pageSize;

  return {
    records: allPageCustom.slice(start, start + pageSize),
    total: allPageCustom.length,
  };
};

const columnsTag: UniTableColumn[] = [
  { prop: "name", label: "名称", type: "text", minWidth: 100 },
  {
    prop: "status",
    label: "状态",
    type: "tag",
    sortable: true,
    minWidth: 100,
    options: [
      { label: "启用", value: 1 },
      { label: "停用", value: 0 },
    ],
  },
];

const dataTag = [
  { id: 1, name: "甲", status: 1 },
  { id: 2, name: "乙", status: 0 },
];

const columnsEnum: UniTableColumn[] = [
  { prop: "code", label: "编码", type: "text", minWidth: 80 },
  { prop: "state", label: "状态", type: "enum", minWidth: 100 },
];

const valueEnumsDemo: Record<string, UniOption[]> = {
  state: [
    { label: "草稿", value: "d" },
    { label: "已发布", value: "p" },
  ],
};

const dataEnum = [
  { id: 1, code: "A1", state: "d" },
  { id: 2, code: "A2", state: "p" },
];

const loadingDemo = ref(true);

const selectedIds = ref("无");

function onSelectionChange(rows: Recordable[]) {
  selectedIds.value = rows.map((r) => String(r.id)).join(", ") || "无";
}

function onRowClick(row: Recordable) {
  ElMessage.info(`点击了：${row.name}`);
}

onMounted(() => {
  setTimeout(() => {
    loadingDemo.value = false;
  }, 1200);
});
</script>

# UniDataTable

标准后台表格组件，基于 Element Plus `ElTable`，内置分页、加载态、空态、列展示类型和操作列。

## Props

| 属性         | 说明                                                     | 类型                                | 默认值     |
| ------------ | -------------------------------------------------------- | ----------------------------------- | ---------- |
| `columns`    | 列定义                                                   | `UniTableColumn[]`                  | —          |
| `data`       | 静态数据；与 `request` 二选一                            | `Record<string, unknown>[]`         | `[]`       |
| `request`    | 分页请求，返回 `{ records, total }`                      | `UniTableRequest`                   | —          |
| `loading`    | 外部加载态                                               | `boolean`                           | —          |
| `pagination` | 分页配置，`false` 关闭分页                               | `UniPaginationConfig \| false`      | 内置默认   |
| `rowKey`     | 行主键字段名                                             | `string`                            | `id`       |
| `selection`  | 多选（`true` / `multiple`）；`single` 类型暂未渲染选择列 | `boolean \| 'multiple' \| 'single'` | —          |
| `actions`    | 行操作按钮配置                                           | `UniTableAction[]`                  | —          |
| `emptyText`  | 空数据文案                                               | `string`                            | `暂无数据` |
| `valueEnums` | 按列 `prop` 注入枚举选项（展示 enum/tag 等）             | `Record<string, UniOption[]>`       | —          |

## Events

| 事件名                              | 说明             |
| ----------------------------------- | ---------------- |
| `update:pageNo` / `update:pageSize` | 分页变更         |
| `selection-change`                  | 勾选变更         |
| `sort-change`                       | 排序变更         |
| `row-click`                         | 行点击           |
| `refresh`                           | `request` 成功后 |
| `request-error`                     | 请求失败         |
| `switch-change`                     | 开关列变更       |

## Slots

| 插槽             | 说明                                          |
| ---------------- | --------------------------------------------- |
| `toolbar`        | 表格上方工具条                                |
| `header-${prop}` | 自定义列标题                                  |
| `column-${prop}` | 自定义单元格                                  |
| `actions`        | 自定义操作列（替代 `actions` 配置的默认按钮） |
| `empty`          | 空状态                                        |

---

## 静态数据（关闭分页）

<CompDemo title="本地 data + pagination=false" :code="codeStatic">
  <UniDataTable
    :columns="columns"
    :data="data"
    :pagination="false"
    row-key="id"
  />
</CompDemo>

## 远程分页（含底部分页器）

使用 **`request`** 按页请求数据；返回值 **`{ records, total }`** 中 **`total` 大于当前 `pageSize`** 时，表格底部会出现 **分页器**（总数、每页条数、上一页/下一页、跳转等，默认 layout 见源码）。

下方示例为 **50 条** 模拟数据、**默认每页 10 条**，共 5 页，可切换页码与每页条数。

<CompDemo title="request + total → 底部分页" :code="codePaginationRemote">
  <UniDataTable :columns="columns" :request="loadPage" row-key="id" />
</CompDemo>

## 自定义分页样式与 layout

<CompDemo title="pagination：pageSizes / position / layout" :code="codePageCustom">
  <UniDataTable
    :columns="[{ prop: 'name', label: '名称', type: 'text' }]"
    :request="loadPageCustom"
    row-key="id"
    :pagination="paginationCustom"
  />
</CompDemo>

## 多选 + 配置型行操作

<CompDemo title="selection + actions 数组" :code="codeSelection">
  <UniDataTable
    :columns="columnsSel"
    :data="dataSel"
    selection="multiple"
    :actions="actions"
    :pagination="false"
    row-key="id"
  />
</CompDemo>

## selection-change 事件

<CompDemo title="@selection-change 拿到勾选行" :code="codeSelEvents">
  <p style="margin: 0 0 8px; font-size: 13px">已选 id：{{ selectedIds }}</p>
  <UniDataTable
    :columns="columnsSel"
    :data="dataSel"
    selection="multiple"
    :pagination="false"
    row-key="id"
    @selection-change="onSelectionChange"
  />
</CompDemo>

## 行点击

<CompDemo title="@row-click" :code="codeRowClick">
  <UniDataTable
    :columns="[{ prop: 'name', label: '名称（点击行）', type: 'text' }]"
    :data="dataSel"
    :pagination="false"
    row-key="id"
    @row-click="onRowClick"
  />
</CompDemo>

## 加载态 loading

<CompDemo title="外部 loading（可与 request 叠加）" :code="codeLoading">
  <UniDataTable
    :columns="[{ prop: 'name', label: '名称', type: 'text' }]"
    :data="[{ id: 1, name: '数据已有，演示 loading 叠加' }]"
    :loading="loadingDemo"
    :pagination="false"
    row-key="id"
  />
</CompDemo>

## tag 列 + 排序列

<CompDemo title="type=tag + options；sortable" :code="codeTagSort">
  <UniDataTable
    :columns="columnsTag"
    :data="dataTag"
    :pagination="false"
    row-key="id"
    @sort-change="() => {}"
  />
</CompDemo>

## valueEnums 注入枚举

<CompDemo title="列上不写 options 时用 valueEnums" :code="codeValueEnums">
  <UniDataTable
    :columns="columnsEnum"
    :data="dataEnum"
    :value-enums="valueEnumsDemo"
    :pagination="false"
    row-key="id"
  />
</CompDemo>

## 工具栏与空态插槽

<CompDemo title="#toolbar + #empty" :code="codeToolbarEmpty">
  <UniDataTable
    :columns="[{ prop: 'name', label: '名称', type: 'text' }]"
    :data="[]"
    :pagination="false"
    row-key="id"
  >
    <template #toolbar>
      <el-button type="primary" size="small">工具栏插槽</el-button>
    </template>
    <template #empty>
      <el-empty description="自定义空态（#empty）" />
    </template>
  </UniDataTable>
</CompDemo>

## 列头 / 单元格插槽

<CompDemo title="#header-xxx 与 #column-xxx" :code="codeColHeader">
  <UniDataTable
    :columns="columnsSlot"
    :data="dataSlot"
    :pagination="false"
    row-key="id"
  >
    <template #header-status>
      <span>状态 <el-tag size="small" type="info">列头插槽</el-tag></span>
    </template>
    <template #column-remark="{ row }">
      <el-tag type="success">{{ row.remark || "—" }}</el-tag>
    </template>
  </UniDataTable>
</CompDemo>

## 操作列插槽（完全自定义）

<CompDemo title="#actions 替换默认按钮" :code="codeActionsSlot">
  <UniDataTable
    :columns="[{ prop: 'name', label: '名称', type: 'text' }]"
    :data="dataSel"
    :pagination="false"
    row-key="id"
  >
    <template #actions="{ row, index }">
      <el-button link type="primary" size="small" @click="() => console.info(row, index)">
        自定义操作
      </el-button>
    </template>
  </UniDataTable>
</CompDemo>

::: warning 关于 selection="single"
当前版本选择列仅在 `selection` 为 `true` 或 `'multiple'` 时渲染；若需要单选样式请在业务中用自定义列或监听 `selection-change` 自行约束为单行。
:::

---

## 不做事项

不写死接口、路由、store 或业务按钮文案；搜索区域由 `UniSearchForm` 或页面自行组合。
