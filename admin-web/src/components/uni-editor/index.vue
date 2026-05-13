<template>
  <div ref="containerRef" class="uni-editor__root" :style="{ height: cssHeight }" />
</template>

<script setup lang="ts">
import 'aieditor/dist/style.css'

import { AiEditor, type AiEditorOptions, type AiGlobalConfig, type SparkAiModelConfig } from 'aieditor'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'

import { protocolApi } from '@/api'

const modelHtml = defineModel<string>({ default: '' })
const modelText = defineModel<string>('text', { default: '' })

const props = withDefaults(
  defineProps<{
    height?: string | number
    placeholder?: string
    /** 讯飞星火；不配齐 appId/apiKey/apiSecret 时不下发 ai 配置，且工具栏不展示「AI」 */
    sparkAi?: SparkAiModelConfig | null
    /** 完全自定义 AiEditor 全局 AI 配置；若传入则优先于 sparkAi（用于多模型扩展） */
    editorAi?: AiGlobalConfig | null
  }>(),
  {
    height: '300px',
    placeholder: '点击输入内容...',
    sparkAi: null,
    editorAi: null
  }
)

const containerRef = ref<HTMLDivElement | null>(null)
const editorInst = shallowRef<AiEditor | null>(null)
const syncingFromEditor = ref(false)

const cssHeight = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : String(props.height)
)

const toolbarKeys = computed(() => {
  const keys: AiEditorOptions['toolbarKeys'] = [
    'undo',
    'redo',
    '|',
    'heading',
    'font-family',
    'font-size',
    '|',
    'bold',
    'italic',
    'underline',
    'strike',
    'link',
    'code',
    'subscript',
    'superscript',
    'hr',
    'todo',
    'emoji',
    '|',
    'highlight',
    'font-color',
    '|',
    'align',
    'line-height',
    '|',
    'bullet-list',
    'ordered-list',
    'indent-decrease',
    'indent-increase',
    'break',
    '|',
    'image',
    '|',
    'fullscreen',
    ...(showAiToolbar.value ? (['ai'] as const) : [])
  ]

  return keys
})

const showAiToolbar = computed(() =>
  Boolean(
    props.editorAi ||
      (props.sparkAi?.appId && props.sparkAi?.apiKey && props.sparkAi?.apiSecret)
  )
)

const resolveAiOptions = (): AiGlobalConfig | undefined => {
  if (props.editorAi) {
    return props.editorAi
  }
  const s = props.sparkAi
  if (s?.appId && s.apiKey && s.apiSecret) {
    return {
      models: {
        spark: {
          ...s,
          version: s.version ?? 'v3.5'
        }
      }
    }
  }
  return undefined
}

const emitChange = async (ed: AiEditor) => {
  syncingFromEditor.value = true
  modelHtml.value = ed.getHtml()
  modelText.value = ed.getText()
  await nextTick()
  syncingFromEditor.value = false
}

/** 对接协议模块上传接口，返回 AiEditor 常用结构 */
const imageUploader: NonNullable<NonNullable<AiEditorOptions['image']>['uploader']> = async (
  file
) => {
  try {
    const url = await protocolApi.upload.post(file)
    if (!url || typeof url !== 'string') {
      throw new Error('empty upload url')
    }
    return {
      errorCode: 0,
      data: {
        src: url,
        alt: file.name
      }
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'upload failed'
    return Promise.reject(new Error(message))
  }
}

function destroyEditor() {
  editorInst.value?.destroy?.()
  editorInst.value = null
}

function createEditor() {
  const el = containerRef.value
  if (!el) {
    return
  }

  destroyEditor()

  const aiOpt = resolveAiOptions()
  const options: AiEditorOptions = {
    element: el,
    content: modelHtml.value ?? '',
    placeholder: props.placeholder,
    toolbarKeys: toolbarKeys.value,
    onChange: async (ed) => {
      await emitChange(ed)
    },
    image: {
      uploadFormName: 'file',
      uploader: imageUploader
    },
    ...(aiOpt ? { ai: aiOpt } : {})
  }

  editorInst.value = new AiEditor(options)
}

watch(
  () => modelHtml.value,
  async (next) => {
    const ed = editorInst.value
    if (!ed || ed.isDestroyed() || syncingFromEditor.value) {
      return
    }
    const cur = ed.getHtml()
    if ((next ?? '') !== cur) {
      ed.setContent(next ?? '', false)
    }
  }
)

watch(
  [
    () => props.editorAi,
    () => props.sparkAi?.appId,
    () => props.sparkAi?.apiKey,
    () => props.sparkAi?.apiSecret,
    () => props.sparkAi?.version
  ],
  () => {
    if (!editorInst.value) {
      return
    }
    void nextTick(() => createEditor())
  }
)

watch(
  () => props.placeholder,
  () => {
    createEditor()
  }
)

onMounted(async () => {
  await nextTick()
  createEditor()
})

onBeforeUnmount(() => {
  destroyEditor()
})

defineExpose({
  /** 编辑器实例（可能为 null） */
  getAiEditor: () => editorInst.value,
  focus: async () => {
    await nextTick()
    editorInst.value?.focus()
  },
  blur: () => editorInst.value?.blur()
})
</script>

<style scoped lang="scss">
.uni-editor__root {
  width: 100%;
  overflow: hidden;
  border-radius: var(--el-border-radius-base);
  border: 1px solid var(--el-border-color);
  background-color: var(--el-bg-color);
}

.uni-editor__root :deep(> div) {
  height: 100%;
}
</style>
