<template>
  <el-drawer
    v-model="visible"
    :title="drawerTitle"
    size="1100px"
    destroy-on-close
    class="student-record-drawer">
    <div v-if="visible" v-loading="loading" class="student-record-drawer__body">
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane :label="$t('schoolDoctor.studentRecord.tabStudent')" name="student">
          <ArchiveStudentTab :student-info="studentInfo" :archive-meta="archiveMeta" />
        </el-tab-pane>
        <el-tab-pane :label="$t('schoolDoctor.studentRecord.tabHealth')" name="health">
          <ArchiveHealthTab
            v-model:edit-form="editForm"
            :health-history="healthHistory"
            :is-editable="mode === 'edit'" />
        </el-tab-pane>
        <el-tab-pane :label="$t('schoolDoctor.studentRecord.tabVaccine')" name="vaccine">
          <ArchiveVaccineTab :vaccine-exam="vaccineExam" />
        </el-tab-pane>
        <el-tab-pane :label="$t('schoolDoctor.studentRecord.tabVisit')" name="visit">
          <ArchiveVisitTab :visit-records="visitRecords" />
        </el-tab-pane>
      </el-tabs>
    </div>

    <template v-if="mode === 'edit'" #footer>
      <el-button @click="visible = false">{{ $t('schoolDoctor.common.cancel') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="submitEdit">
        {{ $t('schoolDoctor.common.confirm') }}
      </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
import { computed, reactive, ref, watch } from 'vue'

import { medicalArchiveApi, medicalInfoApi } from '@/api'
import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'
import type {
  MedicalArchiveHealthEditModel,
  MedicalArchiveHealthHistory,
  MedicalArchiveStudentInfo,
  MedicalArchiveVaccineExam,
  MedicalArchiveVisitRecord
} from '@/types/modules/medical-archive'
import { normalizeEnvelope } from '@/utils/api-response-normalize'

import ArchiveHealthTab from './archive-health-tab.vue'
import ArchiveStudentTab from './archive-student-tab.vue'
import ArchiveVaccineTab from './archive-vaccine-tab.vue'
import ArchiveVisitTab from './archive-visit-tab.vue'

type Loose = Record<string, unknown>

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  mode: 'view' | 'edit'
  recordId?: string | number
}>()

const emit = defineEmits<{
  saved: []
}>()

const { t } = useUniI18n()
const { detailLoading: loading, runWithDetailLoading } = useDialogDetailLoading()
const submitting = ref(false)
const activeTab = ref('student')

const studentInfo = ref<MedicalArchiveStudentInfo>({})
const archiveMeta = reactive({
  creator: '',
  createTime: '',
  updateTime: '',
  status: undefined as number | undefined
})
const healthHistory = ref<MedicalArchiveHealthHistory>({})
const vaccineExam = ref<MedicalArchiveVaccineExam>({})
const visitRecords = ref<MedicalArchiveVisitRecord[]>([])
const editForm = ref<MedicalArchiveHealthEditModel>({
  id: undefined,
  height: undefined,
  weight: undefined,
  leftVision: undefined,
  rightVision: undefined,
  leftEar: undefined,
  rightEar: undefined,
  nurseRemark: ''
})

const drawerTitle = computed(() =>
  props.mode === 'edit'
    ? t('schoolDoctor.studentRecord.detailEditTitle')
    : t('schoolDoctor.studentRecord.detailViewTitle')
)

function parseMetricNumber(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return undefined
  }
  const num = Number(value)
  return Number.isFinite(num) ? num : undefined
}

function formatMetricValue(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return ''
  }
  return String(value)
}

function buildEditForm(history: MedicalArchiveHealthHistory = {}): MedicalArchiveHealthEditModel {
  return {
    id: history.id,
    height: parseMetricNumber(history.height),
    weight: parseMetricNumber(history.weight),
    leftVision: parseMetricNumber(history.leftVision),
    rightVision: parseMetricNumber(history.rightVision),
    leftEar: parseMetricNumber(history.leftEar),
    rightEar: parseMetricNumber(history.rightEar),
    nurseRemark: history.nurseRemark || ''
  }
}

watch(visible, async (open) => {
  if (!open || props.recordId == null) {
    return
  }
  activeTab.value = 'student'
  await runWithDetailLoading(async () => {
    const raw = await medicalArchiveApi.detail.get(props.recordId!)
    const body = normalizeEnvelope(raw) as Loose
    studentInfo.value = (body.student as MedicalArchiveStudentInfo) || {}
    archiveMeta.creator = String(body.creator ?? '')
    archiveMeta.createTime = String(body.createTime ?? '')
    archiveMeta.updateTime = String(body.updateTime ?? '')
    archiveMeta.status = body.status as number | undefined
    healthHistory.value = (body.healthHistory as MedicalArchiveHealthHistory) || {}
    vaccineExam.value = (body.vaccineAndExam as MedicalArchiveVaccineExam) || {}
    visitRecords.value = Array.isArray(body.visitRecords)
      ? (body.visitRecords as MedicalArchiveVisitRecord[])
      : []
    editForm.value = buildEditForm(healthHistory.value)
  })
})

async function submitEdit() {
  if (!editForm.value.id) {
    ElMessage.warning(t('schoolDoctor.studentRecord.noHealthInfo'))
    return
  }
  submitting.value = true
  try {
    const form = editForm.value
    await medicalInfoApi.edit.post({
      ...healthHistory.value,
      id: form.id,
      height: formatMetricValue(form.height),
      weight: formatMetricValue(form.weight),
      leftVision: formatMetricValue(form.leftVision),
      rightVision: formatMetricValue(form.rightVision),
      leftEar: formatMetricValue(form.leftEar),
      rightEar: formatMetricValue(form.rightEar),
      nurseRemark: form.nurseRemark || ''
    })
    ElMessage.success(t('schoolDoctor.common.saveSuccess'))
    visible.value = false
    emit('saved')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.student-record-drawer {
  &__body {
    min-height: 200px;
    padding: 0 4px;
  }
}
</style>
