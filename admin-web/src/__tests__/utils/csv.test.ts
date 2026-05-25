import { describe, it, expect } from 'vitest'
import { formatCsvRow } from '../../utils/csv'

describe('csv.ts', () => {
  describe('formatCsvRow', () => {
    it('普通字符串应包裹双引号并以逗号拼接', () => {
      expect(formatCsvRow(['a', 'b', 'c'])).toBe('"a","b","c"')
    })

    it('含双引号的字符串应正确转义', () => {
      expect(formatCsvRow(['he"llo'])).toBe('"he""llo"')
    })

    it('null 和 undefined 应转为空字符串', () => {
      expect(formatCsvRow([null, undefined])).toBe('"",""')
    })

    it('数字和布尔值应正确转为字符串', () => {
      expect(formatCsvRow([42, true, false])).toBe('"42","true","false"')
    })

    it('空数组应返回空字符串', () => {
      expect(formatCsvRow([])).toBe('')
    })

    it('多内容项双引号应正确转义', () => {
      expect(formatCsvRow(['a"b', 'c"d"e'])).toBe('"a""b","c""d""e"')
    })
  })
})
