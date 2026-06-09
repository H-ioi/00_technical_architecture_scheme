<template>
  <div>
    <div class="section-card">
      <div class="section-card__header">
        <span class="section-card__title has-icon">
          <i class="el-icon-first-aid-kit section-card__title-icon"></i>
          {{ $t('schoolDoctor.基础健康信息') }}
        </span>
      </div>
      <el-row :gutter="16">
        <el-col :span="8" v-for="field in healthFields" :key="field.prop">
          <el-form-item :label="$t(`schoolDoctor.${field.label}`)">
            <el-input v-model="form[field.prop]" class="health-input" :disabled="readonly" :placeholder="field.placeholder ? $t(field.placeholder) : ''">
              <template v-if="field.unit" slot="append">{{ field.unit }}</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </div>

    <div class="section-card">
      <div class="section-card__header">
        <span class="section-card__title has-icon">
          <i class="el-icon-warning-outline section-card__title-icon"></i>
          {{ $t('schoolDoctor.过敏信息') }}
        </span>
      </div>
      <el-row :gutter="16">
        <el-col :span="12" v-for="field in allergyFields" :key="field.prop">
          <el-form-item :label="$t(`schoolDoctor.${field.label}`)">
            <el-input
              v-model="form[field.prop]"
              type="textarea"
              :rows="4"
              class="allergy-textarea"
              :disabled="readonly"
              :placeholder="field.placeholderKey ? $t(`schoolDoctor.${field.placeholderKey}`) : ''" />
          </el-form-item>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MedicalInfoHealthSection',
  props: {
    form: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
    healthFields: { type: Array, default: () => [] },
    allergyFields: { type: Array, default: () => [] }
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
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
}

.section-card__title {
  position: relative;
  padding-left: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 2px;
    width: 4px;
    height: 16px;
    border-radius: 2px;
    background: #ba8e62;
  }

  &.has-icon {
    display: inline-flex;
    align-items: center;
    padding-left: 0;

    &::before {
      display: none;
    }
  }
}

.section-card__title-icon {
  margin-right: 6px;
  color: #ba8e62;
}

.health-input {
  ::v-deep .el-input-group__append {
    padding: 0 12px;
    background: #f5f7fa;
    color: #909399;
  }
}

.allergy-textarea {
  ::v-deep .el-textarea__inner {
    min-height: 120px;
  }
}
</style>
