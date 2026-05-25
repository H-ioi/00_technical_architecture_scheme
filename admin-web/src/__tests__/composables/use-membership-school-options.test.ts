import { describe, it, expect, vi } from 'vitest'

const SCHOOL_DATA = [
  { id: '1', name: '深圳校区', cnName: '深圳校区', enName: 'Shenzhen' },
  { id: '2', name: '广州校区', cnName: '广州校区', enName: 'Guangzhou' }
]

// Mock uni-ui-lib: toUniOptions, useUniI18n, and request (让真实 membershipApi 通过 mock request 工作)
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
      return { label, value: row.value ?? row[opts.valueKey as string] ?? row.id }
    }),
  useUniI18n: () => ({
    locale: { value: 'zh' },
    t: (key: string) => key
  }),
  request: {
    get: vi.fn().mockResolvedValue([
      { id: '1', name: '深圳校区', cnName: '深圳校区', enName: 'Shenzhen' },
      { id: '2', name: '广州校区', cnName: '广州校区', enName: 'Guangzhou' }
    ]),
    post: vi.fn(),
    delete: vi.fn()
  }
}))

import { useMembershipSchoolOptions } from '../../composables/use-membership-school-options'

describe('use-membership-school-options.ts', () => {
  describe('useMembershipSchoolOptions', () => {
    it('初始 schoolOptions 为空', () => {
      const { schoolOptions } = useMembershipSchoolOptions()
      expect(schoolOptions.value).toEqual([])
    })

    it('loadSchoolOptions 后 schoolOptions 有数据', async () => {
      const { schoolOptions, loadSchoolOptions } = useMembershipSchoolOptions()
      await loadSchoolOptions()
      expect(schoolOptions.value).toHaveLength(2)
      expect(schoolOptions.value[0]).toMatchObject({ label: '深圳校区', value: '1' })
    })

    describe('formatSchoolIdsCsv', () => {
      const setup = async () => {
        const result = useMembershipSchoolOptions()
        await result.loadSchoolOptions()
        return result
      }

      it('数组 id 应转为分号分隔的标签', async () => {
        const { formatSchoolIdsCsv } = await setup()
        expect(formatSchoolIdsCsv(['1', '2'])).toBe('深圳校区; 广州校区')
      })

      it('逗号分隔字符串应转为标签', async () => {
        const { formatSchoolIdsCsv } = await setup()
        expect(formatSchoolIdsCsv('1,2')).toBe('深圳校区; 广州校区')
      })

      it('单个 id 返回单个标签', async () => {
        const { formatSchoolIdsCsv } = await setup()
        expect(formatSchoolIdsCsv('1')).toBe('深圳校区')
      })

      it('空入参返回 —', async () => {
        const { formatSchoolIdsCsv } = await setup()
        expect(formatSchoolIdsCsv(null)).toBe('—')
        expect(formatSchoolIdsCsv('')).toBe('—')
      })

      it('未命中的 id 回退为原始值', async () => {
        const { formatSchoolIdsCsv } = await setup()
        expect(formatSchoolIdsCsv(['999'])).toBe('999')
      })
    })
  })
})
