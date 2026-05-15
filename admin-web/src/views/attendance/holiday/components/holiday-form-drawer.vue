<template>
  <el-drawer
    v-model="open"
    :title="$t('attendance.holiday.formTitle')"
    direction="rtl"
    size="min(750px, 94vw)"
    destroy-on-close
    class="holiday-form-drawer"
    @closed="onClosed">
    <UniForm
      ref="uniFormRef"
      v-model="form"
      mode="edit"
      class="holiday-form-drawer__form"
      :config="holidayDrawerFormConfig">
      <template #field-admissonNo>
        <el-autocomplete
          v-model="displayStudent"
          :fetch-suggestions="queryStudents"
          :placeholder="$t('attendance.holiday.pickStudentPh')"
          :trigger-on-focus="false"
          clearable
          style="width: 100%"
          @select="onStudentSelect"
          @clear="onStudentClear" />
        <div v-if="studentInfo.name || studentInfo.fullName" class="holiday-form-drawer__student">
          <p>
            <span class="label">{{ $t('attendance.studentName') }}：</span
            >{{ studentInfo.name || studentInfo.fullName || '—' }}
          </p>
          <p>
            <span class="label">{{ $t('attendance.school') }}：</span
            >{{ studentInfo.schoolName || studentInfo.enName || '—' }}
          </p>
          <p>
            <span class="label">{{ $t('attendance.grade') }}：</span
            >{{ studentInfo.gradeName || studentInfo.grade || '—' }}
          </p>
          <p>
            <span class="label">{{ $t('attendance.className') }}：</span
            >{{ studentInfo.formCode || '—' }}
          </p>
        </div>
      </template>
      <template #field-scope>
        <el-checkbox-group v-model="form.scope">
          <el-checkbox label="course">{{ $t('attendance.holiday.scopeCourse') }}</el-checkbox>
          <el-checkbox label="dorm">{{ $t('attendance.holiday.scopeDorm') }}</el-checkbox>
          <el-checkbox label="bus">{{ $t('attendance.holiday.scopeBus') }}</el-checkbox>
        </el-checkbox-group>
      </template>
      <template #field-dateRange>
        <el-date-picker
          v-if="form.fixed === '102'"
          v-model="form.dateRange"
          type="datetimerange"
          range-separator="~"
          :start-placeholder="$t('attendance.beginDate')"
          :end-placeholder="$t('attendance.endDate')"
          value-format="YYYY-MM-DD HH:mm"
          format="YYYY-MM-DD HH:mm"
          style="width: 100%" />
        <el-date-picker
          v-else-if="form.fixed === '101'"
          v-model="form.dateRange"
          type="daterange"
          range-separator="-"
          :start-placeholder="$t('attendance.beginDate')"
          :end-placeholder="$t('attendance.endDate')"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          style="width: 100%" />
      </template>
      <template #field-weekDays>
        <el-checkbox-group v-model="form.weekDays">
          <el-checkbox v-for="d in weekOpts" :key="d.value" :label="d.value">{{ d.label }}</el-checkbox>
        </el-checkbox-group>
      </template>
      <template #field-dateLimit>
        <el-time-picker
          v-model="form.dateLimit"
          is-range
          range-separator="-"
          :start-placeholder="$t('attendance.holiday.timeStart')"
          :end-placeholder="$t('attendance.holiday.timeEnd')"
          value-format="HH:mm"
          format="HH:mm"
          style="width: 100%" />
      </template>
      <template #field-attachments>
        <el-upload
          list-type="picture-card"
          :file-list="fileList"
          accept="image/jpeg,image/png,image/jpg"
          :before-upload="beforeUpload"
          :on-remove="onRemove"
          :on-preview="onPreview">
          <el-icon><Plus /></el-icon>
        </el-upload>
      </template>
    </UniForm>

    <template #footer>
      <div class="holiday-form-drawer__footer">
        <el-checkbox v-model="form.parentResponsible" class="holiday-form-drawer__parent">
          {{ $t('attendance.holiday.parentAck') }}
        </el-checkbox>
        <el-button @click="open = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">
          {{ $t('attendance.holiday.submitApply') }}
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
import type { UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { UniFormConfig } from 'uni-ui-lib'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import { computed, reactive, ref, watch } from 'vue'

import { attendanceHolidayApi, membershipApi, protocolApi } from '@/api'
import { normalizeArray, normalizePayload } from '@/utils/api-response-normalize'

type Loose = Record<string, unknown>

const open = defineModel<boolean>('visible', { required: true })

const emit = defineEmits<{
  success: []
}>()

const { t } = useUniI18n()

const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const displayStudent = ref('')
const fileList = ref<UploadUserFile[]>([])
const previewVisible = ref(false)
const previewUrl = ref('')
const studentInfo = ref<Loose>({})

const weekOpts = computed(() => [
  { value: 'monday', label: t('attendance.holiday.weekMon') },
  { value: 'tuesday', label: t('attendance.holiday.weekTue') },
  { value: 'wednesday', label: t('attendance.holiday.weekWed') },
  { value: 'thursday', label: t('attendance.holiday.weekThu') },
  { value: 'friday', label: t('attendance.holiday.weekFri') }
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
  parentResponsible: false,
  /** UniForm 占位字段，不参与请假提交 */
  attachments: ''
})
const rules = computed<UniFormConfig['rules']>(() => ({
  admissonNo: [
    { required: true, message: t('attendance.holiday.ruleStudent'), trigger: 'change' }
  ],
  type: [{ required: true, message: t('attendance.holiday.ruleType'), trigger: 'change' }],
  scope: [{ required: true, message: t('attendance.holiday.ruleScope'), trigger: 'change' }],
  reason: [{ required: true, message: t('attendance.holiday.ruleReason'), trigger: 'blur' }],
  dateRange: [
    { required: true, message: t('attendance.holiday.ruleDate'), trigger: 'change' }
  ],
  dateLimit: [
    {
      validator: (_rule, _value, cb) => {
        if (form.fixed !== '101') {
          cb()
          return
        }
        if (!Array.isArray(form.dateLimit) || form.dateLimit.length !== 2) {
          cb(new Error(t('attendance.holiday.ruleSlot')))
          return
        }
        cb()
      },
      trigger: 'change'
    }
  ],
  weekDays: [
    {
      validator: (_rule, value, cb) => {
        if (form.fixed !== '101') {
          cb()
          return
        }
        if (!Array.isArray(value) || value.length === 0) {
          cb(new Error(t('attendance.holiday.ruleWeek')))
          return
        }
        cb()
      },
      trigger: 'change'
    }
  ]
}))

const holidayDrawerFormConfig = computed<UniFormConfig>(() => ({
  formProps: { labelWidth: '132px' },
  colProps: { span: 24 },
  rules: rules.value,
  schema: [
    {
      field: 'admissonNo',
      label: t('attendance.holiday.pickStudent'),
      component: 'ElInput',
      componentProps: { style: { display: 'none' } }
    },
    {
      field: 'type',
      label: t('attendance.holiday.leaveType'),
      component: 'ElSelect',
      options: [
        { label: t('attendance.holiday.leavePersonal'), value: '101' },
        { label: t('attendance.holiday.leaveSick'), value: '102' }
      ],
      componentProps: { style: { width: '100%' }, placeholder: t('attendance.holiday.selectType') }
    },
    {
      field: 'scope',
      label: t('attendance.holiday.scope'),
      component: 'ElInput',
      componentProps: { style: { display: 'none' } }
    },
    {
      field: 'fixed',
      label: t('attendance.holiday.fixed'),
      component: 'ElSelect',
      options: [
        { label: t('attendance.yes'), value: '101' },
        { label: t('attendance.no'), value: '102' }
      ],
      onChange: () => {
        onFixedChange()
      },
      componentProps: { style: { width: '100%' } }
    },
    {
      field: 'weekDays',
      label: t('attendance.holiday.weekDays'),
      component: 'ElInput',
      hidden: form.fixed !== '101',
      componentProps: { style: { display: 'none' } }
    },
    {
      field: 'dateRange',
      label: t('attendance.holiday.dateRange'),
      component: 'ElInput',
      componentProps: { style: { display: 'none' } }
    },
    {
      field: 'dateLimit',
      label: t('attendance.holiday.timeSlot'),
      component: 'ElInput',
      hidden: form.fixed !== '101',
      componentProps: { style: { display: 'none' } }
    },
    {
      field: 'reason',
      label: t('attendance.holiday.reason'),
      component: 'ElInput',
      componentProps: {
        type: 'textarea',
        rows: 4,
        placeholder: t('attendance.holiday.reasonPh')
      }
    },
    {
      field: 'attachments',
      label: t('attendance.holiday.attachments'),
      component: 'ElInput',
      componentProps: { style: { display: 'none' } }
    },
    {
      field: 'needPass',
      label: t('attendance.holiday.needPass'),
      component: 'ElSelect',
      options: [
        { label: t('attendance.yes'), value: '101' },
        { label: t('attendance.no'), value: '102' }
      ],
      componentProps: { style: { width: '100%' } }
    }
  ]
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
      const list = normalizeArray(res) as Loose[]
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
    const data = normalizePayload(res) as Loose
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
  uniFormRef.value?.resetFields()
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
  form.attachments = ''
  displayStudent.value = ''
  studentInfo.value = {}
  fileList.value = []
}

const beforeUpload = async (file: File) => {
  const ok = file.size / 1024 / 1024 < 20
  if (!ok) {
    ElMessage.warning(t('attendance.holiday.fileTooLarge'))
    return false
  }
  try {
    const url = await protocolApi.upload.post(file)
    fileList.value = [...fileList.value, { name: file.name, url, uid: Date.now() + Math.random() }]
    return false
  } catch {
    ElMessage.error(t('attendance.holiday.uploadFail'))
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
  if (!uniFormRef.value) {
    return
  }
  try {
    await uniFormRef.value.validate()
  } catch {
    return
  }
  if (form.type === '102' && fileList.value.length === 0) {
    ElMessage.error(t('attendance.holiday.ruleSickAttach'))
    return
  }
  if (!form.parentResponsible) {
    ElMessage.error(t('attendance.holiday.ruleParent'))
    return
  }
  await doSubmit()
}

const doSubmit = async () => {
  submitting.value = true
  try {
    const payload = buildPayload()
    await attendanceHolidayApi.holidaySave.post(payload)
    ElMessage.success(t('attendance.holiday.saveOk'))
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
