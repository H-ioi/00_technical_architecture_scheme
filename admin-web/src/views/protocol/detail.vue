<script setup lang="ts">
import type { UniOption, UniTableRequest } from 'uni-ui-lib'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { fetchProtocolDetail, fetchProtocolDict, fetchProtocolSchoolOptions, fetchProtocolSignPage } from '@/api'
import { useAppI18n } from '@/composables/use-app-i18n'
import type { ProtocolDict, ProtocolDictItem, ProtocolRecord } from '@/types/modules/protocol'

import { createDetailConfig, createSignColumns, createStatusOptions, createYesNoOptions } from './list.config'

const route = useRoute()
const router = useRouter()
const { locale, t } = useAppI18n()
const detail = ref<ProtocolRecord | null>(null)
const schoolOptions = ref<UniOption[]>([])
const protocolDict = ref<ProtocolDict>({})
const signColumns = computed(() => createSignColumns(t))
const protocolId = computed(() => String(route.params.id ?? ''))

const createDictOptions = (items: ProtocolDictItem[] = []): UniOption[] =>
  items.map((item) => ({
    label:
      (locale.value === 'en' ? item.enName : item.cnName) ||
      item.name ||
      item.enName ||
      item.cnName ||
      String(item.id),
    value: item.id
  }))

const protocolTypeOptions = computed(() => createDictOptions(protocolDict.value.protocolTypeList))
const moduleOptions = computed(() => createDictOptions(protocolDict.value.moduleList))
const valueEnums = computed<Record<string, UniOption[]>>(() => ({
  protocolType: protocolTypeOptions.value,
  module: moduleOptions.value,
  needSign: createYesNoOptions(t),
  status: createStatusOptions(t)
}))
const signSchoolIds = computed(() => schoolOptions.value.map((item) => item.value as string | number))

const getOptionLabel = (field: string, value: unknown) =>
  valueEnums.value[field]?.find((item) => item.value === value)?.label ?? String(value ?? '--')

const schoolName = computed(
  () =>
    (locale.value === 'en' ? detail.value?.schoolEnNames : detail.value?.schoolCnNames) ||
    detail.value?.schoolEnNames ||
    detail.value?.schoolCnNames ||
    '--'
)

const detailConfig = computed(() => createDetailConfig(t))
const detailModel = computed(() => {
  const record = detail.value

  if (!record) {
    return {}
  }

  return {
    ...record,
    schoolName: schoolName.value,
    protocolTypeName: getOptionLabel('protocolType', record.protocolType),
    moduleName: getOptionLabel('module', record.module),
    needSignName: getOptionLabel('needSign', record.needSign),
    statusName: getOptionLabel('status', record.status)
  }
})

const loadSignData: UniTableRequest = ({ pageNo, pageSize }) =>
  fetchProtocolSignPage({
    pageNo,
    pageSize,
    protocolId: protocolId.value,
    schoolIds: signSchoolIds.value
  })

const goBack = () => {
  void router.push('/protocol')
}

onMounted(async () => {
  const [schools, dict, record] = await Promise.all([
    fetchProtocolSchoolOptions(),
    fetchProtocolDict(),
    fetchProtocolDetail(protocolId.value)
  ])

  schoolOptions.value = schools.map((item) => ({
    label: item.enName || item.name || String(item.id),
    value: item.id
  }))
  protocolDict.value = dict ?? {}
  detail.value = record
})
</script>

<template>
  <section class="protocol-detail-page">
    <div class="protocol-detail-page__header">
      <div>
        <h1>{{ t('protocol.detail.title') }}</h1>
        <p>{{ detail?.cnName || detail?.enName || protocolId }}</p>
      </div>
      <el-button @click="goBack">{{ t('protocol.actions.back') }}</el-button>
    </div>

    <el-card shadow="never">
      <div v-if="detail" class="protocol-detail-page__content">
        <UniForm :model-value="detailModel" :config="detailConfig" mode="view" />

        <section class="protocol-detail-page__sign">
          <h2>{{ t('protocol.detail.signRecords') }}</h2>
          <UniDataTable
            row-key="id"
            :columns="signColumns"
            :request="loadSignData"
            :pagination="{ pageSize: 10, pageSizes: [10, 20, 50] }"
            :toolbar="{ refresh: true, fullscreen: true, columnSetting: true }"
            :value-enums="valueEnums"
            :action-column="{ fixed: false }"
          />
        </section>
      </div>
    </el-card>
  </section>
</template>

<style scoped lang="scss">
.protocol-detail-page {
  display: grid;
  gap: 16px;
  min-width: 0;

  &__header {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;

    h1 {
      margin: 0;
      font-size: 22px;
    }

    p {
      margin: 4px 0 0;
      color: var(--app-text-color-secondary);
      font-size: 13px;
    }
  }

  &__content {
    display: grid;
    gap: 20px;
    min-width: 0;
  }

  &__sign {
    display: grid;
    gap: 12px;
    min-width: 0;

    h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
  }
}
</style>
