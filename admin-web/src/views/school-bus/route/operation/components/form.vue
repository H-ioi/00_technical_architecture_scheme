<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="1000px"
    destroy-on-close
    @update:model-value="emit('update:visible', $event)"
  >
    <el-form
      v-if="visible"
      ref="formRef"
      label-position="top"
      :model="formModel"
      :rules="rules"
      :disabled="mode === 'look'"
    >
      <div class="school-bus-operation-form__grid">
        <el-form-item
          v-if="multiSchool"
          :label="$t('schoolBus.routeOperation.form.school')"
          prop="school"
        >
          <el-select
            v-model="formModel.school"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :placeholder="$t('schoolBus.routeOperation.pleaseSelect')"
            style="width: 100%"
            @change="onSchoolChange"
          >
            <el-option
              v-for="s in schoolRecords"
              :key="String(s.id)"
              :label="(s.enName || s.name || s.cnName || '') as string"
              :value="s.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('schoolBus.routeOperation.form.section')" prop="sectionId">
          <el-select
            v-model="formModel.sectionId"
            :placeholder="$t('schoolBus.routeOperation.pleaseSelect')"
            style="width: 100%"
            filterable
            @change="onSectionChange"
          >
            <el-option
              v-for="s in sectionOptions"
              :key="String(s.id)"
              :label="locale === 'en' ? (s.enName || s.cnName) : (s.cnName || s.enName)"
              :value="s.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('schoolBus.routeOperation.form.line')" prop="lineId">
          <el-select
            v-model="formModel.lineId"
            :placeholder="$t('schoolBus.routeOperation.pleaseSelect')"
            style="width: 100%"
            filterable
            @change="onLineChange"
          >
            <el-option
              v-for="l in lineOptionsFiltered"
              :key="String(l.id)"
              :label="locale === 'en' ? (l.enName || l.cnName) : (l.cnName || l.enName)"
              :value="l.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('schoolBus.routeOperation.form.station')" prop="stationId">
          <el-select
            v-model="formModel.stationId"
            :placeholder="$t('schoolBus.routeOperation.pleaseSelect')"
            style="width: 100%"
            filterable
          >
            <el-option
              v-for="st in stationOptionsFiltered"
              :key="String(st.id)"
              :label="locale === 'en' ? (st.enName || st.cnName) : (st.cnName || st.enName)"
              :value="st.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('schoolBus.routeOperation.form.timeType')" prop="schoolTimeType">
          <el-select
            v-model="formModel.schoolTimeType"
            :placeholder="$t('schoolBus.routeOperation.pleaseSelect')"
            style="width: 100%"
          >
            <el-option
              v-for="o in timeTypes"
              :key="o.value"
              :label="o.label"
              :value="o.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('schoolBus.routeOperation.form.car')" prop="carId">
          <el-select
            v-model="formModel.carId"
            :placeholder="$t('schoolBus.routeOperation.pleaseSelect')"
            style="width: 100%"
            filterable
            @change="onCarChange"
          >
            <el-option
              v-for="c in carList"
              :key="String(c.id)"
              :label="String(c.carNumber ?? c.id)"
              :value="c.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('schoolBus.routeOperation.form.teacher')" prop="carTeacher">
          <el-input v-model="formModel.carTeacher" disabled />
        </el-form-item>
        <el-form-item :label="$t('schoolBus.routeOperation.form.driver')" prop="driver">
          <el-input v-model="formModel.driver" disabled />
        </el-form-item>
        <el-form-item :label="$t('schoolBus.routeOperation.form.seats')" prop="seatNumber">
          <el-input v-model="formModel.seatNumber" disabled />
        </el-form-item>
        <el-form-item :label="$t('schoolBus.routeOperation.form.rideDate')" prop="rideDate">
          <el-date-picker
            v-model="formModel.rideDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="$t('schoolBus.routeOperation.form.arrivalTime')" prop="arrivalTime">
          <el-date-picker
            v-model="formModel.arrivalTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="$t('schoolBus.routeOperation.columns.remark')" prop="remark" class="school-bus-operation-form__full">
          <el-input v-model="formModel.remark" type="textarea" :rows="4" maxlength="500" show-word-limit />
        </el-form-item>
      </div>
    </el-form>
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
import type { FormInstance, FormRules } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
import { computed, nextTick, ref, watch } from 'vue'

import { schoolBusCommonApi, schoolBusOperationApi } from '@/api'
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

const props = defineProps<{
  visible: boolean
  mode: 'add' | 'edit' | 'look'
  source: OperationRecord | null
  defaultSchoolId: string | number | null
  schoolRecords: SchoolOptionRecord[]
  lineSource: Array<Record<string, unknown>>
  stationSource: Array<Record<string, unknown>>
}>()

const emit = defineEmits<{
  'update:visible': [boolean]
  saved: []
}>()

const { t, locale } = useUniI18n()

const formRef = ref<FormInstance | null>(null)
const submitting = ref(false)
const formModel = ref<OperationFormModel>({})
const sectionOptions = ref<SectionRow[]>([])
const lineOptionsFiltered = ref<LineRow[]>([])
const stationOptionsFiltered = ref<StationRow[]>([])
const carList = ref<LineCar[]>([])

const multiSchool = computed(() => props.schoolRecords.length > 1)

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

const rules = computed<FormRules<OperationFormModel>>(() => ({
  school: multiSchool.value
    ? [{ required: true, message: t('schoolBus.driver.rules.schoolIds'), trigger: 'change' }]
    : [],
  sectionId: [{ required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }],
  lineId: [{ required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }],
  stationId: [{ required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }],
  schoolTimeType: [{ required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }],
  carId: [{ required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }],
  rideDate: [{ required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }],
  arrivalTime: [{ required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }]
}))

const close = () => {
  emit('update:visible', false)
}

const unwrapDetail = (payload: unknown): Record<string, unknown> => {
  if (!payload || typeof payload !== 'object') {
    return {}
  }

  const inner = (payload as { data?: unknown }).data

  if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
    return inner as Record<string, unknown>
  }

  return payload as Record<string, unknown>
}

const unwrapArray = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[]
  }

  if (payload && typeof payload === 'object' && 'data' in payload && Array.isArray((payload as { data: unknown }).data)) {
    return (payload as { data: T[] }).data
  }

  return []
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

  sectionOptions.value = unwrapArray<SectionRow>(
    await schoolBusCommonApi.sectionList.get({ schoolIds: ids })
  )
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

  const rawLines = unwrapArray<LineRow>(
    await schoolBusCommonApi.lineList.get({
      schoolIds: schoolIdsForApi(),
      sectionId
    })
  )

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

  const st = unwrapArray<StationRow>(
    await schoolBusCommonApi.stationList.get({ lineId })
  )

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
  const row = unwrapDetail(res)

  const schoolIds = row.schoolIds as Array<string | number> | undefined
  const sectionId = row.sectionId as string | number | undefined
  const lineId = row.lineId as string | number | undefined
  const stationId = row.stationId as string | number | undefined
  const carId = row.carId as string | number | undefined

  sectionOptions.value = unwrapArray<SectionRow>(
    await schoolBusCommonApi.sectionList.get({ schoolIds: schoolIds ?? [] })
  )

  lineOptionsFiltered.value = unwrapArray<LineRow>(
    await schoolBusCommonApi.lineList.get({
      schoolIds: schoolIds ?? [],
      sectionId
    })
  )

  if (lineId) {
    stationOptionsFiltered.value = unwrapArray<StationRow>(
      await schoolBusCommonApi.stationList.get({ lineId })
    )
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

watch(
  () => props.visible,
  async (visible) => {
    if (!visible) {
      return
    }

    resetForm()

    await nextTick()
    formRef.value?.clearValidate()

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
      await loadDetail(props.source.id)
    }
  }
)

const submit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)

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
.school-bus-operation-form__grid {
  display: flex;
  flex-wrap: wrap;
  max-height: 560px;
  overflow: auto;
  gap: 0 12px;

  :deep(.el-form-item) {
    width: calc(33.33% - 8px);
    margin-right: 0;
  }
}

.school-bus-operation-form__full {
  width: 100% !important;
}
</style>
