<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('activity.voteProgramTitle') }}</h1>
        <p class="uni-list-page__description">{{ $t('activity.voteProgramDesc') }}</p>
      </div>
      <div v-uni-permission="'busdriver_edit'" class="uni-list-page__header-actions">
        <el-button type="primary" @click="formDlg?.open('add')">{{ $t('activity.add') }}</el-button>
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
      :toolbar="{ refresh: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 110, fixed: 'right' }"
      @load-success="handleLoadSuccess"
      @selection-change="onSelectionChange"
    >
      <template #toolbar>
        <el-button
          v-uni-permission="'busdriver_del'"
          type="danger"
          plain
          :disabled="!selectedIds.length"
          @click="deleteSelected"
        >
          {{ $t('activity.delBatch') }}
        </el-button>
      </template>
    </UniDataTable>

    <FormDialog ref="formDlg" @saved="refreshTable" />
  </section>
</template>

<script setup lang="ts">
import FormDialog from './components/form-dialog.vue'
import { searchForm, tableCols } from './list.config'
import { activityVoteProgramApi } from '@/api'
import type { Translate } from '@/types/i18n'
import { normalizePaged } from '@/utils/api-response-normalize'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UniDataTable, UniSearchForm, useUniI18n, useUniListState } from 'uni-ui-lib'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { ref, computed } from 'vue'

const { t } = useUniI18n()

const formDlg = ref<InstanceType<typeof FormDialog> | null>(null)

type Row = Record<string, unknown>

const tr = t as Translate

const { queryModel, filters, handleLoadSuccess, refreshTable, reset, search, tableRef } =
  useUniListState({
    initialFilters: { keyword: '' }
  })

const selectedRows = ref<Row[]>([])
const selectedIds = computed(
  () => selectedRows.value.map((row) => row.id).filter((id) => id != null) as Array<string | number>
)

const searchCfg = computed(() => searchForm(tr))
const columns = computed(() => tableCols(tr))

const loadData: UniTableRequest = async ({
  pageNo: current,
  pageSize: size,
  filters: filterModel
}) => {
  const f = filterModel as Row
  const raw = await activityVoteProgramApi.page.get({
    current,
    size,
    keyword: (f.keyword as string) || undefined
  })
  const { list, total } = normalizePaged<Row>(raw)
  return { data: list, total }
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: tr('activity.lookDetail'),
    onClick: (row) => void formDlg.value?.open('view', row as Row)
  },
  {
    label: tr('activity.entryEdit'),
    code: 'busdriver_edit',
    onClick: (row) => void formDlg.value?.open('edit', row as Row)
  }
])

const onSelectionChange = (rows: Record<string, unknown>[]) => {
  selectedRows.value = rows as Row[]
}

const deleteSelected = async () => {
  if (!selectedIds.value.length) {
    ElMessage.warning(tr('activity.voteProgramSelRows'))
    return
  }
  try {
    await ElMessageBox.confirm(tr('activity.confirmDeleteVotePrograms'), tr('common.tip'), {
      type: 'warning'
    })
  } catch {
    return
  }
  try {
    await activityVoteProgramApi.remove.delete(selectedIds.value)
    ElMessage.success(tr('activity.deleteOk'))
    tableRef.value?.refresh()
  } catch {
    ElMessage.error(tr('activity.saveFail'))
  }
}
</script>
