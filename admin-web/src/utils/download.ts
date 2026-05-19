export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export const parseFilenameFromContentDisposition = (header?: string | null) => {
  if (!header) return ''

  const encoded = /filename\*=(?:UTF-8''|utf-8'')([^;\n]+)/i.exec(header)
  if (encoded?.[1]) {
    const raw = encoded[1].trim().replace(/^["']|["']$/g, '')
    try {
      return decodeURIComponent(raw)
    } catch {
      return raw
    }
  }

  const quoted = /filename\s*=\s*"((?:\\.|[^"\\])*)"/i.exec(header)
  if (quoted?.[1]) {
    return quoted[1].replace(/\\(.)/g, '$1')
  }

  const plain = /filename\s*=\s*([^;\n]+)/i.exec(header)
  if (plain?.[1]) {
    const raw = plain[1].trim().replace(/^["']|["']$/g, '')
    try {
      return decodeURIComponent(raw)
    } catch {
      return raw
    }
  }

  return ''
}

export const downloadResponseBlob = (
  response: { data: Blob; headers?: unknown },
  fallbackFilename: string
) => {
  let disposition = ''
  const headers = response.headers
  if (headers && typeof headers === 'object') {
    const h = headers as Record<string, unknown> & { get?: (name: string) => unknown }
    const value =
      h.get?.('content-disposition') ??
      h['content-disposition'] ??
      h['Content-Disposition']
    disposition = typeof value === 'string' ? value : ''
  }
  const filename =
    parseFilenameFromContentDisposition(disposition) || fallbackFilename
  downloadBlob(response.data, filename)
}
