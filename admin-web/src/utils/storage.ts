export const storage = {
  get<T = string>(key: string): T | null {
    const rawValue = window.localStorage.getItem(key)

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

    window.localStorage.setItem(key, nextValue)
  },

  remove(key: string): void {
    window.localStorage.removeItem(key)
  },

  clear(): void {
    window.localStorage.clear()
  }
}
