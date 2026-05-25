import { describe, it, expect, vi } from 'vitest'

vi.mock('uni-ui-lib', () => ({
  useUniI18n: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'activity.yes': '是',
        'activity.no': '否'
      }
      return map[key] ?? key
    }
  })
}))

import { useActivityYesNoOptions } from '../../composables/use-activity-yes-no-options'

describe('use-activity-yes-no-options.ts', () => {
  describe('useActivityYesNoOptions', () => {
    it('应返回是/否两个选项', () => {
      const options = useActivityYesNoOptions()
      expect(options.value).toHaveLength(2)
    })

    it('第一个选项为"是" value="1"', () => {
      const options = useActivityYesNoOptions()
      expect(options.value[0]).toMatchObject({ label: '是', value: '1' })
    })

    it('第二个选项为"否" value="0"', () => {
      const options = useActivityYesNoOptions()
      expect(options.value[1]).toMatchObject({ label: '否', value: '0' })
    })
  })
})
