<template>
  <el-dialog
    v-model="visible"
    :title="$t('schoolDoctor.medicalInfo.signDialogTitle')"
    width="720px"
    append-to-body
    :close-on-click-modal="false"
    @opened="initCanvas"
    @closed="clearCanvas"
  >
    <p class="signature-dialog__tip">{{ $t('schoolDoctor.medicalInfo.signDialogTip') }}</p>
    <div ref="canvasWrapRef" class="signature-dialog__canvas-wrap">
      <canvas
        ref="canvasRef"
        @mousedown="startDraw"
        @mousemove="draw"
        @mouseup="endDraw"
        @mouseleave="endDraw"
        @touchstart.prevent="startTouch"
        @touchmove.prevent="moveTouch"
        @touchend.prevent="endDraw"
      />
    </div>
    <template #footer>
      <el-button @click="visible = false">{{ $t('schoolDoctor.common.cancel') }}</el-button>
      <el-button @click="clearCanvas">{{ $t('schoolDoctor.medicalInfo.clearSignature') }}</el-button>
      <el-button type="primary" :loading="uploading" @click="saveSignature">
        {{ $t('schoolDoctor.common.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useUniI18n } from 'uni-ui-lib'
import { ref } from 'vue'

import { medicalInfoApi } from '@/api'

const emit = defineEmits<{
  confirm: [url: string]
}>()

const { t } = useUniI18n()
const visible = ref(false)
const uploading = ref(false)
const canvasWrapRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let drawing = false
let hasStroke = false
let ctx: CanvasRenderingContext2D | null = null

function initCanvas() {
  const wrap = canvasWrapRef.value
  const canvas = canvasRef.value
  if (!wrap || !canvas) {
    return
  }
  const ratio = Math.max(window.devicePixelRatio || 1, 1)
  const width = wrap.clientWidth
  const height = wrap.clientHeight
  canvas.width = width * ratio
  canvas.height = height * ratio
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }
  ctx.scale(ratio, ratio)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.lineWidth = 2
  ctx.strokeStyle = '#303133'
  clearCanvas()
}

function pointerPos(event: MouseEvent | Touch) {
  const canvas = canvasRef.value
  if (!canvas) {
    return { x: 0, y: 0 }
  }
  const rect = canvas.getBoundingClientRect()
  return { x: event.clientX - rect.left, y: event.clientY - rect.top }
}

function startDraw(event: MouseEvent) {
  if (!ctx) {
    return
  }
  drawing = true
  const { x, y } = pointerPos(event)
  ctx.beginPath()
  ctx.moveTo(x, y)
}

function draw(event: MouseEvent) {
  if (!drawing || !ctx) {
    return
  }
  const { x, y } = pointerPos(event)
  ctx.lineTo(x, y)
  ctx.stroke()
  hasStroke = true
}

function startTouch(event: TouchEvent) {
  const touch = event.touches[0]
  if (!touch) {
    return
  }
  startDraw(touch as unknown as MouseEvent)
}

function moveTouch(event: TouchEvent) {
  const touch = event.touches[0]
  if (!touch) {
    return
  }
  draw(touch as unknown as MouseEvent)
}

function endDraw() {
  drawing = false
}

function clearCanvas() {
  const canvas = canvasRef.value
  if (!canvas || !ctx) {
    hasStroke = false
    return
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  hasStroke = false
}

async function saveSignature() {
  if (!hasStroke || !canvasRef.value) {
    ElMessage.warning(t('schoolDoctor.medicalInfo.signRequired'))
    return
  }
  uploading.value = true
  try {
    const dataUrl = canvasRef.value.toDataURL('image/png')
    const blob = await (await fetch(dataUrl)).blob()
    const file = new File([blob], 'parent-signature.png', { type: 'image/png' })
    const url = await medicalInfoApi.uploadAttachment.post(file)
    emit('confirm', url || dataUrl)
    ElMessage.success(t('schoolDoctor.common.uploadSuccess'))
    visible.value = false
  } catch {
    ElMessage.error(t('schoolDoctor.common.uploadFailed'))
  } finally {
    uploading.value = false
  }
}

function open() {
  visible.value = true
}

defineExpose({ open })
</script>

<style scoped lang="scss">
.signature-dialog__tip {
  margin-bottom: 12px;
  padding: 8px 12px;
  font-size: 13px;
  color: var(--el-color-warning);
  background: var(--el-color-warning-light-9);
  border-radius: 6px;
}

.signature-dialog__canvas-wrap {
  width: 100%;
  height: 280px;
  border: 1px dashed var(--el-border-color);
  border-radius: 8px;
  background: #fff;
  overflow: hidden;

  canvas {
    display: block;
    touch-action: none;
    cursor: crosshair;
  }
}
</style>
