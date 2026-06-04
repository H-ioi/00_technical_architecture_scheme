import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import type { ActivityProgramQuotaRow } from '@/types/modules/activity-program-form'
import {
  fillQuotasFromDetail,
  applyProgramDetailToForm
} from '../../../../views/activity/program/edit/program-edit-detail'
import type { ActivityProgramFormModel } from '@/types/modules/activity-program-form'

const emptyForm = (): ActivityProgramFormModel => ({
  id: undefined,
  cnName: '',
  enName: '',
  activityId: undefined,
  backgroundImage: '',
  programType: '',
  sortOrder: 0,
  totalRounds: 0,
  createLotteryPool: '0',
  lotteryIdentifierType: '0',
  lotteryParticipantScope: '0',
  needCheckin: '0',
  needPayment: '0',
  prizeCount: 0,
  checkinEndOffsetMinutes: 0,
  checkinStartOffsetMinutes: 0,
  needVote: '0',
  votePerAttemptCount: 0,
  voteStartTime: '',
  voteEndTime: '',
  blessingDisplayRule: '1',
  programQuotasMarker: ''
})

describe('program-edit-detail.ts', () => {
  describe('fillQuotasFromDetail', () => {
    it('数组配额应正确填充', () => {
      const quotasList: Ref<ActivityProgramQuotaRow[]> = ref([])
      fillQuotasFromDetail(
        quotasList,
        [
          { roundNo: 1, quotaCount: 10 },
          { roundNo: 2, quotaCount: 20 }
        ],
        0
      )
      expect(quotasList.value).toHaveLength(2)
      expect(quotasList.value[0]).toMatchObject({ roundNo: 1, quotaCount: 10 })
      expect(quotasList.value[1]).toMatchObject({ roundNo: 2, quotaCount: 20 })
    })

    it('非数组但 totalRounds > 0 应生成默认配额', () => {
      const quotasList: Ref<ActivityProgramQuotaRow[]> = ref([])
      fillQuotasFromDetail(quotasList, null, 3)
      expect(quotasList.value).toHaveLength(3)
      expect(quotasList.value[0]).toMatchObject({ roundNo: 1, quotaCount: 1 })
      expect(quotasList.value[2]).toMatchObject({ roundNo: 3, quotaCount: 1 })
    })

    it('空数组且 totalRounds 为 0 应返回空', () => {
      const quotasList: Ref<ActivityProgramQuotaRow[]> = ref([{ roundNo: 1, quotaCount: 5 }])
      fillQuotasFromDetail(quotasList, [], 0)
      expect(quotasList.value).toEqual([])
    })

    it('roundNo 和 quotaCount 应转为整数', () => {
      const quotasList: Ref<ActivityProgramQuotaRow[]> = ref([])
      fillQuotasFromDetail(quotasList, [{ roundNo: '1', quotaCount: '10.9' }], 0)
      expect(quotasList.value[0].roundNo).toBe(1)
      expect(quotasList.value[0].quotaCount).toBe(10)
    })
  })

  describe('applyProgramDetailToForm', () => {
    it('抽奖节目(1)应正确回填所有抽奖字段', () => {
      const form = emptyForm()
      const quotasList = ref<ActivityProgramQuotaRow[]>([])
      const serverStatus = ref('')
      const serverType = ref('')
      const serverTotalRounds = ref<number | string>(0)

      applyProgramDetailToForm(form, quotasList, serverStatus, serverType, serverTotalRounds, {
        id: '100',
        activityId: '200',
        cnName: '测试抽奖',
        enName: 'Test Lottery',
        backgroundImage: '/bg.png',
        programType: '1',
        programStatus: '0',
        totalRounds: 2,
        sortOrder: 5,
        rule: {
          createLotteryPool: '1',
          lotteryIdentifierType: '2',
          lotteryParticipantScope: '3',
          needCheckin: '1',
          needPayment: '0',
          prizeCount: 50,
          checkinEndOffsetMinutes: 30,
          checkinStartOffsetMinutes: 15
        },
        quotas: [
          { roundNo: 1, quotaCount: 25 },
          { roundNo: 2, quotaCount: 25 }
        ]
      })

      expect(form.id).toBe('100')
      expect(form.activityId).toBe('200')
      expect(form.cnName).toBe('测试抽奖')
      expect(form.programType).toBe('1')
      expect(form.totalRounds).toBe(2)
      expect(form.sortOrder).toBe(5)
      expect(form.createLotteryPool).toBe('1')
      expect(form.lotteryIdentifierType).toBe('2')
      expect(form.prizeCount).toBe(50)
      expect(form.checkinEndOffsetMinutes).toBe(30)
      expect(serverStatus.value).toBe('0')
      expect(serverType.value).toBe('1')
      expect(serverTotalRounds.value).toBe(2)
      expect(quotasList.value).toHaveLength(2)
    })

    it('投票节目(2)应正确回填投票字段', () => {
      const form = emptyForm()
      const quotasList = ref<ActivityProgramQuotaRow[]>([])
      const serverStatus = ref('')
      const serverType = ref('')
      const serverTotalRounds = ref<number | string>(0)

      applyProgramDetailToForm(form, quotasList, serverStatus, serverType, serverTotalRounds, {
        id: '101',
        programType: '2',
        rule: {
          needVote: '1',
          votePerAttemptCount: 3,
          voteStartTime: '2025-01-01',
          voteEndTime: '2025-01-31',
          prizeCount: 10
        }
      })

      expect(form.needVote).toBe('1')
      expect(form.votePerAttemptCount).toBe(3)
      expect(form.voteStartTime).toBe('2025-01-01')
      expect(form.voteEndTime).toBe('2025-01-31')
      expect(form.prizeCount).toBe(10)
      expect(quotasList.value).toEqual([])
    })

    it('祝福节目(3)应正确回填祝福字段', () => {
      const form = emptyForm()
      const quotasList = ref<ActivityProgramQuotaRow[]>([])
      const serverStatus = ref('')
      const serverType = ref('')
      const serverTotalRounds = ref<number | string>(0)

      applyProgramDetailToForm(form, quotasList, serverStatus, serverType, serverTotalRounds, {
        id: '102',
        programType: '3',
        rule: { blessingDisplayRule: '2' }
      })

      expect(form.blessingDisplayRule).toBe('2')
      expect(form.totalRounds).toBe(0) // no totalRounds in detail
      expect(quotasList.value).toEqual([])
    })

    it('未知节目类型应清空配额', () => {
      const form = emptyForm()
      const quotasList = ref<ActivityProgramQuotaRow[]>([{ roundNo: 1, quotaCount: 5 }])
      const serverStatus = ref('')
      const serverType = ref('')
      const serverTotalRounds = ref<number | string>(0)

      applyProgramDetailToForm(form, quotasList, serverStatus, serverType, serverTotalRounds, {
        programType: '99'
      })

      expect(quotasList.value).toEqual([])
    })

    it('sortOrder 优先取 API 字段，其次取 rule 内字段', () => {
      const form = emptyForm()
      const quotasList = ref<ActivityProgramQuotaRow[]>([])
      const serverStatus = ref('')
      const serverType = ref('')
      const serverTotalRounds = ref<number | string>(0)

      // sortOrder from API takes priority
      applyProgramDetailToForm(form, quotasList, serverStatus, serverType, serverTotalRounds, {
        sortOrder: 10,
        rule: { sortOrder: 20 }
      })
      expect(form.sortOrder).toBe(10)

      // fallback to rule.sortOrder
      const form2 = emptyForm()
      applyProgramDetailToForm(form2, quotasList, serverStatus, serverType, serverTotalRounds, {
        rule: { sortOrder: 30 }
      })
      expect(form2.sortOrder).toBe(30)
    })

    it('rule 缺失时使用默认值', () => {
      const form = emptyForm()
      const quotasList = ref<ActivityProgramQuotaRow[]>([])
      const serverStatus = ref('')
      const serverType = ref('')
      const serverTotalRounds = ref<number | string>(0)

      applyProgramDetailToForm(form, quotasList, serverStatus, serverType, serverTotalRounds, {
        id: '103',
        programType: '1'
      })

      expect(form.createLotteryPool).toBe('0')
      expect(form.prizeCount).toBe(0)
      expect(form.checkinEndOffsetMinutes).toBe(0)
    })
  })
})
