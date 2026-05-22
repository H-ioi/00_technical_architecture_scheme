import { describe, it, expect } from 'vitest'
import { formatOptionLabels, formatRangeLabel } from '../../utils/form-display'
import type { UniOption } from 'uni-ui-lib'

describe('form-display.ts', () => {

  const sampleOptions: UniOption[] = [
    { label: '选项A', value: 'a' },
    { label: '选项B', value: 'b' },
    { label: '选项C', value: 'c' },
    { label: '数字1', value: 1 }
  ]

  // ==================== formatOptionLabels ====================
  describe('formatOptionLabels', () => {
    it('单值匹配返回对应 label', () => {
      expect(formatOptionLabels(sampleOptions, 'a')).toBe('选项A')
    })

    it('数组值匹配返回逗号拼接', () => {
      expect(formatOptionLabels(sampleOptions, ['a', 'c'])).toBe('选项A, 选项C')
    })

    it('未匹配时返回原始值', () => {
      expect(formatOptionLabels(sampleOptions, 'missing')).toBe('missing')
    })

    it('null 返回空字符串', () => {
      expect(formatOptionLabels(sampleOptions, null)).toBe('')
    })

    it('undefined 返回空字符串', () => {
      expect(formatOptionLabels(sampleOptions, undefined)).toBe('')
    })

    it('空字符串返回空字符串', () => {
      expect(formatOptionLabels(sampleOptions, '')).toBe('')
    })

    it('数字值匹配', () => {
      expect(formatOptionLabels(sampleOptions, 1)).toBe('数字1')
    })

    it('部分匹配部分不匹配', () => {
      expect(formatOptionLabels(sampleOptions, ['a', 'x'])).toBe('选项A, x')
    })
  })

  // ==================== formatRangeLabel ====================
  describe('formatRangeLabel', () => {
    it('两个元素的数组', () => {
      expect(formatRangeLabel(['2024-01-01', '2024-06-30'])).toBe('2024-01-01 - 2024-06-30')
    })

    it('空数组返回空字符串', () => {
      expect(formatRangeLabel([])).toBe('')
    })

    it('单元素数组返回空字符串', () => {
      expect(formatRangeLabel(['only-one'])).toBe('')
    })

    it('三元素数组返回空字符串', () => {
      expect(formatRangeLabel(['a', 'b', 'c'])).toBe('')
    })

    it('非数组返回空字符串', () => {
      expect(formatRangeLabel('not-array')).toBe('')
      expect(formatRangeLabel(null)).toBe('')
      expect(formatRangeLabel(undefined)).toBe('')
    })

    it('包含空值的数组', () => {
      expect(formatRangeLabel(['', 'end'])).toBe(' - end')
      expect(formatRangeLabel(['start', ''])).toBe('start - ')
    })
  })
})
