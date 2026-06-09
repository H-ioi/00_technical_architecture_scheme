<template>
  <div class="archive-tab">
    <div v-if="showMetricsPanel || showNursePanel" class="health-layout">
      <div v-if="showMetricsPanel" class="info-card metrics-panel">
        <div class="panel-title">{{ $t('schoolDoctor.最新健康测评指标') }}</div>
        <div class="metrics-grid">
          <div v-for="item in metricItems" :key="item.key" class="metric-box">
            <div class="metric-box__label">{{ item.label }}</div>
            <el-input-number v-if="isEditable" v-model="editForm[item.prop]" size="small" controls-position="right"
              :min="item.min" :max="item.max" :step="item.step" :precision="item.precision" style="width: 100%" />
            <div v-else class="metric-box__value">{{ item.value }}</div>
          </div>
        </div>
      </div>

      <div v-if="showNursePanel" class="info-card nurse-panel">
        <div class="panel-title">{{ $t('schoolDoctor.校区看护备忘') }}</div>
        <el-input v-if="isEditable" v-model="editForm.nurseRemark" type="textarea" :rows="5"
          :placeholder="$t('schoolDoctor.请输入备注')" />
        <div v-else class="nurse-note">{{ healthHistory.nurseRemark }}</div>
      </div>
    </div>

    <div v-if="visibleAllergies.length" class="info-card allergy-panel">
      <div class="panel-title">{{ $t('schoolDoctor.既往过敏源情况清单') }}</div>
      <div class="allergy-grid">
        <div v-for="item in visibleAllergies" :key="item.key" class="allergy-box" :class="item.typeClass">
          <div class="allergy-box__label">{{ item.label }}</div>
          <div class="allergy-box__value">{{ item.value }}</div>
        </div>
      </div>
    </div>

    <div v-if="diseaseList.length" class="info-card disease-panel">
      <div class="panel-title">{{ $t('schoolDoctor.疾病信息') }}</div>
      <el-table :data="diseaseList" border size="small">
        <el-table-column :label="$t('schoolDoctor.疾病名称')" min-width="120" prop="diseaseNameText" />
        <el-table-column :label="$t('schoolDoctor.目前病情')" prop="conditionStatusText" width="120" />
        <el-table-column :label="$t('schoolDoctor.服用药物及方式')" prop="medicationUsage" min-width="140" />
        <el-table-column :label="$t('schoolDoctor.发作时间及具体情况')" prop="attackTimeDetail" min-width="160" />
        <el-table-column :label="$t('schoolDoctor.采取措施')" prop="measures" min-width="120" />
        <el-table-column :label="$t('schoolDoctor.医疗诊断和处理')" prop="diagnosisAndTreatment" min-width="140" />
      </el-table>
    </div>

    <el-empty v-if="!hasAnyContent" :description="$t('schoolDoctor.暂无数据')" />
  </div>
</template>

<script>
import { getDiseaseSettingPage } from "@/api/isacommunity/diseaseSetting";
import { hasDisplayValue } from "../utils/archiveDisplay.js";

// 健康指标数字输入限制
const METRIC_CONFIG = [
  { key: "height", prop: "height", labelKey: "身高", suffix: " cm", min: 50, max: 250, step: 1, precision: 1 },
  { key: "weight", prop: "weight", labelKey: "体重", suffix: " kg", min: 10, max: 200, step: 0.1, precision: 1 },
  { key: "leftVision", prop: "leftVision", labelKey: "左视力", prefix: "L: ", min: 0.1, max: 5.3, step: 0.1, precision: 1 },
  { key: "rightVision", prop: "rightVision", labelKey: "右视力", prefix: "R: ", min: 0.1, max: 5.3, step: 0.1, precision: 1 },
  { key: "leftEar", prop: "leftEar", labelKey: "左耳", min: 0, max: 120, step: 1, precision: 0 },
  { key: "rightEar", prop: "rightEar", labelKey: "右耳", min: 0, max: 120, step: 1, precision: 0 },
];

export default {
  name: "ArchiveHealthTab",
  props: {
    healthHistory: { type: Object, default: () => ({}) },
    editForm: { type: Object, default: () => ({}) },
    isEditable: { type: Boolean, default: false },
  },
  data() {
    return {
      diseaseOptions: [],
    };
  },
  created() {
    this.loadDiseaseOptions();
  },
  computed: {
    metricItems() {
      const history = this.healthHistory || {};
      const form = this.editForm || {};

      return METRIC_CONFIG.filter((item) => {
        if (this.isEditable) return true;
        return hasDisplayValue(history[item.prop]) || hasDisplayValue(form[item.prop]);
      }).map((item) => {
        const rawValue = form[item.prop] || history[item.prop];
        let value = rawValue;
        if (hasDisplayValue(rawValue)) {
          value = `${item.prefix || ""}${rawValue}${item.suffix || ""}`;
        }
        return {
          ...item,
          label: this.$t(`schoolDoctor.${item.labelKey}`),
          value,
        };
      });
    },
    visibleAllergies() {
      const history = this.healthHistory || {};
      const items = [
        { key: "foodAllergy", label: this.$t("schoolDoctor.食物过敏"), value: history.foodAllergy, typeClass: "is-danger" },
        { key: "drugAllergy", label: this.$t("schoolDoctor.药物过敏"), value: history.drugAllergy, typeClass: "is-danger" },
        { key: "contactAllergy", label: this.$t("schoolDoctor.接触性过敏"), value: history.contactAllergy, typeClass: "is-purple" },
        { key: "otherAllergy", label: this.$t("schoolDoctor.其他散在过敏"), value: history.otherAllergy, typeClass: "is-warning" },
      ];
      return items.filter((item) => hasDisplayValue(item.value));
    },
    diseaseList() {
      const conditionMap = {
        1: this.$t("schoolDoctor.已经痊愈"),
        2: this.$t("schoolDoctor.偶尔发作"),
        3: this.$t("schoolDoctor.经常发作"),
      };
      return (this.healthHistory.diseaseList || []).map((item) => ({
        ...item,
        diseaseNameText: this.getDiseaseDisplayName(item),
        conditionStatusText: conditionMap[item.conditionStatus] || "-",
      }));
    },
    showMetricsPanel() {
      return this.metricItems.length > 0;
    },
    showNursePanel() {
      return this.isEditable || hasDisplayValue(this.healthHistory.nurseRemark) || hasDisplayValue(this.editForm.nurseRemark);
    },
    hasAnyContent() {
      return this.showMetricsPanel || this.showNursePanel || this.visibleAllergies.length || this.diseaseList.length;
    },
  },
  methods: {
    loadDiseaseOptions() {
      return getDiseaseSettingPage({ current: 1, size: 500, type: 1, status: 1 }).then((res) => {
        if (res.data.success) {
          this.diseaseOptions = (res.data.data && res.data.data.data) || [];
        }
      });
    },

    findDiseaseOption(disease) {
      return this.diseaseOptions.find(
        (item) => String(item.id) === String(disease.diseaseId)
      );
    },

    isOtherDisease(disease) {
      const option = this.findDiseaseOption(disease);
      const name = (option && (option.cnName || option.name)) || "";
      return /其他|other/i.test(name);
    },

    /** 疾病名称回显：字典项取 cnName，其他类取 diseaseNameOther */
    getDiseaseDisplayName(disease) {
      const option = this.findDiseaseOption(disease);
      const settingName = option ? option.cnName || option.name || "" : "";
      if (this.isOtherDisease(disease)) {
        return disease.diseaseNameOther || settingName || "-";
      }
      return settingName || disease.diseaseName || disease.diseaseNameOther || "-";
    },
  },
};
</script>

<style lang="scss" scoped>
.health-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 16px;
}

.info-card {
  padding: 20px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 12px;
}

.panel-title {
  margin-bottom: 16px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.metrics-grid,
.allergy-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.metric-box,
.allergy-box {
  padding: 14px;
  background: #f8fafc;
  border-radius: 10px;
}

.metric-box__label,
.allergy-box__label {
  margin-bottom: 8px;
  font-size: 12px;
  color: #909399;
}

.metric-box__value,
.allergy-box__value {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  line-height: 1.5;
  word-break: break-all;
}

.nurse-note {
  padding: 14px 16px;
  background: #f0f9ff;
  border-left: 4px solid #175e67;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.8;
  color: #303133;
  white-space: pre-wrap;
}

.allergy-panel,
.disease-panel {
  margin-top: 16px;
}

.allergy-box.is-danger {
  background: #fef0f0;

  .allergy-box__label {
    color: #f56c6c;
  }
}

.allergy-box.is-purple {
  background: #f5f0ff;

  .allergy-box__label {
    color: #7b61ff;
  }
}

.allergy-box.is-warning {
  background: #fdf6ec;

  .allergy-box__label {
    color: #e6a23c;
  }
}
</style>
