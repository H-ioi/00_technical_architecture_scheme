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
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="email-compose-form"
        label-position="top">
        <div class="email-compose-rows">
          <div class="email-compose-row">
            <span class="email-compose-row__label">{{ $t('email.outbox.colMailInfo') }}</span>
            <div class="email-compose-row__field">
              <el-form-item prop="mailInfoId" class="email-compose-form-item--flush">
                <el-select
                  v-model="form.mailInfoId"
                  filterable
                  clearable
                  :placeholder="$t('email.outbox.colMailInfo')"
                  class="email-compose-control">
                  <el-option
                    v-for="u in mailSenderOptions"
                    :key="String(u.id)"
                    :label="String(u.email ?? u.id)"
                    :value="u.id" />
                </el-select>
              </el-form-item>
            </div>
          </div>

          <div class="email-compose-row">
            <span class="email-compose-row__label">{{ $t('email.outbox.colToGroups') }}</span>
            <div class="email-compose-row__field">
              <el-form-item prop="toGroups" class="email-compose-form-item--flush">
                <el-select
                  v-model="form.toGroups"
                  multiple
                  filterable
                  clearable
                  collapse-tags
                  collapse-tags-tooltip
                  :placeholder="$t('email.outbox.colToGroups')"
                  class="email-compose-control">
                  <el-option
                    v-for="g in mailGroupOptions"
                    :key="String(g.id)"
                    :label="String(g.name ?? g.id)"
                    :value="g.id" />
                </el-select>
              </el-form-item>
            </div>
          </div>

          <div class="email-compose-row">
            <span class="email-compose-row__label">{{ $t('email.outbox.colToManual') }}</span>
            <div class="email-compose-row__field">
              <el-form-item prop="otherMails" class="email-compose-form-item--flush">
                <el-input
                  v-model="form.otherMails"
                  clearable
                  :placeholder="$t('email.outbox.attachHint')"
                  class="email-compose-control"
                  @blur="formRef?.validateField('toGroups')" />
              </el-form-item>
            </div>
          </div>

          <div class="email-compose-row">
            <span class="email-compose-row__label">{{ $t('email.outbox.colCcGroups') }}</span>
            <div class="email-compose-row__field">
              <el-form-item prop="ccGroups" class="email-compose-form-item--flush">
                <el-select
                  v-model="form.ccGroups"
                  multiple
                  filterable
                  clearable
                  collapse-tags
                  collapse-tags-tooltip
                  :placeholder="$t('email.outbox.colCcGroups')"
                  class="email-compose-control">
                  <el-option
                    v-for="g in mailGroupOptions"
                    :key="String(g.id)"
                    :label="String(g.name ?? g.id)"
                    :value="g.id" />
                </el-select>
              </el-form-item>
            </div>
          </div>

          <div class="email-compose-row">
            <span class="email-compose-row__label">{{ $t('email.outbox.colCcManual') }}</span>
            <div class="email-compose-row__field">
              <el-form-item prop="otherCC" class="email-compose-form-item--flush">
                <el-input
                  v-model="form.otherCC"
                  clearable
                  :placeholder="$t('email.outbox.attachHint')"
                  class="email-compose-control" />
              </el-form-item>
            </div>
          </div>

          <div class="email-compose-row">
            <span class="email-compose-row__label">{{ $t('email.outbox.colBccGroups') }}</span>
            <div class="email-compose-row__field">
              <el-form-item prop="bccGroups" class="email-compose-form-item--flush">
                <el-select
                  v-model="form.bccGroups"
                  multiple
                  filterable
                  clearable
                  collapse-tags
                  collapse-tags-tooltip
                  :placeholder="$t('email.outbox.colBccGroups')"
                  class="email-compose-control">
                  <el-option
                    v-for="g in mailGroupOptions"
                    :key="String(g.id)"
                    :label="String(g.name ?? g.id)"
                    :value="g.id" />
                </el-select>
              </el-form-item>
            </div>
          </div>

          <div class="email-compose-row">
            <span class="email-compose-row__label">{{ $t('email.outbox.colBccManual') }}</span>
            <div class="email-compose-row__field">
              <el-form-item prop="otherBCC" class="email-compose-form-item--flush">
                <el-input
                  v-model="form.otherBCC"
                  clearable
                  :placeholder="$t('email.outbox.attachHint')"
                  class="email-compose-control" />
              </el-form-item>
            </div>
          </div>

          <div class="email-compose-row email-compose-row--subject">
            <span class="email-compose-row__label">{{ $t('email.outbox.colSubject') }}</span>
            <div class="email-compose-row__field">
              <el-form-item prop="subject" class="email-compose-form-item--flush">
                <el-input
                  v-model="form.subject"
                  clearable
                  :placeholder="$t('email.outbox.colSubject')"
                  class="email-compose-control" />
              </el-form-item>
            </div>
          </div>
        </div>

        <div class="email-compose-editor">
          <UniEditor
            v-model="contentHtml"
            class="email-compose-uni-editor"
            height="min(360px, 38vh)"
            :placeholder="contentPlaceholder" />
        </div>
      </el-form>
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
import type { FormInstance, FormRules } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
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

const formRef = ref<FormInstance>()

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

const rules = computed<FormRules>(() => ({
  mailInfoId: [{ required: true, message: tr('email.outbox.ruleMailInfo'), trigger: 'change' }],
  subject: [{ required: true, message: tr('email.outbox.ruleSubject'), trigger: 'blur' }],
  toGroups: [{ validator: validateRecipients, trigger: 'change' }],
  otherMails: [{ validator: validateRecipients, trigger: 'blur' }]
}))

watch(
  () => form.value.toGroups,
  () => {
    formRef.value?.validateField('otherMails').catch(() => {})
  }
)

const onDrawerClosed = () => {
  formRef.value?.resetFields?.()
}

const onSubmit = async (status: 0 | 1) => {
  try {
    await formRef.value?.validate()
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
