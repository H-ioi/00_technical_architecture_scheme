import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { useUniI18n, useUniListState } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, ref } from 'vue'

import { activityVoteProgramApi } from '@/api'
import type { Translate } from '@/types/i18n'
import { normalizePaged } from '@/utils/api-response-normalize'

import type FormDialog from './components/form-dialog.vue'
import { searchForm, tableCols } from './list.config'

type Row = Record<string, unknown>

interface DialogRefs {
  formDlg: { value: InstanceType<typeof FormDialog> | null }
}

export function useVoteProgramList({ formDlg }: DialogRefs) {
  const { t } = useUniI18n()
  const tr = t as Translate

  const { queryModel, filters, handleLoadSuccess, reset, search, tableRef } = useUniListState({
    initialFilters: { keyword: '' }
  })

  const selectedRows = ref<Row[]>([])
  const selectedIds = computed(
    () =>
      selectedRows.value.map((row) => row.id).filter((id) => id != null) as Array<string | number>
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

  const openAdd = () => {
    formDlg.value?.open('add')
  }

  const openEdit = (row: Row) => {
    formDlg.value?.open('edit', row)
  }

  const openDetail = (row: Row) => {
    formDlg.value?.open('view', row)
  }

  const actions = computed<UniTableAction[]>(() => [
    { label: tr('activity.lookDetail'), onClick: (row) => openDetail(row as Row) },
    {
      label: tr('activity.entryEdit'),
      code: 'busdriver_edit',
      onClick: (row) => openEdit(row as Row)
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

  const handleSaved = () => {
    tableRef.value?.refresh()
  }

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
    queryModel,
    reset,
    search,
    searchCfg,
    selectedIds,
    tableRef
  }
}
