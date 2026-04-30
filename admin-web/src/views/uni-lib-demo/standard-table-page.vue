<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { Recordable, UniTableRequestResult } from 'uni-ui-lib'

import {
  createCustomerRequest,
  customerColumns,
  searchConfig,
  tableToolbar,
  valueEnums
} from './shared'

const queryModel = ref<Recordable>({
  keyword: '',
  level: '',
  status: ''
})
const filters = ref<Recordable>({ ...queryModel.value })
const tableRef = ref<{ refresh: () => void } | null>(null)
const selectedRows = ref<Recordable[]>([])
const total = ref(0)
const loadCustomers = createCustomerRequest()

const search = async (value: Recordable) => {
  filters.value = { ...value }
  await nextTick()
  tableRef.value?.refresh()
}

const reset = async () => {
  filters.value = { ...queryModel.value }
  await nextTick()
  tableRef.value?.refresh()
}

const batchExport = () => {
  ElMessage.success(`已导出 ${selectedRows.value.length || total.value} 条客户数据`)
}

const createCustomer = () => {
  ElMessage.info('模板项目中这里通常打开新增客户页或弹窗')
}

const handleLoadSuccess = (result: UniTableRequestResult) => {
  total.value = result.total
}
</script>

<template>
  <section class="demo-page">
    <el-card shadow="never">
      <template #header>
        <div class="demo-page__header">
          <div>
            <h1>常规表格页</h1>
            <p>搜索表单 + 远程表格 + 分页 + 批量操作，是后台列表页最常见的组合。</p>
          </div>
          <el-button type="primary" @click="createCustomer">新增客户</el-button>
        </div>
      </template>

      <UniSearchForm
        v-model="queryModel"
        :config="searchConfig"
        show-selected-tags
        submit-text="查询"
        reset-text="重置"
        @search="search"
        @reset="reset"
      />
    </el-card>

    <el-card shadow="never">
      <UniDataTable
        ref="tableRef"
        row-key="id"
        selection="multiple"
        :columns="customerColumns"
        :request="loadCustomers"
        :filters="filters"
        :pagination="{ pageSize: 5, pageSizes: [5, 10, 20] }"
        :toolbar="tableToolbar"
        :value-enums="valueEnums"
        :actions="[
          { label: '查看', onClick: (row) => ElMessage.info(`查看 ${row.name}`) },
          { label: '编辑', type: 'success', onClick: (row) => ElMessage.info(`编辑 ${row.name}`) }
        ]"
        @selection-change="(rows) => (selectedRows = rows)"
        @load-success="handleLoadSuccess"
      >
        <template #toolbar>
          <div class="demo-page__toolbar">
            <el-button size="small" type="primary" plain @click="batchExport">批量导出</el-button>
            <span>已选 {{ selectedRows.length }} 项 / 共 {{ total }} 条</span>
          </div>
        </template>
      </UniDataTable>
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

.demo-page__toolbar {
  display: flex;
  gap: 8px;
  align-items: center;
  color: var(--app-text-color-secondary);
}
</style>
