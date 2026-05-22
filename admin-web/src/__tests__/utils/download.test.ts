// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import { parseFilenameFromContentDisposition, downloadBlob, downloadResponseBlob } from '../../utils/download'

// Mock URL APIs
beforeAll(() => {
  Object.defineProperty(URL, 'createObjectURL', {
    value: vi.fn(() => 'blob:mock-url'),
    writable: true
  })
  Object.defineProperty(URL, 'revokeObjectURL', {
    value: vi.fn(),
    writable: true
  })
})

describe('download.ts', () => {

  // ==================== parseFilenameFromContentDisposition ====================
  describe('parseFilenameFromContentDisposition', () => {
    it('空/undefined header 返回空字符串', () => {
      expect(parseFilenameFromContentDisposition(null)).toBe('')
      expect(parseFilenameFromContentDisposition(undefined)).toBe('')
      expect(parseFilenameFromContentDisposition('')).toBe('')
    })

    it("RFC 5987 编码 (filename*=UTF-8'')", () => {
      const header = "attachment; filename*=UTF-8''%E6%B5%8B%E8%AF%95.xlsx"
      expect(parseFilenameFromContentDisposition(header)).toBe('测试.xlsx')
    })

    it("RFC 5987 编码 (filename*=utf-8'')", () => {
      const header = "attachment; filename*=utf-8''hello%20world.txt"
      expect(parseFilenameFromContentDisposition(header)).toBe('hello world.txt')
    })

    it('引号包裹的 filename="xxx"', () => {
      const header = 'attachment; filename="report_2024.pdf"'
      expect(parseFilenameFromContentDisposition(header)).toBe('report_2024.pdf')
    })

    it('纯文本 filename=xxx（无引号）', () => {
      const header = 'attachment; filename=data.csv'
      expect(parseFilenameFromContentDisposition(header)).toBe('data.csv')
    })

    it('非法编码不抛错', () => {
      const header = "attachment; filename*=UTF-8''%E6"
      const result = parseFilenameFromContentDisposition(header)
      expect(typeof result).toBe('string')
    })
  })

  // ==================== downloadBlob ====================
  describe('downloadBlob', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('创建下载链接并触发点击', () => {
      const clickSpy = vi.fn()
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue({
        href: '', download: '', click: clickSpy
      } as unknown as HTMLAnchorElement)

      downloadBlob(new Blob(['test']), 'test.txt')

      expect(createElementSpy).toHaveBeenCalledWith('a')
      expect(clickSpy).toHaveBeenCalled()
      createElementSpy.mockRestore()
    })

    it('调用 URL.createObjectURL 和 revokeObjectURL', () => {
      downloadBlob(new Blob(['data']), 'file.csv')
      expect(URL.createObjectURL).toHaveBeenCalled()
      expect(URL.revokeObjectURL).toHaveBeenCalled()
    })
  })

  // ==================== downloadResponseBlob ====================
  describe('downloadResponseBlob', () => {
    it('使用 headers.get 获取 disposition', () => {
      let anchorDownload = ''
      const clickSpy = vi.fn()
      vi.spyOn(document, 'createElement').mockReturnValue({
        href: '',
        get download() { return anchorDownload },
        set download(v: string) { anchorDownload = v },
        click: clickSpy
      } as unknown as HTMLAnchorElement)

      downloadResponseBlob({
        data: new Blob(['content']),
        headers: {
          get: (name: string) =>
            name === 'content-disposition' ? 'attachment; filename="download.zip"' : null
        }
      }, 'fallback.zip')

      expect(anchorDownload).toBe('download.zip')
    })

    it('使用 headers 对象属性获取 disposition', () => {
      let anchorDownload = ''
      const clickSpy = vi.fn()
      vi.spyOn(document, 'createElement').mockReturnValue({
        href: '',
        get download() { return anchorDownload },
        set download(v: string) { anchorDownload = v },
        click: clickSpy
      } as unknown as HTMLAnchorElement)

      downloadResponseBlob({
        data: new Blob(['x']),
        headers: { 'content-disposition': 'attachment; filename=prop.pdf' }
      }, 'fallback.pdf')

      expect(anchorDownload).toBe('prop.pdf')
    })

    it('无 disposition 使用 fallback 文件名', () => {
      let anchorDownload = ''
      const clickSpy = vi.fn()
      vi.spyOn(document, 'createElement').mockReturnValue({
        href: '',
        get download() { return anchorDownload },
        set download(v: string) { anchorDownload = v },
        click: clickSpy
      } as unknown as HTMLAnchorElement)

      downloadResponseBlob({
        data: new Blob(['content']),
        headers: {}
      }, 'fallback.csv')

      expect(anchorDownload).toBe('fallback.csv')
    })
  })
})
