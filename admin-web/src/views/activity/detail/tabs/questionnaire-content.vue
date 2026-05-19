<template>
  <section v-loading="activityLoading || metaLoading" class="activity-questionnaire-content">
    <el-empty
      v-if="!activityLoading && !questionnaireId"
      :description="$t('activity.questionnaireContentEmpty')"
    />
    <template v-else>
      <p v-if="subtitle" class="activity-questionnaire-content__subtitle">{{ subtitle }}</p>
      <UniDataTable
        :key="questionnaireId"
        ref="tableRef"
        row-key="id"
        :columns="columns"
        :request="loadData"
        :filters="filters"
        :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
        :toolbar="{ refresh: true, columnSetting: true }"
        @load-success="handleLoadSuccess"
      >
        <template #toolbar>
          <el-button
            v-uni-permission="'busdriver_edit'"
            type="primary"
            plain
            :loading="exporting"
            @click="exportAnswers"
          >
            {{ $t('activity.export') }}
          </el-button>
        </template>
        <template v-if="hasUploadCols" #[attachColumnSlot]="{ row }">
          <el-button
            type="primary"
            link
            :disabled="!(row as SubmissionRowMap).__attachmentIds?.length"
            @click="openFiles(row as SubmissionRowMap)"
          >
            {{
              (row as SubmissionRowMap).__attachmentIds?.length
                ? $t('activity.qSubmissionAttachOpen', {
                  n: (row as SubmissionRowMap).__attachmentIds?.length
                })
                : '-'
            }}
          </el-button>
        </template>
      </UniDataTable>
    </template>

    <el-dialog v-model="fileDialogVisible" :title="$t('activity.qSubmissionAttachTitle')" width="520px">
      <div class="activity-questionnaire-content__files">
        <el-button
          v-for="f in fileRows"
          :key="String(f.id)"
          type="primary"
          link
          @click="downloadOne(f.id, f.originalName ?? String(f.id))"
        >
          {{ f.originalName ?? f.id }}
        </el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import { UniDataTable } from 'uni-ui-lib'
import { computed, onMounted, ref, watch } from 'vue'

import { activityApi } from '@/api'
import type { SubmissionRowMap } from '@/types/modules/activity-questionnaire'
import { normalizeEnvelope } from '@/utils/api-response-normalize'
import { submissionAttachColumnProp } from '@/views/activity/questionnaire/submissions.config'
import { useQuestionnaireSubmissions } from '@/views/activity/questionnaire/use-submissions'

const props = defineProps<{
  activityId: string | number
}>()

const activityLoading = ref(false)
const questionnaireId = ref('')

const attachColumnSlot = computed(() => `column-${submissionAttachColumnProp}` as const)

const {
  columns,
  downloadOne,
  exportAnswers,
  exporting,
  fileDialogVisible,
  fileRows,
  filters,
  handleLoadSuccess,
  hasUploadCols,
  loadData,
  metaLoading,
  openFiles,
  subtitle,
  tableRef
} = useQuestionnaireSubmissions({
  questionnaireId,
  redirectOnMissing: false
})

const pickQuestionnaireId = (data: Record<string, unknown>) => {
  const candidates = [
    data.questionnaireId,
    data.questionnaire_id,
    data.activityQuestionnaireId,
    data.activity_questionnaire_id
  ]
  const q = data.activityQuestionnaire
  if (q && typeof q === 'object') {
    candidates.push((q as Record<string, unknown>).id)
  }
  const found = candidates.find((item) => item != null && item !== '')
  return found == null ? '' : String(found)
}

const loadQuestionnaireId = async () => {
  if (!props.activityId) {
    questionnaireId.value = ''
    return
  }
  activityLoading.value = true
  try {
    const detail = normalizeEnvelope(await activityApi.detail.get(props.activityId))
    questionnaireId.value = pickQuestionnaireId(detail)
  } finally {
    activityLoading.value = false
  }
}

watch(() => props.activityId, () => void loadQuestionnaireId())
onMounted(() => void loadQuestionnaireId())
</script>

<style scoped lang="scss">
.activity-questionnaire-content {
  min-height: 120px;

  &__subtitle {
    margin: 0 0 12px;
    color: var(--el-text-color-secondary);
  }

  &__files {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
