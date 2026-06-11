<template>
  <el-dialog v-model="visible" :title="title" width="640px" destroy-on-close>
    <div
      v-loading="detailLoading"
      class="dorm-floor-form__body"
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

import { dormBuildingApi, dormFloorApi } from '@/api'
import type { DormBuildingBrief } from '@/types/modules/dorm-building'
import type { DormFloorFormModel } from '@/types/modules/dorm-floor'
import { normalizeArray, normalizePayload } from '@/utils/api-response-normalize'

import { dialogFormConfig, dialogFormRules, emptyFormModel } from '../list.config'

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
const formModel = ref<DormFloorFormModel>(emptyFormModel())
const buildingOptions = ref<Array<{ label: string; value: string | number }>>([])

const dialogFormCfg = computed<UniFormConfig>(() => ({
  ...dialogFormConfig(t, props.schoolOptions, buildingOptions.value),
  rules: dialogFormRules(t)
}))

const title = computed(() => t(props.mode === 'add' ? 'dorm.floor.formAdd' : 'dorm.floor.formEdit'))

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

watch(
  () => formModel.value.school,
  (schoolId) => {
    if (schoolId == null) {
      buildingOptions.value = []
      formModel.value.buildingId = undefined
      return
    }
    void loadBuildingOptions(schoolId)
  }
)

watch(
  () => visible.value,
  (open) => {
    if (!open) {
      formModel.value = emptyFormModel()
      buildingOptions.value = []
      return
    }

    void runWithDetailLoading(async () => {
      formModel.value = emptyFormModel()
      buildingOptions.value = []
      if (props.mode === 'add') {
        if (props.defaultSchoolId != null) {
          formModel.value.school = props.defaultSchoolId
          await loadBuildingOptions(props.defaultSchoolId)
        }
        return
      }
      if (props.recordId == null) {
        return
      }

      const raw = await dormFloorApi.detail.get(props.recordId)
      const row = normalizePayload(raw) as Loose
      const building = (row.building as Loose | undefined) || {}
      const school = (building.school as Loose | undefined) || {}
      const schoolId = (school.extern_id as string | number | undefined) ?? formModel.value.school
      formModel.value = {
        id: row.id as string | number,
        school: schoolId,
        buildingId: building.id as string | number | undefined,
        name: String(row.name || '')
      }
      await loadBuildingOptions(schoolId)
    })
  }
)

const submit = async () => {
  const valid = await uniFormRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }

  submitting.value = true
  try {
    if (props.mode === 'add') {
      await dormFloorApi.create.post(formModel.value)
    } else {
      await dormFloorApi.update.post(formModel.value)
    }

    ElMessage.success(t('dorm.common.saveSuccess'))
    visible.value = false
    emit('saved')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.dorm-floor-form__body {
  min-height: 80px;
}
</style>
