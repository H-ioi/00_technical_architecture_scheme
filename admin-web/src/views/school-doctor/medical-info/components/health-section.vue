<template>
  <div>
    <div class="medical-section">
      <h3>{{ $t('schoolDoctor.medicalInfo.sectionHealthBasic') }}</h3>
      <el-row :gutter="16">
        <el-col v-for="field in healthFields" :key="field.prop" :span="8">
          <el-form-item :label="field.label">
            <el-input v-model="formModel[field.prop]" :disabled="readonly" :placeholder="field.placeholder">
              <template v-if="field.unit" #append>{{ field.unit }}</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </div>

    <div class="medical-section">
      <h3>{{ $t('schoolDoctor.medicalInfo.sectionAllergy') }}</h3>
      <el-row :gutter="16">
        <el-col v-for="field in allergyFields" :key="field.prop" :span="12">
          <el-form-item :label="field.label">
            <el-input
              v-model="formModel[field.prop]"
              type="textarea"
              :rows="4"
              :disabled="readonly"
              :placeholder="field.placeholder"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUniI18n } from 'uni-ui-lib'
import { computed, defineModel } from 'vue'

import type { MedicalInfoFormModel } from '@/types/modules/medical-info'

const formModel = defineModel<MedicalInfoFormModel>('form', { required: true })

defineProps<{
  readonly: boolean
}>()

const { t } = useUniI18n()

const healthFields = computed(() => [
  { prop: 'height' as const, label: t('schoolDoctor.studentRecord.metricHeight'), unit: 'cm', placeholder: t('schoolDoctor.medicalInfo.phHeight') },
  { prop: 'weight' as const, label: t('schoolDoctor.studentRecord.metricWeight'), unit: 'kg', placeholder: t('schoolDoctor.medicalInfo.phWeight') },
  { prop: 'leftVision' as const, label: t('schoolDoctor.studentRecord.metricLeftVision'), unit: '', placeholder: t('schoolDoctor.medicalInfo.phLeftVision') },
  { prop: 'rightVision' as const, label: t('schoolDoctor.studentRecord.metricRightVision'), unit: '', placeholder: t('schoolDoctor.medicalInfo.phRightVision') },
  { prop: 'leftEar' as const, label: t('schoolDoctor.studentRecord.metricLeftEar'), unit: '', placeholder: t('schoolDoctor.medicalInfo.phLeftEar') },
  { prop: 'rightEar' as const, label: t('schoolDoctor.studentRecord.metricRightEar'), unit: '', placeholder: t('schoolDoctor.medicalInfo.phRightEar') }
])

const allergyFields = computed(() => [
  { prop: 'foodAllergy' as const, label: t('schoolDoctor.studentRecord.allergyFood'), placeholder: t('schoolDoctor.medicalInfo.allergyFoodPh') },
  { prop: 'drugAllergy' as const, label: t('schoolDoctor.studentRecord.allergyDrug'), placeholder: t('schoolDoctor.medicalInfo.allergyDrugPh') },
  { prop: 'contactAllergy' as const, label: t('schoolDoctor.studentRecord.allergyContact'), placeholder: t('schoolDoctor.medicalInfo.allergyContactPh') },
  { prop: 'otherAllergy' as const, label: t('schoolDoctor.studentRecord.allergyOther'), placeholder: t('schoolDoctor.medicalInfo.allergyOtherPh') }
])
</script>

<style scoped lang="scss">
.medical-section {
  margin-bottom: 16px;
  padding: 20px;
  background: #fff;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;

  h3 {
    margin: 0 0 16px;
    font-size: 16px;
    font-weight: 600;
  }
}
</style>
