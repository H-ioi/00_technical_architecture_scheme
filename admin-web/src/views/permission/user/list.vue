<template>
  <section class="uni-list-page permission-user">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ t('permission.user.title') }}</h1>
        <p>{{ t('permission.user.description') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'sys_user_add'" type="primary" @click="openAdd">
          {{ t('permission.actions.add') }}
        </el-button>
      </div>
    </div>

    <el-row :gutter="16" class="permission-user__row">
      <el-col :xs="24" :sm="7" :md="6">
        <el-tree
          :data="deptTreeData"
          node-key="id"
          highlight-current
          default-expand-all
          :props="{ label: 'name', children: 'children' }"
          class="permission-user__tree"
          @node-click="onDeptNode" />
      </el-col>
      <el-col :xs="24" :sm="17" :md="18">
        <UniSearchForm
          v-model="queryModel"
          :config="searchCfg"
          :collapsed="true"
          :collapsed-rows="1"
          :action-min-span="0"
          :submit-text="t('permission.actions.search')"
          :reset-text="t('permission.actions.reset')"
          @search="search"
          @reset="reset" />
        <UniDataTable
          ref="tableRef"
          row-key="userId"
          :columns="columns"
          :request="loadData"
          :filters="filters"
          :pagination="{ pageSize: 20, pageSizes: [10, 20, 50] }"
          :toolbar="{ refresh: true, density: true, columnSetting: true }"
          :actions="actions"
          :action-column="{ width: 160, fixed: 'right' }"
          class="permission-user__table"
          @load-success="handleLoadSuccess" />
      </el-col>
    </el-row>

    <UserFormDialog
      v-model:visible="formVisible"
      :mode="formMode"
      :record="formRecord"
      :dept-options="deptFlat"
      :role-options="roleFlat"
      @saved="reloadTable" />
  </section>
</template>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { onMounted, ref } from 'vue'
import { UniDataTable, UniSearchForm, useUniI18n } from 'uni-ui-lib'

import { permissionDeptApi, permissionRoleApi, permissionUserApi } from '@/api'
import { normalizeArray } from '@/utils/api-response-normalize'
import type { PermissionDeptRecord } from '@/types/modules/permission-dept'
import type { PermissionUserRecord } from '@/types/modules/permission-user'

import UserFormDialog from './components/form-dialog.vue'
import { useList } from './use-list'
import type { PermissionUserTableRow } from './use-list'

const { t } = useUniI18n()

type Opt = { label: string; value: string | number }

const deptTreeData = ref<PermissionDeptRecord[]>([])
const deptFlat = ref<Opt[]>([])
const roleFlat = ref<Opt[]>([])

const selectedDeptId = ref<string | number | undefined>(undefined)

const flattenDeptTree = (nodes: PermissionDeptRecord[], depth = 0): Opt[] => {
  const pad = '\u3000'.repeat(depth)
  const acc: Opt[] = []
  for (const n of nodes) {
    if (n.id !== undefined && n.name !== undefined) {
      acc.push({ label: `${pad}${String(n.name)}`, value: n.id })
    }
    if (n.children?.length) {
      acc.push(...flattenDeptTree(n.children, depth + 1))
    }
  }
  return acc
}

async function loadDeptAndRoles() {
  const tree = await permissionDeptApi.tree.get()
  const treeOk = Array.isArray(tree) ? tree : []
  deptTreeData.value = treeOk
  deptFlat.value = flattenDeptTree(treeOk)

  const rolesRaw = await permissionRoleApi.listSimple.get()
  roleFlat.value = normalizeArray(rolesRaw).map((item) => {
    const row = item as Record<string, unknown>
    const value = row.roleId ?? row.id
    const label = String(row.roleName ?? row.label ?? '')
    return { label, value: value as string | number }
  })
}

const formVisible = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const formRecord = ref<PermissionUserRecord | null>(null)

async function deleteOne(row: PermissionUserTableRow) {
  await ElMessageBox.confirm(
    t('permission.messages.deleteUserConfirm', { name: row.username ?? row.userId ?? '' }),
    t('permission.actions.delete'),
    { type: 'warning' }
  )
  await permissionUserApi.remove.deleteById(row.userId as string | number)
}

function openEdit(row: PermissionUserTableRow) {
  formMode.value = 'edit'
  formRecord.value = { ...row }
  formVisible.value = true
}

const {
  actions,
  columns,
  filters,
  handleLoadSuccess,
  loadData,
  queryModel,
  reset,
  search,
  searchCfg,
  tableRef
} = useList(selectedDeptId, {
  onEdit: openEdit,
  onDelete: deleteOne
})

const reloadTable = () => {
  tableRef.value?.refresh()
}

const openAdd = () => {
  formMode.value = 'add'
  formRecord.value = {
    deptId: selectedDeptId.value
  } as PermissionUserRecord
  formVisible.value = true
}

const onDeptNode = (node: PermissionDeptRecord) => {
  selectedDeptId.value = node.id
  reloadTable()
}

onMounted(() => {
  void loadDeptAndRoles()
})
</script>

<style scoped lang="scss">
.permission-user__tree {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
  padding: 8px;
  min-height: 400px;
  margin-bottom: 12px;
}
.permission-user__table {
  margin-top: 8px;
}
</style>
