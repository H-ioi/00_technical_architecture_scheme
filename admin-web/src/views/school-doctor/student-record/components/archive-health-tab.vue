<template>
  <div class="archive-health-tab">
    <div v-if="showMetricsPanel || showNursePanel" class="archive-health-tab__layout">
      <div v-if="showMetricsPanel" class="archive-health-tab__card">
        <div class="archive-health-tab__title">{{ $t('schoolDoctor.studentRecord.healthMetrics') }}</div>
        <div class="archive-health-tab__metrics">
          <div v-for="item in metricItems" :key="item.key" class="archive-health-tab__metric">
            <div class="archive-health-tab__metric-label">{{ item.label }}</div>
            <el-input-number
              v-if="isEditable"
              v-model="editForm[item.prop]"
              size="small"
              controls-position="right"
              :min="item.min"
              :max="item.max"
              :step="item.step"
              :precision="item.precision"
              style="width: 100%" />
            <div v-else class="archive-health-tab__metric-value">{{ item.value }}</div>
          </div>
        </div>
      </div>

      <div v-if="showNursePanel" class="archive-health-tab__card">
        <div class="archive-health-tab__title">{{ $t('schoolDoctor.studentRecord.nurseRemark') }}</div>
        <el-input
          v-if="isEditable"
          v-model="editForm.nurseRemark"
          type="textarea"
          :rows="5"
          :placeholder="$t('schoolDoctor.studentRecord.phNurseRemark')" />
        <div v-else class="archive-health-tab__nurse">{{ healthHistory.nurseRemark }}</div>
      </div>
    </div>

    <div v-if="visibleAllergies.length" class="archive-health-tab__card archive-health-tab__section">
      <div class="archive-health-tab__title">{{ $t('schoolDoctor.studentRecord.allergySection') }}</div>
      <div class="archive-health-tab__allergies">
        <div
          v-for="item in visibleAllergies"
          :key="item.key"
          class="archive-health-tab__allergy"
          :class="item.typeClass">
          <div class="archive-health-tab__allergy-label">{{ item.label }}</div>
          <div>{{ item.value }}</div>
        </div>
      </div>
    </div>

    <div v-if="diseaseList.length" class="archive-health-tab__card archive-health-tab__section">
      <div class="archive-health-tab__title">{{ $t('schoolDoctor.studentRecord.diseaseSection') }}</div>
      <el-table :data="diseaseList" border size="small">
        <el-table-column :label="$t('schoolDoctor.studentRecord.diseaseName')" min-width="120" prop="diseaseNameText" />
        <el-table-column
          :label="$t('schoolDoctor.studentRecord.diseaseCondition')"
          prop="conditionStatusText"
          width="120" />
        <el-table-column
          :label="$t('schoolDoctor.studentRecord.diseaseMedication')"
          prop="medicationUsage"
          min-width="140" />
        <el-table-column
          :label="$t('schoolDoctor.studentRecord.diseaseAttack')"
          prop="attackTimeDetail"
          min-width="160" />
        <el-table-column :label="$t('schoolDoctor.studentRecord.diseaseMeasures')" prop="measures" min-width="120" />
        <el-table-column
          :label="$t('schoolDoctor.studentRecord.diseaseDiagnosis')"
          prop="diagnosisAndTreatment"
          min-width="140" />
      </el-table>
    </div>

    <el-empty v-if="!hasAnyContent" :description="$t('schoolDoctor.common.noData')" />
  </div>
</template>

<script setup lang="ts">
import { useUniI18n } from 'uni-ui-lib'
import { computed, onMounted, ref } from 'vue'

import { schoolDoctorDiseaseSettingApi } from '@/api'
import type {
  MedicalArchiveDiseaseItem,
  MedicalArchiveHealthEditModel,
  MedicalArchiveHealthHistory
} from '@/types/modules/medical-archive'
import type { SchoolDoctorDiseaseOption } from '@/api/modules/school-doctor-disease-setting'
import { normalizePaged } from '@/utils/api-response-normalize'

const props = defineProps<{
  healthHistory: MedicalArchiveHealthHistory
  isEditable: boolean
}>()

const editForm = defineModel<MedicalArchiveHealthEditModel>('editForm', { required: true })

const { t } = useUniI18n()
const diseaseOptions = ref<SchoolDoctorDiseaseOption[]>([])

const metricDefs = [
  { key: 'height', prop: 'height' as const, labelKey: 'metricHeight', suffix: ' cm', min: 50, max: 250, step: 1, precision: 1 },
  { key: 'weight', prop: 'weight' as const, labelKey: 'metricWeight', suffix: ' kg', min: 10, max: 200, step: 0.1, precision: 1 },
  { key: 'leftVision', prop: 'leftVision' as const, labelKey: 'metricLeftVision', prefix: 'L: ', min: 0.1, max: 5.3, step: 0.1, precision: 1 },
  { key: 'rightVision', prop: 'rightVision' as const, labelKey: 'metricRightVision', prefix: 'R: ', min: 0.1, max: 5.3, step: 0.1, precision: 1 },
  { key: 'leftEar', prop: 'leftEar' as const, labelKey: 'metricLeftEar', min: 0, max: 120, step: 1, precision: 0 },
  { key: 'rightEar', prop: 'rightEar' as const, labelKey: 'metricRightEar', min: 0, max: 120, step: 1, precision: 0 }
]

function hasText(value: unknown) {
  if (value === null || value === undefined) {
    return false
  }
  if (typeof value === 'string') {
    return value.trim() !== ''
  }
  return true
}

const metricItems = computed(() => {
  const history = props.healthHistory || {}
  const form = editForm.value || {}

  return metricDefs
    .filter((item) => {
      if (props.isEditable) {
        return true
      }
      return hasText(history[item.prop]) || hasText(form[item.prop])
    })
    .map((item) => {
      const rawValue = form[item.prop] ?? history[item.prop]
      let value = rawValue
      if (hasText(rawValue)) {
        value = `${item.prefix || ''}${rawValue}${item.suffix || ''}`
      }
      return {
        ...item,
        label: t(`schoolDoctor.studentRecord.${item.labelKey}`),
        value
      }
    })
})

const visibleAllergies = computed(() => {
  const history = props.healthHistory || {}
  const items = [
    { key: 'foodAllergy', label: t('schoolDoctor.studentRecord.allergyFood'), value: history.foodAllergy, typeClass: 'is-danger' },
    { key: 'drugAllergy', label: t('schoolDoctor.studentRecord.allergyDrug'), value: history.drugAllergy, typeClass: 'is-danger' },
    { key: 'contactAllergy', label: t('schoolDoctor.studentRecord.allergyContact'), value: history.contactAllergy, typeClass: 'is-purple' },
    { key: 'otherAllergy', label: t('schoolDoctor.studentRecord.allergyOther'), value: history.otherAllergy, typeClass: 'is-warning' }
  ]
  return items.filter((item) => hasText(item.value))
})

const diseaseList = computed(() => {
  const conditionMap: Record<number, string> = {
    1: t('schoolDoctor.studentRecord.conditionRecovered'),
    2: t('schoolDoctor.studentRecord.conditionOccasional'),
    3: t('schoolDoctor.studentRecord.conditionFrequent')
  }

  return (props.healthHistory.diseaseList || []).map((item) => ({
    ...item,
    diseaseNameText: diseaseDisplayName(item),
    conditionStatusText: conditionMap[Number(item.conditionStatus)] || '--'
  }))
})

const showMetricsPanel = computed(() => metricItems.value.length > 0)
const showNursePanel = computed(
  () =>
    props.isEditable ||
    hasText(props.healthHistory.nurseRemark) ||
    hasText(editForm.value.nurseRemark)
)
const hasAnyContent = computed(
  () =>
    showMetricsPanel.value ||
    showNursePanel.value ||
    visibleAllergies.value.length > 0 ||
    diseaseList.value.length > 0
)

function findDiseaseOption(disease: MedicalArchiveDiseaseItem) {
  return diseaseOptions.value.find((item) => String(item.id) === String(disease.diseaseId))
}

function isOtherDisease(disease: MedicalArchiveDiseaseItem) {
  const option = findDiseaseOption(disease)
  const name = (option && (option.cnName || option.name)) || ''
  return /其他|other/i.test(name)
}

/** 疾病名称回显：字典项取 cnName，其他类取 diseaseNameOther */
function diseaseDisplayName(disease: MedicalArchiveDiseaseItem) {
  const option = findDiseaseOption(disease)
  const settingName = option ? option.cnName || option.name || '' : ''
  if (isOtherDisease(disease)) {
    return disease.diseaseNameOther || settingName || '--'
  }
  return settingName || disease.diseaseName || disease.diseaseNameOther || '--'
}

onMounted(async () => {
  const raw = await schoolDoctorDiseaseSettingApi.page.get({ current: 1, size: 500, type: 1, status: 1 })
  const { list } = normalizePaged<SchoolDoctorDiseaseOption>(raw)
  diseaseOptions.value = list
})
</script>

<style scoped lang="scss">
.archive-health-tab {
  &__layout {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 16px;
  }

  &__card {
    padding: 20px;
    background: #fff;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 12px;
  }

  &__section {
    margin-top: 16px;
  }

  &__title {
    margin-bottom: 16px;
    font-size: 15px;
    font-weight: 600;
  }

  &__metrics,
  &__allergies {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  &__metric,
  &__allergy {
    padding: 14px;
    background: var(--el-fill-color-light);
    border-radius: 10px;
  }

  &__metric-label,
  &__allergy-label {
    margin-bottom: 8px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  &__metric-value {
    font-size: 16px;
    font-weight: 600;
  }

  &__nurse {
    padding: 14px 16px;
    background: var(--el-color-primary-light-9);
    border-left: 4px solid var(--el-color-primary);
    border-radius: 8px;
    line-height: 1.8;
    white-space: pre-wrap;
  }

  &__allergy.is-danger {
    background: var(--el-color-danger-light-9);

    .archive-health-tab__allergy-label {
      color: var(--el-color-danger);
    }
  }

  &__allergy.is-purple {
    background: #f5f0ff;

    .archive-health-tab__allergy-label {
      color: #7b61ff;
    }
  }

  &__allergy.is-warning {
    background: var(--el-color-warning-light-9);

    .archive-health-tab__allergy-label {
      color: var(--el-color-warning);
    }
  }
}
</style>
