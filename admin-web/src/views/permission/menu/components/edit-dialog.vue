<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    width="520px"
    :title="t('permission.menu.editTitle')">
    <UniForm ref="uniFormRef" v-model="draft" mode="edit" :config="dialogFormConfig">
      <template #field-icon="{ model }">
        <IconPicker v-model="model.icon" :placeholder="t('permission.menu.icon')" />
      </template>
    </UniForm>
    <template #footer>
      <el-button @click="visible = false">{{ t('permission.cancel') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="onSaveClick">
        {{ t('permission.save') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { UniFormConfig } from 'uni-ui-lib'
import { UniForm, useUniI18n } from 'uni-ui-lib'

import type { PermissionMenuNode } from '@/types/modules/permission-menu'

import { IconPicker } from '@/components/sidebar-icon'
import { menuEditDialogFormConfig, type MenuParentOption } from '../list.config'

type MenuDraft = PermissionMenuNode & { menuId?: string | number }

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  /** 打开弹窗时用于填充草稿的快照（与 useList.form 同源） */
  snapshot: MenuDraft
  parentOptions: MenuParentOption[]
  submitting: boolean
}>()

const emit = defineEmits<{
  (e: 'save', draft: MenuDraft): void
}>()

const { t } = useUniI18n()
const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)

const emptyDraft = (): MenuDraft => ({
  id: undefined,
  menuId: undefined,
  parentId: undefined,
  name: '',
  icon: '',
  sort: 0,
  path: '',
  type: '0',
  permission: '',
  keepAlive: '0'
})

const draft = ref<MenuDraft>(emptyDraft())

const dialogFormConfig = computed<UniFormConfig>(() =>
  menuEditDialogFormConfig(t, props.parentOptions)
)

watch(
  visible,
  (opened) => {
    if (!opened) {
      return
    }
    const { children: _drop, ...rest } = props.snapshot
    draft.value = { ...emptyDraft(), ...rest }
    void nextTick(() => {
      uniFormRef.value?.clearValidate()
    })
  },
  { flush: 'sync' }
)

const onSaveClick = async () => {
  try {
    await uniFormRef.value?.validate()
  } catch {
    return
  }
  emit('save', { ...draft.value })
}
</script>
