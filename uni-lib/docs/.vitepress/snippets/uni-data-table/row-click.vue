<template>
  <UniDataTable
    :columns="columns"
    :data="data"
    :pagination="false"
    row-key="id"
    @row-click="onRow" />
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { Recordable } from 'uni-ui-lib'
import type { UniTableColumn } from 'uni-ui-lib'

const columns: UniTableColumn[] = [{ prop: 'name', label: '名称（点击行）', type: 'text' }]

const data = [
  { id: 1, name: '行 1' },
  { id: 2, name: '行 2' }
]

function onRow(row: Recordable) {
  ElMessage.info(`点击了：${row.name}`)
}
</script>
