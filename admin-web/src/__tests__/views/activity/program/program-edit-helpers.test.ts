import { describe, it, expect } from 'vitest'
import {
  isLotterySingleRoundRow,
  canEditProgramRow,
  isPrizeCountOnlyEdit,
  programStatusOptionsForRow,
  programTypeOptionsForRow
} from '../../../../views/activity/program/edit/program-edit-helpers'
import type { Translate } from '@/types/i18n'

const t = ((key: string) => key) as Translate

describe('program-edit-helpers.ts', () => {
  describe('isLotterySingleRoundRow', () => {
    it('totalRounds 为 1 返回 true', () => {
      expect(isLotterySingleRoundRow({ totalRounds: 1 })).toBe(true)
    })

    it('total_rounds（snake_case）为 1 也返回 true', () => {
      expect(isLotterySingleRoundRow({ total_rounds: '1' })).toBe(true)
    })

    it('totalRounds 优先于 total_rounds', () => {
      expect(isLotterySingleRoundRow({ totalRounds: 1, total_rounds: 5 })).toBe(true)
    })

    it('totalRounds 为 2 返回 false', () => {
      expect(isLotterySingleRoundRow({ totalRounds: 2 })).toBe(false)
    })

    it('totalRounds 为 0 返回 false', () => {
      expect(isLotterySingleRoundRow({ totalRounds: 0 })).toBe(false)
    })

    it('totalRounds 为 null 返回 false', () => {
      expect(isLotterySingleRoundRow({ totalRounds: null })).toBe(false)
    })

    it('无 totalRounds 返回 false', () => {
      expect(isLotterySingleRoundRow({})).toBe(false)
    })

    it('totalRounds 为空字符串返回 false', () => {
      expect(isLotterySingleRoundRow({ totalRounds: '' })).toBe(false)
    })
  })

  describe('canEditProgramRow', () => {
    it('待开始(0) 非抽奖节目 可编辑', () => {
      expect(canEditProgramRow({ programStatus: '0', programType: '2' })).toBe(true)
    })

    it('待开始(0) 抽奖节目单轮 可编辑', () => {
      expect(canEditProgramRow({ programStatus: '0', programType: '1', totalRounds: 1 })).toBe(true)
    })

    it('已结束(2) 不可编辑', () => {
      expect(canEditProgramRow({ programStatus: '2', programType: '1' })).toBe(false)
    })

    it('进行中(1) 非抽奖节目 不可编辑', () => {
      expect(canEditProgramRow({ programStatus: '1', programType: '2' })).toBe(false)
    })

    it('进行中(1) 多轮抽奖 不可编辑', () => {
      expect(canEditProgramRow({ programStatus: '1', programType: '1', totalRounds: 3 })).toBe(
        false
      )
    })

    it('进行中(1) 单轮抽奖 可编辑', () => {
      expect(canEditProgramRow({ programStatus: '1', programType: '1', totalRounds: 1 })).toBe(true)
    })

    it('无 programStatus 字段默认为待开始', () => {
      expect(canEditProgramRow({ programType: '2' })).toBe(true)
    })
  })

  describe('isPrizeCountOnlyEdit', () => {
    it('进行中 单轮抽奖返回 true', () => {
      expect(isPrizeCountOnlyEdit({ programStatus: '1', programType: '1', totalRounds: 1 })).toBe(
        true
      )
    })

    it('待开始 单轮抽奖返回 false', () => {
      expect(isPrizeCountOnlyEdit({ programStatus: '0', programType: '1', totalRounds: 1 })).toBe(
        false
      )
    })

    it('进行中 非抽奖返回 false', () => {
      expect(isPrizeCountOnlyEdit({ programStatus: '1', programType: '2' })).toBe(false)
    })
  })

  describe('programStatusOptionsForRow', () => {
    it('应返回三种状态选项', () => {
      const opts = programStatusOptionsForRow(t)
      expect(opts).toHaveLength(3)
      expect(opts[0]).toMatchObject({ value: '0' })
      expect(opts[1]).toMatchObject({ value: '1' })
      expect(opts[2]).toMatchObject({ value: '2' })
    })

    it('label 应使用 t() 翻译', () => {
      const opts = programStatusOptionsForRow(t)
      expect(opts[0].label).toBe('activity.programStatusPending')
    })
  })

  describe('programTypeOptionsForRow', () => {
    it('应返回三种节目类型', () => {
      const opts = programTypeOptionsForRow(t)
      expect(opts).toHaveLength(3)
      expect(opts[0]).toMatchObject({ value: '1' })
      expect(opts[1]).toMatchObject({ value: '2' })
      expect(opts[2]).toMatchObject({ value: '3' })
    })
  })
})
