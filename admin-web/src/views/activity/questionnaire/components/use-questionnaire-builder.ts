import type { Translate } from '@/types/i18n'
import type {
  DesignerField,
  DesignerFieldKnown,
  DesignerFieldRaw,
  DesignerOption
} from '@/types/modules/activity-questionnaire'
import type { UniFormConfig } from 'uni-ui-lib'
import { useUniI18n } from 'uni-ui-lib'
import { computed, onUnmounted, ref, watch } from 'vue'
import {
  builderAddOptionRow,
  buildKnownFieldPreview,
  cloneKnown,
  effectiveKnown,
  presetField,
  previewSlice,
  rawType,
  rowBadge,
  type PaletteType
} from './questionnaire-builder-utils'

export type QuestionnaireBuilderProps = {
  modelValue: DesignerField[]
  readonly?: boolean
}

export type QuestionnaireBuilderEmit = {
  (e: 'update:modelValue', value: DesignerField[]): void
}

const DEB_MS = 160

/** 问卷设计器：列表排序、选中、草稿防抖同步 */
export function useQuestionnaireBuilder(
  props: QuestionnaireBuilderProps,
  emit: QuestionnaireBuilderEmit
) {
  const { t } = useUniI18n()
  const tr = t as Translate

  const qbSideFormConfig = computed<UniFormConfig>(() => ({
    formProps: { labelPosition: 'top' },
    colProps: { span: 24 },
    schema: [
      {
        field: 'label',
        label: t('activity.qbFieldLabel'),
        component: 'ElInput',
        componentProps: {
          type: 'textarea',
          autosize: { minRows: 3, maxRows: 10 },
          maxlength: 255,
          showWordLimit: true
        }
      },
      {
        field: '_qbEditor',
        label: '',
        component: 'ElInput',
        componentProps: { style: { display: 'none' } }
      }
    ]
  }))

  const selFontId = ref<string | null>(null)
  const draft = ref<DesignerFieldKnown | null>(null)
  const syncingDraft = ref(false)
  let debTimer: ReturnType<typeof setTimeout> | null = null

  const sel = computed(() => props.modelValue.find((r) => r.fontId === selFontId.value) ?? null)

  const selectedOrdinal = computed(() => {
    if (!selFontId.value) {
      return 0
    }
    const i = props.modelValue.findIndex((r) => r.fontId === selFontId.value)
    return i >= 0 ? i + 1 : 0
  })

  const orderedFields = computed({
    get: () => props.modelValue,
    set: (v: DesignerField[]) => emit('update:modelValue', v)
  })

  watch(
    () => [props.readonly, props.modelValue.length] as const,
    () => {
      if (props.readonly) {
        if (debTimer) {
          clearTimeout(debTimer)
          debTimer = null
        }
        selFontId.value = null
        draft.value = null
        return
      }
      if (props.modelValue.length && selFontId.value == null) {
        selFontId.value = props.modelValue[0].fontId
      }
      if (selFontId.value && !props.modelValue.some((r) => r.fontId === selFontId.value)) {
        selFontId.value = props.modelValue[0]?.fontId ?? null
      }
    },
    { immediate: true }
  )

  function ensureOpts(): void {
    const d = draft.value
    if (!d || (d.type !== 'radio' && d.type !== 'checkbox' && d.type !== 'select')) {
      return
    }
    if (!Array.isArray(d.properties.option)) {
      d.properties.option = []
    }
  }

  function flushDraftFor(fontId: string | null): void {
    const d = draft.value
    if (!fontId || !d || d.fontId !== fontId) {
      return
    }
    if (d.type === 'datetimepicker') {
      syncDt()
    }
    const i = props.modelValue.findIndex((r) => r.fontId === d.fontId)
    if (i < 0) {
      return
    }
    const next = cloneKnown(d)
    const cur = props.modelValue[i]
    if (JSON.stringify(cur) === JSON.stringify(next)) {
      return
    }
    const copy = [...props.modelValue]
    copy[i] = next
    emit('update:modelValue', copy)
  }

  function flushDraftPending(): void {
    flushDraftFor(selFontId.value)
  }

  function scheduleFlush(): void {
    if (syncingDraft.value) {
      return
    }
    if (debTimer) {
      clearTimeout(debTimer)
    }
    debTimer = setTimeout(() => {
      debTimer = null
      flushDraftPending()
    }, DEB_MS)
  }

  function mergeKnownIntoList(ix: number, nextKnown: DesignerFieldKnown): void {
    const copy = [...props.modelValue]
    copy[ix] = nextKnown
    emit('update:modelValue', copy)
  }

  function setHeaderRequired(fontId: string, val: boolean | string | number): void {
    const on = val === true
    const i = props.modelValue.findIndex((r) => r.fontId === fontId)
    if (i < 0) return
    const row = props.modelValue[i]
    if (row.kind !== 'known') return
    if (draft.value?.fontId === fontId) {
      draft.value.required = on
      scheduleFlush()
      return
    }
    const nextKnown = cloneKnown(row)
    nextKnown.required = on
    mergeKnownIntoList(i, nextKnown)
  }

  function setHeaderHide(fontId: string, val: boolean | string | number): void {
    const on = val === true
    const i = props.modelValue.findIndex((r) => r.fontId === fontId)
    if (i < 0) return
    const row = props.modelValue[i]
    if (row.kind !== 'known') return
    if (draft.value?.fontId === fontId) {
      draft.value.isHide = on
      scheduleFlush()
      return
    }
    const nextKnown = cloneKnown(row)
    nextKnown.isHide = on
    mergeKnownIntoList(i, nextKnown)
  }

  function knownHeaderProp(fontId: string): { required: boolean; isHide: boolean } {
    if (draft.value?.fontId === fontId) {
      return { required: !!draft.value.required, isHide: !!draft.value.isHide }
    }
    const row = props.modelValue.find((r) => r.fontId === fontId && r.kind === 'known') as
      | DesignerFieldKnown
      | undefined
    if (!row) return { required: false, isHide: false }
    return { required: !!row.required, isHide: !!row.isHide }
  }

  function onRowClick(fontId: string): void {
    if (props.readonly) {
      return
    }
    selectRow(fontId)
  }

  function selectRow(fontId: string): void {
    if (props.readonly) {
      return
    }
    if (debTimer) {
      clearTimeout(debTimer)
      debTimer = null
    }
    selFontId.value = fontId
  }

  watch(
    selFontId,
    (n, o) => {
      if (debTimer) {
        clearTimeout(debTimer)
        debTimer = null
      }
      if (o != null && o !== n) {
        flushDraftFor(o)
      }
      syncingDraft.value = true
      try {
        if (n == null) {
          draft.value = null
          return
        }
        const cur = props.modelValue.find((r) => r.fontId === n) ?? null
        if (cur?.kind !== 'known') {
          draft.value = null
          return
        }
        draft.value = cloneKnown(cur)
        ensureOpts()
      } finally {
        syncingDraft.value = false
      }
    },
    { immediate: true }
  )

  watch(
    draft,
    () => {
      scheduleFlush()
    },
    { deep: true }
  )

  onUnmounted(() => {
    if (debTimer) {
      clearTimeout(debTimer)
    }
  })

  const opts = computed({
    get(): DesignerOption[] {
      ensureOpts()
      return draft.value?.properties.option ?? []
    },
    set(v: DesignerOption[]) {
      if (draft.value) {
        draft.value.properties.option = v
      }
    }
  })

  const selMultiToggle = computed({
    get() {
      const d = draft.value
      if (!d || d.type !== 'select') {
        return false
      }
      return d.properties.option_multi === true || d.properties.option_multi === 'true'
    },
    set(v: boolean) {
      if (!draft.value || draft.value.type !== 'select') {
        return
      }
      draft.value.properties.option_multi = v
      draft.value.properties.option_default = v ? ([] as number[]) : ''
    }
  })

  const useSingleDefaultPicker = computed(() => {
    const d = draft.value
    if (!d) return false
    if (d.type === 'radio') return true
    if (d.type === 'select') return !selMultiToggle.value
    return false
  })

  const useMultiDefaultPicker = computed(() => {
    const d = draft.value
    if (!d) return false
    if (d.type === 'checkbox') return true
    if (d.type === 'select') return selMultiToggle.value
    return false
  })

  function multiDefaultHas(id: number): boolean {
    return multiDefaultNum.value.includes(id)
  }

  function onMultiDefaultChange(id: number, checked: unknown): void {
    if (!draft.value) return
    const on = checked === true
    const next = new Set(multiDefaultNum.value)
    if (on) next.add(id)
    else next.delete(id)
    draft.value.properties.option_default = Array.from(next)
  }

  const radioDefault = computed({
    get() {
      return String(draft.value?.properties.option_default ?? '')
    },
    set(v: string) {
      if (!draft.value) {
        return
      }
      draft.value.properties.option_default = v
    }
  })

  const multiDefaultNum = computed({
    get() {
      const d = draft.value?.properties.option_default
      return Array.isArray(d) ? d.map((x) => Number(x)) : []
    },
    set(v: number[]) {
      if (!draft.value) {
        return
      }
      draft.value.properties.option_default = v
    }
  })

  function syncDt(): void {
    const d = draft.value
    if (!d || d.type !== 'datetimepicker') {
      return
    }
    d.properties.datetime_type = d.datetimeTypeKey ?? 'date'
  }

  function add(bt: PaletteType): void {
    if (props.readonly) {
      return
    }
    const row = presetField(bt)
    emit('update:modelValue', [...props.modelValue, row])
    selFontId.value = row.fontId
  }

  function remove(ix: number): void {
    if (props.readonly) {
      return
    }
    const fid = props.modelValue[ix]?.fontId
    if (debTimer) {
      clearTimeout(debTimer)
      debTimer = null
    }
    if (fid != null && selFontId.value === fid) {
      flushDraftFor(fid)
    }
    const list = [...props.modelValue]
    list.splice(ix, 1)
    emit('update:modelValue', list)
    selFontId.value =
      fid != null && selFontId.value === fid
        ? (list[0]?.fontId ?? null)
        : list.some((r) => r.fontId === selFontId.value)
          ? selFontId.value
          : (list[0]?.fontId ?? null)
  }

  function addOptionRow(): void {
    if (props.readonly) {
      return
    }
    const d = draft.value
    if (!d || (d.type !== 'radio' && d.type !== 'checkbox' && d.type !== 'select')) {
      return
    }
    Object.assign(d, builderAddOptionRow(d))
  }

  function rmOption(oi: number): void {
    if (props.readonly) {
      return
    }
    ensureOpts()
    const list = [...opts.value]
    const removed = list[oi]
    if (removed == null || !draft.value) {
      return
    }
    const removedId = Number(removed.id)
    list.splice(oi, 1)
    if (!list.length) {
      return
    }
    opts.value = list
    const d = draft.value
    if (d.type === 'radio' || (d.type === 'select' && !selMultiToggle.value)) {
      const ids = new Set(list.map((o) => String(o.id)))
      const cur = String(d.properties.option_default ?? '')
      if (!ids.has(cur)) {
        d.properties.option_default = String(list[0].id)
      }
    } else if (d.type === 'checkbox' || (d.type === 'select' && selMultiToggle.value)) {
      const raw = d.properties.option_default
      const cur = (Array.isArray(raw) ? raw : [])
        .map((x) => Number(x))
        .filter((x) => x !== removedId)
      d.properties.option_default = cur
    }
  }

  return {
    t,
    qbSideFormConfig,
    selFontId,
    sel,
    selectedOrdinal,
    orderedFields,
    draft,
    rowBadge: (row: DesignerField) => rowBadge(row, tr),
    rawType,
    effectiveKnown: (row: DesignerField) => effectiveKnown(row, draft.value),
    previewSlice: (row: DesignerField) => previewSlice(row, draft.value),
    fieldPreview: buildKnownFieldPreview,
    onRowClick,
    add,
    remove,
    knownHeaderProp,
    setHeaderRequired,
    setHeaderHide,
    selMultiToggle,
    opts,
    useSingleDefaultPicker,
    useMultiDefaultPicker,
    radioDefault,
    multiDefaultNum,
    multiDefaultHas,
    onMultiDefaultChange,
    syncDt,
    addOptionRow,
    rmOption
  }
}

export type QuestionnaireBuilderContext = ReturnType<typeof useQuestionnaireBuilder>
