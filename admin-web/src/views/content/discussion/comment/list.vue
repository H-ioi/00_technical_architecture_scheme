<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('content.discussionComment.pageTitle') }}</h1>
        <p>{{ $t('content.discussionComment.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'comment_add'" type="primary" @click="openForm('add')">
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

    <CommentFormDialog
      v-model:visible="formVisible"
      :mode="formMode"
      :record-id="activeId"
      :discussion-options="discussionOptions"
      @saved="refreshTable" />
  </section>
</template>

<script setup lang="ts">
import CommentFormDialog from './components/form-dialog.vue'
import { tableCols } from './list.config'
import { contentDiscussionApi, contentDiscussionCommentApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { ContentDiscussionRecord } from '@/types/modules/content-discussion'
import type { ContentDiscussionCommentRecord as Row } from '@/types/modules/content-discussion-comment'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { useUniI18n, toUniOptions, useUniListState } from 'uni-ui-lib'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { computed, onMounted, ref } from 'vue'

const { locale, t } = useUniI18n()

const { tableRef, handleLoadSuccess, refreshTable } = useUniListState({
  initialFilters: {}
})

const discussionRecords = ref<ContentDiscussionRecord[]>([])

const discussionOptions = computed(() =>
  toUniOptions(discussionRecords.value, {
    labelKeys: locale() === 'en' ? ['enContent', 'cnContent'] : ['cnContent', 'enContent'],
    valueKey: 'id'
  })
)

const columns = computed(() => tableCols(t))

const formVisible = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const activeId = ref<string | number | null>(null)

function formatRow(row: Row): Row {
  const next = { ...row }
  if (next.createdAt) {
    next.createdAt = dayjs(next.createdAt).format('YYYY-MM-DD HH:mm')
  }
  return next
}

const loadData: UniTableRequest = async ({ pageNo: current, pageSize: size }) => {
  const result = await contentDiscussionCommentApi.page.get({ current, size })
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
    await ElMessageBox.confirm(t('content.discussionComment.confirmDelete'), t('content.delete'), {
      confirmButtonText: t('content.submit'),
      cancelButtonText: t('content.cancel'),
      type: 'warning'
    })
  } catch {
    return
  }

  await contentDiscussionCommentApi.delete.post(row.id)
  ElMessage.success(t('content.deleteSuccess'))
  void refreshTable()
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('content.edit'),
    code: 'comment_edit',
    onClick: (row) => openForm('edit', row as Row)
  },
  {
    label: t('content.delete'),
    code: 'comment_del',
    onClick: (row) => void removeRow(row as Row)
  }
])

const tableEmpty = useListTableEmpty(ref({}), { tableRef, afterLoadSuccess: handleLoadSuccess })

onMounted(async () => {
  const raw = await contentDiscussionApi.listAll.get()
  discussionRecords.value = normalizeArray<ContentDiscussionRecord>(raw)
})
</script>
