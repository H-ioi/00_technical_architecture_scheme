import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { useUniI18n, useUniListState } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, ref } from 'vue'

import { bulkEmailApi } from '@/api'
import type { Translate } from '@/types/i18n'

import { normalizeApiEnvelope, normalizeApiPagedBody } from '@/utils/api-response-normalize'
import { emailOutboxDraftColumns, emailOutboxSearchForm } from './list.config'

type Loose = Record<string, unknown>

const joinSemi = (a: unknown): string =>
  Array.isArray(a) ? (a as string[]).filter((x) => x != null && String(x)).join(';') : ''

/** 草稿箱 Tab（status=0），对齐 `attendance/holiday` 中 `useHolidayReturn`。 */
export const useOutboxDraft = () => {
  const { t } = useUniI18n()
  const tr = t as Translate

  const { queryModel, filters, tableRef, handleLoadSuccess, reset, search } = useUniListState({
    initialFilters: { keyword: '', dateRange: null as string[] | null }
  })

  const searchConfig = computed(() => emailOutboxSearchForm(tr))
  const columns = computed(() => emailOutboxDraftColumns(tr))

  const mailSenderOptions = ref<Loose[]>([])
  const mailGroupOptions = ref<Loose[]>([])

  const loadMailOptions = async () => {
    try {
      const [u, g] = await Promise.all([
        bulkEmailApi.userMailinfoPage.get({ current: 1, size: 500, status: 1 }),
        bulkEmailApi.groupPage.get({ current: 1, size: 9999, status: 1 })
      ])
      mailSenderOptions.value = normalizeApiPagedBody(u).list
      mailGroupOptions.value = normalizeApiPagedBody(g).list
    } catch {
      mailSenderOptions.value = []
      mailGroupOptions.value = []
    }
  }

  const dialogVisible = ref(false)
  const dialogMode = ref<'add' | 'edit'>('add')
  const formModel = ref<Loose>({})
  const formSubmitting = ref(false)

  const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
    const fl = f as Loose
    const dr = fl.dateRange as string[] | undefined | null
    const raw = await bulkEmailApi.sendRecordPage.get({
      current: pageNo,
      size: pageSize,
      keyword: String(fl.keyword ?? ''),
      status: 0,
      beginCreateDate: Array.isArray(dr) && dr.length === 2 ? dr[0] : undefined,
      endCreateDate: Array.isArray(dr) && dr.length === 2 ? dr[1] : undefined
    })
    const { list, total } = normalizeApiPagedBody(raw)
    return { data: list, total }
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

  const sendDraft = async (row: Loose) => {
    try {
      const raw = await bulkEmailApi.sendRecordDetail.get({ id: row.id as string | number })
      const data = normalizeApiEnvelope(raw)
      const payload: Loose = {
        toGroups:
          (data.toGroups as { id: string | number }[] | undefined)?.map((item) => item.id) ?? [],
        ccGroups:
          (data.ccGroups as { id: string | number }[] | undefined)?.map((item) => item.id) ?? [],
        bccGroups:
          (data.bccGroups as { id: string | number }[] | undefined)?.map((item) => item.id) ?? [],
        otherCC: joinSemi(data.ccOthersArray),
        otherBCC: joinSemi(data.bccOthersArray),
        otherMails: joinSemi(data.toOthersArray),
        subject: String(data.subject ?? ''),
        content: String(data.content ?? ''),
        status: 1,
        email: String(data.email ?? ''),
        mailInfoId: data.userMailinfoId ?? '',
        id: data.id ?? row.id,
        attachments: data.attachmentUrls ?? []
      }
      await bulkEmailApi.sendRecordUpdate.post(payload)
      ElMessage.success(tr('email.opOk'))
      tableRef.value?.refresh()
    } catch {
      ElMessage.error(tr('email.opFail'))
    }
  }

  const openAdd = async () => {
    await loadMailOptions()
    dialogMode.value = 'add'
    formModel.value = {
      id: '',
      mailInfoId: '',
      toGroups: [] as (string | number)[],
      ccGroups: [] as (string | number)[],
      bccGroups: [] as (string | number)[],
      otherMails: '',
      otherCC: '',
      otherBCC: '',
      subject: '',
      content: ' ',
      attachments: [] as string[]
    }
    dialogVisible.value = true
  }

  const openEdit = async (row: Loose) => {
    await loadMailOptions()
    dialogMode.value = 'edit'
    const raw = await bulkEmailApi.sendRecordDetail.get({ id: row.id as string | number })
    const data = normalizeApiEnvelope(raw)
    formModel.value = {
      id: data.id ?? row.id,
      mailInfoId: data.userMailinfoId ?? '',
      toGroups: (data.toGroups as { id: string | number }[] | undefined)?.map((x) => x.id) ?? [],
      ccGroups: (data.ccGroups as { id: string | number }[] | undefined)?.map((x) => x.id) ?? [],
      bccGroups: (data.bccGroups as { id: string | number }[] | undefined)?.map((x) => x.id) ?? [],
      otherMails: joinSemi(data.toOthersArray),
      otherCC: joinSemi(data.ccOthersArray),
      otherBCC: joinSemi(data.bccOthersArray),
      subject: String(data.subject ?? ''),
      content: String(data.content ?? ' '),
      attachments: (data.attachmentUrls as string[]) ?? []
    }
    dialogVisible.value = true
  }

  const submitComposeForm = async (status: number) => {
    const m = formModel.value
    formSubmitting.value = true
    try {
      const sender = mailSenderOptions.value.find((x) => String(x.id) === String(m.mailInfoId))
      const payload: Record<string, unknown> = {
        subject: String(m.subject ?? '').trim(),
        content: String(m.content ?? ' ') || ' ',
        mailInfoId: m.mailInfoId,
        status,
        email: String(sender?.email ?? ''),
        attachments: (m.attachments as string[]) ?? []
      }
      const tg = ((m.toGroups as (string | number)[]) ?? []).map((x) => x)
      if (tg.length) {
        payload.toGroups = tg
      }
      const ccg = ((m.ccGroups as (string | number)[]) ?? []).map((x) => x)
      if (ccg.length) {
        payload.ccGroups = ccg
      }
      const bcg = ((m.bccGroups as (string | number)[]) ?? []).map((x) => x)
      if (bcg.length) {
        payload.bccGroups = bcg
      }
      const om = String(m.otherMails ?? '').trim()
      if (om) {
        payload.otherMails = om.split(';').map((s) => s.trim()).filter(Boolean)
      }
      const occ = String(m.otherCC ?? '').trim()
      if (occ) {
        payload.otherCC = occ.split(';').map((s) => s.trim()).filter(Boolean)
      }
      const obcc = String(m.otherBCC ?? '').trim()
      if (obcc) {
        payload.otherBCC = obcc.split(';').map((s) => s.trim()).filter(Boolean)
      }
      if (dialogMode.value === 'edit' && m.id) {
        payload.id = m.id
        await bulkEmailApi.sendRecordUpdate.post(payload)
      } else {
        await bulkEmailApi.sendRecordCreate.post(payload)
      }
      ElMessage.success(tr('email.opOk'))
      dialogVisible.value = false
      tableRef.value?.refresh()
    } catch {
      ElMessage.error(tr('email.opFail'))
    } finally {
      formSubmitting.value = false
    }
  }

  const actions = computed<UniTableAction[]>(() => [
    { label: tr('email.edit'), onClick: (row) => void openEdit(row as Loose) },
    { label: tr('email.delete'), onClick: (row) => removeRow(row as Loose) },
    { label: tr('email.outbox.sendNow'), onClick: (row) => void sendDraft(row as Loose) }
  ])

  return {
    actions,
    columns,
    dialogMode,
    dialogVisible,
    filters,
    formModel,
    formSubmitting,
    handleLoadSuccess,
    loadData,
    mailGroupOptions,
    mailSenderOptions,
    openAdd,
    queryModel,
    reset,
    search,
    searchConfig,
    submitComposeForm,
    tableRef
  }
}
