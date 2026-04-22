<template>
  <view class="section-title">
    <text class="section-title__text">{{ title }}</text>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<style scoped lang="scss">
.section-title {
  margin-bottom: 16rpx;

  &__text {
    font-size: 32rpx;
    font-weight: 600;
    color: #1f2937;
  }
}
</style>
