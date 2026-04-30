<script setup lang="ts">
import { ElMessage } from 'element-plus'

import { createCustomerRequest, customerColumns, tableToolbar, valueEnums } from './shared'

const loadCustomers = createCustomerRequest()
</script>

<template>
  <section class="demo-page">
    <el-card shadow="never">
      <template #header>
        <div class="demo-page__header">
          <div>
            <h1>无搜索表格页</h1>
            <p>不需要筛选条件时，直接用 UniDataTable 承接接口分页和表格工具栏。</p>
          </div>
          <el-button type="primary" @click="ElMessage.info('打开新增客户')">新增客户</el-button>
        </div>
      </template>

      <UniDataTable
        row-key="id"
        :columns="customerColumns"
        :request="loadCustomers"
        :pagination="{ pageSize: 5 }"
        :toolbar="tableToolbar"
        :value-enums="valueEnums"
        :actions="[
          { label: '详情', onClick: (row) => ElMessage.info(`查看 ${row.name}`) },
          {
            label: '跟进',
            type: 'success',
            onClick: (row) => ElMessage.success(`跟进 ${row.name}`)
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
