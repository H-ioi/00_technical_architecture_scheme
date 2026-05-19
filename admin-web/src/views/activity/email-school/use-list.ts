import type { UniOption, UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { useUniI18n, useUniListState } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, ref } from 'vue'

import { schoolEmailConfigApi } from '@/api'
import type { Translate } from '@/types/i18n'
import type { SchoolEmailConfigRow } from '@/types/modules/school-email-config'
import { useMembershipSchoolOptions } from '@/composables/use-membership-school-options'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'
import { appModuleOptionsFromRows } from '@/utils/activity-email-school'
import { dateFormat } from '@/utils/tool'

import type FormDialog from './components/form-dialog.vue'
import { searchForm, tableCols } from './list.config'

type DialogRef = { value: InstanceType<typeof FormDialog> | null }

export function useEmailSchoolList(formDlg: DialogRef) {
  const { t, locale } = useUniI18n()
  const tr = t as Translate

  const { schoolOptions, loadSchoolOptions } = useMembershipSchoolOptions()
  const appModuleOptions = ref<UniOption[]>([])

  const { queryModel, filters, handleLoadSuccess, refreshTable, reset, search, tableRef } =
    useUniListState({
      initialFilters: { schoolId: undefined, keyword: '' }
    })

  const searchCfg = computed(() => searchForm(tr, schoolOptions.value))
  const columns = computed(() => tableCols(tr, schoolOptions.value, appModuleOptions.value))
  const selectedRows = ref<SchoolEmailConfigRow[]>([])
  const selectedIds = computed(
    () =>
      selectedRows.value.map((row) => row.id).filter((id) => id != null) as Array<string | number>
  )

  const loadAppModuleOptions = async () => {
    try {
      const raw = await schoolEmailConfigApi.appModules.get()
      appModuleOptions.value = appModuleOptionsFromRows(
        normalizeArray(raw) as Record<string, unknown>[],
        tr('activity.appModuleActivity')
      )
    } catch {
      appModuleOptions.value = appModuleOptionsFromRows([], tr('activity.appModuleActivity'))
    }
  }

  const decorateRows = (list: SchoolEmailConfigRow[]) => {
    for (const row of list) {
      row.appModule = row.appModule == null || row.appModule === '' ? '' : String(row.appModule)
      row.createdAt = row.createdAt
        ? dateFormat(String(row.createdAt), 'yyyy-MM-dd hh:mm')
        : '—'
      row.updatedAt = row.updatedAt
        ? dateFormat(String(row.updatedAt), 'yyyy-MM-dd hh:mm')
        : '—'
    }
  }

  const loadData: UniTableRequest = async ({
    pageNo: current,
    pageSize: size,
    filters: filterModel
  }) => {
    const f = filterModel as SchoolEmailConfigRow
    const raw = await schoolEmailConfigApi.page.get({
      current,
      size,
      schoolId: f.schoolId as string | number | undefined,
      keyword: (f.keyword as string) || undefined
    })
    const { list, total } = normalizePaged<SchoolEmailConfigRow>(raw)
    decorateRows(list)
    return { data: list, total }
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: tr('activity.lookDetail'),
      onClick: (row) => void formDlg.value?.open('view', row as SchoolEmailConfigRow)
    },
    {
      label: tr('activity.entryEdit'),
      code: 'busdriver_edit',
      onClick: (row) => void formDlg.value?.open('edit', row as SchoolEmailConfigRow)
    }
  ])

  const onSelectionChange = (rows: Record<string, unknown>[]) => {
    selectedRows.value = rows as SchoolEmailConfigRow[]
  }

  const deleteSelected = async () => {
    if (!selectedIds.value.length) {
      ElMessage.warning(tr('activity.emailSchoolSelRows'))
      return
    }
    try {
      await ElMessageBox.confirm(tr('activity.confirmDeleteEmailSchools'), tr('common.tip'), {
        type: 'warning'
      })
    } catch {
      return
    }
    await schoolEmailConfigApi.remove.delete(selectedIds.value)
    ElMessage.success(tr('activity.deleteOk'))
    selectedRows.value = []
    tableRef.value?.refresh()
  }

  onMounted(() => {
    void Promise.all([loadSchoolOptions(), loadAppModuleOptions()])
  })

  return {
    actions,
    columns,
    deleteSelected,
    filters,
    handleLoadSuccess,
    loadData,
    refreshTable,
    onSelectionChange,
    queryModel,
    reset,
    search,
    searchCfg,
    selectedIds,
    tableRef
  }
}
