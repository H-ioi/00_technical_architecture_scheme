import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed } from 'vue'

import { permissionRoleApi } from '@/api'
import type { PermissionRoleRecord as Row } from '@/types/modules/permission-role'

import { dpTypeOptions, searchForm, tableCols } from './list.config'

type Loose = Record<string, unknown>

const unwrapRolePage = (payload: unknown): { list: Row[]; total: number } => {
  if (!payload || typeof payload !== 'object') {
    return { list: [], total: 0 }
  }
  const r = payload as Loose
  const num = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : 0)
  if (Array.isArray(r.data)) {
    return { list: r.data as Row[], total: num(r.total) }
  }
  if (Array.isArray(r.records)) {
    return { list: r.records as Row[], total: num(r.total) }
  }
  const inner = r.data
  if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
    const obj = inner as Loose
    let list: Row[] = []
    if (Array.isArray(obj.records)) {
      list = obj.records as Row[]
    }
    return { list, total: num(r.total) || num(obj.total) }
  }
  return { list: [], total: 0 }
}

export interface RoleListCallbacks {
  onEdit: (mode: 'add' | 'edit', row?: Row) => void
  onAssign: (row: Row) => void
  onDelete: (row: Row) => Promise<void>
}

export const useList = (callbacks: RoleListCallbacks) => {
  const { t } = useUniI18n()
  const initialFilters = { roleName: '', roleCode: '', dpType: undefined as number | undefined }
  const { queryModel, filters, tableRef, search, reset, handleLoadSuccess } = useUniListState({ initialFilters })

  const dpOpts = computed(() => dpTypeOptions(t))
  const searchConfig = computed(() => searchForm(t, dpOpts.value))
  const columns = computed(() => tableCols(t))

  const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
    const raw = await permissionRoleApi.page.get({
      current: pageNo,
      size: pageSize,
      ...f
    })
    const { list, total } = unwrapRolePage(raw)
    return { data: list, total }
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('permission.actions.edit'),
      onClick: (row) => callbacks.onEdit('edit', row as Row)
    },
    {
      label: t('permission.actions.assignMenu'),
      onClick: (row) => callbacks.onAssign(row as Row)
    },
    {
      label: t('permission.actions.delete'),
      onClick: async (row) => {
        await callbacks.onDelete(row as Row)
        tableRef.value?.reload()
      }
    }
  ])

  return {
    actions,
    columns,
    filters,
    handleLoadSuccess,
    loadData,
    queryModel,
    reset,
    search,
    searchConfig,
    tableRef,
    t
  }
}
