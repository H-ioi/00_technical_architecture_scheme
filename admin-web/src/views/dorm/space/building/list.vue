<template>
  <section class="uni-list-page dorm-building-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('dorm.building.pageTitle') }}</h1>
        <p>{{ $t('dorm.building.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'building-add'" type="primary" @click="openForm('add')">
          {{ $t('dorm.building.add') }}
        </el-button>
      </div>
    </div>

    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="false"
      :action-min-span="0"
      :submit-text="$t('dorm.common.search')"
      :reset-text="$t('dorm.common.reset')"
      @search="onSearch"
      @reset="onReset" />

    <div v-loading="listLoading" class="dorm-building-page__cards">
      <el-card
        v-for="item in dataList"
        :key="item.id"
        shadow="hover"
        class="dorm-building-page__card">
        <template #header>
          <div class="dorm-building-page__card-header">
            <span class="dorm-building-page__card-title">{{ item.name }}</span>
            <el-switch
              v-model="item.is_active"
              :active-value="1"
              :inactive-value="0"
              active-color="#9CD1A0"
              @change="() => onStatusChange(item)" />
          </div>
        </template>

        <div class="dorm-building-page__card-body">
          <div class="dorm-building-page__row">
            <span>{{ $t('dorm.building.fieldCreatedAt') }}：</span>
            <span>{{ item.created_at || '—' }}</span>
          </div>
          <div class="dorm-building-page__row">
            <span>{{ $t('dorm.building.fieldUpdatedAt') }}：</span>
            <span>{{ item.updated_at || '—' }}</span>
          </div>
          <div class="dorm-building-page__row">
            <span>{{ $t('dorm.building.fieldCampus') }}：</span>
            <span>{{ item.school?.en_name || item.school?.cn_name || '—' }}</span>
          </div>
          <div class="dorm-building-page__row dorm-building-page__row--split">
            <span>
              {{ $t('dorm.building.fieldFloorCount') }}：
              {{ item.floor_count ?? '—' }}{{ floorUnit }}
            </span>
            <span>
              {{ $t('dorm.building.fieldRoomCount') }}：
              {{ item.total_room_count ?? '—' }}{{ roomUnit }}
            </span>
          </div>
          <div class="dorm-building-page__row">
            <span>
              {{ $t('dorm.building.fieldOccupied') }}：
              {{ item.used_room_count ?? '—' }}{{ roomUnit }}
            </span>
          </div>
          <el-progress
            :percentage="occupancyPercent(item)"
            :show-text="false"
            class="dorm-building-page__progress" />
        </div>

        <div class="dorm-building-page__card-footer">
          <el-button
            v-uni-permission="'building-edit'"
            type="warning"
            link
            @click="openForm('edit', item)">
            {{ $t('dorm.common.edit') }}
          </el-button>
          <el-button
            v-uni-permission="'building-delete'"
            type="danger"
            link
            @click="removeBuilding(item)">
            {{ $t('dorm.common.delete') }}
          </el-button>
        </div>
      </el-card>

      <el-empty v-if="!listLoading && dataList.length === 0" />
    </div>

    <div v-if="paginationTotal > 0" class="dorm-building-page__pager">
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="paginationTotal"
        :page-sizes="[10, 20, 50]"
        @current-change="fetchList"
        @size-change="onPageSizeChange" />
    </div>

    <BuildingFormDialog
      v-model:visible="formVisible"
      :mode="formMode"
      :record-id="activeId"
      :school-options="schoolOptions"
      :default-school-id="defaultSchoolId ?? undefined"
      @saved="fetchList" />
  </section>
</template>

<script setup lang="ts">
import BuildingFormDialog from './components/form-dialog.vue'
import { activeFilterOpts, searchForm } from './list.config'
import { dormBuildingApi, membershipApi } from '@/api'
import type { DormBuildingBrief, DormBuildingRecord } from '@/types/modules/dorm-building'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUniI18n, toUniOptions, useUniListState } from 'uni-ui-lib'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const { locale, t } = useUniI18n()

const initialFilters = {
  schoolId: undefined as string | number | undefined,
  buildingId: undefined as string | number | undefined,
  isActive: undefined as string | undefined
}
const { queryModel, filters, search, reset } = useUniListState({ initialFilters })

const schoolRecords = ref<SchoolOptionRecord[]>([])
const buildingFilterRecords = ref<DormBuildingBrief[]>([])
const dataList = ref<DormBuildingRecord[]>([])
const listLoading = ref(false)
const pageNo = ref(1)
const pageSize = ref(10)
const paginationTotal = ref(0)

const schoolOptions = computed(() =>
  toUniOptions(schoolRecords.value, {
    labelKeys: ['enName', 'cnName', 'name'],
    valueKey: 'externId'
  }).map((item, index) => ({
    ...item,
    value: item.value ?? schoolRecords.value[index]?.id
  }))
)

const buildingFilterOptions = computed(() =>
  toUniOptions(buildingFilterRecords.value, {
    labelKeys: ['name'],
    valueKey: 'id'
  })
)

const defaultSchoolId = computed(() => {
  if (schoolRecords.value.length !== 1) {
    return null
  }
  const school = schoolRecords.value[0]
  return school.externId ?? school.id
})

const activeOptions = computed(() => activeFilterOpts(t))
const searchCfg = computed(() =>
  searchForm(
    t,
    schoolOptions.value,
    buildingFilterOptions.value,
    activeOptions.value,
    defaultSchoolId.value ?? undefined
  )
)

const floorUnit = computed(() => (locale() === 'en' ? '' : t('dorm.building.floorUnit')))
const roomUnit = computed(() => (locale() === 'en' ? '' : t('dorm.building.roomUnit')))

const formVisible = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const activeId = ref<string | number | null>(null)

function occupancyPercent(item: DormBuildingRecord) {
  const ratio = Number(item.room_occupancy_ratio ?? 0)
  if (!Number.isFinite(ratio)) {
    return 0
  }
  return Math.min(100, Math.max(0, ratio * 100))
}

async function loadBuildingFilter(schoolId?: string | number) {
  if (schoolId == null || schoolId === '') {
    buildingFilterRecords.value = []
    return
  }
  const raw = await dormBuildingApi.list.get({ schoolId })
  buildingFilterRecords.value = normalizeArray<DormBuildingBrief>(raw)
}

const fetchList = async () => {
  listLoading.value = true
  try {
    const result = await dormBuildingApi.page.get({
      current: pageNo.value,
      size: pageSize.value,
      schoolId: filters.value.schoolId,
      buildingId: filters.value.buildingId,
      isActive: filters.value.isActive
    })
    const { list, total } = normalizePaged<DormBuildingRecord>(result)
    dataList.value = list
    paginationTotal.value = total
  } finally {
    listLoading.value = false
  }
}

const onPageSizeChange = () => {
  pageNo.value = 1
  void fetchList()
}

const onSearch = () => {
  pageNo.value = 1
  search()
  void fetchList()
}

const onReset = () => {
  reset()
  pageNo.value = 1
  if (defaultSchoolId.value != null) {
    queryModel.value.schoolId = defaultSchoolId.value
    filters.value.schoolId = defaultSchoolId.value
  }
  void loadBuildingFilter(filters.value.schoolId)
  void nextTick(() => onSearch())
}

const openForm = (mode: 'add' | 'edit', row?: DormBuildingRecord) => {
  formMode.value = mode
  activeId.value = row?.id ?? null
  formVisible.value = true
}

const onStatusChange = async (row: DormBuildingRecord) => {
  try {
    if (row.is_active === 1) {
      await dormBuildingApi.activate.post({ id: row.id })
    } else {
      await dormBuildingApi.deactivate.post({ id: row.id })
    }
    ElMessage.success(t('dorm.building.statusUpdateSuccess'))
    void fetchList()
  } catch {
    ElMessage.error(t('dorm.building.statusUpdateFailed'))
    void fetchList()
  }
}

const removeBuilding = async (row: DormBuildingRecord) => {
  try {
    await ElMessageBox.confirm(t('dorm.building.confirmDelete'), t('dorm.building.confirmDeleteTitle'), {
      confirmButtonText: t('dorm.common.delete'),
      cancelButtonText: t('dorm.common.cancel'),
      type: 'warning'
    })
  } catch {
    return
  }

  await dormBuildingApi.delete.post({ id: row.id })
  ElMessage.success(t('dorm.common.deleteSuccess'))
  void fetchList()
}

watch(
  () => queryModel.value.schoolId,
  (schoolId) => {
    void loadBuildingFilter(schoolId)
    if (schoolId == null) {
      queryModel.value.buildingId = undefined
      filters.value.buildingId = undefined
    }
  }
)

watch(defaultSchoolId, (schoolId) => {
  if (schoolId != null && queryModel.value.schoolId == null) {
    queryModel.value.schoolId = schoolId
    filters.value.schoolId = schoolId
  }
})

onMounted(async () => {
  const raw = await membershipApi.school.get()
  schoolRecords.value = normalizeArray<SchoolOptionRecord>(raw)

  if (defaultSchoolId.value != null) {
    queryModel.value.schoolId = defaultSchoolId.value
    filters.value.schoolId = defaultSchoolId.value
    await loadBuildingFilter(defaultSchoolId.value)
  }

  void onSearch()
})
</script>

<style scoped lang="scss">
.dorm-building-page__cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  min-height: 120px;
}

.dorm-building-page__card {
  width: calc((100% - 40px) / 3);
  min-width: 300px;
  border-radius: 20px;

  :deep(.el-card__header) {
    padding: 15px 20px;
    border-bottom: 1px solid #f2f6fc;
  }

  :deep(.el-card__body) {
    padding: 0;
  }
}

.dorm-building-page__card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dorm-building-page__card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.dorm-building-page__card-body {
  padding: 20px;
}

.dorm-building-page__row {
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--el-text-color-regular);

  &--split {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }
}

.dorm-building-page__progress {
  margin-top: 8px;

  :deep(.el-progress-bar__inner) {
    background-color: #ba8e62;
  }
}

.dorm-building-page__card-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 10px 20px;
  border-top: 1px solid #f2f6fc;
  background: #fafafa;
  border-radius: 0 0 20px 20px;
}

.dorm-building-page__pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
