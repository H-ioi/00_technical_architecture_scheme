<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ t('permission.role.title') }}</h1>
        <p>{{ t('permission.role.description') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'sys_role_add'" type="primary" @click="openForm('add')">
          {{ t('permission.add') }}
        </el-button>
      </div>
    </div>
    <div class="uni-list-page__body">
      <UniSearchForm
        v-model="queryModel"
        :config="searchCfg"
        :collapsed="true"
        :collapsed-rows="1"
        :action-min-span="0"
        :submit-text="t('permission.search')"
        :reset-text="t('permission.reset')"
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
        :action-column="{ width: 180, fixed: 'right' }"
        @load-success="tableEmpty.onLoadSuccess"
        @request-error="tableEmpty.onRequestError">
        <template #empty>
          <ListTableEmpty :kind="tableEmpty.kind" @reset="reset" @retry="tableEmpty.retry" />
        </template>
      </UniDataTable>
    </div>
    <AssignMenuDialog
      v-model:visible="assignVisible"
      :role-id="assignRole?.roleId"
      @saved="refreshTable" />

    <el-dialog
      v-model="roleFormVisible"
      destroy-on-close
      width="640px"
      :title="
        roleFormMode === 'add' ? t('permission.role.formAdd') : t('permission.role.formEdit')
      ">
      <UniForm ref="uniFormRef" v-model="roleForm" mode="edit" :config="roleFormConfig">
        <template #field-deptIds>
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
        </template>
      </UniForm>
      <template #footer>
        <el-button @click="roleFormVisible = false">{{ t('permission.cancel') }}</el-button>
        <el-button type="primary" :loading="roleSaving" @click="saveRole">
          {{ t('permission.save') }}
        </el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import AssignMenuDialog from './components/assign-menu-dialog.vue'
import { dpTypeOptions, searchForm, tableCols } from './list.config'
import { permissionDeptApi, permissionRoleApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { PermissionDeptRecord } from '@/types/modules/permission-dept'
import type { PermissionRoleRecord as Row } from '@/types/modules/permission-role'
import { normalizePaged } from '@/utils/api-response-normalize'
import type { ElTree } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UniFormConfig, UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { UniDataTable, UniForm, UniSearchForm, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, nextTick, reactive, ref } from 'vue'

const { t } = useUniI18n()

const assignVisible = ref(false)
const assignRole = ref<Row | null>(null)

const roleFormVisible = ref(false)
const roleFormMode = ref<'add' | 'edit'>('add')
const roleSaving = ref(false)
const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
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

const roleFormConfig = computed<UniFormConfig>(() => ({
  formProps: { labelWidth: '108px' },
  colProps: { span: 24 },
  rules: {
    roleName: [{ required: true, message: t('permission.role.colName'), trigger: 'blur' }],
    roleCode: [{ required: true, message: t('permission.role.colCode'), trigger: 'blur' }],
    dpType: [{ required: true, message: t('permission.role.colDpType'), trigger: 'change' }]
  } as UniFormConfig['rules'],
  schema: [
    {
      field: 'roleName',
      label: t('permission.role.colName'),
      component: 'ElInput',
      componentProps: { clearable: true, maxlength: 40 }
    },
    {
      field: 'roleCode',
      label: t('permission.role.colCode'),
      component: 'ElInput',
      componentProps: {
        disabled: roleFormMode.value === 'edit',
        clearable: true,
        maxlength: 40
      }
    },
    {
      field: 'roleDesc',
      label: t('permission.role.colDesc'),
      component: 'ElInput',
      componentProps: { type: 'textarea', maxlength: 128, rows: 3 }
    },
    {
      field: 'dpType',
      label: t('permission.role.colDpType'),
      component: 'ElSelect',
      options: dpOptions.value,
      componentProps: { filterable: true, class: 'perm-role-scope-select' }
    },
    {
      field: 'deptIds',
      label: t('permission.role.dpCustom'),
      component: 'ElInput',
      hidden: roleForm.dpType !== 6,
      formItemProps: { class: 'perm-role-dept-tree-item' }
    }
  ]
}))

const dpOptions = computed(() => dpTypeOptions(t))

async function deleteRole(row: Row) {
  await ElMessageBox.confirm(
    t('permission.messages.deleteRoleConfirm', { name: row.roleName ?? row.roleCode ?? '' }),
    t('permission.delete'),
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
  const ok = await uniFormRef.value?.validate().catch(() => false)
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
    void refreshTable()
  } finally {
    roleSaving.value = false
  }
}

const onAssign = (row) => {
  assignRole.value = row
  assignVisible.value = true
}

const initialFilters = { roleName: '', roleCode: '', dpType: undefined as number | undefined }
const { queryModel, filters, tableRef, search, reset, handleLoadSuccess, refreshTable } =
  useUniListState({
    initialFilters
  })

const dpOpts = computed(() => dpTypeOptions(t))
const searchCfg = computed(() => searchForm(t, dpOpts.value))
const columns = computed(() => tableCols(t))

const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const raw = await permissionRoleApi.page.get({
    current: pageNo,
    size: pageSize,
    ...f
  })
  const { list, total } = normalizePaged<Row>(raw)
  return { data: list, total }
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('permission.edit'),
    onClick: (row) => openForm('edit', row as Row)
  },
  {
    label: t('permission.assignMenu'),
    onClick: (row) => onAssign(row as Row)
  },
  {
    label: t('permission.delete'),
    onClick: async (row) => {
      await deleteRole(row as Row)
      tableRef.value?.refresh()
    }
  }
])

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })
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
