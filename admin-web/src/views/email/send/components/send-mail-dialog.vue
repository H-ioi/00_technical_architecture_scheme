<template>
  <el-dialog v-model="visible" :title="title" width="560px" destroy-on-close>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item :label="$t('email.send.colUsers')" prop="userIds">
        <el-select
          v-model="form.userIds"
          multiple
          filterable
          clearable
          class="email-send-dialog__full"
        >
          <el-option
            v-for="u in userOptions"
            :key="String(u.userId)"
            :label="u.username"
            :value="String(u.userId)"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('email.send.colEmail365')" prop="email">
        <el-input v-model="form.email" clearable />
      </el-form-item>
      <el-form-item :label="$t('email.send.assignGroups')" prop="mailgroupIds">
        <el-select
          v-model="form.mailgroupIds"
          multiple
          filterable
          clearable
          class="email-send-dialog__full"
        >
          <el-option v-for="g in groupOptions" :key="String(g.id)" :label="g.name" :value="g.id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('email.status')" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="1">{{ $t('email.statusActive') }}</el-radio>
          <el-radio label="0">{{ $t('email.statusArchived') }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('common.submit') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { computed, ref, watch } from 'vue'

import { bulkEmailApi } from '@/api'
import { useUniI18n } from 'uni-ui-lib'

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
const formRef = ref<FormInstance>()
const userOptions = ref<{ userId: string | number; username: string }[]>([])
const groupOptions = ref<{ id: string | number; name: string }[]>([])

const title = computed(() =>
  props.mode === 'add' ? t('email.send.dialogAdd') : t('email.send.dialogEdit')
)

const rules: FormRules = {
  userIds: [{ required: true, message: () => t('email.send.ruleUsers'), trigger: 'change' }],
  email: [{ required: true, message: () => t('email.send.ruleEmail'), trigger: 'blur' }],
  status: [{ required: true, message: () => t('email.send.ruleStatus'), trigger: 'change' }]
}

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
  await formRef.value?.validate().catch(() => {
    throw new Error('validation')
  })
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
