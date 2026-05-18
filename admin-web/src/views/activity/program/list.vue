<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('activity.programListTitle') }}</h1>
        <p class="uni-list-page__description">{{ $t('activity.programListDesc') }}</p>
      </div>
      <div v-uni-permission="'busdriver_edit'" class="uni-list-page__header-actions">
        <el-button type="primary" @click="goCreate">{{ $t('activity.add') }}</el-button>
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
      :action-column="{ width: 180, fixed: 'right' }"
      @load-success="handleLoadSuccess"
      @selection-change="onSelectionChange"
    >
      <template #toolbar>
        <el-button
          v-uni-permission="'busdriver_edit'"
          plain
          :disabled="!selectedIds.length"
          @click="openCopy"
        >
          {{ $t('activity.programCopy') }}
        </el-button>
        <el-button
          v-uni-permission="'busdriver_del'"
          type="danger"
          plain
          :disabled="!selectedIds.length"
          @click="deleteBatch"
        >
          {{ $t('activity.delBatch') }}
        </el-button>
      </template>
    </UniDataTable>
    <ProgramCopyDialog
      v-model="copyOpen"
      :program-ids="selectedIds"
      @success="onCopySuccess"
    />
  </section>
</template>

<script setup lang="ts">
import { UniDataTable, UniSearchForm } from 'uni-ui-lib'
import { ref } from 'vue'

import ProgramCopyDialog from './components/program-copy-dialog.vue'
import { useActivityProgramList } from './use-list'

const copyOpen = ref(false)

const {
  actions,
  columns,
  deleteBatch,
  filters,
  goCreate,
  handleLoadSuccess,
  loadData,
  onSelectionChange,
  openCopy,
  queryModel,
  reset,
  search,
  searchCfg,
  selectedIds,
  tableRef
} = useActivityProgramList(copyOpen)

const onCopySuccess = () => {
  tableRef.value?.refresh()
}
</script>
