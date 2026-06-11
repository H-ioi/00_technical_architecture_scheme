<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('content.discussionTag.pageTitle') }}</h1>
        <p>{{ $t('content.discussionTag.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'tag_add'" type="primary" @click="openForm('add')">
          {{ $t('content.add') }}
        </el-button>
      </div>
    </div>

    <UniDataTable
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :request="loadData"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 120, fixed: 'right' }"
      @load-success="tableEmpty.onLoadSuccess"
      @request-error="tableEmpty.onRequestError">
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>

    <DiscussionTagFormDialog
      v-model:visible="formVisible"
      :mode="formMode"
      :record-id="activeId"
      @saved="refreshTable" />
  </section>
</template>

<script setup lang="ts">
import DiscussionTagFormDialog from './components/form-dialog.vue'
import { tableCols } from './list.config'
import { contentDiscussionTagApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { ContentDiscussionTagRecord as Row } from '@/types/modules/content-discussion-tag'
import { normalizePaged } from '@/utils/api-response-normalize'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { useUniI18n, useUniListState } from 'uni-ui-lib'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { computed, ref } from 'vue'

const { t } = useUniI18n()

const { tableRef, handleLoadSuccess, refreshTable } = useUniListState({
  initialFilters: {}
})

const columns = computed(() => tableCols(t))

const formVisible = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const activeId = ref<string | number | null>(null)

function formatRow(row: Row): Row {
  const next = { ...row }
  if (next.createdAt) {
    next.createdAt = dayjs(next.createdAt).format('YYYY-MM-DD HH:mm')
  }
  if (next.updatedAt) {
    next.updatedAt = dayjs(next.updatedAt).format('YYYY-MM-DD HH:mm')
  }
  return next
}

const loadData: UniTableRequest = async ({ pageNo: current, pageSize: size }) => {
  const result = await contentDiscussionTagApi.page.get({ current, size })
  const { list, total: pageTotal } = normalizePaged<Row>(result)

  return {
    data: list.map(formatRow),
    total: pageTotal
  }
}

const openForm = (mode: 'add' | 'edit', row?: Row) => {
  formMode.value = mode
  activeId.value = row?.id ?? null
  formVisible.value = true
}

const removeRow = async (row: Row) => {
  try {
    await ElMessageBox.confirm(t('content.discussionTag.confirmDelete'), t('content.delete'), {
      confirmButtonText: t('content.submit'),
      cancelButtonText: t('content.cancel'),
      type: 'warning'
    })
  } catch {
    return
  }

  await contentDiscussionTagApi.delete.post(row.id)
  ElMessage.success(t('content.deleteSuccess'))
  void refreshTable()
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('content.edit'),
    code: 'tag_edit',
    onClick: (row) => openForm('edit', row as Row)
  },
  {
    label: t('content.delete'),
    code: 'tag_del',
    onClick: (row) => void removeRow(row as Row)
  }
])

const tableEmpty = useListTableEmpty(ref({}), { tableRef, afterLoadSuccess: handleLoadSuccess })
</script>
