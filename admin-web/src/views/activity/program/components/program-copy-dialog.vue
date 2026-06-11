<template>
  <el-dialog
    v-model="visible"
    :title="$t('activity.programCopyTitle')"
    width="480px"
    destroy-on-close
    append-to-body
    :close-on-click-modal="false"
    @closed="onClosed">
    <UniForm ref="uniFormRef" v-model="form" mode="edit" :config="formConfig" />
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
import { computed, reactive, ref, watch } from 'vue'

import { activityApi, activityProgramApi } from '@/api'
import type { Translate } from '@/types/i18n'
import { normalizeArray } from '@/utils/api-response-normalize'

const props = defineProps<{
  modelValue: boolean
  programIds: Array<string | number>
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  success: []
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

const { t, locale } = useUniI18n()
const tr = t as Translate

const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const saving = ref(false)
const actOpts = ref<UniOption[]>([])

const form = reactive({
  namePrefix: '',
  targetActivityId: undefined as string | number | undefined
})

const formConfig = computed<UniFormConfig>(() => ({
  formProps: { labelPosition: 'top' },
  colProps: { span: 24 },
  schema: [
    {
      field: 'namePrefix',
      label: tr('activity.programNamePrefix'),
      component: 'ElInput',
      componentProps: { maxlength: 100, clearable: true, style: { width: '100%' } },
      rules: [{ required: true, message: tr('activity.ruleInput'), trigger: 'blur' }]
    },
    {
      field: 'targetActivityId',
      label: tr('activity.programTargetActivity'),
      component: 'ElSelect',
      options: actOpts.value,
      componentProps: { filterable: true, clearable: true, style: { width: '100%' } },
      rules: [{ required: true, message: tr('activity.ruleSelect'), trigger: 'change' }]
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

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      form.namePrefix = ''
      form.targetActivityId = undefined
      await loadActivities()
    }
  }
)

const onClosed = () => {
  saving.value = false
  form.namePrefix = ''
  form.targetActivityId = undefined
  uniFormRef.value?.clearValidate?.()
}

const submit = async () => {
  if (!props.programIds.length) {
    ElMessage.warning(tr('activity.programSelRows'))
    return
  }
  try {
    await uniFormRef.value?.validate()
  } catch {
    return
  }
  saving.value = true
  try {
    await activityProgramApi.copyBatch.post({
      sourceProgramIds: props.programIds,
      namePrefix: form.namePrefix,
      targetActivityId: form.targetActivityId as string | number
    })
    ElMessage.success(tr('activity.saveOk'))
    visible.value = false
    emit('success')
  } catch {
    ElMessage.error(tr('activity.saveFail'))
  } finally {
    saving.value = false
  }
}
</script>
