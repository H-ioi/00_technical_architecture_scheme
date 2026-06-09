<template>
  <div class="guide-card">
    <div class="guide-card__header">
      <i class="el-icon-info guide-card__icon"></i>
      <span>{{ $t('schoolDoctor.填表指引') }}</span>
    </div>
    <ol class="guide-card__list">
      <li>{{ $t('schoolDoctor.填表指引1') }}</li>
      <li>{{ $t('schoolDoctor.填表指引2') }}</li>
      <li>{{ $t('schoolDoctor.填表指引3') }}</li>
    </ol>
  </div>
</template>

<script>
export default {
  name: "VisitFormGuide",
};
</script>

<style lang="scss" scoped>
.guide-card {
  padding: 16px;
  background: #fffbeb;
  border: 1px solid #faecd8;
  border-radius: 12px;
}

.guide-card__header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #e6a23c;
}

.guide-card__icon {
  margin-right: 8px;
  font-size: 18px;
}

.guide-card__list {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  line-height: 1.8;
  color: #606266;
}
</style>
