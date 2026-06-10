<template>
  <el-dialog
    v-model="visible"
    :title="$t('dorm.boardingStudent.detailTitle')"
    width="900px"
    destroy-on-close
    class="boarding-edit-dialog"
  >
    <div v-loading="loading">
      <section class="boarding-edit-dialog__section">
        <h3>{{ $t('dorm.boardingStudent.sectionBasic') }}</h3>
        <p>{{ basicSummary }}</p>
      </section>

      <section v-if="canViewParent" class="boarding-edit-dialog__section">
        <h3>{{ $t('dorm.boardingStudent.sectionParent') }}</h3>
        <el-table :data="parentRows" border>
          <el-table-column prop="relationship" :label="$t('dorm.boardingStudent.fieldRelationship')" />
          <el-table-column prop="phone" :label="$t('dorm.boardingStudent.fieldPhone')" />
          <el-table-column prop="email_address" :label="$t('dorm.boardingStudent.fieldEmail')" />
        </el-table>
      </section>

      <section class="boarding-edit-dialog__section">
        <h3>{{ $t('dorm.boardingStudent.sectionLodging') }}</h3>
        <UniForm ref="uniFormRef" v-model="formModel" mode="edit" :config="formCfg" />
      </section>
    </div>
    <template #footer>
      <el-button type="primary" :loading="submitting" @click="submit">
        {{ $t('dorm.common.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { UniForm, useUniI18n, useUniPermission } from 'uni-ui-lib'
import type { UniFormConfig } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'

import { dormBedApi, dormBuildingApi, dormFloorApi, dormProjectApi, dormRoomApi, dormStudentApi } from '@/api'
import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'
import type { DormBedBrief } from '@/types/modules/dorm-bed'
import type { DormBuildingBrief, DormFloorBrief } from '@/types/modules/dorm-building'
import type { DormParentInfo } from '@/types/modules/dorm-student'
import type { DormProjectBrief, DormRoomRecord } from '@/types/modules/dorm-room'
import { normalizeArray, normalizeEnvelope } from '@/utils/api-response-normalize'

import {
  editFormConfig,
  editFormRules,
  emptyEditModel,
  type BoardingEditFormModel
} from '../edit-form.config'

type Loose = Record<string, unknown>

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  admissionNo?: string
  schoolOptions: Array<{ label: string; value: string | number }>
}>()

const emit = defineEmits<{
  saved: []
}>()

const { t } = useUniI18n()
const { hasPermission } = useUniPermission()
const canViewParent = computed(() => hasPermission('boarding-parent-view'))
const { detailLoading: loading, runWithDetailLoading } = useDialogDetailLoading()

const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const formModel = ref<BoardingEditFormModel>(emptyEditModel())
const basicSummary = ref('--')
const parentRows = ref<DormParentInfo[]>([])

const buildingOptions = ref<Array<{ label: string; value: string | number }>>([])
const floorOptions = ref<Array<{ label: string; value: string | number }>>([])
const roomOptions = ref<Array<{ label: string; value: string | number }>>([])
const bedOptions = ref<Array<{ label: string; value: string | number }>>([])
const projectOptions = ref<Array<{ label: string; value: string | number }>>([])

const formCfg = computed<UniFormConfig>(() => ({
  ...editFormConfig(
    t,
    props.schoolOptions,
    buildingOptions.value,
    floorOptions.value,
    roomOptions.value,
    bedOptions.value,
    projectOptions.value
  ),
  rules: editFormRules(t)
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

async function loadProjectOptions(schoolId?: string | number) {
  if (schoolId == null || schoolId === '') {
    projectOptions.value = []
    return
  }
  const raw = await dormProjectApi.list.get({ schoolId })
  const list = normalizeArray<DormProjectBrief>(raw)
  projectOptions.value = list.map((item) => ({
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
    value: item.id
  }))
}

let prevSchoolId: string | number | undefined
let prevBuildingId: string | number | undefined
let prevFloorId: string | number | undefined
let prevRoomId: string | number | undefined

watch(
  () => formModel.value.school,
  async (schoolId) => {
    if (schoolId === prevSchoolId) {
      return
    }
    prevSchoolId = schoolId
    if (visible.value && schoolId != null && schoolId !== '') {
      formModel.value.buildingId = undefined
      formModel.value.floorId = undefined
      formModel.value.roomId = undefined
      formModel.value.bedId = undefined
      formModel.value.projectId = undefined
      floorOptions.value = []
      roomOptions.value = []
      bedOptions.value = []
    }
    await Promise.all([loadBuildingOptions(schoolId), loadProjectOptions(schoolId)])
  }
)

watch(
  () => formModel.value.buildingId,
  async (buildingId) => {
    if (buildingId === prevBuildingId) {
      return
    }
    prevBuildingId = buildingId
    if (visible.value && buildingId != null && buildingId !== '') {
      formModel.value.floorId = undefined
      formModel.value.roomId = undefined
      formModel.value.bedId = undefined
      roomOptions.value = []
      bedOptions.value = []
    }
    await loadFloorOptions(buildingId)
  }
)

watch(
  () => formModel.value.floorId,
  async (floorId) => {
    if (floorId === prevFloorId) {
      return
    }
    prevFloorId = floorId
    if (visible.value && floorId != null && floorId !== '') {
      formModel.value.roomId = undefined
      formModel.value.bedId = undefined
      bedOptions.value = []
    }
    await loadRoomOptions(floorId)
  }
)

watch(
  () => formModel.value.roomId,
  async (roomId) => {
    if (roomId === prevRoomId) {
      return
    }
    prevRoomId = roomId
    if (visible.value && roomId != null && roomId !== '') {
      formModel.value.bedId = undefined
    }
    await loadBedOptions(roomId)
  }
)

function readBedChain(bed: Loose) {
  const room = (bed.room as Loose) ?? {}
  const floor = (room.floor as Loose) ?? {}
  const building = (floor.building as Loose) ?? {}
  const project = (room.project as Loose) ?? {}
  return {
    buildingId: building.id as string | number | undefined,
    floorId: floor.id as string | number | undefined,
    roomId: room.id as string | number | undefined,
    bedId: bed.id as string | number | undefined,
    projectId: project.id as string | number | undefined
  }
}

watch(visible, async (open) => {
  if (!open || !props.admissionNo) {
    return
  }
  formModel.value = emptyEditModel()
  parentRows.value = []
  basicSummary.value = '--'
  prevSchoolId = undefined
  prevBuildingId = undefined
  prevFloorId = undefined
  prevRoomId = undefined

  await runWithDetailLoading(async () => {
    const raw = await dormStudentApi.detail.get({ admissionNo: props.admissionNo })
    const body = normalizeEnvelope(raw) as Loose
    const school = (body.school as Loose) ?? {}
    const beds = Array.isArray(body.bed) ? (body.bed as Loose[]) : []
    const bed = beds[0] ?? {}
    const chain = readBedChain(bed)

    basicSummary.value = `${String(body.en_name ?? '--')} / ${String(body.admission_no ?? props.admissionNo)}`
    parentRows.value = Array.isArray(body.parent_info) ? (body.parent_info as DormParentInfo[]) : []

    formModel.value = {
      admissionNo: String(body.admission_no ?? props.admissionNo),
      school: (school.extern_id as string | number | undefined) ?? undefined,
      buildingId: chain.buildingId,
      floorId: chain.floorId,
      roomId: chain.roomId,
      bedId: chain.bedId,
      projectId: chain.projectId,
      checkinDate: String(body.checkin_date ?? '').slice(0, 10),
      plannedCheckoutDate: String(body.planned_checkout_date ?? '').slice(0, 10),
      paymentStatus:
        body.payment_status == null ? 0 : Number.parseInt(String(body.payment_status), 10) || 0
    }

    prevSchoolId = formModel.value.school
    prevBuildingId = formModel.value.buildingId
    prevFloorId = formModel.value.floorId
    prevRoomId = formModel.value.roomId

    await Promise.all([
      loadBuildingOptions(formModel.value.school),
      loadProjectOptions(formModel.value.school),
      loadFloorOptions(formModel.value.buildingId),
      loadRoomOptions(formModel.value.floorId),
      loadBedOptions(formModel.value.roomId)
    ])
  })
})

async function submit() {
  const valid = await uniFormRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }
  submitting.value = true
  try {
    const payload = { ...formModel.value, admissionNo: props.admissionNo }
    delete payload.roomId
    await dormStudentApi.edit.post(payload)
    ElMessage.success(t('dorm.common.saveSuccess'))
    visible.value = false
    emit('saved')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.boarding-edit-dialog {
  &__section {
    margin-bottom: 20px;

    h3 {
      margin: 0 0 12px;
      font-size: 16px;
      font-weight: 600;
    }
  }
}
</style>
