import { describe, it, expect } from 'vitest'
import type { Translate } from '@/types/i18n'
import type {
  ActivityProgramFormModel,
  ActivityProgramQuotaRow
} from '@/types/modules/activity-program-form'
import {
  emptyProgramForm,
  applyLotteryDefaults,
  findActivityRow,
  validateProgramQuotas,
  buildProgramSubmitPayload
} from '../../../../views/activity/program/edit/program-edit-payload'

const t = ((key: string) => key) as Translate

const makeForm = (overrides: Partial<ActivityProgramFormModel> = {}): ActivityProgramFormModel => ({
  ...emptyProgramForm(),
  ...overrides
})

describe('program-edit-payload.ts', () => {
  describe('emptyProgramForm', () => {
    it('应返回所有字段初始值', () => {
      const f = emptyProgramForm()
      expect(f.cnName).toBe('')
      expect(f.enName).toBe('')
      expect(f.activityId).toBeUndefined()
      expect(f.backgroundImage).toBe('')
      expect(f.programType).toBe('')
      expect(f.sortOrder).toBe(0)
      expect(f.totalRounds).toBe(0)
      expect(f.createLotteryPool).toBe('0')
      expect(f.lotteryIdentifierType).toBe('0')
      expect(f.lotteryParticipantScope).toBe('0')
      expect(f.needCheckin).toBe('0')
      expect(f.needPayment).toBe('0')
      expect(f.prizeCount).toBe(0)
      expect(f.checkinEndOffsetMinutes).toBe(0)
      expect(f.checkinStartOffsetMinutes).toBe(0)
      expect(f.needVote).toBe('0')
      expect(f.votePerAttemptCount).toBe(0)
      expect(f.voteStartTime).toBe('')
      expect(f.voteEndTime).toBe('')
      expect(f.blessingDisplayRule).toBe('1')
      expect(f.programQuotasMarker).toBe('')
    })
  })

  describe('applyLotteryDefaults', () => {
    it('应重置抽奖相关字段为默认值', () => {
      const f: ActivityProgramFormModel = {
        ...emptyProgramForm(),
        createLotteryPool: '1',
        lotteryIdentifierType: '3',
        lotteryParticipantScope: '5',
        needCheckin: '2',
        needPayment: '1'
      }
      applyLotteryDefaults(f)
      expect(f.createLotteryPool).toBe('0')
      expect(f.lotteryIdentifierType).toBe('0')
      expect(f.lotteryParticipantScope).toBe('0')
      expect(f.needCheckin).toBe('0')
      expect(f.needPayment).toBe('0')
    })
  })

  describe('findActivityRow', () => {
    const rows = [
      { id: '1', name: '活动A' },
      { id: 2, name: '活动B' },
      { id: '3', name: '活动C' }
    ]

    it('按字符串 id 查找', () => {
      expect(findActivityRow(rows, '1')).toMatchObject({ name: '活动A' })
    })

    it('按数字 id 查找', () => {
      expect(findActivityRow(rows, 2)).toMatchObject({ name: '活动B' })
    })

    it('id 不匹配返回 undefined', () => {
      expect(findActivityRow(rows, '999')).toBeUndefined()
    })

    it('id 为 null 返回 undefined', () => {
      expect(findActivityRow(rows, null)).toBeUndefined()
    })

    it('id 为空字符串返回 undefined', () => {
      expect(findActivityRow(rows, '')).toBeUndefined()
    })
  })

  describe('validateProgramQuotas', () => {
    it('空配额返回 null', () => {
      expect(validateProgramQuotas([], 10, t)).toBeNull()
    })

    it('所有配额有效返回 null', () => {
      const quotas: ActivityProgramQuotaRow[] = [
        { roundNo: 1, quotaCount: 5 },
        { roundNo: 2, quotaCount: 5 }
      ]
      expect(validateProgramQuotas(quotas, 10, t)).toBeNull()
    })

    it('有配额 ≤ 0 返回错误', () => {
      const quotas: ActivityProgramQuotaRow[] = [{ roundNo: 1, quotaCount: 0 }]
      expect(validateProgramQuotas(quotas, 10, t)).toBe('activity.quotaMustPositive')
    })

    it('配额总数超过奖品数返回错误', () => {
      const quotas: ActivityProgramQuotaRow[] = [
        { roundNo: 1, quotaCount: 10 },
        { roundNo: 2, quotaCount: 5 }
      ]
      expect(validateProgramQuotas(quotas, 10, t)).toBe('activity.quotaExceedPrize')
    })

    it('prizeCount 为 0 时不校验超额', () => {
      const quotas: ActivityProgramQuotaRow[] = [{ roundNo: 1, quotaCount: 100 }]
      expect(validateProgramQuotas(quotas, 0, t)).toBeNull()
    })
  })

  describe('buildProgramSubmitPayload', () => {
    it('抽奖节目 payload 应包含规则和配额', () => {
      const m = makeForm({
        id: undefined,
        activityId: 'A1',
        cnName: '抽奖',
        enName: 'Lottery',
        programType: '1',
        totalRounds: 2,
        sortOrder: 1,
        createLotteryPool: '1',
        lotteryIdentifierType: '2',
        lotteryParticipantScope: '3',
        needCheckin: '1',
        needPayment: '0',
        prizeCount: 100,
        checkinEndOffsetMinutes: 30,
        checkinStartOffsetMinutes: 15
      })
      const quotas: ActivityProgramQuotaRow[] = [
        { roundNo: 1, quotaCount: 40 },
        { roundNo: 2, quotaCount: 60 }
      ]

      const payload = buildProgramSubmitPayload(m, quotas)

      expect(payload.activityId).toBe('A1')
      expect(payload.cnName).toBe('抽奖')
      expect(payload.programType).toBe('1')
      expect(payload.totalRounds).toBe(2)
      expect(payload.rule).toMatchObject({
        createLotteryPool: '1',
        lotteryIdentifierType: '2',
        lotteryParticipantScope: '3',
        needCheckin: '1',
        needPayment: '0',
        prizeCount: 100
      })
      expect(payload.quotas).toHaveLength(2)
      expect((payload.quotas as Record<string, unknown>[])[0]).toMatchObject({
        roundNo: 1,
        quotaCount: 40
      })
    })

    it('投票节目 payload 应包含投票规则', () => {
      const m = makeForm({
        activityId: 'A2',
        cnName: '投票',
        enName: 'Vote',
        programType: '2',
        needVote: '1',
        votePerAttemptCount: 3,
        voteStartTime: '2025-06-01',
        voteEndTime: '2025-06-30',
        prizeCount: 10
      })

      const payload = buildProgramSubmitPayload(m, [])
      expect(payload.totalRounds).toBe(1)
      expect(payload.rule).toMatchObject({
        needVote: '1',
        votePerAttemptCount: 3,
        prizeCount: 10
      })
      expect(payload.quotas).toBeUndefined()
    })

    it('祝福节目 payload 应包含祝福规则', () => {
      const m = makeForm({
        activityId: 'A3',
        cnName: '祝福',
        enName: 'Blessing',
        programType: '3',
        blessingDisplayRule: '2'
      })

      const payload = buildProgramSubmitPayload(m, [])
      expect(payload.totalRounds).toBe(1)
      expect(payload.rule).toMatchObject({ blessingDisplayRule: '2' })
    })

    it('有 id 时应带 id 字段', () => {
      const m = makeForm({
        id: '999',
        activityId: 'A4',
        cnName: '更新',
        programType: '2'
      })

      const payload = buildProgramSubmitPayload(m, [])
      expect(payload.id).toBe('999')
    })

    it('无 id 时不应带 id', () => {
      const m = makeForm({
        id: undefined,
        activityId: 'A5',
        cnName: '新建',
        programType: '2'
      })

      const payload = buildProgramSubmitPayload(m, [])
      expect(payload.id).toBeUndefined()
    })

    it('sortOrder 为空字符串时应转为 0', () => {
      const m: ActivityProgramFormModel = {
        ...emptyProgramForm(),
        cnName: '测试',
        programType: '2',
        sortOrder: '' as unknown as number
      }
      const payload = buildProgramSubmitPayload(m, [])
      expect(payload.sortOrder).toBe(0)
    })

    it('未知节目类型不设置额外规则', () => {
      const m = makeForm({
        activityId: 'A6',
        cnName: '未知类型',
        programType: '99'
      })
      const payload = buildProgramSubmitPayload(m, [])
      expect(payload.totalRounds).toBeUndefined()
      expect(payload.rule).toEqual({})
    })
  })
})
