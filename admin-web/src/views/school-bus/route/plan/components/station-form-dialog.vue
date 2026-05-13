<template>
  <el-dialog
    v-model="modelValue"
    width="520px"
    destroy-on-close
    :close-on-click-modal="false"
    :title="stationDialogTitle">
    <div
      v-loading="detailLoading"
      class="station-form-dialog__body"
      :element-loading-text="$t('common.loading')">
      <UniForm ref="uniFormRef" v-model="formModel" mode="edit" :config="formConfig" />
    </div>

    <template #footer>
      <el-button @click="modelValue = false">
        {{ $t('schoolBus.driver.actions.cancel') }}
      </el-button>
      <el-button type="primary" @click="submit">
        {{ $t('schoolBus.driver.actions.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { UniForm, toUniOptions, useUniI18n } from 'uni-ui-lib'
import type { UniFormConfig } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'

import { schoolBusStationApi } from '@/api'
import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizeSchoolBusDetail } from '@/utils/api-response-normalize'

import { stationDialogFormConfig } from '../tab.config'

type Loose = Record<string, unknown>

type StationFormModel = {
  schoolIds: Array<string | number>
  cnName: string
  enName: string
}

const modelValue = defineModel<boolean>({ required: true })

const props = defineProps<{
  schoolRecords: SchoolOptionRecord[]
  defaultSchoolId: string | number | null
  multiSchool: boolean
  editingId?: string | number | null
}>()

const emit = defineEmits<{
  saved: []
}>()

const { locale, t } = useUniI18n()
const { detailLoading, runWithDetailLoading } = useDialogDetailLoading()

const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const formModel = ref<StationFormModel>({
  schoolIds: [],
  cnName: '',
  enName: ''
})

const schoolOptions = computed(() =>
  toUniOptions(props.schoolRecords, {
    labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
    valueKey: 'id'
  })
)

const formConfig = computed<UniFormConfig>(() =>
  stationDialogFormConfig(t, schoolOptions.value, props.multiSchool)
)

const stationDialogTitle = computed(() =>
  props.editingId != null && props.editingId !== ''
    ? t('schoolBus.routePlan.actions.editStation')
    : t('schoolBus.routePlan.actions.addStation')
)

const reset = () => {
  formModel.value = {
    schoolIds: !props.multiSchool && props.defaultSchoolId != null ? [props.defaultSchoolId] : [],
    cnName: '',
    enName: ''
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

  const raw = await schoolBusStationApi.detail.get(id)
  const body = normalizeSchoolBusDetail(raw)

  if (!body) {
    return
  }

  formModel.value = {
    schoolIds: normalizeSchoolIdsFromBody(body.schoolIds),
    cnName: String(body.cnName ?? ''),
    enName: String(body.enName ?? '')
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
    ElMessage.warning(t('schoolBus.routeOperation.pleaseSelect'))

    return
  }

  const payload: Loose = {
    schoolIds,
    cnName: formModel.value.cnName,
    enName: formModel.value.enName
  }

  const eid = props.editingId

  if (eid != null && eid !== '') {
    payload.id = eid
    await schoolBusStationApi.edit.post(payload)
  } else {
    await schoolBusStationApi.add.post(payload)
  }

  ElMessage.success(t('schoolBus.driver.messages.saveSuccess'))
  modelValue.value = false
  emit('saved')
}
</script>
