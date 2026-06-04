<template>
  <div class="list-table-empty">
    <el-empty :description="description">
      <template v-if="showReset" #default>
        <el-button type="primary" link @click="emit('reset')">
          {{ $t('common.tableEmpty.clearFilters') }}
        </el-button>
      </template>
      <template v-else-if="showRetry" #default>
        <el-button type="primary" link @click="emit('retry')">
          {{ $t('common.retry') }}
        </el-button>
      </template>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
import { useUniI18n } from 'uni-ui-lib'
import { computed } from 'vue'

import type { ListTableEmptyKind } from '@/types/list-table-empty'

const props = defineProps<{
  kind: ListTableEmptyKind
}>()

const emit = defineEmits<{
  reset: []
  retry: []
}>()

const { t } = useUniI18n()

const description = computed(() => {
  switch (props.kind) {
    case 'forbidden':
      return t('common.tableEmpty.forbidden')
    case 'network':
      return t('common.tableEmpty.network')
    case 'no_match':
      return t('common.tableEmpty.noMatch')
    case 'no_data':
      return t('common.tableEmpty.noData')
    case 'pending':
      return t('common.tableEmpty.pending')
    default:
      return t('common.tableEmpty.noData')
  }
})

const showReset = computed(() => props.kind === 'no_match')
const showRetry = computed(() => props.kind === 'network')
</script>

<style scoped lang="scss">
.list-table-empty {
  padding: 12px 0;
}
</style>
