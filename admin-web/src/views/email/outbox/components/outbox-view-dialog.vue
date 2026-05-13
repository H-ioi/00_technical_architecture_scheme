<template>
  <el-dialog v-model="visible" :title="$t('email.outbox.viewTitle')" width="640px" destroy-on-close>
    <div class="email-outbox-view">
      <div class="email-outbox-view__row">
        <span class="email-outbox-view__label">{{ $t('email.outbox.colSubject') }}</span>
        <span class="email-outbox-view__val">{{ detail.subject || '—' }}</span>
      </div>
      <div class="email-outbox-view__row">
        <span class="email-outbox-view__label">{{ $t('email.outbox.colFrom') }}</span>
        <span class="email-outbox-view__val">{{ detail.email || '—' }}</span>
      </div>
      <div class="email-outbox-view__row">
        <span class="email-outbox-view__label">{{ $t('email.outbox.colSendStatus') }}</span>
        <span class="email-outbox-view__val">
          <template v-if="Number(detail.sendResult) === 1">{{ $t('email.outbox.sendOk') }}</template>
          <template v-else-if="Number(detail.sendResult) === 0">
            {{ $t('email.outbox.sendFail') }}
            <template v-if="detail.sendDetails"> 【{{ detail.sendDetails }}】</template>
          </template>
          <template v-else>—</template>
        </span>
      </div>
      <div class="email-outbox-view__row">
        <span class="email-outbox-view__label">{{ $t('email.outbox.colSentAt') }}</span>
        <span class="email-outbox-view__val">{{ detail.createdAt || '—' }}</span>
      </div>
      <div class="email-outbox-view__row">
        <span class="email-outbox-view__label">{{ $t('email.outbox.colToGroups') }}</span>
        <span class="email-outbox-view__val">{{ formatGroupNames(detail.toGroups) }}</span>
      </div>
      <div class="email-outbox-view__row">
        <span class="email-outbox-view__label">{{ $t('email.outbox.colCcGroups') }}</span>
        <span class="email-outbox-view__val">{{ formatGroupNames(detail.ccGroups) }}</span>
      </div>
      <div class="email-outbox-view__row">
        <span class="email-outbox-view__label">{{ $t('email.outbox.colBccGroups') }}</span>
        <span class="email-outbox-view__val">{{ formatGroupNames(detail.bccGroups) }}</span>
      </div>
      <div class="email-outbox-view__row">
        <span class="email-outbox-view__label">{{ $t('email.outbox.colContent') }}</span>
        <span class="email-outbox-view__val email-outbox-view__pre">{{ detail.content || '—' }}</span>
      </div>
    </div>
    <template #footer>
      <el-button v-if="canExport && detail.id" type="primary" plain @click="emit('export')">
        {{ $t('email.outbox.exportRecipients') }}
      </el-button>
      <el-button @click="visible = false">{{ $t('common.close') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
type Loose = Record<string, unknown>

defineProps<{
  detail: Loose
  canExport: boolean
}>()

const emit = defineEmits<{
  export: []
}>()

const visible = defineModel<boolean>({ required: true })

const formatGroupNames = (list: unknown): string => {
  if (!Array.isArray(list)) {
    return '—'
  }
  const names = (list as Loose[]).map((x) => String(x.name ?? x.id ?? '')).filter(Boolean)
  return names.length ? names.join('，') : '—'
}
</script>

<style scoped lang="scss">
.email-outbox-view {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;

  &__row {
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }

  &__label {
    flex: 0 0 100px;
    font-weight: 500;
    color: var(--el-text-color-regular);
  }

  &__val {
    flex: 1;
    word-break: break-word;
  }

  &__pre {
    white-space: pre-wrap;
  }
}
</style>
