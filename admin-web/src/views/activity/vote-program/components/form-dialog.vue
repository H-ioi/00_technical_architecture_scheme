<template>
  <el-dialog
    v-model="visible"
    :title="dlgTitle"
    width="760px"
    destroy-on-close
    append-to-body
    :close-on-click-modal="false"
    @closed="onClosed">
    <UniForm
      ref="uniFormRef"
      v-model="form"
      :mode="formMode"
      class="activity-vote-program-form"
      :config="formConfig" />
    <template v-if="mode !== 'view'" #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="saving" @click="submit">
        {{ $t('common.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { UniFormConfig, UniOption } from 'uni-ui-lib'
import { UniForm, toUniOptions, useUniI18n } from 'uni-ui-lib'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'

import { activityProgramApi, activityVoteProgramApi } from '@/api'
import type { ActivityVoteProgramFormModel } from '@/types/modules/activity-vote-program'
import type { Translate } from '@/types/i18n'
import { normalizeArray, normalizeEnvelope } from '@/utils/api-response-normalize'

const emit = defineEmits<{ saved: [] }>()

type Row = Record<string, unknown>

const { t, locale } = useUniI18n()
const tr = t as Translate

const visible = ref(false)
const saving = ref(false)
const mode = ref<'add' | 'edit' | 'view'>('add')
const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const programOptions = ref<UniOption[]>([])
const bindProgramId = ref<string | number | undefined>()

const form = ref<ActivityVoteProgramFormModel>({
  id: undefined,
  cnName: '',
  enName: '',
  programId: undefined,
  performer: ''
})

const formMode = computed(() => (mode.value === 'view' ? 'view' : 'edit'))

const dlgTitle = computed(() => {
  if (mode.value === 'add') {
    return tr('activity.voteProgramAddTitle')
  }
  if (mode.value === 'view') {
    return tr('activity.voteProgramDetailTitle')
  }
  return tr('activity.voteProgramEditTitle')
})

const formConfig = computed<UniFormConfig>(() => ({
  formProps: { labelPosition: 'top' },
  colProps: { span: 24 },
  rules: {
    cnName: [{ required: true, message: tr('activity.ruleInput'), trigger: 'blur' }],
    enName: [{ required: true, message: tr('activity.ruleInput'), trigger: 'blur' }],
    programId: [{ required: true, message: tr('activity.ruleSelect'), trigger: 'change' }],
    performer: [{ required: true, message: tr('activity.ruleInput'), trigger: 'blur' }]
  } as UniFormConfig['rules'],
  schema: [
    {
      field: 'cnName',
      label: tr('activity.eventNameCn'),
      component: 'ElInput',
      componentProps: { maxlength: 100, showWordLimit: true }
    },
    {
      field: 'enName',
      label: tr('activity.eventNameEn'),
      component: 'ElInput',
      componentProps: { maxlength: 100, showWordLimit: true }
    },
    ...(bindProgramId.value
      ? []
      : [
          {
            field: 'programId',
            label: tr('activity.voteProgramProject'),
            component: 'ElSelect' as const,
            options: programOptions.value,
            componentProps: {
              filterable: true,
              clearable: true,
              placeholder: tr('activity.ruleSelect'),
              style: { width: '100%' }
            }
          }
        ]),
    {
      field: 'performer',
      label: tr('activity.votePerformer'),
      component: 'ElInput',
      componentProps: { type: 'textarea', rows: 4, maxlength: 200, showWordLimit: true }
    }
  ]
}))

function resetForm() {
  form.value = {
    id: undefined,
    cnName: '',
    enName: '',
    programId: undefined,
    performer: ''
  }
}

async function loadProgramOptions() {
  const raw = await activityProgramApi.listBrief.get({ programTypes: ['2'] })
  const rows = normalizeArray(raw) as Row[]
  programOptions.value = toUniOptions(rows, {
    labelKeys:
      locale.value === 'en'
        ? ['enName', 'cnName', 'programName']
        : ['cnName', 'enName', 'programName'],
    valueKey: 'id'
  })
}

async function fillFromDetail(id: string | number) {
  const raw = await activityVoteProgramApi.detail.get(id)
  const d = normalizeEnvelope(raw) as Row
  form.value = {
    id,
    cnName: String(d.cnName ?? ''),
    enName: String(d.enName ?? ''),
    programId: d.programId as string | number | undefined,
    performer: String(d.performer ?? '')
  }
}

const submit = async () => {
  try {
    await uniFormRef.value?.validate()
  } catch {
    return
  }

  const payload: Record<string, unknown> = {
    cnName: form.value.cnName,
    enName: form.value.enName,
    programId: form.value.programId,
    performer: form.value.performer
  }

  saving.value = true
  try {
    if (mode.value === 'add') {
      await activityVoteProgramApi.add.post(payload)
    } else {
      payload.id = form.value.id
      await activityVoteProgramApi.edit.post(payload)
    }
    ElMessage.success(tr('activity.saveOk'))
    visible.value = false
    emit('saved')
  } finally {
    saving.value = false
  }
}

const onClosed = () => {
  resetForm()
  bindProgramId.value = undefined
  uniFormRef.value?.clearValidate()
}

defineExpose({
  open: async (m: 'add' | 'edit' | 'view', row?: Row, opts?: { bindProgramId?: string | number }) => {
    mode.value = m
    bindProgramId.value = opts?.bindProgramId
    resetForm()
    if (bindProgramId.value != null && bindProgramId.value !== '') {
      form.value.programId = bindProgramId.value
    }
    if (!bindProgramId.value) {
      await loadProgramOptions()
    }
    if (m !== 'add' && row?.id != null) {
      await fillFromDetail(row.id as string | number)
    }
    visible.value = true
  }
})
</script>

<style scoped lang="scss">
.activity-vote-program-form {
  margin-top: 4px;
}
</style>
