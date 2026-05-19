import type { UniOption, UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, ref } from 'vue'

import { useMembershipSchoolOptions } from '@/composables/use-membership-school-options'
import { wechatSchoolInfoApi } from '@/api'
import type { Translate } from '@/types/i18n'
import type { WechatSchoolInfoRow } from '@/types/modules/wechat-school-info'
import { normalizePaged } from '@/utils/api-response-normalize'
import { dateFormat } from '@/utils/tool'

import type FormDialog from './components/form-dialog.vue'
import { activeOptions, searchForm, tableCols } from './list.config'

type DialogRef = { value: InstanceType<typeof FormDialog> | null }

export function useWechatSchoolList(formDlg: DialogRef) {
  const { t, locale } = useUniI18n()
  const tr = t as Translate

  const { schoolOptions, loadSchoolOptions } = useMembershipSchoolOptions()

  const { queryModel, filters, handleLoadSuccess, reset, search, tableRef } = useUniListState({
    initialFilters: { schoolId: undefined, keyword: '' }
  })

  const ynOptions = computed(() => activeOptions(tr))
  const searchCfg = computed(() => searchForm(tr, schoolOptions.value))
  const columns = computed(() => tableCols(tr, schoolOptions.value, ynOptions.value))
  const selectedRows = ref<WechatSchoolInfoRow[]>([])
  const selectedIds = computed(
    () =>
      selectedRows.value.map((row) => row.id).filter((id) => id != null) as Array<string | number>
  )

  const decorateRows = (list: WechatSchoolInfoRow[]) => {
    for (const row of list) {
      row.active = String(row.active ?? '')
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
    const f = filterModel as WechatSchoolInfoRow
    const raw = await wechatSchoolInfoApi.page.get({
      current,
      size,
      schoolId: f.schoolId as string | number | undefined,
      keyword: (f.keyword as string) || undefined
    })
    const { list, total } = normalizePaged<WechatSchoolInfoRow>(raw)
    decorateRows(list)
    return { data: list, total }
  }

  const openAdd = () => formDlg.value?.open('add')
  const openEdit = (row: WechatSchoolInfoRow) => formDlg.value?.open('edit', row)
  const openDetail = (row: WechatSchoolInfoRow) => formDlg.value?.open('view', row)

  const actions = computed<UniTableAction[]>(() => [
    { label: tr('activity.lookDetail'), onClick: (row) => void openDetail(row as WechatSchoolInfoRow) },
    {
      label: tr('activity.entryEdit'),
      code: 'busdriver_edit',
      onClick: (row) => void openEdit(row as WechatSchoolInfoRow)
    }
  ])

  const onSelectionChange = (rows: Record<string, unknown>[]) => {
    selectedRows.value = rows as WechatSchoolInfoRow[]
  }

  const deleteSelected = async () => {
    if (!selectedIds.value.length) {
      ElMessage.warning(tr('activity.wechatSchoolSelRows'))
      return
    }
    try {
      await ElMessageBox.confirm(tr('activity.confirmDeleteWechatSchools'), tr('common.tip'), {
        type: 'warning'
      })
    } catch {
      return
    }
    await wechatSchoolInfoApi.remove.delete(selectedIds.value)
    ElMessage.success(tr('activity.deleteOk'))
    selectedRows.value = []
    tableRef.value?.refresh()
  }

  const handleSaved = () => tableRef.value?.refresh()

  onMounted(() => {
    void loadSchoolOptions()
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
