import { ref } from 'vue'

/**
 * 编辑/查看弹窗：详情接口未返回前在表单区域展示 loading，避免空白或半截表单。
 */
export function useDialogDetailLoading() {
  const detailLoading = ref(false)

  const runWithDetailLoading = async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
    detailLoading.value = true
    try {
      return await fn()
    } finally {
      detailLoading.value = false
    }
  }

  return { detailLoading, runWithDetailLoading }
}
