<template>
  <section class="uni-list-page permission-dept">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ t('permission.dept.title') }}</h1>
        <p>{{ t('permission.dept.description') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'sys_dept_add'" type="primary" @click="headerAdd">
          {{ t('permission.addDept') }}
        </el-button>
      </div>
    </div>

    <UniDataTable
      row-key="id"
      selection="single"
      :columns="columns"
      :data="treeData"
      :loading="loading"
      :pagination="false"
      :tree="deptTableTree"
      :toolbar="deptTableToolbar"
      :actions="actions"
      :action-column="{ width: 200, fixed: 'right' }"
      @refresh="loadTree"
      @selection-change="onSelectionChange" />

    <DeptFormDialog
      v-model:visible="dialogVisible"
      :mode="dialogMode"
      :snapshot="form"
      :parent-options="parentOptions"
      :submitting="submitting"
      @save="submitFromDraft" />
  </section>
</template>

<script setup lang="ts">
import DeptFormDialog from './components/dept-form-dialog.vue'
import {
  deptTableCols,
  deptTableToolbar,
  deptTableTree,
  type DeptParentOption
} from './list.config'
import { permissionDeptApi } from '@/api'
import type { PermissionDeptRecord } from '@/types/modules/permission-dept'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UniDataTable, useUniI18n } from 'uni-ui-lib'
import type { UniTableAction } from 'uni-ui-lib'
import { computed, onMounted, reactive, ref } from 'vue'

const { t } = useUniI18n()

const flattenDeptParents = (nodes: PermissionDeptRecord[], depth = 0): DeptParentOption[] => {
  const pad = '\u3000'.repeat(depth)
  const acc: DeptParentOption[] = []
  for (const n of nodes) {
    if (n.id === undefined || n.id === null) {
      continue
    }
    acc.push({ label: `${pad}${n.name ?? ''}`, value: n.id })
    if (n.children?.length) {
      acc.push(...flattenDeptParents(n.children, depth + 1))
    }
  }
  return acc
}
const emptyForm = (): PermissionDeptRecord => ({
  id: undefined,
  deptId: undefined,
  parentId: undefined,
  name: '',
  sort: undefined
})
const loading = ref(false)
const treeData = ref<PermissionDeptRecord[]>([])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const submitting = ref(false)
const highlightedRow = ref<PermissionDeptRecord | null>(null)

const form = reactive<PermissionDeptRecord>(emptyForm())

const columns = computed(() => deptTableCols(t))

const parentOptions = computed<DeptParentOption[]>(() => flattenDeptParents(treeData.value))

const actions = computed<UniTableAction<PermissionDeptRecord>[]>(() => [
  {
    label: t('permission.edit'),
    type: 'primary',
    code: 'sys_dept_edit',
    onClick: (row) => {
      void openEdit(row as PermissionDeptRecord)
    }
  },
  {
    label: t('permission.dept.addChild'),
    type: 'primary',
    code: 'sys_dept_add',
    onClick: (row) => openAddChild(row as PermissionDeptRecord)
  },
  {
    label: t('permission.delete'),
    type: 'danger',
    code: 'sys_dept_del',
    onClick: (row) => {
      void handleDeleteRow(row as PermissionDeptRecord)
    }
  }
])

const loadTree = async () => {
  loading.value = true
  try {
    const data = await permissionDeptApi.tree.get()
    treeData.value = Array.isArray(data) ? data : []
  } catch {
    ElMessage.error(t('permission.messages.deptLoadErr'))
  } finally {
    loading.value = false
  }
}

const onSelectionChange = (rows: unknown[]) => {
  highlightedRow.value = (rows[0] as PermissionDeptRecord | undefined) ?? null
}

const ensureParentForAdd = (): PermissionDeptRecord | null => {
  const row = highlightedRow.value
  if (row == null || row.id === undefined || row.id === null) {
    ElMessage.warning(t('permission.messages.pickDeptErr'))
    return null
  }
  return row
}

const openAddUnderParent = (parentRow: PermissionDeptRecord) => {
  dialogMode.value = 'add'
  Object.assign(form, emptyForm(), { parentId: parentRow.id, sort: 0 })
  dialogVisible.value = true
}

/** 顶部「添加」：在当前高亮行的下级新增（与旧版选中树节点后再添加一致）。 */
const headerAdd = () => {
  const parentRow = ensureParentForAdd()
  if (!parentRow) {
    return
  }
  openAddUnderParent(parentRow)
}

const openAddChild = (row: PermissionDeptRecord) => {
  if (row.id === undefined || row.id === null) {
    return
  }
  openAddUnderParent(row)
}

const openEdit = async (row: PermissionDeptRecord) => {
  if (row.id === undefined || row.id === null) {
    return
  }
  try {
    const detail = await permissionDeptApi.get.getById(row.id)
    dialogMode.value = 'edit'
    Object.assign(form, emptyForm(), detail)
    if (form.deptId === undefined || form.deptId === null) {
      form.deptId = form.id
    }
    dialogVisible.value = true
  } catch {
    ElMessage.error(t('permission.messages.deptLoadErr'))
  }
}

const handleDeleteRow = async (row: PermissionDeptRecord) => {
  const id = row.id
  if (id === undefined || id === null) {
    return
  }
  await ElMessageBox.confirm(t('permission.messages.deleteDeptConfirm'), '', { type: 'warning' })
  await permissionDeptApi.remove.deleteById(id)
  ElMessage.success(t('permission.messages.saveOk'))
  await loadTree()
}

const submitFromDraft = async (patch: PermissionDeptRecord) => {
  Object.assign(form, patch)
  const payload: PermissionDeptRecord = {
    parentId: form.parentId,
    deptId: form.deptId,
    id: form.id,
    name: form.name,
    sort: form.sort
  }
  submitting.value = true
  try {
    if (dialogMode.value === 'add') {
      await permissionDeptApi.add.post(payload)
    } else {
      await permissionDeptApi.update.put(payload)
    }
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
