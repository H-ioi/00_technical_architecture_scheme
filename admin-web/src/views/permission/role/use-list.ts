import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed } from 'vue'

import { permissionRoleApi } from '@/api'
import { normalizeApiPagedBody } from '@/utils/api-response-normalize'
import type { PermissionRoleRecord as Row } from '@/types/modules/permission-role'

import { dpTypeOptions, searchForm, tableCols } from './list.config'

export interface RoleListCallbacks {
  onEdit: (mode: 'add' | 'edit', row?: Row) => void
  onAssign: (row: Row) => void
  onDelete: (row: Row) => Promise<void>
}

export const useList = (callbacks: RoleListCallbacks) => {
  const { t } = useUniI18n()
  const initialFilters = { roleName: '', roleCode: '', dpType: undefined as number | undefined }
  const { queryModel, filters, tableRef, search, reset, handleLoadSuccess } = useUniListState({
    initialFilters
  })

  const dpOpts = computed(() => dpTypeOptions(t))
  const searchCfg = computed(() => searchForm(t, dpOpts.value))
  const columns = computed(() => tableCols(t))

  const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
    const raw = await permissionRoleApi.page.get({
      current: pageNo,
      size: pageSize,
      ...f
    })
    const { list, total } = normalizeApiPagedBody<Row>(raw)
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
