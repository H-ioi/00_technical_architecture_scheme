<template>
  <el-dialog
    v-model="open"
    :title="dialogTitle"
    width="860px"
    destroy-on-close
    class="holiday-pass-dialog"
    @closed="onClose">
    <!-- 对齐旧版 passModel.vue：批量时展示选中行列表，放行方式 / 日期 / 时段 / 备注 与单行生成共用表单 -->
    <div v-if="isBatch" class="holiday-pass-dialog__batch">
      <el-table :data="batchRows" size="small" max-height="220">
        <el-table-column prop="studentNo" :label="$t('attendance.holidayPass.columns.studentNo')" width="120" />
        <el-table-column prop="studentName" :label="$t('attendance.holidayPass.columns.studentName')" width="100" />
        <el-table-column prop="studentSchool" :label="$t('attendance.holidayPass.columns.school')" min-width="120" />
        <el-table-column prop="studentGrade" :label="$t('attendance.holidayPass.columns.grade')" width="88" />
        <el-table-column prop="studentClass" :label="$t('attendance.holidayPass.columns.className')" width="88" />
        <el-table-column :label="$t('attendance.holidayPass.columns.dorm')" width="88">
          <template #default="{ row }">{{
            row.studentDormitoryStatus === 1 ? $t('attendance.holiday.options.yes') : $t('attendance.holiday.options.no')
          }}</template>
        </el-table-column>
      </el-table>
    </div>

    <el-form ref="formRef" :model="form" :rules="rules" label-width="140px" :disabled="viewOnly">
      <el-form-item v-if="!isBatch" :label="$t('attendance.holiday.form.pickStudent')" prop="studentNo">
        <el-autocomplete
          v-model="displayStudent"
          style="width: 100%"
          :fetch-suggestions="queryStudents"
          :placeholder="$t('attendance.holiday.form.pickStudentPh')"
          :trigger-on-focus="false"
          clearable
          :disabled="viewOnly || !!form.id"
          @select="onStudentSelect"
          @clear="onStudentClear" />
        <div v-if="studentLine" class="holiday-pass-dialog__hint">{{ studentLine }}</div>
      </el-form-item>

      <el-form-item :label="$t('attendance.holidayPass.form.way')" prop="way">
        <el-select v-model="form.way" style="width: 100%" :placeholder="$t('attendance.holidayPass.form.way')">
          <el-option :label="$t('attendance.holidayPass.options.wayParents')" value="parents" />
          <el-option :label="$t('attendance.holidayPass.options.waySelf')" value="self" />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('attendance.holidayPass.columns.passTime')" prop="passTime">
        <el-date-picker
          v-model="form.passTime"
          type="date"
          value-format="YYYY-MM-DD"
          style="width: 100%"
          :placeholder="$t('attendance.holidayPass.columns.passTime')" />
      </el-form-item>

      <el-form-item :label="$t('attendance.holidayPass.columns.slot')" prop="dateLimit">
        <el-time-picker
          v-model="timeRangeModel"
          is-range
          range-separator="-"
          value-format="HH:mm"
          format="HH:mm"
          style="width: 100%"
          :start-placeholder="$t('attendance.holiday.form.timeStart')"
          :end-placeholder="$t('attendance.holiday.form.timeEnd')" />
      </el-form-item>

      <el-form-item :label="$t('attendance.holiday.form.reasonPh')">
        <el-input v-model="form.memo" type="textarea" :rows="3" resize="none" />
      </el-form-item>
    </el-form>

    <template v-if="!viewOnly" #footer>
      <el-button @click="open = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="loading" @click="submit">{{ $t('common.submit') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { attendanceHolidayApi, membershipApi } from '@/api'
import type { AttendanceLeavePassRecord } from '@/types/modules/attendance-holiday'

type Loose = Record<string, unknown>

const props = defineProps<{
  visible: boolean
  /** 编辑行；批量模式时 null，配合 batchRows */
  edit: AttendanceLeavePassRecord | null
  batchRows: AttendanceLeavePassRecord[] | null
  viewOnly: boolean
}>()

const emit = defineEmits<{
  'update:visible': [boolean]
  success: []
}>()

const { t } = useI18n()

const open = computed({
  get: () => props.visible,
  set: (v) => emit('update:visible', v)
})

const isBatch = computed(() => (props.batchRows?.length ?? 0) > 0)

const dialogTitle = computed(() =>
  isBatch.value
    ? t('attendance.holidayPass.dialog.batchTitle')
    : props.viewOnly
      ? t('attendance.holiday.actions.detail')
      : form.id
        ? t('attendance.holidayPass.dialog.editTitle')
        : t('attendance.holidayPass.dialog.addTitle')
)

const viewOnly = computed(() => props.viewOnly)

const formRef = ref<FormInstance>()
const loading = ref(false)
const displayStudent = ref('')
const studentInfo = ref<Loose>({})
const timeRangeModel = ref<[string, string]>(['08:00', '09:00'])

const form = reactive<{
  id?: string | number
  studentNo?: string
  passTime?: string
  memo?: string
  way?: string
  dateLimit?: string[] | string
}>({
  passTime: dayjs().format('YYYY-MM-DD'),
  memo: '',
  way: '',
  dateLimit: ['08:00', '09:00']
})

const unwrapData = (raw: unknown): unknown => {
  if (!raw || typeof raw !== 'object') {
    return raw
  }
  const r = raw as Loose
  const inner = r.data
  if (inner !== undefined && inner !== null && typeof inner === 'object' && !Array.isArray(inner)) {
    return inner
  }
  return raw
}

const unwrapStudentList = (raw: unknown): Loose[] => {
  const body = unwrapData(raw)
  if (Array.isArray(body)) {
    return body as Loose[]
  }
  if (body && typeof body === 'object') {
    const b = body as Loose
    if (Array.isArray(b.data)) {
      return b.data as Loose[]
    }
  }
  return []
}

const studentLine = computed(() => {
  const s = studentInfo.value
  if (!s || typeof s !== 'object') {
    return ''
  }
  const name = (s.fullName ?? s.name) as string | undefined
  if (!name) {
    return ''
  }
  return `${t('attendance.holiday.columns.studentName')}：${name} · ${s.schoolName ?? s.enName ?? ''}`
})

const rules = computed<FormRules>(() => ({
  studentNo: [
    {
      validator: (_rule, value, cb) => {
        if (isBatch.value || form.id != null || props.viewOnly) {
          cb()
          return
        }
        if (!value) {
          cb(new Error(t('attendance.holiday.form.ruleStudent')))
          return
        }
        cb()
      },
      trigger: 'change'
    }
  ],
  way: [{ required: true, message: t('attendance.holidayPass.rules.way'), trigger: 'change' }],
  passTime: [{ required: true, message: t('attendance.holidayPass.rules.passTime'), trigger: 'change' }],
  dateLimit: [
    {
      validator: (_rule, _value, cb) => {
        if (!Array.isArray(timeRangeModel.value) || timeRangeModel.value.length !== 2) {
          cb(new Error(t('attendance.holidayPass.rules.slot')))
          return
        }
        cb()
      },
      trigger: 'change'
    }
  ]
}))

watch(timeRangeModel, (v) => {
  if (Array.isArray(v) && v.length === 2) {
    form.dateLimit = v
  } else {
    form.dateLimit = []
  }
})

const resetEmpty = () => {
  form.id = undefined
  form.studentNo = ''
  form.passTime = dayjs().format('YYYY-MM-DD')
  form.memo = ''
  form.way = ''
  form.dateLimit = ['08:00', '09:00']
  timeRangeModel.value = ['08:00', '09:00']
  displayStudent.value = ''
  studentInfo.value = {}
}

watch(
  () => props.visible,
  (v) => {
    if (!v) {
      return
    }
    if (isBatch.value) {
      /** 对齐旧批量弹窗打开：共用字段重置为默认值，逐项更新仍走后端 leave/pass/update */
      resetEmpty()
      void nextTick(() => formRef.value?.clearValidate())
      return
    }
    const row = props.edit
    if (!row) {
      resetEmpty()
      return
    }
    form.id = row.id
    form.passTime = row.passTime ? String(row.passTime) : dayjs().format('YYYY-MM-DD')
    form.memo = row.memo != null ? String(row.memo) : ''
    form.way = row.way != null ? String(row.way) : ''
    const dl = row.dateLimit
    if (Array.isArray(dl) && dl.length === 2) {
      form.dateLimit = [String(dl[0]), String(dl[1])]
      timeRangeModel.value = [String(dl[0]), String(dl[1])]
    } else {
      timeRangeModel.value = ['08:00', '09:00']
    }
    const no = String(row.studentNo ?? (row as Loose).admissonNo ?? '')
    form.studentNo = no
    displayStudent.value = no
    if (no) {
      membershipApi.studentInfo.get(no).then((res) => {
        const data = unwrapData(res) as Loose
        studentInfo.value = data && typeof data === 'object' ? data : {}
      })
    } else {
      studentInfo.value = {}
    }
  }
)

const onClose = () => {
  formRef.value?.resetFields()
}

const queryStudents = (query: string, cb: (rows: { value: string; studentNo: string }[]) => void) => {
  const q = query.trim()
  if (!q) {
    cb([])
    return
  }
  membershipApi.searchStudent
    .get(q)
    .then((res) => {
      const list = unwrapStudentList(res)
      cb(
        list.map((item) => ({
          value: `${item.showName ?? item.name ?? ''}(${item.admissonNo ?? item.admissionNo ?? ''})`,
          studentNo: String(item.admissonNo ?? item.admissionNo ?? '')
        }))
      )
    })
    .catch(() => cb([]))
}

const onStudentSelect = (item: { studentNo: string }) => {
  form.studentNo = item.studentNo
  displayStudent.value = item.value
  membershipApi.studentInfo.get(item.studentNo).then((res) => {
    const data = unwrapData(res) as Loose
    studentInfo.value = data && typeof data === 'object' ? data : {}
  })
}

const onStudentClear = () => {
  form.studentNo = ''
  displayStudent.value = ''
  studentInfo.value = {}
}

const buildPayload = (extra: Loose) => {
  const si = studentInfo.value
  const row = extra as {
    studentName?: string
    studentSchool?: string
    studentGrade?: string
    studentClass?: string
    studentAvatar?: string
    studentDormitoryStatus?: number
  }
  /** 单行：extra 为空，学生信息取自 studentInfo；批量：extra 中带列表行字段，不能与空 studentInfo 覆盖 */
  return {
    ...form,
    ...extra,
    studentName: row.studentName ?? ((si.name ?? si.fullName ?? '') as string),
    studentSchool: row.studentSchool ?? ((si.schoolName ?? si.enName ?? '') as string),
    studentGrade: row.studentGrade ?? ((si.gradeName ?? si.grade ?? '') as string),
    studentClass: row.studentClass ?? ((si.formCode ?? '') as string),
    studentAvatar: row.studentAvatar ?? ((si.profilePhoto ?? '') as string),
    studentDormitoryStatus: row.studentDormitoryStatus ?? ((si.dormitoryStatus ?? 0) as number)
  }
}

const submit = async () => {
  /** 单行与批量均需校验放行方式 / 放行日期 / 时段（对齐旧版 passModel.vue）；批量不校验「选择学生」 */
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  if (!Array.isArray(timeRangeModel.value) || timeRangeModel.value.length !== 2) {
    ElMessage.error(t('attendance.holidayPass.rules.slot'))
    return
  }

  if (isBatch.value && props.batchRows?.length) {
    loading.value = true
    try {
      /** 等价旧 Promise.all(updateReleasePass)：同上表单字段 + 每行 student* */
      const rows = props.batchRows
      await Promise.all(
        rows.map((student) => {
          const lo = student as Loose
          return attendanceHolidayApi.leavePassUpdate.post(
            buildPayload({
              id: student.id,
              studentNo: student.studentNo,
              studentName: student.studentName,
              studentSchool: student.studentSchool,
              studentGrade: student.studentGrade,
              studentClass: student.studentClass,
              studentDormitoryStatus: student.studentDormitoryStatus ?? 0,
              studentAvatar: (lo.studentAvatar ?? lo.student_avatar ?? '') as string
            }) as Loose
          )
        })
      )
      ElMessage.success(t('attendance.holiday.messages.withdrawSuccess'))
      emit('success')
      open.value = false
    } finally {
      loading.value = false
    }
    return
  }
  loading.value = true
  try {
    const body = buildPayload({})
    const api = form.id ? attendanceHolidayApi.leavePassUpdate : attendanceHolidayApi.leavePassSave
    await api.post(body as unknown as Record<string, unknown>)
    ElMessage.success(t('attendance.holiday.messages.withdrawSuccess'))
    emit('success')
    open.value = false
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.holiday-pass-dialog__batch {
  margin-bottom: 16px;
}
.holiday-pass-dialog__hint {
  margin-top: 8px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
</style>
