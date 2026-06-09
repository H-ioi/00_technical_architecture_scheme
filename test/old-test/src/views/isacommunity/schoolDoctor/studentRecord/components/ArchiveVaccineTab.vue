<template>
  <div class="archive-tab">
    <div v-if="cards.length" class="vaccine-grid">
      <div v-for="item in cards" :key="item.key" class="info-card vaccine-card">
        <div class="vaccine-card__tag">{{ item.tag }}</div>
        <div class="vaccine-card__title">{{ item.title }}</div>
        <div class="vaccine-card__status">
          <i class="el-icon-success" />
          <span>{{ $t('schoolDoctor.已载入') }}：{{ item.fileName }}</span>
        </div>
        <el-button class="vaccine-card__btn" plain @click="previewFile(item.url)">
          <i :class="item.icon" />
          {{ item.buttonText }}
        </el-button>
      </div>
    </div>
    <el-empty v-else :description="$t('schoolDoctor.暂无数据')" />
  </div>
</template>

<script>
import { getFileNameFromUrl, hasDisplayValue } from "../utils/archiveDisplay.js";

export default {
  name: "ArchiveVaccineTab",
  props: {
    vaccineExam: { type: Object, default: () => ({}) },
  },
  computed: {
    cards() {
      const exam = this.vaccineExam || {};
      const cards = [];

      if (hasDisplayValue(exam.latestVaccine && exam.latestVaccine.attachUrl)) {
        const url = exam.latestVaccine.attachUrl;
        cards.push({
          key: "vaccine",
          tag: this.$t("schoolDoctor.疫苗接种证件上传"),
          title: this.$t("schoolDoctor.国家免疫规划疫苗接种状态"),
          fileName: getFileNameFromUrl(url) || this.$t("schoolDoctor.查看附件"),
          url,
          icon: "el-icon-document",
          buttonText: this.$t("schoolDoctor.预览接种证"),
        });
      }

      if (hasDisplayValue(exam.latestHealthExam && exam.latestHealthExam.attachUrl)) {
        const url = exam.latestHealthExam.attachUrl;
        cards.push({
          key: "exam",
          tag: this.$t("schoolDoctor.入学体检合格评定书"),
          title: this.$t("schoolDoctor.新入学合格体检筛查记录"),
          fileName: getFileNameFromUrl(url) || this.$t("schoolDoctor.查看附件"),
          url,
          icon: "el-icon-document-checked",
          buttonText: this.$t("schoolDoctor.预览体检合格书"),
        });
      }

      return cards;
    },
  },
  methods: {
    previewFile(url) {
      if (!url) return;
      window.open(url, "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
.vaccine-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.info-card {
  padding: 24px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 12px;
}

.vaccine-card__tag {
  margin-bottom: 10px;
  font-size: 12px;
  color: #909399;
}

.vaccine-card__title {
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.vaccine-card__status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 10px 12px;
  background: #f0f9eb;
  border-radius: 8px;
  font-size: 13px;
  color: #67c23a;

  i {
    font-size: 16px;
  }
}

.vaccine-card__btn {
  width: 100%;
}
</style>
