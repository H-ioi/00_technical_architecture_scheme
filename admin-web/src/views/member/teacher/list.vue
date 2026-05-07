<script setup lang="ts">
import DetailDialog from './components/detail-dialog.vue'
import FormDialog from './components/form-dialog.vue'
import ImportDialog from './components/import-dialog.vue'
import { useList } from './use-list'

import { useAppI18n } from '@/composables/use-app-i18n'

const { t } = useAppI18n()
const {
  actions,
  batchDelete,
  batchDisable,
  batchEnable,
  columns,
  currentMember,
  detailConfig,
  detailVisible,
  downloadTemplate,
  editCurrent,
  exportData,
  filters,
  formConfig,
  formMode,
  formVisible,
  handleLoadSuccess,
  importVisible,
  loadMembers,
  openCreate,
  queryModel,
  reset,
  saveMember,
  search,
  searchConfig,
  selectedRows,
  submitImport,
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
          <h1>{{ t('member.teacher.page.title') }}</h1>
          <p>{{ t('member.teacher.page.description') }}</p>
        </div>

        <div class="member-page__header-actions">
          <el-button v-uni-permission="'teacheruser_add'" type="primary" @click="openCreate">
            {{ t('member.actions.add') }}
          </el-button>
          <el-button v-uni-permission="'teacheruser_import'" @click="importVisible = true">
            {{ t('member.actions.import') }}
          </el-button>
          <el-button v-uni-permission="'teacheruser_export'" @click="exportData">
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
        :request="loadMembers"
        :filters="filters"
        :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
        :toolbar="{ refresh: true, density: true, columnSetting: true }"
        :value-enums="valueEnums"
        :actions="actions"
        :action-column="{ width: 150, fixed: 'right' }"
        @selection-change="selectedRows = $event"
        @load-success="handleLoadSuccess"
      >
        <template #toolbar>
          <div class="member-page__toolbar">
            <div class="member-page__batch-actions">
              <el-button
                v-uni-permission="'teacheruser_enble'"
                size="small"
                plain
                :disabled="selectedRows.length === 0"
                @click="batchEnable"
              >
                {{ t('member.actions.enable') }}
              </el-button>
              <el-button
                v-uni-permission="'teacheruser_disable'"
                size="small"
                plain
                :disabled="selectedRows.length === 0"
                @click="batchDisable"
              >
                {{ t('member.actions.disable') }}
              </el-button>
              <el-button
                v-uni-permission="'teacheruser_del'"
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

    <FormDialog
      v-model:visible="formVisible"
      :mode="formMode"
      :source="currentMember"
      :config="formConfig"
      @submit="saveMember"
    />
    <DetailDialog
      v-model:visible="detailVisible"
      :source="currentMember"
      :config="detailConfig"
      @edit="editCurrent"
    />
    <ImportDialog
      v-model:visible="importVisible"
      @submit="submitImport"
      @download-template="downloadTemplate"
    />
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
}

.member-page__toolbar {
  justify-content: space-between;
  width: 100%;
  color: var(--app-text-color-secondary);
}

@media (width <= 900px) {
  .member-page__header,
  .member-page__toolbar {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
