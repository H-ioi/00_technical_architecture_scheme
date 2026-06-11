<template>
  <div class="student-remote-select">
    <el-form-item v-if="!readonly" :label="$t('schoolDoctor.medicalInfo.pickStudent')">
      <el-select
        v-model="selectedKey"
        filterable
        remote
        reserve-keyword
        clearable
        style="width: 100%"
        :placeholder="$t('schoolDoctor.medicalInfo.pickStudentPh')"
        :remote-method="remoteSearch"
        :loading="loading"
        @change="handleSelectChange"
        @clear="handleClear">
        <el-option
          v-for="item in options"
          :key="studentKey(item)"
          :label="optionLabel(item)"
          :value="studentKey(item)" />
      </el-select>
    </el-form-item>

    <div v-if="cardInfo" class="student-remote-select__card">
      <div class="student-remote-select__profile">
        <div class="student-remote-select__avatar">{{ cardInfo.avatarText }}</div>
        <div>
          <div class="student-remote-select__name">{{ cardInfo.displayName }}</div>
          <div class="student-remote-select__id">ID: {{ cardInfo.studentId || '--' }}</div>
        </div>
      </div>
      <div class="student-remote-select__row">
        <span>{{ $t('schoolDoctor.medicalInfo.schoolAttend') }}</span>
        <span>{{ cardInfo.schoolName || '--' }}</span>
      </div>
      <div class="student-remote-select__row">
        <span>{{ $t('schoolDoctor.medicalInfo.gradeDivision') }}</span>
        <span>{{ cardInfo.gradeClassText || '--' }}</span>
      </div>
      <div
        v-if="cardInfo.emergencyName || cardInfo.emergencyPhone"
        class="student-remote-select__footer">
        <span
          >{{ $t('schoolDoctor.medicalInfo.emergencyContact') }}：{{
            cardInfo.emergencyName || '--'
          }}</span
        >
        <span v-if="cardInfo.emergencyPhone">{{ cardInfo.emergencyPhone }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { membershipApi } from '@/api'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizeArray } from '@/utils/api-response-normalize'

type StudentRecord = Record<string, unknown>

const props = defineProps<{
  readonly?: boolean
  /** 就诊记录等场景需带出过敏摘要 */
  withDrugAllergy?: boolean
  schoolRecords: SchoolOptionRecord[]
}>()

const emit = defineEmits<{
  select: [fields: Record<string, unknown>]
  clear: []
}>()

const selectedKey = ref('')
const options = ref<StudentRecord[]>([])
const studentMap = ref<Record<string, StudentRecord>>({})
const cardInfo = ref<{
  displayName: string
  studentId: string
  schoolName: string
  gradeClassText: string
  emergencyName: string
  emergencyPhone: string
  avatarText: string
} | null>(null)
const loading = ref(false)
let searchTimer: ReturnType<typeof setTimeout> | undefined

function studentKey(student: StudentRecord) {
  return String(student.studentId ?? student.id ?? student.admissonNo ?? '')
}

function optionLabel(student: StudentRecord) {
  const name = String(student.showName ?? student.cnFullName ?? student.fullName ?? '')
  const no = String(student.admissonNo ?? student.studentId ?? '')
  return no ? `${name}（${no}）` : name
}

function resolveSchoolId(student: StudentRecord) {
  const externId = student.schoolExternId ?? student.externId
  if (externId != null && externId !== '') {
    const matched = props.schoolRecords.find(
      (item) => String(item.externId) === String(externId) || String(item.id) === String(externId)
    )
    if (matched?.id != null) {
      return matched.id
    }
  }
  const schoolName = String(student.schoolName ?? student.enName ?? student.cnName ?? '')
  const matched = props.schoolRecords.find(
    (item) => item.cnName === schoolName || item.enName === schoolName || item.name === schoolName
  )
  return matched?.id
}

function mapMedicalInfoFields(student: StudentRecord) {
  const admissionNo = String(student.admissonNo ?? student.studentId ?? '')
  const fullName = String(student.cnFullName ?? student.fullName ?? student.showName ?? '')
  const fields: Record<string, unknown> = {
    schoolId: resolveSchoolId(student),
    admissionNo,
    fullName,
    grade: String(student.grade ?? ''),
    formCode: String(student.formCode ?? ''),
    dormitoryStatus: student.dormitoryStatus === 1 ? 1 : 0
  }
  if (props.withDrugAllergy) {
    fields.drugAllergy = [
      student.healthAllergiesDescription,
      student.allergySource,
      student.allergyMedication
    ]
      .filter(Boolean)
      .join('；')
  }
  return fields
}

function buildCardInfo(source: StudentRecord) {
  const admissionNo = String(source.admissonNo ?? source.admissionNo ?? source.studentId ?? '')
  const displayName = String(source.fullName ?? source.cnFullName ?? source.showName ?? '')
  if (!admissionNo && !displayName) {
    return null
  }
  const school = props.schoolRecords.find((item) => item.id === source.schoolId)
  const grade = String(source.grade ?? source.gradeName ?? '')
  const formCode = String(source.formCode ?? source.className ?? '')
  return {
    displayName,
    studentId: admissionNo,
    schoolName: String(source.schoolName ?? school?.cnName ?? school?.enName ?? ''),
    gradeClassText: [grade, formCode].filter(Boolean).join(' '),
    emergencyName: String(source.emergencyContactName ?? source.emergencyName ?? ''),
    emergencyPhone: String(source.emergencyPhone ?? source.emergencyContactPhone ?? ''),
    avatarText: displayName.slice(0, 1) || '?'
  }
}

function remoteSearch(query: string) {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  if (!query.trim()) {
    options.value = []
    return
  }
  searchTimer = setTimeout(async () => {
    loading.value = true
    try {
      const raw = await membershipApi.searchStudent.get(query.trim())
      const list = normalizeArray<StudentRecord>(raw)
      studentMap.value = {}
      options.value = list
      list.forEach((item) => {
        studentMap.value[studentKey(item)] = item
      })
    } finally {
      loading.value = false
    }
  }, 300)
}

function handleSelectChange(key: string) {
  const student = studentMap.value[key]
  if (!student) {
    handleClear()
    return
  }
  cardInfo.value = buildCardInfo({ ...mapMedicalInfoFields(student), ...student })
  emit('select', mapMedicalInfoFields(student))
}

function handleClear() {
  selectedKey.value = ''
  options.value = []
  studentMap.value = {}
  cardInfo.value = null
  if (searchTimer) {
    clearTimeout(searchTimer)
    searchTimer = undefined
  }
  emit('clear')
}

function setDisplayFromForm(form: Record<string, unknown>) {
  cardInfo.value = buildCardInfo(form)
  selectedKey.value = ''
  options.value = []
  studentMap.value = {}
}

function reset() {
  handleClear()
}

defineExpose({ reset, setDisplayFromForm })
</script>

<style scoped lang="scss">
.student-remote-select {
  &__card {
    margin-bottom: 16px;
    padding: 16px;
    background: #fff;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 12px;
  }

  &__profile {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: var(--el-color-primary-light-7);
    color: var(--el-color-primary);
    font-weight: 600;
  }

  &__name {
    font-size: 16px;
    font-weight: 600;
  }

  &__id {
    margin-top: 4px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  &__row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 13px;

    span:first-child {
      color: var(--el-text-color-secondary);
    }
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid var(--el-border-color-lighter);
    font-size: 13px;
  }
}
</style>
