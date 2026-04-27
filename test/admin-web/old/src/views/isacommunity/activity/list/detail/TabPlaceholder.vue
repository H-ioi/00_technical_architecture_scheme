<template>
  <div class="activity-tab-placeholder">
    <p class="activity-tab-placeholder__text">{{ $t("isagroup.暂无内容") }}</p>
  </div>
</template>

<script>
export default {
  name: "ActivityTabPlaceholder",
};
</script>

<style lang="scss" scoped>
.activity-tab-placeholder {
  padding: 24px;
  color: #909399;
  font-size: 14px;
}
.activity-tab-placeholder__text {
  margin: 0;
}
</style>
