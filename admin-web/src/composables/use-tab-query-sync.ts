import type { LocationQueryRaw } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import { watch, type Ref } from 'vue'

/**
 * 将 el-tabs 的 activeTab 与 URL query（默认 `tab`）双向同步，便于刷新恢复与分享。
 */
export function useTabQuerySync<T extends string>(
  activeTab: Ref<T>,
  validTabs: readonly T[],
  options?: { queryKey?: string }
): void {
  const queryKey = options?.queryKey ?? 'tab'
  const route = useRoute()
  const router = useRouter()

  const parseTab = (query: LocationQueryRaw): T | null => {
    const raw = query[queryKey]
    const v = Array.isArray(raw) ? raw[0] : raw
    if (typeof v !== 'string') {
      return null
    }
    return (validTabs as readonly string[]).includes(v) ? (v as T) : null
  }

  const fromUrl = parseTab(route.query as LocationQueryRaw)
  if (fromUrl) {
    activeTab.value = fromUrl
  }

  watch(
    () => route.query[queryKey],
    () => {
      const next = parseTab(route.query as LocationQueryRaw)
      if (next != null && next !== activeTab.value) {
        activeTab.value = next
      }
    }
  )

  watch(activeTab, (tab) => {
    if (parseTab(route.query as LocationQueryRaw) === tab) {
      return
    }
    void router.replace({
      query: { ...route.query, [queryKey]: tab } as LocationQueryRaw
    })
  })
}
