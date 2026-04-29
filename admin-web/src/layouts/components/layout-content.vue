<template>
  <el-main class="layout-content">
    <RouterView />
  </el-main>
</template>

<style scoped lang="scss">
.layout-content {
  flex: 1;
  min-height: 0;
  padding: 16px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
