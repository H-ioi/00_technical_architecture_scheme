import { STORAGE_PREFIX } from '@/config'

const resolveKey = (key: string): string => {
  const prefix = `${STORAGE_PREFIX}:`

  return key.startsWith(prefix) ? key : `${prefix}${key}`
}

export const storage = {
  key: resolveKey,

  get<T = string>(key: string): T | null {
    const rawValue = window.localStorage.getItem(resolveKey(key))

    if (!rawValue) {
      return null
    }

    try {
      return JSON.parse(rawValue) as T
    } catch {
      return rawValue as T
    }
  },

  set<T>(key: string, value: T): void {
    const nextValue = typeof value === 'string' ? value : JSON.stringify(value)

    window.localStorage.setItem(resolveKey(key), nextValue)
  },

  remove(key: string): void {
    window.localStorage.removeItem(resolveKey(key))
  },

  clear(): void {
    const prefix = `${STORAGE_PREFIX}:`

    Object.keys(window.localStorage).forEach((key) => {
      if (key.startsWith(prefix)) {
        window.localStorage.removeItem(key)
      }
    })
  }
}
