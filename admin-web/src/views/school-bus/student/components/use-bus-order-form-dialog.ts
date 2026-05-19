import { ref, watch } from 'vue'

import type { BusOrderRecord } from '@/types/modules/school-bus-order'

export const useBusOrderFormDialog = () => {
  const formVisible = ref(false)
  const formMode = ref<'add' | 'edit'>('add')
  const editingOrderId = ref<string | number | null>(null)

  watch(formVisible, (v) => {
    if (!v) {
      editingOrderId.value = null
    }
  })

  const openFormAdd = () => {
    formMode.value = 'add'
    editingOrderId.value = null
    formVisible.value = true
  }

  const openFormEdit = (row: BusOrderRecord) => {
    formMode.value = 'edit'
    editingOrderId.value = row.id
    formVisible.value = true
  }

  return {
    editingOrderId,
    formMode,
    formVisible,
    openFormAdd,
    openFormEdit
  }
}
