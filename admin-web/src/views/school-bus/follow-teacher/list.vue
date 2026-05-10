<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolBus.followTeacher.page.title') }}</h1>
        <p>{{ $t('schoolBus.followTeacher.page.description') }}</p>
      </div>
      <div class="school-bus-follow-teacher__actions">
        <el-button v-uni-permission="'teacheruser_export'" @click="exportData">
          {{ $t('schoolBus.driver.actions.export') }}
        </el-button>
        <el-button v-uni-permission="'teacheruser_download'" @click="downloadTemplate">
          {{ $t('schoolBus.driver.actions.downloadTemplate') }}
        </el-button>
        <el-button v-uni-permission="'teacheruser_import'" @click="pickImport">
          {{ $t('schoolBus.driver.actions.import') }}
        </el-button>
        <el-button v-uni-permission="'teacheruser_add'" type="primary" @click="openForm('add')">
          {{ $t('schoolBus.driver.actions.add') }}
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
      :config="searchConfig"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('schoolBus.driver.actions.search')"
      :reset-text="$t('schoolBus.driver.actions.reset')"
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
      :action-column="{ width: 140, fixed: 'right' }"
      @selection-change="onSelectionChange"
      @load-success="handleLoadSuccess"
    >
      <template #toolbar>
        <!-- 权限标识与旧系统一致，后端为历史拼写 teacheruser_enble -->
        <el-button
          v-uni-permission="'teacheruser_enble'"
          :disabled="ids.length === 0"
          @click="batchEnable"
        >
          {{ $t('schoolBus.followTeacher.actions.enable') }}
        </el-button>
        <el-button
          v-uni-permission="'teacheruser_disable'"
          :disabled="ids.length === 0"
          @click="batchDisable"
        >
          {{ $t('schoolBus.followTeacher.actions.disable') }}
        </el-button>
        <el-button
          v-uni-permission="'teacheruser_del'"
          type="danger"
          :disabled="ids.length === 0"
          @click="del"
        >
          {{ $t('schoolBus.driver.actions.delete') }}
        </el-button>
      </template>
    </UniDataTable>

    <TeacherForm
      v-model:visible="formVisible"
      :mode="formMode"
      :source="currentRecord"
      :default-school-id="defaultSchoolId"
      :school-options="schoolOptions"
      :status-options="statusOptions"
      :multi-school="multiSchool"
      @saved="reload"
    />
  </section>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import TeacherForm from './components/form.vue'
import { useList } from './use-list'

import { schoolBusFollowTeacherApi } from '@/api'
import type { FollowTeacherRecord } from '@/types/modules/school-bus-follow-teacher'
import { downloadBlob } from '@/utils/download'

const { t } = useUniI18n()
const fileRef = ref<HTMLInputElement | null>(null)

const {
  actions,
  columns,
  currentRecord,
  defaultSchoolId,
  filters,
  formMode,
  formVisible,
  handleLoadSuccess,
  loadData,
  multiSchool,
  openForm,
  queryModel,
  reset,
  schoolOptions,
  search,
  searchConfig,
  statusOptions,
  tableRef
} = useList()

const IMPORT_MAX_BYTES = 10 * 1024 * 1024
const picked = ref<FollowTeacherRecord[]>([])
const ids = computed(() => picked.value.map((r) => r.id))

const reload = () => tableRef.value?.refresh()

const onSelectionChange = (rows: FollowTeacherRecord[]) => {
  picked.value = rows
}

const downloadTemplate = async () => {
  try {
    await schoolBusFollowTeacherApi.template.download()
  } catch {
    /* request 层已提示 */
  }
}

const pickImport = () => fileRef.value?.click()

const isSpreadsheetFilename = (name: string) => {
  const lower = name.toLowerCase()
  return lower.endsWith('.xls') || lower.endsWith('.xlsx')
}

const onImportFile = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) {
    return
  }
  if (!isSpreadsheetFilename(file.name)) {
    ElMessage.warning(t('schoolBus.driver.messages.importInvalidType'))
    return
  }
  if (file.size > IMPORT_MAX_BYTES) {
    ElMessage.warning(t('schoolBus.driver.messages.importTooLarge'))
    return
  }
  try {
    await schoolBusFollowTeacherApi.import.post(file)
    ElMessage.success(t('schoolBus.driver.messages.importSuccess'))
    reload()
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
    ElMessage.success(t('schoolBus.studentOrder.messages.exportSuccess'))
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
      t('schoolBus.followTeacher.messages.confirmEnable'),
      t('schoolBus.followTeacher.actions.enable'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  try {
    await schoolBusFollowTeacherApi.enable.post(ids.value)
    ElMessage.success(t('schoolBus.studentApply.messages.success'))
    picked.value = []
    reload()
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
      t('schoolBus.followTeacher.messages.confirmDisable'),
      t('schoolBus.followTeacher.actions.disable'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  try {
    await schoolBusFollowTeacherApi.disable.post(ids.value)
    ElMessage.success(t('schoolBus.studentApply.messages.success'))
    picked.value = []
    reload()
  } catch {
    /* request 层已提示 */
  }
}

const del = async () => {
  if (ids.value.length === 0) {
    return
  }
  try {
    await ElMessageBox.confirm(
      t('schoolBus.followTeacher.messages.confirmDelete'),
      t('schoolBus.driver.actions.delete'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  try {
    await schoolBusFollowTeacherApi.delete.delete(ids.value)
    ElMessage.success(t('schoolBus.driver.messages.deleteSuccess'))
    picked.value = []
    reload()
  } catch {
    /* request 层已提示 */
  }
}
</script>

<style scoped lang="scss">
.school-bus-follow-teacher__actions {
  display: flex;
  flex-wrap: wrap;
}

.school-bus-follow-teacher__file {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}
</style>
