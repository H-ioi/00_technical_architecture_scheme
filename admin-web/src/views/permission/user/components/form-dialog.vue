<template>
  <el-dialog
    :model-value="visible"
    destroy-on-close
    width="520px"
    :title="mode === 'add' ? t('permission.user.formAdd') : t('permission.user.formEdit')"
    @update:model-value="$emit('update:visible', $event)">
    <UniForm ref="uniFormRef" v-model="formModel" mode="edit" :config="dialogFormConfig" />
    <template #footer>
      <el-button @click="$emit('update:visible', false)">{{
        t('permission.actions.cancel')
      }}</el-button>
      <el-button type="primary" :loading="saving" @click="submit">{{
        t('permission.actions.save')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { UniFormConfig, UniOption } from 'uni-ui-lib'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import { computed, nextTick, ref, watch } from 'vue'

import { permissionUserDialogForm } from '../list.config'

import { permissionUserApi } from '@/api'
import type { PermissionUserFormModel, PermissionUserRecord } from '@/types/modules/permission-user'

const props = defineProps<{
  visible: boolean
  mode: 'add' | 'edit'
  record: PermissionUserRecord | null
  deptOptions: UniOption[]
  roleOptions: UniOption[]
}>()
const emit = defineEmits<{ (e: 'update:visible', v: boolean): void; (e: 'saved'): void }>()
const { t } = useUniI18n()

const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const saving = ref(false)

const emptyModel = (): PermissionUserFormModel => ({
  username: '',
  nickname: '',
  password: '',
  email: '',
  phone: '',
  deptId: undefined,
  role: [],
  lockFlag: '0'
})

const formModel = ref<PermissionUserFormModel>(emptyModel())

const dialogFormConfig = computed<UniFormConfig>(() =>
  permissionUserDialogForm(t, props.deptOptions, props.roleOptions, props.mode)
)

const resetForAdd = () => {
  formModel.value = {
    ...emptyModel(),
    deptId: props.record?.deptId
  }
}

const hydrateFromRecord = (r: PermissionUserRecord) => {
  formModel.value = {
    ...emptyModel(),
    userId: r.userId,
    username: r.username ?? '',
    nickname: r.nickname ?? '',
    email: r.email ?? '',
    phone: typeof r.phone === 'string' && r.phone.includes('*') ? '' : (r.phone ?? ''),
    deptId: r.deptId,
    lockFlag: r.lockFlag ?? '0',
    role: Array.isArray(r.roleList)
      ? (r.roleList.map((x) => x.roleId).filter((x) => x !== undefined && x !== null) as (
          | string
          | number
        )[])
      : []
  }
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
    void nextTick(() => {
      uniFormRef.value?.clearValidate()
    })
  }
)

const submit = async () => {
  try {
    await uniFormRef.value?.validate()
  } catch {
    return
  }

  saving.value = true
  try {
    const body: Record<string, unknown> = { ...formModel.value }
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
