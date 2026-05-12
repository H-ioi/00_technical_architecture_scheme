<template>
  <el-radio-group v-model="mode" size="small">
    <el-radio-button value="edit">编辑</el-radio-button>
    <el-radio-button value="view">查看</el-radio-button>
  </el-radio-group>
  <UniForm v-model="formModel" :config="formConfig" :mode="mode" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UniFormConfig } from 'uni-ui-lib'

const mode = ref<'edit' | 'view'>('edit')

const formModel = ref<Record<string, unknown>>({
  name: '',
  remark: ''
})

const formConfig: UniFormConfig = {
  schema: [
    {
      field: 'name',
      label: '名称',
      component: 'ElInput',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 }
    },
    {
      field: 'remark',
      label: '备注',
      component: 'ElInput',
      componentProps: { type: 'textarea', rows: 3 },
      colProps: { span: 24 }
    }
  ],
  colProps: { span: 12 }
}
</script>
