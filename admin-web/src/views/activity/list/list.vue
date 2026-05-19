<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('activity.eventListTitle') }}</h1>
        <p class="uni-list-page__description">{{ $t('activity.eventListDesc') }}</p>
      </div>
      <div v-uni-permission="'busdriver_edit'" class="uni-list-page__header-actions">
        <el-button
          type="primary"
          @click="router.push({ name: 'ActivityEventDetail', query: { mode: 'edit' } })">
          {{ $t('activity.add') }}
        </el-button>
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
      @reset="reset" />
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
      @selection-change="onSelectionChange">
      <template #toolbar>
        <el-button
          v-uni-permission="'busdriver_edit'"
          plain
          :disabled="!selectedIds.length"
          @click="handleSendWechat(selectedRows, false)">
          {{ $t('activity.sendWechat') }}
        </el-button>
        <el-button
          v-uni-permission="'busdriver_edit'"
          plain
          :disabled="!selectedIds.length"
          @click="handleSendWechat(selectedRows, true)">
          {{ $t('activity.sendWechatTest') }}
        </el-button>
        <el-button
          v-uni-permission="'busdriver_edit'"
          plain
          :disabled="!selectedIds.length"
          @click="exportFeedbackBatch">
          {{ $t('activity.exportFeedback') }}
        </el-button>
        <el-button
          v-uni-permission="'busdriver_edit'"
          plain
          :disabled="!selectedIds.length"
          @click="exportQuestionnaireByActivityBatch">
          {{ $t('activity.exportQuestionnaireByActivity') }}
        </el-button>
        <el-button
          v-uni-permission="'busdriver_edit'"
          plain
          :disabled="!selectedIds.length"
          @click="publishBatch">
          {{ $t('activity.publishBatch') }}
        </el-button>
        <el-button
          v-uni-permission="'busdriver_del'"
          type="danger"
          plain
          :disabled="!selectedIds.length"
          @click="deleteBatch">
          {{ $t('activity.delBatch') }}
        </el-button>
      </template>
    </UniDataTable>
  </section>
</template>

<script setup lang="ts">
import { UniDataTable, UniSearchForm } from 'uni-ui-lib'
import { useRouter } from 'vue-router'

import { useActivityEventList } from './use-list'

const router = useRouter()

const {
  actions,
  columns,
  deleteBatch,
  exportFeedbackBatch,
  exportQuestionnaireByActivityBatch,
  filters,
  handleLoadSuccess,
  handleSendWechat,
  loadData,
  onSelectionChange,
  publishBatch,
  queryModel,
  reset,
  search,
  searchCfg,
  selectedIds,
  selectedRows,
  tableRef
} = useActivityEventList()
</script>
