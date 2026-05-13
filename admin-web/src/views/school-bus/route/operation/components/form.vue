<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="1000px"
    destroy-on-close>
    <div
      v-loading="detailLoading"
      class="school-bus-operation-form__wrap"
      :element-loading-text="$t('common.loading')">
      <UniForm
        ref="uniFormRef"
        v-model="formModel"
        :mode="uniFormMode"
        :config="dialogFormConfig" />
    </div>
    <template #footer>
      <el-button @click="close">{{ $t('schoolBus.driver.actions.cancel') }}</el-button>
      <el-button v-if="mode !== 'look'" type="primary" :loading="submitting" @click="submit">
        {{ $t('schoolBus.driver.actions.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { FormRules } from 'element-plus'
import type { UniFormConfig } from 'uni-ui-lib'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import { computed, nextTick, ref, watch } from 'vue'

import { schoolBusCommonApi, schoolBusOperationApi } from '@/api'
import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'
import { normalizeArray, normalizeEnvelope } from '@/utils/api-response-normalize'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { OperationFormModel, OperationRecord } from '@/types/modules/school-bus-operation'

type SectionRow = {
  id: string | number
  cnName?: string
  enName?: string
  schoolIds?: number[] | number | string
}

type LineRow = {
  id: string | number
  cnName?: string
  enName?: string
  schoolIds?: number[] | number | string
  carList?: LineCar[]
}

type StationRow = {
  id: string | number
  cnName?: string
  enName?: string
  schoolIds?: number[] | number | string
}

type LineCar = {
  id: string | number
  carNumber?: string
  carTeacher?: string
  seatNumber?: string | number
  driverInfo?: { name?: string }
}

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  mode: 'add' | 'edit' | 'look'
  source: OperationRecord | null
  defaultSchoolId: string | number | null
  schoolRecords: SchoolOptionRecord[]
  lineSource: Array<Record<string, unknown>>
  stationSource: Array<Record<string, unknown>>
}>()

const emit = defineEmits<{
  saved: []
}>()

const { t, locale } = useUniI18n()
const { detailLoading, runWithDetailLoading } = useDialogDetailLoading()

const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const formModel = ref<OperationFormModel>({})
const sectionOptions = ref<SectionRow[]>([])
const lineOptionsFiltered = ref<LineRow[]>([])
const stationOptionsFiltered = ref<StationRow[]>([])
const carList = ref<LineCar[]>([])

const multiSchool = computed(() => props.schoolRecords.length > 1)
const isLook = computed(() => props.mode === 'look')
const uniFormMode = computed(() => (isLook.value ? 'view' : 'edit'))

const title = computed(() =>
  t(
    props.mode === 'add'
      ? 'schoolBus.driver.actions.add'
      : props.mode === 'look'
        ? 'schoolBus.driver.actions.look'
        : 'schoolBus.driver.actions.edit'
  )
)

const timeTypes = computed(() => [
  { value: '1', label: t('schoolBus.routeOperation.form.schoolTrip') },
  { value: '2', label: t('schoolBus.routeOperation.form.homeTrip') }
])

const schoolUniOptions = computed(() =>
  props.schoolRecords.map((s) => ({
    label: (s.enName || s.name || s.cnName || '') as string,
    value: s.id
  }))
)

const sectionUniOptions = computed(() =>
  sectionOptions.value.map((s) => ({
    label: (locale.value === 'en' ? s.enName || s.cnName : s.cnName || s.enName) as string,
    value: s.id
  }))
)

const lineUniOptions = computed(() =>
  lineOptionsFiltered.value.map((l) => ({
    label: (locale.value === 'en' ? l.enName || l.cnName : l.cnName || l.enName) as string,
    value: l.id
  }))
)

const stationUniOptions = computed(() =>
  stationOptionsFiltered.value.map((st) => ({
    label: (locale.value === 'en' ? st.enName || st.cnName : st.cnName || st.enName) as string,
    value: st.id
  }))
)

const carUniOptions = computed(() =>
  carList.value.map((c) => ({
    label: String(c.carNumber ?? c.id),
    value: c.id
  }))
)

const dialogRules = computed<FormRules<OperationFormModel>>(() => {
  const r: FormRules<OperationFormModel> = {
    sectionId: [
      { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }
    ],
    lineId: [
      { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }
    ],
    stationId: [
      { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }
    ],
    schoolTimeType: [
      { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }
    ],
    carId: [
      { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }
    ],
    rideDate: [
      { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }
    ],
    arrivalTime: [
      { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }
    ]
  }

  if (multiSchool.value) {
    r.school = [
      { required: true, message: t('schoolBus.driver.rules.schoolIds'), trigger: 'change' }
    ]
  }

  return r
})

const dialogFormConfig = computed<UniFormConfig>(() => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 12 },
  colProps: { span: 8 },
  rules: (isLook.value ? {} : dialogRules.value) as UniFormConfig['rules'],
  schema: [
    {
      field: 'school',
      label: t('schoolBus.routeOperation.form.school'),
      component: 'ElSelect',
      options: schoolUniOptions.value,
      hidden: !multiSchool.value,
      onChange: async (ctx) => {
        await onSchoolChange(ctx.model.school as Array<string | number> | string | number)
      },
      componentProps: {
        multiple: true,
        collapseTags: true,
        collapseTagsTooltip: true,
        filterable: true,
        placeholder: t('schoolBus.routeOperation.pleaseSelect'),
        style: { width: '100%' }
      }
    },
    {
      field: 'sectionId',
      label: t('schoolBus.routeOperation.form.section'),
      component: 'ElSelect',
      options: sectionUniOptions.value,
      onChange: async (ctx) => {
        await onSectionChange(ctx.model.sectionId as string | number | undefined)
      },
      componentProps: {
        filterable: true,
        placeholder: t('schoolBus.routeOperation.pleaseSelect'),
        style: { width: '100%' }
      }
    },
    {
      field: 'lineId',
      label: t('schoolBus.routeOperation.form.line'),
      component: 'ElSelect',
      options: lineUniOptions.value,
      onChange: async (ctx) => {
        await onLineChange(ctx.model.lineId as string | number | undefined)
      },
      componentProps: {
        filterable: true,
        placeholder: t('schoolBus.routeOperation.pleaseSelect'),
        style: { width: '100%' }
      }
    },
    {
      field: 'stationId',
      label: t('schoolBus.routeOperation.form.station'),
      component: 'ElSelect',
      options: stationUniOptions.value,
      componentProps: {
        filterable: true,
        placeholder: t('schoolBus.routeOperation.pleaseSelect'),
        style: { width: '100%' }
      }
    },
    {
      field: 'schoolTimeType',
      label: t('schoolBus.routeOperation.form.timeType'),
      component: 'ElSelect',
      options: timeTypes.value,
      componentProps: {
        placeholder: t('schoolBus.routeOperation.pleaseSelect'),
        style: { width: '100%' }
      }
    },
    {
      field: 'carId',
      label: t('schoolBus.routeOperation.form.car'),
      component: 'ElSelect',
      options: carUniOptions.value,
      onChange: (ctx) => {
        onCarChange(ctx.model.carId as string | number | undefined)
      },
      componentProps: {
        filterable: true,
        placeholder: t('schoolBus.routeOperation.pleaseSelect'),
        style: { width: '100%' }
      }
    },
    {
      field: 'carTeacher',
      label: t('schoolBus.routeOperation.form.teacher'),
      component: 'ElInput',
      componentProps: { disabled: true }
    },
    {
      field: 'driver',
      label: t('schoolBus.routeOperation.form.driver'),
      component: 'ElInput',
      componentProps: { disabled: true }
    },
    {
      field: 'seatNumber',
      label: t('schoolBus.routeOperation.form.seats'),
      component: 'ElInput',
      componentProps: { disabled: true }
    },
    {
      field: 'rideDate',
      label: t('schoolBus.routeOperation.form.rideDate'),
      component: 'ElDatePicker',
      componentProps: {
        type: 'datetime',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        format: 'YYYY-MM-DD HH:mm:ss',
        style: { width: '100%' }
      }
    },
    {
      field: 'arrivalTime',
      label: t('schoolBus.routeOperation.form.arrivalTime'),
      component: 'ElDatePicker',
      componentProps: {
        type: 'datetime',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        format: 'YYYY-MM-DD HH:mm:ss',
        style: { width: '100%' }
      }
    },
    {
      field: 'remark',
      label: t('schoolBus.routeOperation.columns.remark'),
      component: 'ElInput',
      colProps: { span: 24 },
      formItemProps: { class: 'school-bus-operation-form__full' },
      componentProps: { type: 'textarea', rows: 4, maxlength: 500, showWordLimit: true }
    }
  ]
}))

const close = () => {
  visible.value = false
}

const schoolIdsForApi = (): Array<string | number> => {
  const s = formModel.value.school

  if (Array.isArray(s)) {
    return s
  }

  if (s != null && s !== '') {
    return [s as string | number]
  }

  if (!multiSchool.value && props.defaultSchoolId != null) {
    return [props.defaultSchoolId]
  }

  return []
}

const onSchoolChange = async (e: Array<string | number> | string | number) => {
  formModel.value.sectionId = undefined
  formModel.value.lineId = undefined
  formModel.value.stationId = undefined
  formModel.value.carId = undefined
  formModel.value.carTeacher = undefined
  formModel.value.driver = undefined
  formModel.value.seatNumber = undefined
  carList.value = []
  lineOptionsFiltered.value = []
  stationOptionsFiltered.value = []

  const ids = Array.isArray(e) ? e : e != null ? [e] : []

  sectionOptions.value = normalizeArray(
    await schoolBusCommonApi.sectionList.get({ schoolIds: ids })
  ) as SectionRow[]
}

const onSectionChange = async (sectionId: string | number | undefined) => {
  formModel.value.lineId = undefined
  formModel.value.stationId = undefined
  formModel.value.carId = undefined
  formModel.value.carTeacher = undefined
  formModel.value.driver = undefined
  formModel.value.seatNumber = undefined
  carList.value = []
  stationOptionsFiltered.value = []

  const rawLines = normalizeArray(
    await schoolBusCommonApi.lineList.get({
      schoolIds: schoolIdsForApi(),
      sectionId
    })
  ) as LineRow[]

  lineOptionsFiltered.value = rawLines
}

const onLineChange = async (lineId: string | number | undefined) => {
  formModel.value.stationId = undefined
  formModel.value.carId = undefined
  formModel.value.carTeacher = undefined
  formModel.value.driver = undefined
  formModel.value.seatNumber = undefined
  carList.value = []

  if (!lineId) {
    return
  }

  const st = normalizeArray(
    await schoolBusCommonApi.stationList.get({ lineId })
  ) as StationRow[]

  stationOptionsFiltered.value = st

  const line = lineOptionsFiltered.value.find((l) => String(l.id) === String(lineId))
  carList.value = line?.carList ?? []

  if (carList.value.length === 1) {
    const c = carList.value[0]
    formModel.value.carId = c.id
    formModel.value.carTeacher = c.carTeacher
    formModel.value.driver = c.driverInfo?.name
    formModel.value.seatNumber = c.seatNumber
  }
}

const onCarChange = (carId: string | number | undefined) => {
  formModel.value.carTeacher = undefined
  formModel.value.driver = undefined
  formModel.value.seatNumber = undefined

  if (carId == null) {
    return
  }

  const c = carList.value.find((x) => String(x.id) === String(carId))

  if (c) {
    formModel.value.carTeacher = c.carTeacher
    formModel.value.driver = c.driverInfo?.name
    formModel.value.seatNumber = c.seatNumber
  }
}

const resetForm = () => {
  formModel.value = {}
  sectionOptions.value = []
  lineOptionsFiltered.value = []
  stationOptionsFiltered.value = []
  carList.value = []
}

const loadDetail = async (id: string | number) => {
  const res = await schoolBusOperationApi.detail.get(id)
  const row = normalizeEnvelope(res)

  const schoolIds = row.schoolIds as Array<string | number> | undefined
  const sectionId = row.sectionId as string | number | undefined
  const lineId = row.lineId as string | number | undefined
  const stationId = row.stationId as string | number | undefined
  const carId = row.carId as string | number | undefined

  sectionOptions.value = normalizeArray(
    await schoolBusCommonApi.sectionList.get({ schoolIds: schoolIds ?? [] })
  ) as SectionRow[]

  lineOptionsFiltered.value = normalizeArray(
    await schoolBusCommonApi.lineList.get({
      schoolIds: schoolIds ?? [],
      sectionId
    })
  ) as LineRow[]

  if (lineId) {
    stationOptionsFiltered.value = normalizeArray(
      await schoolBusCommonApi.stationList.get({ lineId })
    ) as StationRow[]
  }

  const line = lineOptionsFiltered.value.find((l) => String(l.id) === String(lineId))
  carList.value = line?.carList ?? []

  formModel.value = {
    id: row.id as string | number,
    school: schoolIds,
    sectionId,
    lineId,
    stationId,
    carId,
    rideDate: row.rideDate,
    arrivalTime: row.arrivalTime,
    status: row.status != null ? String(row.status) : undefined,
    schoolTimeType: row.schoolTimeType != null ? String(row.schoolTimeType) : undefined,
    remark: row.remark as string | undefined
  }

  if (carId != null) {
    onCarChange(carId)
  }
}

watch(visible, async (isOpen) => {
  if (!isOpen) {
    return
  }

  resetForm()

  await nextTick()
  uniFormRef.value?.clearValidate()

  if (props.mode === 'add') {
    if (multiSchool.value) {
      formModel.value = {}
    } else if (props.defaultSchoolId != null) {
      formModel.value.school = [props.defaultSchoolId]
      await onSchoolChange([props.defaultSchoolId])
    }

    return
  }

  if ((props.mode === 'edit' || props.mode === 'look') && props.source?.id) {
    await runWithDetailLoading(async () => {
      await loadDetail(props.source!.id)
    })
  }
})

const submit = async () => {
  const valid = await uniFormRef.value?.validate().catch(() => false)

  if (!valid) {
    return
  }

  const data: OperationFormModel = {
    ...formModel.value,
    status: '3'
  }

  if (
    !multiSchool.value &&
    props.defaultSchoolId != null &&
    (data.school == null || (Array.isArray(data.school) && data.school.length === 0))
  ) {
    data.school = [props.defaultSchoolId]
  }

  delete data.carTeacher
  delete data.driver
  delete data.seatNumber

  submitting.value = true

  try {
    if (props.mode === 'add') {
      await schoolBusOperationApi.add.post(data)
    } else {
      await schoolBusOperationApi.edit.post(data)
    }

    ElMessage.success(t('schoolBus.driver.messages.saveSuccess'))
    emit('saved')
    close()
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.school-bus-operation-form__wrap {
  max-height: 560px;
  overflow: auto;
}

.school-bus-operation-form__full {
  width: 100%;
}
</style>
