<script setup lang="ts">
import { useUniI18n } from 'uni-ui-lib'

import DetailDialog from '../components/detail-dialog.vue'
import { useList } from './use-list'

const { t } = useUniI18n()
const {
  actions,
  columns,
  currentRecord,
  detailConfig,
  detailVisible,
  filters,
  handleLoadSuccess,
  loadData,
  queryModel,
  reset,
  search,
  searchConfig,
  tableRef,
  valueEnums
} = useList()
</script>

<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ t('member.student.page.title') }}</h1>
        <p>{{ t('member.student.page.description') }}</p>
      </div>
    </div>

    <UniSearchForm
      v-model="queryModel"
      :config="searchConfig"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="t('member.actions.search')"
      :reset-text="t('member.actions.reset')"
      @search="search"
      @reset="reset"
    />

    <UniDataTable
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :value-enums="valueEnums"
      :actions="actions"
      :action-column="{ width: 100, fixed: 'right' }"
      @load-success="handleLoadSuccess"
    />

    <DetailDialog v-model:visible="detailVisible" :source="currentRecord" :config="detailConfig" />
  </section>
</template>

<style scoped lang="scss"></style>
