<template>
  <UniForm v-model="model" :config="config" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UniFormConfig } from 'uni-ui-lib'

const model = ref<Record<string, unknown>>({
  baseName: '',
  extCode: ''
})

const config: UniFormConfig = {
  sections: [
    {
      title: '基础信息',
      description: '分组标题与说明文案来自 sections',
      fields: ['baseName']
    },
    {
      title: '扩展',
      fields: ['extCode']
    }
  ],
  schema: [
    {
      field: 'baseName',
      label: '名称',
      component: 'ElInput',
      colProps: { span: 12 }
    },
    {
      field: 'extCode',
      label: '编码',
      component: 'ElInput',
      colProps: { span: 12 }
    }
  ],
  colProps: { span: 12 }
}
</script>
