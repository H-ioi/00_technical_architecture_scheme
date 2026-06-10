<template>
  <div class="pending-detail">
    <div class="pending-detail__layout">
      <aside class="pending-detail__side">
        <div class="pending-detail__card">
          <h3>{{ $t('schoolDoctor.visitRecord.sectionStudent') }}</h3>
          <StudentRemoteSelect
            ref="studentSelectRef"
            readonly
            :with-drug-allergy="true"
            :school-records="schoolRecords"
          />
        </div>
        <div v-if="allergyList.length" class="pending-detail__card pending-detail__card--warn">
          <h3>{{ $t('schoolDoctor.visitRecord.sectionAllergy') }}</h3>
          <div v-for="(item, index) in allergyList" :key="index" class="pending-detail__allergy">
            <span>{{ item.label }}</span>
            <span>{{ item.value }}</span>
          </div>
        </div>
      </aside>

      <main class="pending-detail__main">
        <div class="pending-detail__card">
          <h3>{{ $t('schoolDoctor.visitRecord.sectionApplication') }}</h3>
          <el-row :gutter="16">
            <el-col :span="12">
              <div class="pending-detail__field">
                <span>{{ $t('schoolDoctor.visitRecord.fieldSymptom') }}</span>
                <span>{{ application.symptomDetails || '--' }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="pending-detail__field">
                <span>{{ $t('schoolDoctor.visitRecord.fieldApplicant') }}</span>
                <span>{{ application.applicant || '--' }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="pending-detail__card">
          <h3>{{ $t('schoolDoctor.visitRecord.sectionMedication') }}</h3>
          <div v-if="medicationList.length === 0" class="pending-detail__empty">{{ $t('schoolDoctor.common.noData') }}</div>
          <div v-for="(item, index) in medicationList" :key="item.id || index" class="pending-detail__med">
            <strong>{{ index + 1 }}. {{ item.medicineName || '--' }}</strong>
            <p v-if="item.dosage">{{ $t('schoolDoctor.visitRecord.fieldDosage') }}：{{ item.dosage }}</p>
            <p v-if="item.bringQuantity">{{ $t('schoolDoctor.visitRecord.fieldBringQty') }}：{{ item.bringQuantity }}</p>
          </div>
        </div>

        <div v-if="showOperationForm" class="pending-detail__card">
          <h3>{{ $t('schoolDoctor.visitRecord.sectionOperate') }}</h3>
          <PendingOperationForm ref="operationFormRef" v-model:operation-form="operationForm" :readonly="operationReadonly" />
        </div>

        <div v-if="showOperationRecords" class="pending-detail__card">
          <h3>{{ $t('schoolDoctor.visitRecord.sectionOperateRecords') }}</h3>
          <el-table v-if="operationRecords.length" :data="operationRecords" border size="small">
            <el-table-column :label="$t('schoolDoctor.visitRecord.fieldOperateDate')" prop="operateDate" width="150" />
            <el-table-column :label="$t('schoolDoctor.visitRecord.fieldOperateTime')" prop="operateTime" width="150" />
            <el-table-column :label="$t('schoolDoctor.visitRecord.fieldOperateStatus')" prop="operateStatusText" width="90" />
            <el-table-column :label="$t('schoolDoctor.visitRecord.fieldSituation')" prop="specificSituation" min-width="140" show-overflow-tooltip />
            <el-table-column :label="$t('schoolDoctor.visitRecord.fieldOperator')" prop="operatorName" width="100" />
            <el-table-column :label="$t('schoolDoctor.visitRecord.fieldLeaveTime')" prop="leaveTime" width="150" />
            <el-table-column :label="$t('schoolDoctor.visitRecord.fieldLeaveDestination')" prop="leaveDestinationText" width="90" />
            <el-table-column :label="$t('schoolDoctor.common.action')" width="100" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link @click="emit('view-operation', row)">{{ $t('schoolDoctor.studentRecord.view') }}</el-button>
                <el-button v-if="canEditOperation" type="primary" link @click="emit('edit-operation', row)">
                  {{ $t('schoolDoctor.studentRecord.edit') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-else class="pending-detail__empty">{{ $t('schoolDoctor.common.noData') }}</div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUniI18n } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'

import StudentRemoteSelect from '@/views/school-doctor/components/student-remote-select.vue'
import type { PendingMedicationDetail, PendingOperationFormModel } from '@/types/modules/school-doctor-visit-record'
import type { SchoolOptionRecord } from '@/types/modules/membership'

import { leaveDestinationOpts, operateStatusOpts } from '../record.config'
import PendingOperationForm from './pending-operation-form.vue'

const props = defineProps<{
  detail: PendingMedicationDetail
  showOperationForm: boolean
  showOperationRecords: boolean
  operationReadonly: boolean
  schoolRecords: SchoolOptionRecord[]
}>()

const emit = defineEmits<{
  'view-operation': [row: Record<string, unknown>]
  'edit-operation': [row: Record<string, unknown>]
}>()

const operationForm = defineModel<PendingOperationFormModel>('operationForm', { required: true })

const { t } = useUniI18n()
const studentSelectRef = ref<InstanceType<typeof StudentRemoteSelect> | null>(null)
const operationFormRef = ref<InstanceType<typeof PendingOperationForm> | null>(null)

const canEditOperation = computed(() => true)

const application = computed(() => {
  const d = props.detail
  return (d.application || d.applyInfo || {}) as Record<string, unknown>
})

const medical = computed(() => (props.detail.studentMedicalInfo || {}) as Record<string, unknown>)

const medicationList = computed(() => {
  const list = application.value.contentList || props.detail.contentList
  return Array.isArray(list) ? (list as Array<Record<string, unknown>>) : []
})

const allergyList = computed(() => {
  const m = medical.value
  const items = [
    { label: t('schoolDoctor.medicalInfo.allergyDrugPh'), value: m.drugAllergy, warn: true },
    { label: t('schoolDoctor.medicalInfo.allergyFoodPh'), value: m.foodAllergy },
    { label: t('schoolDoctor.medicalInfo.allergyContactPh'), value: m.contactAllergy },
    { label: t('schoolDoctor.medicalInfo.allergyOtherPh'), value: m.otherAllergy }
  ]
  return items.filter((item) => item.value)
})

const operationRecords = computed(() => {
  const list = props.detail.operationRecordList || props.detail.operationList || []
  return (list as Array<Record<string, unknown>>).map((item) => {
    const operateTime = item.operationTime || item.operateTime || item.createTime
    const status = Number(item.operationStatus ?? item.operateStatus)
    const statusItem = operateStatusOpts(t).find((opt) => opt.value === status)
    const leaveItem = leaveDestinationOpts(t).find((opt) => opt.value === item.leaveDestination)
    return {
      ...item,
      operationId: item.id || item.operationId,
      operateDate: operateTime ? String(operateTime).slice(0, 16) : '--',
      operateTime: operateTime ? String(operateTime).slice(0, 16) : '--',
      operateStatusText: statusItem?.label || '--',
      specificSituation: item.situationDetail || item.specificSituation || item.remark || '--',
      operatorName: item.operator || item.operatorName || item.creator || '--',
      leaveTime: item.leaveTime ? String(item.leaveTime).slice(0, 16) : '--',
      leaveDestinationText: leaveItem?.label || '--'
    }
  })
})

watch(
  () => props.detail,
  (detail) => {
    const app = (detail.application || detail.applyInfo || {}) as Record<string, unknown>
    const med = (detail.studentMedicalInfo || {}) as Record<string, unknown>
    studentSelectRef.value?.setDisplayFromForm({
      schoolId: app.schoolId || med.schoolId,
      admissionNo: app.admissionNo || med.admissionNo,
      fullName: app.fullName || med.fullName,
      grade: app.grade || med.grade,
      formCode: app.formCode || med.formCode,
      schoolName: app.schoolName || med.schoolName
    })
  },
  { immediate: true, deep: true }
)

async function validateOperation() {
  return await operationFormRef.value?.validate()
}

defineExpose({ validateOperation })
</script>

<style scoped lang="scss">
.pending-detail {
  &__layout {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  &__side {
    flex: 0 0 320px;
    width: 320px;
  }

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__card {
    margin-bottom: 16px;
    padding: 16px;
    background: #fff;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 12px;

    h3 {
      margin: 0 0 12px;
      font-size: 15px;
    }

    &--warn {
      border-color: var(--el-color-warning-light-5);
      background: var(--el-color-warning-light-9);
    }
  }

  &__field,
  &__allergy {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 13px;

    span:first-child {
      color: var(--el-text-color-secondary);
    }
  }

  &__med {
    margin-bottom: 12px;
    padding: 12px;
    background: var(--el-fill-color-light);
    border-radius: 8px;

    p {
      margin: 4px 0 0;
      font-size: 13px;
      color: var(--el-text-color-regular);
    }
  }

  &__empty {
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }
}
</style>
