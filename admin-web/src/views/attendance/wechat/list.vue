<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('attendance.wechatOpenid.pageTitle') }}</h1>
        <p>{{ $t('attendance.wechatOpenid.pageDesc') }}</p>
      </div>
    </div>
    <div class="uni-list-page__body">
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
        selection
        :columns="columns"
        :request="loadData"
        :filters="filters"
        :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
        :toolbar="{ refresh: true, density: true, columnSetting: true }"
        :actions="actions"
        :action-column="{ width: 60, fixed: 'right' }"
        @selection-change="onSelectionChange"
        @load-success="tableEmpty.onLoadSuccess"
        @request-error="tableEmpty.onRequestError">
        <template #toolbar>
          <el-button
            v-uni-permission="'archive_wx_openid'"
            :disabled="selection.length === 0"
            @click="batchStatus(1)">
            {{ $t('attendance.wechatOpenid.archive') }}
          </el-button>
          <el-button
            v-uni-permission="'archive_wx_openid'"
            :disabled="selection.length === 0"
            @click="batchStatus(0)">
            {{ $t('attendance.wechatOpenid.activate') }}
          </el-button>
        </template>
        <template #empty>
          <ListTableEmpty :kind="tableEmpty.kind" @reset="reset" @retry="tableEmpty.retry" />
        </template>
      </UniDataTable>
    </div>
    <DetailDialog v-model:visible="detailVisible" :source="activeRow" :config="detailConfig" />
  </section>
</template>

<script setup lang="ts">
import DetailDialog from './components/detail-dialog.vue'
import { detailForm, searchForm, tableCols, wechatOpenidStatusOpts } from './list.config'
import { attendanceWechatOpenidApi, membershipApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type {
  AttendanceWechatOpenidListParams,
  AttendanceWechatOpenidRecord
} from '@/types/modules/attendance-wechat-openid'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizePaged } from '@/utils/api-response-normalize'
import { dateFormat } from '@/utils/tool'
import { ElMessage } from 'element-plus'
import { useUniI18n, toUniOptions, useUniListState } from 'uni-ui-lib'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { computed, ref } from 'vue'

const { locale, t } = useUniI18n()

type Loose = Record<string, unknown>

const initialFilters: Record<string, unknown> = {
  schoolId: undefined,
  admissionNo: '',
  nickname: '',
  openId: '',
  status: undefined,
  beginDate: undefined,
  endDate: undefined
}

const { queryModel, filters, tableRef, handleLoadSuccess, reset, search, refreshTable } =
  useUniListState({
    initialFilters
  })

const schoolRecords = ref<SchoolOptionRecord[]>([])
const schoolOptions = computed(() =>
  toUniOptions(schoolRecords.value, {
    labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
    valueKey: 'id'
  })
)

const statusSearchOptions = computed(() => wechatOpenidStatusOpts(t))

const searchCfg = computed(() => searchForm(t, schoolOptions.value, statusSearchOptions.value))

const columns = computed(() => tableCols(t, schoolOptions.value))

const detailConfig = computed(() => detailForm(t, schoolOptions.value))

const detailVisible = ref(false)
const activeRow = ref<AttendanceWechatOpenidRecord | null>(null)

const selection = ref<AttendanceWechatOpenidRecord[]>([])
const onSelectionChange = (rows: unknown[]) => {
  selection.value = rows as AttendanceWechatOpenidRecord[]
}

const decorateRow = (raw: Loose): AttendanceWechatOpenidRecord => {
  const statusHit = statusSearchOptions.value.find(
    (o) => String(o.value) === String(raw.status ?? '')
  )
  return {
    ...(raw as AttendanceWechatOpenidRecord),
    status: statusHit?.label ?? String(raw.status ?? '--'),
    updateTime: dateFormat(String(raw.updateTime ?? '')),
    createTime: dateFormat(String(raw.createTime ?? ''))
  }
}

const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const params: AttendanceWechatOpenidListParams = {
    current: pageNo,
    size: pageSize,
    ...(f as Record<string, unknown>)
  }
  const raw = await attendanceWechatOpenidApi.openidPage.get(params)
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
      activeRow.value = row as AttendanceWechatOpenidRecord
      detailVisible.value = true
    }
  }
])

const loadOpts = async () => {
  schoolRecords.value = await membershipApi.school.get()
}

loadOpts()

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })

const batchStatus = async (status: number) => {
  if (selection.value.length === 0) {
    ElMessage.warning(t('attendance.wechatOpenid.needSelection'))
    return
  }
  const ids = selection.value.map((r) => r.id)
  try {
    await attendanceWechatOpenidApi.batchUpdateStatus.post(ids, status)
    ElMessage.success(t('attendance.wechatOpenid.batchSuccess'))
    selection.value = []
    await refreshTable()
  } catch {
    /* request 层已提示 */
  }
}
</script>
