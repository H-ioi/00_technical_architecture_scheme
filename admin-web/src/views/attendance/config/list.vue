<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('attendance.holidayConfig.pageTitle') }}</h1>
        <p>{{ $t('attendance.holidayConfig.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button type="primary" @click="openAdd">{{ $t('attendance.addConfig') }}</el-button>
      </div>
    </div>

    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('member.search')"
      :reset-text="$t('member.reset')"
      @search="search"
      @reset="reset" />

    <UniDataTable
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="false"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 110, fixed: 'right' }"
      @load-success="tableEmpty.onLoadSuccess"
      @request-error="tableEmpty.onRequestError">
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="reset" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>

    <ConfigFormDialog
      v-model:visible="formVisible"
      :title="formTitle"
      :model-value="formModel"
      :school-options="schoolOptions"
      :department-options="departmentOptions"
      :grade-options="gradeOptions"
      @success="onFormSuccess" />
  </section>
</template>

<script setup lang="ts">
import ConfigFormDialog from './components/config-form-dialog.vue'
import { departmentOptionsForForm, searchForm, tableCols } from './list.config'
import { attendanceHolidayApi, membershipApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { AttendanceHolidaySysConfigRecord } from '@/types/modules/attendance-holiday'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizeArray } from '@/utils/api-response-normalize'
import { ElMessageBox } from 'element-plus'
import { UniDataTable, UniSearchForm, toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { onMounted, computed, ref } from 'vue'

const { locale, t } = useUniI18n()

type Loose = Record<string, unknown>
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

const searchCfg = computed(() => searchForm(t, schoolOptions.value))
const columns = computed(() => tableCols(t))

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
  const list = normalizeArray(raw) as Loose[]
  return { data: list, total: list.length }
}

const openAdd = () => {
  formTitle.value = t('attendance.addConfig')
  formModel.value = { id: '', school: '', grades: [], department: '', email: '' }
  formVisible.value = true
}

const openEdit = (row: AttendanceHolidaySysConfigRecord) => {
  formTitle.value = t('attendance.edit')
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
  ElMessageBox.confirm(t('attendance.holidayConfig.deleteConfirm'), t('common.tip'), {
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
  {
    label: t('attendance.edit'),
    onClick: (row) => openEdit(row as AttendanceHolidaySysConfigRecord)
  },
  {
    label: t('attendance.delete'),
    onClick: (row) => remove(row as AttendanceHolidaySysConfigRecord)
  }
])

const onFormSuccess = () => {
  formVisible.value = false
  tableRef.value?.refresh()
}

const initSchools = async () => {
  schoolRecords.value = await membershipApi.school.get()
}

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })

onMounted(() => {
  initSchools()
})
</script>
