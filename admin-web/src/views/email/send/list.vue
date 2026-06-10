<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('email.send.pageTitle') }}</h1>
        <p class="uni-list-page__description">{{ $t('email.send.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button type="primary" @click="openAdd">{{ $t('email.add') }}</el-button>
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
      @reset="reset"
    />

    <UniDataTable
      ref="tableRef"
      row-key="id"
      selection="multiple"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 168, fixed: 'right' }"
      @load-success="tableEmpty.onLoadSuccess"
      @request-error="tableEmpty.onRequestError"
      @selection-change="onSelectionChange"
    >
      <template #toolbar>
        <el-button :disabled="batchDisabled" @click="batchStatus(0)">
          {{ $t('email.archive') }}
        </el-button>
        <el-button :disabled="batchDisabled" @click="batchStatus(1)">
          {{ $t('email.markActive') }}
        </el-button>
        <el-button type="danger" :disabled="batchDisabled" @click="batchStatus(-1)">
          {{ $t('email.deleteBatch') }}
        </el-button>
      </template>
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="reset" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>

    <SendMailDialog
      v-model="dialogVisible"
      v-model:form="formModel"
      :mode="dialogMode"
      @success="tableRef?.refresh()"
    />

    <el-dialog v-model="viewVisible" :title="$t('email.view')" width="520px" destroy-on-close>
      <div class="email-send-view">
        <div class="email-send-view__row">
          <span class="email-send-view__label">{{ $t('email.send.colUsers') }}</span>
          <span class="email-send-view__val">{{
            viewModel.userLines.length ? viewModel.userLines.join('，') : '—'
          }}</span>
        </div>
        <div class="email-send-view__row">
          <span class="email-send-view__label">{{ $t('email.send.colEmail365') }}</span>
          <span class="email-send-view__val">{{ viewModel.email || '—' }}</span>
        </div>
        <div class="email-send-view__row">
          <span class="email-send-view__label">{{ $t('email.send.assignGroups') }}</span>
          <span class="email-send-view__val">{{ viewModel.groups }}</span>
        </div>
        <div class="email-send-view__row">
          <span class="email-send-view__label">{{ $t('email.status') }}</span>
          <span class="email-send-view__val">{{ viewModel.statusLabel }}</span>
        </div>
      </div>
      <template #footer>
        <el-button @click="viewVisible = false">{{ $t('common.close') }}</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import SendMailDialog from './components/send-mail-dialog.vue'
import { searchForm, statusOpts as statusOptsFn, tableCols } from './list.config'
import { bulkEmailApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { Translate } from '@/types/i18n'
import { normalizePaged } from '@/utils/api-response-normalize'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UniDataTable, UniSearchForm, useUniI18n, useUniListState } from 'uni-ui-lib'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { computed, ref } from 'vue'

const { t } = useUniI18n()

type Loose = Record<string, unknown>
const pickDetail = async (id: string | number) => {
  const raw = await bulkEmailApi.userMailinfoDetail.get({ id })
  return (raw && typeof raw === 'object' ? (raw as Loose) : {}) as Loose
}

const tr = t as Translate
const { queryModel, filters, tableRef, handleLoadSuccess, reset, search } = useUniListState({
  initialFilters: { keyword: '', status: '' }
})
const statusOpts = computed(() => statusOptsFn(tr))
const searchCfg = computed(() => searchForm(tr, statusOpts.value))
const columns = computed(() => tableCols(tr))

const dialogVisible = ref(false)
const viewVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const selection = ref<Loose[]>([])
const batchDisabled = computed(() => selection.value.length === 0)

const onSelectionChange = (rows: Record<string, unknown>[]) => {
  selection.value = rows as Loose[]
}

const viewModel = ref<{
  userLines: string[]
  email: string
  groups: string
  statusLabel: string
}>({ userLines: [], email: '', groups: '', statusLabel: '' })

const formModel = ref({
  userMailinfoId: '' as string | number,
  userIds: [] as string[],
  email: '',
  mailgroupIds: [] as (string | number)[],
  status: '1'
})

const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const raw = await bulkEmailApi.userMailinfoPage.get({
    current: pageNo,
    size: pageSize,
    keyword: String((f as Loose).keyword ?? ''),
    status:
      (f as Loose).status === '' || (f as Loose).status == null
        ? undefined
        : String((f as Loose).status)
  })
  const { list, total } = normalizePaged(raw)
  return { data: list, total }
}

const openAdd = () => {
  dialogMode.value = 'add'
  formModel.value = {
    userMailinfoId: '',
    userIds: [],
    email: '',
    mailgroupIds: [],
    status: '1'
  }
  dialogVisible.value = true
}

const openEdit = async (row: Loose) => {
  dialogMode.value = 'edit'
  const id = row.id
  const data = await pickDetail(id as string | number)
  const mailinfo = (data.mailinfo as Loose) ?? {}
  formModel.value = {
    userMailinfoId: mailinfo.id ?? '',
    userIds: (data.userIdRelations as unknown[] | undefined)?.map((x) => String(x)) ?? [],
    email: String(mailinfo.email ?? ''),
    mailgroupIds:
      (data.mailgroupIdRelations as unknown[] | undefined)?.map((x) => x as string | number) ?? [],
    status: mailinfo.status != null ? String(mailinfo.status) : '1'
  }
  dialogVisible.value = true
}

const openView = async (row: Loose) => {
  const data = await pickDetail(row.id as string | number)
  const mailinfo = (data.mailinfo as Loose) ?? {}
  const userRelations = (data.userRelations as { username?: string }[] | undefined) ?? []
  const groupRels = data.mailgroupRelations as { mailgroupName?: string }[] | undefined
  const groups =
    Array.isArray(groupRels) && groupRels.length
      ? groupRels
          .map((g) => g.mailgroupName ?? '')
          .filter(Boolean)
          .join('，')
      : '—'
  viewModel.value = {
    userLines: userRelations.map((u) => u.username ?? '').filter(Boolean),
    email: String(mailinfo.email ?? ''),
    groups,
    statusLabel:
      Number(mailinfo.status) === 1 ? tr('email.statusActive') : tr('email.statusArchived')
  }
  viewVisible.value = true
}

const removeRow = (row: Loose) => {
  ElMessageBox.confirm(tr('email.confirmDelete'), tr('common.tip'), {
    type: 'warning',
    confirmButtonText: tr('common.submit'),
    cancelButtonText: tr('common.cancel')
  })
    .then(async () => {
      await bulkEmailApi.userMailinfoRemove.post({ id: row.id as string | number })
      ElMessage.success(tr('email.opOk'))
      tableRef.value?.refresh()
    })
    .catch(() => {})
}

const batchStatus = (status: number) => {
  const rows = selection.value
  if (rows.length === 0) {
    ElMessage.warning(tr('email.selectRows'))
    return
  }
  ElMessageBox.confirm(tr('email.confirmBatch'), tr('common.tip'), {
    type: 'warning',
    confirmButtonText: tr('common.submit'),
    cancelButtonText: tr('common.cancel')
  })
    .then(async () => {
      const ids = rows.map((r) => String(r.id)).join(',')
      await bulkEmailApi.userMailinfoBatchStatus.post({ ids, status })
      ElMessage.success(tr('email.opOk'))
      tableRef.value?.refresh()
    })
    .catch(() => {})
}

const actions = computed<UniTableAction[]>(() => [
  { label: tr('email.edit'), onClick: (row) => void openEdit(row as Loose) },
  { label: tr('email.view'), onClick: (row) => void openView(row as Loose) },
  { label: tr('email.delete'), onClick: (row) => removeRow(row as Loose) }
])

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })
</script>

<style scoped lang="scss">
.email-send-view {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;

  &__row {
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }

  &__label {
    flex: 0 0 120px;
    font-weight: 500;
    color: var(--el-text-color-regular);
  }

  &__val {
    flex: 1;
    overflow-wrap: anywhere;
  }
}
</style>
