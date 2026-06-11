<template>
  <section v-loading="loading" class="activity-program-cards">
    <el-empty v-if="!loading && !cards.length" :description="$t('activity.detailTabNoData')" />
    <el-row v-else :gutter="16" class="activity-program-cards__grid">
      <el-col
        v-for="card in cards"
        :key="String(card.programInfo.id)"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6">
        <article class="activity-program-cards__card">
          <header class="activity-program-cards__header">
            <div class="activity-program-cards__header-text">
              <h3 class="activity-program-cards__title">
                {{ pickLocaleName(card.programInfo, locale) }}
              </h3>
            </div>
            <span
              v-if="
                Number(card.programInfo.programType) === 1 &&
                Number(card.programInfo.programStatus) === 1
              "
              class="activity-program-cards__round-badge">
              {{
                isEn
                  ? `Round ${String(card.programInfo.currentRound ?? '').padStart(2, '0')}`
                  : `?${String(card.programInfo.currentRound ?? '').padStart(2, '0')}?`
              }}
            </span>
            <span
              v-else-if="Number(card.programInfo.programType) !== 1"
              class="activity-program-cards__status-badge">
              {{
                Number(card.programInfo.programStatus) === 0
                  ? $t('activity.programStatusPending')
                  : Number(card.programInfo.programStatus) === 1
                    ? $t('activity.programStatusProgress')
                    : Number(card.programInfo.programStatus) === 2
                      ? $t('activity.programStatusEnded')
                      : '-'
              }}
            </span>
          </header>

          <div
            v-if="Number(card.programInfo.programType) === 1"
            class="activity-program-cards__stats">
            <div
              v-for="item in lotteryStats(card.programInfo)"
              :key="item.key"
              :class="['activity-program-cards__stat', { 'is-active': item.active }]">
              <span class="activity-program-cards__stat-label">{{ item.label }}</span>
              <strong class="activity-program-cards__stat-value">{{ item.value }}</strong>
            </div>
          </div>

          <el-descriptions
            v-else
            :column="2"
            size="small"
            border
            class="activity-program-cards__desc">
            <el-descriptions-item label="ID">{{ card.programInfo.id ?? '-' }}</el-descriptions-item>
            <el-descriptions-item :label="$t('activity.programType')">
              {{ programTypeText(card.programInfo.programType) }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="Number(card.programInfo.programType) === 2"
              :label="$t('activity.winnerQuota')">
              {{ ruleObj(card.programInfo).prizeCount ?? '-' }}
            </el-descriptions-item>
          </el-descriptions>

          <section
            v-if="programRuleTags(card.programInfo).length"
            class="activity-program-cards__block">
            <h4 class="activity-program-cards__block-title">{{ $t('activity.programRules') }}</h4>
            <div class="activity-program-cards__tags">
              <span
                v-for="(tag, index) in programRuleTags(card.programInfo)"
                :key="`${card.programInfo.id}-rule-${index}`"
                :class="['activity-program-cards__tag', `is-${tag.tone}`]">
                {{ tag.text }}
              </span>
            </div>
          </section>

          <section
            v-if="Number(card.programInfo.programType) === 2 && card.bindInfo.voteNames"
            class="activity-program-cards__block">
            <h4 class="activity-program-cards__block-title">
              {{ $t('activity.voteProgramTitle') }}
            </h4>
            <p class="activity-program-cards__text">{{ card.bindInfo.voteNames }}</p>
          </section>

          <section v-if="card.programInfo.backgroundImage" class="activity-program-cards__block">
            <h4 class="activity-program-cards__block-title">
              {{ $t('activity.programBackground') }}
            </h4>
            <el-image
              class="activity-program-cards__cover"
              :src="String(card.programInfo.backgroundImage)"
              fit="cover"
              :preview-src-list="[String(card.programInfo.backgroundImage)]"
              preview-teleported />
          </section>

          <section
            v-if="Number(card.programInfo.programType) === 1 && card.bindInfo.prizeList?.length"
            class="activity-program-cards__block">
            <h4 class="activity-program-cards__block-title">{{ $t('activity.prizeListTitle') }}</h4>
            <ul class="activity-program-cards__prize-list">
              <li
                v-for="(prize, index) in card.bindInfo.prizeList"
                :key="`${card.programInfo.id}-prize-${index}`"
                class="activity-program-cards__prize">
                <div class="activity-program-cards__prize-media">
                  <el-image
                    v-if="prize.imageUrl"
                    class="activity-program-cards__prize-img"
                    :src="String(prize.imageUrl)"
                    fit="cover"
                    :preview-src-list="[String(prize.imageUrl)]"
                    preview-teleported />
                  <span v-else class="activity-program-cards__prize-placeholder">-</span>
                </div>
                <div class="activity-program-cards__prize-main">
                  <div class="activity-program-cards__prize-name">{{ prizeName(prize) }}</div>
                  <p v-if="prizeSubtitle(prize)" class="activity-program-cards__prize-desc">
                    {{ prizeSubtitle(prize) }}
                  </p>
                  <span class="activity-program-cards__prize-tag">{{
                    $t('activity.programCardPremiumPrize')
                  }}</span>
                </div>
                <div class="activity-program-cards__prize-price">{{ prizeAmount(prize) }}</div>
              </li>
            </ul>
          </section>

          <footer
            v-if="!readOnly && Number(card.programInfo.programStatus) !== 2"
            class="activity-program-cards__footer">
            <el-button
              v-if="!card.programInfo.currentRoundStatus"
              v-uni-permission="'busdriver_edit'"
              class="activity-program-cards__cta"
              :loading="changingId === card.programInfo.id"
              @click="changeStatus(card.programInfo, true)">
              {{
                Number(card.programInfo.programType) === 1
                  ? $t('activity.programCardStartDraw')
                  : $t('activity.programStart')
              }}
            </el-button>
            <el-button
              v-else
              v-uni-permission="'busdriver_edit'"
              class="activity-program-cards__cta"
              :loading="changingId === card.programInfo.id"
              @click="changeStatus(card.programInfo, false)">
              {{
                Number(card.programInfo.programType) === 1
                  ? $t('activity.programCardEndDraw')
                  : $t('activity.programEnd')
              }}
            </el-button>
          </footer>
        </article>
      </el-col>
    </el-row>
  </section>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
import { computed, onMounted, ref, watch } from 'vue'

import { activityPrizeApi, activityProgramApi, activityVoteProgramApi } from '@/api'
import type { Translate } from '@/types/i18n'
import { normalizeArray, normalizeEnvelope } from '@/utils/api-response-normalize'
import { pickLocaleName } from '@/utils/locale-name'

type Row = Record<string, unknown>
type RuleTag = { text: string; tone: 'muted' | 'accent' }
type ProgramCard = { programInfo: Row; bindInfo: Row & { prizeList?: Row[]; voteNames?: string } }
type StatItem = { key: string; label: string; value: string; active?: boolean }

const props = defineProps<{ activityId: string | number; readOnly?: boolean }>()

const { t, locale } = useUniI18n()
const tr = t as Translate
const loading = ref(false)
const changingId = ref<unknown>(null)
const cards = ref<ProgramCard[]>([])

const isEn = computed(() => locale.value === 'en')

const prizeName = (row: Row) => pickLocaleName(row, locale.value) || '-'
const prizeSubtitle = (row: Row) => {
  const primary = pickLocaleName(row, locale.value)
  const alt = pickLocaleName(row, isEn.value ? 'zh-CN' : 'en')
  return alt && alt !== primary ? alt : ''
}
const prizeAmount = (row: Row) =>
  row.amount != null && row.amount !== '' ? `${row.amount} RMB` : '-'

const programTypeText = (value: unknown) => {
  const n = Number(value)
  if (n === 1) return tr('activity.programTypeLottery')
  if (n === 2) return tr('activity.programTypeCompetition')
  if (n === 3) return tr('activity.programTypeBlessing')
  return '-'
}

const ruleObj = (row: Row): Row =>
  row.rule && typeof row.rule === 'object' ? (row.rule as Row) : {}

const flagOn = (value: unknown) => value === true || value === 1 || value === '1'

const lotteryStats = (row: Row): StatItem[] => {
  const rule = ruleObj(row)
  const quota = rule.prizeCount != null && rule.prizeCount !== '' ? String(rule.prizeCount) : '-'
  const inProgress = Number(row.programStatus) === 1
  return [
    { key: 'id', label: tr('activity.programCardLotteryId'), value: String(row.id ?? '-') },
    {
      key: 'total',
      label: tr('activity.colTotalRounds'),
      value: String(row.totalRounds ?? '-')
    },
    {
      key: 'current',
      label: tr('activity.colCurrentRound'),
      value: String(row.currentRound ?? '-'),
      active: inProgress
    },
    { key: 'prize', label: tr('activity.prizeCount'), value: quota }
  ]
}

const lotteryRuleTags = (rule: Row): RuleTag[] => {
  const idText =
    String(rule.lotteryIdentifierType ?? '') === '1'
      ? tr('activity.lotteryIdPhone')
      : tr('activity.lotteryIdNone')
  const scopeText =
    String(rule.lotteryParticipantScope ?? '') === '1'
      ? tr('activity.lotteryScopeUnwon')
      : tr('activity.lotteryScopeAll')
  const tags: RuleTag[] = [
    {
      text: flagOn(rule.needPayment)
        ? tr('activity.ruleNeedPayment')
        : tr('activity.ruleNoPayment'),
      tone: flagOn(rule.needPayment) ? 'accent' : 'muted'
    },
    {
      text: flagOn(rule.needCheckin)
        ? tr('activity.ruleNeedCheckin')
        : tr('activity.ruleNoCheckin'),
      tone: flagOn(rule.needCheckin) ? 'accent' : 'muted'
    },
    {
      text: flagOn(rule.createLotteryPool)
        ? tr('activity.ruleCreateLotteryPool')
        : tr('activity.ruleNoLotteryPool'),
      tone: flagOn(rule.createLotteryPool) ? 'accent' : 'muted'
    }
  ]
  if (rule.lotteryIdentifierType != null) {
    tags.push({
      text: `${tr('activity.lotteryIdentifierTypePrefix')}${idText}`,
      tone: 'muted'
    })
  }
  if (rule.lotteryParticipantScope != null) {
    tags.push({
      text: `${tr('activity.lotteryParticipantScopePrefix')}${scopeText}`,
      tone: 'accent'
    })
  }
  return tags
}

const competitionRuleTags = (rule: Row): RuleTag[] => {
  const tags: RuleTag[] = [
    {
      text: flagOn(rule.needVote) ? tr('activity.ruleNeedVote') : tr('activity.ruleNoVote'),
      tone: flagOn(rule.needVote) ? 'accent' : 'muted'
    }
  ]
  if (rule.votePerAttemptCount) {
    tags.push({
      text: `${tr('activity.votePerAttemptCount')}${rule.votePerAttemptCount}`,
      tone: 'muted'
    })
  }
  if (rule.voteStartTime) {
    tags.push({
      text: `${tr('activity.voteTime')}${dayjs(String(rule.voteStartTime)).format('YYYY-MM-DD HH:mm:ss')}-${dayjs(String(rule.voteEndTime)).format('YYYY-MM-DD HH:mm:ss')}`,
      tone: 'muted'
    })
  }
  return tags
}

const programRuleTags = (row: Row): RuleTag[] => {
  const rule = ruleObj(row)
  const type = Number(row.programType)
  if (type === 1) return lotteryRuleTags(rule)
  if (type === 2) return competitionRuleTags(rule)
  if (type === 3) {
    const blessText =
      String(rule.blessingDisplayRule ?? '') === '2'
        ? tr('activity.blessingLeftRight')
        : tr('activity.blessingTopBottom')
    return [{ text: `${tr('activity.blessingDisplayRule')}${blessText}`, tone: 'muted' }]
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
        bindInfo.voteNames = (normalizeArray(voteRaw) as Row[])
          .map((row) => pickLocaleName(row, locale.value))
          .filter(Boolean)
          .join('?')
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
  --prog-navy: #101828;
  --prog-accent-bg: #fff7ed;
  --prog-accent-text: #c2410c;

  &__grid {
    width: 100%;
  }

  &__card {
    height: 100%;
    padding: 20px;
    border-radius: 16px;
    background: #fff;
    border: 1px solid var(--el-border-color-lighter);
    box-shadow: 0 8px 24px rgb(16 24 40 / 8%);
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
  }

  &__header-text {
    min-width: 0;
  }

  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.3;
    color: var(--prog-navy);
  }

  &__subtitle {
    margin: 6px 0 0;
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  &__round-badge,
  &__status-badge {
    flex-shrink: 0;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.2;
  }

  &__round-badge {
    color: #fff;
    background: var(--prog-navy);
  }

  &__status-badge {
    color: var(--prog-navy);
    background: var(--el-fill-color-light);
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
    margin-bottom: 16px;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-height: 68px;
    padding: 10px 6px;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 10px;
    background: #fff;
    text-align: center;

    &.is-active {
      border-color: var(--prog-navy);
      background: var(--prog-navy);
      box-shadow: 0 4px 12px rgb(16 24 40 / 18%);

      .activity-program-cards__stat-label,
      .activity-program-cards__stat-value {
        color: #fff;
      }
    }
  }

  &__stat-label {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    line-height: 1.3;
  }

  &__stat-value {
    font-size: 18px;
    font-weight: 700;
    line-height: 1.1;
    color: var(--prog-navy);
  }

  &__desc {
    width: 100%;
    margin-bottom: 16px;
  }

  &__block {
    margin-bottom: 18px;

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  &__block-title {
    margin: 0 0 10px;
    font-size: 12px;
    font-weight: 500;
    color: var(--el-text-color-secondary);
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__tag {
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 13px;
    line-height: 1.3;

    &.is-muted {
      color: var(--el-text-color-regular);
      background: var(--el-fill-color-light);
    }

    &.is-accent {
      color: var(--prog-accent-text);
      background: var(--prog-accent-bg);
    }
  }

  &__text {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
    color: var(--el-text-color-primary);
  }

  &__cover {
    width: 100%;
    max-width: 320px;
    height: 128px;
    border-radius: 10px;
    border: 1px solid var(--el-border-color-lighter);
  }

  &__prize-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__prize {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 16px;
    border-radius: 12px;
    background: var(--el-fill-color-lighter);
    border: 1px solid var(--el-border-color-lighter);
  }

  &__prize-media {
    flex-shrink: 0;
    width: 72px;
    height: 72px;
    padding: 6px;
    border-radius: 10px;
    background: #fff;
    border: 1px solid var(--el-border-color-lighter);
  }

  &__prize-img {
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }

  &__prize-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 13px;
    color: var(--el-text-color-placeholder);
  }

  &__prize-main {
    flex: 1;
    min-width: 0;
  }

  &__prize-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--prog-navy);
  }

  &__prize-desc {
    margin: 4px 0 8px;
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  &__prize-tag {
    display: inline-block;
    padding: 2px 8px;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  &__prize-price {
    flex-shrink: 0;
    font-size: 15px;
    font-weight: 500;
    color: var(--el-text-color-secondary);
  }

  &__footer {
    margin-top: 20px;
    padding-top: 4px;
  }

  &__cta {
    width: 100%;
    height: 44px;
    border: none !important;
    border-radius: 10px !important;
    font-size: 15px !important;
    font-weight: 600 !important;
    color: #fff !important;
    background: var(--prog-navy) !important;

    &:hover,
    &:focus {
      color: #fff !important;
      background: #1e293b !important;
    }
  }
}

@media (width <= 992px) {
  .activity-program-cards__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (width <= 576px) {
  .activity-program-cards__stat.is-active {
    grid-column: 1 / -1;
  }

  .activity-program-cards__prize {
    flex-wrap: wrap;
  }

  .activity-program-cards__prize-price {
    width: 100%;
    text-align: right;
  }
}
</style>
