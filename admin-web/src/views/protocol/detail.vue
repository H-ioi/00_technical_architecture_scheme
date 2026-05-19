<template>
  <section class="proto-view">
    <div class="proto-view__head">
      <div>
        <h1>{{ $t('protocol.detailTitle') }}</h1>
        <p class="uni-list-page__description">{{ $t('protocol.detailPageDesc') }}</p>
        <p v-if="detail?.cnName || detail?.enName" class="proto-view__name">
          {{ detail?.cnName || detail?.enName }}
        </p>
      </div>
      <el-button @click="back">{{ $t('protocol.back') }}</el-button>
    </div>

    <el-card shadow="never">
      <div v-if="detail" class="proto-view__body">
        <UniForm v-model="viewModel" :config="detailCfg" mode="view" />

        <section class="proto-view__sign">
          <h2>{{ $t('protocol.signRecords') }}</h2>
          <UniDataTable
            ref="signTableRef"
            row-key="id"
            :columns="signCols"
            :request="loadSign"
            :filters="signTableFilters"
            :pagination="{ pageSize: 10, pageSizes: [10, 20, 50] }"
            :toolbar="{ refresh: true, fullscreen: true, columnSetting: true }"
            :action-column="{ fixed: false }"
            @load-success="signTableEmpty.onLoadSuccess"
            @request-error="signTableEmpty.onRequestError">
            <template #empty>
              <ListTableEmpty
                :kind="signTableEmpty.kind"
                @reset="signTableEmpty.retry"
                @retry="signTableEmpty.retry" />
            </template>
          </UniDataTable>
        </section>
      </div>
    </el-card>
  </section>
</template>

<script setup lang="ts">
import type { UniOption, UniTableRequest } from 'uni-ui-lib'
import { toUniOptions, useUniI18n } from 'uni-ui-lib'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ListTableEmpty from '@/components/list-table-empty.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import { membershipApi, protocolApi } from '@/api'
import type { ProtocolDict, ProtocolRecord } from '@/types/modules/protocol'

import { buildProtocolDictOptions, resolveProtocolDictCellLabel } from './dict-options'
import { detailForm, signCols as buildSignCols, statusOpts, yesNoOpts } from './list.config'

const route = useRoute()
const router = useRouter()
const { locale, t } = useUniI18n()
const detail = ref<ProtocolRecord | null>(null)
const schoolOptions = ref<UniOption[]>([])
const protocolDict = ref<ProtocolDict>({})
const signCols = computed(() => buildSignCols(t))
const pid = computed(() => String(route.params.id ?? ''))

const protocolTypeOptions = computed(() =>
  buildProtocolDictOptions(protocolDict.value.protocolTypeList, locale())
)
const moduleOptions = computed(() =>
  buildProtocolDictOptions(protocolDict.value.moduleList, locale())
)
/** 详情页文案映射（非表格 props） */
const enumOptionMaps = computed<Record<string, UniOption[]>>(() => ({
  protocolType: protocolTypeOptions.value,
  module: moduleOptions.value,
  needSign: yesNoOpts(t),
  status: statusOpts(t)
}))
const signSchoolIds = computed(() =>
  schoolOptions.value.map((item) => item.value as string | number)
)

const enumLabel = (field: string, value: unknown) => {
  const row = (detail.value ?? {}) as Record<string, unknown>

  if (field === 'protocolType') {
    return resolveProtocolDictCellLabel(row, value, protocolTypeOptions.value, locale(), {
      zh: 'protocolTypeCnName',
      en: 'protocolTypeEnName'
    })
  }

  if (field === 'module') {
    return resolveProtocolDictCellLabel(row, value, moduleOptions.value, locale(), {
      zh: 'moduleCnName',
      en: 'moduleEnName'
    })
  }

  const opts = enumOptionMaps.value[field]
  const fallback = String(value ?? '--')

  if (!opts?.length) {
    return fallback
  }

  const hit = opts.find(
    (item) =>
      item.value === value ||
      String(item.value) === String(value) ||
      (Number.isFinite(Number(item.value)) &&
        Number.isFinite(Number(value)) &&
        Number(item.value) === Number(value))
  )

  return hit?.label ?? fallback
}

const schoolName = computed(
  () =>
    (locale() === 'en' ? detail.value?.schoolEnNames : detail.value?.schoolCnNames) ||
    detail.value?.schoolEnNames ||
    detail.value?.schoolCnNames ||
    '--'
)

const detailCfg = computed(() => detailForm(t))
const viewModel = computed({
  get() {
    const record = detail.value

    if (!record) {
      return {}
    }

    return {
      ...record,
      schoolName: schoolName.value,
      protocolTypeName: enumLabel('protocolType', record.protocolType),
      moduleName: enumLabel('module', record.module),
      needSignName: enumLabel('needSign', record.needSign),
      statusName: enumLabel('status', record.status)
    }
  },
  set: () => {}
})

const loadSign: UniTableRequest = ({ pageNo: current, pageSize: size }) =>
  protocolApi.signPage.get({
    current,
    size,
    protocolId: pid.value,
    schoolIds: signSchoolIds.value
  })

const signTableRef = ref<{ refresh: () => void } | null>(null)
const signTableFilters = ref<Record<string, unknown>>({})
const signTableEmpty = useListTableEmpty(signTableFilters, { tableRef: signTableRef })

const back = () => {
  void router.push('/protocol')
}

onMounted(async () => {
  const [schools, dict, record] = await Promise.all([
    membershipApi.school.get(),
    protocolApi.dict.get(),
    protocolApi.info.get(pid.value)
  ])

  schoolOptions.value = toUniOptions(schools, {
    labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
    valueKey: 'id'
  })
  protocolDict.value = dict ?? {}
  detail.value = record
})
</script>

<style scoped lang="scss">
.proto-view {
  display: grid;
  gap: 16px;
  min-width: 0;

  &__head {
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

  &__body {
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
