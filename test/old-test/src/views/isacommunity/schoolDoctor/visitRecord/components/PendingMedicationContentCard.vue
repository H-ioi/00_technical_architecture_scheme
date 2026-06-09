<template>
  <div class="medication-card">
    <div class="medication-card__header">
      <span class="medication-card__title">
        <span class="medication-card__index">{{ index + 1 }}</span>
        {{ content.medicineName || $t("schoolDoctor.药物名称") }}
      </span>
    </div>
    <el-row v-if="displayFields.length" :gutter="16" class="medication-card__body">
      <el-col v-for="(field, fi) in displayFields" :key="fi" :span="field.span || 8">
        <div class="field-item">
          <div class="field-item__label">{{ field.label }}</div>
          <div class="field-item__value">{{ field.value }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { buildMedicationDisplayFields } from "../utils/visitRecordOptions.js";

export default {
  name: "PendingMedicationContentCard",
  props: {
    content: { type: Object, default: () => ({}) },
    index: { type: Number, default: 0 },
  },
  computed: {
    displayFields() {
      return buildMedicationDisplayFields(this.content, (key) => this.$t(key));
    },
  },
};
</script>

<style lang="scss" scoped>
$theme-color: #ba8e62;

.medication-card {
  margin-bottom: 12px;
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  background: #fafafa;

  &:last-child {
    margin-bottom: 0;
  }
}

.medication-card__header {
  margin-bottom: 12px;
}

.medication-card__title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.medication-card__index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  font-size: 12px;
  color: #fff;
  background: $theme-color;
  border-radius: 50%;
}

.field-item {
  margin-bottom: 12px;
}

.field-item__label {
  margin-bottom: 4px;
  font-size: 12px;
  color: #909399;
}

.field-item__value {
  font-size: 14px;
  line-height: 1.6;
  color: #303133;
  word-break: break-word;
}
</style>
