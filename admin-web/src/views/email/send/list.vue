<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('email.send.pageTitle') }}</h1>
        <p class="uni-list-page__description">{{ $t('email.send.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button type="primary" @click="openAdd">{{ $t('email.add') }}</el-button>
      </div>
    </div>

    <UniSearchForm
      v-model="queryModel"
      :config="searchConfig"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('member.actions.search')"
      :reset-text="$t('member.actions.reset')"
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
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 168, fixed: 'right' }"
      @load-success="handleLoadSuccess"
      @selection-change="onSelectionChange"
    >
      <template #toolbar>
        <el-button :disabled="batchDisabled" @click="batchStatus(0)">{{ $t('email.archive') }}</el-button>
        <el-button :disabled="batchDisabled" @click="batchStatus(1)">{{ $t('email.markActive') }}</el-button>
        <el-button type="danger" :disabled="batchDisabled" @click="batchStatus(-1)">
          {{ $t('email.deleteBatch') }}
        </el-button>
      </template>
    </UniDataTable>

    <SendMailDialog
      v-model="dialogVisible"
      v-model:form="formModel"
      :mode="dialogMode"
      @success="tableRef?.refresh()"
    />

    <el-dialog v-model="viewVisible" :title="$t('email.view')" width="520px" destroy-on-close>
      <div class="email-send-view">
        <div class="email-send-view__row">
          <span class="email-send-view__label">{{ $t('email.send.colUsers') }}</span>
          <span class="email-send-view__val">{{ viewModel.userLines.length ? viewModel.userLines.join('，') : '—' }}</span>
        </div>
        <div class="email-send-view__row">
          <span class="email-send-view__label">{{ $t('email.send.colEmail365') }}</span>
          <span class="email-send-view__val">{{ viewModel.email || '—' }}</span>
        </div>
        <div class="email-send-view__row">
          <span class="email-send-view__label">{{ $t('email.send.assignGroups') }}</span>
          <span class="email-send-view__val">{{ viewModel.groups }}</span>
        </div>
        <div class="email-send-view__row">
          <span class="email-send-view__label">{{ $t('email.status') }}</span>
          <span class="email-send-view__val">{{ viewModel.statusLabel }}</span>
        </div>
      </div>
      <template #footer>
        <el-button @click="viewVisible = false">{{ $t('common.close') }}</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import { UniDataTable, UniSearchForm } from 'uni-ui-lib'

import SendMailDialog from './components/send-mail-dialog.vue'
import { useList } from './use-list'

const {
  actions,
  batchDisabled,
  batchStatus,
  columns,
  dialogMode,
  dialogVisible,
  filters,
  formModel,
  handleLoadSuccess,
  loadData,
  onSelectionChange,
  openAdd,
  queryModel,
  reset,
  search,
  searchConfig,
  tableRef,
  viewModel,
  viewVisible
} = useList()
</script>

<style scoped lang="scss">
.email-send-view {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;

  &__row {
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }

  &__label {
    flex: 0 0 120px;
    font-weight: 500;
    color: var(--el-text-color-regular);
  }

  &__val {
    flex: 1;
    word-break: break-word;
  }
}
</style>
