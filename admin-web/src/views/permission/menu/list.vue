<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ t('permission.menu.title') }}</h1>
        <p>{{ t('permission.menu.description') }}</p>
      </div>
    </div>

    <el-table
      v-loading="loading"
      :data="menuList"
      row-key="id"
      border
      default-expand-all
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="name" :label="t('permission.menu.columns.name')" min-width="180" show-overflow-tooltip />
      <el-table-column prop="icon" :label="t('permission.menu.columns.icon')" width="100" align="center">
        <template #default="{ row }">
          <i v-if="row.icon" :class="row.icon" />
          <span v-else>—</span>
        </template>
      </el-table-column>
      <el-table-column prop="sort" :label="t('permission.menu.columns.sort')" width="72" align="center" />
      <el-table-column prop="path" :label="t('permission.menu.columns.path')" min-width="160" show-overflow-tooltip />
      <el-table-column prop="type" :label="t('permission.menu.columns.type')" width="100" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.type === '0'" type="success">{{ t('permission.menu.type.left') }}</el-tag>
          <el-tag v-else-if="row.type === '2'" type="success">{{ t('permission.menu.type.top') }}</el-tag>
          <el-tag v-else-if="row.type === '1'" type="info">{{ t('permission.menu.type.button') }}</el-tag>
          <span v-else>{{ t('permission.menu.type.unknown') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="keepAlive" :label="t('permission.menu.columns.cache')" width="88" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.keepAlive === '1'" type="success">{{ t('permission.menu.cacheOn') }}</el-tag>
          <el-tag v-else type="info">{{ t('permission.menu.cacheOff') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="permission" :label="t('permission.menu.columns.permission')" min-width="160" show-overflow-tooltip />
      <el-table-column :label="t('permission.menu.columns.ops')" width="100" align="center" fixed="right">
        <template #default="{ row }">
          <el-button v-uni-permission="'sys_menu_edit'" type="primary" link @click="openEdit(row)">
            {{ t('permission.actions.edit') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="t('permission.menu.editTitle')" width="520px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="96px">
        <el-form-item :label="t('permission.menu.parent')" prop="parentId">
          <el-select v-model="form.parentId" filterable class="w100" :placeholder="t('permission.menu.parent')">
            <el-option
              v-for="opt in parentOptions"
              :key="String(opt.value)"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('permission.menu.icon')" prop="icon">
          <el-input v-model="form.icon" clearable :placeholder="t('permission.menu.icon')" />
        </el-form-item>
        <el-form-item :label="t('permission.menu.name')" prop="name">
          <el-input v-model="form.name" clearable :placeholder="t('permission.menu.name')" />
        </el-form-item>
        <el-form-item :label="t('permission.menu.sort')" prop="sort">
          <el-input-number v-model="form.sort" :min="0" controls-position="right" class="w100" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('permission.actions.cancel') }}</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">{{ t('permission.actions.save') }}</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import { useUniI18n } from 'uni-ui-lib'

import { permissionMenuApi } from '@/api'
import type { PermissionMenuNode } from '@/types/modules/permission-menu'

const { t } = useUniI18n()

const loading = ref(false)
const menuList = ref<PermissionMenuNode[]>([])
const dialogVisible = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()

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

const rules = computed<FormRules>(() => ({
  name: [{ required: true, message: t('permission.menu.name'), trigger: 'blur' }],
  sort: [{ required: true, message: t('permission.menu.sort'), trigger: 'change' }]
}))

const flattenParents = (nodes: PermissionMenuNode[], depth = 0): { label: string; value: string | number }[] => {
  const pad = '\u3000'.repeat(depth)
  const acc: { label: string; value: string | number }[] = []
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

const parentOptions = computed(() => {
  const root = { label: t('permission.menu.rootParent'), value: -1 }
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

const submit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }
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
</script>

<style scoped lang="scss">
.w100 {
  width: 100%;
}
</style>
