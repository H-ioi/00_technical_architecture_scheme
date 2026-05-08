<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, ref } from 'vue'

import DetailDialog from './components/detail-dialog.vue'
import FormDialog from './components/form-dialog.vue'
import { useList } from './use-list'

import { deleteProtocol } from '@/api'
import { useAppI18n } from '@/composables/use-app-i18n'
import type { ProtocolRecord } from '@/types/modules/protocol'

const { t } = useAppI18n()
const {
  actions,
  columns,
  currentRecord,
  detailVisible,
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

  await deleteProtocol(selectedIds.value)
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

    <DetailDialog
      v-model:visible="detailVisible"
      :source="currentRecord"
      :school-options="schoolOptions"
      :value-enums="valueEnums"
    />
  </section>
</template>
