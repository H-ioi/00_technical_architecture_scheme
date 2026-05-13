import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { useUniI18n, useUniListState } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, ref } from 'vue'

import { bulkEmailApi } from '@/api'
import type { Translate } from '@/types/i18n'

import { unwrapMailPage } from '../mail-page-utils'
import { emailSendColumns, emailSendSearchForm, emailSendStatusOpts } from './list.config'

type Loose = Record<string, unknown>

const pickDetail = async (id: string | number) => {
  const raw = await bulkEmailApi.userMailinfoDetail.get({ id })
  return (raw && typeof raw === 'object' ? (raw as Loose) : {}) as Loose
}

export const useList = () => {
  const { t } = useUniI18n()
  const tr = t as Translate
  const { queryModel, filters, tableRef, handleLoadSuccess, reset, search } = useUniListState({
    initialFilters: { keyword: '', status: '' }
  })
  const statusOpts = computed(() => emailSendStatusOpts(tr))
  const searchConfig = computed(() => emailSendSearchForm(tr, statusOpts.value))
  const columns = computed(() => emailSendColumns(tr))

  const dialogVisible = ref(false)
  const viewVisible = ref(false)
  const dialogMode = ref<'add' | 'edit'>('add')
  const selectedRows = ref<Loose[]>([])
  const batchDisabled = computed(() => selectedRows.value.length === 0)

  const onSelectionChange = (rows: Record<string, unknown>[]) => {
    selectedRows.value = rows as Loose[]
  }

  const viewModel = ref<{
    userLines: string[]
    email: string
    groups: string
    statusLabel: string
  }>({ userLines: [], email: '', groups: '', statusLabel: '' })

  const formModel = ref({
    userMailinfoId: '' as string | number,
    userIds: [] as string[],
    email: '',
    mailgroupIds: [] as (string | number)[],
    status: '1'
  })

  const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
    const raw = await bulkEmailApi.userMailinfoPage.get({
      current: pageNo,
      size: pageSize,
      keyword: String((f as Loose).keyword ?? ''),
      status: (f as Loose).status === '' || (f as Loose).status == null ? undefined : String((f as Loose).status)
    })
    const { list, total } = unwrapMailPage(raw)
    return { data: list, total }
  }

  const openAdd = () => {
    dialogMode.value = 'add'
    formModel.value = {
      userMailinfoId: '',
      userIds: [],
      email: '',
      mailgroupIds: [],
      status: '1'
    }
    dialogVisible.value = true
  }

  const openEdit = async (row: Loose) => {
    dialogMode.value = 'edit'
    const id = row.id
    const data = await pickDetail(id as string | number)
    const mailinfo = (data.mailinfo as Loose) ?? {}
    formModel.value = {
      userMailinfoId: mailinfo.id ?? '',
      userIds: (data.userIdRelations as unknown[] | undefined)?.map((x) => String(x)) ?? [],
      email: String(mailinfo.email ?? ''),
      mailgroupIds: (data.mailgroupIdRelations as unknown[] | undefined)?.map((x) => x as string | number) ?? [],
      status: mailinfo.status != null ? String(mailinfo.status) : '1'
    }
    dialogVisible.value = true
  }

  const openView = async (row: Loose) => {
    const data = await pickDetail(row.id as string | number)
    const mailinfo = (data.mailinfo as Loose) ?? {}
    const userRelations = (data.userRelations as { username?: string }[] | undefined) ?? []
    const groupRels = data.mailgroupRelations as { mailgroupName?: string }[] | undefined
    const groups =
      Array.isArray(groupRels) && groupRels.length
        ? groupRels
            .map((g) => g.mailgroupName ?? '')
            .filter(Boolean)
            .join('，')
                : '—'
    viewModel.value = {
      userLines: userRelations.map((u) => u.username ?? '').filter(Boolean),
      email: String(mailinfo.email ?? ''),
      groups,
      statusLabel:
        Number(mailinfo.status) === 1 ? tr('email.statusActive') : tr('email.statusArchived')
    }
    viewVisible.value = true
  }

  const removeRow = (row: Loose) => {
    ElMessageBox.confirm(tr('email.confirmDelete'), tr('common.tip'), {
      type: 'warning',
      confirmButtonText: tr('common.submit'),
      cancelButtonText: tr('common.cancel')
    })
      .then(async () => {
        await bulkEmailApi.userMailinfoRemove.post({ id: row.id as string | number })
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
        await bulkEmailApi.userMailinfoBatchStatus.post({ ids, status })
        ElMessage.success(tr('email.opOk'))
        tableRef.value?.refresh()
      })
      .catch(() => {})
  }

  const actions = computed<UniTableAction[]>(() => [
    { label: tr('email.edit'), onClick: (row) => void openEdit(row as Loose) },
    { label: tr('email.view'), onClick: (row) => void openView(row as Loose) },
    { label: tr('email.delete'), onClick: (row) => removeRow(row as Loose) }
  ])

  return {
    actions,
    batchDisabled,
    batchStatus,
    columns,
    dialogMode,
    dialogVisible,
    filters,
    formModel,
    handleLoadSuccess,
    loadData,
    onSelectionChange,
    openAdd,
    queryModel,
    reset,
    search,
    searchConfig,
    tableRef,
    viewModel,
    viewVisible
  }
}
