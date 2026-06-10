<template>
  <el-drawer
    v-model="visible"
    :title="$t('activity.programPoolMembersTitle')"
    size="720px"
    append-to-body
    destroy-on-close
    @closed="onClosed"
  >
    <UniDataTable
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :request="loadPage"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50] }"
      :toolbar="{ refresh: false, columnSetting: false }"
    />
  </el-drawer>
</template>

<script setup lang="ts">
import type { UniTableRequest } from 'uni-ui-lib'
import { UniDataTable, useUniI18n } from 'uni-ui-lib'
import { computed, nextTick, ref, watch } from 'vue'

import { poolMemberColumns } from '../program-bind.config'
import { activityLotteryPoolApi } from '@/api'
import type { Translate } from '@/types/i18n'
import { normalizePaged } from '@/utils/api-response-normalize'

const visible = defineModel<boolean>({ default: false })
const poolId = defineModel<string | number>('poolId', { default: '' })

const { t } = useUniI18n()
const tr = t as Translate
const tableRef = ref<InstanceType<typeof UniDataTable> | null>(null)
const filters = ref<{ poolId: string | number }>({ poolId: '' })

const columns = computed(() => poolMemberColumns(tr))

const loadPage: UniTableRequest = async ({ page, pageSize }) => {
  const id = filters.value.poolId
  if (!id) {
    return { data: [], total: 0 }
  }
  const raw = await activityLotteryPoolApi.memberPage.get({
    poolId: id,
    current: page,
    size: pageSize
  })
  const { list, total } = normalizePaged(raw)
  return { data: list, total }
}

watch(
  () => [visible.value, poolId.value] as const,
  async ([open, id]) => {
    filters.value = { poolId: id }
    if (open && id) {
      await nextTick()
      tableRef.value?.refresh?.()
    }
  }
)

const onClosed = () => {
  poolId.value = ''
  filters.value = { poolId: '' }
}
</script>
