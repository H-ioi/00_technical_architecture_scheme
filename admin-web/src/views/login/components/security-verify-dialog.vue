<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Close, RefreshRight, Right } from '@element-plus/icons-vue'

import { captchaApi } from '@/api'
import type { CaptchaImageData } from '@/api'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  success: [captchaVerification: string]
}>()

const imageWidth = 330
const imageHeight = 155
const blockSize = 48
const trackRef = ref<HTMLElement>()
const captcha = ref<CaptchaImageData | null>(null)
const loading = ref(false)
const checking = ref(false)
const dragging = ref(false)
const verified = ref(false)
const dragLeft = ref(0)
const startX = ref(0)
const startLeft = ref(0)
const tip = ref('')

const maxLeft = computed(() => Math.max(0, imageWidth - blockSize))
const backgroundImage = computed(() =>
  captcha.value?.originalImageBase64
    ? `url(data:image/png;base64,${captcha.value.originalImageBase64})`
    : 'none'
)
const blockImage = computed(() =>
  captcha.value?.jigsawImageBase64
    ? `url(data:image/png;base64,${captcha.value.jigsawImageBase64})`
    : 'none'
)
const progressWidth = computed(() => `${dragLeft.value + blockSize / 2}px`)

const resetDrag = () => {
  dragLeft.value = 0
  verified.value = false
  tip.value = ''
}

const refresh = async () => {
  loading.value = true
  resetDrag()

  try {
    captcha.value = await captchaApi.image.get()
  } finally {
    loading.value = false
  }
}

const close = () => {
  emit('update:visible', false)
}

const resolvePointX = () => (dragLeft.value * 310) / imageWidth

const verify = async () => {
  if (!captcha.value || checking.value) {
    return
  }

  checking.value = true

  try {
    const point = { x: resolvePointX(), y: 5.0 }
    const pointJson = captchaApi.encrypt.run(JSON.stringify(point), captcha.value.secretKey)

    await captchaApi.check.post({
      pointJson,
      token: captcha.value.token
    })

    verified.value = true
    tip.value = '验证通过'
    const captchaVerification = captchaApi.encrypt.run(
      `${captcha.value.token}---${JSON.stringify(point)}`,
      captcha.value.secretKey
    )

    window.setTimeout(() => {
      emit('success', captchaVerification)
      close()
    }, 300)
  } catch (error) {
    tip.value = error instanceof Error ? error.message : '验证失败'
    ElMessage.warning(tip.value)
    window.setTimeout(() => {
      refresh()
    }, 600)
  } finally {
    checking.value = false
  }
}

const moveTo = (clientX: number) => {
  const delta = clientX - startX.value
  const nextLeft = Math.min(maxLeft.value, Math.max(0, startLeft.value + delta))

  dragLeft.value = nextLeft
}

const stopDrag = () => {
  if (!dragging.value) {
    return
  }

  dragging.value = false
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('touchend', stopDrag)
  verify()
}

const startDrag = (clientX: number) => {
  if (!captcha.value || loading.value || checking.value || verified.value) {
    return
  }

  dragging.value = true
  startX.value = clientX
  startLeft.value = dragLeft.value
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', handleTouchMove, { passive: false })
  window.addEventListener('touchend', stopDrag)
}

function handleMouseMove(event: MouseEvent) {
  moveTo(event.clientX)
}

function handleTouchMove(event: TouchEvent) {
  event.preventDefault()
  moveTo(event.touches[0]?.clientX ?? startX.value)
}

watch(
  () => props.visible,
  async (visible) => {
    if (!visible) {
      resetDrag()
      return
    }

    await nextTick()
    await refresh()
  }
)
</script>

<template>
  <el-dialog
    :model-value="visible"
    width="390px"
    class="security-verify"
    :show-close="false"
    destroy-on-close
    append-to-body
    @update:model-value="emit('update:visible', $event)"
  >
    <template #header>
      <div class="security-verify__header">
        <div>
          <h3>安全验证</h3>
          <p>拖动滑块完成验证后继续登录</p>
        </div>
        <el-button text circle :icon="Close" @click="close" />
      </div>
    </template>

    <div v-loading="loading" class="security-verify__body">
      <div
        class="security-verify__image"
        :style="{ width: `${imageWidth}px`, height: `${imageHeight}px`, backgroundImage }"
      >
        <button class="security-verify__refresh" type="button" @click="refresh">
          <el-icon><RefreshRight /></el-icon>
        </button>
        <div
          class="security-verify__block"
          :class="{ 'is-dragging': dragging }"
          :style="{
            width: `${blockSize}px`,
            height: `${imageHeight}px`,
            transform: `translateX(${dragLeft}px)`,
            backgroundImage: blockImage
          }"
        />
        <div v-if="tip" class="security-verify__tip" :class="{ 'is-success': verified }">
          {{ tip }}
        </div>
      </div>

      <div ref="trackRef" class="security-verify__track">
        <div class="security-verify__progress" :style="{ width: progressWidth }" />
        <span>{{ verified ? '验证通过' : '向右拖动滑块' }}</span>
        <button
          class="security-verify__handle"
          type="button"
          :class="{ 'is-dragging': dragging, 'is-success': verified }"
          :style="{ transform: `translateX(${dragLeft}px)` }"
          @mousedown="startDrag($event.clientX)"
          @touchstart.prevent="startDrag($event.touches[0]?.clientX ?? 0)"
        >
          <el-icon><Right /></el-icon>
        </button>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.security-verify {
  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    h3 {
      margin: 0 0 4px;
      font-size: 18px;
    }

    p {
      margin: 0;
      color: var(--app-text-color-secondary);
      font-size: 13px;
    }
  }

  &__body {
    display: grid;
    justify-content: center;
    gap: 16px;
  }

  &__image {
    position: relative;
    overflow: hidden;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border-radius: 12px;
  }

  &__refresh {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 2;
    display: grid;
    width: 30px;
    height: 30px;
    color: #fff;
    cursor: pointer;
    background: rgb(15 23 42 / 45%);
    border: 0;
    border-radius: 999px;
    place-items: center;
  }

  &__block {
    position: absolute;
    top: 0;
    left: 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    transition: transform 0.12s ease;

    &.is-dragging {
      transition: none;
    }
  }

  &__tip {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 8px 12px;
    color: #fff;
    background: rgb(220 38 38 / 80%);

    &.is-success {
      background: rgb(22 163 74 / 85%);
    }
  }

  &__track {
    position: relative;
    display: grid;
    width: 330px;
    height: 42px;
    overflow: hidden;
    color: var(--app-text-color-secondary);
    font-size: 14px;
    background: #f1f5f9;
    border: 1px solid #dbe3ef;
    border-radius: 999px;
    place-items: center;
  }

  &__progress {
    position: absolute;
    inset: 0 auto 0 0;
    background: linear-gradient(90deg, #b7dbff, #6bb7f7);
  }

  &__handle {
    position: absolute;
    top: 3px;
    left: 3px;
    z-index: 2;
    display: grid;
    width: 36px;
    height: 36px;
    color: #3b82f6;
    cursor: grab;
    background: #fff;
    border: 0;
    border-radius: 999px;
    box-shadow: 0 6px 16px rgb(15 23 42 / 18%);
    place-items: center;
    transition: transform 0.12s ease;

    &.is-dragging {
      cursor: grabbing;
      transition: none;
    }

    &.is-success {
      color: #16a34a;
    }
  }
}
</style>
