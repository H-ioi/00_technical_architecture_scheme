import { describe, it, expect } from 'vitest'
import { pickLocaleName } from '../../utils/locale-name'

describe('locale-name.ts', () => {
  describe('pickLocaleName', () => {
    it('英文 locale 优先取 enName', () => {
      const row = { enName: 'Test School', cnName: '测试学校', name: 'default' }
      expect(pickLocaleName(row, 'en')).toBe('Test School')
    })

    it('英文 locale enName 缺失取 name', () => {
      const row = { cnName: '测试学校', name: 'Test School' }
      expect(pickLocaleName(row, 'en')).toBe('Test School')
    })

    it('中文 locale 优先取 cnName', () => {
      const row = { enName: 'Test School', cnName: '测试学校', name: 'default' }
      expect(pickLocaleName(row, 'zh')).toBe('测试学校')
    })

    it('中文 locale cnName 缺失取 name', () => {
      const row = { enName: 'Test School', name: '测试学校' }
      expect(pickLocaleName(row, 'zh')).toBe('测试学校')
    })

    it('中文 locale cnName/name 都缺失取 enName', () => {
      const row = { enName: 'Only English' }
      expect(pickLocaleName(row, 'zh')).toBe('Only English')
    })

    it('所有字段缺失返回空字符串', () => {
      const row = { otherField: 'nope' }
      expect(pickLocaleName(row, 'zh')).toBe('')
    })

    it('空字符串视为缺失', () => {
      const row = { enName: '', cnName: '测试', name: '' }
      expect(pickLocaleName(row, 'zh')).toBe('测试')
    })

    it('自定义键列表', () => {
      const row = { customEn: 'Hello', cnName: '你好' }
      expect(pickLocaleName(row, 'en', ['customEn'])).toBe('Hello')
    })
  })
})
