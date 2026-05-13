import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { useUniI18n, useUniListState, useUniPermission } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, ref } from 'vue'

import { bulkEmailApi } from '@/api'
import type { Translate } from '@/types/i18n'

import { formatMailGroupScopeDisplay } from '../mail-page-utils'
import { unwrapMailPage } from '../mail-page-utils'
import {
  emailGroupColumns,
  emailGroupSearchForm,
  emailGroupStatusOpts,
  emailGroupYnOpts
} from './list.config'

type Loose = Record<string, unknown>

export type UseGroupListOptions = {
  onEditRow?: (row: Loose) => void
}

export const useList = (options: UseGroupListOptions = {}) => {
  const { t } = useUniI18n()
  const tr = t as Translate
  const { hasPermission } = useUniPermission()
  const { queryModel, filters, tableRef, handleLoadSuccess, reset, search } = useUniListState({
    initialFilters: { keyword: '', status: '', includeParentMails: '', includeStudentMails: '' }
  })
  const ynOpts = computed(() => emailGroupYnOpts(tr))
  const stOpts = computed(() => emailGroupStatusOpts(tr))
  const searchConfig = computed(() => emailGroupSearchForm(tr, ynOpts.value, stOpts.value))
  const columns = computed(() => emailGroupColumns(tr))

  const selectedRows = ref<Loose[]>([])
  const batchDisabled = computed(() => selectedRows.value.length === 0)
  const onSelectionChange = (rows: Record<string, unknown>[]) => {
    selectedRows.value = rows as Loose[]
  }

  const viewVisible = ref(false)
  const viewLabels = ref<string[]>([])
  const viewMeta = ref({ name: '', parent: '', student: '', status: '', createdAt: '' })

  const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
    const fl = f as Loose
    const raw = await bulkEmailApi.groupPage.get({
      current: pageNo,
      size: pageSize,
      keyword: String(fl.keyword ?? ''),
      status: fl.status === '' || fl.status == null ? undefined : String(fl.status),
      includeParentMails:
        fl.includeParentMails === '' || fl.includeParentMails == null
          ? undefined
          : String(fl.includeParentMails),
      includeStudentMails:
        fl.includeStudentMails === '' || fl.includeStudentMails == null
          ? undefined
          : String(fl.includeStudentMails)
    })
    const { list, total } = unwrapMailPage(raw)
    return { data: list, total }
  }

  const openView = (row: Loose) => {
    viewMeta.value = {
      name: String(row.name ?? ''),
      parent: Number(row.includeParentMails) === 1 || row.includeParentMails === true ? tr('email.yes') : tr('email.no'),
      student:
        Number(row.includeStudentMails) === 1 || row.includeStudentMails === true ? tr('email.yes') : tr('email.no'),
      status: String(row.status) === '1' ? tr('email.statusActive') : tr('email.statusArchived'),
      createdAt: String(row.createdAt ?? '—')
    }
    const sc = String(row.scopes ?? '')
    viewLabels.value = sc
      ? sc
          .split(';')
          .filter((x) => x.trim())
          .map(formatMailGroupScopeDisplay)
      : []
    viewVisible.value = true
  }

  const removeRow = (row: Loose) => {
    ElMessageBox.confirm(tr('email.confirmDelete'), tr('common.tip'), {
      type: 'warning',
      confirmButtonText: tr('common.submit'),
      cancelButtonText: tr('common.cancel')
    })
      .then(async () => {
        await bulkEmailApi.groupDelete.post({ id: row.id as string | number })
        ElMessage.success(tr('email.opOk'))
        tableRef.value?.refresh()
      })
      .catch(() => {})
  }

  const batchStatus = (status: number) => {
    const rows = selectedRows.value
    if (rows.length === 0) {
      ElMessage.warning(tr('email.selectRows'))
      return
    }
    ElMessageBox.confirm(tr('email.confirmBatch'), tr('common.tip'), {
      type: 'warning',
      confirmButtonText: tr('common.submit'),
      cancelButtonText: tr('common.cancel')
    })
      .then(async () => {
        const ids = rows.map((r) => String(r.id)).join(',')
        await bulkEmailApi.groupBatchStatus.post({ ids, status })
        ElMessage.success(tr('email.opOk'))
        tableRef.value?.refresh()
      })
      .catch(() => {})
  }

  const actions = computed<UniTableAction[]>(() => {
    const list: UniTableAction[] = []
    if (hasPermission('mailgroup-edit')) {
      list.push({
        label: tr('email.edit'),
        onClick: (row) => options.onEditRow?.(row as Loose)
      })
    }
    if (hasPermission('mailgroup-view')) {
      list.push({ label: tr('email.view'), onClick: (row) => openView(row as Loose) })
    }
    if (hasPermission('mailgroup-delete')) {
      list.push({ label: tr('email.delete'), onClick: (row) => removeRow(row as Loose) })
    }
    return list
  })

  return {
    actions,
    batchDisabled,
    batchStatus,
    columns,
    filters,
    handleLoadSuccess,
    hasPermission,
    loadData,
    onSelectionChange,
    queryModel,
    reset,
    search,
    searchConfig,
    tableRef,
    viewLabels,
    viewMeta,
    viewVisible
  }
}
