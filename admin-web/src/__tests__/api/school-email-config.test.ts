import { describe, it, expect, vi } from 'vitest'

vi.mock('@/utils/api-response-normalize', () => ({
  normalizeArray: (raw: unknown) => {
    if (Array.isArray(raw)) return raw
    return []
  }
}))

vi.mock('uni-ui-lib', () => ({
  request: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn()
  }
}))

import { normalizeSchoolEmailConfigList } from '../../api/modules/school-email-config'

describe('school-email-config.ts', () => {
  describe('normalizeSchoolEmailConfigList', () => {
    it('数组直接返回', () => {
      const result = normalizeSchoolEmailConfigList([{ id: 1 }, { id: 2 }])
      expect(result).toEqual([{ id: 1 }, { id: 2 }])
    })

    it('非数组返回空数组', () => {
      expect(normalizeSchoolEmailConfigList(null)).toEqual([])
      expect(normalizeSchoolEmailConfigList(undefined)).toEqual([])
    })
  })
})
