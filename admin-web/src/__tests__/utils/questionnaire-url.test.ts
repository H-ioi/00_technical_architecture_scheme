import { describe, it, expect, vi, beforeEach } from 'vitest'

beforeEach(() => {
  // 确保测试之间环境变量隔离
  vi.unstubAllEnvs()
})

import { buildQuestionnaireSignupUrl } from '../../utils/questionnaire-url'

describe('questionnaire-url.ts', () => {
  describe('buildQuestionnaireSignupUrl', () => {
    it('有效 origin 时构建完整 URL', () => {
      vi.stubEnv('VITE_COMMUNITY_WEB_ORIGIN', 'https://community.example.com')
      const url = buildQuestionnaireSignupUrl('abc123')
      expect(url).toBe(
        'https://community.example.com/#/isacommunity/activity/questionnaire/signup?id=abc123'
      )
    })

    it('origin 尾部斜杠应被移除', () => {
      vi.stubEnv('VITE_COMMUNITY_WEB_ORIGIN', 'https://community.example.com/')
      const url = buildQuestionnaireSignupUrl('abc123')
      expect(url).toBe(
        'https://community.example.com/#/isacommunity/activity/questionnaire/signup?id=abc123'
      )
    })

    it('id 应进行 encodeURIComponent', () => {
      vi.stubEnv('VITE_COMMUNITY_WEB_ORIGIN', 'https://example.com')
      const url = buildQuestionnaireSignupUrl('a&b=c')
      expect(url).toBe(
        'https://example.com/#/isacommunity/activity/questionnaire/signup?id=a%26b%3Dc'
      )
    })

    it('number 类型 id 也能正确处理', () => {
      vi.stubEnv('VITE_COMMUNITY_WEB_ORIGIN', 'https://example.com')
      const url = buildQuestionnaireSignupUrl(42)
      expect(url).toBe('https://example.com/#/isacommunity/activity/questionnaire/signup?id=42')
    })

    it('origin 为空时应返回空字符串', () => {
      vi.stubEnv('VITE_COMMUNITY_WEB_ORIGIN', '')
      const url = buildQuestionnaireSignupUrl('abc')
      expect(url).toBe('')
    })

    it('origin 为 undefined 时应返回空字符串', () => {
      // 模拟未定义环境变量
      vi.stubEnv('VITE_COMMUNITY_WEB_ORIGIN', undefined as unknown as string)
      const url = buildQuestionnaireSignupUrl('abc')
      expect(url).toBe('')
    })
  })
})
