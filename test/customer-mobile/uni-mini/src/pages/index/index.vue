<template>
  <view class="page">
    <text class="title">首页</text>
    <button class="btn" type="primary" @click="goList">进入列表</button>
  </view>
</template>

<script setup lang="ts">
function goList() {
  uni.navigateTo({ url: '/pages/list/list' })
}
</script>

<style scoped>
.page {
  padding: 40rpx;
}

.title {
  display: block;
  margin-bottom: 32rpx;
  font-size: 40rpx;
  font-weight: 600;
}

.btn {
  margin-top: 24rpx;
}
</style>
