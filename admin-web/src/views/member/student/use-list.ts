import { computed, nextTick, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Recordable, UniOption, UniTableAction, UniTableRequest, UniTableRequestResult } from 'uni-ui-lib'

import {
  deleteStudents,
  disableStudents,
  enableStudents,
  exportStudents,
  fetchStudentPage,
  fetchTeacherSchoolOptions
} from '@/api'
import { useAppI18n } from '@/composables/use-app-i18n'
import type { StudentRecord } from '@/types/modules/member-student'
import { downloadBlob } from '@/utils/download'

import { createStatusOptions, createStudentColumns, createStudentSearchConfig } from './list.config'

export const useList = () => {
  const { t } = useAppI18n()
  const initialFilters = {
    name: '',
    grade: '',
    className: '',
    parentName: '',
    phone: '',
    schoolIds: [],
    status: undefined
  }
  const queryModel = ref<Recordable>({ ...initialFilters })
  const filters = ref<Recordable>({ ...queryModel.value })
  const tableRef = ref<{ refresh: () => void } | null>(null)
  const selectedRows = ref<StudentRecord[]>([])
  const schoolOptions = ref<UniOption[]>([])
  const total = ref(0)

  const statusOptions = computed(() => createStatusOptions(t))
  const valueEnums = computed<Record<string, UniOption[]>>(() => ({
    school: schoolOptions.value,
    status: statusOptions.value
  }))
  const searchConfig = computed(() =>
    createStudentSearchConfig(t, schoolOptions.value, statusOptions.value)
  )
  const columns = computed(() => createStudentColumns(t, schoolOptions.value))
  const selectedIds = computed(() => selectedRows.value.map((item) => item.id))

  const loadStudents: UniTableRequest = ({ pageNo, pageSize, filters }) =>
    fetchStudentPage({ pageNo, pageSize, ...filters })

  const refreshTable = async () => {
    await nextTick()
    tableRef.value?.refresh()
  }

  const search = async (value: Recordable) => {
    filters.value = { ...value }
    await refreshTable()
  }

  const reset = async () => {
    filters.value = { ...initialFilters }
    await refreshTable()
  }

  const handleLoadSuccess = (result: UniTableRequestResult) => {
    total.value = result.total
  }

  const requireSelection = () => {
    if (!selectedIds.value.length) {
      ElMessage.warning(t('member.messages.selectRows'))
      return false
    }

    return true
  }

  const confirmBatch = async (message: string, action: () => Promise<void>, successMessage: string) => {
    if (!requireSelection()) {
      return
    }

    await ElMessageBox.confirm(message)
    await action()
    ElMessage.success(successMessage)
    selectedRows.value = []
    await refreshTable()
  }

  const batchDelete = () =>
    confirmBatch(
      t('member.messages.deleteConfirm'),
      () => deleteStudents(selectedIds.value),
      t('member.messages.deleted')
    )

  const batchEnable = () =>
    confirmBatch(
      t('member.messages.enableConfirm'),
      () => enableStudents(selectedIds.value),
      t('member.messages.enabled')
    )

  const batchDisable = () =>
    confirmBatch(
      t('member.messages.disableConfirm'),
      () => disableStudents(selectedIds.value),
      t('member.messages.disabled')
    )

  const exportData = async () => {
    const blob = await exportStudents(filters.value)

    downloadBlob(blob, 'students.txt')
    ElMessage.success(t('member.messages.exported'))
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('member.actions.detail'),
      onClick: (row) => ElMessage.info(String((row as StudentRecord).name))
    }
  ])

  const loadOptions = async () => {
    const schools = await fetchTeacherSchoolOptions()

    schoolOptions.value = schools.map((item) => ({ label: item.name, value: item.id, type: 'primary' }))
  }

  loadOptions()

  return {
    actions,
    batchDelete,
    batchDisable,
    batchEnable,
    columns,
    exportData,
    filters,
    handleLoadSuccess,
    loadStudents,
    queryModel,
    reset,
    search,
    searchConfig,
    selectedRows,
    tableRef,
    total,
    valueEnums
  }
}
