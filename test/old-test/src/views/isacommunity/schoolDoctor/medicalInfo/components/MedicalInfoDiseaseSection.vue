<template>
  <div class="section-card">
    <div class="section-card__header">
      <div class="section-card__header-main">
        <span class="section-card__title has-icon">
          <i class="el-icon-first-aid-kit section-card__title-icon"></i>
          {{ $t('schoolDoctor.疾病信息') }}
        </span>
        <p class="section-card__subtitle">{{ $t('schoolDoctor.疾病信息说明') }}</p>
      </div>
      <span class="section-card__badge">{{ diseaseList.length }} {{ $t('schoolDoctor.个诊断记录') }}</span>
    </div>

    <div v-for="(disease, index) in diseaseList" :key="index" class="disease-card">
      <div class="disease-card__header">
        <span class="disease-card__title">
          <span class="disease-card__index">{{ index + 1 }}</span>
          {{ $t('schoolDoctor.疾病诊断记录') }}
        </span>
        <el-button v-if="!readonly" type="text" class="danger-text" @click="$emit('remove', index)">
          <i class="el-icon-delete"></i>
          {{ $t('btn.删除') }}
        </el-button>
      </div>

      <el-row :gutter="12">
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.疾病名称')">
            <el-select
              v-model="disease.diseaseId"
              style="width: 100%"
              :disabled="readonly"
              clearable
              filterable
              :placeholder="$t('schoolDoctor.请选择')"
              @change="$emit('disease-change', disease)">
              <el-option v-for="item in diseaseOptions" :key="item.id" :label="item.cnName || item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :prop="`diseaseList.${index}.conditionStatus`" :rules="diseaseRules.conditionStatus">
            <span slot="label" class="field-label">
              {{ $t('schoolDoctor.目前病情') }}
            </span>
            <el-select v-model="disease.conditionStatus" style="width: 100%" :disabled="readonly" clearable :placeholder="$t('schoolDoctor.请选择')">
              <el-option :label="$t('schoolDoctor.已经痊愈')" :value="1" />
              <el-option :label="$t('schoolDoctor.偶尔发作')" :value="2" />
              <el-option :label="$t('schoolDoctor.经常发作')" :value="3" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="diseaseRules.needRegularMedicationSchool">
            <span slot="label" class="field-label">
              {{ $t('schoolDoctor.是否需要在学校定期服用药物') }}
            </span>
            <el-select
              v-model="disease.needRegularMedicationSchool"
              style="width: 100%"
              :disabled="readonly"
              clearable
              :placeholder="$t('schoolDoctor.请选择')">
              <el-option :label="$t('schoolDoctor.是')" :value="1" />
              <el-option :label="$t('schoolDoctor.否')" :value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="isOtherDisease(disease)">
          <el-form-item :label="$t('schoolDoctor.其他疾病名称')">
            <el-input v-model="disease.diseaseNameOther" :disabled="readonly" :placeholder="$t('schoolDoctor.请输入其他疾病名称')" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('schoolDoctor.服用药物及方式')">
            <el-input v-model="disease.medicationUsage" :disabled="readonly" :placeholder="$t('schoolDoctor.服用药物及方式提示')" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.发作时间及具体情况')">
            <el-input
              v-model="disease.attackTimeDetail"
              type="textarea"
              :rows="4"
              :disabled="readonly"
              class="disease-textarea"
              :placeholder="$t('schoolDoctor.发作时间及具体情况提示')" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.采取措施')">
            <el-input
              v-model="disease.measures"
              type="textarea"
              :rows="4"
              :disabled="readonly"
              class="disease-textarea"
              :placeholder="$t('schoolDoctor.采取措施提示')" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.医疗诊断和处理')">
            <el-input
              v-model="disease.diagnosisAndTreatment"
              type="textarea"
              :rows="4"
              :disabled="readonly"
              class="disease-textarea"
              :placeholder="$t('schoolDoctor.医疗诊断和处理提示')" />
          </el-form-item>
        </el-col>
      </el-row>
    </div>

    <el-button v-if="!readonly" class="add-disease-btn" size="small" @click="$emit('add')">+ {{ $t('schoolDoctor.新增疾病') }}</el-button>
  </div>
</template>

<script>
export default {
  name: 'MedicalInfoDiseaseSection',
  props: {
    diseaseList: { type: Array, default: () => [] },
    diseaseOptions: { type: Array, default: () => [] },
    diseaseRules: { type: Object, default: () => ({}) },
    readonly: { type: Boolean, default: false },
    isOtherDisease: { type: Function, required: true }
  }
}
</script>

<style lang="scss" scoped>
.section-card {
  margin-bottom: 16px;
  padding: 20px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(31, 45, 61, 0.04);
}

.section-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
}

.section-card__header-main {
  flex: 1;
  min-width: 0;
}

.section-card__title {
  display: inline-flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.section-card__title-icon {
  margin-right: 8px;
  font-size: 18px;
  color: #f56c6c;
}

.section-card__subtitle {
  margin: 6px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: #909399;
}

.section-card__badge {
  flex-shrink: 0;
  margin-left: 12px;
  padding: 4px 12px;
  font-size: 12px;
  color: #f56c6c;
  background: #fef0f0;
  border-radius: 999px;
}

.field-label {
  display: inline-flex;
  align-items: center;
}

.required {
  margin-left: 2px;
  color: #f56c6c;
  font-style: normal;
}

.disease-card {
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  background: #fafafa;
}

.disease-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.disease-card__title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #ba8e62;
}

.disease-card__index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  font-size: 12px;
  color: #fff;
  background: #ba8e62;
  border-radius: 50%;
}

.danger-text {
  color: #f56c6c !important;
}

.disease-textarea {
  ::v-deep .el-textarea__inner {
    min-height: 100px;
    resize: vertical;
  }
}

.add-disease-btn {
  width: 100%;
  height: 40px;
  border: 1px dashed #ba8e62 !important;
  color: #ba8e62 !important;
  background: #fff !important;

  &:hover {
    color: #fff !important;
    border-color: #ba8e62 !important;
    background: #ba8e62 !important;
  }
}
</style>
