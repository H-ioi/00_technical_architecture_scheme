<template>
  <el-dialog
    v-model="visible"
    :title="$t('activity.qCopyTitle')"
    width="520px"
    destroy-on-close
    append-to-body
    :close-on-click-modal="false"
    @closed="onClosed">
    <UniForm ref="uniFormRef" v-model="formModel" mode="edit" :config="formConfig" />
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="saving" @click="submit">
        {{ $t('common.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { UniFormConfig, UniOption } from 'uni-ui-lib'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import { ElMessage } from 'element-plus'
import { computed, reactive, ref } from 'vue'

import { activityApi, activityQuestionnaireApi } from '@/api'
import type { Translate } from '@/types/i18n'
import { normalizeArray } from '@/utils/api-response-normalize'
const emit = defineEmits<{ saved: [] }>()

const { t, locale } = useUniI18n()
const tr = t as Translate

const visible = ref(false)
const saving = ref(false)
const sourceId = ref<string | number | undefined>(undefined)
const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const actOpts = ref<UniOption[]>([])

const form = reactive({
  newName: '',
  newActivityId: undefined as string | number | undefined
})
const formModel = computed({
  get: () => form,
  set: (value: typeof form) => Object.assign(form, value)
})

const formConfig = computed<UniFormConfig>(() => ({
  formProps: { labelPosition: 'top' },
  colProps: { span: 24 },
  rules: {
    newName: [{ required: true, message: tr('activity.ruleInput'), trigger: 'blur' }],
    newActivityId: [{ required: true, message: tr('activity.ruleSelect'), trigger: 'change' }]
  } as UniFormConfig['rules'],
  schema: [
    {
      field: 'newName',
      label: tr('activity.qCopyNewName'),
      component: 'ElInput',
      componentProps: { maxlength: 100, showWordLimit: true }
    },
    {
      field: 'newActivityId',
      label: tr('activity.questionnaireActivity'),
      component: 'ElSelect',
      options: actOpts.value,
      componentProps: { filterable: true, clearable: true, style: { width: '100%' } }
    }
  ]
}))

async function loadActivities() {
  const raw = await activityApi.listBrief.get()
  const rows = normalizeArray(raw) as Record<string, unknown>[]
  actOpts.value = rows.map((x) => ({
    label: String(
      locale.value === 'en'
        ? (x.activityEnName ?? x.activityCnName)
        : (x.activityCnName ?? x.activityEnName ?? x.id)
    ),
    value: x.id as string | number
  }))
}

const onClosed = () => {
  sourceId.value = undefined
  form.newName = ''
  form.newActivityId = undefined
  uniFormRef.value?.clearValidate()
}

const submit = async () => {
  try {
    await uniFormRef.value?.validate()
  } catch {
    return
  }
  if (sourceId.value == null) {
    return
  }
  saving.value = true
  try {
    await activityQuestionnaireApi.copy.post({
      id: sourceId.value,
      newName: form.newName,
      newActivityId: form.newActivityId
    })
    ElMessage.success(tr('activity.saveOk'))
    visible.value = false
    emit('saved')
  } finally {
    saving.value = false
  }
}

defineExpose({
  open: async (row: Record<string, unknown>) => {
    if (row.id == null) {
      return
    }
    sourceId.value = row.id as string | number
    form.newName = String(row.name ?? '')
    form.newActivityId = row.activityId as string | number | undefined
    await loadActivities()
    visible.value = true
  }
})
</script>
