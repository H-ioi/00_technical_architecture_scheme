<template>
  <el-dialog
    :model-value="visible"
    :title="$t('protocol.detail.title')"
    width="1080px"
    destroy-on-close
    @update:model-value="emit('update:visible', $event)">
    <div
      v-loading="detailLoading"
      class="protocol-detail-loading-wrap"
      :element-loading-text="$t('common.loading')">
      <div v-if="detail" class="protocol-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item v-for="item in displayItems" :key="item.label" :label="item.label">
            {{ item.value || '--' }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('protocol.fields.documentUrl')" :span="2">
            <el-link
              v-if="detail.documentUrl"
              type="primary"
              :href="detail.documentUrl"
              target="_blank">
              {{ detail.documentUrl }}
            </el-link>
            <span v-else>--</span>
          </el-descriptions-item>
        </el-descriptions>

        <section class="protocol-detail__sign">
          <h3>{{ $t('protocol.detail.signRecords') }}</h3>
          <UniDataTable
            ref="signTableRef"
            row-key="id"
            :columns="signColumns"
            :request="loadSignData"
            :pagination="{ pageSize: 10, pageSizes: [10, 20, 50] }"
            :toolbar="false"
            :action-column="{ fixed: false }" />
        </section>
      </div>
    </div>

    <template #footer>
      <el-button @click="emit('update:visible', false)">{{
        $t('protocol.actions.close')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { UniTableRequest } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'
import { useUniI18n } from 'uni-ui-lib'

import { protocolApi } from '@/api'
import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'
import type { ProtocolPanelEmits, ProtocolPanelProps } from '@/types/components/protocol-panel'
import type { ProtocolRecord } from '@/types/modules/protocol'

import { signCols } from '../list.config'

const props = defineProps<ProtocolPanelProps>()

const emit = defineEmits<ProtocolPanelEmits>()

const { locale, t } = useUniI18n()
const { detailLoading, runWithDetailLoading } = useDialogDetailLoading()
const detail = ref<ProtocolRecord | null>(null)
const signTableRef = ref<{ refresh: () => void } | null>(null)
const signColumns = computed(() => signCols(t))
const signSchoolIds = computed(() =>
  props.schoolOptions.map((item) => item.value as string | number)
)

const enumLabel = (field: string, value: unknown) =>
  props.enumOptionMaps[field]?.find((item) => item.value === value)?.label ?? String(value ?? '--')

const schoolName = computed(
  () =>
    (locale() === 'en' ? detail.value?.schoolEnNames : detail.value?.schoolCnNames) ||
    detail.value?.schoolEnNames ||
    detail.value?.schoolCnNames ||
    '--'
)

const displayItems = computed(() => {
  const record = detail.value

  if (!record) {
    return []
  }

  return [
    { label: 'ID', value: record.id },
    { label: t('protocol.fields.school'), value: schoolName.value },
    { label: t('protocol.fields.cnName'), value: record.cnName },
    { label: t('protocol.fields.enName'), value: record.enName },
    {
      label: t('protocol.fields.protocolType'),
      value: enumLabel('protocolType', record.protocolType)
    },
    { label: t('protocol.fields.module'), value: enumLabel('module', record.module) },
    { label: t('protocol.fields.needSign'), value: enumLabel('needSign', record.needSign) },
    { label: t('protocol.fields.status'), value: enumLabel('status', record.status) },
    { label: t('protocol.fields.createTime'), value: record.createTime },
    { label: t('protocol.fields.updateTime'), value: record.updateTime }
  ]
})

const loadSignData: UniTableRequest = ({ pageNo: current, pageSize: size }) => {
  if (!props.source?.id) {
    return Promise.resolve({ data: [], total: 0 })
  }

  return protocolApi.signPage.get({
    current,
    size,
    protocolId: props.source.id,
    schoolIds: signSchoolIds.value
  })
}

watch(
  () => props.visible,
  async (visible) => {
    if (!visible || !props.source?.id) {
      return
    }

    detail.value = null
    await runWithDetailLoading(async () => {
      detail.value = await protocolApi.info.get(props.source!.id)
      signTableRef.value?.refresh()
    })
  }
)
</script>

<style scoped lang="scss">
.protocol-detail-loading-wrap {
  min-height: 200px;
}

.protocol-detail {
  display: grid;
  gap: 20px;

  &__sign {
    display: grid;
    gap: 12px;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
  }
}
</style>
