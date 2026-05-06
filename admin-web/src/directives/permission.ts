import type { Directive } from 'vue'

import { usePermissionStore } from '@/stores'

const updatePermissionVisible = (el: HTMLElement, permission?: string | string[]) => {
  const permissionStore = usePermissionStore()

  el.hidden = !permissionStore.hasPermission(permission)
}

export const permissionDirective: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    updatePermissionVisible(el, binding.value)
  },
  updated(el, binding) {
    updatePermissionVisible(el, binding.value)
  }
}
