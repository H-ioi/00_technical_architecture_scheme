<template>
  <el-drawer
    v-model="visible"
    :title="drawerTitle"
    direction="rtl"
    size="min(720px, 94vw)"
    destroy-on-close
    class="school-bus-attendance-drawer"
    @closed="onClosed">
    <div v-loading="detailLoading" class="school-bus-attendance-drawer__body">
      <UniForm
        ref="uniFormRef"
        v-model="formModel"
        :mode="uniFormMode"
        class="school-bus-attendance-drawer__form"
        :config="formConfig">
        <template #field-admissionNo>
          <el-autocomplete
            v-if="!isReadonly"
            v-model="displayStudent"
            :fetch-suggestions="queryStudents"
            :placeholder="$t('schoolBus.attendance.phKeyword')"
            :trigger-on-focus="false"
            :debounce="300"
            clearable
            style="width: 100%"
            @select="onStudentSelect" />
          <el-input v-else v-model="formModel.admissionNo" disabled />
        </template>
      </UniForm>
    </div>

    <template v-if="!isReadonly" #footer>
      <div class="school-bus-attendance-drawer__footer">
        <el-button @click="visible = false">{{ $t('schoolBus.cancel') }}</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">
          {{ $t('schoolBus.submit') }}
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { UniFormConfig } from 'uni-ui-lib'
import { UniForm, useUniI18n, toUniOptions } from 'uni-ui-lib'
import dayjs from 'dayjs'
import { computed, ref, watch } from 'vue'

import { membershipApi, schoolBusAttendanceApi, schoolBusCommonApi } from '@/api'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { BusAttendanceFormModel } from '@/types/modules/school-bus-attendance'
import { normalizeArray, normalizePayload } from '@/utils/api-response-normalize'

import {
  attendanceStatusOpts,
  drawerFormConfig,
  drawerFormRules,
  emptyFormModel,
  rideTypeOpts
} from '../list.config'

import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'

type Loose = Record<string, unknown>

type LineStationRow = {
  id: string | number
  cnName?: string
  enName?: string
}

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  mode: 'add' | 'edit' | 'look'
  recordId: string | number | null
  schoolOptions: Array<{ label: string; value: string | number }>
  defaultSchoolId: string | number | null
}>()

const emit = defineEmits<{
  saved: []
}>()

const { locale, t } = useUniI18n()
const { detailLoading, runWithDetailLoading } = useDialogDetailLoading()

const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const formModel = ref<BusAttendanceFormModel>(emptyFormModel())
const displayStudent = ref('')
const lineOptions = ref<LineStationRow[]>([])
const stationOptions = ref<LineStationRow[]>([])
const schoolRecords = ref<SchoolOptionRecord[]>([])

const isReadonly = computed(() => props.mode === 'look')
const uniFormMode = computed(() => (isReadonly.value ? 'view' : 'edit'))
const showSchoolField = computed(() => props.schoolOptions.length > 1)
const requireSchool = computed(() => showSchoolField.value)

const rideOpts = computed(() => rideTypeOpts(t))
const statusOpts = computed(() => attendanceStatusOpts(t))

const lineSelectOptions = computed(() =>
  toUniOptions(lineOptions.value, {
    labelKeys: locale() === 'en' ? ['enName', 'cnName'] : ['cnName', 'enName'],
    valueKey: 'id'
  })
)

const stationSelectOptions = computed(() =>
  toUniOptions(stationOptions.value, {
    labelKeys: locale() === 'en' ? ['enName', 'cnName'] : ['cnName', 'enName'],
    valueKey: 'id'
  })
)

const formConfig = computed<UniFormConfig>(() => {
  const base = drawerFormConfig(
    t,
    props.schoolOptions,
    lineSelectOptions.value,
    stationSelectOptions.value,
    rideOpts.value,
    statusOpts.value,
    showSchoolField.value,
    isReadonly.value
  )

  return {
    ...base,
    rules: isReadonly.value ? {} : drawerFormRules(t, requireSchool.value)
  }
})

const drawerTitle = computed(() => {
  if (props.mode === 'add') {
    return t('schoolBus.attendance.formAdd')
  }
  if (props.mode === 'edit') {
    return t('schoolBus.attendance.formEdit')
  }
  return t('schoolBus.attendance.formLook')
})

function resolveSchoolId(student: Loose, schools: SchoolOptionRecord[]) {
  const raw =
    student.schoolId ?? student.schoolIds ?? student.campusId ?? student.schoolCode ?? ''
  if (raw !== '' && raw != null) {
    const hit = schools.find((item) => String(item.id) === String(raw))
    if (hit) {
      return hit.id
    }
  }
  const name = String(student.schoolName || student.enName || student.cnName || '').trim()
  if (name) {
    const hit = schools.find(
      (item) =>
        item.name === name || item.cnName === name || item.enName === name
    )
    if (hit) {
      return hit.id
    }
  }
  return schools.length === 1 ? schools[0].id : undefined
}

async function loadLineOptions(schoolId: string | number | undefined, keepRoute = false) {
  if (schoolId == null || schoolId === '') {
    lineOptions.value = []
    stationOptions.value = []
    if (!keepRoute) {
      formModel.value.lineId = undefined
      formModel.value.stationId = undefined
    }
    return
  }

  const raw = await schoolBusCommonApi.lineList.get({ schoolIds: schoolId })
  lineOptions.value = normalizeArray(raw) as LineStationRow[]

  if (!keepRoute) {
    formModel.value.lineId = undefined
    formModel.value.stationId = undefined
    stationOptions.value = []
  }
}

async function loadStationOptions(
  schoolId: string | number | undefined,
  lineId: string | number | undefined
) {
  if (schoolId == null || schoolId === '' || lineId == null || lineId === '') {
    stationOptions.value = []
    return
  }

  const raw = await schoolBusCommonApi.stationList.get({ schoolIds: schoolId, lineId })
  stationOptions.value = normalizeArray(raw) as LineStationRow[]

  if (!stationOptions.value.some((item) => String(item.id) === String(formModel.value.stationId))) {
    formModel.value.stationId = undefined
  }
}

async function loadDetail(id: string | number) {
  const raw = await schoolBusAttendanceApi.detail.get(id)
  const row = normalizePayload(raw) as Loose
  formModel.value = {
    id: row.id as string | number,
    schoolId: row.schoolId as string | number | undefined,
    admissionNo: String(row.admissionNo || ''),
    studentName: String(row.studentName || ''),
    studentGrade: String(row.grade || row.studentGrade || ''),
    formCode: String(row.formCode || ''),
    attendanceDate: row.attendanceDate
      ? dayjs(String(row.attendanceDate)).format('YYYY-MM-DD')
      : '',
    lineId: row.lineId as string | number | undefined,
    stationId: row.stationId as string | number | undefined,
    rideType: row.rideType as number | undefined,
    attendanceStatus: row.attendanceStatus as number | undefined,
    remark: String(row.remark || '')
  }
  displayStudent.value = formModel.value.admissionNo || ''

  if (formModel.value.schoolId) {
    await loadLineOptions(formModel.value.schoolId, true)
    formModel.value.lineId = row.lineId as string | number | undefined
    await loadStationOptions(formModel.value.schoolId, formModel.value.lineId)
    formModel.value.stationId = row.stationId as string | number | undefined
  }
}

async function openDrawer() {
  formModel.value = emptyFormModel()
  displayStudent.value = ''
  lineOptions.value = []
  stationOptions.value = []

  const schoolRaw = await membershipApi.school.get()
  schoolRecords.value = normalizeArray(schoolRaw) as SchoolOptionRecord[]

  if (props.mode === 'add') {
    if (props.defaultSchoolId != null) {
      formModel.value.schoolId = props.defaultSchoolId
      await loadLineOptions(props.defaultSchoolId)
    }
    return
  }

  if (props.recordId != null) {
    await loadDetail(props.recordId)
  }
}

watch(
  () => visible.value,
  (open) => {
    if (!open) {
      return
    }
    void runWithDetailLoading(openDrawer)
  }
)

watch(
  () => formModel.value.schoolId,
  (schoolId, prev) => {
    if (!visible.value || schoolId === prev) {
      return
    }
    void loadLineOptions(schoolId)
  }
)

watch(
  () => formModel.value.lineId,
  (lineId, prev) => {
    if (!visible.value || lineId === prev) {
      return
    }
    void loadStationOptions(formModel.value.schoolId, lineId)
  }
)

const queryStudents = (query: string, cb: (items: Array<{ value: string } & Loose>) => void) => {
  const keyword = query.trim()
  if (!keyword) {
    cb([])
    return
  }

  if (showSchoolField.value && !formModel.value.schoolId) {
    ElMessage.warning(t('schoolBus.attendance.ruleSchool'))
    cb([])
    return
  }

  void membershipApi.searchStudent.get(keyword).then((res) => {
    const list = normalizeArray(res) as Loose[]
    cb(
      list.map((item) => {
        const name = String(item.showName || item.cnFullName || item.fullName || '')
        const no = String(item.admissonNo || item.studentId || '')
        return {
          ...item,
          value: no ? `${name}（${no}）` : name
        }
      })
    )
  })
}

const onStudentSelect = (item: Loose) => {
  const studentName = String(item.cnFullName || item.fullName || item.showName || '')
  const admissionNo = String(item.admissonNo || item.studentId || '')
  const gradeName = String(item.grade || '')
  const className = String(item.formCode || '')
  const schoolId = resolveSchoolId(item, schoolRecords.value)

  formModel.value = {
    ...formModel.value,
    schoolId: schoolId ?? formModel.value.schoolId,
    admissionNo,
    studentName,
    studentGrade: gradeName,
    formCode: className
  }
  displayStudent.value = admissionNo

  if (schoolId != null) {
    void loadLineOptions(schoolId)
  }
}

const submit = async () => {
  const valid = await uniFormRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }

  submitting.value = true
  try {
    const payload: BusAttendanceFormModel = { ...formModel.value }
    if (payload.studentGrade) {
      payload.grade = payload.studentGrade
    }

    if (props.mode === 'add') {
      await schoolBusAttendanceApi.add.post(payload)
    } else {
      await schoolBusAttendanceApi.edit.post(payload)
    }

    ElMessage.success(t('schoolBus.operationSuccess'))
    visible.value = false
    emit('saved')
  } finally {
    submitting.value = false
  }
}

const onClosed = () => {
  formModel.value = emptyFormModel()
  displayStudent.value = ''
  lineOptions.value = []
  stationOptions.value = []
}
</script>

<style scoped lang="scss">
.school-bus-attendance-drawer {
  &__body {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: 0 20px 16px;
  }

  &__form {
    padding-top: 4px;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 12px 20px;
    border-top: 1px solid var(--el-border-color-lighter);
  }
}
</style>
