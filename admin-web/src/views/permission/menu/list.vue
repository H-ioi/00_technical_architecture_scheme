<template>
  <section class="uni-list-page permission-menu">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ t('permission.menu.title') }}</h1>
        <p>{{ t('permission.menu.description') }}</p>
      </div>
    </div>

    <UniDataTable
      row-key="id"
      :columns="columns"
      :data="menuList"
      :loading="loading"
      :pagination="false"
      :tree="menuTableTree"
      :toolbar="menuTableToolbar"
      :actions="actions"
      :action-column="{ width: 70, fixed: 'right' }"
      @refresh="loadTree"
    >
      <template #column-icon="{ row }">
        <IconDisplay :name="row.icon" />
      </template>
      <template #column-type="{ row }">
        <el-tag v-if="row.type === '0'" type="success">{{ t('permission.menu.typeLeft') }}</el-tag>
        <el-tag v-else-if="row.type === '2'" type="success">
          {{ t('permission.menu.typeTop') }}
        </el-tag>
        <el-tag v-else-if="row.type === '1'" type="info">
          {{ t('permission.menu.typeButton') }}
        </el-tag>
        <span v-else>{{ t('permission.menu.typeUnknown') }}</span>
      </template>
      <template #column-keepAlive="{ row }">
        <el-tag v-if="row.keepAlive === '1'" type="success">
          {{ t('permission.menu.cacheOn') }}
        </el-tag>
        <el-tag v-else type="info">{{ t('permission.menu.cacheOff') }}</el-tag>
      </template>
    </UniDataTable>

    <EditDialog
      v-model:visible="dialogVisible"
      :snapshot="form"
      :parent-options="parentOptions"
      :submitting="submitting"
      @save="submitFromDraft"
    />
  </section>
</template>

<script setup lang="ts">
import EditDialog from './components/edit-dialog.vue'
import { menuTableToolbar, menuTableTree, tableCols, type MenuParentOption } from './list.config'
import { permissionMenuApi } from '@/api'
import { IconDisplay } from '@/components/sidebar-icon'
import type { PermissionMenuNode } from '@/types/modules/permission-menu'
import { ElMessage } from 'element-plus'
import { UniDataTable, useUniI18n } from 'uni-ui-lib'
import type { UniTableAction } from 'uni-ui-lib'
import { computed, onMounted, reactive, ref } from 'vue'

const { t } = useUniI18n()

/** 与上级菜单下拉里「根节点」选项的 value（-1）一致，避免接口给字符串 "-1" 时 el-select 匹配不到标签 */
const MENU_PARENT_ROOT = -1
const flattenParents = (nodes: PermissionMenuNode[], depth = 0): MenuParentOption[] => {
  const pad = '\u3000'.repeat(depth)
  const acc: MenuParentOption[] = []
  for (const n of nodes) {
    if (n.id === undefined || n.id === null) {
      continue
    }
    acc.push({ label: `${pad}${n.name ?? ''}`, value: n.id })
    if (n.children?.length) {
      acc.push(...flattenParents(n.children, depth + 1))
    }
  }
  return acc
}
const loading = ref(false)
const menuList = ref<PermissionMenuNode[]>([])
const dialogVisible = ref(false)
const submitting = ref(false)

const form = reactive<PermissionMenuNode & { menuId?: string | number }>({
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

const columns = computed(() => tableCols(t))

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('permission.edit'),
    type: 'primary',
    code: 'sys_menu_edit',
    onClick: (row) => openEdit(row as PermissionMenuNode)
  }
])

const parentOptions = computed<MenuParentOption[]>(() => {
  const root: MenuParentOption = {
    label: t('permission.menu.rootParent'),
    value: MENU_PARENT_ROOT
  }
  const selfId = form.id
  const flat = flattenParents(menuList.value).filter(
    (o) => selfId === undefined || o.value !== selfId
  )
  return [root, ...flat]
})

const loadTree = async () => {
  loading.value = true
  try {
    const data = await permissionMenuApi.treeTenant.get({ lazy: false })
    menuList.value = Array.isArray(data) ? data : []
  } finally {
    loading.value = false
  }
}

const openEdit = (row: PermissionMenuNode) => {
  const rawParent = row.parentId
  const parentIdForSelect =
    rawParent === undefined || rawParent === null || rawParent === ''
      ? MENU_PARENT_ROOT
      : rawParent === MENU_PARENT_ROOT ||
          rawParent === '-1' ||
          rawParent === String(MENU_PARENT_ROOT)
        ? MENU_PARENT_ROOT
        : rawParent
  Object.assign(form, {
    ...row,
    menuId: row.menuId ?? row.id,
    parentId: parentIdForSelect,
    sort: typeof row.sort === 'number' ? row.sort : Number(row.sort ?? 0)
  })
  dialogVisible.value = true
}

const submitFromDraft = async (patch: PermissionMenuNode & { menuId?: string | number }) => {
  Object.assign(form, patch)
  submitting.value = true
  try {
    const rawParent = form.parentId
    const parentIdForSubmit =
      rawParent === undefined || rawParent === null || rawParent === ''
        ? MENU_PARENT_ROOT
        : rawParent === MENU_PARENT_ROOT ||
            rawParent === '-1' ||
            rawParent === String(MENU_PARENT_ROOT)
          ? MENU_PARENT_ROOT
          : rawParent
    const payload = {
      ...form,
      parentId: parentIdForSubmit
    }
    await permissionMenuApi.tenantEdit.post(payload)
    ElMessage.success(t('permission.messages.saveOk'))
    dialogVisible.value = false
    await loadTree()
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  void loadTree()
})
</script>
