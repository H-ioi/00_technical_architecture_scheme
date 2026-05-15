<template>
  <el-dialog v-model="visible" :title="title" width="1000px" destroy-on-close>
    <div
      v-loading="detailLoading"
      class="school-bus-exception-form__wrap"
      :element-loading-text="$t('common.loading')">
      <UniForm
        ref="uniFormRef"
        v-model="formModel"
        :mode="uniFormMode"
        :config="dialogFormConfig" />
    </div>
    <template #footer>
      <el-button @click="close">{{ $t('schoolBus.cancel') }}</el-button>
      <el-button v-if="mode !== 'look'" type="primary" :loading="submitting" @click="submit">
        {{ $t('schoolBus.submit') }}
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

import { schoolBusCommonApi, schoolBusExceptionApi } from '@/api'
import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'
import { normalizeArray, normalizeEnvelope } from '@/utils/api-response-normalize'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { ExceptionFormModel, ExceptionRecord } from '@/types/modules/school-bus-exception'

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

type LineCar = {
  id: string | number
  carNumber?: string
  carTeacher?: string
  driverInfo?: { name?: string }
}

type CarRow = {
  id: string | number
  carNumber?: string
  driverInfo?: { name?: string }
}

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  mode: 'add' | 'edit' | 'look'
  source: ExceptionRecord | null
  defaultSchoolId: string | number | null
  schoolRecords: SchoolOptionRecord[]
}>()

const emit = defineEmits<{
  saved: []
}>()

const { t, locale } = useUniI18n()
const { detailLoading, runWithDetailLoading } = useDialogDetailLoading()

const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const formModel = ref<ExceptionFormModel>({})
const sectionOptions = ref<SectionRow[]>([])
const lineOptionsFiltered = ref<LineRow[]>([])
const carList = ref<LineCar[]>([])
const dispatchCarList = ref<CarRow[]>([])

const multiSchool = computed(() => props.schoolRecords.length > 1)
const isLook = computed(() => props.mode === 'look')
const uniFormMode = computed(() => (isLook.value ? 'view' : 'edit'))

const title = computed(() =>
  t(
    props.mode === 'add'
      ? 'schoolBus.add'
      : props.mode === 'look'
        ? 'schoolBus.look'
        : 'schoolBus.edit'
  )
)

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

const carUniOptions = computed(() =>
  carList.value.map((c) => ({
    label: String(c.carNumber ?? c.id),
    value: c.id
  }))
)

const dispatchCarUniOptions = computed(() =>
  dispatchCarList.value.map((c) => ({
    label: String(c.carNumber ?? c.id),
    value: c.id
  }))
)

const exceptionTypeUniOptions = computed(() => [
  { label: t('schoolBus.routeException.excTypeBehavior'), value: '0' },
  { label: t('schoolBus.routeException.excTypeVehicle'), value: '1' }
])

const needDispatchUniOptions = computed(() => [
  { label: t('schoolBus.routeException.optYes'), value: 1 },
  { label: t('schoolBus.routeException.optNo'), value: 0 }
])

const dialogRules = computed<FormRules<ExceptionFormModel>>(() => {
  const r: FormRules<ExceptionFormModel> = {
    sectionId: [{ required: true, message: t('schoolBus.pleaseSelect'), trigger: 'change' }],
    lineId: [{ required: true, message: t('schoolBus.pleaseSelect'), trigger: 'change' }],
    carId: [{ required: true, message: t('schoolBus.pleaseSelect'), trigger: 'change' }],
    exceptionDate: [{ required: true, message: t('schoolBus.pleaseSelect'), trigger: 'change' }],
    exceptionType: [{ required: true, message: t('schoolBus.pleaseSelect'), trigger: 'change' }],
    details: [{ required: true, message: t('schoolBus.pleaseSelect'), trigger: 'blur' }]
  }

  if (multiSchool.value) {
    r.school = [{ required: true, message: t('schoolBus.driver.ruleSchoolIds'), trigger: 'change' }]
  }

  if (formModel.value.exceptionType === '1') {
    r.needDispatch = [{ required: true, message: t('schoolBus.pleaseSelect'), trigger: 'change' }]
    if (formModel.value.needDispatch === 1) {
      r.dispatchCarId = [
        { required: true, message: t('schoolBus.pleaseSelect'), trigger: 'change' }
      ]
    }
  }

  return r
})

const dialogFormConfig = computed<UniFormConfig>(() => {
  const hideNeedDispatch = formModel.value.exceptionType !== '1'
  const hideDispatch = formModel.value.needDispatch !== 1

  return {
    formProps: { labelPosition: 'top' },
    rowProps: { gutter: 12 },
    colProps: { span: 8 },
    rules: (isLook.value ? {} : dialogRules.value) as UniFormConfig['rules'],
    schema: [
      {
        field: 'school',
        label: t('schoolBus.routeException.formSchool'),
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
          placeholder: t('schoolBus.pleaseSelect'),
          style: { width: '100%' }
        }
      },
      {
        field: 'sectionId',
        label: t('schoolBus.routeException.formSection'),
        component: 'ElSelect',
        options: sectionUniOptions.value,
        onChange: async (ctx) => {
          await onSectionChange(ctx.model.sectionId as string | number | undefined)
        },
        componentProps: {
          filterable: true,
          placeholder: t('schoolBus.pleaseSelect'),
          style: { width: '100%' }
        }
      },
      {
        field: 'lineId',
        label: t('schoolBus.routeException.formLine'),
        component: 'ElSelect',
        options: lineUniOptions.value,
        onChange: (ctx) => {
          onLineChange(ctx.model.lineId as string | number | undefined)
        },
        componentProps: {
          filterable: true,
          placeholder: t('schoolBus.pleaseSelect'),
          style: { width: '100%' }
        }
      },
      {
        field: 'carId',
        label: t('schoolBus.routeException.formCar'),
        component: 'ElSelect',
        options: carUniOptions.value,
        onChange: (ctx) => {
          onCarChange(ctx.model.carId as string | number | undefined)
        },
        componentProps: {
          filterable: true,
          placeholder: t('schoolBus.pleaseSelect'),
          style: { width: '100%' }
        }
      },
      {
        field: 'carTeacher',
        label: t('schoolBus.routeException.formTeacher'),
        component: 'ElInput',
        componentProps: { disabled: true }
      },
      {
        field: 'driver',
        label: t('schoolBus.routeException.formDriver'),
        component: 'ElInput',
        componentProps: { disabled: true }
      },
      {
        field: 'exceptionDate',
        label: t('schoolBus.routeException.formExceptionDate'),
        component: 'ElDatePicker',
        componentProps: {
          type: 'datetime',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
          format: 'YYYY-MM-DD HH:mm',
          style: { width: '100%' }
        }
      },
      {
        field: 'exceptionType',
        label: t('schoolBus.routeException.formExceptionType'),
        component: 'ElSelect',
        options: exceptionTypeUniOptions.value,
        onChange: (ctx) => {
          onExceptionTypeChange(String(ctx.model.exceptionType ?? ''))
        },
        componentProps: {
          placeholder: t('schoolBus.pleaseSelect'),
          style: { width: '100%' }
        }
      },
      {
        field: 'needDispatch',
        label: t('schoolBus.routeException.formNeedDispatch'),
        component: 'ElSelect',
        options: needDispatchUniOptions.value,
        hidden: hideNeedDispatch,
        onChange: (ctx) => {
          onNeedDispatchChange(ctx.model.needDispatch as number | undefined)
        },
        componentProps: {
          placeholder: t('schoolBus.pleaseSelect'),
          style: { width: '100%' }
        }
      },
      {
        field: 'dispatchCarId',
        label: t('schoolBus.routeException.formDispatchCar'),
        component: 'ElSelect',
        options: dispatchCarUniOptions.value,
        hidden: hideDispatch,
        onChange: (ctx) => {
          onDispatchCarChange(ctx.model.dispatchCarId as string | number | undefined)
        },
        componentProps: {
          filterable: true,
          placeholder: t('schoolBus.pleaseSelect'),
          style: { width: '100%' }
        }
      },
      {
        field: 'dispatchDriver',
        label: t('schoolBus.routeException.formDispatchDriver'),
        component: 'ElInput',
        hidden: hideDispatch,
        componentProps: { disabled: true }
      },
      {
        field: 'details',
        label: t('schoolBus.routeException.colDetails'),
        component: 'ElInput',
        colProps: { span: 24 },
        formItemProps: { class: 'school-bus-exception-form__full' },
        componentProps: { type: 'textarea', rows: 4, maxlength: 500, showWordLimit: true }
      }
    ]
  }
})

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
  formModel.value.carId = undefined
  formModel.value.carTeacher = undefined
  formModel.value.driver = undefined
  formModel.value.dispatchCarId = undefined
  formModel.value.dispatchDriver = undefined
  carList.value = []
  lineOptionsFiltered.value = []
  dispatchCarList.value = []

  const ids = Array.isArray(e) ? e : e != null ? [e] : []

  sectionOptions.value = normalizeArray(
    await schoolBusCommonApi.sectionList.get({ schoolIds: ids })
  ) as SectionRow[]

  dispatchCarList.value = normalizeArray(
    await schoolBusCommonApi.carinfoList.get({ isAll: 0, schoolIds: ids })
  ) as CarRow[]
}

const onSectionChange = async (sectionId: string | number | undefined) => {
  formModel.value.lineId = undefined
  formModel.value.carId = undefined
  formModel.value.carTeacher = undefined
  formModel.value.driver = undefined
  carList.value = []

  lineOptionsFiltered.value = normalizeArray(
    await schoolBusCommonApi.lineList.get({
      schoolIds: schoolIdsForApi(),
      sectionId
    })
  ) as LineRow[]
}

const onLineChange = (lineId: string | number | undefined) => {
  formModel.value.carId = undefined
  formModel.value.carTeacher = undefined
  formModel.value.driver = undefined
  carList.value = []

  if (!lineId) {
    return
  }

  const line = lineOptionsFiltered.value.find((l) => String(l.id) === String(lineId))
  carList.value = line?.carList ?? []

  if (carList.value.length === 1) {
    const c = carList.value[0]
    formModel.value.carId = c.id
    formModel.value.carTeacher = c.carTeacher
    formModel.value.driver = c.driverInfo?.name
  }
}

const onCarChange = (carId: string | number | undefined) => {
  formModel.value.carTeacher = undefined
  formModel.value.driver = undefined

  if (carId == null) {
    return
  }

  const c = carList.value.find((x) => String(x.id) === String(carId))

  if (c) {
    formModel.value.carTeacher = c.carTeacher
    formModel.value.driver = c.driverInfo?.name
  }
}

const onDispatchCarChange = (carId: string | number | undefined) => {
  formModel.value.dispatchDriver = undefined

  if (carId == null) {
    return
  }

  const c = dispatchCarList.value.find((x) => String(x.id) === String(carId))

  if (c) {
    formModel.value.dispatchDriver = c.driverInfo?.name
  }
}

const onExceptionTypeChange = (v: string) => {
  if (v === '0') {
    formModel.value.needDispatch = 0
    onNeedDispatchChange(0)
  }
}

const onNeedDispatchChange = (v: number | undefined) => {
  if (!v) {
    formModel.value.dispatchCarId = undefined
    formModel.value.dispatchDriver = undefined
  }
}

const resetForm = () => {
  formModel.value = {}
  sectionOptions.value = []
  lineOptionsFiltered.value = []
  carList.value = []
  dispatchCarList.value = []
}

const loadDetail = async (id: string | number) => {
  const res = await schoolBusExceptionApi.detail.get(id)
  const row = normalizeEnvelope(res)

  const schoolIds = row.schoolIds as Array<string | number> | undefined
  const sectionId = row.sectionId as string | number | undefined
  const lineId = row.lineId as string | number | undefined
  const carId = row.carId as string | number | undefined
  const dispatchCarId = row.dispatchCarId as string | number | undefined

  sectionOptions.value = normalizeArray(
    await schoolBusCommonApi.sectionList.get({ schoolIds: schoolIds ?? [] })
  ) as SectionRow[]

  lineOptionsFiltered.value = normalizeArray(
    await schoolBusCommonApi.lineList.get({
      schoolIds: schoolIds ?? [],
      sectionId
    })
  ) as LineRow[]

  const line = lineOptionsFiltered.value.find((l) => String(l.id) === String(lineId))
  carList.value = line?.carList ?? []

  dispatchCarList.value = normalizeArray(
    await schoolBusCommonApi.carinfoList.get({ isAll: 0, schoolIds: schoolIds ?? [] })
  ) as CarRow[]

  formModel.value = {
    id: row.id as string | number,
    school: schoolIds,
    sectionId,
    lineId,
    carId,
    exceptionDate: row.exceptionDate,
    exceptionType: row.exceptionType != null ? String(row.exceptionType) : undefined,
    needDispatch: row.needDispatch as number | undefined,
    dispatchCarId,
    details: row.details as string | undefined
  }

  if (carId != null) {
    onCarChange(carId)
  }

  if (dispatchCarId != null) {
    onDispatchCarChange(dispatchCarId)
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

  const data: ExceptionFormModel = {
    ...formModel.value
  }

  if (
    !multiSchool.value &&
    props.defaultSchoolId != null &&
    (data.school == null || data.school.length === 0)
  ) {
    data.school = [props.defaultSchoolId]
  }

  delete data.carTeacher
  delete data.driver
  delete data.dispatchDriver

  if (data.needDispatch !== 1) {
    delete data.dispatchCarId
  }

  submitting.value = true

  try {
    if (props.mode === 'add') {
      await schoolBusExceptionApi.add.post(data)
    } else {
      await schoolBusExceptionApi.edit.post(data)
    }

    ElMessage.success(t('schoolBus.saveSuccess'))
    emit('saved')
    close()
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.school-bus-exception-form {
  &__wrap {
    max-height: 560px;
    overflow: auto;
  }

  &__full {
    width: 100%;
  }
}
</style>
