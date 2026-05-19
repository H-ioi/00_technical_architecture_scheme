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

const getHeader = (headers: unknown, key: string) => {
  if (!headers || typeof headers !== 'object') return ''
  const h = headers as Record<string, unknown> & { get?: (name: string) => unknown }
  const value = h.get?.(key) ?? h[key] ?? h[key.toLowerCase()] ?? h[key.toUpperCase()]
  return typeof value === 'string' ? value : ''
}

export const downloadResponseBlob = (
  response: { data: Blob; headers?: unknown },
  fallbackFilename: string
) => {
  const filename =
    parseFilenameFromContentDisposition(getHeader(response.headers, 'content-disposition')) ||
    fallbackFilename
  downloadBlob(response.data, filename)
}
