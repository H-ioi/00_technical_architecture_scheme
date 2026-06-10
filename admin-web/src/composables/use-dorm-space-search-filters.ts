import { toUniOptions } from 'uni-ui-lib'
import { computed, ref, watch, type Ref } from 'vue'

import { dormBuildingApi, dormFloorApi, dormProjectApi, dormRoomApi } from '@/api'
import type { DormBuildingBrief, DormFloorBrief } from '@/types/modules/dorm-building'
import type { DormProjectBrief, DormRoomRecord } from '@/types/modules/dorm-room'
import { normalizeArray } from '@/utils/api-response-normalize'

type SpaceQuery = {
  schoolId?: string | number
  buildingId?: string | number
  floorId?: string | number
  roomId?: string | number
  projectId?: string | number
}

/** 宿舍空间级联筛选：学校 → 楼栋/属性 → 楼层 → 房间（当前/历史住宿生共用） */
export function useDormSpaceSearchFilters(queryModel: Ref<SpaceQuery>) {
  const buildingFilterRecords = ref<DormBuildingBrief[]>([])
  const floorFilterRecords = ref<DormFloorBrief[]>([])
  const roomFilterRecords = ref<DormRoomRecord[]>([])
  const projectFilterRecords = ref<DormProjectBrief[]>([])

  const buildingFilterOptions = computed(() =>
    toUniOptions(buildingFilterRecords.value, { labelKeys: ['name'], valueKey: 'id' })
  )
  const floorFilterOptions = computed(() =>
    toUniOptions(floorFilterRecords.value, { labelKeys: ['name'], valueKey: 'id' })
  )
  const roomFilterOptions = computed(() =>
    toUniOptions(roomFilterRecords.value, { labelKeys: ['number'], valueKey: 'id' })
  )
  const projectFilterOptions = computed(() =>
    toUniOptions(projectFilterRecords.value, { labelKeys: ['name'], valueKey: 'id' })
  )

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

  async function loadRoomFilter(floorId?: string | number) {
    if (floorId == null || floorId === '') {
      roomFilterRecords.value = []
      return
    }
    const raw = await dormRoomApi.list.get({ floorId })
    roomFilterRecords.value = normalizeArray<DormRoomRecord>(raw)
  }

  async function loadProjectFilter(schoolId?: string | number) {
    if (schoolId == null || schoolId === '') {
      projectFilterRecords.value = []
      return
    }
    const raw = await dormProjectApi.list.get({ schoolId })
    projectFilterRecords.value = normalizeArray<DormProjectBrief>(raw)
  }

  async function loadSchoolCascade(schoolId?: string | number) {
    await Promise.all([loadBuildingFilter(schoolId), loadProjectFilter(schoolId)])
  }

  function bindCascadeWatchers() {
    watch(
      () => queryModel.value.schoolId,
      async (schoolId, prev) => {
        if (schoolId === prev) {
          return
        }
        queryModel.value.buildingId = undefined
        queryModel.value.floorId = undefined
        queryModel.value.roomId = undefined
        queryModel.value.projectId = undefined
        buildingFilterRecords.value = []
        floorFilterRecords.value = []
        roomFilterRecords.value = []
        projectFilterRecords.value = []
        await loadSchoolCascade(schoolId)
      }
    )

    watch(
      () => queryModel.value.buildingId,
      async (buildingId, prev) => {
        if (buildingId === prev) {
          return
        }
        queryModel.value.floorId = undefined
        queryModel.value.roomId = undefined
        floorFilterRecords.value = []
        roomFilterRecords.value = []
        await loadFloorFilter(buildingId)
      }
    )

    watch(
      () => queryModel.value.floorId,
      async (floorId, prev) => {
        if (floorId === prev) {
          return
        }
        queryModel.value.roomId = undefined
        roomFilterRecords.value = []
        await loadRoomFilter(floorId)
      }
    )
  }

  return {
    buildingFilterOptions,
    floorFilterOptions,
    roomFilterOptions,
    projectFilterOptions,
    loadBuildingFilter,
    loadFloorFilter,
    loadRoomFilter,
    loadProjectFilter,
    loadSchoolCascade,
    bindCascadeWatchers
  }
}
