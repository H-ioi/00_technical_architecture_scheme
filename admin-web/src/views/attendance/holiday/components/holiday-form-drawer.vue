<template>
  <el-drawer
    v-model="open"
    :title="$t('attendance.holiday.form.title')"
    direction="rtl"
    size="min(750px, 94vw)"
    destroy-on-close
    class="holiday-form-drawer"
    @closed="onClosed">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="132px"
      class="holiday-form-drawer__form">
      <el-form-item :label="$t('attendance.holiday.form.pickStudent')" prop="admissonNo">
        <el-autocomplete
          v-model="displayStudent"
          :fetch-suggestions="queryStudents"
          :placeholder="$t('attendance.holiday.form.pickStudentPh')"
          :trigger-on-focus="false"
          clearable
          style="width: 100%"
          @select="onStudentSelect"
          @clear="onStudentClear" />
        <div v-if="studentInfo.name || studentInfo.fullName" class="holiday-form-drawer__student">
          <p>
            <span class="label">{{ $t('attendance.holiday.columns.studentName') }}：</span
            >{{ studentInfo.name || studentInfo.fullName || '—' }}
          </p>
          <p>
            <span class="label">{{ $t('attendance.holiday.columns.school') }}：</span
            >{{ studentInfo.schoolName || studentInfo.enName || '—' }}
          </p>
          <p>
            <span class="label">{{ $t('attendance.holiday.columns.grade') }}：</span
            >{{ studentInfo.gradeName || studentInfo.grade || '—' }}
          </p>
          <p>
            <span class="label">{{ $t('attendance.holiday.columns.className') }}：</span
            >{{ studentInfo.formCode || '—' }}
          </p>
        </div>
      </el-form-item>

      <el-form-item :label="$t('attendance.holiday.columns.leaveType')" prop="type">
        <el-select
          v-model="form.type"
          style="width: 100%"
          :placeholder="$t('attendance.holiday.form.selectType')">
          <el-option :label="$t('attendance.holiday.options.leavePersonal')" value="101" />
          <el-option :label="$t('attendance.holiday.options.leaveSick')" value="102" />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('attendance.holiday.columns.scope')" prop="scope">
        <el-checkbox-group v-model="form.scope">
          <el-checkbox label="course">{{
            $t('attendance.holiday.options.scopeCourse')
          }}</el-checkbox>
          <el-checkbox label="dorm">{{ $t('attendance.holiday.options.scopeDorm') }}</el-checkbox>
          <el-checkbox label="bus">{{ $t('attendance.holiday.options.scopeBus') }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item :label="$t('attendance.holiday.columns.fixed')" prop="fixed">
        <el-select v-model="form.fixed" style="width: 100%" @change="onFixedChange">
          <el-option :label="$t('attendance.holiday.options.yes')" value="101" />
          <el-option :label="$t('attendance.holiday.options.no')" value="102" />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="form.fixed === '101'"
        :label="$t('attendance.holiday.columns.weekDays')"
        prop="weekDays">
        <el-checkbox-group v-model="form.weekDays">
          <el-checkbox v-for="d in weekOpts" :key="d.value" :label="d.value">{{
            d.label
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item
        v-if="form.fixed === '102'"
        :label="$t('attendance.holiday.columns.dateRange')"
        prop="dateRange">
        <el-date-picker
          v-model="form.dateRange"
          type="datetimerange"
          range-separator="~"
          :start-placeholder="$t('attendance.holiday.placeholders.beginTime')"
          :end-placeholder="$t('attendance.holiday.placeholders.endTime')"
          value-format="YYYY-MM-DD HH:mm"
          format="YYYY-MM-DD HH:mm"
          style="width: 100%" />
      </el-form-item>

      <el-form-item
        v-if="form.fixed === '101'"
        :label="$t('attendance.holiday.columns.dateRange')"
        prop="dateRange">
        <el-date-picker
          v-model="form.dateRange"
          type="daterange"
          range-separator="-"
          :start-placeholder="$t('attendance.holiday.placeholders.beginTime')"
          :end-placeholder="$t('attendance.holiday.placeholders.endTime')"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          style="width: 100%" />
      </el-form-item>

      <el-form-item
        v-if="form.fixed === '101'"
        :label="$t('attendance.holiday.columns.timeSlot')"
        prop="dateLimit">
        <el-time-picker
          v-model="form.dateLimit"
          is-range
          range-separator="-"
          :start-placeholder="$t('attendance.holiday.form.timeStart')"
          :end-placeholder="$t('attendance.holiday.form.timeEnd')"
          value-format="HH:mm"
          format="HH:mm"
          style="width: 100%" />
      </el-form-item>

      <el-form-item :label="$t('attendance.holiday.columns.reason')" prop="reason">
        <el-input
          v-model="form.reason"
          type="textarea"
          :rows="4"
          :placeholder="$t('attendance.holiday.form.reasonPh')" />
      </el-form-item>

      <el-form-item :label="$t('attendance.holiday.form.attachments')">
        <el-upload
          list-type="picture-card"
          :file-list="fileList"
          accept="image/jpeg,image/png,image/jpg"
          :before-upload="beforeUpload"
          :on-remove="onRemove"
          :on-preview="onPreview">
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item :label="$t('attendance.holiday.form.needPass')" prop="needPass">
        <el-select v-model="form.needPass" style="width: 100%">
          <el-option :label="$t('attendance.holiday.options.yes')" value="101" />
          <el-option :label="$t('attendance.holiday.options.no')" value="102" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="holiday-form-drawer__footer">
        <el-checkbox v-model="form.parentResponsible" class="holiday-form-drawer__parent">
          {{ $t('attendance.holiday.form.parentAck') }}
        </el-checkbox>
        <el-button @click="open = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">
          {{ $t('attendance.holiday.form.submit') }}
        </el-button>
      </div>
    </template>

    <el-dialog v-model="previewVisible" append-to-body title="">
      <img v-if="previewUrl" :src="previewUrl" alt="" style="width: 100%" />
    </el-dialog>
  </el-drawer>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { computed, reactive, ref, watch } from 'vue'

import { attendanceHolidayApi, membershipApi, protocolApi } from '@/api'
import { normalizeApiArrayBody, normalizeApiPayload } from '@/utils/api-response-normalize'
import { useUniI18n } from 'uni-ui-lib'

type Loose = Record<string, unknown>

const open = defineModel<boolean>('visible', { required: true })

const emit = defineEmits<{
  success: []
}>()

const { t } = useUniI18n()

const formRef = ref<FormInstance>()
const submitting = ref(false)
const displayStudent = ref('')
const fileList = ref<UploadUserFile[]>([])
const previewVisible = ref(false)
const previewUrl = ref('')
const studentInfo = ref<Loose>({})

const weekOpts = computed(() => [
  { value: 'monday', label: t('attendance.holiday.form.weekMon') },
  { value: 'tuesday', label: t('attendance.holiday.form.weekTue') },
  { value: 'wednesday', label: t('attendance.holiday.form.weekWed') },
  { value: 'thursday', label: t('attendance.holiday.form.weekThu') },
  { value: 'friday', label: t('attendance.holiday.form.weekFri') }
])

const form = reactive({
  admissonNo: '',
  type: '',
  scope: [] as string[],
  fixed: '102',
  weekDays: [] as string[],
  dateRange: null as [string, string] | null,
  dateLimit: ['08:00', '17:00'] as [string, string],
  reason: '',
  needPass: '101',
  parentResponsible: false
})

const rules = computed<FormRules>(() => ({
  admissonNo: [
    { required: true, message: t('attendance.holiday.form.ruleStudent'), trigger: 'change' }
  ],
  type: [{ required: true, message: t('attendance.holiday.form.ruleType'), trigger: 'change' }],
  scope: [{ required: true, message: t('attendance.holiday.form.ruleScope'), trigger: 'change' }],
  reason: [{ required: true, message: t('attendance.holiday.form.ruleReason'), trigger: 'blur' }],
  dateRange: [
    { required: true, message: t('attendance.holiday.form.ruleDate'), trigger: 'change' }
  ],
  dateLimit: [
    { required: true, message: t('attendance.holiday.form.ruleSlot'), trigger: 'change' }
  ],
  weekDays: [{ required: true, message: t('attendance.holiday.form.ruleWeek'), trigger: 'change' }]
}))

const queryStudents = (
  query: string,
  cb: (rows: { value: string; admissonNo: string }[]) => void
) => {
  const q = query.trim()
  if (!q) {
    cb([])
    return
  }
  membershipApi.searchStudent
    .get(q)
    .then((res) => {
      const list = normalizeApiArrayBody(res) as Loose[]
      cb(
        list.map((item) => ({
          value: `${item.showName ?? item.name ?? ''}(${item.admissonNo ?? item.admissionNo ?? ''})`,
          admissonNo: String(item.admissonNo ?? item.admissionNo ?? '')
        }))
      )
    })
    .catch(() => cb([]))
}

const onStudentSelect = (item: { admissonNo: string }) => {
  form.admissonNo = item.admissonNo
  displayStudent.value = item.admissonNo ? item.value : ''
  membershipApi.studentInfo.get(item.admissonNo).then((res) => {
    const data = normalizeApiPayload(res) as Loose
    studentInfo.value = data && typeof data === 'object' ? data : {}
  })
}

const onStudentClear = () => {
  form.admissonNo = ''
  studentInfo.value = {}
}

const onFixedChange = () => {
  form.weekDays = []
  form.dateRange = null
}

watch(open, (v) => {
  if (v) {
    resetInner()
  }
})

const onClosed = () => {
  resetInner()
}

const resetInner = () => {
  formRef.value?.resetFields()
  form.admissonNo = ''
  form.type = ''
  form.scope = []
  form.fixed = '102'
  form.weekDays = []
  form.dateRange = null
  form.dateLimit = ['08:00', '17:00']
  form.reason = ''
  form.needPass = '101'
  form.parentResponsible = false
  displayStudent.value = ''
  studentInfo.value = {}
  fileList.value = []
}

const beforeUpload = async (file: File) => {
  const ok = file.size / 1024 / 1024 < 20
  if (!ok) {
    ElMessage.warning(t('attendance.holiday.form.fileTooLarge'))
    return false
  }
  try {
    const url = await protocolApi.upload.post(file)
    fileList.value = [...fileList.value, { name: file.name, url, uid: Date.now() + Math.random() }]
    return false
  } catch {
    ElMessage.error(t('attendance.holiday.form.uploadFail'))
    return false
  }
}

const onRemove: (file: UploadUserFile) => void = (file) => {
  fileList.value = fileList.value.filter((f) => f.uid !== file.uid && f.name !== file.name)
}

const onPreview = (file: UploadUserFile) => {
  previewUrl.value = file.url ?? ''
  previewVisible.value = true
}

const buildPayload = (): Loose => {
  const si = studentInfo.value
  const payload: Loose = {
    type: form.type,
    scope: form.scope,
    fixed: form.fixed,
    weekDays: form.fixed === '101' ? form.weekDays : [],
    reason: form.reason,
    admissonNo: form.admissonNo,
    needPass: form.needPass,
    parentResponsible: form.parentResponsible,
    dataFrom: '',
    source: 'admin',
    studentName: String(si.name ?? si.fullName ?? ''),
    studentSchool: String(si.schoolName ?? si.enName ?? ''),
    studentGrade: String(si.gradeName ?? si.grade ?? ''),
    studentClass: String(si.formCode ?? ''),
    processInstanceId: '',
    taskId: ''
  }
  if (form.dateRange?.length === 2) {
    payload.beginTime = form.dateRange[0]
    payload.endTime = form.dateRange[1]
  }
  if (form.fixed === '101' && form.dateLimit?.length === 2) {
    payload.dateLimit = form.dateLimit
  }
  const urls = fileList.value.map((f) => f.url).filter(Boolean) as string[]
  if (urls.length) {
    payload.files = urls
  }
  return payload
}

const submit = async () => {
  const el = formRef.value
  if (!el) {
    return
  }
  try {
    await el.validate()
  } catch {
    return
  }
  if (form.type === '102' && fileList.value.length === 0) {
    ElMessage.error(t('attendance.holiday.form.ruleSickAttach'))
    return
  }
  if (!form.parentResponsible) {
    ElMessage.error(t('attendance.holiday.form.ruleParent'))
    return
  }
  await doSubmit()
}

const doSubmit = async () => {
  submitting.value = true
  try {
    const payload = buildPayload()
    await attendanceHolidayApi.holidaySave.post(payload)
    ElMessage.success(t('attendance.holiday.form.saveOk'))
    open.value = false
    emit('success')
  } catch {
    ElMessage.error(t('attendance.holiday.form.saveFail'))
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.holiday-form-drawer__form {
  padding-right: 8px;
}

.holiday-form-drawer__student {
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.6;
  .label {
    color: var(--el-text-color-secondary);
  }
}

.holiday-form-drawer__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  width: 100%;
  :deep(.el-checkbox:last-of-type) {
    margin-right: 20px;
  }
}

.holiday-form-drawer__parent {
  max-width: min(360px, 100%);

  :deep(.el-checkbox) {
    align-items: flex-start;
    height: auto;
    white-space: normal;
  }

  :deep(.el-checkbox__label) {
    color: var(--el-text-color-secondary);
    font-size: 13px;
    line-height: 1.5;
  }
}
</style>
