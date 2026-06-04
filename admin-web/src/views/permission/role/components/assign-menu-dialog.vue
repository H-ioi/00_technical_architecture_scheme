<template>
  <el-dialog v-model="visible" destroy-on-close width="640px" :title="t('permission.assignMenu')">
    <div
      v-loading="loading"
      class="permission-assign-tree"
      :element-loading-text="t('common.loading')">
      <el-tree
        v-if="ready"
        :key="treeKey"
        ref="treeRef"
        :data="treeData"
        show-checkbox
        node-key="id"
        highlight-current
        default-expand-all
        :props="{ label: 'name', children: 'children' }"
        :default-checked-keys="checkedKeys" />
    </div>
    <template #footer>
      <el-button @click="visible = false">{{ t('permission.cancel') }}</el-button>
      <el-button type="primary" :loading="saving" @click="submit">
        {{ t('permission.save') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { nextTick, ref, watch } from 'vue'
import { useUniI18n } from 'uni-ui-lib'

import { permissionMenuApi, permissionRoleApi } from '@/api'
import type { PermissionMenuNode } from '@/types/modules/permission-menu'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{ roleId?: string | number }>()
const emit = defineEmits<{ (e: 'saved'): void }>()

const { t } = useUniI18n()

const loading = ref(false)
const saving = ref(false)
const treeRef = ref<{ getCheckedKeys: (leafOnly?: boolean) => (string | number)[] } | null>(null)
const treeData = ref<PermissionMenuNode[]>([])
const checkedKeys = ref<(string | number)[]>([])
const ready = ref(false)
let treeKey = 0

watch(
  () => [visible.value, props.roleId] as const,
  async ([open, rid]) => {
    if (!open || rid === undefined || rid === null) {
      ready.value = false
      return
    }
    loading.value = true
    ready.value = false
    treeKey += 1
    try {
      const [menus, checkedRaw] = await Promise.all([
        permissionMenuApi.treeTenant.get({ lazy: false }),
        permissionRoleApi.roleMenuChecked.get(rid)
      ])
      treeData.value = Array.isArray(menus) ? menus : []
      checkedKeys.value = Array.isArray(checkedRaw)
        ? (checkedRaw.filter((id) => id !== null && id !== undefined && id !== '') as (
            | string
            | number
          )[])
        : []
      await nextTick()
      ready.value = true
    } finally {
      loading.value = false
    }
  }
)

const submit = async () => {
  if (props.roleId === undefined || props.roleId === null) {
    return
  }
  saving.value = true
  try {
    const ck = treeRef.value?.getCheckedKeys(false) ?? []
    const menuIds = ck.map(String).join(',')
    await permissionRoleApi.assignMenu.put({
      roleId: props.roleId,
      menuIds
    })
    ElMessage.success(t('permission.messages.assignMenuSaved'))
    visible.value = false
    emit('saved')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped lang="scss">
.permission-assign-tree {
  position: relative;
  min-height: 280px;
  max-height: 440px;
  overflow: auto;
}
</style>
