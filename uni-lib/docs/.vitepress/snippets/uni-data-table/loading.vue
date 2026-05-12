<template>
  <UniDataTable
    :columns="columns"
    :data="data"
    :loading="loading"
    :pagination="false"
    row-key="id" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { UniTableColumn } from 'uni-ui-lib'

const loading = ref(true)

const columns: UniTableColumn[] = [{ prop: 'name', label: '名称', type: 'text' }]

const data = [{ id: 1, name: '数据已有，loading 演示叠加态' }]

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 1200)
})
</script>
