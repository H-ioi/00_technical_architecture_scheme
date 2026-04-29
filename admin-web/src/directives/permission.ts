import type { Directive } from 'vue'

import { usePermissionStore } from '@/stores'

export const permissionDirective: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    const permissionStore = usePermissionStore()

    if (!permissionStore.hasPermission(binding.value)) {
      el.parentNode?.removeChild(el)
    }
  }
}
