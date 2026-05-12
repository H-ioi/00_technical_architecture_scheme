<template>
  <UniSearchForm v-model="query" :config="searchConfig">
    <template #actions="{ search, reset }">
      <el-button type="primary" @click="search">立即搜索</el-button>
      <el-button @click="reset">清空条件</el-button>
    </template>
  </UniSearchForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UniFormConfig } from 'uni-ui-lib'

const query = ref<Record<string, unknown>>({})
const searchConfig: UniFormConfig = {
  formProps: { labelWidth: 'auto' },
  schema: [
    {
      field: 'name',
      label: '名称',
      component: 'ElInput',
      colProps: { span: 8 }
    }
  ],
  colProps: { span: 8 }
}
</script>
