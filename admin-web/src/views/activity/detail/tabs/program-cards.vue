<template>
  <section v-loading="loading" class="activity-program-cards">
    <el-empty v-if="!loading && !cards.length" :description="$t('activity.detailTabNoData')" />
    <div v-else class="activity-program-cards__grid">
      <el-card
        v-for="card in cards"
        :key="String(card.programInfo.id)"
        shadow="never"
        class="activity-program-cards__card">
        <template #header>
          <div class="activity-program-cards__head">
            <div class="activity-program-cards__head-main">
              <span class="activity-program-cards__title">{{
                isEn
                  ? String(card.programInfo.enName ?? card.programInfo.cnName ?? '')
                  : String(card.programInfo.cnName ?? card.programInfo.enName ?? '')
              }}</span>
              <el-tag size="small" effect="plain" type="info">
                {{ programTypeText(card.programInfo.programType) }}
              </el-tag>
            </div>
            <el-tag
              size="small"
              :type="
                Number(card.programInfo.programStatus) === 1
                  ? 'success'
                  : Number(card.programInfo.programStatus) === 0
                    ? 'warning'
                    : 'info'
              "
              effect="light">
              {{ statusText(card.programInfo) }}
            </el-tag>
          </div>
        </template>

        <el-descriptions :column="2" size="small" border class="activity-program-cards__desc">
          <el-descriptions-item label="ID">
            {{ card.programInfo.id ?? '-' }}
          </el-descriptions-item>
          <el-descriptions-item
            v-if="Number(card.programInfo.programType) === 1"
            :label="$t('activity.colTotalRounds')">
            {{ card.programInfo.totalRounds ?? '-' }}
          </el-descriptions-item>
          <el-descriptions-item
            v-if="Number(card.programInfo.programType) === 1"
            :label="$t('activity.colCurrentRound')">
            {{ card.programInfo.currentRound ?? '-' }}
          </el-descriptions-item>
          <el-descriptions-item
            v-if="Number(card.programInfo.programType) === 1"
            :label="$t('activity.winnerQuota')">
            {{ ruleObj(card.programInfo).prizeCount ?? '-' }}
          </el-descriptions-item>
          <el-descriptions-item
            v-if="Number(card.programInfo.programType) === 1"
            :label="$t('activity.prizeCount')">
            {{ ruleObj(card.programInfo).prizeCount ?? '-' }}
          </el-descriptions-item>
          <el-descriptions-item
            v-if="Number(card.programInfo.programType) === 2"
            :label="$t('activity.winnerQuota')">
            {{ ruleObj(card.programInfo).prizeCount ?? '-' }}
          </el-descriptions-item>
        </el-descriptions>

        <div
          v-if="programRuleTags(card.programInfo).length"
          class="activity-program-cards__section">
          <div class="activity-program-cards__section-title">{{ $t('activity.programRules') }}</div>
          <div class="activity-program-cards__tags">
            <el-tag
              v-for="(tag, index) in programRuleTags(card.programInfo)"
              :key="`${card.programInfo.id}-rule-${index}`"
              size="small"
              effect="plain">
              {{ tag }}
            </el-tag>
          </div>
        </div>

        <div
          v-if="Number(card.programInfo.programType) === 2 && card.bindInfo.voteNames"
          class="activity-program-cards__section">
          <div class="activity-program-cards__section-title">
            {{ $t('activity.voteProgramTitle') }}
          </div>
          <p class="activity-program-cards__text">{{ card.bindInfo.voteNames }}</p>
        </div>

        <div v-if="card.programInfo.backgroundImage" class="activity-program-cards__section">
          <div class="activity-program-cards__section-title">
            {{ $t('activity.programBackground') }}
          </div>
          <el-image
            class="activity-program-cards__cover"
            :src="String(card.programInfo.backgroundImage)"
            fit="cover"
            :preview-src-list="[String(card.programInfo.backgroundImage)]"
            preview-teleported />
        </div>

        <div
          v-if="Number(card.programInfo.programType) === 1 && card.bindInfo.prizeList?.length"
          class="activity-program-cards__section activity-program-cards__prizes">
          <div class="activity-program-cards__section-title">
            {{ $t('activity.prizeListTitle') }}
          </div>
          <ul class="activity-program-cards__prize-list">
            <li
              v-for="(prize, index) in card.bindInfo.prizeList"
              :key="`${card.programInfo.id}-prize-${index}`"
              class="activity-program-cards__prize">
              <el-image
                v-if="prize.imageUrl"
                class="activity-program-cards__prize-img"
                :src="String(prize.imageUrl)"
                fit="cover"
                :preview-src-list="[String(prize.imageUrl)]"
                preview-teleported />
              <div v-else class="activity-program-cards__prize-placeholder">—</div>
              <div class="activity-program-cards__prize-body">
                <div class="activity-program-cards__prize-name">{{
                  isEn
                    ? String(prize.enName ?? prize.cnName ?? '-')
                    : String(prize.cnName ?? prize.enName ?? '-')
                }}</div>
                <div class="activity-program-cards__prize-amount">{{ prize.amount != null && prize.amount !== '' ? `${prize.amount} RMB` : '-' }}</div>
              </div>
            </li>
          </ul>
        </div>

        <div
          v-if="!readOnly && Number(card.programInfo.programStatus) !== 2"
          class="activity-program-cards__actions">
          <el-button
            v-if="!card.programInfo.currentRoundStatus"
            v-uni-permission="'busdriver_edit'"
            type="primary"
            :loading="changingId === card.programInfo.id"
            @click="changeStatus(card.programInfo, true)">
            {{ $t('activity.programStart') }}
          </el-button>
          <el-button
            v-else
            v-uni-permission="'busdriver_edit'"
            type="primary"
            :loading="changingId === card.programInfo.id"
            @click="changeStatus(card.programInfo, false)">
            {{ $t('activity.programEnd') }}
          </el-button>
        </div>
      </el-card>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useUniI18n } from 'uni-ui-lib'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { computed, onMounted, ref, watch } from 'vue'

import { activityPrizeApi, activityProgramApi, activityVoteProgramApi } from '@/api'
import type { Translate } from '@/types/i18n'
import { normalizeArray, normalizeEnvelope } from '@/utils/api-response-normalize'

type Row = Record<string, unknown>
type ProgramCard = { programInfo: Row; bindInfo: Row & { prizeList?: Row[]; voteNames?: string } }

const props = defineProps<{
  activityId: string | number
  readOnly?: boolean
}>()

const { t, locale } = useUniI18n()
const tr = t as Translate
const loading = ref(false)
const changingId = ref<unknown>(null)
const cards = ref<ProgramCard[]>([])

const isEn = computed(() => locale.value === 'en')

const programTypeText = (value: unknown) => {
  const n = Number(value)
  if (n === 1) return tr('activity.programTypeLottery')
  if (n === 2) return tr('activity.programTypeCompetition')
  if (n === 3) return tr('activity.programTypeBlessing')
  return '-'
}

const statusText = (row: Row) => {
  if (Number(row.programType) === 1 && Number(row.programStatus) === 1) {
    return isEn.value ? `Round ${row.currentRound ?? ''}` : `第${row.currentRound ?? ''}轮`
  }
  const n = Number(row.programStatus)
  if (n === 0) return tr('activity.programStatusPending')
  if (n === 1) return tr('activity.programStatusProgress')
  if (n === 2) return tr('activity.programStatusEnded')
  return '-'
}

const ruleObj = (row: Row): Row =>
  row.rule && typeof row.rule === 'object' ? (row.rule as Row) : {}

const flagOn = (value: unknown) => value === true || value === 1 || value === '1'

const lotteryRuleTags = (rule: Row): string[] => {
  const idText =
    String(rule.lotteryIdentifierType ?? '') === '1'
      ? tr('activity.lotteryIdPhone')
      : tr('activity.lotteryIdNone')
  const scopeText =
    String(rule.lotteryParticipantScope ?? '') === '1'
      ? tr('activity.lotteryScopeUnwon')
      : tr('activity.lotteryScopeAll')
  return [
    flagOn(rule.needPayment) ? tr('activity.ruleNeedPayment') : tr('activity.ruleNoPayment'),
    flagOn(rule.needCheckin) ? tr('activity.ruleNeedCheckin') : tr('activity.ruleNoCheckin'),
    flagOn(rule.createLotteryPool)
      ? tr('activity.ruleCreateLotteryPool')
      : tr('activity.ruleNoLotteryPool'),
    rule.lotteryIdentifierType != null
      ? `${tr('activity.lotteryIdentifierTypePrefix')}${idText}`
      : '',
    rule.lotteryParticipantScope != null
      ? `${tr('activity.lotteryParticipantScopePrefix')}${scopeText}`
      : ''
  ].filter(Boolean)
}

const competitionRuleTags = (rule: Row): string[] => {
  const parts = [flagOn(rule.needVote) ? tr('activity.ruleNeedVote') : tr('activity.ruleNoVote')]
  if (rule.votePerAttemptCount) {
    parts.push(`${tr('activity.votePerAttemptCount')}${rule.votePerAttemptCount}`)
  }
  if (rule.voteStartTime) {
    parts.push(
      `${tr('activity.voteTime')}${dayjs(String(rule.voteStartTime)).format('YYYY-MM-DD HH:mm:ss')}-${dayjs(String(rule.voteEndTime)).format('YYYY-MM-DD HH:mm:ss')}`
    )
  }
  return parts
}

const programRuleTags = (row: Row): string[] => {
  const rule = ruleObj(row)
  const type = Number(row.programType)
  if (type === 1) return lotteryRuleTags(rule)
  if (type === 2) return competitionRuleTags(rule)
  if (type === 3) {
    const blessText =
      String(rule.blessingDisplayRule ?? '') === '2'
        ? tr('activity.blessingLeftRight')
        : tr('activity.blessingTopBottom')
    return [`${tr('activity.blessingDisplayRule')}${blessText}`]
  }
  return []
}

const loadCards = async () => {
  if (!props.activityId) {
    cards.value = []
    return
  }
  loading.value = true
  try {
    const listRaw = await activityProgramApi.listBrief.get({ activityId: props.activityId })
    const list = normalizeArray(listRaw) as Row[]
    const rows: ProgramCard[] = []
    for (const item of list) {
      if (item.id == null) continue
      const programInfo = normalizeEnvelope(
        await activityProgramApi.detail.get(item.id as string | number)
      )
      const bindInfo: ProgramCard['bindInfo'] = {}
      if (Number(programInfo.programType) === 1) {
        const prizeRaw = await activityPrizeApi.listByProgram.get({
          programId: item.id as string | number
        })
        bindInfo.prizeList = normalizeArray(prizeRaw) as Row[]
      }
      if (Number(programInfo.programType) === 2) {
        const voteRaw = await activityVoteProgramApi.listByProgram.get({
          programId: item.id as string | number
        })
        const voteRows = normalizeArray(voteRaw) as Row[]
        bindInfo.voteNames = voteRows
          .map((row) =>
            String(isEn.value ? (row.enName ?? row.cnName ?? '') : (row.cnName ?? row.enName ?? ''))
          )
          .filter(Boolean)
          .join('、')
      }
      rows.push({ programInfo, bindInfo })
    }
    cards.value = rows
  } finally {
    loading.value = false
  }
}

const changeStatus = async (row: Row, startFlag: boolean) => {
  if (row.id == null) return
  changingId.value = row.id
  try {
    await activityProgramApi.editStatus.post({ id: row.id as string | number, startFlag })
    ElMessage.success(startFlag ? tr('activity.programStart') : tr('activity.programEnd'))
    await loadCards()
  } finally {
    changingId.value = null
  }
}

watch(
  () => props.activityId,
  () => void loadCards()
)
onMounted(() => void loadCards())
</script>

<style scoped lang="scss">
.activity-program-cards {
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
    gap: 16px;
  }

  &__card {
    :deep(.el-card__header) {
      padding: 12px 16px;
      background: var(--el-fill-color-lighter);
    }

    :deep(.el-card__body) {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 16px;
    }
  }

  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  &__head-main {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  &__title {
    font-size: 15px;
    font-weight: 600;
    line-height: 1.4;
    color: var(--el-text-color-primary);
  }

  &__desc {
    width: 100%;

    :deep(.el-descriptions__label) {
      width: 88px;
      font-weight: 500;
    }
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__section-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-regular);
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__text {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
    color: var(--el-text-color-primary);
    word-break: break-word;
  }

  &__cover {
    width: 100%;
    max-width: 280px;
    height: 120px;
    border-radius: 6px;
    border: 1px solid var(--el-border-color-lighter);
  }

  &__prizes {
    padding-top: 4px;
    border-top: 1px dashed var(--el-border-color-lighter);
  }

  &__prize-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__prize {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    background: var(--el-fill-color-lighter);
    border: 1px solid var(--el-border-color-lighter);
  }

  &__prize-img,
  &__prize-placeholder {
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    border-radius: 6px;
    border: 1px solid var(--el-border-color-lighter);
  }

  &__prize-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: var(--el-text-color-placeholder);
    background: var(--el-fill-color-blank);
  }

  &__prize-body {
    min-width: 0;
    flex: 1;
  }

  &__prize-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    word-break: break-word;
  }

  &__prize-amount {
    margin-top: 4px;
    font-size: 13px;
    color: var(--el-color-primary);
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    padding-top: 4px;
    border-top: 1px solid var(--el-border-color-lighter);
  }
}
</style>
