import { ElMessage } from 'element-plus'
import type { UniTableAction } from 'uni-ui-lib'
import { useUniI18n } from 'uni-ui-lib'
import { computed, onMounted, reactive, ref } from 'vue'

import { permissionMenuApi } from '@/api'
import type { PermissionMenuNode } from '@/types/modules/permission-menu'

import {
  menuActionColumn,
  menuTableToolbar,
  menuTableTree,
  tableCols,
  type MenuParentOption
} from './list.config'

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
      label: t('permission.actions.edit'),
      type: 'primary',
      code: 'sys_menu_edit',
      onClick: (row) => openEdit(row as PermissionMenuNode)
    }
  ])

  const parentOptions = computed<MenuParentOption[]>(() => {
    const root: MenuParentOption = { label: t('permission.menu.rootParent'), value: -1 }
    const selfId = form.id
    const flat = flattenParents(menuList.value).filter((o) => selfId === undefined || o.value !== selfId)
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
    Object.assign(form, {
      ...row,
      menuId: row.menuId ?? row.id,
      parentId: row.parentId === undefined || row.parentId === null ? -1 : row.parentId,
      sort: typeof row.sort === 'number' ? row.sort : Number(row.sort ?? 0)
    })
    dialogVisible.value = true
  }

  const submitFromDraft = async (patch: PermissionMenuNode & { menuId?: string | number }) => {
    Object.assign(form, patch)
    submitting.value = true
    try {
      const payload = {
        ...form,
        parentId: form.parentId === -1 || form.parentId === '-1' ? -1 : form.parentId
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
    menuActionColumn,
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
