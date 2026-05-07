<script setup lang="ts">
import DetailDialog from './components/detail-dialog.vue'
import { useList } from './use-list'

import { useAppI18n } from '@/composables/use-app-i18n'

const { t } = useAppI18n()
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
  <section class="member-page">
    <el-card shadow="never" class="member-page__header-card">
      <div class="member-page__header">
        <div>
          <h1>{{ t('member.teacher.page.title') }}</h1>
          <p>{{ t('member.teacher.page.description') }}</p>
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
    </el-card>

    <el-card shadow="never">
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
    </el-card>

    <DetailDialog v-model:visible="detailVisible" :source="currentRecord" :config="detailConfig" />
  </section>
</template>

<style scoped lang="scss">
.member-page {
  display: grid;
  gap: 16px;

  &__header-card {
    :deep(.el-card__body) {
      display: grid;
      gap: 18px;
    }
  }

  &__header {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    justify-content: space-between;

    h1 {
      margin: 0 0 8px;
      font-size: 22px;
    }

    p {
      margin: 0;
      color: var(--app-text-color-secondary);
    }
  }

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    color: var(--app-text-color-secondary);
  }
}

@media (width <=900px) {
  .member-page__header,
  .member-page__toolbar {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
