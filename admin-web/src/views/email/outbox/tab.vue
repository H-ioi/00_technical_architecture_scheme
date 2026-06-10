<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('email.outbox.pageTitle') }}</h1>
        <p>{{ $t('email.outbox.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button type="primary" @click="openAdd">{{ $t('email.outbox.compose') }}</el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="email-outbox-tab__tabs">
      <el-tab-pane :label="$t('email.outbox.tabSent')" name="sent">
        <UniSearchForm
          v-model="sentQueryModel"
          :config="sentSearchConfig"
          :collapsed="true"
          :collapsed-rows="1"
          :action-min-span="0"
          :submit-text="$t('member.search')"
          :reset-text="$t('member.reset')"
          @search="searchSent"
          @reset="resetSentSearch"
        />
        <UniDataTable
          ref="sentTableRef"
          row-key="id"
          :columns="sentColumns"
          :request="loadSentData"
          :filters="sentFilters"
          :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
          :toolbar="{ refresh: true, density: true, columnSetting: true }"
          :actions="sentActions"
          :action-column="{ width: 110, fixed: 'right' }"
          @load-success="sentTableEmpty.onLoadSuccess"
          @request-error="sentTableEmpty.onRequestError"
        >
          <template #empty>
            <ListTableEmpty
              :kind="sentTableEmpty.kind"
              @reset="resetSentSearch"
              @retry="sentTableEmpty.retry"
            />
          </template>
        </UniDataTable>
      </el-tab-pane>

      <el-tab-pane :label="$t('email.outbox.tabDraft')" name="draft">
        <UniSearchForm
          v-model="draftQueryModel"
          :config="draftSearchConfig"
          :collapsed="true"
          :collapsed-rows="1"
          :action-min-span="0"
          :submit-text="$t('member.search')"
          :reset-text="$t('member.reset')"
          @search="searchDraft"
          @reset="resetDraftSearch"
        />
        <UniDataTable
          ref="draftTableRef"
          row-key="id"
          :columns="draftColumns"
          :request="loadDraftData"
          :filters="draftFilters"
          :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
          :toolbar="{ refresh: true, density: true, columnSetting: true }"
          :actions="draftActions"
          :action-column="{ width: 150, fixed: 'right' }"
          @load-success="draftTableEmpty.onLoadSuccess"
          @request-error="draftTableEmpty.onRequestError"
        >
          <template #empty>
            <ListTableEmpty
              :kind="draftTableEmpty.kind"
              @reset="resetDraftSearch"
              @retry="draftTableEmpty.retry"
            />
          </template>
        </UniDataTable>
      </el-tab-pane>
    </el-tabs>

    <OutboxComposeDialog
      v-model="dialogVisible"
      v-model:form="formModel"
      :mode="dialogMode"
      :mail-sender-options="mailSenderOptions"
      :mail-group-options="mailGroupOptions"
      :submitting="formSubmitting"
      @submit="(status: 0 | 1) => void submitComposeForm(status)"
    />

    <OutboxViewDialog
      v-model="viewVisible"
      :detail="viewModel"
      :can-export="hasPermission('outgo-view')"
      @export="exportViewRecipients"
    />
  </section>
</template>

<script setup lang="ts">
import { UniDataTable, UniSearchForm } from 'uni-ui-lib'
import { ref } from 'vue'

import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import { useTabQuerySync } from '@/composables/use-tab-query-sync'
import OutboxComposeDialog from './components/outbox-compose-drawer.vue'
import OutboxViewDialog from './components/outbox-view-dialog.vue'
import { useOutboxDraft } from './use-outbox-draft'
import { useOutboxSent } from './use-outbox-sent'

const OUTBOX_TABS = ['sent', 'draft'] as const
const activeTab = ref<(typeof OUTBOX_TABS)[number]>('sent')
useTabQuerySync(activeTab, OUTBOX_TABS)

const {
  actions: sentActions,
  columns: sentColumns,
  exportViewRecipients,
  filters: sentFilters,
  handleLoadSuccess: handleSentLoadSuccess,
  hasPermission,
  loadData: loadSentData,
  queryModel: sentQueryModel,
  reset: resetSentSearch,
  search: searchSent,
  searchCfg: sentSearchConfig,
  tableRef: sentTableRef,
  viewModel,
  viewVisible
} = useOutboxSent()

const sentTableEmpty = useListTableEmpty(sentFilters, {
  tableRef: sentTableRef,
  afterLoadSuccess: handleSentLoadSuccess
})

const {
  actions: draftActions,
  columns: draftColumns,
  dialogMode,
  dialogVisible,
  filters: draftFilters,
  formModel,
  formSubmitting,
  handleLoadSuccess: handleDraftLoadSuccess,
  loadData: loadDraftData,
  mailGroupOptions,
  mailSenderOptions,
  openAdd,
  queryModel: draftQueryModel,
  reset: resetDraftSearch,
  search: searchDraft,
  searchCfg: draftSearchConfig,
  submitComposeForm,
  tableRef: draftTableRef
} = useOutboxDraft()

const draftTableEmpty = useListTableEmpty(draftFilters, {
  tableRef: draftTableRef,
  afterLoadSuccess: handleDraftLoadSuccess
})
</script>

<style scoped lang="scss">
.email-outbox-tab {
  &__tabs {
    margin-top: 8px;
  }
}
</style>
