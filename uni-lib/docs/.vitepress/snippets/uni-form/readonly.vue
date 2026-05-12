<template>
  <UniForm v-model="formModel" :config="formConfig" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UniFormConfig } from 'uni-ui-lib'

const formModel = ref<Record<string, unknown>>({ title: '只读示例' })

const formConfig: UniFormConfig = {
  disabled: true,
  schema: [
    {
      field: 'title',
      label: '标题',
      component: 'ElInput',
      colProps: { span: 24 }
    }
  ],
  colProps: { span: 12 }
}
</script>
