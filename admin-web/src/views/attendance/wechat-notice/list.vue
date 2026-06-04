<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('attendance.wechatNotice.pageTitle') }}</h1>
        <p>{{ $t('attendance.wechatNotice.pageDesc') }}</p>
      </div>
    </div>

    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('member.search')"
      :reset-text="$t('member.reset')"
      @search="search"
      @reset="reset" />

    <UniDataTable
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 60, fixed: 'right' }"
      @load-success="tableEmpty.onLoadSuccess"
      @request-error="tableEmpty.onRequestError">
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="reset" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>

    <DetailDialog v-model:visible="detailVisible" :source="activeRow" :config="detailConfig" />
  </section>
</template>

<script setup lang="ts">
import DetailDialog from './components/detail-dialog.vue'
import { detailForm, searchForm, tableCols, wechatNoticeSendStatusOpts } from './list.config'
import { attendanceWechatNoticeApi, membershipApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type {
  AttendanceWechatNoticeListParams,
  AttendanceWechatNoticeRecord
} from '@/types/modules/attendance-wechat-notice'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizePaged } from '@/utils/api-response-normalize'
import { dateFormat } from '@/utils/tool'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, ref } from 'vue'

const { locale, t } = useUniI18n()

type Loose = Record<string, unknown>
const initialFilters: Record<string, unknown> = {
  schoolId: undefined,
  admissionNo: '',
  personName: '',
  openId: '',
  sendStatus: undefined,
  beginDate: undefined,
  endDate: undefined
}

const { queryModel, filters, tableRef, handleLoadSuccess, reset, search } = useUniListState({
  initialFilters
})

const schoolRecords = ref<SchoolOptionRecord[]>([])
const schoolOptions = computed(() =>
  toUniOptions(schoolRecords.value, {
    labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
    valueKey: 'id'
  })
)

const sendStatusSearchOptions = computed(() => wechatNoticeSendStatusOpts(t))

const searchCfg = computed(() => searchForm(t, schoolOptions.value, sendStatusSearchOptions.value))

const columns = computed(() => tableCols(t, schoolOptions.value))

const detailConfig = computed(() => detailForm(t, schoolOptions.value))

const detailVisible = ref(false)
const activeRow = ref<AttendanceWechatNoticeRecord | null>(null)

const decorateRow = (raw: Loose): AttendanceWechatNoticeRecord => {
  const s = String(raw.sendStatus ?? '')
  const statusHit = sendStatusSearchOptions.value.find((o) => String(o.value) === s)
  return {
    ...(raw as AttendanceWechatNoticeRecord),
    sendStatus: statusHit?.label ?? (s === '' ? '--' : s),
    updateTime: dateFormat(String(raw.updateTime ?? '')),
    createTime: dateFormat(String(raw.createTime ?? ''))
  }
}

const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const params: AttendanceWechatNoticeListParams = {
    current: pageNo,
    size: pageSize,
    ...(f as Record<string, unknown>)
  }
  const raw = await attendanceWechatNoticeApi.noticePage.get(params)
  const { list, total } = normalizePaged<Loose>(raw)
  return {
    data: list.map(decorateRow),
    total
  }
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('attendance.detail'),
    onClick: (row) => {
      activeRow.value = row as AttendanceWechatNoticeRecord
      detailVisible.value = true
    }
  }
])

const loadOpts = async () => {
  schoolRecords.value = await membershipApi.school.get()
}

loadOpts()

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })
</script>
