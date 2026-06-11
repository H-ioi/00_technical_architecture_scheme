<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('content.navigateButton.pageTitle') }}</h1>
        <p>{{ $t('content.navigateButton.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button type="primary" @click="openForm('add')">
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

    <NavigateButtonFormDialog
      v-model:visible="formVisible"
      :mode="formMode"
      :record-id="activeId"
      @saved="refreshTable" />
  </section>
</template>

<script setup lang="ts">
import NavigateButtonFormDialog from './components/form-dialog.vue'
import { activeTagOpts, tableCols } from './list.config'
import { contentCommonApi, contentNavigateButtonApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { ContentNavigateButtonRecord as Row } from '@/types/modules/content-navigate-button'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUniI18n, useUniListState } from 'uni-ui-lib'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const { t } = useUniI18n()

const { tableRef, handleLoadSuccess, refreshTable } = useUniListState({
  initialFilters: {}
})

const schoolRecords = ref<SchoolOptionRecord[]>([])
const defaultSchoolId = computed(() =>
  schoolRecords.value.length === 1 ? schoolRecords.value[0].id : null
)

const activeOptions = computed(() => activeTagOpts(t))
const columns = computed(() => tableCols(t, activeOptions.value))

const formVisible = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const activeId = ref<string | number | null>(null)

const loadData: UniTableRequest = async ({ pageNo: current, pageSize: size }) => {
  const params: Record<string, unknown> = { current, size }
  if (defaultSchoolId.value != null) {
    params.schoolIds = defaultSchoolId.value
  }

  const result = await contentNavigateButtonApi.page.get(params)
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
    await ElMessageBox.confirm(t('content.navigateButton.confirmDelete'), t('content.delete'), {
      confirmButtonText: t('content.submit'),
      cancelButtonText: t('content.cancel'),
      type: 'warning'
    })
  } catch {
    return
  }

  await contentNavigateButtonApi.delete.post({ id: row.id })
  ElMessage.success(t('content.deleteSuccess'))
  void refreshTable()
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('content.edit'),
    code: 'busdriver_edit',
    onClick: (row) => openForm('edit', row as Row)
  },
  {
    label: t('content.delete'),
    code: 'busdriver_edit',
    onClick: (row) => void removeRow(row as Row)
  }
])

onMounted(async () => {
  const raw = await contentCommonApi.schoolList.get()
  schoolRecords.value = normalizeArray(raw) as SchoolOptionRecord[]
})

watch(
  () => schoolRecords.value,
  (records) => {
    if (records.length > 0) {
      nextTick(() => tableRef.value?.refresh())
    }
  }
)

const tableEmpty = useListTableEmpty(ref({}), { tableRef, afterLoadSuccess: handleLoadSuccess })
</script>
