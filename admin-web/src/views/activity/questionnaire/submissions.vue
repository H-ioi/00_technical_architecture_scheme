<template>
  <section v-loading="metaLoading" class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('route.activityQuestionnaireSubmissions') }}</h1>
        <p v-if="subtitle" class="uni-list-page__description">{{ subtitle }}</p>
      </div>
      <div class="uni-list-page__header-actions q-submissions__header-actions">
        <el-button :loading="exporting" @click="exportAnswers">{{
          $t('activity.exportQuestionnaire')
        }}</el-button>
        <el-divider direction="vertical" class="q-submissions__header-divider" />
        <el-button plain @click="goBack">{{ $t('activity.back') }}</el-button>
      </div>
    </div>

    <UniDataTable
      :key="questionnaireId"
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, columnSetting: true }"
      @load-success="handleLoadSuccess">
      <template v-if="hasUploadCols" #[attachColumnSlot]="{ row }">
        <el-button
          type="primary"
          link
          :disabled="!(row as SubmissionRowMap).__attachmentIds?.length"
          @click="openFiles(row as SubmissionRowMap)">
          {{
            (row as SubmissionRowMap).__attachmentIds?.length
              ? $t('activity.qSubmissionAttachOpen', {
                  n: (row as SubmissionRowMap).__attachmentIds?.length
                })
              : '—'
          }}
        </el-button>
      </template>
    </UniDataTable>

    <el-dialog v-model="fileDialogVisible" :title="$t('activity.qSubmissionAttachTitle')" width="520px">
      <div class="q-sub-files">
        <el-button
          v-for="f in fileRows"
          :key="String(f.id)"
          type="primary"
          link
          class="q-sub-file"
          @click="downloadOne(f.id, f.originalName ?? String(f.id))">
          {{ f.originalName ?? f.id }}
        </el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import { UniDataTable } from 'uni-ui-lib'
import { computed } from 'vue'

import type { SubmissionRowMap } from '@/types/modules/activity-questionnaire'
import { submissionAttachColumnProp } from './submissions.config'
import { useQuestionnaireSubmissions } from './use-submissions'

/** UniDataTable：`#column-<prop>` */
const attachColumnSlot = computed(() => `column-${submissionAttachColumnProp}` as const)

const {
  columns,
  exportAnswers,
  downloadOne,
  exporting,
  fileDialogVisible,
  fileRows,
  filters,
  goBack,
  handleLoadSuccess,
  hasUploadCols,
  loadData,
  metaLoading,
  openFiles,
  questionnaireId,
  subtitle,
  tableRef
} = useQuestionnaireSubmissions()
</script>

<style scoped lang="scss">
/** 与问卷 **`edit.vue`** 页头一致：主操作在前，竖线分隔，**返回** 使用 `plain` */
.q-submissions {
  &__header-actions {
    align-items: center;
  }

  &__header-divider {
    margin: 0 8px;
    height: 1.25em;
    border-color: var(--el-border-color);
  }
}

.q-sub-files {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .q-sub-file {
    margin-bottom: 6px;
  }
}
</style>
