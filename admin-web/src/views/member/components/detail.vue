<template>
  <el-dialog v-model="visible" :title="$t('member.detail')" width="880px" destroy-on-close>
    <UniForm v-if="source" v-model="viewFormModel" :config="config" mode="view" />
    <template #footer>
      <el-button @click="visible = false">{{ $t('member.close') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { MemberDetailProps } from '@/types/components/member-detail'
import { useViewOnlyFormModel } from '@/composables/use-view-only-form-model'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<MemberDetailProps>()

const viewFormModel = useViewOnlyFormModel(() => props.source)
</script>
