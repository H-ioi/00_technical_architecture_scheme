<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { Recordable } from 'uni-ui-lib'

import {
  createCustomerDetailConfig,
  createCustomerEditConfig,
  createCustomerRequest,
  customerColumns,
  tableToolbar,
  valueEnums
} from './shared'

const loadCustomers = createCustomerRequest()
const detailVisible = ref(false)
const editVisible = ref(false)
const currentRow = ref<Recordable | null>(null)
const formModel = ref<Recordable>({})
const detailConfig = createCustomerDetailConfig()
const editConfig = createCustomerEditConfig()

const openDetail = (row: Recordable) => {
  currentRow.value = row
  detailVisible.value = true
}

const openEdit = (row: Recordable) => {
  formModel.value = { ...row }
  editVisible.value = true
}

const editCurrent = () => {
  if (currentRow.value) {
    openEdit(currentRow.value)
    detailVisible.value = false
  }
}

const save = (value: Recordable) => {
  ElMessage.success(`已保存 ${String(value.name ?? '客户')}`)
  editVisible.value = false
}
</script>

<template>
  <section class="demo-page">
    <el-card shadow="never">
      <template #header>
        <div class="demo-page__header">
          <div>
            <h1>表格打开表单弹窗</h1>
            <p>详情和编辑都在当前列表页弹窗中完成，保留筛选、分页和选中上下文。</p>
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
          { label: '详情', onClick: openDetail },
          { label: '编辑', type: 'success', onClick: openEdit }
        ]"
      />
    </el-card>

    <el-dialog v-model="detailVisible" title="客户详情" width="720px">
      <UniForm v-if="currentRow" :model-value="currentRow" :config="detailConfig" mode="view" />
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button type="primary" @click="editCurrent">编辑</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="editVisible" title="编辑客户" width="760px">
      <UniForm v-model="formModel" :config="editConfig" mode="edit" @submit="save">
        <template #actions="{ submit, reset }">
          <el-button type="primary" @click="submit">保存</el-button>
          <el-button @click="reset">重置</el-button>
        </template>
      </UniForm>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
      </template>
    </el-dialog>
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
