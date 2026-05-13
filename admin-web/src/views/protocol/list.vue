<template>
  <section class="uni-list-page protocol-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('protocol.page.title') }}</h1>
        <p>{{ $t('protocol.page.description') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'protocol_add'" type="primary" @click="openForm('add')">
          {{ $t('protocol.actions.add') }}
        </el-button>
      </div>
    </div>

    <!-- UniSearchForm 统一承载查询条件、重置和空值清理，页面只接收过滤后的查询参数。 -->
    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('protocol.actions.search')"
      :reset-text="$t('protocol.actions.reset')"
      @search="search"
      @reset="reset" />

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
      :actions="actions"
      :action-column="{ width: 130, fixed: 'right' }"
      @selection-change="selection = $event as ProtocolRecord[]"
      @load-success="handleLoadSuccess">
      <!-- toolbar 插槽放表格勾选后的批量操作，组件内部会和刷新/最大化/列设置工具合并到底部工具栏。 -->
      <template #toolbar>
        <div class="protocol-page__toolbar">
          <el-button
            v-uni-permission="'protocol_del'"
            type="danger"
            :disabled="ids.length === 0"
            @click="del">
            {{ $t('protocol.actions.delete') }}
          </el-button>
        </div>
      </template>
    </UniDataTable>

    <PForm
      v-model:visible="formVisible"
      :mode="formMode"
      :source="activeRow"
      :school-options="schoolOptions"
      :protocol-type-options="protocolTypeOptions"
      :module-options="moduleOptions"
      :yes-no-options="yesNoOptions"
      :status-options="statusOptions"
      @saved="reload" />
  </section>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, ref } from 'vue'
import { useUniI18n } from 'uni-ui-lib'

import PForm from './components/form.vue'
import { useList } from './use-list'

import { protocolApi } from '@/api'
import type { ProtocolRecord } from '@/types/modules/protocol'

const { t } = useUniI18n()
const {
  actions,
  columns,
  activeRow,
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
  searchCfg,
  statusOptions,
  tableRef,
  yesNoOptions
} = useList()

const selection = ref<ProtocolRecord[]>([])
const ids = computed(() => selection.value.map((item) => item.id))

const reload = () => {
  tableRef.value?.refresh()
}

const del = async () => {
  if (ids.value.length === 0) {
    return
  }

  await ElMessageBox.confirm(t('protocol.messages.confirmDelete'), t('protocol.actions.delete'), {
    confirmButtonText: t('protocol.actions.submit'),
    cancelButtonText: t('protocol.actions.cancel'),
    type: 'warning'
  })

  await protocolApi.delete.delete(ids.value)
  ElMessage.success(t('protocol.messages.deleteSuccess'))
  selection.value = []
  reload()
}
</script>

<style scoped lang="scss"></style>
