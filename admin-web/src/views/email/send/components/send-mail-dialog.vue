<template>
  <el-dialog v-model="visible" :title="title" width="560px" destroy-on-close>
    <UniForm ref="uniFormRef" v-model="form" mode="edit" :config="formConfig" />
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('common.submit') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { UniFormConfig, UniOption } from 'uni-ui-lib'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import { ElMessage } from 'element-plus'
import { computed, ref, watch } from 'vue'

import { bulkEmailApi } from '@/api'

import { normalizeEnvelope, normalizePaged } from '@/utils/api-response-normalize'

type Loose = Record<string, unknown>

export type SendMailFormModel = {
  userMailinfoId: string | number
  userIds: string[]
  email: string
  mailgroupIds: (string | number)[]
  status: string
}

const props = defineProps<{
  mode: 'add' | 'edit'
}>()

const emit = defineEmits<{
  success: []
}>()

const visible = defineModel<boolean>({ required: true })
const form = defineModel<SendMailFormModel>('form', { required: true })

const { t } = useUniI18n()
const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const userOptions = ref<{ userId: string | number; username: string }[]>([])
const groupOptions = ref<{ id: string | number; name: string }[]>([])

const title = computed(() =>
  props.mode === 'add' ? t('email.send.dialogAdd') : t('email.send.dialogEdit')
)

const userUniOptions = computed<UniOption[]>(() =>
  userOptions.value.map((u) => ({
    label: u.username,
    value: String(u.userId)
  }))
)

const groupUniOptions = computed<UniOption[]>(() =>
  groupOptions.value.map((g) => ({
    label: g.name,
    value: g.id
  }))
)

const statusRadios = computed<UniOption[]>(() => [
  { label: t('email.statusActive'), value: '1' },
  { label: t('email.statusArchived'), value: '0' }
])

const formConfig = computed<UniFormConfig>(() => ({
  formProps: { labelWidth: '120px' },
  colProps: { span: 24 },
  rules: {
    userIds: [{ required: true, message: () => t('email.send.ruleUsers'), trigger: 'change' }],
    email: [{ required: true, message: () => t('email.send.ruleEmail'), trigger: 'blur' }],
    status: [{ required: true, message: () => t('email.send.ruleStatus'), trigger: 'change' }]
  } as UniFormConfig['rules'],
  schema: [
    {
      field: 'userIds',
      label: t('email.send.colUsers'),
      component: 'ElSelect',
      options: userUniOptions.value,
      componentProps: {
        multiple: true,
        filterable: true,
        clearable: true,
        style: { width: '100%' },
        class: 'email-send-dialog__full'
      }
    },
    {
      field: 'email',
      label: t('email.send.colEmail365'),
      component: 'ElInput',
      componentProps: { clearable: true }
    },
    {
      field: 'mailgroupIds',
      label: t('email.send.assignGroups'),
      component: 'ElSelect',
      options: groupUniOptions.value,
      componentProps: {
        multiple: true,
        filterable: true,
        clearable: true,
        style: { width: '100%' },
        class: 'email-send-dialog__full'
      }
    },
    {
      field: 'status',
      label: t('email.status'),
      component: 'ElRadioGroup',
      options: statusRadios.value
    }
  ]
}))

const loadOptions = async () => {
  const [usersRaw, groupsRaw] = await Promise.all([
    bulkEmailApi.userMailinfoAllUsers.get(),
    bulkEmailApi.groupPage.get({ current: 1, size: 9999, status: 1 })
  ])
  const uEnv = normalizeEnvelope(usersRaw)
  const arr = Array.isArray(uEnv)
    ? uEnv
    : Array.isArray((uEnv as Loose).data)
      ? ((uEnv as Loose).data as unknown[])
      : []
  userOptions.value = arr.map((x: Loose) => ({
    userId: x.userId as string | number,
    username: String(x.username ?? '')
  }))
  const { list } = normalizePaged(groupsRaw)
  groupOptions.value = list.map((r) => ({
    id: r.id as string | number,
    name: String(r.name ?? '')
  }))
}

watch(visible, (vis) => {
  if (vis) {
    void loadOptions()
  }
})

const submit = async () => {
  try {
    await uniFormRef.value?.validate()
  } catch {
    throw new Error('validation')
  }
  try {
    await bulkEmailApi.userMailinfoSaveRelations.post({
      userMailinfoId: form.value.userMailinfoId || '',
      userIds: form.value.userIds.join(','),
      email: form.value.email,
      mailgroupIds: form.value.mailgroupIds.map(String).join(','),
      status: form.value.status
    })
    ElMessage.success(t('email.opOk'))
    visible.value = false
    emit('success')
  } catch {
    ElMessage.error(t('email.opFail'))
  }
}
</script>

<style scoped lang="scss">
.email-send-dialog__full {
  width: 100%;
}
</style>
