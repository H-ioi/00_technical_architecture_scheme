<template>
  <section class="uni-list-page dorm-room-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('dorm.room.pageTitle') }}</h1>
        <p>{{ $t('dorm.room.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'room-add'" type="primary" @click="openForm('add')">
          {{ $t('dorm.room.add') }}
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

    <div v-loading="listLoading" class="dorm-room-page__content">
      <template v-for="floor in visibleFloors" :key="floor.id">
        <div class="dorm-room-page__group-header">
          <h2 class="dorm-room-page__group-title">{{ floorGroupTitle(floor) }}</h2>
          <div class="dorm-room-page__gender-stats">
            <span class="dorm-room-page__female">{{ floor.female_student_count ?? 0 }}</span>
            <span class="dorm-room-page__male">{{ floor.male_student_count ?? 0 }}</span>
          </div>
        </div>

        <div class="dorm-room-page__cards">
          <RoomCard
            v-for="room in floor.room"
            :key="room.id"
            :room="room"
            :floor="floor"
            @status-change="onStatusChange"
            @edit="(row) => openForm('edit', row)"
            @delete="removeRoom"
            @assign="goToAssign" />
        </div>
      </template>

      <el-empty v-if="!listLoading && visibleFloors.length === 0" />
    </div>

    <RoomFormDialog
      v-model:visible="formVisible"
      :mode="formMode"
      :record-id="activeId"
      :school-options="schoolOptions"
      :default-school-id="defaultSchoolId ?? undefined"
      @saved="fetchList" />
  </section>
</template>

<script setup lang="ts">
import RoomCard from './components/room-card.vue'
import RoomFormDialog from './components/form-dialog.vue'
import { genderFilterOpts, searchForm } from './list.config'
import { dormBuildingApi, dormFloorApi, dormRoomApi, membershipApi } from '@/api'
import type { DormBuildingBrief, DormFloorBrief } from '@/types/modules/dorm-building'
import type { DormFloorWithRooms, DormRoomRecord } from '@/types/modules/dorm-room'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUniI18n, toUniOptions, useUniListState } from 'uni-ui-lib'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { locale, t } = useUniI18n()

const initialFilters = {
  schoolId: undefined as string | number | undefined,
  buildingId: undefined as string | number | undefined,
  floorId: undefined as string | number | undefined,
  roomGender: undefined as string | undefined,
  studentNameKeyword: undefined as string | undefined,
  roomNumberKeyword: undefined as string | undefined
}
const { queryModel, filters, search, reset } = useUniListState({ initialFilters })

const schoolRecords = ref<SchoolOptionRecord[]>([])
const buildingFilterRecords = ref<DormBuildingBrief[]>([])
const floorFilterRecords = ref<DormFloorBrief[]>([])
const dataList = ref<DormFloorWithRooms[]>([])
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
  toUniOptions(buildingFilterRecords.value, { labelKeys: ['name'], valueKey: 'id' })
)

const floorFilterOptions = computed(() =>
  toUniOptions(floorFilterRecords.value, { labelKeys: ['name'], valueKey: 'id' })
)

const defaultSchoolId = computed(() => {
  if (schoolRecords.value.length !== 1) {
    return null
  }
  const school = schoolRecords.value[0]
  return school.externId ?? school.id
})

const searchCfg = computed(() =>
  searchForm(
    t,
    schoolOptions.value,
    buildingFilterOptions.value,
    floorFilterOptions.value,
    genderFilterOpts(t),
    defaultSchoolId.value ?? undefined
  )
)

const visibleFloors = computed(() =>
  dataList.value.filter((floor) => (floor.room?.length ?? 0) > 0)
)

const formVisible = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const activeId = ref<string | number | null>(null)

function floorGroupTitle(floor: DormFloorWithRooms) {
  const buildingName = floor.building?.name ?? ''
  const floorName = floor.name ?? ''
  return locale() === 'en' ? `${buildingName},${floorName}` : `${buildingName}栋${floorName}层`
}

async function loadBuildingFilter(schoolId?: string | number) {
  if (schoolId == null || schoolId === '') {
    buildingFilterRecords.value = []
    return
  }
  const raw = await dormBuildingApi.list.get({ schoolId })
  buildingFilterRecords.value = normalizeArray<DormBuildingBrief>(raw)
}

async function loadFloorFilter(buildingId?: string | number) {
  if (buildingId == null || buildingId === '') {
    floorFilterRecords.value = []
    return
  }
  const raw = await dormFloorApi.list.get({ buildingId })
  floorFilterRecords.value = normalizeArray<DormFloorBrief>(raw)
}

const fetchList = async () => {
  listLoading.value = true
  try {
    const result = await dormFloorApi.page.get({
      current: 1,
      size: 999,
      includeRoom: true,
      schoolId: filters.value.schoolId,
      buildingId: filters.value.buildingId,
      floorId: filters.value.floorId,
      roomGender: filters.value.roomGender,
      studentNameKeyword: filters.value.studentNameKeyword,
      roomNumberKeyword: filters.value.roomNumberKeyword
    })
    const { list } = normalizePaged<DormFloorWithRooms>(result)
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
  void loadFloorFilter(filters.value.buildingId)
  void nextTick(() => onSearch())
}

const openForm = (mode: 'add' | 'edit', row?: DormRoomRecord) => {
  formMode.value = mode
  activeId.value = row?.id ?? null
  formVisible.value = true
}

const onStatusChange = async (row: DormRoomRecord) => {
  try {
    if (row.is_active === 1) {
      await dormRoomApi.activate.post({ id: row.id })
    } else {
      await dormRoomApi.deactivate.post({ id: row.id })
    }
    ElMessage.success(t('dorm.room.statusUpdateSuccess'))
    void fetchList()
  } catch {
    ElMessage.error(t('dorm.room.statusUpdateFailed'))
    void fetchList()
  }
}

const removeRoom = async (row: DormRoomRecord) => {
  try {
    await ElMessageBox.confirm(t('dorm.room.confirmDelete'), t('dorm.room.confirmDeleteTitle'), {
      confirmButtonText: t('dorm.common.delete'),
      cancelButtonText: t('dorm.common.cancel'),
      type: 'warning'
    })
  } catch {
    return
  }

  await dormRoomApi.delete.post({ id: row.id })
  ElMessage.success(t('dorm.common.deleteSuccess'))
  void fetchList()
}

function goToAssign(row: DormRoomRecord) {
  void router.push({
    path: `/dorm/space/room-assign/${row.id}`,
    query: {
      gender: String(row.gender ?? ''),
      schoolId: String(row.school_id ?? '')
    }
  })
}

watch(
  () => queryModel.value.schoolId,
  (schoolId) => {
    void loadBuildingFilter(schoolId)
    if (schoolId == null) {
      queryModel.value.buildingId = undefined
      filters.value.buildingId = undefined
      queryModel.value.floorId = undefined
      filters.value.floorId = undefined
    }
  }
)

watch(
  () => queryModel.value.buildingId,
  (buildingId) => {
    void loadFloorFilter(buildingId)
    if (buildingId == null) {
      queryModel.value.floorId = undefined
      filters.value.floorId = undefined
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
.dorm-room-page__content {
  min-height: 120px;
}

.dorm-room-page__group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f2f6fc;
}

.dorm-room-page__group-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.dorm-room-page__gender-stats {
  display: flex;
  gap: 16px;
  font-size: 16px;
}

.dorm-room-page__female {
  color: #e6a0a0;
}

.dorm-room-page__male {
  color: #59b5e5;
}

.dorm-room-page__cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}
</style>
