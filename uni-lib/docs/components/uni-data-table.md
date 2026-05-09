<script setup lang="ts">
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";

import type { Recordable, UniOption } from "@/types/shared";
import type {
  UniPaginationConfig,
  UniTableToolbarConfig,
  UniTableAction,
  UniTableColumn,
  UniTableRequest,
} from "@/types/uni-table";

import codeActionsSlot from "../.vitepress/snippets/uni-data-table/actions-slot.vue?raw";
import codeActionsOverflow from "../.vitepress/snippets/uni-data-table/actions-overflow.vue?raw";
import codeColumnTypes from "../.vitepress/snippets/uni-data-table/column-types.vue?raw";
import codeColHeader from "../.vitepress/snippets/uni-data-table/column-header-slots.vue?raw";
import codeLoading from "../.vitepress/snippets/uni-data-table/loading.vue?raw";
import codeOverflowTooltip from "../.vitepress/snippets/uni-data-table/overflow-tooltip.vue?raw";
import codePageCustom from "../.vitepress/snippets/uni-data-table/pagination-custom.vue?raw";
import codePaginationRemote from "../.vitepress/snippets/uni-data-table/pagination-remote.vue?raw";
import codeRowClick from "../.vitepress/snippets/uni-data-table/row-click.vue?raw";
import codeSelection from "../.vitepress/snippets/uni-data-table/selection-actions.vue?raw";
import codeStatic from "../.vitepress/snippets/uni-data-table/static.vue?raw";
import codeSelEvents from "../.vitepress/snippets/uni-data-table/selection-events.vue?raw";
import codeSwitchChange from "../.vitepress/snippets/uni-data-table/switch-change.vue?raw";
import codeTagSort from "../.vitepress/snippets/uni-data-table/tag-sort.vue?raw";
import codeToolbarEmpty from "../.vitepress/snippets/uni-data-table/toolbar-empty.vue?raw";
import codeToolbarTools from "../.vitepress/snippets/uni-data-table/toolbar-tools.vue?raw";
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

const columnsActionOverflow: UniTableColumn[] = [
  { prop: "name", label: "名称", type: "text", minWidth: 120 },
  { prop: "status", label: "状态", type: "tag", minWidth: 100 },
];

const dataActionOverflow = [
  { id: 1, name: "流程 A", status: "draft" },
  { id: 2, name: "流程 B", status: "locked" },
];

const actionsOverflow: UniTableAction[] = [
  { label: "详情", type: "primary", onClick: (row) => console.info(row) },
  { label: "编辑", type: "primary", onClick: (row) => console.info(row) },
  {
    label: "提交",
    type: "success",
    visible: (row) => row.status === "draft",
    onClick: (row) => console.info(row),
  },
  {
    label: "停用",
    type: "warning",
    disabled: (row) => row.status === "locked",
    onClick: (row) => console.info(row),
  },
  { label: "删除", type: "danger", onClick: (row) => console.info(row) },
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

const toolbarCustom: UniTableToolbarConfig = {
  refresh: true,
  density: true,
  columnSetting: true,
  fullscreen: true,
  export: true,
  print: true,
  exportFileName: "uni-data-table-demo",
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

const columnsSwitch: UniTableColumn[] = [
  { prop: "name", label: "名称", type: "text", minWidth: 120 },
  {
    prop: "enabled",
    label: "启用",
    type: "switch",
    minWidth: 100,
    switch: {
      activeValue: 1,
      inactiveValue: 0,
      disabled: (row) => row.name === "不可编辑项",
    },
  },
];

const dataSwitch = ref<Recordable[]>([
  { id: 1, name: "可编辑项", enabled: 1 },
  { id: 2, name: "不可编辑项", enabled: 0 },
]);

const columnsRich: UniTableColumn[] = [
  { prop: "orderNo", label: "订单号", type: "copy", minWidth: 140 },
  { prop: "amount", label: "金额", type: "money", minWidth: 100 },
  { prop: "rate", label: "完成率", type: "percent", minWidth: 100 },
  {
    prop: "owner",
    label: "负责人",
    type: "text",
    formatter: (_row, _column, value) => `@${value}`,
    minWidth: 100,
  },
  {
    prop: "url",
    label: "链接",
    type: "link",
    minWidth: 120,
    link: { target: "_blank" },
  },
  {
    prop: "tags",
    label: "标签",
    type: "array",
    minWidth: 160,
    array: { renderMode: "tag" },
  },
  { prop: "extra", label: "扩展信息", type: "json", minWidth: 160 },
];

const dataRich = [
  {
    id: 1,
    orderNo: "ORD-20260429-001",
    amount: 1280.5,
    rate: 0.86,
    owner: "Alice",
    url: "https://example.com",
    tags: ["重点", "已同步"],
    extra: { source: "ERP", priority: 1 },
  },
];

const loadingDemo = ref(true);

const selectedIds = ref("无");

function onSelectionChange(rows: Recordable[]) {
  selectedIds.value = rows.map((r) => String(r.id)).join(", ") || "无";
}

function onRowClick(row: Recordable) {
  ElMessage.info(`点击了：${row.name}`);
}

function onSwitchChange(
  row: Recordable,
  _column: UniTableColumn,
  value: unknown,
) {
  row.enabled = value;
  ElMessage.success(`已切换：${row.name}`);
}

onMounted(() => {
  setTimeout(() => {
    loadingDemo.value = false;
  }, 1200);
});
</script>

# UniDataTable

标准后台表格组件，基于 Element Plus `ElTable`，内置分页、加载态、空态、列展示类型和操作列。

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

## 内置右侧表格工具

表格默认内置右侧工具栏：刷新、密度切换、列设置、最大化、导出当前展示数据、打印当前展示数据。左侧仍可使用 `#toolbar` 放业务按钮；如需关闭可传 `:toolbar="false"`，或通过 `toolbar` 对象关闭单项。

<CompDemo title="默认右侧工具 + 左侧业务按钮" :code="codeToolbarTools">
  <UniDataTable
    :columns="columns"
    :data="data"
    :pagination="false"
    :toolbar="toolbarCustom"
    row-key="id"
  >
    <template #toolbar>
      <el-button type="primary" size="small">新增</el-button>
      <el-button size="small">批量导入</el-button>
    </template>
  </UniDataTable>
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

## 操作列超过 3 个自动收纳

`actions` 会先按 `visible` 和 `code` 过滤可见项：可见操作 **不超过 3 个** 时全部直接展示；**超过 3 个** 时，前 2 个直接展示，第 3 个位置显示更多图标，下拉内包含第 3 个及后续操作。`disabled` 会同步作用到按钮和下拉项。

<CompDemo title="actions > 3：第三位收纳为更多" :code="codeActionsOverflow">
  <UniDataTable
    :columns="columnsActionOverflow"
    :data="dataActionOverflow"
    :actions="actionsOverflow"
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

## 开关列 switch-change

`type="switch"` 适合表格内快速启停；切换后通过 `switch-change` 回传当前行、列配置和新值，业务侧可在事件里更新行数据或发起接口请求。

<CompDemo title="type=switch + @switch-change" :code="codeSwitchChange">
  <UniDataTable
    :columns="columnsSwitch"
    :data="dataSwitch"
    :pagination="false"
    row-key="id"
    @switch-change="onSwitchChange"
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

## 常见业务列类型

内置单元格渲染覆盖常见后台字段：复制、金额、百分比、formatter、链接、数组标签、JSON tooltip 等。更复杂的展示建议使用 `column-${prop}` 插槽接管。

<CompDemo title="copy / money / percent / link / array / json" :code="codeColumnTypes">
  <UniDataTable
    :columns="columnsRich"
    :data="dataRich"
    :pagination="false"
    row-key="id"
  />
</CompDemo>

## 超宽省略与 tooltip

列配置 `showOverflowTooltip: true` 后，单元格内容会保持单行展示；超过列宽时自动省略，鼠标悬停展示完整内容。适合项目名称、备注、说明等长文本字段。

<CompDemo title="showOverflowTooltip 超宽省略" :code="codeOverflowTooltip">
  <UniDataTable
    :columns="[
      { prop: 'name', label: '项目名称', minWidth: 140, showOverflowTooltip: true },
      { prop: 'description', label: '说明', minWidth: 180, showOverflowTooltip: true },
      { prop: 'owner', label: '负责人', width: 100 },
    ]"
    :data="[
      {
        id: 1,
        name: '跨端后台统一业务组件库建设与迁移专项',
        description: '这是一段较长的项目说明，用来演示表格单元格内容超过列宽后自动省略，并在鼠标悬停时展示完整内容。',
        owner: 'Alice',
      },
      {
        id: 2,
        name: '统一权限、主题与国际化治理',
        description: '列配置 showOverflowTooltip 为 true 时，会启用单行省略与 tooltip 提示。',
        owner: 'Bob',
      },
    ]"
    :pagination="false"
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

::: tip 关于 selection="single"
`selection="single"` 不渲染复选框列，而是启用当前行高亮；行切换时通过 `selection-change` 回传单行数组。`selection=true` 或 `'multiple'` 使用 Element Plus 多选列。
:::

---

## 不做事项

不写死接口、路由、store 或业务按钮文案；搜索区域由 `UniSearchForm` 或页面自行组合。

## Props

| 属性           | 说明                                                     | 类型                                | 默认值    |
| -------------- | -------------------------------------------------------- | ----------------------------------- | --------- |
| `columns`      | 列定义                                                   | `UniTableColumn[]`                  | —         |
| `data`         | 静态数据；与 `request` 二选一                            | `Record<string, unknown>[]`         | `[]`      |
| `request`      | 分页请求，返回 `{ records, total }`                      | `UniTableRequest`                   | —         |
| `filters`      | 远程请求附加筛选参数，会透传给 `request`                 | `Record<string, unknown>`           | —         |
| `loading`      | 外部加载态                                               | `boolean`                           | —         |
| `pagination`   | 分页配置，`false` 关闭分页                               | `UniPaginationConfig \| false`      | 内置默认  |
| `rowKey`       | 行主键字段名                                             | `string`                            | `id`      |
| `selection`    | 多选（`true` / `multiple`）或单选高亮（`single`）        | `boolean \| 'multiple' \| 'single'` | —         |
| `selectable`   | 多选时控制某一行是否可勾选                               | `(row, index) => boolean`           | —         |
| `actions`      | 行操作按钮配置；可见项超过 3 个时第三位自动收纳为更多    | `UniTableAction[]`                  | —         |
| `actionColumn` | 操作列配置，可设置 `label`、`width`、`minWidth`、`fixed` | `UniTableActionColumnConfig`        | —         |
| `emptyText`    | 空数据文案；不传时使用当前语言包                         | `string`                            | i18n 默认 |
| `maxHeight`    | 表格最大高度；默认自动计算可用视口高度，`false` 关闭      | `number \| string \| false \| 'auto'` | `auto`    |
| `maxHeightOffset` | 自动计算时距离视口底部的保留间距                      | `number`                            | `16`      |
| `valueEnums`   | 按列 `prop` 注入枚举选项（展示 enum/tag 等）             | `Record<string, UniOption[]>`       | —         |
| `toolbar`      | 右侧表格工具配置；`false` 关闭内置工具栏                 | `boolean \| UniTableToolbarConfig`  | 内置默认  |

## Toolbar Config

| 属性             | 说明                         | 默认值       |
| ---------------- | ---------------------------- | ------------ |
| `enabled`        | 是否启用右侧表格工具         | `true`       |
| `refresh`        | 刷新当前数据                 | `true`       |
| `density`        | 密度切换：宽松 / 默认 / 紧凑 | `true`       |
| `columnSetting`  | 列显示、排序、固定设置       | `true`       |
| `fullscreen`     | 最大化表格区域               | `true`       |
| `export`         | 导出当前展示数据为 CSV       | `true`       |
| `print`          | 打印当前展示数据             | `true`       |
| `exportFileName` | 导出文件名                   | `table-data` |

## Column Types

| 类型           | 说明                                                                         |
| -------------- | ---------------------------------------------------------------------------- |
| `text`         | 默认文本，支持 `formatter`                                                   |
| `number`       | 数字文本                                                                     |
| `money`        | 金额格式化                                                                   |
| `percent`      | 百分比展示，默认按 `value * 100`，后端已返回百分数时可设 `percent.scale = 1` |
| `date`         | 日期格式化，默认 `YYYY-MM-DD`                                                |
| `datetime`     | 日期时间格式化，默认 `YYYY-MM-DD HH:mm:ss`                                   |
| `time`         | 时间格式化，默认 `HH:mm:ss`                                                  |
| `relativeTime` | 相对时间展示，如 `5 分钟前`                                                  |
| `boolean`      | `true/false` 展示为 `是/否`                                                  |
| `enum`         | 从列 `options` 或 `valueEnums` 映射文案                                      |
| `tag/tags`     | 标签展示                                                                     |
| `switch`       | 开关列，变更时触发 `switch-change`                                           |
| `copy`         | 文本 + 复制按钮                                                              |
| `link/links`   | 链接展示                                                                     |
| `array`        | 数组文本或标签展示                                                           |
| `json`         | JSON 字符串 + tooltip                                                        |
| `image/images` | 图片预览展示                                                                 |
| `video/videos` | 视频链接展示                                                                 |
| `slot`         | 配合 `column-${prop}` 插槽自定义展示                                         |

常用列属性还包括 `width`、`minWidth`、`fixed`、`align`、`sortable`、`showOverflowTooltip`。其中 `showOverflowTooltip` 用于长文本单行省略和悬停提示。

## Events

| 事件名                              | 说明                                           |
| ----------------------------------- | ---------------------------------------------- |
| `update:pageNo` / `update:pageSize` | 分页变更                                       |
| `selection-change`                  | 勾选变更                                       |
| `sort-change`                       | 排序变更                                       |
| `row-click`                         | 行点击                                         |
| `refresh`                           | 用户触发表格刷新（工具栏或组件 `refresh()`）   |
| `load-success`                      | `request` 加载成功，包含首屏、分页、排序和刷新 |
| `request-error`                     | 请求失败                                       |
| `switch-change`                     | 开关列变更                                     |

## Slots

| 插槽             | 说明                                          |
| ---------------- | --------------------------------------------- |
| `toolbar`        | 表格上方工具条                                |
| `header-${prop}` | 自定义列标题                                  |
| `column-${prop}` | 自定义单元格                                  |
| `actions`        | 自定义操作列（替代 `actions` 配置的默认按钮） |
| `empty`          | 空状态                                        |
