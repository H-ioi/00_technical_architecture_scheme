import type { UniOption, UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { activityProgramApi, membershipApi } from '@/api'
import type { Translate } from '@/types/i18n'
import { normalizePaged } from '@/utils/api-response-normalize'

import {
  canEditProgramRow,
  labelFromOptions,
  programStatusOptionsForRow,
  programTypeOptionsForRow
} from './edit/program-edit-helpers'
import { programStatusOptions, programTypeOptions, searchForm, tableCols } from './list.config'

type Row = Record<string, unknown>

function formatOperateTime(value: unknown, emptyText = '—') {
  if (value == null || value === '') {
    return emptyText
  }
  const d = dayjs(String(value))
  return d.isValid() ? d.format('YYYY-MM-DD HH:mm') : String(value)
}

function useMembershipSchoolOptions() {
  const { locale } = useUniI18n()
  const schoolOptionsRef = ref<UniOption[]>([])

  const loadSchoolOptions = async () => {
    const raw = await membershipApi.school.get()
    const list = Array.isArray(raw) ? raw : []
    schoolOptionsRef.value = toUniOptions(list as Record<string, unknown>[], {
      labelKeys:
        locale.value === 'en' ? ['enName', 'name', 'cnName'] : ['cnName', 'name', 'enName'],
      valueKey: 'id'
    })
  }

  return { schoolOptions: schoolOptionsRef, loadSchoolOptions }
}

export function useActivityProgramList(copyVisible: { value: boolean }) {
  const { t, locale } = useUniI18n()
  const tr = t as Translate
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
      row.operateTime = formatOperateTime(row.operateTime)
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
    router.push({ name: 'ActivityProgramDetail', query: { mode: 'edit' } })
  }

  const actions = computed<UniTableAction[]>(() => [
    { label: tr('activity.lookDetail'), onClick: (row) => goDetail(row as Row, 'view') },
    {
      label: tr('activity.entryEdit'),
      code: 'busdriver_edit',
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
    }
  ])

  const onRowClick = (row: Record<string, unknown>) => {
    goDetail(row as Row, 'view')
  }

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
    onRowClick,
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
