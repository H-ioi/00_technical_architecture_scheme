<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ t('permission.role.title') }}</h1>
        <p>{{ t('permission.role.description') }}</p>
      </div>
      <el-button v-uni-permission="'sys_role_add'" type="primary" @click="openForm('add')">
        {{ t('permission.actions.add') }}
      </el-button>
    </div>

    <UniSearchForm
      v-model="queryModel"
      :config="searchConfig"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="t('permission.actions.search')"
      :reset-text="t('permission.actions.reset')"
      @search="search"
      @reset="reset" />

    <UniDataTable
      ref="tableRef"
      row-key="roleId"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 20, pageSizes: [10, 20, 50] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 220, fixed: 'right' }"
      @load-success="handleLoadSuccess" />

    <AssignMenuDialog
      v-model:visible="assignVisible"
      :role-id="assignRole?.roleId"
      @saved="reloadTable" />

    <el-dialog
      v-model="roleFormVisible"
      destroy-on-close
      width="640px"
      :title="
        roleFormMode === 'add' ? t('permission.role.formAdd') : t('permission.role.formEdit')
      ">
      <el-form ref="roleFormRef" :model="roleForm" :rules="roleRules" label-width="108px">
        <el-form-item :label="t('permission.role.columns.name')" prop="roleName">
          <el-input v-model="roleForm.roleName" clearable maxlength="40" />
        </el-form-item>
        <el-form-item :label="t('permission.role.columns.code')" prop="roleCode">
          <el-input
            v-model="roleForm.roleCode"
            :disabled="roleFormMode === 'edit'"
            clearable
            maxlength="40" />
        </el-form-item>
        <el-form-item :label="t('permission.role.columns.desc')" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc" type="textarea" maxlength="128" :rows="3" />
        </el-form-item>
        <el-form-item :label="t('permission.role.columns.dpType')" prop="dpType">
          <el-select v-model.number="roleForm.dpType" class="perm-role-scope-select" filterable>
            <el-option
              v-for="o in dpOptions"
              :key="String(o.value)"
              :label="o.label"
              :value="Number(o.value)" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="roleForm.dpType === 6">
          <template #label>
            <span>{{ t('permission.role.dpCustom') }}</span>
          </template>
          <p class="perm-role-scope-hint">{{ t('permission.messages.deptScopeHint') }}</p>
          <el-tree
            ref="scopeTreeRef"
            :data="deptScopeTree"
            show-checkbox
            node-key="id"
            highlight-current
            default-expand-all
            check-strictly
            :props="{ label: 'name', children: 'children' }" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="roleFormVisible = false">{{ t('permission.actions.cancel') }}</el-button>
        <el-button type="primary" :loading="roleSaving" @click="saveRole">{{
          t('permission.actions.save')
        }}</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type { ElTree } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, nextTick, reactive, ref } from 'vue'
import { UniDataTable, UniSearchForm, useUniI18n } from 'uni-ui-lib'

import { permissionDeptApi, permissionRoleApi } from '@/api'
import type { PermissionDeptRecord } from '@/types/modules/permission-dept'
import type { PermissionRoleRecord as Row } from '@/types/modules/permission-role'

import AssignMenuDialog from './components/assign-menu-dialog.vue'
import { dpTypeOptions } from './list.config'
import { useList } from './use-list'

const { t } = useUniI18n()

const assignVisible = ref(false)
const assignRole = ref<Row | null>(null)

const roleFormVisible = ref(false)
const roleFormMode = ref<'add' | 'edit'>('add')
const roleSaving = ref(false)
const roleFormRef = ref<FormInstance>()
const scopeTreeRef = ref<InstanceType<typeof ElTree>>()
const deptScopeTree = ref<PermissionDeptRecord[]>([])

const roleForm = reactive<Row>({
  roleName: '',
  roleCode: '',
  roleDesc: '',
  dpType: 5,
  dictItemMap: {},
  templateIds: [],
  deptIds: []
})

const roleRules = computed<FormRules>(() => ({
  roleName: [{ required: true, message: t('permission.role.columns.name'), trigger: 'blur' }],
  roleCode: [{ required: true, message: t('permission.role.columns.code'), trigger: 'blur' }],
  dpType: [{ required: true, message: t('permission.role.columns.dpType'), trigger: 'change' }]
}))

const dpOptions = computed(() => dpTypeOptions(t))

async function deleteRole(row: Row) {
  await ElMessageBox.confirm(
    t('permission.messages.deleteRoleConfirm', { name: row.roleName ?? row.roleCode ?? '' }),
    t('permission.actions.delete'),
    { type: 'warning' }
  )
  await permissionRoleApi.remove.deleteById(row.roleId as string | number)
}

async function openForm(mode: 'add' | 'edit', row?: Row) {
  roleFormMode.value = mode
  const tree = await permissionDeptApi.tree.get()
  deptScopeTree.value = Array.isArray(tree) ? tree : []

  if (mode === 'add') {
    Object.assign(roleForm, {
      roleId: undefined,
      roleName: '',
      roleCode: '',
      roleDesc: '',
      dpType: 5,
      dictItemMap: {},
      templateIds: [],
      deptIds: []
    })
  } else if (row) {
    Object.assign(roleForm, {
      ...row,
      dictItemMap: row.dictItemMap ?? {},
      templateIds: Array.isArray(row.templateIds) ? row.templateIds : [],
      deptIds: Array.isArray(row.deptIds) ? [...row.deptIds] : []
    })
  }

  roleFormVisible.value = true

  await nextTick()
  const treeVm = scopeTreeRef.value
  if (treeVm && roleForm.dpType === 6) {
    const keys = Array.isArray(roleForm.deptIds) ? roleForm.deptIds : []
    treeVm.setCheckedKeys(keys as never[])
  } else if (treeVm) {
    treeVm.setCheckedKeys([])
  }
}

async function saveRole() {
  const ok = await roleFormRef.value?.validate().catch(() => false)
  if (!ok) {
    return
  }

  let deptIds: unknown[] = []
  if (roleForm.dpType === 6) {
    deptIds = (scopeTreeRef.value?.getCheckedKeys?.() ?? []) as unknown[]
    if (!deptIds.length) {
      ElMessage.warning(t('permission.messages.customDeptWarn'))
      return
    }
  }

  const body = {
    ...roleForm,
    deptIds,
    dictItemMap: roleForm.dictItemMap ?? {},
    templateIds: roleForm.templateIds ?? []
  }

  roleSaving.value = true
  try {
    if (roleFormMode.value === 'add') {
      await permissionRoleApi.add.post(body)
    } else {
      await permissionRoleApi.update.put(body)
    }
    ElMessage.success(t('permission.messages.saveOk'))
    roleFormVisible.value = false
    reloadTable()
  } finally {
    roleSaving.value = false
  }
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
  searchConfig,
  tableRef
} = useList({
  onEdit: openForm,
  onAssign: (row) => {
    assignRole.value = row
    assignVisible.value = true
  },
  onDelete: deleteRole
})

const reloadTable = () => {
  tableRef.value?.refresh()
}
</script>

<style scoped lang="scss">
.perm-role-scope-select {
  width: 100%;
}
.perm-role-scope-hint {
  margin: 0 0 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
