import type { UniOption, UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { useUniI18n, useUniListState } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, ref } from 'vue'

import { activityPrizeApi, activityProgramApi } from '@/api'
import type { ActivityPrizeRow } from '@/types/modules/activity-prize'
import type { Translate } from '@/types/i18n'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'
import { dateFormat } from '@/utils/tool'

import { searchForm, tableCols } from './list.config'
import type PrizeFormDialog from './components/prize-form-dialog.vue'

type DialogRef = { value: InstanceType<typeof PrizeFormDialog> | null }

export function useActivityPrizeList(formDlg: DialogRef) {
  const { t, locale } = useUniI18n()
  const tr = t as Translate

  const programOptions = ref<UniOption[]>([])

  const initialFilters = {
    keyword: '',
    programId: undefined
  } as Record<string, unknown>

  const { queryModel, filters, handleLoadSuccess, reset, search, tableRef } = useUniListState({
    initialFilters
  })

  const searchCfg = computed(() => searchForm(tr, programOptions.value))
  const columns = computed(() => tableCols(tr))
  const selectedRows = ref<ActivityPrizeRow[]>([])
  const selectedIds = computed(
    () =>
      selectedRows.value.map((row) => row.id).filter((id) => id != null) as Array<string | number>
  )

  const loadProgramOptions = async () => {
    const raw = await activityProgramApi.listBrief.get({ programTypes: ['1'] })
    const rows = normalizeArray(raw) as ActivityPrizeRow[]
    programOptions.value = rows.map((row) => ({
      label: String(locale.value === 'en' ? (row.enName ?? row.cnName ?? '') : (row.cnName ?? row.enName ?? '')),
      value: row.id as string | number
    }))
  }

  const decorateRows = (list: ActivityPrizeRow[]) => {
    for (const row of list) {
      row.createTime = row.createTime
        ? dateFormat(String(row.createTime), 'yyyy-MM-dd hh:mm')
        : '—'
      row.updateTime = row.updateTime
        ? dateFormat(String(row.updateTime), 'yyyy-MM-dd hh:mm')
        : '—'
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

  const openAdd = () => formDlg.value?.open('add')

  const openEdit = (row: ActivityPrizeRow) => formDlg.value?.open('edit', row)

  const openDetail = (row: ActivityPrizeRow) => formDlg.value?.open('view', row)

  const actions = computed<UniTableAction[]>(() => [
    { label: tr('activity.lookDetail'), onClick: (row) => void openDetail(row as ActivityPrizeRow) },
    {
      label: tr('activity.entryEdit'),
      code: 'busdriver_edit',
      onClick: (row) => void openEdit(row as ActivityPrizeRow)
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

  const handleSaved = () => tableRef.value?.refresh()

  onMounted(() => {
    void loadProgramOptions()
  })

  return {
    actions,
    columns,
    deleteSelected,
    filters,
    handleLoadSuccess,
    handleSaved,
    loadData,
    onSelectionChange,
    openAdd,
    openDetail,
    queryModel,
    reset,
    search,
    searchCfg,
    selectedIds,
    tableRef
  }
}
