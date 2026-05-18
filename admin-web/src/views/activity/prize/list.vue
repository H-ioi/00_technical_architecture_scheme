<template>
  <section class="activity-prize-list uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('activity.prizeListTitle') }}</h1>
        <p class="uni-list-page__description">{{ $t('activity.prizeListDesc') }}</p>
      </div>
      <div v-uni-permission="'busdriver_edit'" class="uni-list-page__header-actions">
        <el-button type="primary" @click="openAdd">{{ $t('activity.add') }}</el-button>
      </div>
    </div>
    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('activity.search')"
      :reset-text="$t('activity.reset')"
      @search="search"
      @reset="reset"
    />
    <UniDataTable
      ref="tableRef"
      row-key="id"
      selection="multiple"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 110, fixed: 'right' }"
      @load-success="handleLoadSuccess"
      @selection-change="onSelectionChange"
    >
      <template #toolbar>
        <el-button
          v-uni-permission="'busdriver_del'"
          type="danger"
          plain
          :disabled="!selectedIds.length"
          @click="deleteSelected"
        >
          {{ $t('activity.delBatch') }}
        </el-button>
      </template>
    </UniDataTable>

    <PrizeFormDialog ref="formDlg" @saved="handleSaved" />
  </section>
</template>

<script setup lang="ts">
import { UniDataTable, UniSearchForm } from 'uni-ui-lib'
import { ref } from 'vue'

import PrizeFormDialog from './components/prize-form-dialog.vue'
import { useActivityPrizeList } from './use-list'

const formDlg = ref<InstanceType<typeof PrizeFormDialog> | null>(null)

const {
  actions,
  columns,
  deleteSelected,
  filters,
  handleLoadSuccess,
  handleSaved,
  loadData,
  onSelectionChange,
  openAdd,
  queryModel,
  reset,
  search,
  searchCfg,
  selectedIds,
  tableRef
} = useActivityPrizeList(formDlg)
</script>
