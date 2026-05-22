import { describe, it, expect } from 'vitest'
import { dateFormat, groupSeparator, coerceIdList, getUUID, getCustomerUuid } from '../../utils/tool'

describe('tool.ts', () => {

  // ==================== dateFormat ====================
  describe('dateFormat', () => {
    it('默认格式 yyyy-MM-dd hh:mm:ss', () => {
      const d = new Date('2024-01-15T08:30:00')
      expect(dateFormat(d)).toBe('2024-01-15 08:30:00')
    })

    it('支持自定义格式模板 yyyy/MM/dd', () => {
      expect(dateFormat(new Date('2024-03-05'), 'yyyy/MM/dd')).toBe('2024/03/05')
    })

    it('支持 yy 两位年份', () => {
      expect(dateFormat(new Date('2024-03-05'), 'yy-MM-dd')).toBe('24-03-05')
    })

    it('支持 y 一位年份', () => {
      const d = new Date('2024-03-05')
      expect(dateFormat(d, 'y-M-d')).toBe('4-3-5')
    })

    it('支持 yy-MM-dd hh:mm 格式', () => {
      const d = new Date('2024-06-15T14:30:00')
      expect(dateFormat(d, 'yy-MM-dd hh:mm')).toBe('24-06-15 14:30')
    })

    it('无效日期返回空字符串（字符串）', () => {
      expect(dateFormat('invalid-date')).toBe('')
    })

    it('无效日期返回空字符串（NaN）', () => {
      expect(dateFormat(NaN)).toBe('')
    })

    it('支持时间戳输入', () => {
      const ts = new Date('2024-06-01T00:00:00').getTime()
      expect(dateFormat(ts)).toContain('2024-06-01')
    })

    it('支持字符串日期', () => {
      expect(dateFormat('2024-12-25')).toContain('2024-12-25')
    })

    it('季度占位符 q', () => {
      expect(dateFormat(new Date('2024-01-15'), 'q')).toBe('1')
      expect(dateFormat(new Date('2024-05-15'), 'q')).toBe('2')
    })

    it('毫秒占位符 S', () => {
      const d = new Date('2024-01-15T08:30:00.123')
      expect(dateFormat(d, 'S')).toBe('123')
    })
  })

  // ==================== groupSeparator ====================
  describe('groupSeparator', () => {
    it('整数添加千分位', () => {
      expect(groupSeparator(1234567)).toBe('1,234,567')
    })

    it('保留小数位（toLocaleString 保留全精度）', () => {
      expect(groupSeparator(1234.5678)).toBe('1,234.5678')
    })

    it('处理字符串数字', () => {
      expect(groupSeparator('9999')).toBe('9,999')
    })

    it('空字符串转为 0', () => {
      expect(groupSeparator('')).toBe('0')
    })

    it('null 转为字符串 null', () => {
      expect(groupSeparator(null as unknown as number)).toBe('null')
    })

    it('非数字字符串原样返回', () => {
      expect(groupSeparator('abc')).toBe('abc')
    })

    it('处理小数字', () => {
      expect(groupSeparator(123)).toBe('123')
    })

    it('处理零', () => {
      expect(groupSeparator(0)).toBe('0')
    })
  })

  // ==================== coerceIdList ====================
  describe('coerceIdList', () => {
    it('单个数字包装为数组', () => {
      expect(coerceIdList(42)).toEqual([42])
    })

    it('单个字符串包装为数组', () => {
      expect(coerceIdList('abc')).toEqual(['abc'])
    })

    it('null 返回空数组', () => {
      expect(coerceIdList(null)).toEqual([])
    })

    it('undefined 返回空数组', () => {
      expect(coerceIdList(undefined)).toEqual([])
    })

    it('空字符串返回空数组', () => {
      expect(coerceIdList('')).toEqual([])
    })

    it('数组过滤空值', () => {
      expect(coerceIdList([1, '', null, undefined, 2])).toEqual([1, 2])
    })

    it('正常数组原样返回', () => {
      expect(coerceIdList(['a', 'b', 'c'])).toEqual(['a', 'b', 'c'])
    })

    it('数字0保留', () => {
      expect(coerceIdList([0, 1])).toEqual([0, 1])
    })
  })

  // ==================== getUUID ====================
  describe('getUUID', () => {
    it('默认长度16生成大写字母数字串', () => {
      const uuid = getUUID()
      expect(uuid.length).toBe(16)
      expect(uuid).toMatch(/^[A-Z0-9]+$/)
    })

    it('指定长度生成正确长度', () => {
      expect(getUUID('', 8).length).toBe(8)
      expect(getUUID('', 32).length).toBe(32)
    })

    it('带前缀 name', () => {
      const uuid = getUUID('ORDER', 8)
      expect(uuid.startsWith('ORDER-')).toBe(true)
      expect(uuid.length).toBe(14)
    })

    it('无前缀 name 为空字符串', () => {
      const uuid = getUUID('', 10)
      expect(uuid).not.toContain('-')
    })

    it('长度小于1抛出错误', () => {
      expect(() => getUUID('', 0)).toThrow('Length must be at least 1')
      expect(() => getUUID('', -1)).toThrow('Length must be at least 1')
    })
  })

  // ==================== getCustomerUuid ====================
  describe('getCustomerUuid', () => {
    it('浏览器环境返回非空字符串', () => {
      const result = getCustomerUuid()
      expect(typeof result).toBe('string')
    })
  })
})
