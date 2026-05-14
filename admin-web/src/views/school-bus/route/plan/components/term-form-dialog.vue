<template>
  <el-dialog
    v-model="modelValue"
    width="520px"
    destroy-on-close
    :close-on-click-modal="false"
    :title="termDialogTitle">
    <div
      v-loading="detailLoading"
      class="term-form-dialog__body"
      :element-loading-text="$t('common.loading')">
      <UniForm ref="uniFormRef" v-model="formModel" mode="edit" :config="formConfig" />
    </div>

    <template #footer>
      <el-button @click="modelValue = false">
        {{ $t('schoolBus.cancel') }}
      </el-button>
      <el-button type="primary" @click="submit">
        {{ $t('schoolBus.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { UniForm, toUniOptions, useUniI18n } from 'uni-ui-lib'
import type { UniFormConfig } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'

import { schoolBusSectionApi } from '@/api'
import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizeSchoolBusDetail } from '@/utils/api-response-normalize'

import { termDialogFormConfig } from '../tab.config'

type Loose = Record<string, unknown>

type TermFormModel = {
  schoolIds: Array<string | number>
  cnName: string
  enName: string
  intentDate: string[]
  serviceDate: string[]
}

const modelValue = defineModel<boolean>({ required: true })

const props = defineProps<{
  schoolRecords: SchoolOptionRecord[]
  defaultSchoolId: string | number | null
  multiSchool: boolean
  /** 非空时为编辑态，打开时拉取详情 */
  editingId?: string | number | null
}>()

const emit = defineEmits<{
  saved: []
}>()

const { locale, t } = useUniI18n()
const { detailLoading, runWithDetailLoading } = useDialogDetailLoading()

const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const formModel = ref<TermFormModel>({
  schoolIds: [],
  cnName: '',
  enName: '',
  intentDate: [],
  serviceDate: []
})

const schoolOptions = computed(() =>
  toUniOptions(props.schoolRecords, {
    labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
    valueKey: 'id'
  })
)

const formConfig = computed<UniFormConfig>(() =>
  termDialogFormConfig(t, schoolOptions.value, props.multiSchool)
)

const termDialogTitle = computed(() =>
  props.editingId != null && props.editingId !== ''
    ? t('schoolBus.routePlan.editTerm')
    : t('schoolBus.routePlan.addTerm')
)

const reset = () => {
  formModel.value = {
    schoolIds: !props.multiSchool && props.defaultSchoolId != null ? [props.defaultSchoolId] : [],
    cnName: '',
    enName: '',
    intentDate: [],
    serviceDate: []
  }

  uniFormRef.value?.clearValidate()
}

const normalizeSchoolIdsFromBody = (raw: unknown): Array<string | number> => {
  if (Array.isArray(raw)) {
    return raw.filter((x) => x !== '' && x != null) as Array<string | number>
  }

  if (raw == null || raw === '') {
    return []
  }

  if (typeof raw === 'string' && raw.includes(',')) {
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter((x) => x !== '')
  }

  return [raw as string | number]
}

const loadDetail = async () => {
  const id = props.editingId

  if (id == null || id === '') {
    return
  }

  const raw = await schoolBusSectionApi.detail.get(id)
  const body = normalizeSchoolBusDetail(raw)

  if (!body) {
    return
  }

  const schoolIds = normalizeSchoolIdsFromBody(body.schoolIds)

  formModel.value = {
    schoolIds,
    cnName: String(body.cnName ?? ''),
    enName: String(body.enName ?? ''),
    intentDate:
      body.intentStartDate && body.intentEndDate
        ? [String(body.intentStartDate).slice(0, 10), String(body.intentEndDate).slice(0, 10)]
        : [],
    serviceDate:
      body.serviceStartDate && body.serviceEndDate
        ? [String(body.serviceStartDate).slice(0, 10), String(body.serviceEndDate).slice(0, 10)]
        : []
  }
}

watch(
  () => [modelValue.value, props.editingId] as const,
  async ([open]) => {
    if (!open) {
      return
    }

    if (props.editingId != null && props.editingId !== '') {
      await runWithDetailLoading(loadDetail)
    } else {
      reset()
    }
  }
)

const normalizeSchoolIds = () => {
  const s = formModel.value.schoolIds

  return Array.isArray(s) ? s : s != null && s !== '' ? [s as string | number] : []
}

const submit = async () => {
  const valid = await uniFormRef.value?.validate().catch(() => false)

  if (!valid) {
    return
  }

  const schoolIds = normalizeSchoolIds()

  if (schoolIds.length === 0) {
    ElMessage.warning(t('schoolBus.pleaseSelect'))

    return
  }

  const intent = formModel.value.intentDate
  const service = formModel.value.serviceDate

  if (!intent?.[0] || !intent[1] || !service?.[0] || !service[1]) {
    ElMessage.warning(t('schoolBus.pleaseSelect'))

    return
  }

  const payload: Loose = {
    schoolIds,
    cnName: formModel.value.cnName,
    enName: formModel.value.enName,
    intentStartDate: intent[0],
    intentEndDate: intent[1],
    serviceStartDate: service[0],
    serviceEndDate: service[1]
  }

  const eid = props.editingId

  if (eid != null && eid !== '') {
    payload.id = eid
    await schoolBusSectionApi.edit.post(payload)
  } else {
    await schoolBusSectionApi.add.post(payload)
  }

  ElMessage.success(t('schoolBus.saveSuccess'))
  modelValue.value = false
  emit('saved')
}
</script>
