<template>
  <UniForm v-model="model" :config="config">
    <template #field-customSku="{ model: m }">
      <el-input v-model="m.customSku" placeholder="插槽完全自定义控件">
        <template #prepend>SKU</template>
      </el-input>
    </template>
  </UniForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UniFormConfig } from 'uni-ui-lib'

const model = ref<Record<string, unknown>>({ customSku: '' })

const config: UniFormConfig = {
  schema: [
    {
      field: 'customSku',
      label: '自定义列',
      component: 'ElInput',
      colProps: { span: 24 }
    }
  ],
  colProps: { span: 12 }
}
</script>
