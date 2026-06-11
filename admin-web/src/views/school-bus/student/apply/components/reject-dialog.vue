<template>
  <el-dialog
    v-model="visible"
    width="520px"
    :title="$t('schoolBus.studentApply.batchReject')"
    destroy-on-close
    @closed="onClosed">
    <UniForm ref="uniFormRef" v-model="form" mode="edit" :config="formConfig" />
    <template #footer>
      <el-button @click="visible = false">
        {{ $t('schoolBus.cancel') }}
      </el-button>
      <el-button type="primary" :loading="submitting" @click="submit">
        {{ $t('schoolBus.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { schoolBusOrderApi } from '@/api'
import { ElMessage } from 'element-plus'
import type { UniFormConfig } from 'uni-ui-lib'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import { computed, ref } from 'vue'

const emit = defineEmits<{ saved: [] }>()

const { t } = useUniI18n()

const visible = ref(false)
const submitting = ref(false)
const idsRef = ref<Array<string | number | undefined>>([])
const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const form = ref({ denyReason: '' })

const formConfig = computed<UniFormConfig>(() => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 0 },
  colProps: { span: 24 },
  rules: {
    denyReason: [
      {
        required: true,
        message: t('schoolBus.studentApply.rejectReasonRequired'),
        trigger: 'blur'
      }
    ]
  } as UniFormConfig['rules'],
  schema: [
    {
      field: 'denyReason',
      label: t('schoolBus.studentApply.rejectReason'),
      component: 'ElInput',
      componentProps: { type: 'textarea', rows: 5 }
    }
  ]
}))

const onClosed = () => {
  idsRef.value = []
  form.value.denyReason = ''
  uniFormRef.value?.clearValidate()
}

const submit = async () => {
  const valid = await uniFormRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }
  submitting.value = true
  try {
    await schoolBusOrderApi.batchDeny.get({
      ids: idsRef.value,
      denyReason: form.value.denyReason
    })
    ElMessage.success(t('schoolBus.operationSuccess'))
    visible.value = false
    emit('saved')
  } catch {
    /* request 层已提示 */
  } finally {
    submitting.value = false
  }
}

defineExpose({
  open: (ids: Array<string | number | undefined>) => {
    idsRef.value = [...ids]
    form.value.denyReason = ''
    visible.value = true
  }
})
</script>
