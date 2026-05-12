<template>
  <UniSearchForm v-model="query" :config="searchConfig" :collapsed-rows="1" @search="onSearch" />
</template>

<script setup lang="ts">
import type { UniFormConfig } from 'uni-ui-lib'
import { ref } from 'vue'

const query = ref<Record<string, unknown>>({})

const searchConfig: UniFormConfig = {
  formProps: { labelWidth: 'auto' },
  schema: [
    {
      field: 'a',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: '条件一', clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'b',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: '条件二', clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'c',
      label: '',
      componentProps: { placeholder: '条件三', clearable: true },
      component: 'ElInput',
      colProps: { span: 6 }
    },
    {
      field: 'd',
      label: '',
      componentProps: { placeholder: '条件四', clearable: true },
      component: 'ElInput',
      colProps: { span: 6 }
    },
    {
      field: 'e',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: '条件五', clearable: true },
      colProps: { span: 6 }
    }
  ],
  colProps: { span: 6 },
  rowProps: { gutter: 12 }
}

function onSearch() {
  /* 查询 */
}
</script>
