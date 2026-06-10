<template>
  <section class="activity-prize-list uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('activity.prizeListTitle') }}</h1>
        <p class="uni-list-page__description">{{ $t('activity.prizeListDesc') }}</p>
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

    <PrizeFormDialog ref="formDlg" @saved="refreshTable" />
  </section>
</template>

<script setup lang="ts">
import PrizeFormDialog from './components/prize-form-dialog.vue'
import { searchForm, tableCols } from './list.config'
import { activityPrizeApi, activityProgramApi } from '@/api'
import type { Translate } from '@/types/i18n'
import type { ActivityPrizeRow } from '@/types/modules/activity-prize'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'
import { dateFormat } from '@/utils/tool'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UniDataTable, UniSearchForm, useUniI18n, useUniListState } from 'uni-ui-lib'
import type { UniOption, UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { ref, computed, onMounted } from 'vue'

const formDlg = ref<InstanceType<typeof PrizeFormDialog> | null>(null)

const { locale, t } = useUniI18n()
const tr = t as Translate

const programOptions = ref<UniOption[]>([])

const initialFilters = {
  keyword: '',
  programId: undefined
} as Record<string, unknown>

const { queryModel, filters, handleLoadSuccess, refreshTable, reset, search, tableRef } =
  useUniListState({
    initialFilters
  })

const searchCfg = computed(() => searchForm(tr, programOptions.value))
const columns = computed(() => tableCols(tr))
const selectedRows = ref<ActivityPrizeRow[]>([])
const selectedIds = computed(
  () => selectedRows.value.map((row) => row.id).filter((id) => id != null) as Array<string | number>
)

const loadProgramOptions = async () => {
  const raw = await activityProgramApi.listBrief.get({ programTypes: ['1'] })
  const rows = normalizeArray(raw) as ActivityPrizeRow[]
  programOptions.value = rows.map((row) => ({
    label: String(
      locale.value === 'en' ? (row.enName ?? row.cnName ?? '') : (row.cnName ?? row.enName ?? '')
    ),
    value: row.id as string | number
  }))
}

const decorateRows = (list: ActivityPrizeRow[]) => {
  for (const row of list) {
    row.createTime = row.createTime ? dateFormat(String(row.createTime), 'yyyy-MM-dd hh:mm') : '—'
    row.updateTime = row.updateTime ? dateFormat(String(row.updateTime), 'yyyy-MM-dd hh:mm') : '—'
  }
}

const loadData: UniTableRequest = async ({
  pageNo: current,
  pageSize: size,
  filters: filterModel
}) => {
  const f = filterModel as ActivityPrizeRow
  const raw = await activityPrizeApi.page.get({
    current,
    size,
    keyword: (f.keyword as string) || undefined,
    programId: f.programId as string | number | undefined
  })
  const { list, total } = normalizePaged<ActivityPrizeRow>(raw)
  decorateRows(list)
  return { data: list, total }
}

const onSelectionChange = (rows: Record<string, unknown>[]) => {
  selectedRows.value = rows as ActivityPrizeRow[]
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: tr('activity.lookDetail'),
    onClick: (row) => void formDlg.value?.open('view', row as ActivityPrizeRow)
  },
  {
    label: tr('activity.entryEdit'),
    code: 'busdriver_edit',
    onClick: (row) => void formDlg.value?.open('edit', row as ActivityPrizeRow)
  }
])

const deleteSelected = async () => {
  if (!selectedIds.value.length) {
    ElMessage.warning(tr('activity.prizeSelectRows'))
    return
  }
  try {
    await ElMessageBox.confirm(tr('activity.confirmDeletePrizes'), tr('common.tip'), {
      type: 'warning'
    })
  } catch {
    return
  }
  await activityPrizeApi.remove.delete(selectedIds.value)
  ElMessage.success(tr('activity.deleteOk'))
  selectedRows.value = []
  tableRef.value?.refresh()
}

onMounted(() => {
  void loadProgramOptions()
})
</script>
