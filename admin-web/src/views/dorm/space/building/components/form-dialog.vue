<template>
  <el-dialog v-model="visible" :title="title" width="640px" destroy-on-close>
    <div
      v-loading="detailLoading"
      class="dorm-building-form__body"
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

import { dormBuildingApi } from '@/api'
import type { DormBuildingFormModel } from '@/types/modules/dorm-building'
import { normalizePayload } from '@/utils/api-response-normalize'

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
const formModel = ref<DormBuildingFormModel>(emptyFormModel())

const dialogFormCfg = computed<UniFormConfig>(() => ({
  ...dialogFormConfig(t, props.schoolOptions),
  rules: dialogFormRules(t)
}))

const title = computed(() =>
  t(props.mode === 'add' ? 'dorm.building.formAdd' : 'dorm.building.formEdit')
)

watch(
  () => visible.value,
  (open) => {
    if (!open) {
      formModel.value = emptyFormModel()
      return
    }

    void runWithDetailLoading(async () => {
      formModel.value = emptyFormModel()
      if (props.mode === 'add') {
        if (props.defaultSchoolId != null) {
          formModel.value.schoolId = props.defaultSchoolId
        }
        return
      }
      if (props.recordId == null) {
        return
      }

      const raw = await dormBuildingApi.detail.get(props.recordId)
      const row = normalizePayload(raw) as Loose
      const school = (row.school as Loose | undefined) || {}
      formModel.value = {
        id: row.id as string | number,
        schoolId: (school.extern_id as string | number | undefined) ?? (row.schoolId as string | number),
        name: String(row.name || '')
      }
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
      await dormBuildingApi.create.post(formModel.value)
    } else {
      await dormBuildingApi.update.post(formModel.value)
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
.dorm-building-form__body {
  min-height: 80px;
}
</style>
