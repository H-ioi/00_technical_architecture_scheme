import { describe, it, expect, vi } from 'vitest'
import { useDialogDetailLoading } from '../../composables/use-dialog-detail-loading'

describe('use-dialog-detail-loading.ts', () => {
  describe('useDialogDetailLoading', () => {
    it('初始 detailLoading 为 false', () => {
      const { detailLoading } = useDialogDetailLoading()
      expect(detailLoading.value).toBe(false)
    })

    it('runWithDetailLoading 执行期间 loading 为 true', async () => {
      const { detailLoading, runWithDetailLoading } = useDialogDetailLoading()
      let capturedDuringRun = false

      const fn = vi.fn().mockImplementation(async () => {
        capturedDuringRun = detailLoading.value
        return 'result'
      })

      const result = await runWithDetailLoading(fn)
      expect(capturedDuringRun).toBe(true)
      expect(result).toBe('result')
    })

    it('执行完成后 loading 恢复为 false', async () => {
      const { detailLoading, runWithDetailLoading } = useDialogDetailLoading()

      await runWithDetailLoading(async () => 'ok')
      expect(detailLoading.value).toBe(false)
    })

    it('回调抛出异常后 loading 也应恢复为 false', async () => {
      const { detailLoading, runWithDetailLoading } = useDialogDetailLoading()

      await expect(
        runWithDetailLoading(async () => {
          throw new Error('fail')
        })
      ).rejects.toThrow('fail')

      expect(detailLoading.value).toBe(false)
    })
  })
})
