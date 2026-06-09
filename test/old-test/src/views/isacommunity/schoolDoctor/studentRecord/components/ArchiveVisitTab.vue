<template>
  <div class="archive-tab">
    <div v-if="records.length" class="visit-list">
      <div class="visit-list__title">{{ $t('schoolDoctor.校内就诊诊疗记录') }}</div>
      <div v-for="item in records" :key="item.id || item.visitTime" class="visit-card">
        <div class="visit-card__header">
          <span v-if="item.visitCode">{{ item.visitCode }}</span>
          <span v-if="item.visitTime">{{ $t('schoolDoctor.就诊日期') }}: {{ item.visitTime }}</span>
        </div>

        <div class="visit-card__body">
          <div class="visit-card__column">
            <div v-if="hasDisplayValue(item.chiefComplaint)" class="visit-field">
              <div class="visit-field__label">{{ $t('schoolDoctor.自述症状主诉') }}</div>
              <div class="visit-field__value">{{ item.chiefComplaint }}</div>
            </div>
            <div v-if="hasDisplayValue(item.remark)" class="visit-field visit-field--box">
              <div class="visit-field__label">{{ $t('schoolDoctor.处理措施给药记录') }}</div>
              <div class="visit-field__value">{{ item.remark }}</div>
            </div>
          </div>

          <div class="visit-card__column">
            <div v-if="hasDisplayValue(item.physicalExam)" class="visit-field">
              <div class="visit-field__label">{{ $t('schoolDoctor.校医查体结果') }}</div>
              <div class="visit-field__value">{{ item.physicalExam }}</div>
            </div>
            <div v-if="hasDisplayValue(item.diagnosisAdvice)" class="visit-field">
              <div class="visit-field__label">{{ $t('schoolDoctor.初步判断') }}</div>
              <div class="visit-field__value">{{ item.diagnosisAdvice }}</div>
            </div>
            <div v-if="item.metaText" class="visit-field">
              <div class="visit-field__label">{{ $t('schoolDoctor.去向联络家长') }}</div>
              <div class="visit-field__value">{{ item.metaText }}</div>
            </div>
          </div>
        </div>

        <div v-if="item.footerText" class="visit-card__footer">{{ item.footerText }}</div>
      </div>
    </div>
    <el-empty v-else :description="$t('schoolDoctor.暂无数据')" />
  </div>
</template>

<script>
import { hasDisplayValue } from "../utils/archiveDisplay.js";

export default {
  name: "ArchiveVisitTab",
  props: {
    visitRecords: { type: Array, default: () => [] },
  },
  computed: {
    records() {
      const destMap = {
        1: this.$t("schoolDoctor.课室"),
        2: this.$t("schoolDoctor.回家"),
        3: this.$t("schoolDoctor.医院"),
      };

      return (this.visitRecords || [])
        .map((item) => {
          const metaParts = [];
          if (hasDisplayValue(item.leaveDestination)) {
            metaParts.push(`${this.$t("schoolDoctor.离开去向")}：${destMap[item.leaveDestination] || item.leaveDestination}`);
          }
          if (item.contactParent === 0 || item.contactParent === 1) {
            metaParts.push(
              `${this.$t("schoolDoctor.是否联系家长")}：${
                item.contactParent === 1 ? this.$t("schoolDoctor.已联络") : this.$t("schoolDoctor.否")
              }`
            );
          }

          const footerParts = [];
          if (hasDisplayValue(item.creator)) footerParts.push(`${this.$t("schoolDoctor.接诊校医")}: ${item.creator}`);
          if (hasDisplayValue(item.createTime)) footerParts.push(`${this.$t("schoolDoctor.记录时间")}: ${item.createTime}`);

          return {
            ...item,
            visitCode: hasDisplayValue(item.id) ? `[VIS${String(item.id).padStart(3, "0")}]` : "",
            metaText: metaParts.join(" | "),
            footerText: footerParts.join(" | "),
          };
        })
        .filter((item) => {
          return (
            hasDisplayValue(item.visitCode) ||
            hasDisplayValue(item.visitTime) ||
            hasDisplayValue(item.chiefComplaint) ||
            hasDisplayValue(item.remark) ||
            hasDisplayValue(item.physicalExam) ||
            hasDisplayValue(item.diagnosisAdvice) ||
            hasDisplayValue(item.metaText) ||
            hasDisplayValue(item.footerText)
          );
        });
    },
  },
  methods: {
    hasDisplayValue,
  },
};
</script>

<style lang="scss" scoped>
.visit-list__title {
  margin-bottom: 16px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.visit-card {
  margin-bottom: 16px;
  padding: 20px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 12px;
}

.visit-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.visit-card__body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.visit-field {
  margin-bottom: 14px;

  &--box {
    padding: 12px;
    background: #f8fafc;
    border-radius: 8px;
  }
}

.visit-field__label {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #606266;
}

.visit-field__value {
  font-size: 14px;
  line-height: 1.8;
  color: #303133;
  white-space: pre-wrap;
}

.visit-card__footer {
  margin-top: 12px;
  text-align: right;
  font-size: 12px;
  color: #909399;
}
</style>
