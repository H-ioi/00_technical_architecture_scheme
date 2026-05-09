<script setup lang="ts">
import type { UniOption, UniTableRequest } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'
import { useUniI18n } from 'uni-ui-lib'

import { protocolApi } from '@/api'
import type { ProtocolRecord } from '@/types/modules/protocol'

import { createSignColumns } from '../list.config'

const props = defineProps<{
  visible: boolean
  source?: ProtocolRecord | null
  schoolOptions: UniOption[]
  valueEnums: Record<string, UniOption[]>
}>()

const emit = defineEmits<{
  'update:visible': [visible: boolean]
}>()

const { locale, t } = useUniI18n()
const detail = ref<ProtocolRecord | null>(null)
const signTableRef = ref<{ refresh: () => void } | null>(null)
const signColumns = computed(() => createSignColumns(t))
const signSchoolIds = computed(() => props.schoolOptions.map((item) => item.value as string | number))

const getOptionLabel = (field: string, value: unknown) =>
  props.valueEnums[field]?.find((item) => item.value === value)?.label ?? String(value ?? '--')

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
    { label: t('protocol.fields.protocolType'), value: getOptionLabel('protocolType', record.protocolType) },
    { label: t('protocol.fields.module'), value: getOptionLabel('module', record.module) },
    { label: t('protocol.fields.needSign'), value: getOptionLabel('needSign', record.needSign) },
    { label: t('protocol.fields.status'), value: getOptionLabel('status', record.status) },
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

    detail.value = await protocolApi.info.get(props.source.id)
    signTableRef.value?.refresh()
  }
)
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="t('protocol.detail.title')"
    width="1080px"
    destroy-on-close
    @update:model-value="emit('update:visible', $event)"
  >
    <div v-if="detail" class="protocol-detail">
      <el-descriptions :column="2" border>
        <el-descriptions-item v-for="item in displayItems" :key="item.label" :label="item.label">
          {{ item.value || '--' }}
        </el-descriptions-item>
        <el-descriptions-item :label="t('protocol.fields.documentUrl')" :span="2">
          <el-link v-if="detail.documentUrl" type="primary" :href="detail.documentUrl" target="_blank">
            {{ detail.documentUrl }}
          </el-link>
          <span v-else>--</span>
        </el-descriptions-item>
      </el-descriptions>

      <section class="protocol-detail__sign">
        <h3>{{ t('protocol.detail.signRecords') }}</h3>
        <UniDataTable
          ref="signTableRef"
          row-key="id"
          :columns="signColumns"
          :request="loadSignData"
          :pagination="{ pageSize: 10, pageSizes: [10, 20, 50] }"
          :toolbar="false"
          :value-enums="valueEnums"
          :action-column="{ fixed: false }"
        />
      </section>
    </div>

    <template #footer>
      <el-button @click="emit('update:visible', false)">{{ t('protocol.actions.close') }}</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
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
