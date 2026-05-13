import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { useUniI18n, useUniListState, useUniPermission } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, ref } from 'vue'

import { bulkEmailApi } from '@/api'
import type { Translate } from '@/types/i18n'
import { downloadBlob } from '@/utils/download'

import { normalizeEnvelope, normalizePaged } from '@/utils/api-response-normalize'
import { searchForm, tableCols } from './list.config'

type Loose = Record<string, unknown>

/** 发件箱 Tab（status=1），对齐 `attendance/holiday` 中 `useHolidayLeave` 的职责切分。 */
export const useOutboxSent = () => {
  const { t } = useUniI18n()
  const tr = t as Translate
  const { hasPermission } = useUniPermission()

  const { queryModel, filters, tableRef, handleLoadSuccess, reset, search } = useUniListState({
    initialFilters: { keyword: '', dateRange: null as string[] | null }
  })

  const searchCfg = computed(() => searchForm(tr))
  const columns = computed(() => tableCols(tr))

  const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
    const fl = f as Loose
    const dr = fl.dateRange as string[] | undefined | null
    const raw = await bulkEmailApi.sendRecordPage.get({
      current: pageNo,
      size: pageSize,
      keyword: String(fl.keyword ?? ''),
      status: 1,
      beginCreateDate: Array.isArray(dr) && dr.length === 2 ? dr[0] : undefined,
      endCreateDate: Array.isArray(dr) && dr.length === 2 ? dr[1] : undefined
    })
    const { list, total } = normalizePaged(raw)
    return { data: list, total }
  }

  const viewVisible = ref(false)
  const viewModel = ref<Loose>({})

  const openView = async (row: Loose) => {
    const raw = await bulkEmailApi.sendRecordDetail.get({ id: row.id as string | number })
    viewModel.value = normalizeEnvelope(raw)
    viewVisible.value = true
  }

  const removeRow = (row: Loose) => {
    ElMessageBox.confirm(tr('email.confirmDelete'), tr('common.tip'), {
      type: 'warning',
      confirmButtonText: tr('common.submit'),
      cancelButtonText: tr('common.cancel')
    })
      .then(async () => {
        await bulkEmailApi.sendRecordRemove.post({ id: row.id as string | number })
        ElMessage.success(tr('email.opOk'))
        tableRef.value?.refresh()
      })
      .catch(() => {})
  }

  const exportViewRecipients = async () => {
    const id = viewModel.value.id
    if (id == null || id === '') {
      return
    }
    try {
      const blob = await bulkEmailApi.sendRecordExportRecipients.get(id as string | number)
      downloadBlob(blob, `mail-recipients-${id}.xlsx`)
    } catch {
      ElMessage.error(tr('email.opFail'))
    }
  }

  const actions = computed<UniTableAction[]>(() => {
    const list: UniTableAction[] = []
    if (hasPermission('outgo-view')) {
      list.push({ label: tr('email.view'), onClick: (row) => void openView(row as Loose) })
    }
    if (hasPermission('outgo-delete')) {
      list.push({ label: tr('email.delete'), onClick: (row) => removeRow(row as Loose) })
    }
    return list
  })

  return {
    actions,
    columns,
    exportViewRecipients,
    filters,
    handleLoadSuccess,
    hasPermission,
    loadData,
    queryModel,
    reset,
    search,
    searchCfg,
    tableRef,
    viewModel,
    viewVisible
  }
}
