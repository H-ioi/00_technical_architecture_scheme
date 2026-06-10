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
import { activityColumns, searchForm, studentColumns } from './list.config'
import { activityParentStudentApi } from '@/api'
import type { Translate } from '@/types/i18n'
import type {
  ActivityParentInfo,
  ActivityParentStudentActivityRow,
  ActivityParentStudentRow,
  ActivityParentStudentSearchModel
} from '@/types/modules/activity-parent-student'
import { normalizeEnvelope } from '@/utils/api-response-normalize'
import { ElMessage } from 'element-plus'
import { UniDataTable, UniSearchForm, useUniI18n } from 'uni-ui-lib'
import { computed, ref } from 'vue'

const { t } = useUniI18n()

type Loose = Record<string, unknown>

const tr = t as Translate

const loading = ref(false)
const hasSearched = ref(false)
const queryModel = ref<ActivityParentStudentSearchModel>({ phone: '' })
const parentData = ref<ActivityParentInfo>({})
const studentRows = ref<ActivityParentStudentRow[]>([])
const activityRows = ref<ActivityParentStudentActivityRow[]>([])

const searchCfg = computed(() => searchForm(tr))
const studentCols = computed(() => studentColumns(tr))
const activityCols = computed(() => activityColumns(tr))

const parentPhone = computed(() => {
  const v = parentData.value.phoneNumber
  return v == null || v === '' ? '—' : String(v)
})
const parentEmail = computed(() => {
  const v = parentData.value.email
  return v == null || v === '' ? '—' : String(v)
})
const isaParentText = computed(() => {
  const value = parentData.value.isIsaParent
  return value === true || value === 1 || value === '1' ? tr('activity.yes') : tr('activity.no')
})

const clearResult = () => {
  parentData.value = {}
  studentRows.value = []
  activityRows.value = []
  hasSearched.value = false
}

const search = async () => {
  const phone = queryModel.value.phone.trim()
  if (!phone) {
    ElMessage.warning(tr('activity.parentStudentPhoneRequired'))
    return
  }

  loading.value = true
  try {
    const raw = await activityParentStudentApi.lookupByPhone.get({ phone })
    const first = normalizeEnvelope(raw)
    const nested = first.data
    const payload =
      nested && typeof nested === 'object' && !Array.isArray(nested) ? (nested as Loose) : first
    parentData.value =
      payload.parent && typeof payload.parent === 'object' && !Array.isArray(payload.parent)
        ? (payload.parent as ActivityParentInfo)
        : {}
    studentRows.value = Array.isArray(payload.students)
      ? (payload.students as ActivityParentStudentRow[])
      : []
    activityRows.value = Array.isArray(payload.activities)
      ? (payload.activities as ActivityParentStudentActivityRow[])
      : []
    hasSearched.value = true
  } finally {
    loading.value = false
  }
}

const reset = () => {
  queryModel.value = { phone: '' }
  clearResult()
}
</script>

<style scoped lang="scss">
.activity-parent-student {
  &__card {
    margin-top: 16px;
  }
}
</style>
