<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('schoolBus.routePlan.page.title') }}</h1>
        <p>{{ $t('schoolBus.routePlan.page.description') }}</p>
      </div>
      <div v-if="activeTab === 'routes'" class="school-bus-route-plan__actions">
        <el-button v-uni-permission="'busline_import'" @click="downloadRouteTemplate">
          {{ $t('schoolBus.routePlan.actions.downloadRouteTemplate') }}
        </el-button>
        <el-button v-uni-permission="'busline_import'" @click="pickRouteImport">
          {{ $t('schoolBus.routePlan.actions.importRoute') }}
        </el-button>
        <el-button v-uni-permission="'busline_add'" type="primary" @click="openRouteForm">
          {{ $t('schoolBus.routePlan.actions.addRoute') }}
        </el-button>
      </div>
      <div v-else-if="activeTab === 'term'" class="school-bus-route-plan__actions">
        <el-button v-uni-permission="'bussection_add'" type="primary" @click="openTermAdd">
          {{ $t('schoolBus.routePlan.actions.addTerm') }}
        </el-button>
      </div>
      <div v-else-if="activeTab === 'station'" class="school-bus-route-plan__actions">
        <el-button v-uni-permission="'busstation_import'" @click="downloadStationTemplate">
          {{ $t('schoolBus.routePlan.actions.downloadStationTemplate') }}
        </el-button>
        <el-button v-uni-permission="'busstation_import'" @click="pickStationImport">
          {{ $t('schoolBus.routePlan.actions.importStation') }}
        </el-button>
        <el-button v-uni-permission="'busstation_add'" type="primary" @click="openStationAdd">
          {{ $t('schoolBus.routePlan.actions.addStation') }}
        </el-button>
      </div>
    </div>

    <input
      ref="routeFileRef"
      type="file"
      accept=".xlsx,.xls"
      class="school-bus-route-plan__file"
      @change="onRouteImportFile" />
    <input
      ref="stationFileRef"
      type="file"
      accept=".xlsx,.xls"
      class="school-bus-route-plan__file"
      @change="onStationImportFile" />

    <el-tabs v-model="activeTab" class="school-bus-route-plan__tabs">
      <el-tab-pane :label="$t('schoolBus.routePlan.tabs.routes')" name="routes">
        <UniSearchForm
          v-model="routeQueryModel"
          :config="routeSearchConfig"
          :collapsed="true"
          :collapsed-rows="1"
          :action-min-span="0"
          :submit-text="$t('schoolBus.driver.actions.search')"
          :reset-text="$t('schoolBus.driver.actions.reset')"
          @search="searchRoutes"
          @reset="resetRouteSearch" />
        <UniDataTable
          ref="routesTableRef"
          row-key="id"
          selection
          :columns="routeColumns"
          :request="loadRoutes"
          :filters="routeFilters"
          :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
          :toolbar="{ refresh: true, density: true, columnSetting: true }"
          :actions="routeActions"
          :action-column="{ width: 120, fixed: 'right' }"
          @selection-change="onRouteSelectionChange"
          @load-success="handleRouteLoadSuccess">
          <template #toolbar>
            <el-button
              v-uni-permission="ROUTE_LINE_COPY_PERMISSIONS"
              :disabled="routeSelectedIds.length === 0"
              @click="copySelected">
              {{ $t('schoolBus.routePlan.actions.copyRoute') }}
            </el-button>
            <el-button
              v-uni-permission="'busline_del'"
              type="danger"
              :disabled="routeSelectedIds.length === 0"
              @click="deleteSelected">
              {{ $t('schoolBus.driver.actions.delete') }}
            </el-button>
          </template>
        </UniDataTable>
      </el-tab-pane>
      <el-tab-pane :label="$t('schoolBus.routePlan.tabs.term')" name="term">
        <UniSearchForm
          v-model="termQueryModel"
          :config="termSearchConfig"
          :collapsed="true"
          :collapsed-rows="1"
          :action-min-span="0"
          :submit-text="$t('schoolBus.driver.actions.search')"
          :reset-text="$t('schoolBus.driver.actions.reset')"
          @search="searchTerms"
          @reset="resetTermSearch" />
        <UniDataTable
          ref="termTableRef"
          row-key="id"
          selection
          :columns="termColumns"
          :request="loadTerms"
          :filters="termFilters"
          :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
          :toolbar="{ refresh: true, density: true, columnSetting: true }"
          :actions="termActions"
          :action-column="{ width: 120, fixed: 'right' }"
          @selection-change="onTermSelectionChange"
          @load-success="handleTermLoadSuccess">
          <template #toolbar>
            <el-button
              v-uni-permission="'bussection_del'"
              type="danger"
              :disabled="termSelectedIds.length === 0"
              @click="deleteTermsSelected">
              {{ $t('schoolBus.driver.actions.delete') }}
            </el-button>
          </template>
        </UniDataTable>
      </el-tab-pane>
      <el-tab-pane :label="$t('schoolBus.routePlan.tabs.station')" name="station">
        <UniSearchForm
          v-model="stationQueryModel"
          :config="stationSearchConfig"
          :collapsed="true"
          :collapsed-rows="1"
          :action-min-span="0"
          :submit-text="$t('schoolBus.driver.actions.search')"
          :reset-text="$t('schoolBus.driver.actions.reset')"
          @search="searchStations"
          @reset="resetStationSearch" />
        <UniDataTable
          ref="stationTableRef"
          row-key="id"
          selection
          :columns="stationColumns"
          :request="loadStations"
          :filters="stationFilters"
          :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
          :toolbar="{ refresh: true, density: true, columnSetting: true }"
          :actions="stationActions"
          :action-column="{ width: 120, fixed: 'right' }"
          @selection-change="onStationSelectionChange"
          @load-success="handleStationLoadSuccess">
          <template #toolbar>
            <el-button
              v-uni-permission="'busstation_del'"
              type="danger"
              :disabled="stationSelectedIds.length === 0"
              @click="deleteStationsSelected">
              {{ $t('schoolBus.driver.actions.delete') }}
            </el-button>
          </template>
        </UniDataTable>
      </el-tab-pane>
    </el-tabs>

    <RouteFormModal
      ref="routeFormRef"
      :school-records="schoolRecords"
      :locale="locale()"
      @saved="refreshRoutes" />

    <TermFormDialog
      v-model="termFormVisible"
      :editing-id="termEditingId"
      :school-records="schoolRecords"
      :default-school-id="defaultSchoolId"
      :multi-school="multiSchool"
      @saved="refreshTerms" />

    <StationFormDialog
      v-model="stationFormVisible"
      :editing-id="stationEditingId"
      :school-records="schoolRecords"
      :default-school-id="defaultSchoolId"
      :multi-school="multiSchool"
      @saved="refreshStations" />

    <el-dialog v-model="detailVisible" width="900px" :title="$t('schoolBus.driver.actions.look')">
      <el-descriptions v-if="detailRecord" :column="2" border>
        <el-descriptions-item
          v-for="col in routeColumns"
          :key="String(col.prop)"
          :label="col.label">
          {{ routeDetailRowText(col.prop) }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog
      v-model="termDetailVisible"
      width="900px"
      :title="$t('schoolBus.driver.actions.look')">
      <el-descriptions v-if="termDetailRecord" :column="2" border>
        <el-descriptions-item v-for="col in termColumns" :key="String(col.prop)" :label="col.label">
          {{ termDetailRowText(col.prop) }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog
      v-model="stationDetailVisible"
      width="900px"
      :title="$t('schoolBus.driver.actions.look')">
      <el-descriptions v-if="stationDetailRecord" :column="2" border>
        <el-descriptions-item
          v-for="col in stationColumns"
          :key="String(col.prop)"
          :label="col.label">
          {{ stationDetailRowText(col.prop) }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { UniTableColumn } from 'uni-ui-lib'
import { UniDataTable, UniSearchForm, useUniI18n } from 'uni-ui-lib'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

import { membershipApi, schoolBusLineApi, schoolBusStationApi } from '@/api'
import type { SchoolOptionRecord } from '@/types/modules/membership'

import RouteFormModal from './components/route-form-modal.vue'
import StationFormDialog from './components/station-form-dialog.vue'
import TermFormDialog from './components/term-form-dialog.vue'
import { useRouteLines } from './use-route-lines'
import { useStationSection } from './use-station-section'
import { useTermSection } from './use-term-section'

type Loose = Record<string, unknown>

const pickSchoolRecords = (payload: unknown): SchoolOptionRecord[] => {
  if (Array.isArray(payload)) {
    return payload as SchoolOptionRecord[]
  }

  if (payload && typeof payload === 'object') {
    const data = (payload as Loose).data

    if (Array.isArray(data)) {
      return data as SchoolOptionRecord[]
    }
  }

  return []
}

const { locale, t } = useUniI18n()

const activeTab = ref('routes')

const routeFileRef = ref<HTMLInputElement | null>(null)
const stationFileRef = ref<HTMLInputElement | null>(null)

const schoolRecords = ref<SchoolOptionRecord[]>([])
const defaultSchoolId = computed(() =>
  schoolRecords.value.length === 1 ? schoolRecords.value[0].id : null
)
const multiSchool = computed(() => schoolRecords.value.length > 1)

const routeFormRef = ref<InstanceType<typeof RouteFormModal> | null>(null)

/** 复制路线：与后端 `batchCopy` 可对齐的常见码；含 `busline_add`（与新增同源）避免按钮不展示 */
const ROUTE_LINE_COPY_PERMISSIONS = [
  'busline_add',
  'busline_batchCopy',
  'busline_batchcopy',
  'busline_copy'
]

const {
  actions: routeActions,
  columns: routeColumns,
  detailRecord,
  detailVisible,
  filters: routeFilters,
  handleLoadSuccess: handleRouteLoadSuccess,
  loadRoutes,
  onSelectionChange: onRouteSelectionChange,
  queryModel: routeQueryModel,
  reset: resetRouteSearch,
  search: searchRoutes,
  searchConfig: routeSearchConfig,
  selectedIds: routeSelectedIds,
  tableRef: routesTableRef,
  copySelected,
  deleteSelected
} = useRouteLines(routeFormRef, schoolRecords)

const {
  actions: termActions,
  columns: termColumns,
  deleteTermsSelected,
  filters: termFilters,
  handleLoadSuccess: handleTermLoadSuccess,
  loadTerms,
  onSelectionChange: onTermSelectionChange,
  openTermAdd,
  queryModel: termQueryModel,
  reset: resetTermSearch,
  search: searchTerms,
  searchConfig: termSearchConfig,
  selectedIds: termSelectedIds,
  tableRef: termTableRef,
  termDetailRecord,
  termDetailVisible,
  termEditingId,
  termFormVisible
} = useTermSection(schoolRecords)

const {
  actions: stationActions,
  columns: stationColumns,
  deleteStationsSelected,
  filters: stationFilters,
  handleLoadSuccess: handleStationLoadSuccess,
  loadStations,
  onSelectionChange: onStationSelectionChange,
  openStationAdd,
  queryModel: stationQueryModel,
  reset: resetStationSearch,
  search: searchStations,
  searchConfig: stationSearchConfig,
  selectedIds: stationSelectedIds,
  tableRef: stationTableRef,
  stationDetailRecord,
  stationDetailVisible,
  stationEditingId,
  stationFormVisible
} = useStationSection(schoolRecords)

const routeDetailRowText = (prop: UniTableColumn['prop']) => {
  if (!detailRecord.value || prop == null) {
    return ''
  }

  const val = (detailRecord.value as Record<string, unknown>)[String(prop)]

  return val == null || val === '' ? '--' : String(val)
}

const termDetailRowText = (prop: UniTableColumn['prop']) => {
  if (!termDetailRecord.value || prop == null) {
    return ''
  }

  const val = (termDetailRecord.value as Record<string, unknown>)[String(prop)]

  return val == null || val === '' ? '--' : String(val)
}

const stationDetailRowText = (prop: UniTableColumn['prop']) => {
  if (!stationDetailRecord.value || prop == null) {
    return ''
  }

  const val = (stationDetailRecord.value as Record<string, unknown>)[String(prop)]

  return val == null || val === '' ? '--' : String(val)
}

onMounted(async () => {
  const raw = await membershipApi.school.get()
  schoolRecords.value = pickSchoolRecords(raw)
})

watch(
  () => schoolRecords.value.length,
  (n) => {
    if (n === 0) {
      return
    }

    nextTick(() => {
      routesTableRef.value?.refresh()
      termTableRef.value?.refresh()
      stationTableRef.value?.refresh()
    })
  }
)

const refreshRoutes = () => {
  routesTableRef.value?.refresh()
}

const refreshTerms = () => {
  termTableRef.value?.refresh()
}

const refreshStations = () => {
  stationTableRef.value?.refresh()
}

const openRouteForm = () => {
  routeFormRef.value?.showForm('add')
}

const downloadRouteTemplate = async () => {
  await schoolBusLineApi.template.download()
}

const pickRouteImport = () => {
  routeFileRef.value?.click()
}

const downloadStationTemplate = async () => {
  await schoolBusStationApi.template.download()
}

const pickStationImport = () => {
  stationFileRef.value?.click()
}

const IMPORT_MAX_BYTES = 10 * 1024 * 1024

const isSpreadsheetFilename = (name: string) => {
  const lower = name.toLowerCase()

  return lower.endsWith('.xls') || lower.endsWith('.xlsx')
}

const onRouteImportFile = async (e: Event) => {
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
    await schoolBusLineApi.import.post(file)
    ElMessage.success(t('schoolBus.driver.messages.importSuccess'))
    refreshRoutes()
  } catch {
    /* request 层已提示 */
  }
}

const onStationImportFile = async (e: Event) => {
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
    await schoolBusStationApi.import.post(file)
    ElMessage.success(t('schoolBus.driver.messages.importSuccess'))
    refreshStations()
  } catch {
    /* request 层已提示 */
  }
}
</script>

<style scoped lang="scss">
.school-bus-route-plan__tabs {
  margin-top: 8px;
}

.school-bus-route-plan__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.school-bus-route-plan__file {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}
</style>
