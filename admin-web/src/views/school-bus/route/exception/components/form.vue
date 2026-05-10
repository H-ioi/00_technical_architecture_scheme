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
      <div class="school-bus-exception-form__grid">
        <el-form-item
          v-if="multiSchool"
          :label="$t('schoolBus.routeException.form.school')"
          prop="school"
        >
          <el-select
            v-model="formModel.school"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :placeholder="$t('schoolBus.routeException.pleaseSelect')"
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
        <el-form-item :label="$t('schoolBus.routeException.form.section')" prop="sectionId">
          <el-select
            v-model="formModel.sectionId"
            :placeholder="$t('schoolBus.routeException.pleaseSelect')"
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
        <el-form-item :label="$t('schoolBus.routeException.form.line')" prop="lineId">
          <el-select
            v-model="formModel.lineId"
            :placeholder="$t('schoolBus.routeException.pleaseSelect')"
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
        <el-form-item :label="$t('schoolBus.routeException.form.car')" prop="carId">
          <el-select
            v-model="formModel.carId"
            :placeholder="$t('schoolBus.routeException.pleaseSelect')"
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
        <el-form-item :label="$t('schoolBus.routeException.form.teacher')" prop="carTeacher">
          <el-input v-model="formModel.carTeacher" disabled />
        </el-form-item>
        <el-form-item :label="$t('schoolBus.routeException.form.driver')" prop="driver">
          <el-input v-model="formModel.driver" disabled />
        </el-form-item>
        <el-form-item :label="$t('schoolBus.routeException.form.exceptionDate')" prop="exceptionDate">
          <el-date-picker
            v-model="formModel.exceptionDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="$t('schoolBus.routeException.form.exceptionType')" prop="exceptionType">
          <el-select
            v-model="formModel.exceptionType"
            :placeholder="$t('schoolBus.routeException.pleaseSelect')"
            style="width: 100%"
            @change="onExceptionTypeChange"
          >
            <el-option :label="$t('schoolBus.routeException.exceptionType.behavior')" value="0" />
            <el-option :label="$t('schoolBus.routeException.exceptionType.vehicle')" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formModel.exceptionType === '1'"
          :label="$t('schoolBus.routeException.form.needDispatch')"
          prop="needDispatch"
        >
          <el-select
            v-model="formModel.needDispatch"
            :placeholder="$t('schoolBus.routeException.pleaseSelect')"
            style="width: 100%"
            @change="onNeedDispatchChange"
          >
            <el-option :label="$t('schoolBus.routeException.options.yes')" :value="1" />
            <el-option :label="$t('schoolBus.routeException.options.no')" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formModel.needDispatch === 1"
          :label="$t('schoolBus.routeException.form.dispatchCar')"
          prop="dispatchCarId"
        >
          <el-select
            v-model="formModel.dispatchCarId"
            :placeholder="$t('schoolBus.routeException.pleaseSelect')"
            style="width: 100%"
            filterable
            @change="onDispatchCarChange"
          >
            <el-option
              v-for="c in dispatchCarList"
              :key="String(c.id)"
              :label="String(c.carNumber ?? c.id)"
              :value="c.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formModel.needDispatch === 1"
          :label="$t('schoolBus.routeException.form.dispatchDriver')"
          prop="dispatchDriver"
        >
          <el-input v-model="formModel.dispatchDriver" disabled />
        </el-form-item>
        <el-form-item :label="$t('schoolBus.routeException.form.details')" prop="details" class="school-bus-exception-form__full">
          <el-input v-model="formModel.details" type="textarea" :rows="4" maxlength="500" show-word-limit />
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

import { schoolBusCommonApi, schoolBusExceptionApi } from '@/api'
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

const props = defineProps<{
  visible: boolean
  mode: 'add' | 'edit' | 'look'
  source: ExceptionRecord | null
  defaultSchoolId: string | number | null
  schoolRecords: SchoolOptionRecord[]
}>()

const emit = defineEmits<{
  'update:visible': [boolean]
  saved: []
}>()

const { t, locale } = useUniI18n()

const formRef = ref<FormInstance | null>(null)
const submitting = ref(false)
const formModel = ref<ExceptionFormModel>({})
const sectionOptions = ref<SectionRow[]>([])
const lineOptionsFiltered = ref<LineRow[]>([])
const carList = ref<LineCar[]>([])
const dispatchCarList = ref<CarRow[]>([])

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

const rules = computed<FormRules<ExceptionFormModel>>(() => ({
  school: multiSchool.value
    ? [{ required: true, message: t('schoolBus.driver.rules.schoolIds'), trigger: 'change' }]
    : [],
  sectionId: [{ required: true, message: t('schoolBus.routeException.pleaseSelect'), trigger: 'change' }],
  lineId: [{ required: true, message: t('schoolBus.routeException.pleaseSelect'), trigger: 'change' }],
  carId: [{ required: true, message: t('schoolBus.routeException.pleaseSelect'), trigger: 'change' }],
  exceptionDate: [{ required: true, message: t('schoolBus.routeException.pleaseSelect'), trigger: 'change' }],
  exceptionType: [{ required: true, message: t('schoolBus.routeException.pleaseSelect'), trigger: 'change' }],
  needDispatch: [{ required: true, message: t('schoolBus.routeException.pleaseSelect'), trigger: 'change' }],
  dispatchCarId: [
    {
      required: formModel.value.needDispatch === 1,
      message: t('schoolBus.routeException.pleaseSelect'),
      trigger: 'change'
    }
  ],
  details: [{ required: true, message: t('schoolBus.routeException.pleaseSelect'), trigger: 'blur' }]
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
  formModel.value.carId = undefined
  formModel.value.carTeacher = undefined
  formModel.value.driver = undefined
  formModel.value.dispatchCarId = undefined
  formModel.value.dispatchDriver = undefined
  carList.value = []
  lineOptionsFiltered.value = []
  dispatchCarList.value = []

  const ids = Array.isArray(e) ? e : e != null ? [e] : []

  sectionOptions.value = unwrapArray<SectionRow>(
    await schoolBusCommonApi.sectionList.get({ schoolIds: ids })
  )

  dispatchCarList.value = unwrapArray<CarRow>(
    await schoolBusCommonApi.carinfoList.get({ isAll: 0, schoolIds: ids })
  )
}

const onSectionChange = async (sectionId: string | number | undefined) => {
  formModel.value.lineId = undefined
  formModel.value.carId = undefined
  formModel.value.carTeacher = undefined
  formModel.value.driver = undefined
  carList.value = []

  lineOptionsFiltered.value = unwrapArray<LineRow>(
    await schoolBusCommonApi.lineList.get({
      schoolIds: schoolIdsForApi(),
      sectionId
    })
  )
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
  const row = unwrapDetail(res)

  const schoolIds = row.schoolIds as Array<string | number> | undefined
  const sectionId = row.sectionId as string | number | undefined
  const lineId = row.lineId as string | number | undefined
  const carId = row.carId as string | number | undefined
  const dispatchCarId = row.dispatchCarId as string | number | undefined

  sectionOptions.value = unwrapArray<SectionRow>(
    await schoolBusCommonApi.sectionList.get({ schoolIds: schoolIds ?? [] })
  )

  lineOptionsFiltered.value = unwrapArray<LineRow>(
    await schoolBusCommonApi.lineList.get({
      schoolIds: schoolIds ?? [],
      sectionId
    })
  )

  const line = lineOptionsFiltered.value.find((l) => String(l.id) === String(lineId))
  carList.value = line?.carList ?? []

  dispatchCarList.value = unwrapArray<CarRow>(
    await schoolBusCommonApi.carinfoList.get({ isAll: 0, schoolIds: schoolIds ?? [] })
  )

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

  const data: ExceptionFormModel = {
    ...formModel.value
  }

  if (!multiSchool.value && props.defaultSchoolId != null && (data.school == null || data.school.length === 0)) {
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

    ElMessage.success(t('schoolBus.driver.messages.saveSuccess'))
    emit('saved')
    close()
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.school-bus-exception-form__grid {
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

.school-bus-exception-form__full {
  width: 100% !important;
}
</style>
