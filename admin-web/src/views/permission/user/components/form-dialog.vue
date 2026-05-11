<template>
  <el-dialog
    :model-value="visible"
    destroy-on-close
    width="520px"
    :title="mode === 'add' ? t('permission.user.formAdd') : t('permission.user.formEdit')"
    @update:model-value="$emit('update:visible', $event)"
  >
    <el-form ref="formRef" :model="model" :rules="rules" label-width="92px">
      <el-form-item :label="t('permission.user.columns.username')" prop="username">
        <el-input v-model="model.username" :disabled="mode === 'edit'" autocomplete="username" maxlength="50" />
      </el-form-item>
      <el-form-item :label="t('permission.user.columns.nickname')" prop="nickname">
        <el-input v-model="model.nickname" autocomplete="off" maxlength="20" />
      </el-form-item>
      <el-form-item :label="t('permission.user.placeholders.password')" prop="password">
        <el-input v-model="model.password" show-password maxlength="40" autocomplete="new-password" />
      </el-form-item>
      <el-form-item :label="t('permission.user.columns.email')" prop="email">
        <el-input v-model="model.email" autocomplete="email" maxlength="80" />
      </el-form-item>
      <el-form-item :label="t('permission.user.columns.phone')" prop="phone">
        <el-input v-model="model.phone" maxlength="11" />
      </el-form-item>
      <el-form-item :label="t('permission.user.columns.dept')" prop="deptId">
        <el-select v-model="model.deptId" filterable clearable class="perm-user-fullw">
          <el-option v-for="o in deptOptions" :key="String(o.value)" :label="o.label" :value="o.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('permission.user.columns.roles')" prop="role">
        <el-select v-model="model.role" multiple filterable collapse-tags class="perm-user-fullw">
          <el-option v-for="o in roleOptions" :key="String(o.value)" :label="o.label" :value="o.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('permission.user.columns.status')" prop="lockFlag">
        <el-radio-group v-model="model.lockFlag">
          <el-radio label="0">{{ t('permission.user.statusActive') }}</el-radio>
          <el-radio label="9">{{ t('permission.user.statusLocked') }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('update:visible', false)">{{ t('permission.actions.cancel') }}</el-button>
      <el-button type="primary" :loading="saving" @click="submit">{{ t('permission.actions.save') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { computed, reactive, ref, watch } from 'vue'
import { useUniI18n } from 'uni-ui-lib'

import { permissionUserApi } from '@/api'
import type { PermissionUserRecord } from '@/types/modules/permission-user'

interface Option {
  label: string
  value: string | number
}

const props = defineProps<{
  visible: boolean
  mode: 'add' | 'edit'
  record: PermissionUserRecord | null
  deptOptions: Option[]
  roleOptions: Option[]
}>()
const emit = defineEmits<{ (e: 'update:visible', v: boolean): void; (e: 'saved'): void }>()
const { t } = useUniI18n()

const formRef = ref<FormInstance>()
const saving = ref(false)

type FormModel = {
  userId?: string | number
  username?: string
  nickname?: string
  password?: string
  email?: string
  phone?: string
  deptId?: string | number
  /** 提交给后端与旧页一致：`role` 为角色 id 数组 */
  role: (string | number)[]
  lockFlag: string
}

const model = reactive<FormModel>({
  username: '',
  nickname: '',
  password: '',
  email: '',
  phone: '',
  deptId: undefined,
  role: [],
  lockFlag: '0'
})

const rules = computed<FormRules>(() => ({
  username: [{ required: true, message: t('permission.user.columns.username'), trigger: 'blur' }],
  deptId: [{ required: true, message: t('permission.user.placeholders.dept'), trigger: 'change' }],
  role: [{ required: true, message: t('permission.user.placeholders.role'), trigger: 'change', type: 'array' }]
}))

const resetForAdd = () => {
  model.userId = undefined
  model.username = ''
  model.nickname = ''
  model.password = ''
  model.email = ''
  model.phone = ''
  model.deptId = props.record?.deptId
  model.role = []
  model.lockFlag = '0'
}

const hydrateFromRecord = (r: PermissionUserRecord) => {
  model.userId = r.userId
  model.username = r.username
  model.nickname = r.nickname
  model.password = ''
  model.email = r.email ?? ''
  model.phone = typeof r.phone === 'string' && r.phone.includes('*') ? '' : (r.phone ?? '')
  model.deptId = r.deptId
  model.lockFlag = r.lockFlag ?? '0'
  model.role =
    Array.isArray(r.roleList) ? r.roleList.map((x) => x.roleId).filter((x) => x !== undefined && x !== null) : []
}

watch(
  () => [props.visible, props.mode, props.record] as const,
  ([open]) => {
    if (!open) {
      return
    }
    if (props.mode === 'edit' && props.record) {
      hydrateFromRecord(props.record)
    } else {
      resetForAdd()
    }
    queueMicrotask(() => formRef.value?.clearValidate?.())
  }
)

const submit = async () => {
  const ok = await formRef.value?.validate().catch(() => false)
  if (!ok) {
    return
  }

  saving.value = true
  try {
    const body: Record<string, unknown> = { ...model }
    if (props.mode === 'edit') {
      if (!body.password) {
        delete body.password
      }
      await permissionUserApi.update.put(body)
    } else {
      await permissionUserApi.add.post(body)
    }
    ElMessage.success(t('permission.messages.saveOk'))
    emit('update:visible', false)
    emit('saved')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped lang="scss">
.perm-user-fullw {
  width: 100%;
}
</style>
