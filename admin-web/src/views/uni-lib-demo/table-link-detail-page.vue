<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Recordable } from 'uni-ui-lib'

import { createCustomerRequest, customerColumns, tableToolbar, valueEnums } from './shared'

const router = useRouter()
const loadCustomers = createCustomerRequest()

const goDetail = (row: Recordable) => {
  router.push(`/uni-lib-demo/table-detail/${row.id}`)
}

const goEdit = (row: Recordable) => {
  router.push(`/uni-lib-demo/table-edit/${row.id}`)
}
</script>

<template>
  <section class="demo-page">
    <el-card shadow="never">
      <template #header>
        <div class="demo-page__header">
          <div>
            <h1>表格跳转表单页</h1>
            <p>详情和编辑都通过路由跳转承载，适合字段较多、流程较完整的业务页面。</p>
          </div>
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
          { label: '详情', onClick: goDetail },
          { label: '编辑', type: 'success', onClick: goEdit }
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
