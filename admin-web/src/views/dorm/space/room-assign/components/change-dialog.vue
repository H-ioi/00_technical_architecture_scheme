<template>
  <el-dialog v-model="visible" :title="$t('dorm.roomAssign.changeRoom')" width="640px" destroy-on-close>
    <UniForm ref="uniFormRef" v-model="formModel" mode="edit" :config="formCfg" />
    <template #footer>
      <el-button @click="visible = false">{{ $t('dorm.common.cancel') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">
        {{ $t('dorm.common.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import type { UniFormConfig } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'

import { dormBedApi, dormBuildingApi, dormFloorApi, dormRoomApi } from '@/api'
import type { DormBedBrief } from '@/types/modules/dorm-bed'
import type { DormBuildingBrief, DormFloorBrief } from '@/types/modules/dorm-building'
import type { DormRoomRecord } from '@/types/modules/dorm-room'
import { normalizeArray } from '@/utils/api-response-normalize'

import {
  changeFormConfig,
  changeFormRules,
  emptyChangeModel,
  type DormChangeFormModel
} from '../assign.config'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  admissionNo: string
  schoolOptions: Array<{ label: string; value: string | number }>
  defaultSchoolId?: string | number
}>()

const emit = defineEmits<{
  saved: []
}>()

const { t } = useUniI18n()
const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const formModel = ref<DormChangeFormModel>(emptyChangeModel())
const buildingOptions = ref<Array<{ label: string; value: string | number }>>([])
const floorOptions = ref<Array<{ label: string; value: string | number }>>([])
const roomOptions = ref<Array<{ label: string; value: string | number }>>([])
const bedOptions = ref<Array<{ label: string; value: string | number }>>([])

const formCfg = computed<UniFormConfig>(() => ({
  ...changeFormConfig(
    t,
    props.schoolOptions,
    buildingOptions.value,
    floorOptions.value,
    roomOptions.value,
    bedOptions.value
  ),
  rules: changeFormRules(t)
}))

async function loadBuildingOptions(schoolId?: string | number) {
  if (schoolId == null || schoolId === '') {
    buildingOptions.value = []
    return
  }
  const raw = await dormBuildingApi.list.get({ schoolId })
  const list = normalizeArray<DormBuildingBrief>(raw)
  buildingOptions.value = list.map((item) => ({
    label: String(item.name || item.id),
    value: item.id
  }))
}

async function loadFloorOptions(buildingId?: string | number) {
  if (buildingId == null || buildingId === '') {
    floorOptions.value = []
    return
  }
  const raw = await dormFloorApi.list.get({ buildingId })
  const list = normalizeArray<DormFloorBrief>(raw)
  floorOptions.value = list.map((item) => ({
    label: String(item.name || item.id),
    value: item.id
  }))
}

async function loadRoomOptions(floorId?: string | number) {
  if (floorId == null || floorId === '') {
    roomOptions.value = []
    return
  }
  const raw = await dormRoomApi.list.get({ floorId })
  const list = normalizeArray<DormRoomRecord>(raw)
  roomOptions.value = list.map((item) => ({
    label: String(item.number || item.id),
    value: item.id
  }))
}

async function loadBedOptions(roomId?: string | number) {
  if (roomId == null || roomId === '') {
    bedOptions.value = []
    return
  }
  const raw = await dormBedApi.list.get({ roomId })
  const list = normalizeArray<DormBedBrief>(raw)
  bedOptions.value = list.map((item) => ({
    label: String(item.label || item.id),
    value: String(item.label || item.id)
  }))
}

watch(
  () => formModel.value.school,
  (schoolId, prevSchoolId) => {
    if (schoolId == null) {
      buildingOptions.value = []
      floorOptions.value = []
      roomOptions.value = []
      bedOptions.value = []
      formModel.value.buildingId = undefined
      formModel.value.floorId = undefined
      formModel.value.roomId = undefined
      formModel.value.bedLabel = undefined
      return
    }
    if (prevSchoolId != null && prevSchoolId !== schoolId) {
      formModel.value.buildingId = undefined
      formModel.value.floorId = undefined
      formModel.value.roomId = undefined
      formModel.value.bedLabel = undefined
      floorOptions.value = []
      roomOptions.value = []
      bedOptions.value = []
    }
    void loadBuildingOptions(schoolId)
  }
)

watch(
  () => formModel.value.buildingId,
  (buildingId, prevBuildingId) => {
    if (buildingId == null) {
      floorOptions.value = []
      roomOptions.value = []
      bedOptions.value = []
      formModel.value.floorId = undefined
      formModel.value.roomId = undefined
      formModel.value.bedLabel = undefined
      return
    }
    if (prevBuildingId != null && prevBuildingId !== buildingId) {
      formModel.value.floorId = undefined
      formModel.value.roomId = undefined
      formModel.value.bedLabel = undefined
      roomOptions.value = []
      bedOptions.value = []
    }
    void loadFloorOptions(buildingId)
  }
)

watch(
  () => formModel.value.floorId,
  (floorId, prevFloorId) => {
    if (floorId == null) {
      roomOptions.value = []
      bedOptions.value = []
      formModel.value.roomId = undefined
      formModel.value.bedLabel = undefined
      return
    }
    if (prevFloorId != null && prevFloorId !== floorId) {
      formModel.value.roomId = undefined
      formModel.value.bedLabel = undefined
      bedOptions.value = []
    }
    void loadRoomOptions(floorId)
  }
)

watch(
  () => formModel.value.roomId,
  (roomId, prevRoomId) => {
    if (roomId == null) {
      bedOptions.value = []
      formModel.value.bedLabel = undefined
      return
    }
    if (prevRoomId != null && prevRoomId !== roomId) {
      formModel.value.bedLabel = undefined
    }
    void loadBedOptions(roomId)
  }
)

watch(
  () => visible.value,
  (open) => {
    if (!open) {
      formModel.value = emptyChangeModel()
      buildingOptions.value = []
      floorOptions.value = []
      roomOptions.value = []
      bedOptions.value = []
      return
    }
    formModel.value = emptyChangeModel()
    if (props.defaultSchoolId != null) {
      formModel.value.school = props.defaultSchoolId
      void loadBuildingOptions(props.defaultSchoolId)
    }
  }
)

async function submit() {
  const valid = await uniFormRef.value?.validate().catch(() => false)
  if (!valid || !formModel.value.roomId || !formModel.value.bedLabel) {
    return
  }

  submitting.value = true
  try {
    await dormBedApi.move.post({
      admission_no: props.admissionNo,
      to_room_id: formModel.value.roomId,
      to_label: formModel.value.bedLabel
    })
    ElMessage.success(t('dorm.roomAssign.changeSuccess'))
    visible.value = false
    emit('saved')
  } finally {
    submitting.value = false
  }
}
</script>
