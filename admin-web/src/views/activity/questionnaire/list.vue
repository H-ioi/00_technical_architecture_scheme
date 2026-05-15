<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('activity.questionnaireTitle') }}</h1>
        <p class="uni-list-page__description">{{ $t('activity.questionnaireDesc') }}</p>
      </div>
      <div v-uni-permission="'busdriver_edit'" class="uni-list-page__header-actions">
        <el-button type="primary" @click="openMetaAdd">{{ $t('activity.add') }}</el-button>
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
      :action-column="{ width: 140, fixed: 'right' }"
      @load-success="handleLoadSuccess"
      @selection-change="onSelectionChange">
      <template #toolbar>
        <el-button
          v-uni-permission="'busdriver_edit'"
          plain
          :disabled="!selectedIds.length"
          @click="openBatchStatus">
          {{ $t('activity.qBatchChangeStatus') }}
        </el-button>
        <el-button
          v-uni-permission="'busdriver_edit'"
          plain
          :disabled="!selectedIds.length"
          @click="openBatchFrozen">
          {{ $t('activity.qBatchChangeFrozen') }}
        </el-button>
        <el-button
          v-uni-permission="'busdriver_del'"
          type="danger"
          plain
          :disabled="!selectedIds.length"
          @click="deleteSelected">
          {{ $t('activity.delBatch') }}
        </el-button>
      </template>
    </UniDataTable>

    <MetaFormDialog ref="metaDlg" @saved="handleSaved" />
    <QuestionnaireCopyDialog ref="copyDlg" @saved="handleSaved" />
    <BatchFlagDialog ref="batchDlg" @saved="handleSaved" />
  </section>
</template>

<script setup lang="ts">
import { UniDataTable, UniSearchForm } from 'uni-ui-lib'
import { ref } from 'vue'

import BatchFlagDialog from '@/views/activity/questionnaire/components/batch-flag-dialog.vue'
import QuestionnaireCopyDialog from '@/views/activity/questionnaire/components/copy-dialog.vue'
import MetaFormDialog from '@/views/activity/questionnaire/components/meta-form-dialog.vue'

import { useQuestionnaireList } from './use-list'

const metaDlg = ref<InstanceType<typeof MetaFormDialog> | null>(null)
const copyDlg = ref<InstanceType<typeof QuestionnaireCopyDialog> | null>(null)
const batchDlg = ref<InstanceType<typeof BatchFlagDialog> | null>(null)

const {
  actions,
  columns,
  deleteSelected,
  filters,
  handleLoadSuccess,
  handleSaved,
  loadData,
  onSelectionChange,
  openBatchFrozen,
  openBatchStatus,
  openMetaAdd,
  queryModel,
  reset,
  search,
  searchCfg,
  selectedIds,
  tableRef
} = useQuestionnaireList({ metaDlg, copyDlg, batchDlg })
</script>
