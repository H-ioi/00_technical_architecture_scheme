<script setup lang="ts">
import type { UniOption, UniTableRequest } from 'uni-ui-lib'
import { toUniOptions } from 'uni-ui-lib'
import { computed, onMounted, ref } from 'vue'
import { useUniI18n } from 'uni-ui-lib'
import { useRoute, useRouter } from 'vue-router'

import { membershipApi, protocolApi } from '@/api'
import type { ProtocolDict, ProtocolRecord } from '@/types/modules/protocol'

import { createDetailConfig, createSignColumns, createStatusOptions, createYesNoOptions } from './list.config'

const route = useRoute()
const router = useRouter()
const { locale, t } = useUniI18n()
const detail = ref<ProtocolRecord | null>(null)
const schoolOptions = ref<UniOption[]>([])
const protocolDict = ref<ProtocolDict>({})
const signColumns = computed(() => createSignColumns(t))
const protocolId = computed(() => String(route.params.id ?? ''))

// 后端字典同时返回中英文名称，这里按当前语言转换成 UniDataTable/UniForm 可复用的选项结构。
const createDictOptions = (items: NonNullable<ProtocolDict['protocolTypeList']> = []): UniOption[] =>
  toUniOptions(items, {
    labelKeys: locale() === 'en' ? ['enName', 'name', 'cnName'] : ['name', 'cnName', 'enName'],
    valueKey: 'id'
  })

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

// 校区字段是后端聚合后的字符串，详情展示按语言优先选择对应名称。
const schoolName = computed(
  () =>
    (locale() === 'en' ? detail.value?.schoolEnNames : detail.value?.schoolCnNames) ||
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

  // UniForm view 模式只负责展示，因此先把枚举值和多语言字段整理成可读文本。
  return {
    ...record,
    schoolName: schoolName.value,
    protocolTypeName: getOptionLabel('protocolType', record.protocolType),
    moduleName: getOptionLabel('module', record.module),
    needSignName: getOptionLabel('needSign', record.needSign),
    statusName: getOptionLabel('status', record.status)
  }
})

const loadSignData: UniTableRequest = ({ pageNo: current, pageSize: size }) =>
  protocolApi.signPage.get({
    current,
    size,
    protocolId: protocolId.value,
    schoolIds: signSchoolIds.value
  })

const goBack = () => {
  void router.push('/protocol')
}

onMounted(async () => {
  const [schools, dict, record] = await Promise.all([
    membershipApi.school.get(),
    protocolApi.dict.get(),
    protocolApi.info.get(protocolId.value)
  ])

  schoolOptions.value = toUniOptions(schools, {
    labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
    valueKey: 'id'
  })
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
        <!-- UniForm 查看模式统一渲染详情字段，避免页面手写 descriptions/tabletitle 布局。 -->
        <UniForm :model-value="detailModel" :config="detailConfig" mode="view" />

        <section class="protocol-detail-page__sign">
          <h2>{{ t('protocol.detail.signRecords') }}</h2>
          <!-- UniDataTable 继续承载签署记录的远程分页和列设置，详情页只提供协议 id 过滤条件。 -->
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
