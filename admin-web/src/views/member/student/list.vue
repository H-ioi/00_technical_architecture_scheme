<script setup lang="ts">
import { useList } from './use-list'

import { useAppI18n } from '@/composables/use-app-i18n'

const { t } = useAppI18n()
const {
  actions,
  batchDelete,
  batchDisable,
  batchEnable,
  columns,
  exportData,
  filters,
  handleLoadSuccess,
  loadStudents,
  queryModel,
  reset,
  search,
  searchConfig,
  selectedRows,
  tableRef,
  total,
  valueEnums
} = useList()
</script>

<template>
  <section class="member-page">
    <el-card shadow="never" class="member-page__header-card">
      <div class="member-page__header">
        <div>
          <h1>{{ t('member.student.page.title') }}</h1>
          <p>{{ t('member.student.page.description') }}</p>
        </div>

        <div>
          <el-button v-uni-permission="'studentuser_export'" @click="exportData">
            {{ t('member.actions.export') }}
          </el-button>
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
        selection="multiple"
        :columns="columns"
        :request="loadStudents"
        :filters="filters"
        :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
        :toolbar="{ refresh: true, density: true, columnSetting: true }"
        :value-enums="valueEnums"
        :actions="actions"
        :action-column="{ width: 100, fixed: 'right' }"
        @selection-change="selectedRows = $event"
        @load-success="handleLoadSuccess"
      >
        <template #toolbar>
          <div class="member-page__toolbar">
            <div>
              <el-button
                v-uni-permission="'studentuser_enble'"
                size="small"
                plain
                :disabled="selectedRows.length === 0"
                @click="batchEnable"
              >
                {{ t('member.actions.enable') }}
              </el-button>
              <el-button
                v-uni-permission="'studentuser_disable'"
                size="small"
                plain
                :disabled="selectedRows.length === 0"
                @click="batchDisable"
              >
                {{ t('member.actions.disable') }}
              </el-button>
              <el-button
                v-uni-permission="'studentuser_del'"
                size="small"
                type="danger"
                plain
                :disabled="selectedRows.length === 0"
                @click="batchDelete"
              >
                {{ t('member.actions.delete') }}
              </el-button>
            </div>
            <span>
              {{
                t('member.page.selectedSummary', undefined, {
                  selected: selectedRows.length,
                  total
                })
              }}
            </span>
          </div>
        </template>
      </UniDataTable>
    </el-card>
  </section>
</template>

<style scoped lang="scss">
.member-page {
  display: grid;
  gap: 16px;
}

.member-page__header-card {
  :deep(.el-card__body) {
    display: grid;
    gap: 18px;
  }
}

.member-page__header {
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

.member-page__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  color: var(--app-text-color-secondary);
}
</style>
