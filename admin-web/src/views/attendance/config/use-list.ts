import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { ElMessageBox } from 'element-plus'
import { computed, ref } from 'vue'

import {
  departmentOptionsForForm,
  HOLIDAY_CONFIG_GRADE_OPTS,
  holidayConfigColumns,
  holidayConfigSearchForm
} from './list.config'

import { attendanceHolidayApi, membershipApi } from '@/api'
import { normalizeApiArrayBody } from '@/utils/api-response-normalize'
import type { AttendanceHolidaySysConfigRecord } from '@/types/modules/attendance-holiday'
import type { SchoolOptionRecord } from '@/types/modules/membership'

type Loose = Record<string, unknown>

export const useList = () => {
  const { locale, t } = useUniI18n()
  const schoolRecords = ref<SchoolOptionRecord[]>([])

  const { queryModel, filters, tableRef, handleLoadSuccess, reset, search } = useUniListState({
    initialFilters: { school: '' }
  })

  const schoolOptions = computed(() =>
    toUniOptions(schoolRecords.value, {
      labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
      valueKey: 'enName'
    })
  )

  const departmentOptions = computed(() => departmentOptionsForForm(t))

  const searchCfg = computed(() => holidayConfigSearchForm(t, schoolOptions.value))
  const columns = computed(() => holidayConfigColumns(t))

  const formVisible = ref(false)
  const formTitle = ref('')
  const formModel = ref<AttendanceHolidaySysConfigRecord>({
    id: '',
    school: '',
    grades: [],
    department: '',
    email: ''
  })

  const loadData: UniTableRequest = async ({ filters: f }) => {
    const raw = await attendanceHolidayApi.sysConfigList.get({
      school: String((f as Loose).school ?? '')
    })
    const list = normalizeApiArrayBody(raw) as Loose[]
    return { data: list, total: list.length }
  }

  const openAdd = () => {
    formTitle.value = t('attendance.holidayConfig.actions.add')
    formModel.value = { id: '', school: '', grades: [], department: '', email: '' }
    formVisible.value = true
  }

  const openEdit = (row: AttendanceHolidaySysConfigRecord) => {
    formTitle.value = t('attendance.holidayConfig.actions.edit')
    formModel.value = {
      id: row.id ?? '',
      school: row.school ?? '',
      grades: Array.isArray(row.grades) ? [...row.grades] : [],
      department: row.department ?? '',
      email: row.email ?? ''
    }
    formVisible.value = true
  }

  const remove = (row: AttendanceHolidaySysConfigRecord) => {
    if (row.id == null || row.id === '') {
      return
    }
    ElMessageBox.confirm(t('attendance.holidayConfig.messages.deleteConfirm'), t('common.tip'), {
      type: 'warning',
      confirmButtonText: t('common.submit'),
      cancelButtonText: t('common.cancel')
    })
      .then(async () => {
        await attendanceHolidayApi.sysConfigDelete.remove(row.id!)
        tableRef.value?.refresh()
      })
      .catch(() => {})
  }

  const actions = computed<UniTableAction[]>(() => [
    { label: t('attendance.holidayConfig.actions.edit'), onClick: (row) => openEdit(row as AttendanceHolidaySysConfigRecord) },
    { label: t('attendance.holidayConfig.actions.delete'), onClick: (row) => remove(row as AttendanceHolidaySysConfigRecord) }
  ])

  const onFormSuccess = () => {
    formVisible.value = false
    tableRef.value?.refresh()
  }

  const initSchools = async () => {
    schoolRecords.value = await membershipApi.school.get()
  }

  return {
    actions,
    columns,
    departmentOptions,
    filters,
    formModel,
    formTitle,
    formVisible,
    gradeOptions: HOLIDAY_CONFIG_GRADE_OPTS,
    handleLoadSuccess,
    initSchools,
    loadData,
    onFormSuccess,
    openAdd,
    queryModel,
    reset,
    search,
    schoolOptions,
    searchCfg,
    tableRef
  }
}
