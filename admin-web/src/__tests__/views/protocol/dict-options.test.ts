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

import type { UniOption } from 'uni-ui-lib'
import type { ProtocolDictItem } from '@/types/modules/protocol'

import {
  buildProtocolDictOptions,
  resolveProtocolDictCellLabel
} from '../../../views/protocol/dict-options'

const makeDictItems = (): ProtocolDictItem[] => [
  { id: '1', name: '服务协议', cnName: '服务协议', enName: 'Service Agreement' },
  { id: '2', name: '隐私政策', cnName: '隐私政策', enName: 'Privacy Policy' },
  { id: '3', name: '安全规范', cnName: '安全规范', enName: 'Security Policy', code: 'SEC' }
]

describe('dict-options.ts', () => {
  const items = makeDictItems()

  describe('buildProtocolDictOptions', () => {
    it('中文 locale 应生成中文 label', () => {
      const opts = buildProtocolDictOptions(items, 'zh')
      expect(opts[0]).toMatchObject({ label: '服务协议', value: '1' })
    })

    it('英文 locale 应生成英文 label', () => {
      const opts = buildProtocolDictOptions(items, 'en')
      expect(opts[0]).toMatchObject({ label: 'Service Agreement', value: '1' })
    })

    it('存在 code 时应额外生成 code 别名选项', () => {
      const opts = buildProtocolDictOptions(items, 'zh')
      // item[2] has code='SEC', should generate an extra option
      const secOpt = opts.find((o) => o.value === 'SEC')
      expect(secOpt).toBeDefined()
      expect(secOpt?.label).toBe('安全规范')
    })

    it('code 与 id 相同时不应重复生成', () => {
      const it: ProtocolDictItem[] = [
        { id: 'ABC', name: '测试', cnName: '测试', enName: 'Test', code: 'ABC' }
      ]
      const opts = buildProtocolDictOptions(it, 'zh')
      expect(opts.length).toBe(1)
    })

    it('undefined 入参应返回空数组', () => {
      const opts = buildProtocolDictOptions(undefined, 'zh')
      expect(opts).toEqual([])
    })

    it('空数组应返回空数组', () => {
      const opts = buildProtocolDictOptions([], 'zh')
      expect(opts).toEqual([])
    })
  })

  describe('resolveProtocolDictCellLabel', () => {
    const opts: UniOption[] = [
      { label: '服务协议', value: '1' },
      { label: '隐私政策', value: '2' }
    ]

    it('API 返回 zh 字段时优先使用', () => {
      const row = { protocolZhName: '自定义名称' }
      expect(
        resolveProtocolDictCellLabel(row, '1', opts, 'zh', {
          zh: 'protocolZhName',
          en: 'protocolEnName'
        })
      ).toBe('自定义名称')
    })

    it('API 返回 en 字段时优先使用', () => {
      const row = { protocolEnName: 'Custom Name' }
      expect(
        resolveProtocolDictCellLabel(row, '1', opts, 'en', {
          zh: 'protocolZhName',
          en: 'protocolEnName'
        })
      ).toBe('Custom Name')
    })

    it('API 字段为空时通过 value 匹配选项 label', () => {
      const row = { protocolZhName: '', protocolEnName: '' }
      expect(
        resolveProtocolDictCellLabel(row, '1', opts, 'zh', {
          zh: 'protocolZhName',
          en: 'protocolEnName'
        })
      ).toBe('服务协议')
    })

    it('通过数字 value 匹配（numberish 比较）', () => {
      const o: UniOption[] = [{ label: '匹配项', value: 1 }]
      expect(
        resolveProtocolDictCellLabel({}, '1', o, 'zh', {
          zh: 'protocolZhName',
          en: 'protocolEnName'
        })
      ).toBe('匹配项')
    })

    it('value 为空时返回 --', () => {
      expect(
        resolveProtocolDictCellLabel({}, '', opts, 'zh', {
          zh: 'protocolZhName',
          en: 'protocolEnName'
        })
      ).toBe('--')
    })

    it('value 为 null 时返回 --', () => {
      expect(
        resolveProtocolDictCellLabel({}, null, opts, 'zh', {
          zh: 'protocolZhName',
          en: 'protocolEnName'
        })
      ).toBe('--')
    })

    it('未命中时返回原始 value 字符串', () => {
      expect(
        resolveProtocolDictCellLabel({}, 'unknown', opts, 'zh', {
          zh: 'protocolZhName',
          en: 'protocolEnName'
        })
      ).toBe('unknown')
    })
  })
})
