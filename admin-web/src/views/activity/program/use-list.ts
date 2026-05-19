import type { UniOption, UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { activityApi, activityProgramApi } from '@/api'
import { useMembershipSchoolOptions } from '@/composables/use-membership-school-options'
import type { Translate } from '@/types/i18n'
import { normalizeEnvelope, normalizePaged } from '@/utils/api-response-normalize'
import { dateFormat } from '@/utils/tool'

import {
  canEditProgramRow,
  labelFromOptions,
  programStatusOptionsForRow,
  programTypeOptionsForRow
} from './edit/program-edit-helpers'
import { programStatusOptions, programTypeOptions, searchForm, tableCols } from './list.config'

type Row = Record<string, unknown>

export function useActivityProgramList(
  copyVisible: { value: boolean },
  options: { activityId?: string | number } = {}
) {
  const { t, locale } = useUniI18n()
  const tr = t as Translate
  const route = useRoute()
  const router = useRouter()

  const { schoolOptions, loadSchoolOptions } = useMembershipSchoolOptions()
  const lockedSchoolId = ref<string | number | undefined>(undefined)

  const statusOpts = computed(() => programStatusOptions(tr))
  const typeOpts = computed(() => programTypeOptions(tr))
  const statusOptsRow = computed(() => programStatusOptionsForRow(tr))
  const typeOptsRow = computed(() => programTypeOptionsForRow(tr))
  const showSchoolFilter = computed(() => schoolOptions.value.length > 1)

  onMounted(async () => {
    await loadSchoolOptions()
    if (schoolOptions.value.length === 1) {
      const v = schoolOptions.value[0]?.value
      if (v != null) {
        lockedSchoolId.value = v as string | number
      }
    }
  })

  const initialFilters = {
    activityId:
      options.activityId != null && options.activityId !== ''
        ? String(options.activityId)
        : route.query.activityId != null && route.query.activityId !== ''
        ? String(route.query.activityId)
        : undefined,
    activityKeyword: '',
    programKeyword: '',
    schoolIds: undefined,
    programStatus: undefined,
    programType: undefined
  } as Record<string, unknown>

  const { queryModel, filters, handleLoadSuccess, reset, search, tableRef } = useUniListState({
    initialFilters
  })

  const searchCfg = computed(() =>
    searchForm(
      tr,
      schoolOptions.value,
      statusOpts.value,
      typeOpts.value,
      showSchoolFilter.value
    )
  )

  const columns = computed(() => tableCols(tr))

  const selectedRows = ref<Row[]>([])
  const selectedIds = computed(
    () =>
      selectedRows.value.map((row) => row.id).filter((id) => id != null) as Array<string | number>
  )

  const decorateRows = (list: Row[]) => {
    const loc = locale.value
    for (const row of list) {
      row.programStatus = row.programStatus == null ? '' : String(row.programStatus)
      row.programType = row.programType == null ? '' : String(row.programType)
      row.programStatusLabel = labelFromOptions(
        row.programStatus,
        statusOptsRow.value,
        loc
      )
      row.programTypeLabel = labelFromOptions(row.programType, typeOptsRow.value, loc)
      row.operateTime = row.operateTime
        ? dateFormat(String(row.operateTime), 'yyyy-MM-dd hh:mm')
        : '—'
    }
  }

  const onSelectionChange = (rows: Record<string, unknown>[]) => {
    selectedRows.value = rows as Row[]
  }

  const loadData: UniTableRequest = async ({
    pageNo: current,
    pageSize: size,
    filters: filterModel
  }) => {
    const f = filterModel as Row
    const raw = await activityProgramApi.page.get({
      current,
      size,
      activityId: f.activityId as string | number | undefined,
      schoolIds: lockedSchoolId.value ?? f.schoolIds ?? undefined,
      activityKeyword: (f.activityKeyword as string) || undefined,
      programKeyword: (f.programKeyword as string) || undefined,
      programStatus: f.programStatus || undefined,
      programType: f.programType || undefined
    })
    const { list, total } = normalizePaged<Row>(raw)
    decorateRows(list)
    return { data: list, total }
  }

  const goDetail = (row: Row, mode: 'view' | 'edit') => {
    if (row.id == null) {
      return
    }
    router.push({ name: 'ActivityProgramDetail', query: { id: String(row.id), mode } })
  }

  const goCreate = () => {
    router.push({
      name: 'ActivityProgramDetail',
      query: {
        mode: 'edit',
        ...(options.activityId != null && options.activityId !== ''
          ? { activityId: String(options.activityId) }
          : {})
      }
    })
  }

  const isActivityEnded = async (row: Row) => {
    if (row.activityStatus != null && row.activityStatus !== '') {
      return String(row.activityStatus) === '3'
    }
    if (row.activityId == null || row.activityId === '') {
      return false
    }
    try {
      const raw = await activityApi.detail.get(row.activityId as string | number)
      const detail = normalizeEnvelope(raw) as Row

      return String(detail.activityStatus ?? '') === '3'
    } catch {
      ElMessage.error(tr('activity.loadDetailFail'))
      return true
    }
  }

  const changeProgramStatus = async (row: Row, startFlag: boolean) => {
    if (row.id == null) {
      return
    }
    if (await isActivityEnded(row)) {
      ElMessage.warning(tr('activity.programActivityEndedNoStatus'))
      return
    }
    try {
      await ElMessageBox.confirm(
        startFlag ? tr('activity.confirmStartProgram') : tr('activity.confirmEndProgram'),
        tr('common.tip'),
        { type: 'warning' }
      )
    } catch {
      return
    }
    try {
      await activityProgramApi.editStatus.post({
        id: row.id as string | number,
        startFlag
      })
      ElMessage.success(tr('activity.saveOk'))
      tableRef.value?.refresh()
    } catch {
      ElMessage.error(tr('activity.saveFail'))
    }
  }

  const actions = computed<UniTableAction[]>(() => [
    { label: tr('activity.lookDetail'), onClick: (row) => goDetail(row as Row, 'view') },
    {
      label: tr('activity.entryEdit'),
      code: 'busdriver_edit',
      visible: (row) => canEditProgramRow(row as Row),
      onClick: (row) => {
        const r = row as Row
        if (!canEditProgramRow(r)) {
          ElMessage.warning(tr('activity.programEditLimited'))
          return
        }
        goDetail(
          r,
          'edit'
        )
      }
    },
    {
      label: tr('activity.programStart'),
      code: 'busdriver_edit',
      visible: (row) => String((row as Row).programStatus ?? '') === '0',
      onClick: (row) => void changeProgramStatus(row as Row, true)
    },
    {
      label: tr('activity.programEnd'),
      code: 'busdriver_edit',
      visible: (row) => String((row as Row).programStatus ?? '') === '1',
      onClick: (row) => void changeProgramStatus(row as Row, false)
    }
  ])

  const deleteBatch = async () => {
    if (!selectedIds.value.length) {
      ElMessage.warning(tr('activity.programSelRows'))
      return
    }
    try {
      await ElMessageBox.confirm(tr('activity.confirmDeletePrograms'), tr('common.tip'), {
        type: 'warning'
      })
    } catch {
      return
    }
    try {
      await activityProgramApi.remove.delete(selectedIds.value)
      ElMessage.success(tr('activity.deleteOk'))
      tableRef.value?.refresh()
    } catch {
      ElMessage.error(tr('activity.saveFail'))
    }
  }

  const openCopy = () => {
    if (!selectedIds.value.length) {
      ElMessage.warning(tr('activity.programSelRows'))
      return
    }
    copyVisible.value = true
  }

  return {
    actions,
    columns,
    deleteBatch,
    filters,
    goCreate,
    handleLoadSuccess,
    loadData,
    lockedSchoolId,
    onSelectionChange,
    openCopy,
    queryModel,
    reset,
    search,
    searchCfg,
    selectedIds,
    selectedRows,
    tableRef
  }
}
