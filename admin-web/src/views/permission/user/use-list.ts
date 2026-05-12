import type { Ref } from 'vue'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed } from 'vue'

import { permissionUserApi } from '@/api'
import type { PermissionUserRecord } from '@/types/modules/permission-user'

import { lockOpts, searchForm, tableCols } from './list.config'

type Loose = Record<string, unknown>

export type PermissionUserTableRow = PermissionUserRecord & { rolesLabel?: string }

const unwrapUserPage = (payload: unknown): { list: PermissionUserRecord[]; total: number } => {
  if (!payload || typeof payload !== 'object') {
    return { list: [], total: 0 }
  }
  const r = payload as Loose
  const num = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : 0)
  if (Array.isArray(r.data)) {
    return { list: r.data as PermissionUserRecord[], total: num(r.total) }
  }
  if (Array.isArray(r.records)) {
    return { list: r.records as PermissionUserRecord[], total: num(r.total) }
  }
  const inner = r.data
  if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
    const obj = inner as Loose
    let list: PermissionUserRecord[] = []
    if (Array.isArray(obj.records)) {
      list = obj.records as PermissionUserRecord[]
    }
    return { list, total: num(r.total) || num(obj.total) }
  }
  return { list: [], total: 0 }
}

const rolesLabel = (row: PermissionUserRecord) => {
  if (!Array.isArray(row.roleList)) {
    return '—'
  }
  const s = row.roleList
    .map((x) => x.roleName)
    .filter(Boolean)
    .join(', ')
  return s || '—'
}

export interface UserListCallbacks {
  onEdit: (row: PermissionUserTableRow) => void
  onDelete: (row: PermissionUserTableRow) => Promise<void>
}

export const useList = (
  deptIdRef: Ref<string | number | undefined>,
  callbacks: UserListCallbacks
) => {
  const { t } = useUniI18n()
  const initialFilters = { username: '', nickname: '' }
  const { queryModel, filters, tableRef, search, reset, handleLoadSuccess } = useUniListState({
    initialFilters
  })

  const lockList = computed(() => lockOpts(t))
  const searchConfig = computed(() => searchForm(t))
  const columns = computed(() => tableCols(t, lockList.value))

  const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
    const raw = await permissionUserApi.page.get({
      current: pageNo,
      size: pageSize,
      ...f,
      ...(deptIdRef.value !== undefined && deptIdRef.value !== null
        ? { deptId: deptIdRef.value }
        : {})
    })
    const { list, total } = unwrapUserPage(raw)
    const data: PermissionUserTableRow[] = list.map((r) => ({
      ...r,
      rolesLabel: rolesLabel(r)
    }))
    return { data, total }
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('permission.actions.edit'),
      onClick: (row) => callbacks.onEdit(row as PermissionUserTableRow)
    },
    {
      label: t('permission.actions.delete'),
      onClick: async (row) => {
        await callbacks.onDelete(row as PermissionUserTableRow)
        tableRef.value?.refresh()
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
