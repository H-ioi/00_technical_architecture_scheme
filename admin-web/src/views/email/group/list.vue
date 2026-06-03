<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('email.group.pageTitle') }}</h1>
        <p class="uni-list-page__description">{{ $t('email.group.pageDesc') }}</p>
      </div>
      <div v-if="hasPermission('mailgroup-add')" class="uni-list-page__header-actions">
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
      @reset="reset" />

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
      :action-column="{ width: 115, fixed: 'right' }"
      @load-success="tableEmpty.onLoadSuccess"
      @request-error="tableEmpty.onRequestError"
      @selection-change="onSelectionChange">
      <template #toolbar>
        <el-button
          v-if="hasPermission('mailgroup-gd')"
          :disabled="batchDisabled"
          @click="batchStatus(0)">
          {{ $t('email.archive') }}
        </el-button>
        <el-button
          v-if="hasPermission('mailgroup-sy')"
          :disabled="batchDisabled"
          @click="batchStatus(1)">
          {{ $t('email.markActive') }}
        </el-button>
        <el-button
          v-if="hasPermission('mailgroup-delete')"
          type="danger"
          :disabled="batchDisabled"
          @click="batchStatus(-1)">
          {{ $t('email.deleteBatch') }}
        </el-button>
      </template>
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="reset" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>

    <GroupDialog
      ref="dialogRef"
      v-model="dialogVisible"
      :mode="dialogMode"
      @success="tableRef?.refresh()" />

    <el-dialog v-model="viewVisible" :title="$t('email.view')" width="560px" destroy-on-close>
      <div class="email-grp-view">
        <p>
          <strong>{{ $t('email.group.colName') }}：</strong>{{ viewMeta.name }}
        </p>
        <p>
          <strong>{{ $t('email.group.colParentMail') }}：</strong>{{ viewMeta.parent }}
        </p>
        <p>
          <strong>{{ $t('email.group.colStudentMail') }}：</strong>{{ viewMeta.student }}
        </p>
        <p>
          <strong>{{ $t('email.status') }}：</strong>{{ viewMeta.status }}
        </p>
        <p>
          <strong>{{ $t('email.createdAt') }}：</strong>{{ viewMeta.createdAt }}
        </p>
        <p>
          <strong>{{ $t('email.group.colScopes') }}：</strong>
        </p>
        <ul v-if="viewLabels.length" class="email-grp-view__scopes">
          <li v-for="(line, i) in viewLabels" :key="i">{{ line }}</li>
        </ul>
        <p v-else>—</p>
      </div>
      <template #footer>
        <el-button @click="viewVisible = false">{{ $t('common.close') }}</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import { formatMailGroupScopeDisplay } from '../mail-page-utils'
import GroupDialog from './components/group-dialog.vue'
import {
  searchForm,
  statusOpts as statusOptsFn,
  tableCols,
  yesNoOpts as yesNoOptsFn
} from './list.config'
import { bulkEmailApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { Translate } from '@/types/i18n'
import { normalizePaged } from '@/utils/api-response-normalize'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  UniDataTable,
  UniSearchForm,
  useUniI18n,
  useUniListState,
  useUniPermission
} from 'uni-ui-lib'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { nextTick, ref, computed } from 'vue'

const { t } = useUniI18n()

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const dialogRef = ref<InstanceType<typeof GroupDialog> | null>(null)

type Loose = Record<string, unknown>

const onEditRow = (row) => {
  dialogMode.value = 'edit'
  dialogVisible.value = true
  void nextTick(() => dialogRef.value?.openEdit(row))
}

const tr = t as Translate
const { hasPermission } = useUniPermission()
const { queryModel, filters, tableRef, handleLoadSuccess, reset, search } = useUniListState({
  initialFilters: { keyword: '', status: '', includeParentMails: '', includeStudentMails: '' }
})
const ynOpts = computed(() => yesNoOptsFn(tr))
const stOpts = computed(() => statusOptsFn(tr))
const searchCfg = computed(() => searchForm(tr, ynOpts.value, stOpts.value))
const columns = computed(() => tableCols(tr))

const selection = ref<Loose[]>([])
const batchDisabled = computed(() => selection.value.length === 0)
const onSelectionChange = (rows: Record<string, unknown>[]) => {
  selection.value = rows as Loose[]
}

const viewVisible = ref(false)
const viewLabels = ref<string[]>([])
const viewMeta = ref({ name: '', parent: '', student: '', status: '', createdAt: '' })

const loadData: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
  const fl = f as Loose
  const raw = await bulkEmailApi.groupPage.get({
    current: pageNo,
    size: pageSize,
    keyword: String(fl.keyword ?? ''),
    status: fl.status === '' || fl.status == null ? undefined : String(fl.status),
    includeParentMails:
      fl.includeParentMails === '' || fl.includeParentMails == null
        ? undefined
        : String(fl.includeParentMails),
    includeStudentMails:
      fl.includeStudentMails === '' || fl.includeStudentMails == null
        ? undefined
        : String(fl.includeStudentMails)
  })
  const { list, total } = normalizePaged(raw)
  return { data: list, total }
}

const openView = (row: Loose) => {
  viewMeta.value = {
    name: String(row.name ?? ''),
    parent:
      Number(row.includeParentMails) === 1 || row.includeParentMails === true
        ? tr('email.yes')
        : tr('email.no'),
    student:
      Number(row.includeStudentMails) === 1 || row.includeStudentMails === true
        ? tr('email.yes')
        : tr('email.no'),
    status: String(row.status) === '1' ? tr('email.statusActive') : tr('email.statusArchived'),
    createdAt: String(row.createdAt ?? '—')
  }
  const sc = String(row.scopes ?? '')
  viewLabels.value = sc
    ? sc
        .split(';')
        .filter((x) => x.trim())
        .map(formatMailGroupScopeDisplay)
    : []
  viewVisible.value = true
}

const removeRow = (row: Loose) => {
  ElMessageBox.confirm(tr('email.confirmDelete'), tr('common.tip'), {
    type: 'warning',
    confirmButtonText: tr('common.submit'),
    cancelButtonText: tr('common.cancel')
  })
    .then(async () => {
      await bulkEmailApi.groupDelete.post({ id: row.id as string | number })
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
      await bulkEmailApi.groupBatchStatus.post({ ids, status })
      ElMessage.success(tr('email.opOk'))
      tableRef.value?.refresh()
    })
    .catch(() => {})
}

const actions = computed<UniTableAction[]>(() => {
  const list: UniTableAction[] = []
  if (hasPermission('mailgroup-edit')) {
    list.push({
      label: tr('email.edit'),
      onClick: (row) => onEditRow(row as Loose)
    })
  }
  if (hasPermission('mailgroup-view')) {
    list.push({ label: tr('email.view'), onClick: (row) => openView(row as Loose) })
  }
  if (hasPermission('mailgroup-delete')) {
    list.push({ label: tr('email.delete'), onClick: (row) => removeRow(row as Loose) })
  }
  return list
})

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })

const openAdd = () => {
  dialogMode.value = 'add'
  dialogVisible.value = true
  void nextTick(() => dialogRef.value?.openAdd())
}
</script>

<style scoped lang="scss">
.email-grp-view {
  font-size: 14px;
  line-height: 1.6;

  &__scopes {
    margin: 0;
    padding-left: 20px;
  }
}
</style>
