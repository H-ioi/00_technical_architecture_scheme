<template>
  <div v-if="programId" class="program-detail-bindings">
    <el-card v-if="programType === '1'" shadow="never" class="program-detail-bindings__card">
      <template #header>
        <div class="program-detail-bindings__header">
          <span>{{ $t('activity.programPrizeSection') }}</span>
          <el-button
            v-if="!prizeRows.length"
            v-uni-permission="'busdriver_edit'"
            type="primary"
            size="small"
            @click="openPrizeAdd">
            {{ $t('activity.add') }}
          </el-button>
        </div>
      </template>
      <UniDataTable
        row-key="id"
        :columns="prizeCols"
        :data="prizeRows"
        :loading="prizeLoading"
        :pagination="false"
        :toolbar="{ refresh: false, columnSetting: false }"
        :actions="prizeActions"
        :action-column="{ width: 110, fixed: 'right' }" />
    </el-card>

    <el-card
      v-if="programType === '1' && createLotteryPool === '1'"
      shadow="never"
      class="program-detail-bindings__card">
      <template #header>
        <div class="program-detail-bindings__header">
          <span>{{ $t('activity.programPoolSection') }}</span>
          <div
            v-if="!poolRows.length"
            v-uni-permission="'busdriver_edit'"
            class="program-detail-bindings__header-actions">
            <el-button size="small" @click="downloadPoolTemplate">
              {{ $t('activity.downloadTemplate') }}
            </el-button>
            <el-upload
              action=""
              :show-file-list="false"
              :before-upload="beforePoolImport"
              accept=".xlsx,.xls">
              <el-button type="primary" size="small" :loading="poolImporting">
                {{ $t('activity.import') }}
              </el-button>
            </el-upload>
          </div>
        </div>
      </template>
      <UniDataTable
        row-key="id"
        :columns="poolCols"
        :data="poolRows"
        :loading="poolLoading"
        :pagination="false"
        :toolbar="{ refresh: false, columnSetting: false }"
        :actions="poolActions"
        :action-column="{ width: 140, fixed: 'right' }" />
    </el-card>

    <el-card v-if="programType === '2'" shadow="never" class="program-detail-bindings__card">
      <template #header>
        <div class="program-detail-bindings__header">
          <span>{{ $t('activity.voteProgramTitle') }}</span>
          <el-button
            v-uni-permission="'busdriver_edit'"
            type="primary"
            size="small"
            @click="openVoteAdd">
            {{ $t('activity.add') }}
          </el-button>
        </div>
      </template>
      <UniDataTable
        row-key="id"
        :columns="voteCols"
        :data="voteRows"
        :loading="voteLoading"
        :pagination="false"
        :toolbar="{ refresh: false, columnSetting: false }"
        :actions="voteActions"
        :action-column="{ width: 110, fixed: 'right' }" />
    </el-card>

    <PrizeFormDialog ref="prizeDlgRef" @saved="loadPrizes" />
    <VoteProgramFormDialog ref="voteDlgRef" @saved="loadVotes" />
    <PoolMemberDrawer v-model="poolDrawerVisible" v-model:pool-id="poolMemberId" />
  </div>
</template>

<script setup lang="ts">
import type { UniTableAction } from 'uni-ui-lib'
import { UniDataTable, useUniI18n } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, ref, watch } from 'vue'

import PoolMemberDrawer from './pool-member-drawer.vue'
import PrizeFormDialog from '@/views/activity/prize/components/prize-form-dialog.vue'
import VoteProgramFormDialog from '@/views/activity/vote-program/components/form-dialog.vue'
import { prizeBindColumns, poolFileColumns, voteBindColumns } from '../program-bind.config'
import { activityLotteryPoolApi, activityPrizeApi, activityVoteProgramApi } from '@/api'
import type { ActivityPrizeRow } from '@/types/modules/activity-prize'
import type { Translate } from '@/types/i18n'
import { normalizeArray } from '@/utils/api-response-normalize'

const props = defineProps<{
  programId: string
  programType: string
  createLotteryPool: string
}>()

const { t } = useUniI18n()
const tr = t as Translate

type Loose = Record<string, unknown>

const prizeDlgRef = ref<InstanceType<typeof PrizeFormDialog> | null>(null)
const voteDlgRef = ref<InstanceType<typeof VoteProgramFormDialog> | null>(null)

const prizeLoading = ref(false)
const poolLoading = ref(false)
const voteLoading = ref(false)
const poolImporting = ref(false)
const prizeRows = ref<ActivityPrizeRow[]>([])
const poolRows = ref<Loose[]>([])
const voteRows = ref<Loose[]>([])

const poolDrawerVisible = ref(false)
const poolMemberId = ref<string | number>('')

const prizeCols = computed(() => prizeBindColumns(tr))
const poolCols = computed(() => poolFileColumns(tr))
const voteCols = computed(() => voteBindColumns(tr))

const bindOpts = computed(() => ({ bindProgramId: props.programId }))

const prizeActions = computed<UniTableAction<ActivityPrizeRow>[]>(() => [
  {
    label: tr('activity.lookDetail'),
    onClick: (row) => prizeDlgRef.value?.open('view', row, bindOpts.value)
  },
  {
    label: tr('activity.entryEdit'),
    code: 'busdriver_edit',
    onClick: (row) => prizeDlgRef.value?.open('edit', row, bindOpts.value)
  },
  {
    label: tr('activity.delBatch'),
    code: 'busdriver_del',
    type: 'danger',
    onClick: (row) => removePrize(row)
  }
])

const voteActions = computed<UniTableAction<Loose>[]>(() => [
  {
    label: tr('activity.lookDetail'),
    onClick: (row) => voteDlgRef.value?.open('view', row, bindOpts.value)
  },
  {
    label: tr('activity.entryEdit'),
    code: 'busdriver_edit',
    onClick: (row) => voteDlgRef.value?.open('edit', row, bindOpts.value)
  },
  {
    label: tr('activity.delBatch'),
    code: 'busdriver_del',
    type: 'danger',
    onClick: (row) => removeVote(row)
  }
])

const poolActions = computed<UniTableAction<Loose>[]>(() => [
  {
    label: tr('activity.programPoolViewMembers'),
    onClick: (row) => openPoolMembers(row)
  },
  {
    label: tr('activity.delBatch'),
    code: 'busdriver_del',
    type: 'danger',
    onClick: (row) => removePoolFile(row)
  }
])

const loadPrizes = async () => {
  if (!props.programId || props.programType !== '1') {
    prizeRows.value = []
    return
  }
  prizeLoading.value = true
  try {
    const raw = await activityPrizeApi.listByProgram.get({ programId: props.programId })
    prizeRows.value = normalizeArray(raw) as ActivityPrizeRow[]
  } catch {
    prizeRows.value = []
  } finally {
    prizeLoading.value = false
  }
}

const loadPoolFiles = async () => {
  if (!props.programId || props.programType !== '1' || props.createLotteryPool !== '1') {
    poolRows.value = []
    return
  }
  poolLoading.value = true
  try {
    const raw = await activityLotteryPoolApi.listByProgram.get({ programId: props.programId })
    poolRows.value = normalizeArray(raw) as Loose[]
  } catch {
    poolRows.value = []
  } finally {
    poolLoading.value = false
  }
}

const loadVotes = async () => {
  if (!props.programId || props.programType !== '2') {
    voteRows.value = []
    return
  }
  voteLoading.value = true
  try {
    const raw = await activityVoteProgramApi.listByProgram.get({ programId: props.programId })
    voteRows.value = normalizeArray(raw) as Loose[]
  } catch {
    voteRows.value = []
  } finally {
    voteLoading.value = false
  }
}

const reloadAll = () => {
  void loadPrizes()
  void loadPoolFiles()
  void loadVotes()
}

watch(
  () => [props.programId, props.programType, props.createLotteryPool] as const,
  () => reloadAll(),
  { immediate: true }
)

const openPrizeAdd = () => {
  prizeDlgRef.value?.open('add', undefined, bindOpts.value)
}

const openVoteAdd = () => {
  voteDlgRef.value?.open('add', undefined, bindOpts.value)
}

const removePrize = async (row: ActivityPrizeRow) => {
  if (row.id == null) {
    return
  }
  try {
    await ElMessageBox.confirm(tr('activity.confirmDeletePrizes'), tr('common.tip'), {
      type: 'warning'
    })
  } catch {
    return
  }
  await activityPrizeApi.remove.delete([row.id])
  ElMessage.success(tr('activity.deleteOk'))
  await loadPrizes()
}

const removeVote = async (row: Loose) => {
  if (row.id == null) {
    return
  }
  try {
    await ElMessageBox.confirm(tr('activity.confirmDeleteVotePrograms'), tr('common.tip'), {
      type: 'warning'
    })
  } catch {
    return
  }
  await activityVoteProgramApi.remove.delete([row.id as string | number])
  ElMessage.success(tr('activity.deleteOk'))
  await loadVotes()
}

const removePoolFile = async (row: Loose) => {
  if (row.id == null) {
    return
  }
  try {
    await ElMessageBox.confirm(tr('activity.confirmDeletePoolFile'), tr('common.tip'), {
      type: 'warning'
    })
  } catch {
    return
  }
  await activityLotteryPoolApi.removeFile.post(row.id as string | number)
  ElMessage.success(tr('activity.deleteOk'))
  await loadPoolFiles()
}

const downloadPoolTemplate = async () => {
  try {
    await activityLotteryPoolApi.downloadTemplate.get()
  } catch {
    ElMessage.error(tr('activity.poolDownloadFail'))
  }
}

const beforePoolImport = (file: File) => {
  void (async () => {
    poolImporting.value = true
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('programId', props.programId)
      await activityLotteryPoolApi.importFile.post(fd)
      ElMessage.success(tr('activity.saveOk'))
      await loadPoolFiles()
    } catch {
      ElMessage.error(tr('activity.uploadFail'))
    } finally {
      poolImporting.value = false
    }
  })()
  return false
}

const openPoolMembers = (row: Loose) => {
  poolMemberId.value = row.id as string | number
  poolDrawerVisible.value = true
}
</script>

<style scoped lang="scss">
.program-detail-bindings {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;

  &__card {
    border: 1px solid var(--el-border-color-lighter);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-weight: 600;
  }

  &__header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
</style>
