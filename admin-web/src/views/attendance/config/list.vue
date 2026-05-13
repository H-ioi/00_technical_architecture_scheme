<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('attendance.holidayConfig.pageTitle') }}</h1>
        <p>{{ $t('attendance.holidayConfig.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button type="primary" @click="openAdd">{{ $t('attendance.addConfig') }}</el-button>
      </div>
    </div>

    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('member.actions.search')"
      :reset-text="$t('member.actions.reset')"
      @search="search"
      @reset="reset" />

    <UniDataTable
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="false"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 140, fixed: 'right' }"
      @load-success="handleLoadSuccess" />

    <ConfigFormDialog
      v-model:visible="formVisible"
      :title="formTitle"
      :model-value="formModel"
      :school-options="schoolOptions"
      :department-options="departmentOptions"
      :grade-options="gradeOptions"
      @success="onFormSuccess" />
  </section>
</template>

<script setup lang="ts">
import { UniDataTable, UniSearchForm } from 'uni-ui-lib'
import { onMounted } from 'vue'

import ConfigFormDialog from './components/config-form-dialog.vue'
import { useList } from './use-list'

const {
  actions,
  columns,
  departmentOptions,
  filters,
  formModel,
  formTitle,
  formVisible,
  gradeOptions,
  handleLoadSuccess,
  initSchools,
  loadData,
  onFormSuccess,
  openAdd,
  queryModel,
  reset,
  search,
  schoolOptions,
  searchCfg,
  tableRef
} = useList()

onMounted(() => {
  initSchools()
})
</script>
