import { describe, it, expect } from 'vitest'
import {
  normalizePaged,
  normalizeEnvelope,
  normalizePayload,
  normalizeArray,
  normalizeSchoolBusDetail
} from '../../utils/api-response-normalize'

describe('api-response-normalize.ts', () => {
  // ==================== normalizePaged ====================
  describe('normalizePaged', () => {
    it('非对象返回空 { list: [], total: 0 }', () => {
      expect(normalizePaged(null)).toEqual({ list: [], total: 0 })
      expect(normalizePaged(undefined)).toEqual({ list: [], total: 0 })
      expect(normalizePaged('string')).toEqual({ list: [], total: 0 })
    })

    it('data 为数组时直接提取', () => {
      const raw = { data: [{ id: 1 }, { id: 2 }], total: 2 }
      expect(normalizePaged(raw)).toEqual({ list: [{ id: 1 }, { id: 2 }], total: 2 })
    })

    it('records 为数组时直接提取', () => {
      const raw = { records: [{ name: 'a' }], totalCount: 5 }
      expect(normalizePaged(raw)).toEqual({ list: [{ name: 'a' }], total: 5 })
    })

    it('list 为数组时直接提取', () => {
      const raw = { list: [{ key: 'v' }], totalElements: '10' }
      expect(normalizePaged(raw)).toEqual({ list: [{ key: 'v' }], total: 10 })
    })

    it('嵌套 data 对象内 records 提取', () => {
      const raw = {
        data: { records: [{ x: 1 }], total: 3 },
        totalRow: 5
      }
      expect(normalizePaged(raw)).toEqual({ list: [{ x: 1 }], total: 5 })
    })

    it('嵌套 data 对象内 list 提取', () => {
      const raw = { data: { list: [{ y: 2 }] }, total: 8 }
      expect(normalizePaged(raw)).toEqual({ list: [{ y: 2 }], total: 8 })
    })

    it('嵌套 data 对象内 data 数组提取', () => {
      const raw = { data: { data: [{ z: 3 }] }, total: 1 }
      expect(normalizePaged(raw)).toEqual({ list: [{ z: 3 }], total: 1 })
    })

    it('嵌套 data 对象内 content 数组提取', () => {
      const raw = { data: { content: [{ w: 4 }] }, total: 7 }
      expect(normalizePaged(raw)).toEqual({ list: [{ w: 4 }], total: 7 })
    })

    it('total 优先级：total > totalCount > totalElements > totalRow', () => {
      const raw = { data: [{ a: 1 }], totalCount: 10, total: 5 }
      expect(normalizePaged(raw).total).toBe(5)
    })

    it('total 为字符串数字时解析', () => {
      const raw = { data: [{}], total: '42' }
      expect(normalizePaged(raw).total).toBe(42)
    })

    it('无匹配列表结构时返回空', () => {
      const raw = { code: 200, message: 'ok' }
      expect(normalizePaged(raw)).toEqual({ list: [], total: 0 })
    })

    it('total 从嵌套对象获取', () => {
      const raw = { data: { records: [{}], totalCount: 20 } }
      expect(normalizePaged(raw)).toEqual({ list: [{}], total: 20 })
    })
  })

  // ==================== normalizeEnvelope ====================
  describe('normalizeEnvelope', () => {
    it('{ data: 对象 } → 内层对象', () => {
      expect(normalizeEnvelope({ data: { name: 'test' } })).toEqual({ name: 'test' })
    })

    it('无 data 字段返回原对象', () => {
      expect(normalizeEnvelope({ id: 1, name: 'direct' })).toEqual({ id: 1, name: 'direct' })
    })

    it('data 为数组时保留外层', () => {
      const raw = { data: [1, 2, 3] }
      expect(normalizeEnvelope(raw)).toEqual(raw)
    })

    it('非对象返回空对象', () => {
      expect(normalizeEnvelope(null)).toEqual({})
      expect(normalizeEnvelope(undefined)).toEqual({})
    })

    it('data 为 null 保留外层', () => {
      expect(normalizeEnvelope({ data: null, other: 'val' })).toEqual({ data: null, other: 'val' })
    })
  })

  // ==================== normalizePayload ====================
  describe('normalizePayload', () => {
    it('非对象原样返回', () => {
      expect(normalizePayload('hello')).toBe('hello')
      expect(normalizePayload(null)).toBeNull()
      expect(normalizePayload(123)).toBe(123)
    })

    it('{ data: 对象 } 返回内层', () => {
      expect(normalizePayload({ data: { id: 1 } })).toEqual({ id: 1 })
    })

    it('{ data: { data: 对象 } } 返回最内层对象', () => {
      expect(normalizePayload({ data: { data: { id: 1 } } })).toEqual({ id: 1 })
    })

    it('{ data: { data: 数组 } } 返回数组', () => {
      expect(normalizePayload({ data: { data: [1, 2] } })).toEqual([1, 2])
    })

    it('data 为数组时保留', () => {
      expect(normalizePayload({ data: [1, 2] })).toEqual({ data: [1, 2] })
    })

    it('无 data 时返回原对象', () => {
      expect(normalizePayload({ id: 1 })).toEqual({ id: 1 })
    })
  })

  // ==================== normalizeArray ====================
  describe('normalizeArray', () => {
    it('直接数组原样返回', () => {
      expect(normalizeArray([1, 2, 3])).toEqual([1, 2, 3])
    })

    it('单层 data 包裹的数组', () => {
      expect(normalizeArray({ data: [1, 2] })).toEqual([1, 2])
    })

    it('双层 data 包裹的数组', () => {
      expect(normalizeArray({ data: { data: [3, 4] } })).toEqual([3, 4])
    })

    it('嵌套 records 数组', () => {
      expect(normalizeArray({ data: { records: [5, 6] } })).toEqual([5, 6])
    })

    it('无数组时返回空数组', () => {
      expect(normalizeArray({ x: 1 })).toEqual([])
    })

    it('非对象原样处理', () => {
      expect(normalizeArray('not')).toEqual([])
    })
  })

  // ==================== normalizeSchoolBusDetail ====================
  describe('normalizeSchoolBusDetail', () => {
    it('{ data: { success: true, data: 实体 } } 返回实体', () => {
      const detail = { schoolIds: [1], weekDays: ['Mon'], cnName: 'Test' }
      const res = { data: { success: true, data: detail } }
      expect(normalizeSchoolBusDetail(res)).toEqual(detail)
    })

    it('{ data: 实体 } 直接返回实体', () => {
      const detail = { schoolIds: [2], weekDays: ['Tue'], cnName: 'Bus' }
      expect(normalizeSchoolBusDetail({ data: detail })).toEqual(detail)
    })

    it('顶层包含特征字段直接返回', () => {
      const detail = { schoolIds: [3], weekDays: ['Wed'], cnName: 'Top' }
      expect(normalizeSchoolBusDetail(detail)).toEqual(detail)
    })

    it('null 返回 null', () => {
      expect(normalizeSchoolBusDetail(null)).toBeNull()
    })

    it('非对象返回 null', () => {
      expect(normalizeSchoolBusDetail('nope')).toBeNull()
    })

    it('无特征字段返回 null', () => {
      expect(normalizeSchoolBusDetail({ code: 200 })).toBeNull()
    })

    it('{ data: { success: true, data: null } } 不匹配', () => {
      expect(normalizeSchoolBusDetail({ data: { success: true, data: null } })).toBeNull()
    })

    it('cnName 特征识别生效', () => {
      expect(normalizeSchoolBusDetail({ cnName: 'TestBus' })).toEqual({ cnName: 'TestBus' })
    })
  })
})
