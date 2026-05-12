<template>
  <UniForm v-model="model" :config="config">
    <template #actions="{ submit, reset }">
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button @click="reset">重置表单</el-button>
    </template>
  </UniForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UniFormConfig } from 'uni-ui-lib'

const model = ref<Record<string, unknown>>({ note: '' })

const config: UniFormConfig = {
  schema: [
    {
      field: 'note',
      label: '备注',
      component: 'ElInput',
      colProps: { span: 24 }
    }
  ],
  colProps: { span: 12 }
}
</script>
