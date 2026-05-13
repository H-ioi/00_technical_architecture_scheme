import type { Ref } from 'vue'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed } from 'vue'

import { permissionUserApi } from '@/api'
import { normalizeApiPagedBody } from '@/utils/api-response-normalize'
import type { PermissionUserRecord } from '@/types/modules/permission-user'

import { lockOpts, searchForm, tableCols } from './list.config'

export type PermissionUserTableRow = PermissionUserRecord & { rolesLabel?: string }

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
  const searchCfg = computed(() => searchForm(t))
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
    const { list, total } = normalizeApiPagedBody<PermissionUserRecord>(raw)
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
    searchCfg,
    tableRef,
    t
  }
}
