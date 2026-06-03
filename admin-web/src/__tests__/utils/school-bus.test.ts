import { describe, it, expect } from 'vitest'
import {
  normalizeSchoolIdsOnRow,
  stripEmptyQueryParams,
  schoolIdsForCascadeApi
} from '../../utils/school-bus'

describe('school-bus.ts', () => {
  // ==================== normalizeSchoolIdsOnRow ====================
  describe('normalizeSchoolIdsOnRow', () => {
    it('schoolId 存在时转为 schoolIds 数组', () => {
      const row: Record<string, unknown> = { schoolId: 123 }
      normalizeSchoolIdsOnRow(row)
      expect(row.schoolIds).toEqual([123])
    })

    it('schoolIds 已为数组时过滤空值', () => {
      const row: Record<string, unknown> = { schoolIds: [1, '', null, 2] }
      normalizeSchoolIdsOnRow(row)
      expect(row.schoolIds).toEqual([1, 2])
    })

    it('schoolIds 为逗号分隔字符串时拆分', () => {
      const row: Record<string, unknown> = { schoolIds: '1, 2, 3' }
      normalizeSchoolIdsOnRow(row)
      expect(row.schoolIds).toEqual(['1', '2', '3'])
    })

    it('schoolIds 为单值字符串时包装为数组', () => {
      const row: Record<string, unknown> = { schoolIds: 'abc' }
      normalizeSchoolIdsOnRow(row)
      expect(row.schoolIds).toEqual(['abc'])
    })

    it('schoolIds 为 null 设置空数组', () => {
      const row: Record<string, unknown> = { schoolIds: null }
      normalizeSchoolIdsOnRow(row)
      expect(row.schoolIds).toEqual([])
    })

    it('schoolIds 为空字符串设置空数组', () => {
      const row: Record<string, unknown> = { schoolIds: '' }
      normalizeSchoolIdsOnRow(row)
      expect(row.schoolIds).toEqual([])
    })

    it('两者都缺失时不报错', () => {
      const row: Record<string, unknown> = { other: 'data' }
      expect(() => normalizeSchoolIdsOnRow(row)).not.toThrow()
    })

    it('schoolIds 为数字数组原样保留', () => {
      const row: Record<string, unknown> = { schoolIds: [101, 102] }
      normalizeSchoolIdsOnRow(row)
      expect(row.schoolIds).toEqual([101, 102])
    })
  })

  // ==================== stripEmptyQueryParams ====================
  describe('stripEmptyQueryParams', () => {
    it('移除空字符串', () => {
      const result = stripEmptyQueryParams({ a: 'val', b: '' })
      expect(result).toEqual({ a: 'val' })
    })

    it('移除 null 和 undefined', () => {
      const result = stripEmptyQueryParams({ a: null, b: undefined, c: 'ok' })
      expect(result).toEqual({ c: 'ok' })
    })

    it('移除空数组', () => {
      const result = stripEmptyQueryParams({ ids: [], name: 'test' })
      expect(result).toEqual({ name: 'test' })
    })

    it('保留零值和 false', () => {
      const result = stripEmptyQueryParams({ count: 0, enabled: false })
      expect(result).toEqual({ count: 0, enabled: false })
    })

    it('空对象返回空对象', () => {
      expect(stripEmptyQueryParams({})).toEqual({})
    })
  })

  // ==================== schoolIdsForCascadeApi ====================
  describe('schoolIdsForCascadeApi', () => {
    it('数组 schoolField 原样返回', () => {
      expect(schoolIdsForCascadeApi([1, 2], { multiSchool: true, defaultSchoolId: null })).toEqual([
        1, 2
      ])
    })

    it('单值 schoolField 包装为数组', () => {
      expect(schoolIdsForCascadeApi(42, { multiSchool: false, defaultSchoolId: null })).toEqual([
        42
      ])
    })

    it('空且单校时使用默认 schoolId', () => {
      expect(schoolIdsForCascadeApi(null, { multiSchool: false, defaultSchoolId: 99 })).toEqual([
        99
      ])
    })

    it('空且多校时不使用默认 schoolId', () => {
      expect(schoolIdsForCascadeApi(null, { multiSchool: true, defaultSchoolId: 99 })).toEqual([])
    })

    it('空字符串 schoolField 视为空', () => {
      expect(schoolIdsForCascadeApi('', { multiSchool: false, defaultSchoolId: 50 })).toEqual([50])
    })
  })
})
