<template>
  <el-dialog
    v-model="visible"
    :title="dlgTitle"
    width="720px"
    destroy-on-close
    append-to-body
    :close-on-click-modal="false"
    @closed="onClosed">
    <el-alert type="info" show-icon :closable="false" class="activity-q-meta__hint">
      {{ $t('activity.qMetaDesignerHint') }}
    </el-alert>
    <el-form ref="formRef" class="activity-q-meta__form" label-position="top" :model="form" :rules="rules">
      <el-form-item :label="$t('activity.questionnaireName')" prop="name">
        <el-input v-model="form.name" maxlength="255" show-word-limit />
      </el-form-item>
      <el-form-item :label="$t('activity.colSchool')" prop="schoolIds">
        <el-select
          v-model="form.schoolIds"
          multiple
          collapse-tags
          collapse-tags-tooltip
          filterable
          style="width: 100%"
          :placeholder="$t('activity.ruleSelect')"
          @change="onSchoolChange">
          <el-option v-for="o in schoolOpts" :key="String(o.value)" :label="o.label" :value="o.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('activity.questionnaireActivity')" prop="activityId">
        <el-select v-model="form.activityId" filterable clearable style="width: 100%">
          <el-option v-for="o in activityFiltered" :key="String(o.value)" :label="o.label" :value="o.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('activity.questionnaireValid')" prop="status">
        <el-select v-model="form.status" style="width: 100%">
          <el-option :label="$t('activity.qStatusEffective')" :value="1" />
          <el-option :label="$t('activity.qStatusInactive')" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('activity.questionnaireNeedStudent')" prop="needStudentInfo">
        <el-select v-model="form.needStudentInfo" style="width: 100%">
          <el-option v-for="o in ynSel" :key="String(o.value)" :label="o.label" :value="String(o.value)" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('activity.colInstructions')" prop="instructions">
        <el-input v-model="form.instructions" type="textarea" :rows="2" maxlength="100" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="saving" @click="submit">{{ $t('common.submit') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { UniOption } from 'uni-ui-lib'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { computed, reactive, ref } from 'vue'

import { activityApi, activityQuestionnaireApi } from '@/api'
import type { Translate } from '@/types/i18n'
import { normalizeArray, normalizeEnvelope } from '@/utils/api-response-normalize'
import { useUniI18n } from 'uni-ui-lib'

import { yesNoOptions } from '@/views/activity/format-labels'
import { useMembershipSchoolOptions } from '@/views/activity/use-membership-school-options'

const emit = defineEmits<{ saved: [] }>()

type Row = Record<string, unknown>

function schoolOverlap(a: unknown, b: unknown): boolean {
  const arr1 = Array.isArray(a) ? a : []

  const arr2 = Array.isArray(b) ? b : []

  if (!arr1.length || !arr2.length) {
    return false
  }

  const set = new Set(arr1.map((x) => String(x)))

  return arr2.some((item) => set.has(String(item)))
}

const { t, locale } = useUniI18n()
const tr = t as Translate
const { schoolOptions, loadSchoolOptions } = useMembershipSchoolOptions()

const schoolOpts = computed(() => schoolOptions.value)

const ynSel = computed(() => yesNoOptions(tr))

const visible = ref(false)
const saving = ref(false)
const mode = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()
const activityPool = ref<Row[]>([])

const form = reactive({
  id: undefined as string | number | undefined,
  name: '',
  schoolIds: [] as Array<string | number>,
  activityId: undefined as string | number | undefined,
  status: 1 as number,
  needStudentInfo: '0',
  instructions: ''
})

const dlgTitle = computed(() =>
  mode.value === 'add' ? tr('activity.qMetaAddTitle') : tr('activity.qMetaEditTitle')
)

const rules = computed(
  (): FormRules => ({
    name: [{ required: true, message: tr('activity.ruleInput'), trigger: 'blur' }],
    schoolIds: [
      {
        type: 'array',
        required: true,
        min: 1,
        message: tr('activity.ruleSelect'),
        trigger: 'change'
      }
    ],
    activityId: [{ required: true, message: tr('activity.ruleSelect'), trigger: 'change' }],
    status: [{ required: true, message: tr('activity.ruleSelect'), trigger: 'change' }],
    needStudentInfo: [{ required: true, message: tr('activity.ruleSelect'), trigger: 'change' }]
  })
)

const activityFiltered = computed((): UniOption[] => {
  const rows = activityPool.value

  if (!form.schoolIds.length) {
    return []
  }

  return rows
    .filter((activity) => schoolOverlap(activity.schoolIds, form.schoolIds))
    .map((x) => ({
      label: String(
        locale.value === 'en'
          ? x.activityEnName ?? x.activityCnName
          : x.activityCnName ?? x.activityEnName ?? x.id
      ),
      value: x.id as string | number
    }))
})

async function loadActivityPool(questionnaireId?: string) {
  const p: Record<string, unknown> = { questionnaireFlag: 1 }

  if (questionnaireId) {
    p.questionnaireId = questionnaireId
  }

  const raw = await activityApi.listBrief.get(p)

  activityPool.value = normalizeArray(raw) as Row[]
}

function resetForm() {
  form.id = undefined
  form.name = ''
  form.schoolIds = []
  form.activityId = undefined
  form.status = 1
  form.needStudentInfo = '0'
  form.instructions = ''
}

const onSchoolChange = () => {
  const allowed = new Set(activityFiltered.value.map((o) => String(o.value)))

  if (form.activityId != null && !allowed.has(String(form.activityId))) {
    form.activityId = undefined
  }
}

async function fillFromDetail(id: string | number) {
  const raw = await activityQuestionnaireApi.detail.get(id)
  const d = normalizeEnvelope(raw) as Row
  form.id = d.id as string | number
  form.name = String(d.name ?? '')
  form.schoolIds = Array.isArray(d.schoolIds)
    ? (d.schoolIds as unknown[]).map((x) => x as string | number)
    : []
  form.activityId = d.activityId as string | number | undefined
  form.status = Number(d.status ?? 1)
  form.needStudentInfo = String(d.needStudentInfo ?? '0')
  form.instructions = String(d.instructions ?? '')
}

const submit = async () => {
  await formRef.value?.validate()

  const payload: Record<string, unknown> = {
    name: form.name,
    schoolIds: form.schoolIds,
    activityId: form.activityId,
    status: form.status,
    needStudentInfo: form.needStudentInfo,
    instructions: form.instructions
  }

  saving.value = true
  try {
    if (mode.value === 'add') {
      await activityQuestionnaireApi.add.post(payload)
    } else {
      payload.id = form.id
      await activityQuestionnaireApi.edit.post(payload)
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
  formRef.value?.resetFields()
  activityPool.value = []
}

defineExpose({
  open: async (m: 'add' | 'edit', row?: Row) => {
    mode.value = m
    await loadSchoolOptions()
    resetForm()
    if (m === 'edit' && row?.id != null) {
      await loadActivityPool(String(row.id))
      await fillFromDetail(row.id as string | number)
    } else {
      await loadActivityPool()
    }
    visible.value = true
  }
})
</script>

<style scoped lang="scss">
.activity-q-meta__hint {
  margin-bottom: 12px;
}

.activity-q-meta__form {
  margin-top: 4px;
}
</style>
