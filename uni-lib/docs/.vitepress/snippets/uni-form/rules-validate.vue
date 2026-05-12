<template>
  <UniForm ref="formRef" v-model="model" :config="config" />
  <el-button type="primary" style="margin-top: 12px" @click="submit"> 校验并提交 </el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UniFormConfig } from 'uni-ui-lib'

const formRef = ref<{ validate: () => Promise<boolean | undefined> } | null>(null)

const model = ref<Record<string, unknown>>({ email: '' })

const config: UniFormConfig = {
  schema: [
    {
      field: 'email',
      label: '邮箱',
      component: 'ElInput',
      componentProps: { placeholder: '必填' },
      colProps: { span: 12 }
    }
  ],
  colProps: { span: 12 },
  rules: {
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '格式不正确', trigger: 'blur' }
    ]
  }
}

async function submit() {
  await formRef.value?.validate()
}
</script>
