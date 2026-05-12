<template>
  <div>
    <el-switch
      v-model="collapsed"
      active-text="收起"
      inactive-text="展开"
      style="margin-bottom: 12px" />
    <UniSearchForm
      v-model="query"
      v-model:collapsed="collapsed"
      :config="config"
      :collapsed-rows="1"
      @search="onSearch" />
  </div>
</template>

<script setup lang="ts">
import type { UniFormConfig } from 'uni-ui-lib'
import { ref } from 'vue'

const collapsed = ref(true)
const query = ref<Record<string, unknown>>({})

const config: UniFormConfig = {
  schema: Array.from({ length: 6 }).map((_, index) => ({
    field: `field${index + 1}`,
    label: '',
    component: 'ElInput' as const,
    componentProps: { placeholder: `条件 ${index + 1}`, clearable: true },
    colProps: { span: 6 }
  })),
  rowProps: { gutter: 12 },
  colProps: { span: 6 }
}

function onSearch(value: Record<string, unknown>) {
  console.info('search', value)
}
</script>
