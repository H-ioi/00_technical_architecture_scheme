<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    width="520px"
    :title="mode === 'add' ? t('permission.dept.formAdd') : t('permission.dept.formEdit')">
    <UniForm ref="uniFormRef" v-model="draft" mode="edit" :config="dialogFormConfig" />
    <template #footer>
      <el-button @click="visible = false">{{ t('permission.cancel') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="onSaveClick">{{
        t('permission.save')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { UniFormConfig } from 'uni-ui-lib'
import { UniForm, useUniI18n } from 'uni-ui-lib'

import type { PermissionDeptRecord } from '@/types/modules/permission-dept'

import { deptDialogFormConfig, type DeptParentOption } from '../list.config'

type DeptDraft = PermissionDeptRecord

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  mode: 'add' | 'edit'
  snapshot: DeptDraft
  parentOptions: DeptParentOption[]
  submitting: boolean
}>()

const emit = defineEmits<{
  (e: 'save', draft: DeptDraft): void
}>()

const { t } = useUniI18n()
const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)

const emptyDraft = (): DeptDraft => ({
  id: undefined,
  deptId: undefined,
  parentId: undefined,
  name: '',
  sort: undefined
})

const draft = ref<DeptDraft>(emptyDraft())

const dialogFormConfig = computed<UniFormConfig>(() =>
  deptDialogFormConfig(t, props.mode, props.parentOptions)
)

watch(visible, (opened) => {
  if (!opened) {
    return
  }
  const { children: _c, ...rest } = props.snapshot
  draft.value = { ...emptyDraft(), ...rest }
  if (props.mode === 'edit' && draft.value.sort !== undefined && draft.value.sort !== null) {
    draft.value.sort =
      typeof draft.value.sort === 'number' ? draft.value.sort : Number(draft.value.sort)
  }
  if (props.mode === 'add' && draft.value.sort === undefined) {
    draft.value.sort = 0
  }
  void nextTick(() => {
    uniFormRef.value?.clearValidate()
  })
})

const onSaveClick = async () => {
  try {
    await uniFormRef.value?.validate()
  } catch {
    return
  }
  emit('save', { ...draft.value })
}
</script>
