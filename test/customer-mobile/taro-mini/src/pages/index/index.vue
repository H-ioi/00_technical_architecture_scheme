<template>
  <view class="page">
    <text class="title">首页</text>
    <button class="btn" @tap="goList">进入列表</button>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'

function goList() {
  Taro.navigateTo({ url: '/pages/list/index' })
}
</script>

<style lang="scss">
.page {
  padding: 40px;
}

.title {
  display: block;
  margin-bottom: 24px;
  font-size: 40px;
  font-weight: 600;
}

.btn {
  margin-top: 16px;
}
</style>
