import { ElMessage } from 'element-plus'
import type { UniTableAction } from 'uni-ui-lib'
import { useUniI18n } from 'uni-ui-lib'
import { computed, onMounted, reactive, ref } from 'vue'

import { permissionMenuApi } from '@/api'
import type { PermissionMenuNode } from '@/types/modules/permission-menu'

import {
  menuTableToolbar,
  menuTableTree,
  tableCols,
  type MenuParentOption
} from './list.config'

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

export const useList = () => {
  const { t } = useUniI18n()

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
        : rawParent === MENU_PARENT_ROOT || rawParent === '-1' || rawParent === String(MENU_PARENT_ROOT)
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
          : rawParent === MENU_PARENT_ROOT || rawParent === '-1' || rawParent === String(MENU_PARENT_ROOT)
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

  return {
    actions,
    columns,
    dialogVisible,
    form,
    loading,
    menuList,
    menuTableToolbar,
    menuTableTree,
    parentOptions,
    submitFromDraft,
    submitting,
    t,
    loadTree
  }
}
