<template>
  <section v-loading="loading" class="activity-program-cards">
    <el-empty v-if="!loading && !cards.length" :description="$t('activity.detailTabNoData')" />
    <div v-else class="activity-program-cards__grid">
      <el-card v-for="card in cards" :key="String(card.programInfo.id)" shadow="never">
        <template #header>
          <div class="activity-program-cards__head">
            <span class="activity-program-cards__title">{{ programName(card.programInfo) }}</span>
            <span :class="['activity-program-cards__status', `is-${card.programInfo.programStatus}`]">
              {{ statusText(card.programInfo) }}
            </span>
          </div>
        </template>

        <div class="activity-program-cards__body">
          <InfoItem label="ID" :value="card.programInfo.id" />
          <InfoItem :label="$t('activity.programType')" :value="programTypeText(card.programInfo.programType)" />
          <InfoItem :label="$t('activity.programRules')" :value="programRules(card.programInfo)" wide />
          <InfoItem :label="$t('activity.programBackground')" wide>
            <el-image
              v-if="card.programInfo.backgroundImage"
              class="activity-program-cards__image"
              :src="String(card.programInfo.backgroundImage)"
              fit="cover"
              :preview-src-list="[String(card.programInfo.backgroundImage)]"
              preview-teleported
            />
            <span v-else>-</span>
          </InfoItem>

          <template v-if="Number(card.programInfo.programType) === 2">
            <InfoItem :label="$t('activity.voteProgramTitle')" :value="card.bindInfo.voteNames || '-'" wide />
            <InfoItem :label="$t('activity.winnerQuota')" :value="ruleValue(card.programInfo, 'prizeCount')" />
          </template>

          <template v-if="Number(card.programInfo.programType) === 1">
            <InfoItem :label="$t('activity.colTotalRounds')" :value="card.programInfo.totalRounds" />
            <InfoItem :label="$t('activity.colCurrentRound')" :value="card.programInfo.currentRound" />
            <InfoItem :label="$t('activity.winnerQuota')" :value="ruleValue(card.programInfo, 'prizeCount')" />
            <InfoItem :label="$t('activity.prizeCount')" :value="ruleValue(card.programInfo, 'prizeCount')" />
            <div v-if="card.bindInfo.prizeList?.length" class="activity-program-cards__prizes">
              <div class="activity-program-cards__label">{{ $t('activity.prizeListTitle') }}:</div>
              <div
                v-for="(prize, index) in card.bindInfo.prizeList"
                :key="`${card.programInfo.id}-prize-${index}`"
                class="activity-program-cards__prize"
              >
                <InfoItem :label="$t('activity.prizeName')" :value="prizeName(prize)" wide />
                <InfoItem :label="$t('activity.prizeAmount')" :value="prizeAmount(prize)" wide />
                <InfoItem :label="$t('activity.prizeImage')" wide>
                  <el-image
                    v-if="prize.imageUrl"
                    class="activity-program-cards__image"
                    :src="String(prize.imageUrl)"
                    fit="cover"
                    :preview-src-list="[String(prize.imageUrl)]"
                    preview-teleported
                  />
                  <span v-else>-</span>
                </InfoItem>
              </div>
            </div>
          </template>

          <div v-if="canChangeStatus(card.programInfo)" class="activity-program-cards__actions">
            <el-button
              v-if="!card.programInfo.currentRoundStatus"
              v-uni-permission="'busdriver_edit'"
              type="primary"
              :loading="changingId === card.programInfo.id"
              @click="changeStatus(card.programInfo, true)"
            >
              {{ $t('activity.programStart') }}
            </el-button>
            <el-button
              v-else
              v-uni-permission="'busdriver_edit'"
              type="primary"
              :loading="changingId === card.programInfo.id"
              @click="changeStatus(card.programInfo, false)"
            >
              {{ $t('activity.programEnd') }}
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useUniI18n } from 'uni-ui-lib'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { computed, h, onMounted, ref, watch } from 'vue'

import { activityPrizeApi, activityProgramApi, activityVoteProgramApi } from '@/api'
import type { Translate } from '@/types/i18n'
import { normalizeArray, normalizeEnvelope } from '@/utils/api-response-normalize'

type Row = Record<string, unknown>
type ProgramCard = { programInfo: Row; bindInfo: Row & { prizeList?: Row[]; voteNames?: string } }

const InfoItem = (props: { label: string; value?: unknown; wide?: boolean }, ctx: { slots: { default?: () => unknown[] } }) =>
  h('div', { class: ['activity-program-cards__item', props.wide ? 'is-wide' : ''] }, [
    h('div', { class: 'activity-program-cards__label' }, `${props.label}:`),
    h('div', { class: 'activity-program-cards__value' }, ctx.slots.default ? ctx.slots.default() : String(props.value ?? '-'))
  ])

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

const programName = (row: Row) => String(isEn.value ? (row.enName ?? row.cnName ?? '') : (row.cnName ?? row.enName ?? ''))
const prizeName = (row: Row) => String(isEn.value ? (row.enName ?? row.cnName ?? '-') : (row.cnName ?? row.enName ?? '-'))
const prizeAmount = (row: Row) => (row.amount != null && row.amount !== '' ? `${row.amount}RMB` : '-')

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

const ruleObj = (row: Row): Row => (row.rule && typeof row.rule === 'object' ? (row.rule as Row) : {})
const ruleValue = (row: Row, key: string) => ruleObj(row)[key] ?? '-'
const boolLike = (value: unknown) => value === true || value === 1 || value === '1'
const lotteryIdentifierText = (value: unknown) =>
  String(value ?? '') === '1' ? tr('activity.lotteryIdPhone') : tr('activity.lotteryIdNone')
const lotteryScopeText = (value: unknown) =>
  String(value ?? '') === '1' ? tr('activity.lotteryScopeUnwon') : tr('activity.lotteryScopeAll')
const blessingRuleText = (value: unknown) =>
  String(value ?? '') === '2' ? tr('activity.blessingLeftRight') : tr('activity.blessingTopBottom')

const programRules = (row: Row) => {
  const rule = ruleObj(row)
  const type = Number(row.programType)
  if (type === 1) {
    return [
      boolLike(rule.needPayment) ? tr('activity.ruleNeedPayment') : tr('activity.ruleNoPayment'),
      boolLike(rule.needCheckin) ? tr('activity.ruleNeedCheckin') : tr('activity.ruleNoCheckin'),
      boolLike(rule.createLotteryPool) ? tr('activity.ruleCreateLotteryPool') : tr('activity.ruleNoLotteryPool'),
      rule.lotteryIdentifierType != null
        ? `${tr('activity.lotteryIdentifierTypePrefix')}${lotteryIdentifierText(rule.lotteryIdentifierType)}`
        : '',
      rule.lotteryParticipantScope != null
        ? `${tr('activity.lotteryParticipantScopePrefix')}${lotteryScopeText(rule.lotteryParticipantScope)}`
        : ''
    ]
      .filter(Boolean)
      .join(', ')
  }
  if (type === 2) {
    const parts = [boolLike(rule.needVote) ? tr('activity.ruleNeedVote') : tr('activity.ruleNoVote')]
    if (rule.votePerAttemptCount) parts.push(`${tr('activity.votePerAttemptCount')}${rule.votePerAttemptCount}`)
    if (rule.voteStartTime) {
      parts.push(
        `${tr('activity.voteTime')}${dayjs(String(rule.voteStartTime)).format('YYYY-MM-DD HH:mm:ss')}-${dayjs(String(rule.voteEndTime)).format('YYYY-MM-DD HH:mm:ss')}`
      )
    }
    return parts.join(', ')
  }
  if (type === 3) {
    return `${tr('activity.blessingDisplayRule')}${blessingRuleText(rule.blessingDisplayRule)}`
  }
  return '-'
}

const canChangeStatus = (row: Row) => !props.readOnly && Number(row.programStatus) !== 2

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
      const programInfo = normalizeEnvelope(await activityProgramApi.detail.get(item.id as string | number))
      const bindInfo: ProgramCard['bindInfo'] = {}
      if (Number(programInfo.programType) === 1) {
        const prizeRaw = await activityPrizeApi.listByProgram.get({ programId: item.id as string | number })
        bindInfo.prizeList = normalizeArray(prizeRaw) as Row[]
      }
      if (Number(programInfo.programType) === 2) {
        const voteRaw = await activityVoteProgramApi.listByProgram.get({ programId: item.id as string | number })
        const voteRows = normalizeArray(voteRaw) as Row[]
        bindInfo.voteNames = voteRows
          .map((row) => String(isEn.value ? (row.enName ?? row.cnName ?? '') : (row.cnName ?? row.enName ?? '')))
          .filter(Boolean)
          .join(', ')
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

watch(() => props.activityId, () => void loadCards())
onMounted(() => void loadCards())
</script>

<style scoped lang="scss">
.activity-program-cards {
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 16px;
  }

  &__head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  &__title {
    font-weight: 600;
  }

  &__status {
    color: var(--el-color-danger);

    &.is-1 {
      color: var(--el-color-success);
    }

    &.is-2 {
      color: var(--el-text-color-secondary);
    }
  }

  &__body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 16px;
  }

  &__item.is-wide,
  &__prizes,
  &__actions {
    grid-column: 1 / -1;
  }

  &__label {
    color: var(--el-text-color-secondary);
    font-size: 13px;
    margin-bottom: 4px;
  }

  &__value {
    word-break: break-word;
  }

  &__image {
    width: 200px;
    height: 100px;
    border-radius: 4px;
  }

  &__prizes {
    border-top: 1px solid var(--el-border-color-lighter);
    padding-top: 10px;
  }

  &__prize {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 16px;
    padding: 8px 0;
  }

  &__actions {
    text-align: right;
    margin-top: 4px;
  }
}
</style>
