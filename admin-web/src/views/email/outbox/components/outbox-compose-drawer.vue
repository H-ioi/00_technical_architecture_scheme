<template>
  <el-drawer
    v-model="visible"
    :title="drawerTitle"
    direction="rtl"
    size="min(720px, 92vw)"
    destroy-on-close
    class="email-compose-drawer"
    append-to-body
    @closed="onDrawerClosed">
    <div class="email-compose-drawer__inner">
      <UniForm
        ref="uniFormRef"
        v-model="form"
        mode="edit"
        class="email-compose-form"
        :config="composeFormConfig" />
      <div class="email-compose-editor">
        <UniEditor
          v-model="contentHtml"
          class="email-compose-uni-editor"
          height="min(360px, 38vh)"
          :placeholder="contentPlaceholder" />
      </div>
    </div>

    <template #footer>
      <div class="email-compose-drawer__footer">
        <el-button @click="visible = false">{{ $t('common.close') }}</el-button>
        <el-button :loading="submitting" @click="onSubmit(0)">{{
          $t('email.outbox.saveDraft')
        }}</el-button>
        <el-button type="primary" :loading="submitting" @click="onSubmit(1)">
          {{ $t('email.outbox.sendNow') }}
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import type { UniFormConfig, UniOption } from 'uni-ui-lib'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'

import UniEditor from '@/components/uni-editor/index.vue'
import type { Translate } from '@/types/i18n'

type Loose = Record<string, unknown>

const props = defineProps<{
  mode: 'add' | 'edit'
  mailSenderOptions: Loose[]
  mailGroupOptions: Loose[]
  submitting: boolean
}>()

const emit = defineEmits<{
  submit: [status: 0 | 1]
}>()

const visible = defineModel<boolean>({ required: true })
const form = defineModel<Loose>('form', { required: true })

const { t } = useUniI18n()
const tr = t as Translate

const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)

type UniFormExpose = {
  validate?: () => Promise<unknown>
  validateField?: (prop: string | string[]) => Promise<void>
  resetFields?: () => void
}

const uniFormExpose = () => uniFormRef.value as unknown as UniFormExpose | null

const senderOpts = computed<UniOption[]>(() =>
  props.mailSenderOptions.map((u) => ({
    label: String(u.email ?? u.id),
    value: u.id as string | number
  }))
)

const groupOpts = computed<UniOption[]>(() =>
  props.mailGroupOptions.map((g) => ({
    label: String(g.name ?? g.id),
    value: g.id as string | number
  }))
)

/** 正文 HTML 与 `sendRecord` 的 `content` 字段一致，交给 `UniEditor`（AiEditor）编辑 */
const contentHtml = computed({
  get: () => String(form.value.content ?? ''),
  set: (v: string) => {
    form.value.content = v
  }
})

const contentPlaceholder = computed(() => t('email.outbox.colContent'))

const drawerTitle = computed(() =>
  props.mode === 'add' ? t('email.outbox.composeTitle') : t('email.edit')
)

const validateRecipients = (_rule: unknown, _value: unknown, callback: (e?: Error) => void) => {
  const m = form.value
  const tg = Array.isArray(m.toGroups) ? m.toGroups : []
  const om = String(m.otherMails ?? '').trim()
  if (!tg.length && !om) {
    callback(new Error(tr('email.outbox.ruleRecipients')))
  } else {
    callback()
  }
}

const composeFormConfig = computed<UniFormConfig>(() => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 8 },
  colProps: { span: 24 },
  rules: {
    mailInfoId: [{ required: true, message: tr('email.outbox.ruleMailInfo'), trigger: 'change' }],
    subject: [{ required: true, message: tr('email.outbox.ruleSubject'), trigger: 'blur' }],
    toGroups: [{ validator: validateRecipients, trigger: 'change' }],
    otherMails: [{ validator: validateRecipients, trigger: 'blur' }]
  } as UniFormConfig['rules'],
  schema: [
    {
      field: 'mailInfoId',
      label: tr('email.outbox.colMailInfo'),
      component: 'ElSelect',
      options: senderOpts.value,
      componentProps: {
        filterable: true,
        clearable: true,
        placeholder: tr('email.outbox.colMailInfo'),
        class: 'email-compose-control'
      }
    },
    {
      field: 'toGroups',
      label: tr('email.outbox.colToGroups'),
      component: 'ElSelect',
      options: groupOpts.value,
      componentProps: {
        multiple: true,
        filterable: true,
        clearable: true,
        collapseTags: true,
        collapseTagsTooltip: true,
        placeholder: tr('email.outbox.colToGroups'),
        class: 'email-compose-control'
      }
    },
    {
      field: 'otherMails',
      label: tr('email.outbox.colToManual'),
      component: 'ElInput',
      componentProps: {
        clearable: true,
        placeholder: tr('email.outbox.attachHint'),
        class: 'email-compose-control',
        onBlur: () => {
          void uniFormExpose()?.validateField?.('toGroups')?.catch(() => {})
        }
      }
    },
    {
      field: 'ccGroups',
      label: tr('email.outbox.colCcGroups'),
      component: 'ElSelect',
      options: groupOpts.value,
      componentProps: {
        multiple: true,
        filterable: true,
        clearable: true,
        collapseTags: true,
        collapseTagsTooltip: true,
        placeholder: tr('email.outbox.colCcGroups'),
        class: 'email-compose-control'
      }
    },
    {
      field: 'otherCC',
      label: tr('email.outbox.colCcManual'),
      component: 'ElInput',
      componentProps: {
        clearable: true,
        placeholder: tr('email.outbox.attachHint'),
        class: 'email-compose-control'
      }
    },
    {
      field: 'bccGroups',
      label: tr('email.outbox.colBccGroups'),
      component: 'ElSelect',
      options: groupOpts.value,
      componentProps: {
        multiple: true,
        filterable: true,
        clearable: true,
        collapseTags: true,
        collapseTagsTooltip: true,
        placeholder: tr('email.outbox.colBccGroups'),
        class: 'email-compose-control'
      }
    },
    {
      field: 'otherBCC',
      label: tr('email.outbox.colBccManual'),
      component: 'ElInput',
      componentProps: {
        clearable: true,
        placeholder: tr('email.outbox.attachHint'),
        class: 'email-compose-control'
      }
    },
    {
      field: 'subject',
      label: tr('email.outbox.colSubject'),
      component: 'ElInput',
      componentProps: {
        clearable: true,
        placeholder: tr('email.outbox.colSubject'),
        class: 'email-compose-control'
      }
    }
  ]
}))

watch(
  () => form.value.toGroups,
  () => {
    void uniFormExpose()?.validateField?.('otherMails')?.catch(() => {})
  }
)

const onDrawerClosed = () => {
  uniFormExpose()?.resetFields?.()
}

const onSubmit = async (status: 0 | 1) => {
  try {
    await uniFormRef.value?.validate()
  } catch {
    return
  }
  emit('submit', status)
}
</script>

<style scoped lang="scss">
.email-compose-drawer {
  :deep(.el-drawer__body) {
    padding: 8px 16px 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 1;
    min-height: 0;
  }
}

.email-compose-drawer__inner {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.email-compose-form {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.email-compose-rows {
  flex-shrink: 0;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--el-border-radius-base);
  background: var(--el-fill-color-blank);
  overflow: hidden;
}

.email-compose-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 6px 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);

  &:last-of-type {
    border-bottom: none;
  }

  &--subject {
    border-bottom: none;
    border-top: 1px solid var(--el-border-color-lighter);
  }

  &__label {
    flex: 0 0 56px;
    padding-top: 8px;
    font-size: 13px;
    line-height: 1.4;
    color: var(--el-text-color-secondary);
    text-align: right;
    white-space: nowrap;
  }

  &__field {
    flex: 1;
    min-width: 0;
  }
}

.email-compose-form-item--flush {
  margin-bottom: 0;

  :deep(.el-form-item__error) {
    position: static;
    padding-top: 4px;
  }
}

.email-compose-control {
  width: 100%;
}

.email-compose-editor {
  margin-top: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 200px;

  &__label {
    font-size: 13px;
    font-weight: 500;
    color: var(--el-text-color-regular);
    margin-bottom: 8px;
  }
}

.email-compose-form-item--body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;

  :deep(.el-form-item__content) {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
}

.email-compose-uni-editor {
  width: 100%;
}

.email-compose-drawer__footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  width: 100%;
}
</style>
