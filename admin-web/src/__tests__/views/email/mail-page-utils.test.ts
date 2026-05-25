import { describe, it, expect } from 'vitest'
import { formatMailGroupScopeDisplay } from '../../../views/email/mail-page-utils'

describe('mail-page-utils.ts', () => {
  describe('formatMailGroupScopeDisplay', () => {
    it('空字符串应返回横线', () => {
      expect(formatMailGroupScopeDisplay('')).toBe('—')
    })

    it('全部为 All 时应返回横线', () => {
      expect(formatMailGroupScopeDisplay('All,All,All,All,All,All,All,All,All')).toBe('—')
    })

    it('单个学校 ID 应正常展示', () => {
      expect(formatMailGroupScopeDisplay('123,All,All,All,All,All,All,All,All')).toBe('123')
      expect(formatMailGroupScopeDisplay('All,456,All,All,All,All,All,All,All')).toBe('456')
    })

    it('乘坐校巴(true)应正确展示', () => {
      expect(formatMailGroupScopeDisplay('All,All,All,All,true,All,All,All,All')).toBe('乘坐校巴(是)')
    })

    it('乘坐校巴(是)应正确展示', () => {
      expect(formatMailGroupScopeDisplay('All,All,All,All,是,All,All,All,All')).toBe('乘坐校巴(是)')
    })

    it('乘坐校巴(false/否)应正确展示', () => {
      expect(formatMailGroupScopeDisplay('All,All,All,All,false,All,All,All,All')).toBe('乘坐校巴(否)')
    })

    it('住宿(true)应正确展示', () => {
      expect(formatMailGroupScopeDisplay('All,All,All,All,All,true,All,All,All')).toBe('住宿(是)')
    })

    it('住宿(是)应正确展示', () => {
      expect(formatMailGroupScopeDisplay('All,All,All,All,All,是,All,All,All')).toBe('住宿(是)')
    })

    it('住宿(false/否)应正确展示', () => {
      expect(formatMailGroupScopeDisplay('All,All,All,All,All,false,All,All,All')).toBe('住宿(否)')
    })

    it('多部分组合应正确拼接', () => {
      expect(formatMailGroupScopeDisplay('123,456,All,All,true,是,789,All,All')).toBe(
        '123，456，乘坐校巴(是)，住宿(是)，789'
      )
    })

    it('最后一个位置(index 8)非 All 时也应展示', () => {
      expect(formatMailGroupScopeDisplay('All,All,All,All,All,All,All,All,extra')).toBe('extra')
    })

    it('只有横线结果时返回横线', () => {
      // parts[0] 是 'All' 被跳过, parts[1-9] 也是 'All', result 为空
      expect(formatMailGroupScopeDisplay('All,All,All,All,All,All,All,All,All')).toBe('—')
    })
  })
})
