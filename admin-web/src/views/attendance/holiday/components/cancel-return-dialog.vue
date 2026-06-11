<template>
  <el-dialog
    v-model="open"
    :title="$t('attendance.holiday.cancelReturnTitle')"
    width="min(750px, 94vw)"
    append-to-body
    destroy-on-close
    class="cancel-return-dialog"
    @closed="resetInner">
    <div v-loading="loadingStudent" class="cancel-return-dialog__body">
      <div class="cancel-return-dialog__info">
        <div class="cancel-return-dialog__row">
          <div class="cancel-return-dialog__item">
            <span class="cancel-return-dialog__label">{{ $t('attendance.studentName') }}：</span>
            <span>{{ studentInfo.fullName || leaveRow?.studentName || '—' }}</span>
          </div>
          <div class="cancel-return-dialog__item">
            <span class="cancel-return-dialog__label">{{ $t('attendance.admissionNo') }}：</span>
            <span>{{ leaveRow?.admissonNo || '—' }}</span>
          </div>
        </div>
        <div class="cancel-return-dialog__row">
          <div class="cancel-return-dialog__item">
            <span class="cancel-return-dialog__label">{{ $t('attendance.school') }}：</span>
            <span>{{ studentInfo.schoolName || leaveRow?.studentSchool || '—' }}</span>
          </div>
          <div class="cancel-return-dialog__item">
            <span class="cancel-return-dialog__label">{{ $t('attendance.grade') }}：</span>
            <span>{{ studentInfo.grade || leaveRow?.studentGrade || '—' }}</span>
          </div>
        </div>
        <div class="cancel-return-dialog__row">
          <div class="cancel-return-dialog__item">
            <span class="cancel-return-dialog__label">{{ $t('attendance.className') }}：</span>
            <span>{{ studentInfo.formCode || leaveRow?.studentClass || '—' }}</span>
          </div>
          <div class="cancel-return-dialog__item">
            <span class="cancel-return-dialog__label"
              >{{ $t('attendance.holiday.leaveType') }}：</span
            >
            <span>{{ leaveTypeText }}</span>
          </div>
        </div>
        <div class="cancel-return-dialog__row">
          <div class="cancel-return-dialog__item">
            <span class="cancel-return-dialog__label">{{ $t('attendance.holiday.scope') }}：</span>
            <span>{{ scopeText }}</span>
          </div>
          <div class="cancel-return-dialog__item">
            <span class="cancel-return-dialog__label">{{ $t('attendance.holiday.fixed') }}：</span>
            <span>{{ fixedText }}</span>
          </div>
        </div>
        <div
          v-if="leaveRow?.fixed === '101' || leaveRow?.fixed === 101"
          class="cancel-return-dialog__row">
          <div class="cancel-return-dialog__item">
            <span class="cancel-return-dialog__label"
              >{{ $t('attendance.holiday.weekDays') }}：</span
            >
            <span>{{ weekDaysText }}</span>
          </div>
          <div class="cancel-return-dialog__item">
            <span class="cancel-return-dialog__label"
              >{{ $t('attendance.holiday.timeSlot') }}：</span
            >
            <span>{{ dateLimitText }}</span>
          </div>
        </div>
        <div class="cancel-return-dialog__row">
          <div class="cancel-return-dialog__item">
            <span class="cancel-return-dialog__label"
              >{{ $t('attendance.holiday.dateRange') }}：</span
            >
            <span>{{ dateRangeText }}</span>
          </div>
          <div class="cancel-return-dialog__item">
            <span class="cancel-return-dialog__label"
              >{{ $t('attendance.holiday.infectious') }}：</span
            >
            <span>{{ infectiousText }}</span>
          </div>
        </div>
        <div class="cancel-return-dialog__row">
          <div class="cancel-return-dialog__item cancel-return-dialog__item--full">
            <span class="cancel-return-dialog__label">{{ $t('attendance.holiday.reason') }}：</span>
            <span>{{ leaveRow?.reason || '—' }}</span>
          </div>
        </div>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="132px">
        <el-form-item :label="$t('attendance.holiday.returnSchoolTime')" prop="backTime">
          <el-date-picker
            v-model="form.backTime"
            type="datetime"
            :placeholder="$t('attendance.holiday.ruleReturnTime')"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            style="width: 100%" />
        </el-form-item>
        <el-form-item :label="$t('attendance.holiday.returnProof')">
          <el-upload
            list-type="picture-card"
            :file-list="backFileList"
            accept="image/jpeg,image/png,image/jpg"
            :before-upload="beforeReturnUpload"
            :on-remove="onRemoveReturn"
            :on-preview="onPreview">
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>

      <div class="cancel-return-dialog__ack">
        <el-checkbox v-model="form.parentResponsible">
          {{ $t('attendance.holiday.infoAccurate') }}
        </el-checkbox>
      </div>
    </div>

    <template #footer>
      <el-button @click="open = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">
        {{ $t('attendance.holiday.confirmCancelReturn') }}
      </el-button>
    </template>

    <el-dialog v-model="previewVisible" append-to-body title="">
      <img v-if="previewUrl" :src="previewUrl" alt="" style="width: 100%" />
    </el-dialog>
  </el-dialog>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
import { computed, reactive, ref, watch } from 'vue'

import { attendanceHolidayApi, membershipApi, protocolApi } from '@/api'
import type { AttendanceHolidayRecord } from '@/types/modules/attendance-holiday'
import { normalizePayload } from '@/utils/api-response-normalize'
import {
  formatDateLimitCell,
  formatScopeCell,
  holidayTypeLabel,
  yn101102Label
} from '../list.config'

type Loose = Record<string, unknown>

const open = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  leaveRow: AttendanceHolidayRecord | null
}>()

const emit = defineEmits<{
  success: []
}>()

const { t } = useUniI18n()
const formRef = ref<FormInstance | null>(null)
const submitting = ref(false)
const loadingStudent = ref(false)
const studentInfo = ref<Loose>({})
const backFileList = ref<UploadUserFile[]>([])
const previewVisible = ref(false)
const previewUrl = ref('')

const form = reactive({
  backTime: '',
  parentResponsible: false
})

const rules = computed<FormRules>(() => ({
  backTime: [{ required: true, message: t('attendance.holiday.ruleReturnTime'), trigger: 'change' }]
}))

const leaveTypeText = computed(() => holidayTypeLabel(props.leaveRow?.type, t))
const scopeText = computed(() =>
  props.leaveRow ? formatScopeCell(props.leaveRow as Loose, t) : '—'
)
const fixedText = computed(() => yn101102Label(props.leaveRow?.fixed, t))
const infectiousText = computed(() => yn101102Label(props.leaveRow?.isInfectious, t))
const dateLimitText = computed(() =>
  props.leaveRow ? formatDateLimitCell(props.leaveRow as Loose) : '—'
)
const weekDaysText = computed(() => {
  const raw = props.leaveRow?.weekDays
  if (!Array.isArray(raw)) {
    return '—'
  }
  const map: Record<string, string> = {
    monday: t('attendance.holiday.weekMon'),
    tuesday: t('attendance.holiday.weekTue'),
    wednesday: t('attendance.holiday.weekWed'),
    thursday: t('attendance.holiday.weekThu'),
    friday: t('attendance.holiday.weekFri')
  }
  return raw.map((x) => map[String(x)] || String(x)).join('、') || '—'
})
const dateRangeText = computed(() => {
  const row = props.leaveRow as Loose | null
  if (!row) {
    return '—'
  }
  if (row.dateString) {
    return String(row.dateString)
  }
  if (row.beginTime && row.endTime) {
    return `${row.beginTime} ~ ${row.endTime}`
  }
  return '—'
})

const loadStudent = async (admissonNo: string) => {
  loadingStudent.value = true
  try {
    const res = await membershipApi.studentInfo.get(admissonNo)
    const data = normalizePayload(res) as Loose
    studentInfo.value = data && typeof data === 'object' ? data : {}
  } catch {
    studentInfo.value = {}
  } finally {
    loadingStudent.value = false
  }
}

watch(open, (v) => {
  if (!v) {
    return
  }
  resetInner()
  const no = props.leaveRow?.admissonNo
  if (no) {
    void loadStudent(String(no))
  }
})

const resetInner = () => {
  formRef.value?.resetFields()
  form.backTime = ''
  form.parentResponsible = false
  studentInfo.value = {}
  backFileList.value = []
}

const beforeReturnUpload = async (file: File) => {
  if (file.size / 1024 / 1024 >= 2) {
    ElMessage.warning(t('attendance.holiday.returnFileTooLarge'))
    return false
  }
  try {
    const url = await protocolApi.upload.post(file)
    backFileList.value = [
      ...backFileList.value,
      { name: file.name, url, uid: Date.now() + Math.random() }
    ]
    return false
  } catch {
    ElMessage.error(t('attendance.holiday.uploadFail'))
    return false
  }
}

const onRemoveReturn = (file: UploadUserFile) => {
  backFileList.value = backFileList.value.filter((f) => f.uid !== file.uid && f.name !== file.name)
}

const onPreview = (file: UploadUserFile) => {
  previewUrl.value = file.url ?? ''
  previewVisible.value = true
}

const isInfectiousYes = () => {
  const v = props.leaveRow?.isInfectious
  return v === '101' || v === 101
}

const submit = async () => {
  if (!formRef.value || !props.leaveRow?.id) {
    return
  }
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  if (isInfectiousYes() && backFileList.value.length === 0) {
    ElMessage.error(t('attendance.holiday.ruleReturnAttach'))
    return
  }
  if (!form.parentResponsible) {
    ElMessage.error(t('attendance.holiday.ruleInfoAccurate'))
    return
  }
  const si = studentInfo.value
  const payload: Loose = {
    studentName: String(si.fullName ?? props.leaveRow.studentName ?? ''),
    studentSchool: String(si.schoolName ?? props.leaveRow.studentSchool ?? ''),
    studentGrade: String(si.grade ?? props.leaveRow.studentGrade ?? ''),
    studentClass: String(si.formCode ?? props.leaveRow.studentClass ?? ''),
    backTime: form.backTime,
    studentNo: String(props.leaveRow.admissonNo ?? ''),
    studentAvatar: String(si.profilePhoto ?? ''),
    holidayId: props.leaveRow.id
  }
  const urls = backFileList.value.map((f) => f.url).filter(Boolean) as string[]
  if (urls.length) {
    payload.files = urls
  }
  submitting.value = true
  try {
    await attendanceHolidayApi.holidayReturnSave.post(payload)
    ElMessage.success(t('attendance.holiday.cancelReturnOk'))
    open.value = false
    emit('success')
  } catch {
    ElMessage.error(t('attendance.holiday.saveFail'))
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.cancel-return-dialog {
  &__body {
    min-height: 120px;
  }

  &__info {
    margin-bottom: 20px;
  }

  &__row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 20px;
    margin-bottom: 10px;
  }

  &__item {
    flex: 1;
    min-width: calc(50% - 10px);
    display: flex;
    align-items: flex-start;
    font-size: 14px;
    color: var(--el-text-color-regular);

    &--full {
      flex: 100%;
      min-width: 100%;
    }
  }

  &__label {
    flex-shrink: 0;
    width: 120px;
    text-align: right;
    margin-right: 8px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }

  &__ack {
    text-align: center;
    margin-top: 16px;
  }
}
</style>
