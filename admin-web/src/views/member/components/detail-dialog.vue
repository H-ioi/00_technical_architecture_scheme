<template>
  <el-dialog
    :model-value="visible"
    :title="$t('member.actions.detail')"
    width="880px"
    destroy-on-close
    @update:model-value="emit('update:visible', $event)"
  >
    <UniForm v-if="source" :model-value="source" :config="config" mode="view" />
    <template #footer>
      <el-button @click="emit('update:visible', false)">{{ $t('member.actions.close') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { MemberDetailDialogEmits, MemberDetailDialogProps } from '@/types/components/member-detail-dialog'

defineProps<MemberDetailDialogProps>()

const emit = defineEmits<MemberDetailDialogEmits>()
</script>

<style scoped lang="scss"></style>
