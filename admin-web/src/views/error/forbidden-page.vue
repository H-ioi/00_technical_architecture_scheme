<template>

  <main class="error-page">
    <el-result icon="warning" title="403" sub-title="当前账号没有权限访问该页面">
      <template #extra>
        <el-button type="primary" @click="$router.replace('/')">返回首页</el-button>
      </template>
    </el-result>
  </main>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.error-page {
  display: grid;
  min-height: 100vh;
  place-items: center;
}
</style>
