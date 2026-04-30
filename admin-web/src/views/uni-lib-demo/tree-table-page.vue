<script setup lang="ts">
import { ElMessage } from 'element-plus'

import { departmentColumns, departmentRows, valueEnums } from './shared'
</script>

<template>
  <section class="demo-page">
    <el-card shadow="never">
      <template #header>
        <div class="demo-page__header">
          <div>
            <h1>树形表格页</h1>
            <p>组织架构、分类目录这类层级数据，直接使用带 children 的数据源。</p>
          </div>
          <el-button type="primary" @click="ElMessage.info('新增部门')">新增部门</el-button>
        </div>
      </template>

      <UniDataTable
        row-key="id"
        :columns="departmentColumns"
        :data="departmentRows"
        :pagination="false"
        :value-enums="valueEnums"
        :toolbar="{ refresh: false, density: true, columnSetting: true, fullscreen: true }"
        :actions="[
          { label: '新增下级', onClick: (row) => ElMessage.info(`给 ${row.name} 新增下级`) },
          { label: '编辑', type: 'success', onClick: (row) => ElMessage.info(`编辑 ${row.name}`) }
        ]"
      />
    </el-card>
  </section>
</template>

<style scoped lang="scss">
.demo-page {
  display: grid;
  gap: 16px;
}

.demo-page__header {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;

  h1 {
    margin: 0 0 8px;
    font-size: 20px;
  }

  p {
    margin: 0;
    color: var(--app-text-color-secondary);
  }
}
</style>
