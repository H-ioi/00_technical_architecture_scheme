<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('content.category.pageTitle') }}</h1>
        <p>{{ $t('content.category.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'category_add'" type="primary" @click="openForm('add')">
          {{ $t('content.add') }}
        </el-button>
      </div>
    </div>

    <UniDataTable
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :request="loadData"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 120, fixed: 'right' }"
      @load-success="tableEmpty.onLoadSuccess"
      @request-error="tableEmpty.onRequestError">
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>

    <CategoryFormDialog
      v-model:visible="formVisible"
      :mode="formMode"
      :record-id="activeId"
      @saved="refreshTable" />
  </section>
</template>

<script setup lang="ts">
import CategoryFormDialog from './components/form-dialog.vue'
import { tableCols, visibleTagOpts } from './list.config'
import { contentCategoryApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { ContentCategoryRecord as Row } from '@/types/modules/content-category'
import { normalizePaged } from '@/utils/api-response-normalize'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUniI18n, useUniListState } from 'uni-ui-lib'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { computed, ref } from 'vue'

const { t } = useUniI18n()

const { tableRef, handleLoadSuccess, refreshTable } = useUniListState({
  initialFilters: {}
})

const visibleOptions = computed(() => visibleTagOpts(t))
const columns = computed(() => tableCols(t, visibleOptions.value))

const formVisible = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const activeId = ref<string | number | null>(null)

const loadData: UniTableRequest = async ({ pageNo: current, pageSize: size }) => {
  const result = await contentCategoryApi.page.get({ current, size })
  const { list, total: pageTotal } = normalizePaged<Row>(result)

  return {
    data: list,
    total: pageTotal
  }
}

const openForm = (mode: 'add' | 'edit', row?: Row) => {
  formMode.value = mode
  activeId.value = row?.id ?? null
  formVisible.value = true
}

const removeRow = async (row: Row) => {
  try {
    await ElMessageBox.confirm(t('content.category.confirmDelete'), t('content.delete'), {
      confirmButtonText: t('content.submit'),
      cancelButtonText: t('content.cancel'),
      type: 'warning'
    })
  } catch {
    return
  }

  await contentCategoryApi.delete.post({ id: row.id })
  ElMessage.success(t('content.deleteSuccess'))
  void refreshTable()
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('content.edit'),
    code: 'category_edit',
    onClick: (row) => openForm('edit', row as Row)
  },
  {
    label: t('content.delete'),
    code: 'category_del',
    onClick: (row) => void removeRow(row as Row)
  }
])

const tableEmpty = useListTableEmpty(ref({}), { tableRef, afterLoadSuccess: handleLoadSuccess })
</script>
