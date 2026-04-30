<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'

import { customerColumns, customerRows, valueEnums } from './shared'

const activeCustomers = computed(() => customerRows.filter((item) => item.status === 1))
</script>

<template>
  <section class="demo-page">
    <el-card shadow="never">
      <template #header>
        <div class="demo-page__header">
          <div>
            <h1>无分页表格页</h1>
            <p>数据量较少的配置清单、待办清单可以关闭分页，保留表格工具能力。</p>
          </div>
          <el-button type="primary" @click="ElMessage.info('添加配置项')">添加配置</el-button>
        </div>
      </template>

      <UniDataTable
        row-key="id"
        :columns="customerColumns"
        :data="activeCustomers"
        :pagination="false"
        :value-enums="valueEnums"
        :toolbar="{
          density: true,
          columnSetting: true,
          fullscreen: true,
          export: true,
          print: true
        }"
        :actions="[
          { label: '编辑', onClick: (row) => ElMessage.info(`编辑 ${row.name}`) },
          {
            label: '停用',
            type: 'warning',
            onClick: (row) => ElMessage.warning(`停用 ${row.name}`)
          }
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
