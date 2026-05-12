<template>
  <UniForm v-model="model" :config="config" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UniFormConfig } from 'uni-ui-lib'

const model = ref<Record<string, unknown>>({
  showExtra: 'no',
  extraNote: ''
})

const config: UniFormConfig = {
  schema: [
    {
      field: 'showExtra',
      label: '展示备注',
      component: 'ElRadioGroup',
      options: [
        { label: '否', value: 'no' },
        { label: '是', value: 'yes' }
      ],
      colProps: { span: 24 }
    },
    {
      field: 'extraNote',
      label: '备注',
      component: 'ElInput',
      dependencies: ['showExtra'],
      visible: (ctx) => ctx.model.showExtra === 'yes',
      componentProps: { type: 'textarea', rows: 2 },
      colProps: { span: 24 }
    }
  ],
  colProps: { span: 12 }
}
</script>
