<template>
  <div class="medical-section">
    <div class="medical-section__head">
      <div>
        <h3>{{ $t('schoolDoctor.studentRecord.diseaseSection') }}</h3>
        <p>{{ $t('schoolDoctor.medicalInfo.diseaseSectionDesc') }}</p>
      </div>
      <el-tag type="danger" effect="plain">
        {{ diseaseList.length }} {{ $t('schoolDoctor.medicalInfo.diseaseRecords') }}
      </el-tag>
    </div>

    <div v-for="(disease, index) in diseaseList" :key="index" class="disease-card">
      <div class="disease-card__head">
        <span>{{ index + 1 }}. {{ $t('schoolDoctor.medicalInfo.diseaseRecord') }}</span>
        <el-button v-if="!readonly" type="danger" link @click="emit('remove', index)">
          {{ $t('schoolDoctor.common.delete') }}
        </el-button>
      </div>
      <el-row :gutter="12">
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.studentRecord.diseaseName')">
            <el-select
              v-model="disease.diseaseId"
              style="width: 100%"
              :disabled="readonly"
              clearable
              filterable
              :placeholder="$t('schoolDoctor.common.select')"
              @change="emit('disease-change', disease)">
              <el-option
                v-for="item in diseaseOptions"
                :key="item.id"
                :label="item.cnName || item.name"
                :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :prop="`diseaseList.${index}.conditionStatus`"
            :rules="diseaseRules.conditionStatus"
            :label="$t('schoolDoctor.studentRecord.diseaseCondition')">
            <el-select
              v-model="disease.conditionStatus"
              style="width: 100%"
              :disabled="readonly"
              clearable
              :placeholder="$t('schoolDoctor.common.select')">
              <el-option :label="$t('schoolDoctor.studentRecord.conditionRecovered')" :value="1" />
              <el-option :label="$t('schoolDoctor.studentRecord.conditionOccasional')" :value="2" />
              <el-option :label="$t('schoolDoctor.studentRecord.conditionFrequent')" :value="3" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :prop="`diseaseList.${index}.needRegularMedicationSchool`"
            :rules="diseaseRules.needRegularMedicationSchool"
            :label="$t('schoolDoctor.medicalInfo.needSchoolMedication')">
            <el-select
              v-model="disease.needRegularMedicationSchool"
              style="width: 100%"
              :disabled="readonly"
              clearable
              :placeholder="$t('schoolDoctor.common.select')">
              <el-option :label="$t('schoolDoctor.common.yes')" :value="1" />
              <el-option :label="$t('schoolDoctor.common.no')" :value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="isOtherDisease(disease)" :span="24">
          <el-form-item :label="$t('schoolDoctor.medicalInfo.otherDiseaseName')">
            <el-input
              v-model="disease.diseaseNameOther"
              :disabled="readonly"
              :placeholder="$t('schoolDoctor.medicalInfo.phOtherDisease')" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('schoolDoctor.studentRecord.diseaseMedication')">
            <el-input
              v-model="disease.medicationUsage"
              :disabled="readonly"
              :placeholder="$t('schoolDoctor.medicalInfo.medicationUsagePh')" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.studentRecord.diseaseAttack')">
            <el-input v-model="disease.attackTimeDetail" type="textarea" :rows="4" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.studentRecord.diseaseMeasures')">
            <el-input v-model="disease.measures" type="textarea" :rows="4" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.studentRecord.diseaseDiagnosis')">
            <el-input v-model="disease.diagnosisAndTreatment" type="textarea" :rows="4" :disabled="readonly" />
          </el-form-item>
        </el-col>
      </el-row>
    </div>

    <el-button v-if="!readonly" class="disease-card__add" @click="emit('add')">
      + {{ $t('schoolDoctor.medicalInfo.addDisease') }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import type { FormRules } from 'element-plus'

import type { SchoolDoctorDiseaseOption } from '@/api/modules/school-doctor-disease-setting'
import type { MedicalInfoDiseaseItem } from '@/types/modules/medical-info'

defineProps<{
  diseaseList: MedicalInfoDiseaseItem[]
  diseaseOptions: SchoolDoctorDiseaseOption[]
  diseaseRules: FormRules
  readonly: boolean
  isOtherDisease: (disease: MedicalInfoDiseaseItem) => boolean
}>()

const emit = defineEmits<{
  add: []
  remove: [index: number]
  'disease-change': [disease: MedicalInfoDiseaseItem]
}>()
</script>

<style scoped lang="scss">
.medical-section {
  margin-bottom: 16px;
  padding: 20px;
  background: #fff;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    p {
      margin: 6px 0 0;
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }
}

.disease-card {
  margin-bottom: 16px;
  padding: 16px;
  background: var(--el-fill-color-light);
  border-radius: 10px;

  &__head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-weight: 600;
  }

  &__add {
    width: 100%;
  }
}
</style>
