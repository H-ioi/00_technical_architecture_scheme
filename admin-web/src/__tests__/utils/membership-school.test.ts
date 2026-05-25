import { describe, it, expect, vi } from 'vitest'

vi.mock('uni-ui-lib', () => ({
  toUniOptions: (rows: Record<string, unknown>[], opts: Record<string, unknown>) =>
    rows.map((row) => {
      const labelKeys = (opts.labelKeys as string[]) || ['name', 'cnName', 'enName']
      let label = ''
      for (const key of labelKeys) {
        const val = row[key]
        if (val != null && String(val) !== '') {
          label = String(val)
          break
        }
      }
      return {
        label,
        value: row.value ?? row[opts.valueKey as string] ?? row.id
      }
    })
}))

import {
  membershipSchoolToOptions,
  membershipSchoolLabel,
  membershipSchoolLabelsJoined
} from '../../utils/membership-school'

import type { SchoolOptionRecord } from '@/types/modules/membership'

const makeRecords = (): SchoolOptionRecord[] => [
  { id: '1', name: '深圳校区', cnName: '深圳校区', enName: 'Shenzhen Campus' },
  { id: '2', name: '广州校区', cnName: '广州校区', enName: 'Guangzhou Campus' },
  { id: '3', name: '', cnName: '', enName: 'Beijing Campus' }
]

describe('membership-school.ts', () => {
  const records = makeRecords()

  describe('membershipSchoolToOptions', () => {
    it('中文 locale 应优先使用 name', () => {
      const opts = membershipSchoolToOptions(records, 'zh')
      expect(opts[0]).toMatchObject({ label: '深圳校区', value: '1' })
      expect(opts[1]).toMatchObject({ label: '广州校区', value: '2' })
    })

    it('英文 locale 应优先使用 enName', () => {
      const opts = membershipSchoolToOptions(records, 'en')
      expect(opts[0]).toMatchObject({ label: 'Shenzhen Campus', value: '1' })
      expect(opts[1]).toMatchObject({ label: 'Guangzhou Campus', value: '2' })
    })

    it('空记录应返回空数组', () => {
      const opts = membershipSchoolToOptions([], 'zh')
      expect(opts).toEqual([])
    })
  })

  describe('membershipSchoolLabel', () => {
    it('正常中文匹配应返回名称', () => {
      expect(membershipSchoolLabel(records, '1', 'zh')).toBe('深圳校区')
    })

    it('正常英文匹配应返回 enName', () => {
      expect(membershipSchoolLabel(records, '1', 'en')).toBe('Shenzhen Campus')
    })

    it('id 为 null/undefined 应返回 --', () => {
      expect(membershipSchoolLabel(records, null, 'zh')).toBe('--')
      expect(membershipSchoolLabel(records, undefined, 'zh')).toBe('--')
    })

    it('id 为空字符串应返回 --', () => {
      expect(membershipSchoolLabel(records, '', 'zh')).toBe('--')
    })

    it('未命中记录应返回 --', () => {
      expect(membershipSchoolLabel(records, '999', 'zh')).toBe('--')
    })

    it('number 类型 id 也可以匹配', () => {
      expect(membershipSchoolLabel(records, 1, 'zh')).toBe('深圳校区')
    })

    it('enName 为空时中文降级到 name', () => {
      // record[2]: name='', cnName='', enName='Beijing Campus'
      expect(membershipSchoolLabel(records, '3', 'en')).toBe('Beijing Campus')
    })

    it('中文 name 为空时不降级到 cnName（?? 不跳过空串）', () => {
      const r: SchoolOptionRecord[] = [
        { id: '10', name: '', cnName: '中文名', enName: 'English Name' }
      ]
      // ?? 不会跳过空字符串，name 为空时返回 ''
      expect(membershipSchoolLabel(r, '10', 'zh')).toBe('--')
    })

    it('中文 name 缺失时降级到 cnName', () => {
      const r: SchoolOptionRecord[] = [
        { id: '20', name: undefined as unknown as string, cnName: '中文名', enName: 'English Name' }
      ]
      expect(membershipSchoolLabel(r, '20', 'zh')).toBe('中文名')
    })
  })

  describe('membershipSchoolLabelsJoined', () => {
    it('单 ID 应返回单个标签', () => {
      expect(membershipSchoolLabelsJoined(records, ['1'], 'zh')).toBe('深圳校区')
    })

    it('多 ID 应以顿号连接', () => {
      expect(membershipSchoolLabelsJoined(records, ['1', '2'], 'zh')).toBe('深圳校区、广州校区')
    })

    it('非数组入参应返回 fallback', () => {
      expect(membershipSchoolLabelsJoined(records, null, 'zh', '默认')).toBe('默认')
    })

    it('空数组应返回 fallback', () => {
      expect(membershipSchoolLabelsJoined(records, [], 'zh', '默认校')).toBe('默认校')
    })

    it('无 fallback 时应返回 --', () => {
      expect(membershipSchoolLabelsJoined(records, [], 'zh')).toBe('--')
    })

    it('部分命中部分未命中，只展示命中的', () => {
      expect(membershipSchoolLabelsJoined(records, ['1', '999'], 'zh')).toBe('深圳校区')
    })

    it('全部未命中且无 fallback 返回 --', () => {
      expect(membershipSchoolLabelsJoined(records, ['999'], 'zh')).toBe('--')
    })

    it('全部未命中但有 fallback 返回 fallback', () => {
      expect(membershipSchoolLabelsJoined(records, ['999'], 'zh', '默认')).toBe('默认')
    })
  })
})
