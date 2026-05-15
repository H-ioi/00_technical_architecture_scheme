<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('activity.questionnaireTitle') }}</h1>
        <p class="uni-list-page__description">{{ $t('activity.questionnaireDesc') }}</p>
      </div>
      <div v-uni-permission="'busdriver_edit'" class="uni-list-page__header-actions">
        <el-button type="primary" @click="openMetaAdd">{{ $t('activity.add') }}</el-button>
      </div>
    </div>
    <UniSearchForm
      v-model="qm"
      :config="sch"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('activity.search')"
      :reset-text="$t('activity.reset')"
      @search="sea"
      @reset="rst" />
    <UniDataTable
      ref="tb"
      row-key="id"
      selection="multiple"
      :columns="cols"
      :request="lod"
      :filters="filt"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, columnSetting: true }"
      :actions="acts"
      :action-column="{ width: 140, fixed: 'right' }"
      @load-success="hdl"
      @selection-change="onSel">
      <template #toolbar>
        <el-button
          v-uni-permission="'busdriver_edit'"
          plain
          :disabled="!selIds.length"
          @click="openBatchStatus">
          {{ $t('activity.qBatchChangeStatus') }}
        </el-button>
        <el-button
          v-uni-permission="'busdriver_edit'"
          plain
          :disabled="!selIds.length"
          @click="openBatchFrozen">
          {{ $t('activity.qBatchChangeFrozen') }}
        </el-button>
        <el-button
          v-uni-permission="'busdriver_del'"
          type="danger"
          plain
          :disabled="!selIds.length"
          @click="del">
          {{ $t('activity.delBatch') }}
        </el-button>
      </template>
    </UniDataTable>

    <MetaFormDialog ref="metaDlg" @saved="onDlgSaved" />
    <QuestionnaireCopyDialog ref="copyDlg" @saved="onDlgSaved" />
    <BatchFlagDialog ref="batchDlg" @saved="onDlgSaved" />
  </section>
</template>

<script setup lang="ts">
import { UniDataTable, UniSearchForm } from 'uni-ui-lib'
import { ref } from 'vue'

import BatchFlagDialog from '@/views/activity/questionnaire/components/batch-flag-dialog.vue'
import QuestionnaireCopyDialog from '@/views/activity/questionnaire/components/copy-dialog.vue'
import MetaFormDialog from '@/views/activity/questionnaire/components/meta-form-dialog.vue'

import { useQuestionnaireList } from './use-list'

const metaDlg = ref<InstanceType<typeof MetaFormDialog> | null>(null)
const copyDlg = ref<InstanceType<typeof QuestionnaireCopyDialog> | null>(null)
const batchDlg = ref<InstanceType<typeof BatchFlagDialog> | null>(null)

const {
  acts,
  cols,
  del,
  filt,
  hdl,
  lod,
  onDlgSaved,
  onSel,
  openBatchFrozen,
  openBatchStatus,
  openMetaAdd,
  qm,
  rst,
  sea,
  selIds,
  sch,
  tb
} = useQuestionnaireList({ metaDlg, copyDlg, batchDlg })
</script>
