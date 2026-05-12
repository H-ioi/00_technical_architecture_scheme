<template>
  <UniDataTable
    :columns="columns"
    :data="data"
    :pagination="false"
    row-key="id"
    @switch-change="onSwitchChange" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Recordable, UniTableColumn } from 'uni-ui-lib'

const columns: UniTableColumn[] = [
  { prop: 'name', label: '名称', type: 'text', minWidth: 120 },
  {
    prop: 'enabled',
    label: '启用',
    type: 'switch',
    minWidth: 100,
    switch: {
      activeValue: 1,
      inactiveValue: 0,
      disabled: (row) => row.name === '不可编辑项'
    }
  }
]

const data = ref<Recordable[]>([
  { id: 1, name: '可编辑项', enabled: 1 },
  { id: 2, name: '不可编辑项', enabled: 0 }
])

function onSwitchChange(row: Recordable, _column: UniTableColumn, value: unknown) {
  row.enabled = value
}
</script>
