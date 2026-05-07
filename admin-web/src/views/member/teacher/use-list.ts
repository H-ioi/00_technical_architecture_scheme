import { computed, nextTick, onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type {
  Recordable,
  UniOption,
  UniTableAction,
  UniTableRequest,
  UniTableRequestResult
} from 'uni-ui-lib'

import {
  createTeacher,
  deleteTeachers,
  disableTeachers,
  downloadTeacherTemplate,
  enableTeachers,
  exportTeachers,
  fetchTeacherDetail,
  fetchTeacherPage,
  fetchTeacherSchoolOptions,
  importTeachers,
  updateTeacher
} from '@/api'
import { useAppI18n } from '@/composables/use-app-i18n'
import { usePermissionStore } from '@/stores'
import type { TeacherDetail, TeacherRecord } from '@/types/modules/member-teacher'
import { downloadBlob } from '@/utils/download'

import {
  createModuleOptions,
  createRoleOptions,
  createStatusOptions,
  createTeacherColumns,
  createTeacherDetailConfig,
  createTeacherFormConfig,
  createTeacherSearchConfig
} from './list.config'

export const useList = () => {
  const { t } = useAppI18n()
  const permissionStore = usePermissionStore()
  const initialFilters = {
    nickname: '',
    department: '',
    phone: '',
    email: '',
    schoolIds: [],
    modules: [],
    roles: [],
    status: undefined
  }
  const queryModel = ref<Recordable>({ ...initialFilters })
  const filters = ref<Recordable>({ ...queryModel.value })
  const tableRef = ref<{ refresh: () => void } | null>(null)
  const selectedRows = ref<TeacherRecord[]>([])
  const total = ref(0)
  const formVisible = ref(false)
  const detailVisible = ref(false)
  const importVisible = ref(false)
  const formMode = ref<'add' | 'edit'>('add')
  const currentMember = ref<TeacherDetail | null>(null)
  const schoolOptions = ref<UniOption[]>([])

  const moduleOptions = computed(() => createModuleOptions(t))
  const roleOptions = computed(() => createRoleOptions(t))
  const statusOptions = computed(() => createStatusOptions(t))
  const valueEnums = computed<Record<string, UniOption[]>>(() => ({
    school: schoolOptions.value,
    status: statusOptions.value
  }))
  const searchConfig = computed(() =>
    createTeacherSearchConfig(
      t,
      schoolOptions.value,
      moduleOptions.value,
      roleOptions.value,
      statusOptions.value
    )
  )
  const columns = computed(() =>
    createTeacherColumns(t, schoolOptions.value, moduleOptions.value, roleOptions.value)
  )
  const formConfig = computed(() =>
    createTeacherFormConfig(
      t,
      schoolOptions.value,
      moduleOptions.value,
      roleOptions.value,
      statusOptions.value
    )
  )
  const detailConfig = computed(() =>
    createTeacherDetailConfig(
      t,
      schoolOptions.value,
      moduleOptions.value,
      roleOptions.value,
      statusOptions.value
    )
  )
  const selectedIds = computed(() => selectedRows.value.map((item) => item.id))

  const loadMembers: UniTableRequest = ({ pageNo, pageSize, filters }) =>
    fetchTeacherPage({ pageNo, pageSize, ...filters })

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

  const openCreate = () => {
    formMode.value = 'add'
    currentMember.value = null
    formVisible.value = true
  }

  const openEdit = async (row: TeacherRecord) => {
    currentMember.value = await fetchTeacherDetail(row.id)
    formMode.value = 'edit'
    formVisible.value = true
  }

  const openDetail = async (row: TeacherRecord) => {
    currentMember.value = await fetchTeacherDetail(row.id)
    detailVisible.value = true
  }

  const editCurrent = () => {
    if (!currentMember.value) {
      return
    }

    detailVisible.value = false
    formMode.value = 'edit'
    formVisible.value = true
  }

  const saveMember = async (value: Recordable) => {
    if (formMode.value === 'add') {
      await createTeacher(value as unknown as Parameters<typeof createTeacher>[0])
    } else {
      await updateTeacher({
        ...(value as unknown as Parameters<typeof updateTeacher>[0]),
        id: currentMember.value?.id ?? value.id
      })
    }

    ElMessage.success(t('member.messages.saved'))
    formVisible.value = false
    await refreshTable()
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
      () => deleteTeachers(selectedIds.value),
      t('member.messages.deleted')
    )

  const batchEnable = () =>
    confirmBatch(
      t('member.messages.enableConfirm'),
      () => enableTeachers(selectedIds.value),
      t('member.messages.enabled')
    )

  const batchDisable = () =>
    confirmBatch(
      t('member.messages.disableConfirm'),
      () => disableTeachers(selectedIds.value),
      t('member.messages.disabled')
    )

  const exportData = async () => {
    const blob = await exportTeachers(filters.value)

    downloadBlob(blob, 'teachers.txt')
    ElMessage.success(t('member.messages.exported'))
  }

  const submitImport = async (data: FormData) => {
    await importTeachers(data)
    ElMessage.success(t('member.messages.imported'))
    importVisible.value = false
    await refreshTable()
  }

  const downloadTemplate = async () => {
    const blob = await downloadTeacherTemplate()

    downloadBlob(blob, 'teacher-template.txt')
    ElMessage.success(t('member.messages.templateDownloaded'))
  }

  const actions = computed<UniTableAction[]>(() => [
    { label: t('member.actions.detail'), onClick: (row) => openDetail(row as TeacherRecord) },
    {
      label: t('member.actions.edit'),
      type: 'success',
      code: 'teacheruser_edit',
      onClick: (row) => openEdit(row as TeacherRecord)
    }
  ])

  onMounted(async () => {
    const schools = await fetchTeacherSchoolOptions()

    schoolOptions.value = schools.map((item) => ({ label: item.name, value: item.id, type: 'primary' }))
  })

  return {
    actions,
    batchDelete,
    batchDisable,
    batchEnable,
    columns,
    currentMember,
    detailConfig,
    detailVisible,
    downloadTemplate,
    editCurrent,
    exportData,
    filters,
    formConfig,
    formMode,
    formVisible,
    handleLoadSuccess,
    importVisible,
    loadMembers,
    openCreate,
    permissionStore,
    queryModel,
    reset,
    saveMember,
    search,
    searchConfig,
    selectedRows,
    submitImport,
    tableRef,
    total,
    valueEnums
  }
}
