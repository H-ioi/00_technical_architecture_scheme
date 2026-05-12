<template>
  <UniForm v-model="model" :config="config" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UniFormConfig, UniOption } from 'uni-ui-lib'

const model = ref<Record<string, unknown>>({ city: '' })

const config: UniFormConfig = {
  schema: [
    {
      field: 'city',
      label: '城市',
      component: 'ElSelect',
      componentProps: {
        filterable: true,
        placeholder: '异步加载选项'
      },
      loadOptions: async () => {
        await new Promise((r) => setTimeout(r, 400))
        return [
          { label: '上海', value: 'sh' },
          { label: '北京', value: 'bj' }
        ] satisfies UniOption[]
      },
      colProps: { span: 12 }
    }
  ],
  colProps: { span: 12 }
}
</script>
