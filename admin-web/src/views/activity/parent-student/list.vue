<template>
  <section class="activity-parent-student uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('activity.parentStudentTitle') }}</h1>
        <p class="uni-list-page__description">{{ $t('activity.parentStudentDesc') }}</p>
      </div>
    </div>

    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('activity.search')"
      :reset-text="$t('activity.reset')"
      @search="search"
      @reset="reset"
    />

    <el-card v-loading="loading" shadow="never" class="activity-parent-student__card">
      <template #header>
        <span>{{ $t('activity.parentStudentParentInfo') }}</span>
      </template>
      <el-empty v-if="!hasSearched" :description="$t('activity.parentStudentEmptyHint')" />
      <el-descriptions v-else :column="3" border>
        <el-descriptions-item :label="$t('activity.parentStudentPhone')">
          {{ parentPhone }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('activity.parentStudentEmail')">
          {{ parentEmail }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('activity.parentStudentIsIsaParent')">
          {{ isaParentText }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="never" class="activity-parent-student__card">
      <template #header>
        <span>{{ $t('activity.parentStudentStudentList') }}</span>
      </template>
      <UniDataTable
        row-key="admissionNo"
        :columns="studentCols"
        :data="studentRows"
        :loading="loading"
        :pagination="false"
        :toolbar="{ refresh: false, columnSetting: true }"
      />
    </el-card>

    <el-card shadow="never" class="activity-parent-student__card">
      <template #header>
        <span>{{ $t('activity.parentStudentActivityList') }}</span>
      </template>
      <UniDataTable
        row-key="id"
        :columns="activityCols"
        :data="activityRows"
        :loading="loading"
        :pagination="false"
        :toolbar="{ refresh: false, columnSetting: true }"
      />
    </el-card>
  </section>
</template>

<script setup lang="ts">
import { UniDataTable, UniSearchForm } from 'uni-ui-lib'

import { useActivityParentStudentList } from './use-list'

const {
  activityCols,
  activityRows,
  hasSearched,
  isaParentText,
  loading,
  parentEmail,
  parentPhone,
  queryModel,
  reset,
  search,
  searchCfg,
  studentCols,
  studentRows
} = useActivityParentStudentList()
</script>

<style scoped lang="scss">
.activity-parent-student {
  &__card {
    margin-top: 16px;
  }
}
</style>
