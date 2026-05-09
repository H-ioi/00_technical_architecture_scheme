<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, ref } from 'vue'
import { useUniI18n } from 'uni-ui-lib'

import FormDialog from './components/form-dialog.vue'
import { useList } from './use-list'

import { protocolApi } from '@/api'
import type { ProtocolRecord } from '@/types/modules/protocol'

const { t } = useUniI18n()
const {
  actions,
  columns,
  currentRecord,
  filters,
  formMode,
  formVisible,
  handleLoadSuccess,
  loadData,
  moduleOptions,
  openForm,
  protocolTypeOptions,
  queryModel,
  reset,
  schoolOptions,
  search,
  searchConfig,
  statusOptions,
  tableRef,
  valueEnums,
  yesNoOptions
} = useList()

const selectedRows = ref<ProtocolRecord[]>([])
const selectedIds = computed(() => selectedRows.value.map((item) => item.id))

// 列表刷新交给 UniDataTable 暴露的 refresh，表单保存和批量删除后复用同一入口。
const refreshTable = () => {
  tableRef.value?.refresh()
}

const handleDelete = async () => {
  if (selectedIds.value.length === 0) {
    return
  }

  await ElMessageBox.confirm(t('protocol.messages.confirmDelete'), t('protocol.actions.delete'), {
    confirmButtonText: t('protocol.actions.submit'),
    cancelButtonText: t('protocol.actions.cancel'),
    type: 'warning'
  })

  await protocolApi.delete.delete(selectedIds.value)
  ElMessage.success(t('protocol.messages.deleteSuccess'))
  selectedRows.value = []
  refreshTable()
}
</script>

<template>
  <section class="uni-list-page protocol-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ t('protocol.page.title') }}</h1>
        <p>{{ t('protocol.page.description') }}</p>
      </div>
      <el-button v-uni-permission="'protocol_add'" type="primary" @click="openForm('add')">
        {{ t('protocol.actions.add') }}
      </el-button>
    </div>

    <!-- UniSearchForm 统一承载查询条件、重置和空值清理，页面只接收过滤后的查询参数。 -->
    <UniSearchForm
      v-model="queryModel"
      :config="searchConfig"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="t('protocol.actions.search')"
      :reset-text="t('protocol.actions.reset')"
      @search="search"
      @reset="reset"
    />

    <!-- UniDataTable 负责远程分页、选择列、操作列和表格工具栏；业务只提供列配置、请求和行操作。 -->
    <UniDataTable
      ref="tableRef"
      row-key="id"
      selection
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, fullscreen: true, columnSetting: true }"
      :value-enums="valueEnums"
      :actions="actions"
      :action-column="{ width: 130, fixed: 'right' }"
      @selection-change="selectedRows = $event as ProtocolRecord[]"
      @load-success="handleLoadSuccess"
    >
      <!-- toolbar 插槽放表格勾选后的批量操作，组件内部会和刷新/最大化/列设置工具合并到底部工具栏。 -->
      <template #toolbar>
        <div class="protocol-page__toolbar">
          <el-button
            v-uni-permission="'protocol_del'"
            type="danger"
            :disabled="selectedIds.length === 0"
            @click="handleDelete"
          >
            {{ t('protocol.actions.delete') }}
          </el-button>
        </div>
      </template>
    </UniDataTable>

    <!-- FormDialog 保留协议新增编辑的业务表单逻辑，公共上传能力由内部 UniUpload 提供。 -->
    <FormDialog
      v-model:visible="formVisible"
      :mode="formMode"
      :source="currentRecord"
      :school-options="schoolOptions"
      :protocol-type-options="protocolTypeOptions"
      :module-options="moduleOptions"
      :yes-no-options="yesNoOptions"
      :status-options="statusOptions"
      @saved="refreshTable"
    />
  </section>
</template>
