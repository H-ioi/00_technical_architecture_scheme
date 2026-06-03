<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolBus.followTeacher.pageTitle') }}</h1>
        <p>{{ $t('schoolBus.followTeacher.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'teacheruser_export'" @click="exportData">
          {{ $t('schoolBus.export') }}
        </el-button>
        <el-button v-uni-permission="'teacheruser_download'" @click="downloadTemplate">
          {{ $t('schoolBus.downloadTemplate') }}
        </el-button>
        <el-button v-uni-permission="'teacheruser_import'" @click="fileRef?.click()">
          {{ $t('schoolBus.import') }}
        </el-button>
        <el-button v-uni-permission="'teacheruser_add'" type="primary" @click="openForm('add')">
          {{ $t('schoolBus.add') }}
        </el-button>
      </div>
    </div>

    <input
      ref="fileRef"
      type="file"
      accept=".xlsx,.xls"
      class="school-bus-follow-teacher__file"
      @change="onImportFile"
    >

    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('schoolBus.search')"
      :reset-text="$t('schoolBus.reset')"
      @search="search"
      @reset="reset"
    />

    <UniDataTable
      ref="tableRef"
      row-key="id"
      selection
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 110, fixed: 'right' }"
      @selection-change="onSelectionChange"
      @load-success="tableEmpty.onLoadSuccess"
      @request-error="tableEmpty.onRequestError"
    >
      <template #toolbar>
        <!-- 权限标识与旧系统一致，后端为历史拼写 teacheruser_enble -->
        <el-button
          v-uni-permission="'teacheruser_enble'"
          :disabled="ids.length === 0"
          @click="batchEnable"
        >
          {{ $t('schoolBus.followTeacher.enable') }}
        </el-button>
        <el-button
          v-uni-permission="'teacheruser_disable'"
          :disabled="ids.length === 0"
          @click="batchDisable"
        >
          {{ $t('schoolBus.followTeacher.disable') }}
        </el-button>
        <el-button
          v-uni-permission="'teacheruser_del'"
          type="danger"
          :disabled="ids.length === 0"
          @click="del"
        >
          {{ $t('schoolBus.delete') }}
        </el-button>
      </template>
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="reset" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>

    <TeacherForm
      v-model:visible="formVisible"
      :mode="formMode"
      :source="activeRow"
      :default-school-id="defaultSchoolId"
      :school-options="schoolOptions"
      :status-options="statusOptions"
      :multi-school="multiSchool"
      @saved="refreshTable"
    />
  </section>
</template>

<script setup lang="ts">
import TeacherForm from './components/form.vue'
import { searchForm, statusOpts, tableCols } from './list.config'
import { schoolBusFollowTeacherApi, membershipApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { FollowTeacherRecord, FollowTeacherListParams } from '@/types/modules/school-bus-follow-teacher'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'
import { downloadBlob } from '@/utils/download'
import { membershipSchoolLabel, membershipSchoolToOptions } from '@/utils/membership-school'
import { isSpreadsheetFilename } from '@/utils/school-bus'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUniI18n, useUniListState } from 'uni-ui-lib'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { computed, ref, nextTick, onMounted, watch } from 'vue'


const { locale, t } = useUniI18n()

const fileRef = ref<HTMLInputElement | null>(null)


const initialFilters: Record<string, unknown> = {
  keyword: '',
  schoolIds: undefined
}
const { queryModel, filters, tableRef, search, reset, handleLoadSuccess, refreshTable } =
  useUniListState({
  initialFilters
})

const schoolRecords = ref<SchoolOptionRecord[]>([])
const schoolOptions = computed(() => membershipSchoolToOptions(schoolRecords.value, locale()))
const multiSchool = computed(() => schoolRecords.value.length > 1)
const defaultSchoolId = computed(() =>
  schoolRecords.value.length === 1 ? schoolRecords.value[0].id : null
)

const statusOptions = computed(() => statusOpts(t))
const searchCfg = computed(() => searchForm(t, schoolOptions.value, multiSchool.value))
const columns = computed(() => tableCols(t, statusOptions.value))

const formVisible = ref(false)
const formMode = ref<'add' | 'edit' | 'look'>('add')
const activeRow = ref<FollowTeacherRecord | null>(null)

const decorate = (row: FollowTeacherRecord): FollowTeacherRecord => ({
  ...row,
  schoolLabel: membershipSchoolLabel(schoolRecords.value, row.school, locale()),
  lastLoginTime: row.lastLoginTime
    ? dayjs(String(row.lastLoginTime)).format('YYYY-MM-DD HH:mm')
    : '--'
})

const loadData: UniTableRequest = async ({ pageNo: current, pageSize: size, filters: f }) => {
  const raw: FollowTeacherListParams = { current, size, ...f } as FollowTeacherListParams
  if (!multiSchool.value && defaultSchoolId.value != null && raw.schoolIds == null) {
    raw.schoolIds = defaultSchoolId.value
  }
  const result = await schoolBusFollowTeacherApi.page.get(raw)
  const { list, total } = normalizePaged<FollowTeacherRecord>(result)
  return { data: list.map(decorate), total }
}

const openForm = (mode: 'add' | 'edit' | 'look', row?: FollowTeacherRecord) => {
  formMode.value = mode
  activeRow.value = row ?? null
  formVisible.value = true
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('schoolBus.look'),
    onClick: (row) => openForm('look', row as FollowTeacherRecord)
  },
  {
    label: t('schoolBus.edit'),
    code: 'teacheruser_edit',
    onClick: (row) => openForm('edit', row as FollowTeacherRecord)
  }
])

onMounted(async () => {
  const raw = await membershipApi.school.get()
  schoolRecords.value = normalizeArray(raw) as SchoolOptionRecord[]
})

watch(
  () => schoolRecords.value,
  (records) => {
    if (records.length === 1) {
      queryModel.schoolIds = [records[0].id]
    }
    if (records.length > 0) {
      nextTick(() => tableRef.value?.refresh())
    }
  }
)

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })

const IMPORT_MAX_BYTES = 10 * 1024 * 1024
const selection = ref<FollowTeacherRecord[]>([])
const ids = computed(() => selection.value.map((r) => r.id))

const onSelectionChange = (rows: FollowTeacherRecord[]) => {
  selection.value = rows
}

const downloadTemplate = async () => {
  try {
    await schoolBusFollowTeacherApi.template.download()
  } catch {
    /* request 层已提示 */
  }
}

const onImportFile = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) {
    return
  }
  if (!isSpreadsheetFilename(file.name)) {
    ElMessage.warning(t('schoolBus.importInvalidType'))
    return
  }
  if (file.size > IMPORT_MAX_BYTES) {
    ElMessage.warning(t('schoolBus.importTooLarge'))
    return
  }
  try {
    await schoolBusFollowTeacherApi.import.post(file)
    ElMessage.success(t('schoolBus.importSuccess'))
    void refreshTable()
  } catch {
    /* request 层已提示 */
  }
}

const exportData = async () => {
  const raw: Record<string, unknown> = { ...filters.value }
  delete raw.size
  delete raw.current
  try {
    const blob = await schoolBusFollowTeacherApi.export.get(raw)
    downloadBlob(blob, 'follow-teacher-export.xlsx')
    ElMessage.success(t('schoolBus.exportSuccess'))
  } catch {
    /* request 层已提示 */
  }
}

const batchEnable = async () => {
  if (ids.value.length === 0) {
    return
  }
  try {
    await ElMessageBox.confirm(
      t('schoolBus.followTeacher.msgConfirmEnable'),
      t('schoolBus.followTeacher.enable'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  try {
    await schoolBusFollowTeacherApi.enable.post(ids.value)
    ElMessage.success(t('schoolBus.operationSuccess'))
    selection.value = []
    void refreshTable()
  } catch {
    /* request 层已提示 */
  }
}

const batchDisable = async () => {
  if (ids.value.length === 0) {
    return
  }
  try {
    await ElMessageBox.confirm(
      t('schoolBus.followTeacher.msgConfirmDisable'),
      t('schoolBus.followTeacher.disable'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  try {
    await schoolBusFollowTeacherApi.disable.post(ids.value)
    ElMessage.success(t('schoolBus.operationSuccess'))
    selection.value = []
    void refreshTable()
  } catch {
    /* request 层已提示 */
  }
}

const del = async () => {
  if (ids.value.length === 0) {
    return
  }
  try {
    await ElMessageBox.confirm(t('schoolBus.confirmDeleteRows'), t('schoolBus.delete'), {
      type: 'warning'
    })
  } catch {
    return
  }
  try {
    await schoolBusFollowTeacherApi.delete.delete(ids.value)
    ElMessage.success(t('schoolBus.deleteSuccess'))
    selection.value = []
    void refreshTable()
  } catch {
    /* request 层已提示 */
  }
}</script>

<style scoped lang="scss">
.school-bus-follow-teacher {
  &__file {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }
}
</style>
