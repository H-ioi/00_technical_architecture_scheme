<template>
  <el-dialog v-model="visible" :title="title" width="640px" destroy-on-close>
    <div
      v-loading="detailLoading"
      class="dorm-room-form__body"
      :element-loading-text="$t('common.loading')">
      <UniForm ref="uniFormRef" v-model="formModel" mode="edit" :config="dialogFormCfg" />
    </div>

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

import { dormBuildingApi, dormFloorApi, dormProjectApi, dormRoomApi } from '@/api'
import type { DormBuildingBrief } from '@/types/modules/dorm-building'
import type { DormFloorBrief } from '@/types/modules/dorm-building'
import type { DormProjectBrief, DormRoomFormModel } from '@/types/modules/dorm-room'
import { normalizeArray, normalizePayload } from '@/utils/api-response-normalize'

import {
  dialogFormConfig,
  dialogFormRules,
  emptyFormModel,
  genderFormOpts
} from '../list.config'

import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'

type Loose = Record<string, unknown>

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  mode: 'add' | 'edit'
  recordId: string | number | null
  schoolOptions: Array<{ label: string; value: string | number }>
  defaultSchoolId?: string | number
}>()

const emit = defineEmits<{
  saved: []
}>()

const { t } = useUniI18n()
const { detailLoading, runWithDetailLoading } = useDialogDetailLoading()

const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const formModel = ref<DormRoomFormModel>(emptyFormModel())
const buildingOptions = ref<Array<{ label: string; value: string | number }>>([])
const floorOptions = ref<Array<{ label: string; value: string | number }>>([])
const projectOptions = ref<Array<{ label: string; value: string | number }>>([])

const dialogFormCfg = computed<UniFormConfig>(() => ({
  ...dialogFormConfig(
    t,
    props.schoolOptions,
    buildingOptions.value,
    floorOptions.value,
    projectOptions.value,
    genderFormOpts(t)
  ),
  rules: dialogFormRules(t)
}))

const title = computed(() =>
  t(props.mode === 'add' ? 'dorm.room.formAdd' : 'dorm.room.formEdit')
)

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

watch(
  () => formModel.value.school,
  (schoolId, prevSchoolId) => {
    if (schoolId == null) {
      buildingOptions.value = []
      floorOptions.value = []
      projectOptions.value = []
      formModel.value.buildingId = undefined
      formModel.value.floorId = undefined
      formModel.value.projectId = undefined
      return
    }
    if (prevSchoolId != null && prevSchoolId !== schoolId) {
      formModel.value.buildingId = undefined
      formModel.value.floorId = undefined
      formModel.value.projectId = undefined
      floorOptions.value = []
    }
    void loadBuildingOptions(schoolId)
    void loadProjectOptions(schoolId)
  }
)

watch(
  () => formModel.value.buildingId,
  (buildingId, prevBuildingId) => {
    if (buildingId == null) {
      floorOptions.value = []
      formModel.value.floorId = undefined
      return
    }
    if (prevBuildingId != null && prevBuildingId !== buildingId) {
      formModel.value.floorId = undefined
    }
    void loadFloorOptions(buildingId)
  }
)

watch(
  () => visible.value,
  (open) => {
    if (!open) {
      formModel.value = emptyFormModel()
      buildingOptions.value = []
      floorOptions.value = []
      projectOptions.value = []
      return
    }

    void runWithDetailLoading(async () => {
      formModel.value = emptyFormModel()
      buildingOptions.value = []
      floorOptions.value = []
      projectOptions.value = []

      if (props.mode === 'add') {
        if (props.defaultSchoolId != null) {
          formModel.value.school = props.defaultSchoolId
          await loadBuildingOptions(props.defaultSchoolId)
          await loadProjectOptions(props.defaultSchoolId)
        }
        return
      }
      if (props.recordId == null) {
        return
      }

      const raw = await dormRoomApi.detail.get(props.recordId)
      const row = normalizePayload(raw) as Loose
      const floor = (row.floor as Loose | undefined) || {}
      const building = (floor.building as Loose | undefined) || {}
      const project = (row.project as Loose | undefined) || {}
      const schoolId = (row.school_id as string | number | undefined) ?? formModel.value.school
      const buildingId = building.id as string | number | undefined
      const floorId = floor.id as string | number | undefined

      formModel.value = {
        id: row.id as string | number,
        school: schoolId,
        gender: row.gender != null ? String(row.gender) : undefined,
        buildingId,
        floorId,
        projectId: project.id as string | number | undefined,
        number: row.number as string | undefined,
        total_bed_count: row.total_bed_count as string | number | undefined
      }

      if (schoolId != null) {
        await loadBuildingOptions(schoolId)
        await loadProjectOptions(schoolId)
      }
      if (buildingId != null) {
        await loadFloorOptions(buildingId)
      }
    })
  }
)

async function submit() {
  const valid = await uniFormRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }

  submitting.value = true
  try {
    if (formModel.value.id != null) {
      await dormRoomApi.update.post(formModel.value)
    } else {
      await dormRoomApi.create.post(formModel.value)
    }
    ElMessage.success(t('dorm.common.saveSuccess'))
    visible.value = false
    emit('saved')
  } finally {
    submitting.value = false
  }
}
</script>
