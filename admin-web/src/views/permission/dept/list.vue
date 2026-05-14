<template>
  <section class="uni-list-page permission-dept">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ t('permission.dept.title') }}</h1>
        <p>{{ t('permission.dept.description') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button-group>
          <el-button v-uni-permission="'sys_dept_add'" type="primary" @click="handlerAdd">
            {{ t('permission.addDept') }}
          </el-button>
          <el-button v-uni-permission="'sys_dept_edit'" type="primary" @click="handlerEdit">
            {{ t('permission.updateDept') }}
          </el-button>
          <el-button v-uni-permission="'sys_dept_del'" type="primary" @click="handleDelete">
            {{ t('permission.deptDelete') }}
          </el-button>
        </el-button-group>
      </div>
    </div>

    <el-row :gutter="16" class="permission-dept__body">
      <el-col :xs="24" :sm="8">
        <el-tree
          :data="treeData"
          :props="treeProps"
          node-key="id"
          highlight-current
          default-expand-all
          class="permission-dept__tree"
          @node-click="onNodeClick" />
      </el-col>
      <el-col :xs="24" :sm="16">
        <el-card shadow="never">
          <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
            <el-form-item :label="t('permission.dept.parent')" prop="parentId">
              <el-input v-model="form.parentId" disabled />
            </el-form-item>
            <el-form-item v-if="formEdit" :label="t('permission.dept.code')" prop="deptId">
              <el-input v-model="form.deptId" disabled />
            </el-form-item>
            <el-form-item :label="t('permission.dept.name')" prop="name">
              <el-input
                v-model="form.name"
                :disabled="formEdit"
                :placeholder="t('permission.dept.name')" />
            </el-form-item>
            <el-form-item :label="t('permission.dept.sort')" prop="sort">
              <el-input
                v-model="form.sort"
                :disabled="formEdit"
                type="number"
                :placeholder="t('permission.dept.sort')" />
            </el-form-item>
            <el-form-item v-if="formStatus === 'update'">
              <el-button type="primary" @click="update">{{
                t('permission.deptUpdate')
              }}</el-button>
              <el-button @click="onCancel">{{ t('permission.cancel') }}</el-button>
            </el-form-item>
            <el-form-item v-if="formStatus === 'create'">
              <el-button type="primary" @click="create">{{
                t('permission.saveDept')
              }}</el-button>
              <el-button @click="onCancel">{{ t('permission.cancel') }}</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import { useUniI18n } from 'uni-ui-lib'

import { permissionDeptApi } from '@/api'
import type { PermissionDeptRecord } from '@/types/modules/permission-dept'

const { t } = useUniI18n()

const treeData = ref<PermissionDeptRecord[]>([])
const treeProps = { children: 'children', label: 'name' }
const formRef = ref<FormInstance>()
const formEdit = ref(true)
const formStatus = ref<'create' | 'update' | ''>('')
const currentId = ref<string | number | undefined>(undefined)

const form = reactive<PermissionDeptRecord>({
  parentId: undefined,
  deptId: undefined,
  name: '',
  sort: undefined
})

const rules = computed<FormRules>(() => {
  const r: FormRules = {
    parentId: [{ required: true, message: t('permission.dept.parent'), trigger: 'blur' }],
    name: [
      { required: true, message: t('permission.dept.name'), trigger: 'blur' },
      { min: 2, max: 50, message: '2-50', trigger: 'blur' }
    ],
    sort: [{ required: true, message: t('permission.dept.sort'), trigger: 'blur' }]
  }
  if (formStatus.value === 'update') {
    r.deptId = [{ required: true, message: t('permission.dept.code'), trigger: 'blur' }]
  }
  return r
})

const loadTree = async () => {
  try {
    const data = await permissionDeptApi.tree.get()
    treeData.value = Array.isArray(data) ? data : []
  } catch {
    ElMessage.error(t('permission.messages.deptLoadErr'))
  }
}

const onNodeClick = async (data: PermissionDeptRecord) => {
  if (!data.id) {
    return
  }
  if (!formEdit.value) {
    formStatus.value = 'update'
  }
  const detail = await permissionDeptApi.get.getById(data.id)
  Object.assign(form, detail)
  currentId.value = data.id
}

const resetForm = () => {
  form.parentId = currentId.value ?? undefined
  form.deptId = undefined
  form.name = ''
  form.sort = undefined
}

const handlerAdd = () => {
  resetForm()
  formEdit.value = false
  formStatus.value = 'create'
}

const handlerEdit = () => {
  if (!form.deptId) {
    ElMessage.warning(t('permission.messages.pickDeptErr'))
    return
  }
  formEdit.value = false
  formStatus.value = 'update'
}

const onCancel = () => {
  formEdit.value = true
  formStatus.value = ''
}

const create = async () => {
  const ok = await formRef.value?.validate().catch(() => false)
  if (!ok) {
    return
  }
  await permissionDeptApi.add.post(form)
  ElMessage.success(t('permission.messages.saveOk'))
  await loadTree()
  onCancel()
}

const update = async () => {
  const ok = await formRef.value?.validate().catch(() => false)
  if (!ok) {
    return
  }
  await permissionDeptApi.update.put(form)
  ElMessage.success(t('permission.messages.saveOk'))
  await loadTree()
  onCancel()
}

const handleDelete = async () => {
  if (currentId.value === undefined || currentId.value === null) {
    ElMessage.warning(t('permission.messages.pickDeptErr'))
    return
  }
  await ElMessageBox.confirm(t('permission.messages.deleteDeptConfirm'), '', { type: 'warning' })
  await permissionDeptApi.remove.deleteById(currentId.value)
  ElMessage.success(t('permission.messages.saveOk'))
  await loadTree()
  Object.assign(form, { parentId: undefined, deptId: undefined, name: '', sort: undefined })
  onCancel()
}

onMounted(() => {
  void loadTree()
})
</script>

<style scoped lang="scss">
.permission-dept__tree {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
  padding: 8px;
  min-height: 360px;
}
</style>
