<template>
  <section class="uni-list-page dorm-floor-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('dorm.floor.pageTitle') }}</h1>
        <p>{{ $t('dorm.floor.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'floor-add'" type="primary" @click="openForm('add')">
          {{ $t('dorm.floor.add') }}
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

    <div v-loading="listLoading" class="dorm-floor-page__content">
      <template v-for="building in visibleBuildings" :key="building.id">
        <div class="dorm-floor-page__group-header">
          <h2 class="dorm-floor-page__group-title">{{ building.name }}</h2>
          <div class="dorm-floor-page__gender-stats">
            <span class="dorm-floor-page__female">{{ building.female_student_count ?? 0 }}</span>
            <span class="dorm-floor-page__male">{{ building.male_student_count ?? 0 }}</span>
          </div>
        </div>

        <div class="dorm-floor-page__cards">
          <el-card
            v-for="floor in building.floor"
            :key="floor.id"
            shadow="hover"
            class="dorm-floor-page__card">
            <template #header>
              <div class="dorm-floor-page__card-header">
                <span class="dorm-floor-page__card-title">{{ floor.name }}</span>
                <el-switch
                  v-model="floor.is_active"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#9CD1A0"
                  @change="() => onStatusChange(floor)" />
              </div>
            </template>

            <div class="dorm-floor-page__card-body">
              <div class="dorm-floor-page__row dorm-floor-page__row--split">
                <span>{{ $t('dorm.floor.fieldCreatedAt') }}：{{ floor.created_at || '—' }}</span>
                <span>{{ $t('dorm.floor.fieldUpdatedAt') }}：{{ floor.updated_at || '—' }}</span>
              </div>
              <div class="dorm-floor-page__row">
                <span>{{ $t('dorm.floor.fieldCampus') }}：</span>
                <span>{{ building.school?.en_name || building.school?.cn_name || '—' }}</span>
              </div>
              <div class="dorm-floor-page__row dorm-floor-page__row--split">
                <span>
                  {{ $t('dorm.floor.fieldRoomCount') }}：
                  {{ floor.total_room_count ?? '—' }}{{ roomUnit }}
                </span>
                <span>
                  {{ $t('dorm.floor.fieldBedCount') }}：
                  {{ floor.total_bed_count ?? '—' }}{{ bedUnit }}
                </span>
              </div>
              <div class="dorm-floor-page__row">
                <span>
                  {{ $t('dorm.floor.fieldOccupied') }}：
                  {{ floor.used_bed_count ?? '—' }}{{ bedUnit }}
                </span>
              </div>
              <el-progress
                :percentage="bedOccupancyPercent(floor)"
                :show-text="false"
                class="dorm-floor-page__progress" />
            </div>

            <div class="dorm-floor-page__card-footer">
              <el-button
                v-uni-permission="'floor-edit'"
                type="warning"
                link
                @click="openForm('edit', floor)">
                {{ $t('dorm.common.edit') }}
              </el-button>
              <el-button
                v-uni-permission="'floor-delete'"
                type="danger"
                link
                @click="removeFloor(floor)">
                {{ $t('dorm.common.delete') }}
              </el-button>
            </div>
          </el-card>
        </div>
      </template>

      <el-empty v-if="!listLoading && visibleBuildings.length === 0" />
    </div>

    <FloorFormDialog
      v-model:visible="formVisible"
      :mode="formMode"
      :record-id="activeId"
      :school-options="schoolOptions"
      :default-school-id="defaultSchoolId ?? undefined"
      @saved="fetchList" />
  </section>
</template>

<script setup lang="ts">
import FloorFormDialog from './components/form-dialog.vue'
import { activeFilterOpts, searchForm } from './list.config'
import { dormBuildingApi, dormFloorApi, membershipApi } from '@/api'
import type { DormBuildingBrief, DormBuildingWithFloors, DormFloorRecord } from '@/types/modules/dorm-building'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUniI18n, toUniOptions, useUniListState } from 'uni-ui-lib'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const { locale, t } = useUniI18n()

const initialFilters = {
  schoolId: undefined as string | number | undefined,
  buildingId: undefined as string | number | undefined,
  floorIsActive: undefined as string | undefined
}
const { queryModel, filters, search, reset } = useUniListState({ initialFilters })

const schoolRecords = ref<SchoolOptionRecord[]>([])
const buildingFilterRecords = ref<DormBuildingBrief[]>([])
const dataList = ref<DormBuildingWithFloors[]>([])
const listLoading = ref(false)

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

const roomUnit = computed(() => (locale() === 'en' ? '' : t('dorm.floor.roomUnit')))
const bedUnit = computed(() => (locale() === 'en' ? '' : t('dorm.floor.bedUnit')))

const visibleBuildings = computed(() =>
  dataList.value.filter((building) => (building.floor?.length ?? 0) > 0)
)

const formVisible = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const activeId = ref<string | number | null>(null)

function bedOccupancyPercent(floor: DormFloorRecord) {
  const ratio = Number(floor.bed_occupancy_ratio ?? 0)
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
      current: 1,
      size: 9999,
      includeFloor: true,
      schoolId: filters.value.schoolId,
      buildingId: filters.value.buildingId,
      floorIsActive: filters.value.floorIsActive
    })
    const { list } = normalizePaged<DormBuildingWithFloors>(result)
    dataList.value = list
  } finally {
    listLoading.value = false
  }
}

const onSearch = () => {
  search()
  void fetchList()
}

const onReset = () => {
  reset()
  if (defaultSchoolId.value != null) {
    queryModel.value.schoolId = defaultSchoolId.value
    filters.value.schoolId = defaultSchoolId.value
  }
  void loadBuildingFilter(filters.value.schoolId)
  void nextTick(() => onSearch())
}

const openForm = (mode: 'add' | 'edit', row?: DormFloorRecord) => {
  formMode.value = mode
  activeId.value = row?.id ?? null
  formVisible.value = true
}

const onStatusChange = async (row: DormFloorRecord) => {
  try {
    if (row.is_active === 1) {
      await dormFloorApi.activate.post({ id: row.id })
    } else {
      await dormFloorApi.deactivate.post({ id: row.id })
    }
    ElMessage.success(t('dorm.floor.statusUpdateSuccess'))
    void fetchList()
  } catch {
    ElMessage.error(t('dorm.floor.statusUpdateFailed'))
    void fetchList()
  }
}

const removeFloor = async (row: DormFloorRecord) => {
  try {
    await ElMessageBox.confirm(t('dorm.floor.confirmDelete'), t('dorm.floor.confirmDeleteTitle'), {
      confirmButtonText: t('dorm.common.delete'),
      cancelButtonText: t('dorm.common.cancel'),
      type: 'warning'
    })
  } catch {
    return
  }

  await dormFloorApi.delete.post({ id: row.id })
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

  void fetchList()
})
</script>

<style scoped lang="scss">
.dorm-floor-page__content {
  min-height: 120px;
}

.dorm-floor-page__group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f2f6fc;
}

.dorm-floor-page__group-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.dorm-floor-page__gender-stats {
  display: flex;
  gap: 16px;
  font-size: 16px;
  font-weight: 400;
}

.dorm-floor-page__female {
  color: #e05e9e;
}

.dorm-floor-page__male {
  color: #59b5e5;
}

.dorm-floor-page__cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 8px;
}

.dorm-floor-page__card {
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

.dorm-floor-page__card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dorm-floor-page__card-title {
  font-size: 16px;
  font-weight: 600;
}

.dorm-floor-page__card-body {
  padding: 20px;
}

.dorm-floor-page__row {
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--el-text-color-regular);

  &--split {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }
}

.dorm-floor-page__progress {
  margin-top: 8px;

  :deep(.el-progress-bar__inner) {
    background-color: #ba8e62;
  }
}

.dorm-floor-page__card-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 10px 20px;
  border-top: 1px solid #f2f6fc;
  background: #fafafa;
  border-radius: 0 0 20px 20px;
}
</style>
